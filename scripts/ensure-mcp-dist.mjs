#!/usr/bin/env node
/**
 * ensure-mcp-dist.mjs — 데스크탑 dev 전에 nudge-ds MCP dist 가 있는지 보장한다.
 *
 * 왜: apps/desktop 은 dev 모드에서 packages/mcp/dist/server.js 를 --mcp-config 로 띄운다
 * (mcp-config.ts resolveMcpServerEntry 의 dev 경로). 그런데 dist/ 는 .gitignore 라
 * **fresh clone** 에는 없다 — 그러면 ensureBundledMcpConfig 가 null 을 돌려주고 세션이
 * nudge-ds 도구 0개로 **조용히** 시작한다(console.warn 만). dev 시작 직전에 한 번 점검해
 * 없을 때만 빌드해서, 이 silent degradation 을 자가복구한다.
 *
 * 이미 빌드돼 있으면(흔한 경우) existsSync 한 번으로 즉시 통과 — dev 시작 지연 없음.
 * 빌드가 필요할 때만 `pnpm build --filter @nudge-design/mcp` (turbo 가 mockup-core/assets/
 * icons/html 의존까지 순서대로 빌드)로 채운다.
 *
 * desktop package.json 의 `dev` 가 이 스크립트를 chain 한다 (pre-script 자동실행에 의존하지 않음).
 */
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const serverJs = join(ROOT, "packages", "mcp", "dist", "server.js");

if (existsSync(serverJs)) process.exit(0); // 이미 빌드됨 — 통과.

console.log(
  "[ensure-mcp-dist] packages/mcp/dist/server.js 없음 — nudge-ds MCP 를 빌드합니다 " +
    "(fresh clone 자가복구, dev 가 도구 없이 조용히 시작하는 것 방지)…",
);
try {
  execFileSync("pnpm", ["build", "--filter", "@nudge-design/mcp"], {
    cwd: ROOT,
    stdio: "inherit",
    // Windows 의 pnpm 은 .cmd shim — no-shell execFileSync 가 EINVAL 날 수 있어 shell 경유.
    shell: process.platform === "win32",
  });
} catch (e) {
  console.warn(
    `[ensure-mcp-dist] MCP 빌드 실패 — dev 는 계속되지만 nudge-ds 도구 없이 시작될 수 있습니다: ${String(e)}`,
  );
  // dev 자체를 막지는 않는다(빌드 실패해도 앱은 떠야 함). non-zero 로 chain 을 끊지 않도록 0 종료.
}
