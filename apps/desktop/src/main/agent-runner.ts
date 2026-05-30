import { existsSync } from "node:fs";
import { delimiter, join } from "node:path";
import { spawn as ptySpawn, type IPty } from "node-pty";
import type { WebContents } from "electron";
import { getAugmentedPath, getToolProcessEnv } from "@nudge-design/mockup-core";
import { logAppEvent } from "./events.js";
import { ensureBundledMcpConfig } from "./mcp-config.js";
import {
  appendTranscript,
  createSession,
  updateSessionStatus,
  type SessionStatus,
} from "./sessions.js";
import type { Surface } from "./intake.js";

/**
 * AgentRunner — 사용자 머신에 설치된 CLI 를 PTY 로 spawn 하는 어댑터 seam.
 *
 * claude / codex 가 같은 인터페이스(spawn → onData/onExit → 이벤트·트랜스크립트)에 드롭인된다.
 * 공유 seam 은 UI 가 아니라 여기(spawn + 이벤트 로깅)다. stream-json 구조적 파싱은 하지 않는다.
 *
 * 라이선스/로그인은 사용자 설치본 그대로 사용 — API 키 불필요.
 */
export type AgentType = "claude" | "codex";

interface AgentSpec {
  bin: string;
  args: string[];
  label: string;
  installHint: string;
}

const AGENT_SPECS: Record<AgentType, AgentSpec> = {
  claude: {
    bin: "claude",
    args: [],
    label: "Claude Code",
    installHint:
      "claude CLI 를 찾지 못했습니다. 설치/로그인 후 PATH 에 있는지 확인하세요 (https://claude.com/claude-code).",
  },
  // bare `codex` = 인터랙티브 TUI (no subcommand → interactive). /opt/homebrew/bin 등은
  // getAugmentedPath 가 이미 포함.
  codex: {
    bin: "codex",
    args: [],
    label: "Codex",
    installHint: "codex CLI 를 찾지 못했습니다. 설치 후 PATH 에 있는지 확인하세요.",
  },
};

export interface StartAgentArgs {
  sessionId: string;
  agentType: AgentType;
  /** 세션 로그/이벤트 SSOT 디렉토리(프로젝트 루트). 세션 JSONL 이 여기 모인다. */
  projectPath: string;
  /** PTY 의 실제 cwd. 인테이크 목업은 서브폴더(<projectPath>/<slug>). 없으면 projectPath. */
  cwdOverride?: string;
  /** 시드 첫 프롬프트 — positional 인자로 얹어 인터랙티브 세션을 그대로 시작한다. */
  initialPrompt?: string;
  mockupFile?: string;
  /** 인테이크 메타(세션 표시/Level 3 검증 기반). */
  brand?: string;
  surface?: Surface;
  intent?: "html" | "admin-cms";
  cols?: number;
  rows?: number;
}

/**
 * claude 매 턴 시스템 프롬프트에 강제 주입하는 DS 사용 의무(--append-system-prompt).
 * MCP 도구를 "쓸 수 있게"(--mcp-config) 하는 것과 별개로 "반드시 쓰게" 못박는다 — bare 편집
 * 세션에서 추측으로 클래스/스타일을 지어내 nds 를 건너뛰는 불상사를 막기 위함.
 */
const DS_SYSTEM_MANDATE = [
  "이 작업공간은 Nudge 디자인 시스템(DS) 목업 전용입니다.",
  "UI·화면·컴포넌트·토큰·아이콘을 만들거나 수정할 때는 추측하지 말고 반드시 nudge-ds MCP 도구를 먼저 사용하세요:",
  "- 작업 시작 시 get_guide({topic:'principles'}) 와 dos-donts 확인.",
  "- 컴포넌트는 find_component → get_guide({topic:'component:<Name>', target:'html'}) 로 props/함정 확인.",
  "- 색/여백은 find_token (시멘틱 --semantic-* / --nds-* 만, raw hex 금지), 아이콘은 find_icon.",
  "- HTML 목업은 <nds-*> 커스텀 엘리먼트 사용. 변경 후 반드시 validate_html_mockup 으로 위반 0 까지 검증.",
  "DS 규칙을 모를 때 클래스/스타일/컴포넌트를 임의로 지어내지 말고 항상 MCP 로 조회하세요.",
].join("\n");

const running = new Map<string, IPty>();

const isWindows = process.platform === "win32";

/**
 * 에이전트 바이너리 탐지용 PATH. GUI 앱은 로그인 셸 PATH 를 못 물려받으므로 core
 * getAugmentedPath 에 더해 CLI 가 흔히 깔리는 디렉토리를 앞에 보강한다.
 *  · mac/linux: ~/.local/bin · ~/.bun/bin · ~/bin (claude 공식 인스톨러는 ~/.local/bin).
 *  · windows  : %APPDATA%\npm (npm -g 의 claude.cmd) · %LOCALAPPDATA%\Programs\claude ·
 *               %USERPROFILE%\.local\bin (네이티브 인스톨러).
 * (core 는 일부러 ~/.local/bin 을 안 건드리므로 여기서 보강.)
 */
function agentSearchPath(): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  const candidates = home
    ? isWindows
      ? [
          join(process.env.APPDATA ?? join(home, "AppData/Roaming"), "npm"),
          join(process.env.LOCALAPPDATA ?? join(home, "AppData/Local"), "Programs", "claude"),
          join(home, ".local/bin"),
          join(home, ".bun/bin"),
          join(home, "bin"),
        ]
      : [join(home, ".local/bin"), join(home, ".bun/bin"), join(home, "bin")]
    : [];
  const extra = candidates.filter((d) => existsSync(d));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const dir of [...extra, ...getAugmentedPath().split(delimiter)]) {
    if (!dir || seen.has(dir)) continue;
    seen.add(dir);
    out.push(dir);
  }
  return out.join(delimiter);
}

/**
 * Windows 는 실행 파일이 확장자(.exe/.cmd/.bat)를 가지므로 PATHEXT 후보를 붙여 탐색한다.
 * claude 는 npm 전역 설치면 claude.cmd, 네이티브 인스톨러면 claude.exe 로 깔린다 —
 * 확장자 없이 `claude` 만 찾으면 설치돼 있어도 못 찾던 버그를 고친다.
 */
function binCandidates(bin: string): string[] {
  if (!isWindows) return [bin];
  // .exe 를 먼저 — 직접 spawn 가능. .cmd/.bat 은 cmd.exe 경유 필요(아래 startAgent 참고).
  const exts = (process.env.PATHEXT ?? ".EXE;.CMD;.BAT")
    .split(";")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const ordered = [".exe", ".cmd", ".bat", ...exts].filter((e, i, a) => a.indexOf(e) === i);
  return [bin, ...ordered.map((e) => `${bin}${e}`)];
}

function resolveBin(bin: string, searchPath: string): string | null {
  for (const dir of searchPath.split(delimiter)) {
    if (!dir) continue;
    for (const name of binCandidates(bin)) {
      const candidate = join(dir, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

function cleanEnv(env: NodeJS.ProcessEnv): { [key: string]: string } {
  const out: { [key: string]: string } = {};
  for (const [k, v] of Object.entries(env)) if (typeof v === "string") out[k] = v;
  return out;
}

export function startAgent(args: StartAgentArgs, wc: WebContents): { ok: boolean; error?: string } {
  const spec = AGENT_SPECS[args.agentType];
  if (!spec) return { ok: false, error: `알 수 없는 에이전트: ${args.agentType}` };
  if (running.has(args.sessionId)) return { ok: false, error: "이미 실행 중인 세션입니다." };

  const sessionBase = {
    sessionId: args.sessionId,
    agentType: args.agentType,
    mockupFile: args.mockupFile,
    title: `${spec.label} · ${args.mockupFile ?? "project"}`,
    brand: args.brand,
    surface: args.surface,
    intent: args.intent,
  };

  const searchPath = agentSearchPath();
  const binPath = resolveBin(spec.bin, searchPath);
  if (!binPath) {
    logAppEvent(args.projectPath, {
      type: "agent_failed",
      sessionId: args.sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, error: "not-found" },
    });
    return { ok: false, error: spec.installHint };
  }

  createSession(args.projectPath, sessionBase);
  logAppEvent(args.projectPath, {
    type: "agent_started",
    sessionId: args.sessionId,
    mockupFile: args.mockupFile,
    payload: { agentType: args.agentType },
  });

  // claude 전용 플래그:
  //  · --mcp-config       : 앱 동봉 nudge-ds MCP 를 얹는다(비-strict = 추가형). 번들 없으면 생략.
  //  · --append-system-prompt : DS 사용 의무를 매 턴 시스템 프롬프트에 강제 주입(억지로 nds 쓰게).
  // (codex 는 두 플래그가 없어 워크스페이스 AGENTS.md 로 컨텍스트를 받는다.)
  const isClaude = args.agentType === "claude";
  const mcpConfig = isClaude ? ensureBundledMcpConfig() : null;
  const claudeFlags = isClaude
    ? [
        ...(mcpConfig ? ["--mcp-config", mcpConfig] : []),
        "--append-system-prompt",
        DS_SYSTEM_MANDATE,
      ]
    : [];

  // 시드 프롬프트가 있으면 positional 인자로 얹는다(claude [prompt] / codex [PROMPT] → 인터랙티브 유지).
  // ⚠️ `--mcp-config <configs...>` 는 가변 인자라 바로 뒤의 prompt 를 두 번째 config 로 삼킨다.
  //    그래서 prompt 를 맨 앞 operand 로 두어 가변 플래그가 경로 하나만 소비하게 한다
  //    (시드 프롬프트는 항상 한국어 문장이라 서브커맨드와 충돌하지 않음).
  const ptyArgs = [
    ...(args.initialPrompt ? [args.initialPrompt] : []),
    ...spec.args,
    ...claudeFlags,
  ];

  // Windows: .cmd/.bat 은 실행 파일이 아니라 CreateProcess 로 직접 spawn 불가 →
  // cmd.exe /c 로 감싼다. .exe 는 그대로 직접 spawn (가장 견고).
  const useCmdWrapper = isWindows && /\.(cmd|bat)$/i.test(binPath);
  const spawnFile = useCmdWrapper ? (process.env.ComSpec ?? "cmd.exe") : binPath;
  const spawnArgs = useCmdWrapper ? ["/c", binPath, ...ptyArgs] : ptyArgs;

  let proc: IPty;
  try {
    proc = ptySpawn(spawnFile, spawnArgs, {
      name: "xterm-color",
      cwd: args.cwdOverride ?? args.projectPath,
      env: cleanEnv({ ...getToolProcessEnv(), PATH: searchPath }),
      cols: args.cols ?? 80,
      rows: args.rows ?? 24,
    });
  } catch (err) {
    const msg = (err as Error).message;
    logAppEvent(args.projectPath, {
      type: "agent_failed",
      sessionId: args.sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, error: msg },
    });
    updateSessionStatus(args.projectPath, sessionBase, "failed");
    return { ok: false, error: msg };
  }

  running.set(args.sessionId, proc);

  proc.onData((data) => {
    appendTranscript(args.projectPath, args.sessionId, data);
    if (!wc.isDestroyed()) wc.send("agent:data", { sessionId: args.sessionId, data });
  });

  proc.onExit(({ exitCode, signal }) => {
    running.delete(args.sessionId);
    // 시그널로 죽었으면(사용자 "중지" / 앱 종료 → kill) 오류가 아니라 중단(interrupted).
    // 정상 종료(0)는 completed, 그 외 비정상 종료코드만 진짜 failed.
    const status: SessionStatus = signal ? "interrupted" : exitCode === 0 ? "completed" : "failed";
    logAppEvent(args.projectPath, {
      type: status === "completed" ? "agent_response_completed" : "agent_failed",
      sessionId: args.sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, exitCode, signal },
    });
    updateSessionStatus(args.projectPath, sessionBase, status);
    if (!wc.isDestroyed()) wc.send("agent:exit", { sessionId: args.sessionId, exitCode });
  });

  return { ok: true };
}

export function writeAgent(sessionId: string, data: string): void {
  running.get(sessionId)?.write(data);
}

/** 현재 PTY 가 살아있는 세션 id 집합. 재시작 후 stale "active" 정리에 쓰인다. */
export function runningSessionIds(): Set<string> {
  return new Set(running.keys());
}

export function resizeAgent(sessionId: string, cols: number, rows: number): void {
  try {
    running.get(sessionId)?.resize(cols, rows);
  } catch {
    /* 세션이 막 종료된 경우 등 — 무시 */
  }
}

export function stopAgent(sessionId: string): void {
  const proc = running.get(sessionId);
  if (!proc) return;
  try {
    proc.kill();
  } catch {
    /* 이미 종료 */
  }
}

export function stopAllAgents(): void {
  for (const proc of running.values()) {
    try {
      proc.kill();
    } catch {
      /* ignore */
    }
  }
  running.clear();
}
