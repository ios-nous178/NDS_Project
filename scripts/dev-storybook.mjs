import { spawn, spawnSync } from "node:child_process";
import { existsSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const DEFAULT_PORT = Number.parseInt(process.env.STORYBOOK_PORT ?? "6006", 10);
const MAX_PORT = DEFAULT_PORT + 20;

/* ── 1. 사전 빌드 ─────────────────────────────────────────────
 * preview.ts / project-themes.ts 가 packages/{tokens,react}/dist 의 CSS 를
 * import 하므로, dist 가 없거나 stale 이면 스토리북이 옛 스타일을 보여준다.
 * turbo 가 토폴로지(tokens → icons → styles → react)와 캐시를 처리한다.
 * mcp/html 은 스토리북에 불필요해서 react 의존 체인만 빌드. */

function prebuild() {
  console.log("[storybook] DS 패키지 사전 빌드 중 (tokens → styles → react)...");
  const result = spawnSync(
    "pnpm",
    ["turbo", "build", "--filter=@nudge-design/react...", "--output-logs=errors-only"],
    { cwd: repoRoot, stdio: "inherit", shell: process.platform === "win32" },
  );

  if (result.status !== 0) {
    console.error("[storybook] 사전 빌드 실패 — 위 로그를 확인하세요.");
    process.exit(result.status ?? 1);
  }

  const requiredDist = ["packages/tokens/dist/tokens.css", "packages/react/dist/styles.css"];
  for (const rel of requiredDist) {
    if (!existsSync(path.join(repoRoot, rel))) {
      console.error(`[storybook] 빌드 후에도 ${rel} 이 없습니다. 빌드 체인을 확인하세요.`);
      process.exit(1);
    }
  }
}

/* ── 2. 토큰/스타일 소스 watch ────────────────────────────────
 * 스토리북 vite 는 컴포넌트(tsx)는 src 로 live 추적하지만 CSS 는 dist 를
 * 읽는다. 소스 변경 시 dist 를 재생성해 주면 vite 가 파일 변경을 감지해
 * 자동 reload 한다.
 *  - tokens/src 변경 → tokens build(dist css 5종) + styles 재추출 + react 복사
 *    (styles 의 extract-styles.mjs 가 tokens/src 를 직접 읽으므로 함께 재생성)
 *  - styles/src 변경 → styles 재추출 + react 복사만 (react tsc 불필요) */

const rebuildCommands = {
  tokens: [
    ["pnpm", ["--filter", "@nudge-design/tokens", "build"]],
    ["node", ["packages/styles/scripts/extract-styles.mjs"]],
    ["node", ["packages/react/scripts/copy-styles.mjs"]],
  ],
  styles: [
    ["node", ["packages/styles/scripts/extract-styles.mjs"]],
    ["node", ["packages/react/scripts/copy-styles.mjs"]],
  ],
};

let rebuilding = false;
let queued = null;

function runRebuild(kind) {
  if (rebuilding) {
    // tokens 재빌드가 styles 재빌드를 포함하므로 더 넓은 쪽으로 큐잉
    queued = queued === "tokens" ? "tokens" : kind;
    return;
  }
  rebuilding = true;
  console.log(`[storybook] ${kind} 소스 변경 감지 → dist 재생성...`);

  for (const [cmd, args] of rebuildCommands[kind]) {
    const result = spawnSync(cmd, args, {
      cwd: repoRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (result.status !== 0) {
      console.error(`[storybook] 재생성 실패 (${cmd} ${args.join(" ")}) — 소스를 확인하세요.`);
      break;
    }
  }

  rebuilding = false;
  if (queued) {
    const next = queued;
    queued = null;
    runRebuild(next);
  }
}

function watchSources() {
  const targets = [
    { dir: "packages/tokens/src", kind: "tokens" },
    { dir: "packages/styles/src", kind: "styles" },
  ];
  const timers = new Map();

  for (const { dir, kind } of targets) {
    const abs = path.join(repoRoot, dir);
    try {
      // recursive watch 는 darwin/win32 만 지원 — 미지원 플랫폼은 사전 빌드만으로 동작
      watch(abs, { recursive: true }, () => {
        clearTimeout(timers.get(kind));
        timers.set(
          kind,
          setTimeout(() => runRebuild(kind), 300),
        );
      });
      console.log(`[storybook] watching ${dir} → 변경 시 dist CSS 자동 재생성`);
    } catch {
      console.warn(
        `[storybook] ${dir} watch 미지원 플랫폼 — 토큰/스타일 수정 시 pnpm build --filter @nudge-design/tokens 후 새로고침하세요.`,
      );
    }
  }
}

/* ── 3. 포트 탐색 + 스토리북 기동 ───────────────────────────── */

function isPortAvailable(port) {
  const result = spawnSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"], {
    stdio: "ignore",
  });

  return result.status !== 0;
}

function findOpenPort(start, end) {
  for (let port = start; port <= end; port += 1) {
    if (isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`No available port found between ${start} and ${end}.`);
}

prebuild();
watchSources();

const port = findOpenPort(DEFAULT_PORT, MAX_PORT);

if (port !== DEFAULT_PORT) {
  console.log(`[storybook] Port ${DEFAULT_PORT} is busy, starting on ${port} instead.`);
}

const child = spawn("pnpm", ["exec", "storybook", "dev", "-p", String(port), "--exact-port"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    STORYBOOK_PORT: String(port),
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
