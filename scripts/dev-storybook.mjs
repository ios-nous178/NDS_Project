import { spawn, spawnSync } from "node:child_process";

const DEFAULT_PORT = Number.parseInt(process.env.STORYBOOK_PORT ?? "6006", 10);
const MAX_PORT = DEFAULT_PORT + 20;

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
