#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// --source 모드: 패킹된 .mcpb 번들이 아니라 packages/mcp 소스 빌드 산출물
// (packages/mcp/dist/server.js) 을 직접 실행한다. pre-push 훅에서 패킹 비용 없이
// 서버 부팅 + tool dispatch 만 빠르게 검증하려는 용도. tgz 가 들어있는 번들이
// 아니므로 get_setup({step:'install'}) 의 ready 플래그는 검사하지 않는다.
const positional = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const sourceMode = process.argv.includes("--source");
const defaultBundleDir = sourceMode
  ? path.join(ROOT, "packages/mcp")
  : path.join(ROOT, "dist-mcpb/nudge-ds");
const bundleDir = path.resolve(positional[0] ?? defaultBundleDir);
let runtimeDir = bundleDir;
let tempRoot = null;

if (!sourceMode) {
  tempRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "nudge-mcpb-smoke-")));
  runtimeDir = path.join(tempRoot, "bundle");
  fs.cpSync(bundleDir, runtimeDir, {
    recursive: true,
    force: true,
    verbatimSymlinks: true,
    filter: (src) => path.basename(src) !== ".DS_Store",
  });
}

// source 모드: packages/mcp 의 tsc 산출물(dist/server.js)을 직접 실행한다.
// bundle 모드: pack-mcpb 가 esbuild 로 만든 단일 파일(dist/tools/server.mjs).
//   ← manifest.json 의 server.entry_point 와 동일해야 한다 (SSOT).
const serverPath = path.join(runtimeDir, sourceMode ? "dist/server.js" : "dist/tools/server.mjs");

if (!fs.existsSync(serverPath)) {
  console.error(`[smoke-mcpb] server not found: ${serverPath}`);
  process.exit(1);
}

console.log(
  `[smoke-mcpb] mode=${sourceMode ? "source" : "bundle"} dir=${bundleDir}` +
    (tempRoot ? ` isolated=${runtimeDir}` : ""),
);

const child = spawn(process.execPath, [serverPath], {
  cwd: runtimeDir,
  env: {
    ...process.env,
    NUDGE_DS_INSTALL_MODE: "mcpb",
  },
  stdio: ["pipe", "pipe", "pipe"],
});

let stdoutBuffer = "";
let stderrBuffer = "";
const pending = new Map();
let nextId = 1;

const timeout = setTimeout(() => {
  fail("Timed out waiting for MCP server response");
}, 15000);

child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  stdoutBuffer += chunk;
  let newlineIndex = stdoutBuffer.indexOf("\n");
  while (newlineIndex !== -1) {
    const line = stdoutBuffer.slice(0, newlineIndex).trim();
    stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);
    if (line) handleMessage(line);
    newlineIndex = stdoutBuffer.indexOf("\n");
  }
});

child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => {
  stderrBuffer += chunk;
});

child.on("exit", (code, signal) => {
  if (pending.size > 0) {
    fail(`MCP server exited before smoke test completed (code=${code}, signal=${signal})`);
  }
});

try {
  await request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "nudge-mcpb-smoke", version: "0.0.0" },
  });
  notify("notifications/initialized", {});

  const tools = await request("tools/list", {});
  const toolNames = tools.tools?.map((tool) => tool.name) ?? [];
  if (!toolNames.includes("get_setup")) {
    throw new Error(`get_setup not found in tools/list: ${toolNames.join(", ")}`);
  }

  const call = await request("tools/call", {
    name: "get_setup",
    arguments: { step: "install" },
  });
  const text = call.content?.[0]?.text;
  const result = text ? JSON.parse(text) : null;
  // source 모드는 packed bundle 이 아니라 dev tree 를 가리키므로 ready 는 false 일 수 있다.
  // 핵심은 tool 이 정상 응답을 만들었는지 확인.
  // 신규: _visualReferenceFirstResponse 가 포함된 시각 레퍼런스 게이트 응답도 정상으로 간주한다.
  const isGate = !!result?._visualReferenceFirstResponse;
  const readyOk = isGate || (sourceMode ? true : result?.ready === true);
  const hasFiles = isGate || (Array.isArray(result?.files) && result.files.length > 0);
  if (!readyOk || !hasFiles) {
    throw new Error(`get_setup({step:'install'}) returned unexpected result: ${text}`);
  }

  const brands = await callTool("get_brand", {});
  if (!Array.isArray(brands?.brands) || brands.brands.length === 0) {
    throw new Error(`get_brand returned unexpected result: ${JSON.stringify(brands)}`);
  }

  // figma-sync 회귀 가드 — list_figma_sync_status 별칭 도구는 제거됨(get_guide 가 정식 경로).
  // get_guide({topic:'figma-sync'}) 가 같은 listFigmaSyncStatus() 데이터를 돌려주는지 확인.
  const figmaSync = await callTool("get_guide", { topic: "figma-sync" });
  if (!Array.isArray(figmaSync?.entries) || typeof figmaSync?.syncedCount !== "number") {
    throw new Error(
      `get_guide({topic:'figma-sync'}) returned unexpected result: ${JSON.stringify(figmaSync)}`,
    );
  }

  const imports = await callTool("get_setup", { step: "imports", brand: "trost" });
  // intent 미지정이면 기본 html — imports 는 코드 대신 {intent:'html', required:false, message}
  // (build_singlefile_html 이 runtime/CSS 를 자동 inline 하므로 임포트 불필요) 를 반환한다.
  // admin-cms(React) 트랙만 실제 import code 를 돌려준다. 둘 다 정상 응답으로 간주.
  const isHtmlImportsInfo =
    imports?.intent === "html" &&
    typeof imports?.message === "string" &&
    imports.message.length > 0;
  const hasDsStyleImport =
    typeof imports?.code === "string" &&
    (imports.code.includes("@nudge-design/react/styles.css") ||
      imports.code.includes("@nudge-design/html/styles.css") ||
      imports.code.includes("nudge-ds.runtime.js") ||
      imports.code.includes("/standalone/"));
  if (!isHtmlImportsInfo && !hasDsStyleImport) {
    throw new Error(
      `get_setup({step:'imports'}) returned unexpected result: ${JSON.stringify(imports)}`,
    );
  }

  // validate_html_mockup: report 기본 true 라서 시트 webhook 까지 타지 않게 dryRun 으로 호출.
  // 산출물에 ds-badge 가 없으니 위반은 발생함 (ok=false 가 정상) — 응답 shape 만 검사.
  const validation = await callTool("validate_html_mockup", {
    source: `<!doctype html>
<html>
  <body>
    <nds-button color="primary">Start</nds-button>
  </body>
</html>`,
    report: false,
  });
  if (typeof validation?.ok !== "boolean" || !Array.isArray(validation?.violations)) {
    throw new Error(
      `validate_html_mockup returned unexpected result: ${JSON.stringify(validation)}`,
    );
  }

  clearTimeout(timeout);
  child.kill();
  cleanup();
  console.log("[smoke-mcpb] ok");
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function request(method, params) {
  const id = nextId++;
  const message = { jsonrpc: "2.0", id, method, params };
  child.stdin.write(`${JSON.stringify(message)}\n`);
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

function notify(method, params) {
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`);
}

async function callTool(name, args) {
  const call = await request("tools/call", {
    name,
    arguments: args,
  });
  const text = call.content?.[0]?.text;
  if (!text) throw new Error(`${name} returned no text content`);
  return JSON.parse(text);
}

function handleMessage(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }

  if (message.id === undefined) return;
  const waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);

  if (message.error) {
    waiter.reject(new Error(JSON.stringify(message.error)));
    return;
  }
  waiter.resolve(message.result);
}

function fail(message) {
  clearTimeout(timeout);
  for (const waiter of pending.values()) {
    waiter.reject(new Error(message));
  }
  pending.clear();
  child.kill();
  cleanup();
  console.error(`[smoke-mcpb] ${message}`);
  if (stderrBuffer.trim()) {
    console.error("[smoke-mcpb] server stderr:");
    console.error(stderrBuffer.trim());
  }
  process.exit(1);
}

function cleanup() {
  if (!tempRoot) return;
  fs.rmSync(tempRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  tempRoot = null;
}
