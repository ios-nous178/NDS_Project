import { existsSync } from "node:fs";
import { delimiter, join } from "node:path";
import { spawn as ptySpawn, type IPty } from "node-pty";
import type { WebContents } from "electron";
import { getAugmentedPath, getToolProcessEnv } from "@nudge-design/mockup-core";
import { logAppEvent } from "./events.js";
import { appendTranscript, createSession, updateSessionStatus } from "./sessions.js";

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
  // Phase 5b 에서 사용 — spec 은 미리 둔다.
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
  projectPath: string;
  mockupFile?: string;
  cols?: number;
  rows?: number;
}

const running = new Map<string, IPty>();

/**
 * 에이전트 바이너리 탐지용 PATH. GUI 앱은 로그인 셸 PATH 를 못 물려받으므로 core
 * getAugmentedPath 에 더해 CLI 가 흔히 깔리는 ~/.local/bin · ~/.bun/bin 을 앞에 보강한다
 * (claude 가 ~/.local/bin 에 깔리는 케이스 — core 는 일부러 안 건드림).
 */
function agentSearchPath(): string {
  const home = process.env.HOME ?? "";
  const extra = home
    ? [join(home, ".local/bin"), join(home, ".bun/bin"), join(home, "bin")].filter((d) =>
        existsSync(d),
      )
    : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const dir of [...extra, ...getAugmentedPath().split(delimiter)]) {
    if (!dir || seen.has(dir)) continue;
    seen.add(dir);
    out.push(dir);
  }
  return out.join(delimiter);
}

function resolveBin(bin: string, searchPath: string): string | null {
  for (const dir of searchPath.split(delimiter)) {
    if (!dir) continue;
    const candidate = join(dir, bin);
    if (existsSync(candidate)) return candidate;
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

  let proc: IPty;
  try {
    proc = ptySpawn(binPath, spec.args, {
      name: "xterm-color",
      cwd: args.projectPath,
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
    logAppEvent(args.projectPath, {
      type: exitCode === 0 ? "agent_response_completed" : "agent_failed",
      sessionId: args.sessionId,
      mockupFile: args.mockupFile,
      payload: { agentType: args.agentType, exitCode, signal },
    });
    updateSessionStatus(args.projectPath, sessionBase, exitCode === 0 ? "completed" : "failed");
    if (!wc.isDestroyed()) wc.send("agent:exit", { sessionId: args.sessionId, exitCode });
  });

  return { ok: true };
}

export function writeAgent(sessionId: string, data: string): void {
  running.get(sessionId)?.write(data);
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
