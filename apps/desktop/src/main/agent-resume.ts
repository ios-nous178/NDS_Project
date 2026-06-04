/**
 * v1 포인터 기반 resume 의 토대.
 *
 * 핵심 통찰: **대화 상태의 진짜 주인은 우리가 아니라 CLI** 다.
 *  - claude : `~/.claude/projects/<dashed-cwd>/<session-id>.jsonl` 에 전체 대화를 저장.
 *             `--session-id <uuid>` 로 시작 시 id 를 우리 sessionId 로 못 박을 수 있다 →
 *             우리 sessionId == claude 네이티브 id. resume = `claude --resume <id>`.
 *  - codex  : `~/.codex/sessions/Y/M/D/rollout-<ts>-<uuid>.jsonl` 에 저장. id 를 미리 못 박지
 *             못한다(자체 생성) → **사후 캡처**(spawn 후 cwd+시각으로 rollout 헤더에서 uuid).
 *             resume = `codex resume <id>` (서브커맨드).
 *
 * 따라서 우리 스냅샷은 대화를 재구성하지 않는다 — **네이티브 store 를 가리키는 포인터 +
 * 동일 컨텍스트로 재구동하는 레시피**다. 우리 transcript(.log/.jsonl)는 resume 시 UI 즉시
 * 표시용 캐시일 뿐(컨텍스트 출처 아님).
 *
 * 이 파일의 순수 함수(pickCodexRollout / claudeStoreFile / isResumable …)는 electron 의존이
 * 없어 `node --test` 로 단위 테스트한다(vitest 미사용 — vite 제거 방향과 모순).
 */
import { existsSync, readdirSync, readFileSync, statSync, type Dirent } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { AgentType } from "./agent-runner.js";

/** 스냅샷 스키마 버전. reader 가 이보다 높은 버전을 만나면 resume 거절 → read-only 폴백. */
export const SNAPSHOT_VERSION = 1;

/**
 * ChatSession 에 additive 로 얹히는 resume 레시피 + 포인터.
 * 전부 optional — 옛 세션은 모두 undefined → isResumable=false 로 자연 분류된다.
 */
export interface ResumeRecipe {
  /** CLI 가 자체 대화를 저장한 세션 id. claude: == sessionId / codex: 캡처한 uuid. */
  agentSessionId?: string;
  /** 네이티브 store 파일 절대경로. **존재여부 = resumable 게이트**(agent 무관 단일 기준). */
  agentSessionFile?: string;
  /** 재구동 시 "같은 컨텍스트"를 만들기 위한 실행 레시피. (cwd·agentType·transport 는 ChatSession 재사용) */
  recipe?: {
    /** --model 핀했다면. */
    model?: string;
    /** 앱 동봉 DS MCP 를 붙였나(claude --mcp-config / codex -c mcp_servers.*). 번들 부재 시 false. */
    mcpConfig: boolean;
    /** claude --append-system-prompt DS_SYSTEM_MANDATE 를 주입했나. codex 는 AGENTS.md 사용이라 false. */
    appendSystemPrompt: boolean;
  };
  /** 스키마 진화 대비. */
  snapshotVersion?: number;
  /** 만든 앱 버전(레시피 호환성 판단/디버깅용). */
  appVersion?: string;
}

// ── claude: cwd → 네이티브 store 파일 ──────────────────────────────────────────

/**
 * claude 가 프로젝트 폴더를 만드는 규칙: cwd 의 **비영숫자 문자를 모두 `-` 로** 치환.
 * 예) `/Users/a_b/Desktop/03_X/Y` → `-Users-a-b-Desktop-03-X-Y`
 * (검증: `/Users/nudge_133/Desktop/03_NudgeTest/NudgeEAPDesignSystem`
 *      → `-Users-nudge-133-Desktop-03-NudgeTest-NudgeEAPDesignSystem`)
 */
export function claudeProjectDir(cwd: string): string {
  return cwd.replace(/[^a-zA-Z0-9]/g, "-");
}

/** claude 세션의 네이티브 대화 파일 절대경로. */
export function claudeStoreFile(cwd: string, sessionId: string, home: string = homedir()): string {
  return join(home, ".claude", "projects", claudeProjectDir(cwd), `${sessionId}.jsonl`);
}

// ── codex: rollout 헤더에서 세션 id 사후 캡처 ──────────────────────────────────

/** rollout 첫 줄(session_meta)에서 파싱한 본질 식별자(시각 제외 — windowing 은 fs 생성시각으로). */
export interface CodexSessionMeta {
  id: string;
  cwd: string;
}

/**
 * windowing 까지 끝난 rollout 후보 = session_meta + fs 생성시각 + 파일경로.
 * spawn-window 비교는 `createdMs`(fs 생성시각, 실 epoch) 로 한다 — payload.timestamp 는
 * TZ skew 위험(로컬 naive / 잘못 붙은 Z)이 있어 windowing 에 쓰지 않는다.
 */
export interface CodexRolloutHeader extends CodexSessionMeta {
  /** spawn-window 비교용 실 epoch ms = fs birthtime(미지원 FS 면 mtime 폴백). TZ 불변. */
  createdMs: number;
  file: string;
}

/**
 * PURE: 후보 헤더들 중 **이 세션**의 것을 고른다.
 * 규칙 = cwd 일치 && (fs 생성시각 >= spawn시각 - tolerance) 중 **가장 이른** 것.
 * codex 는 spawn 직후 rollout 을 만드므로, spawn 이후 같은 cwd 의 첫 세션이 우리 것이다.
 * 시각은 fs 생성시각(createdMs)만 본다 — payload.timestamp 의 TZ skew 에 영향받지 않는다.
 */
export function pickCodexRollout(
  headers: CodexRolloutHeader[],
  cwd: string,
  spawnedAtMs: number,
  toleranceMs = 60_000,
): CodexRolloutHeader | null {
  const matches = headers
    .filter((h) => h.cwd === cwd && h.createdMs >= spawnedAtMs - toleranceMs)
    .sort((a, b) => a.createdMs - b.createdMs);
  return matches[0] ?? null;
}

/**
 * rollout 첫 줄(session_meta)에서 id+cwd 를 뽑는다. session_meta 아님/필수필드 누락이면 null.
 * 시각은 보지 않는다 — payload.timestamp 는 TZ skew 위험이라 windowing 에 안 쓰고(있어도 무시),
 * spawn-window 비교는 fs 생성시각(captureCodexSession 이 주입)으로 한다.
 */
export function parseCodexHeader(firstLine: string): CodexSessionMeta | null {
  try {
    const o = JSON.parse(firstLine) as {
      type?: string;
      payload?: { id?: unknown; cwd?: unknown };
    };
    const p = o.payload;
    if (o.type !== "session_meta" || !p) return null;
    if (typeof p.id !== "string" || typeof p.cwd !== "string") return null;
    return { id: p.id, cwd: p.cwd };
  } catch {
    return null;
  }
}

/** sessions 트리에서 *.jsonl 파일 경로를 모은다(year/month/day 중첩). */
function walkCodexRollouts(root: string): string[] {
  const out: string[] = [];
  const recur = (dir: string): void => {
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) recur(full);
      else if (e.isFile() && e.name.startsWith("rollout-") && e.name.endsWith(".jsonl")) {
        out.push(full);
      }
    }
  };
  recur(root);
  return out;
}

/**
 * codex 가 방금 만든 세션의 id 를 캡처한다. spawn 직후~짧은 지연 뒤 호출.
 * 비용 절감: **mtime 이 spawn 이후인 rollout 만** 첫 줄을 읽는다(보통 1건).
 * windowing(어느 게 우리 것인가)은 fs 생성시각(birthtime, 없으면 mtime)으로 한다 —
 * 헤더에선 id+cwd 만 쓰고 시각은 fs 가 진리라, payload.timestamp 의 TZ skew 에 영향받지 않는다.
 */
export function captureCodexSession(
  cwd: string,
  spawnedAtMs: number,
  opts: { home?: string; toleranceMs?: number } = {},
): { id: string; file: string } | null {
  const home = opts.home ?? homedir();
  const tol = opts.toleranceMs ?? 60_000;
  const root = join(home, ".codex", "sessions");
  if (!existsSync(root)) return null;
  const headers: CodexRolloutHeader[] = [];
  for (const file of walkCodexRollouts(root)) {
    let birthtimeMs: number;
    let mtimeMs: number;
    try {
      const st = statSync(file);
      birthtimeMs = st.birthtimeMs;
      mtimeMs = st.mtimeMs;
    } catch {
      continue;
    }
    if (mtimeMs < spawnedAtMs - tol) continue; // append 조차 없던 옛 파일은 우리 세션이 아님(저렴한 1차 컷)
    // windowing 기준 = fs 생성시각(실 epoch, TZ 불변). birthtime 미지원 FS(0)면 mtime 폴백.
    const createdMs = birthtimeMs > 0 ? birthtimeMs : mtimeMs;
    let firstLine: string;
    try {
      const raw = readFileSync(file, "utf8");
      const nl = raw.indexOf("\n");
      firstLine = nl === -1 ? raw : raw.slice(0, nl);
    } catch {
      continue;
    }
    const meta = parseCodexHeader(firstLine);
    if (meta) headers.push({ ...meta, createdMs, file });
  }
  const picked = pickCodexRollout(headers, cwd, spawnedAtMs, tol);
  return picked ? { id: picked.id, file: picked.file } : null;
}

// ── per-agent resume 계약 ──────────────────────────────────────────────────────

/** resume 재구동 시 CLI 에 넘길 인자(에이전트별 구조 차이 흡수). */
export function resumeArgsFor(agentType: AgentType, agentSessionId: string): string[] {
  switch (agentType) {
    case "claude":
      return ["--resume", agentSessionId]; // 플래그
    case "codex":
      return ["resume", agentSessionId]; // 서브커맨드
    default:
      return [];
  }
}

/** 시작 시 우리 sessionId 를 CLI 세션 id 로 못 박는 인자. 못 박는 에이전트는 [](=사후 캡처). */
export function setSessionIdArgsFor(agentType: AgentType, sessionId: string): string[] {
  return agentType === "claude" ? ["--session-id", sessionId] : [];
}

// ── resumable 게이트 ───────────────────────────────────────────────────────────

/** isResumable 이 보는 최소 형태(ChatSession 의 부분집합). */
export interface ResumeProbe {
  agentSessionFile?: string;
  cwd?: string;
  snapshotVersion?: number;
}

/**
 * "이어가기" 버튼 노출 조건. 네이티브 store 와 cwd 가 **지금도 디스크에 존재**해야 한다
 * (CLI 사용가능 여부는 호출부에서 별도 확인). 미래 스키마 버전이면 거절.
 * existsSync 는 테스트에서 주입 가능.
 */
export function isResumable(s: ResumeProbe, exists: (p: string) => boolean = existsSync): boolean {
  if (!s.agentSessionFile || !s.cwd) return false;
  if ((s.snapshotVersion ?? 0) > SNAPSHOT_VERSION) return false;
  return exists(s.agentSessionFile) && exists(s.cwd);
}
