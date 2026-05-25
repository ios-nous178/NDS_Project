import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createRequire } from "node:module";
import { getToolProcessEnv } from "./process-env.js";

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
      ? `Call check_preview with { "url": "${url}", "sessionId": "${id}" }.`
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

// playwright 는 외부 mockup 프로젝트의 optional runtime dep — MCP 자체에는 dep 아님.
// 타입을 import 하면 빌드가 깨지므로 any 로 둔다 (실제 동작은 시점별 module shape 에 의존).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlaywrightLike = any;

async function loadPlaywright(cwd: string): Promise<{
  module: PlaywrightLike | null;
  diagnostics: { triedPaths: string[]; lastError: string | null };
}> {
  const triedPaths: string[] = [];
  let lastError: string | null = null;
  const tryResolve = async (anchor: string) => {
    try {
      triedPaths.push(anchor);
      const requireFromAnchor = createRequire(anchor);
      const resolved = requireFromAnchor.resolve("playwright");
      const mod = (await import(resolved)) as PlaywrightLike;
      return mod;
    } catch (err) {
      lastError = (err as Error).message;
      return null;
    }
  };
  let mod = await tryResolve(path.join(cwd, "package.json"));
  // 2) MCP 자체 모듈에서 resolve — pnpm workspace 등에서 hoist 된 경우 fallback
  if (!mod) mod = await tryResolve(import.meta.url);
  // 3) cwd 의 모든 상위 디렉토리에서 resolve — monorepo 루트에 install 한 경우
  if (!mod) {
    let dir = path.resolve(cwd);
    const seen = new Set<string>();
    while (!seen.has(dir)) {
      seen.add(dir);
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
      const anchor = path.join(dir, "package.json");
      if (!fs.existsSync(anchor)) continue;
      mod = await tryResolve(anchor);
      if (mod) break;
    }
  }
  return { module: mod, diagnostics: { triedPaths, lastError } };
}

/**
 * 렌더드 DOM 을 캡처해 HTML 문자열로 돌려준다.
 * Vite/React 처럼 런타임에 nds-* 가 주입되는 워크스페이스에서 dist/index.html (정적 shell)
 * 을 그대로 validate 하면 DS 0% 가 나오는 문제를 풀기 위한 공용 헬퍼.
 *
 *  - sessionId 가 있으면 dev_server 의 URL/cwd 를 자동 사용
 *  - waitForSelector 가 지정되면 그 셀렉터가 등장할 때까지 대기 (단순 networkidle 보다 안정)
 *  - 출력: 성공 시 outerHTML 전체. 실패 시 phase/error 만.
 */
export async function snapshotRenderedHtml(args: {
  url?: string;
  routePath?: string;
  cwd?: string;
  sessionId?: string;
  timeoutMs?: number;
  viewport?: { width?: number; height?: number };
  waitForSelector?: string;
}) {
  const session = args.sessionId ? devServerSessions.get(args.sessionId) : undefined;
  const cwd = path.resolve(args.cwd ?? session?.cwd ?? process.cwd());
  const baseUrl = args.url ?? session?.url;
  if (!baseUrl) {
    return {
      ok: false as const,
      phase: "input",
      error:
        "snapshot_rendered_html 호출에 url 또는 sessionId 가 필요. dev_server({ action: 'start' }) 로 띄운 sessionId 를 전달하거나 url 을 직접 지정.",
    };
  }
  const url = joinUrl(baseUrl, args.routePath);
  const timeoutMs = args.timeoutMs ?? 15_000;

  const reachable = await waitForUrl(url, timeoutMs);
  if (!reachable.ok) {
    return {
      ok: false as const,
      url,
      phase: "http",
      error: reachable.error,
      devServerLogs: session?.logs.slice(-40),
    };
  }

  const { module: playwright, diagnostics: pwDiag } = await loadPlaywright(cwd);
  if (!playwright) {
    return {
      ok: false as const,
      url,
      phase: "browser",
      error:
        "Playwright module not resolvable from this project. " +
        `Tried: ${pwDiag.triedPaths.join(", ")}. Last resolve error: ${pwDiag.lastError ?? "n/a"}.`,
      install: ["npm install --save-dev playwright", "npx playwright install chromium"],
      httpStatus: reachable.status,
      note:
        "MCP looked in (1) <cwd>/node_modules, (2) MCP's own node_modules, (3) every ancestor dir. " +
        "If you installed Playwright in a different scope (global, sibling pkg) — install it into THIS mockup project's package.json so Node module resolution finds it.",
    };
  }

  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: {
        width: args.viewport?.width ?? 1440,
        height: args.viewport?.height ?? 900,
      },
    });
    await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs });
    if (args.waitForSelector) {
      try {
        await page.waitForSelector(args.waitForSelector, { timeout: timeoutMs });
      } catch (e) {
        return {
          ok: false as const,
          url,
          phase: "wait-for-selector",
          error: `waitForSelector('${args.waitForSelector}') timed out: ${(e as Error).message}`,
        };
      }
    } else {
      await page.waitForTimeout(300);
    }
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    return {
      ok: true as const,
      url,
      html,
      byteLength: Buffer.byteLength(html, "utf-8"),
      devServerLogs: session?.logs.slice(-20),
    };
  } finally {
    await browser.close();
  }
}

function joinUrl(baseUrl: string, routePath?: string) {
  if (!routePath) return baseUrl;
  const base = baseUrl.replace(/\/$/, "");
  const route =
    routePath.startsWith("/") || routePath.startsWith("#") ? routePath : `/${routePath}`;
  return route.startsWith("#") ? `${base}/${route}` : `${base}${route}`;
}

export async function checkPreview(args: {
  url?: string;
  routePath?: string;
  cwd?: string;
  sessionId?: string;
  timeoutMs?: number;
  minTextLength?: number;
  viewport?: { width?: number; height?: number };
}) {
  const session = args.sessionId ? devServerSessions.get(args.sessionId) : undefined;
  const cwd = path.resolve(args.cwd ?? session?.cwd ?? process.cwd());
  const baseUrl = args.url ?? session?.url ?? "http://127.0.0.1:5173";
  const url = joinUrl(baseUrl, args.routePath);
  const timeoutMs = args.timeoutMs ?? 15_000;
  const minTextLength = args.minTextLength ?? 8;

  const reachable = await waitForUrl(url, timeoutMs);
  if (!reachable.ok) {
    return {
      ok: false,
      url,
      phase: "http",
      error: reachable.error,
      devServerLogs: session?.logs.slice(-40),
    };
  }

  const { module: playwright, diagnostics: pwDiag } = await loadPlaywright(cwd);
  if (!playwright) {
    return {
      ok: false,
      url,
      phase: "browser",
      error:
        "Playwright module not resolvable from this project. " +
        `Tried: ${pwDiag.triedPaths.join(", ")}. Last resolve error: ${pwDiag.lastError ?? "n/a"}.`,
      install: ["npm install --save-dev playwright", "npx playwright install chromium"],
      httpStatus: reachable.status,
      note:
        "MCP looked in (1) <cwd>/node_modules, (2) MCP's own node_modules, (3) every ancestor dir. " +
        "If you installed Playwright in a different scope (global, sibling pkg) — install it into THIS mockup project's package.json so Node module resolution finds it.",
    };
  }

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: {
        width: args.viewport?.width ?? 1440,
        height: args.viewport?.height ?? 900,
      },
    });
    page.on("console", (message: { type: () => string; text: () => string }) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error: Error) => pageErrors.push(error.message));
    page.on(
      "requestfailed",
      (request: { url: () => string; failure: () => { errorText: string } | null }) => {
        failedRequests.push(`${request.url()} ${request.failure()?.errorText ?? ""}`.trim());
      },
    );

    await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs });
    await page.waitForTimeout(300);

    const renderState = await page.evaluate(() => {
      const root = document.getElementById("root") ?? document.body;
      const rootText = (root.textContent ?? "").trim();
      const bodyText = (document.body.textContent ?? "").trim();
      const visibleElementCount = [...document.body.querySelectorAll("*")].filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) !== 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      }).length;
      const viteOverlay = document.querySelector("vite-error-overlay");
      const viteOverlayText =
        viteOverlay?.shadowRoot?.textContent?.trim() ?? viteOverlay?.textContent?.trim() ?? "";
      const bodyRect = document.body.getBoundingClientRect();

      return {
        title: document.title,
        rootChildCount: root.children.length,
        rootTextLength: rootText.length,
        bodyTextLength: bodyText.length,
        visibleElementCount,
        bodyWidth: Math.round(bodyRect.width),
        bodyHeight: Math.round(bodyRect.height),
        viteOverlayText,
      };
    });

    const problems: string[] = [];
    if (pageErrors.length > 0) problems.push("pageerror");
    if (consoleErrors.length > 0) problems.push("console-error");
    if (renderState.viteOverlayText) problems.push("vite-error-overlay");
    if (renderState.rootChildCount === 0) problems.push("empty-root");
    if (renderState.bodyTextLength < minTextLength && renderState.visibleElementCount < 3) {
      problems.push("likely-blank-screen");
    }

    return {
      ok: problems.length === 0,
      url,
      problems,
      renderState,
      consoleErrors: consoleErrors.slice(0, 20),
      pageErrors: pageErrors.slice(0, 20),
      failedRequests: failedRequests.slice(0, 20),
      devServerLogs: session?.logs.slice(-40),
      suggestion:
        problems.length > 0
          ? "Fix the reported runtime/build error, then call check_preview again before reporting completion."
          : "Preview rendered without detected runtime errors or blank-screen symptoms.",
    };
  } finally {
    await browser.close();
  }
}
