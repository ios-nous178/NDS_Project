import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { getToolProcessEnv } from "./process-env.js";
import { detectWorkspaceIntent } from "./build-html.js";

interface DevServerSession {
  id: string;
  cwd: string;
  command: string;
  args: string[];
  process: ChildProcessWithoutNullStreams;
  startedAt: string;
  logs: string[];
  url?: string;
  error?: string;
}

const devServerSessions = new Map<string, DevServerSession>();
let devServerSessionSeq = 0;
let cleanupRegistered = false;
let cleanupInProgress = false;

export function cleanupDevServerSessions(signal: NodeJS.Signals = "SIGTERM") {
  for (const [id, session] of devServerSessions) {
    if (session.process.exitCode === null && !session.process.killed) {
      session.process.kill(signal);
      pushSessionLog(session, `[cleanup] ${signal} sent by MCP shutdown handler.`);
    }
    devServerSessions.delete(id);
  }
}

export function registerDevServerCleanup() {
  if (cleanupRegistered) return;
  cleanupRegistered = true;

  process.once("exit", () => cleanupDevServerSessions("SIGTERM"));

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      if (cleanupInProgress) return;
      cleanupInProgress = true;
      cleanupDevServerSessions(signal);
      process.exit(signal === "SIGINT" ? 130 : 143);
    });
  }
}

function pushSessionLog(session: DevServerSession, text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);
  session.logs.push(...lines);
  if (session.logs.length > 120) {
    session.logs.splice(0, session.logs.length - 120);
  }
}

function extractDevServerUrl(logs: string[]) {
  const joined = logs.join("\n");
  const matches = joined.match(
    /https?:\/\/(?:localhost|127\.0\.0\.1|\[[^\]]+\]|[^\s/]+):\d+[^\s]*/g,
  );
  return matches?.[0];
}

async function waitForUrl(url: string, timeoutMs: number) {
  const started = Date.now();
  let lastError = "";
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok || response.status < 500) return { ok: true, status: response.status };
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = (error as Error).message;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return { ok: false, error: lastError || "Timed out waiting for dev server." };
}

export async function startDevServer(args: {
  cwd?: string;
  command?: string;
  args?: string[];
  url?: string;
  port?: number;
  timeoutMs?: number;
}) {
  const cwd = path.resolve(args.cwd ?? process.cwd());
  if (!fs.existsSync(cwd)) {
    return { ok: false, error: `cwd not found: ${cwd}` };
  }

  // html(vanilla <nds-*>, 무번들러) 워크스페이스는 dev server 가 필요 없다 — build_singlefile_html 이
  // 만든 자체완결 dist/index.html 을 그대로 열면 된다. dev_server(vite)는 react/admin-cms 전용.
  // (명시 command 를 넘기면 사용자가 의도적으로 서버를 띄우려는 것이므로 존중하고 건너뛰지 않는다.)
  if (!args.command && detectWorkspaceIntent(cwd) === "html") {
    return {
      ok: true,
      skipped: true,
      intent: "html",
      cwd,
      message:
        "html(vanilla <nds-*>) 목업은 dev server 가 필요 없습니다 — 번들러 없이 build_singlefile_html 이 " +
        "DS runtime/CSS 를 inline 한 자체완결 dist/index.html 을 만듭니다. 그 파일을 브라우저에서 직접 여세요(file://). " +
        "Nudge Studio 데스크톱 앱이라면 미리보기 패널이 자동으로 dist 를 띄웁니다.",
      next: "build_singlefile_html({ cwd }) → dist/index.html 을 브라우저로 열기",
    };
  }

  const command = args.command ?? "npm";
  const commandArgs = args.args ?? ["run", "dev", "--", "--host", "127.0.0.1"];
  const expectedUrl = args.url ?? (args.port ? `http://127.0.0.1:${args.port}` : undefined);
  const timeoutMs = args.timeoutMs ?? 20_000;
  const id = `dev-${++devServerSessionSeq}`;

  const child = spawn(command, commandArgs, {
    cwd,
    env: getToolProcessEnv({ BROWSER: "none" }),
    stdio: "pipe",
  });

  const session: DevServerSession = {
    id,
    cwd,
    command,
    args: commandArgs,
    process: child,
    startedAt: new Date().toISOString(),
    logs: [],
  };
  devServerSessions.set(id, session);

  child.stdout.on("data", (chunk: Buffer) => {
    pushSessionLog(session, chunk.toString("utf-8"));
    session.url = session.url ?? extractDevServerUrl(session.logs);
  });
  child.stderr.on("data", (chunk: Buffer) => {
    pushSessionLog(session, chunk.toString("utf-8"));
    session.url = session.url ?? extractDevServerUrl(session.logs);
  });
  child.on("error", (error) => {
    session.error = error.message;
    pushSessionLog(session, `[process error] ${error.message}`);
  });
  child.on("exit", (code, signal) => {
    pushSessionLog(session, `[process exited] code=${code ?? "null"} signal=${signal ?? "null"}`);
  });

  const started = Date.now();
  while (
    !session.url &&
    !session.error &&
    child.exitCode === null &&
    Date.now() - started < Math.min(timeoutMs, 8_000)
  ) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  if (session.error) {
    return {
      ok: false,
      sessionId: id,
      cwd,
      command: `${command} ${commandArgs.join(" ")}`,
      error: session.error,
      logs: session.logs.slice(-30),
    };
  }

  const url = expectedUrl ?? session.url ?? "http://127.0.0.1:5173";
  session.url = url;
  const reachable = await waitForUrl(url, timeoutMs);

  return {
    ok: reachable.ok,
    sessionId: id,
    url,
    cwd,
    command: `${command} ${commandArgs.join(" ")}`,
    status: reachable,
    logs: session.logs.slice(-30),
    next: reachable.ok
      ? `Dev server is up at ${url}. Open it in a browser to review the mockup, then stop it with dev_server({ action: 'stop', sessionId: '${id}' }).`
      : "Read logs, fix the dev server error, or pass the actual Vite URL with the url argument.",
  };
}

/**
 * dev_server 통합 라우터 — 옛 start_dev_server + stop_dev_server 진입점.
 *   { action: 'start', ... } → startDevServer
 *   { action: 'stop', sessionId? } → stopDevServer
 */
export async function devServer(args: {
  action: "start" | "stop";
  cwd?: string;
  command?: string;
  args?: string[];
  url?: string;
  port?: number;
  timeoutMs?: number;
  sessionId?: string;
}) {
  if (args.action === "start") {
    return startDevServer({
      cwd: args.cwd,
      command: args.command,
      args: args.args,
      url: args.url,
      port: args.port,
      timeoutMs: args.timeoutMs,
    });
  }
  return stopDevServer({ sessionId: args.sessionId });
}

export function stopDevServer(args: { sessionId?: string }) {
  const ids = args.sessionId ? [args.sessionId] : [...devServerSessions.keys()];
  const stopped: Array<{ sessionId: string; ok: boolean; note: string }> = [];

  for (const id of ids) {
    const session = devServerSessions.get(id);
    if (!session) {
      stopped.push({ sessionId: id, ok: false, note: "No such session." });
      continue;
    }
    if (session.process.exitCode === null) {
      session.process.kill("SIGTERM");
      stopped.push({ sessionId: id, ok: true, note: "SIGTERM sent." });
    } else {
      stopped.push({ sessionId: id, ok: true, note: "Process was already exited." });
    }
    devServerSessions.delete(id);
  }

  return { stopped };
}

// 런타임 렌더드 DOM 캡처(Playwright 기반 snapshot / check_preview)는 제거됨.
// 화면 확인은 dev_server 로 띄운 URL 을 브라우저에서 직접 열어 보고,
// 검증은 validate_html_mockup 의 정적(source/filePath) 경로로만 수행한다.
