import { existsSync, mkdtempSync, writeFileSync, watchFile, unwatchFile, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn as cpSpawn, type ChildProcess } from "node:child_process";
import { spawn as ptySpawn, type IPty } from "node-pty";
import { Notification, BrowserWindow, type WebContents } from "electron";
import { getAugmentedPath, getToolProcessEnv } from "@nudge-design/mockup-core";
import { logAppEvent } from "./events.js";
import { ensureBundledMcpConfig } from "./mcp-config.js";
import {
  appendStructuredTranscript,
  appendTranscript,
  createSession,
  updateSessionStatus,
  type SessionBase,
  type SessionStatus,
  type Transport,
} from "./sessions.js";
import { NdjsonBuffer, encodeUserTurn, mapClaudeEvent, type ChatMessage } from "./chat-types.js";
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
  /** `npm install -g <pkg>` 로 자동 설치할 전역 패키지명. 없으면 자동 설치 미지원. */
  npmPackage?: string;
}

const AGENT_SPECS: Record<AgentType, AgentSpec> = {
  claude: {
    bin: "claude",
    args: [],
    label: "Claude Code",
    installHint:
      "claude CLI 를 찾지 못했습니다. 설치/로그인 후 PATH 에 있는지 확인하세요 (https://claude.com/claude-code).",
    npmPackage: "@anthropic-ai/claude-code",
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

/** 에이전트 CLI 설치 상태 점검 결과. 렌더러의 설치 안내 패널이 분기에 사용. */
export interface AgentCheck {
  /** 에이전트 CLI(claude/codex)를 PATH 에서 찾았는가. */
  found: boolean;
  /** `npm install -g` 으로 자동 설치할 수 있는가(npmPackage 정의 + npm 존재). */
  canAutoInstall: boolean;
  /** npm(=Node.js) 이 있는가. 없으면 자동 설치 불가 → Node.js 먼저 안내. */
  npmFound: boolean;
}

/**
 * 에이전트 CLI 와 npm(자동 설치 전제) 존재 여부를 점검한다.
 * agentSearchPath 가 %APPDATA%\npm 등 설치 위치를 하드코딩하므로, 설치 직후
 * PATH 갱신("새 터미널") 없이도 found 가 true 로 뒤집힌다.
 */
export function checkAgent(agentType: AgentType): AgentCheck {
  const spec = AGENT_SPECS[agentType];
  const searchPath = agentSearchPath();
  const npmFound = resolveBin("npm", searchPath) !== null;
  return {
    // PATH 설치본 또는 앱 동봉본(claude) 둘 중 하나라도 있으면 found — 설치 안내를 띄우지 않는다.
    found: resolveAgentBin(agentType, searchPath) !== null,
    canAutoInstall: Boolean(spec.npmPackage) && npmFound,
    npmFound,
  };
}

/** installAgent 결과. output 은 실패 시에만 펼쳐 보여줄 raw 로그. */
export interface InstallResult {
  ok: boolean;
  /** stdout+stderr 합본. 성공 시엔 빈 문자열일 수 있음(실패 진단용). */
  output: string;
}

/**
 * 에이전트 CLI 를 `npm install -g <pkg>` 로 자동 설치한다. 설치 후 resolveBin 으로
 * 재확인해 ok 를 판정 — exit 0 이어도 바이너리가 안 잡히면 ok:false.
 * Windows 의 npm.cmd 는 직접 spawn 불가 → cmd.exe /c 로 감싼다(PTY 경로와 동일 규칙).
 */
export async function installAgent(agentType: AgentType): Promise<InstallResult> {
  const spec = AGENT_SPECS[agentType];
  if (!spec.npmPackage) {
    return { ok: false, output: `${spec.label} 자동 설치는 지원하지 않습니다.` };
  }
  const searchPath = agentSearchPath();
  const npmPath = resolveBin("npm", searchPath);
  if (!npmPath) {
    return {
      ok: false,
      output:
        "Node.js(npm)가 없어 자동 설치할 수 없습니다. Node.js 를 먼저 설치한 뒤 다시 시도하세요.",
    };
  }
  const useCmdWrapper = isWindows && /\.(cmd|bat)$/i.test(npmPath);
  const spawnFile = useCmdWrapper
    ? (process.env.ComSpec ?? process.env.COMSPEC ?? "cmd.exe")
    : npmPath;
  const npmArgs = ["install", "-g", spec.npmPackage];
  const spawnArgs = useCmdWrapper ? ["/d", "/s", "/c", npmPath, ...npmArgs] : npmArgs;
  return new Promise<InstallResult>((resolve) => {
    let output = "";
    const append = (chunk: Buffer): void => {
      output += chunk.toString();
    };
    let child: ChildProcess;
    try {
      child = cpSpawn(spawnFile, spawnArgs, {
        env: cleanEnv({ ...getToolProcessEnv(), PATH: searchPath }),
        windowsHide: true,
      });
    } catch (e) {
      resolve({ ok: false, output: `설치 프로세스를 시작하지 못했습니다: ${String(e)}` });
      return;
    }
    child.stdout?.on("data", append);
    child.stderr?.on("data", append);
    child.on("error", (e) => resolve({ ok: false, output: `${output}\n${String(e)}` }));
    child.on("exit", (code) => {
      // 설치 직후 재확인 — PATH 갱신 없이도 하드코딩 후보 디렉토리에서 잡힌다.
      const found = resolveBin(spec.bin, agentSearchPath()) !== null;
      resolve({ ok: code === 0 && found, output });
    });
  });
}

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
  /** 인테이크에서 받은 사람이 읽는 화면 이름(채팅기록 타이틀 기본값). */
  screenName?: string;
  /** 인테이크 메타(세션 표시/Level 3 검증 기반). */
  brand?: string;
  surface?: Surface;
  intent?: "html" | "admin-cms";
  /** 전송 방식. 기본 pty(raw TUI). `stream-json`(canary) = headless 구조화 — claude 전용. */
  transport?: Transport;
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
  "- 색/여백은 find_token (시멘틱 --semantic-* / --nds-* 만, raw hex 금지).",
  "- 아이콘은 find_icon({query})로 찾고 find_icon({name})으로 붙여넣을 inline svg 를 받으세요(npm 설치 불필요). 이모지/텍스트 기호 금지.",
  "- HTML 목업은 <nds-*> 커스텀 엘리먼트 사용. 변경 후 반드시 validate_html_mockup 으로 위반 0 까지 검증.",
  "DS 규칙을 모를 때 클래스/스타일/컴포넌트를 임의로 지어내지 말고 항상 MCP 로 조회하세요.",
].join("\n");

const running = new Map<string, IPty>();
/**
 * 살아있는 pty 세션의 최신 폭/높이(컬럼/로우). 라이브 리사이즈로 갱신되며 종료 시
 * 세션 메타에 기록돼 기록 재생이 "마지막으로 본 폭"으로 고정된다 — raw TUI 트랜스크립트는
 * 녹화 폭에 종속이라 다른 폭으로 흘리면 전각(한글)이 깨진다.
 */
const sessionDims = new Map<string, { cols: number; rows: number }>();
/** stream-json(canary) 세션. child = 상주 claude 프로세스, emit = 정규화 메시지 저장+전송 클로저. */
const streamRunning = new Map<string, { child: ChildProcess; emit: (msg: ChatMessage) => void }>();

const isWindows = process.platform === "win32";

/** 두 transport 를 통틀어 해당 세션이 살아있는지. */
function isSessionRunning(sessionId: string): boolean {
  return running.has(sessionId) || streamRunning.has(sessionId);
}

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
  // Windows npm global install creates both `claude` (shell shim) and `claude.cmd`.
  // The extensionless shim is not a Win32 executable and causes spawn error 193, so
  // prefer PATHEXT candidates and keep the bare name only as a last fallback.
  const exts = (process.env.PATHEXT ?? ".EXE;.CMD;.BAT")
    .split(";")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const ordered = [".exe", ".cmd", ".bat", ...exts].filter((e, i, a) => a.indexOf(e) === i);
  return [...ordered.map((e) => `${bin}${e}`), bin];
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

const moduleDir = dirname(fileURLToPath(import.meta.url));

/**
 * 앱 동봉 claude 네이티브 바이너리 경로(있으면). 사용자 PATH 에서 claude 를 못 찾을 때의
 * 폴백 — 받는 사람이 claude 를 따로 설치/로그인하지 않아도 앱이 바로 동작한다.
 *  · packaged: resources/claude/{platform}-{arch}/claude(.exe)  (electron-builder extraResources)
 *  · dev     : <monorepo>/apps/desktop/.claude-bundle/{platform}-{arch}/claude(.exe)
 * claude 는 플랫폼별 self-contained 실행파일이라 node 없이 그대로 spawn 된다. 로그인 자격
 * (~/.claude)은 어느 바이너리든 공유하므로 사용자 로그인이 그대로 유효하다.
 * (번들을 빼면 두 후보 모두 부재 → null → 자동으로 PATH 전용 동작으로 복귀.)
 */
let cachedBundledClaude: string | null | undefined;
function resolveBundledClaude(): string | null {
  if (cachedBundledClaude !== undefined) return cachedBundledClaude;
  const archDir = `${process.platform}-${process.arch}`;
  const binName = isWindows ? "claude.exe" : "claude";

  const resourcesPath = (process as NodeJS.Process & { resourcesPath?: string }).resourcesPath;
  if (resourcesPath) {
    const packaged = join(resourcesPath, "claude", archDir, binName);
    if (existsSync(packaged)) return (cachedBundledClaude = packaged);
  }

  // dev/모노레포: moduleDir(out/main/…) 에서 위로 올라가며 .claude-bundle 탐색.
  let dir = moduleDir;
  for (let i = 0; i < 8; i += 1) {
    const candidate = join(dir, ".claude-bundle", archDir, binName);
    if (existsSync(candidate)) return (cachedBundledClaude = candidate);
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return (cachedBundledClaude = null);
}

/**
 * 에이전트 실행 바이너리 해석. 사용자 PATH 설치본을 우선하고(최신/로그인/커스텀 설정 존중),
 * 없을 때만 앱 동봉본으로 폴백한다(claude 한정 — codex 는 동봉하지 않음).
 */
function resolveAgentBin(agentType: AgentType, searchPath: string): string | null {
  const onPath = resolveBin(AGENT_SPECS[agentType].bin, searchPath);
  if (onPath) return onPath;
  if (agentType === "claude") return resolveBundledClaude();
  return null;
}

function cleanEnv(env: NodeJS.ProcessEnv): { [key: string]: string } {
  const out: { [key: string]: string } = {};
  for (const [k, v] of Object.entries(env)) if (typeof v === "string") out[k] = v;
  return out;
}

/**
 * 작업(턴) 완료 시 OS 데스크탑 알림.
 * - 창이 이미 포커스돼 있으면(사용자가 보고 있으면) 띄우지 않는다 — 무음 정책.
 * - 클릭하면 창을 복원/포커스한다.
 * PTY(raw TUI) = Claude Code 가 턴 완료(입력 대기) 시 울리는 터미널 벨(\x07) 을 신호로,
 * stream-json = `result` 메시지를 신호로 호출한다.
 */
function notifyAgentTurn(wc: WebContents, opts: { ok: boolean; screenName?: string }): void {
  if (wc.isDestroyed() || !Notification.isSupported()) return;
  const win = BrowserWindow.fromWebContents(wc);
  if (win?.isFocused()) return; // 이미 보고 있으면 알림 불필요
  const name = opts.screenName?.trim() || "작업";
  const n = new Notification({
    title: opts.ok ? "작업 완료" : "작업 실패",
    body: opts.ok
      ? `${name} — 에이전트 응답이 끝났어요.`
      : `${name} — 에이전트가 중단되거나 실패했어요.`,
  });
  n.on("click", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });
  n.show();
}

/**
 * PTY(터미널) 모드 턴 완료를 신뢰도 높게 잡기 위한 Claude Stop 훅 배선.
 * 임시 settings.json 에 Stop 훅(신호파일 append)을 넣어 `--settings` 로 주입하고,
 * 그 신호파일을 watchFile 폴링으로 감시한다. 훅 명령은 POSIX 셸 전제라 윈도/codex 는
 * 벨(\x07) 폴백에 맡긴다. settingsArgs 를 spawn args 에 펼치고, 종료 시 dispose() 호출.
 */
// 데스크톱 앱이 띄우는 claude 세션에 항상 주입하는 하드 차단 권한(settings.permissions.deny).
// deny 는 모든 permission-mode(default/acceptEdits/bypassPermissions)보다 우선하는 hard block 이라
// 사용자가 권한 프롬프트에서 승인해도, bypass 모드여도 실행되지 않는다.
//  - git commit / push : 데스크톱 목업 작업 중 의도치 않은 커밋/푸시를 원천 차단.
//  - figma 쓰기 도구    : 레퍼런스 조회(get_*/read)는 허용하되 생성/수정/삭제는 차단.
// NOTE: figma MCP write 도구의 정확한 이름은 서버가 붙는 환경에서 확인해 보강할 것
//       (trailing wildcard 미매칭 시 패턴은 무시될 뿐 read 에는 영향 없음).
const HARD_DENY_PERMISSIONS: string[] = [
  "Bash(git commit:*)",
  "Bash(git push:*)",
  "mcp__figma__create_*",
  "mcp__figma__update_*",
  "mcp__figma__set_*",
  "mcp__figma__delete_*",
  "mcp__figma__write_*",
];

// stream(canary) 세션용 deny 전용 settings 파일 — turn hook 을 안 쓰는 경로라 따로 만든다.
// mkdtemp 로 1회 생성 후 캐시(작은 JSON, OS tmp 가 정리). 실패하면 null(주입 생략).
let denySettingsPath: string | null = null;
function ensureDenySettingsPath(): string | null {
  if (denySettingsPath) return denySettingsPath;
  try {
    const dir = mkdtempSync(join(tmpdir(), "nudge-deny-"));
    const p = join(dir, "settings.json");
    writeFileSync(p, JSON.stringify({ permissions: { deny: HARD_DENY_PERMISSIONS } }));
    denySettingsPath = p;
    return p;
  } catch {
    return null;
  }
}

function setupTurnHook(
  isClaude: boolean,
  onTurnDone: () => void,
): { settingsArgs: string[]; dispose: () => void } {
  const noop = { settingsArgs: [] as string[], dispose: (): void => {} };
  if (!isClaude || isWindows) return noop;
  try {
    const dir = mkdtempSync(join(tmpdir(), "nudge-turn-"));
    const signalPath = join(dir, "signal");
    const settingsPath = join(dir, "settings.json");
    const settings = {
      hooks: {
        Stop: [{ hooks: [{ type: "command", command: `printf 1 >> '${signalPath}'` }] }],
      },
      // git commit/push·figma 쓰기 하드 차단 — turn hook settings 에 병합해 한 번에 주입.
      permissions: { deny: HARD_DENY_PERMISSIONS },
    };
    writeFileSync(settingsPath, JSON.stringify(settings));
    let last = 0;
    watchFile(signalPath, { interval: 300 }, (cur) => {
      if (cur.size > last) {
        last = cur.size;
        onTurnDone();
      }
    });
    return {
      settingsArgs: ["--settings", settingsPath],
      dispose: (): void => {
        unwatchFile(signalPath);
        try {
          rmSync(dir, { recursive: true, force: true });
        } catch {
          /* 정리 실패는 무시 */
        }
      },
    };
  } catch {
    return noop;
  }
}

/** startAgent 실패 사유 코드. "not-found" 면 렌더러가 설치 안내 패널을 띄운다. */
export type StartAgentErrorCode = "not-found";

export function startAgent(
  args: StartAgentArgs,
  wc: WebContents,
): { ok: boolean; error?: string; code?: StartAgentErrorCode } {
  const spec = AGENT_SPECS[args.agentType];
  if (!spec) return { ok: false, error: `알 수 없는 에이전트: ${args.agentType}` };
  if (isSessionRunning(args.sessionId)) return { ok: false, error: "이미 실행 중인 세션입니다." };

  const transport: Transport = args.transport ?? "pty";
  // stream-json 은 claude 의 `-p --output-format stream-json` 전용 — codex 등가물 없음.
  if (transport === "stream-json" && args.agentType !== "claude") {
    return { ok: false, error: "구조화(stream-json) 모드는 Claude 에서만 지원됩니다." };
  }

  const sessionBase = {
    sessionId: args.sessionId,
    agentType: args.agentType,
    mockupFile: args.mockupFile,
    title: `${spec.label} · ${args.mockupFile ?? "project"}`,
    screenName: args.screenName,
    brand: args.brand,
    surface: args.surface,
    intent: args.intent,
    transport,
    // 작업 폴더(PTY cwd) — 전역 저장이라 세션마다 다를 수 있어 카드에 경로로 표시.
    cwd: args.cwdOverride ?? args.projectPath,
    // 녹화 폭 — 기록 재생을 이 폭으로 고정해 한글(전각) 깨짐을 막는다(pty 전용, 라이브 리사이즈로 갱신).
    cols: args.cols,
    rows: args.rows,
  };

  const searchPath = agentSearchPath();
  // 사용자 PATH 설치본 우선, 없으면 앱 동봉 claude 로 폴백.
  const binPath = resolveAgentBin(args.agentType, searchPath);
  if (!binPath) {
    logAppEvent(args.projectPath, {
      type: "agent_failed",
      sessionId: args.sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, error: "not-found" },
    });
    return { ok: false, error: spec.installHint, code: "not-found" };
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

  // 구조화(stream-json) transport 는 PTY 가 아니라 piped child_process 로 분기. createSession/
  // agent_started 로그는 위에서 이미 공통으로 처리됨 — 여기선 spawn + 이벤트 배선만.
  if (transport === "stream-json") {
    return startStreamAgent(args, binPath, searchPath, mcpConfig, sessionBase, wc);
  }

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
  // 턴 완료 알림 신호 — 벨(\x07) + Claude Stop 훅(신호파일) 두 경로를 400ms 디바운스로 합쳐 1건만.
  // 알림은 세션당 1회(첫 턴 완료)만 — 매 턴마다 OS 알림이 쏟아지지 않게 한다.
  let turnTimer: NodeJS.Timeout | null = null;
  let notifiedOnce = false;
  const signalTurnDone = (): void => {
    if (notifiedOnce) return;
    if (turnTimer) clearTimeout(turnTimer);
    turnTimer = setTimeout(() => {
      turnTimer = null;
      notifiedOnce = true;
      notifyAgentTurn(wc, { ok: true, screenName: args.screenName });
    }, 400);
  };
  const turnHook = setupTurnHook(isClaude, signalTurnDone);

  const ptyArgs = [
    ...(args.initialPrompt ? [args.initialPrompt] : []),
    ...spec.args,
    ...claudeFlags,
    ...turnHook.settingsArgs,
  ];

  // Windows: .cmd/.bat 은 실행 파일이 아니라 CreateProcess 로 직접 spawn 불가 →
  // cmd.exe /c 로 감싼다. .exe 는 그대로 직접 spawn (가장 견고).
  const useCmdWrapper = isWindows && /\.(cmd|bat)$/i.test(binPath);
  const spawnFile = useCmdWrapper
    ? (process.env.ComSpec ?? process.env.COMSPEC ?? "cmd.exe")
    : binPath;
  const spawnArgs = useCmdWrapper ? ["/d", "/s", "/c", binPath, ...ptyArgs] : ptyArgs;

  let proc: IPty;
  try {
    proc = ptySpawn(spawnFile, spawnArgs, {
      // 256색 terminfo + COLORTERM=truecolor 로 claude 의 브랜드(주황) 트루컬러를 그대로 받는다.
      // "xterm-color"(8색)면 claude 주황이 가장 가까운 ANSI-16(빨강)으로 떨어져 "클로드가 빨갛게"
      // 보이는 문제가 생긴다 — xterm.js 는 truecolor 를 지원하므로 환경만 알려주면 된다.
      name: "xterm-256color",
      cwd: args.cwdOverride ?? args.projectPath,
      env: cleanEnv({
        ...getToolProcessEnv(),
        PATH: searchPath,
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
      }),
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
    turnHook.dispose();
    return { ok: false, error: msg };
  }

  running.set(args.sessionId, proc);
  sessionDims.set(args.sessionId, { cols: args.cols ?? 80, rows: args.rows ?? 24 });

  // Claude Code(및 일부 TUI)는 턴을 끝내고 입력 대기로 돌아갈 때 터미널 벨(\x07)을 울린다.
  // Stop 훅(신호파일)과 함께 signalTurnDone 디바운스로 합쳐 알림 1건만 발생시킨다.
  proc.onData((data) => {
    appendTranscript(args.projectPath, args.sessionId, data);
    if (!wc.isDestroyed()) wc.send("agent:data", { sessionId: args.sessionId, data });
    if (data.includes("\x07")) signalTurnDone();
  });

  proc.onExit(({ exitCode, signal }) => {
    running.delete(args.sessionId);
    // 종료 시점의 최신 폭을 메타에 박아 기록 재생이 그 폭으로 고정되게 한다.
    const dims = sessionDims.get(args.sessionId);
    sessionDims.delete(args.sessionId);
    if (turnTimer) clearTimeout(turnTimer);
    turnHook.dispose();
    // 시그널로 죽었으면(사용자 "중지" / 앱 종료 → kill) 오류가 아니라 중단(interrupted).
    // 정상 종료(0)는 completed, 그 외 비정상 종료코드만 진짜 failed.
    const status: SessionStatus = signal ? "interrupted" : exitCode === 0 ? "completed" : "failed";
    logAppEvent(args.projectPath, {
      type: status === "completed" ? "agent_response_completed" : "agent_failed",
      sessionId: args.sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, exitCode, signal },
    });
    updateSessionStatus(
      args.projectPath,
      dims ? { ...sessionBase, cols: dims.cols, rows: dims.rows } : sessionBase,
      status,
    );
    if (!wc.isDestroyed()) wc.send("agent:exit", { sessionId: args.sessionId, exitCode });
  });

  return { ok: true };
}

/**
 * 구조화(stream-json) 세션 spawn. PTY 가 아니라 piped child_process 로 claude 를
 * `-p --input-format stream-json --output-format stream-json` 상주 모드로 띄운다.
 *  · stdout NDJSON → NdjsonBuffer 로 줄 재조립 → mapClaudeEvent → 정규화 메시지 저장+전송.
 *  · stdin 은 열어둔다(멀티턴) — sendStreamTurn 이 유저 턴을 JSON 라인으로 write.
 *  · 권한: bypassPermissions(로컬 신뢰 + PTY 와 동일 작업 비교 목적, 대화형 프롬프트 부재 대응).
 * createSession/agent_started 는 호출부(startAgent)가 이미 기록함.
 */
function startStreamAgent(
  args: StartAgentArgs,
  binPath: string,
  searchPath: string,
  mcpConfig: string | null,
  sessionBase: SessionBase,
  wc: WebContents,
): { ok: boolean; error?: string } {
  const sessionId = args.sessionId;
  // git commit/push·figma 쓰기 하드 차단(deny). bypassPermissions 여도 deny 가 우선한다.
  // stream 은 turn hook 을 안 쓰므로 전용 settings 파일로 주입.
  const denyPath = ensureDenySettingsPath();
  const streamArgs = [
    "-p",
    "--input-format",
    "stream-json",
    "--output-format",
    "stream-json",
    "--verbose", // -p + stream-json 출력에 필요(누락 시 일부 버전에서 거부).
    "--session-id",
    sessionId, // 우리 UUID 를 claude 세션 id 로 정렬(후속 --resume 대비).
    "--permission-mode",
    "bypassPermissions",
    ...(mcpConfig ? ["--mcp-config", mcpConfig] : []),
    ...(denyPath ? ["--settings", denyPath] : []),
    "--append-system-prompt",
    DS_SYSTEM_MANDATE,
  ];

  // Windows .cmd/.bat 은 직접 spawn 불가 → cmd.exe /c 경유(PTY 경로와 동일 규칙).
  const useCmdWrapper = isWindows && /\.(cmd|bat)$/i.test(binPath);
  const spawnFile = useCmdWrapper
    ? (process.env.ComSpec ?? process.env.COMSPEC ?? "cmd.exe")
    : binPath;
  const spawnArgs = useCmdWrapper ? ["/d", "/s", "/c", binPath, ...streamArgs] : streamArgs;

  let child: ChildProcess;
  try {
    child = cpSpawn(spawnFile, spawnArgs, {
      cwd: args.cwdOverride ?? args.projectPath,
      env: cleanEnv({ ...getToolProcessEnv(), PATH: searchPath }),
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (err) {
    const msg = (err as Error).message;
    logAppEvent(args.projectPath, {
      type: "agent_failed",
      sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, transport: "stream-json", error: msg },
    });
    updateSessionStatus(args.projectPath, sessionBase, "failed");
    return { ok: false, error: msg };
  }

  // 정규화 메시지 1건을 영구저장(.jsonl) + 렌더러로 전송. 라이브/재생 단일 출처.
  // 알림은 세션당 1회(첫 result)만 — 매 턴마다 OS 알림이 쏟아지지 않게 한다.
  let notifiedOnce = false;
  const emit = (msg: ChatMessage): void => {
    appendStructuredTranscript(args.projectPath, sessionId, msg);
    if (!wc.isDestroyed()) wc.send("agent:message", { sessionId, message: msg });
    // 구조화 모드는 턴 완료마다 result 메시지가 온다 — 이게 "작업 완료" 신호.
    if (msg.kind === "result" && !notifiedOnce) {
      notifiedOnce = true;
      notifyAgentTurn(wc, { ok: msg.ok, screenName: args.screenName });
    }
  };
  streamRunning.set(sessionId, { child, emit });

  const buf = new NdjsonBuffer();
  const drain = (events: unknown[]): void => {
    for (const evt of events) for (const msg of mapClaudeEvent(evt)) emit(msg);
  };
  child.stdout?.setEncoding("utf8");
  child.stdout?.on("data", (chunk: string) => drain(buf.push(chunk)));

  let stderr = "";
  child.stderr?.setEncoding("utf8");
  child.stderr?.on("data", (chunk: string) => {
    stderr += chunk;
    if (stderr.length > 8000) stderr = stderr.slice(-8000); // 폭주 방지
  });

  const finish = (status: SessionStatus, exitCode: number): void => {
    drain(buf.flush());
    streamRunning.delete(sessionId);
    if (status === "failed" && stderr.trim()) {
      emit({ kind: "error", text: stderr.trim().slice(0, 800) });
    }
    logAppEvent(args.projectPath, {
      type: status === "completed" ? "agent_response_completed" : "agent_failed",
      sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, transport: "stream-json", exitCode },
    });
    updateSessionStatus(args.projectPath, sessionBase, status);
    if (!wc.isDestroyed()) wc.send("agent:exit", { sessionId, exitCode });
  };

  // 바이너리 자체를 못 띄운 경우(ENOENT 등) — close 가 안 올 수 있어 별도 처리. 멱등 가드.
  child.on("error", (err) => {
    if (!streamRunning.has(sessionId)) return;
    stderr += `\n${(err as Error).message}`;
    finish("failed", 1);
  });

  child.on("close", (code, signal) => {
    if (!streamRunning.has(sessionId)) return; // error 가 이미 처리
    // 시그널 종료(중지/앱 종료)=interrupted, 0=completed, 그 외 코드=failed (PTY 와 동일 시맨틱).
    const status: SessionStatus = signal ? "interrupted" : code === 0 ? "completed" : "failed";
    finish(status, code ?? (signal ? 130 : 1));
  });

  // 시드 프롬프트(인테이크 등)가 있으면 첫 유저 턴으로 stdin 에 흘리고 UI 에도 버블로 보인다.
  if (args.initialPrompt) {
    emit({ kind: "user", text: args.initialPrompt });
    child.stdin?.write(encodeUserTurn(args.initialPrompt));
  }

  return { ok: true };
}

/**
 * 구조화 세션의 다음 유저 턴. JSON 라인으로 stdin write + 같은 텍스트를 user 버블로
 * 저장/전송(단일 출처라 렌더러는 echo 를 받아 렌더). pty 세션이면 무시.
 */
export function sendStreamTurn(sessionId: string, text: string): void {
  const session = streamRunning.get(sessionId);
  if (!session) return;
  session.emit({ kind: "user", text });
  session.child.stdin?.write(encodeUserTurn(text));
}

export function writeAgent(sessionId: string, data: string): void {
  running.get(sessionId)?.write(data);
}

/**
 * 현재 살아있는 세션 id 집합(PTY + stream-json 두 transport). 재시작 후 stale "active"
 * 정리에 쓰인다 — 두 맵을 union 하지 않으면 라이브 stream 세션이 잘못 interrupted 로 마킹된다.
 */
export function runningSessionIds(): Set<string> {
  return new Set([...running.keys(), ...streamRunning.keys()]);
}

export function resizeAgent(sessionId: string, cols: number, rows: number): void {
  try {
    running.get(sessionId)?.resize(cols, rows);
  } catch {
    /* 세션이 막 종료된 경우 등 — 무시 */
  }
  // 최신 폭을 기억해 둔다 — 종료 시 메타에 박혀 기록 재생이 이 폭으로 고정된다.
  const dims = sessionDims.get(sessionId);
  if (dims) {
    dims.cols = cols;
    dims.rows = rows;
  }
}

export function stopAgent(sessionId: string): void {
  const proc = running.get(sessionId);
  if (proc) {
    try {
      proc.kill();
    } catch {
      /* 이미 종료 */
    }
    return;
  }
  const stream = streamRunning.get(sessionId);
  if (stream) {
    try {
      stream.child.stdin?.end(); // 멀티턴 stdin 닫고
      stream.child.kill(); // 종료(close 핸들러가 정리/상태 기록)
    } catch {
      /* 이미 종료 */
    }
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
  for (const { child } of streamRunning.values()) {
    try {
      child.stdin?.end();
      child.kill();
    } catch {
      /* ignore */
    }
  }
  streamRunning.clear();
}
