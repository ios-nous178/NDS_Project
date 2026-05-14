#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const bundleDir = path.resolve(process.argv[2] ?? path.join(ROOT, "dist-mcpb/nudge-eap-ds"));
const serverPath = path.join(bundleDir, "dist/server.js");

if (!fs.existsSync(serverPath)) {
  console.error(`[smoke-mcpb] server not found: ${serverPath}`);
  process.exit(1);
}

const child = spawn(process.execPath, [serverPath], {
  cwd: bundleDir,
  env: {
    ...process.env,
    NUDGE_EAP_DS_INSTALL_MODE: "mcpb",
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
    clientInfo: { name: "nudge-eap-mcpb-smoke", version: "0.0.0" },
  });
  notify("notifications/initialized", {});

  const tools = await request("tools/list", {});
  const toolNames = tools.tools?.map((tool) => tool.name) ?? [];
  if (!toolNames.includes("get_install_command")) {
    throw new Error(`get_install_command not found in tools/list: ${toolNames.join(", ")}`);
  }

  const call = await request("tools/call", {
    name: "get_install_command",
    arguments: {},
  });
  const text = call.content?.[0]?.text;
  const result = text ? JSON.parse(text) : null;
  if (!result?.ready || !Array.isArray(result.files) || result.files.length === 0) {
    throw new Error(`get_install_command returned unexpected result: ${text}`);
  }

  clearTimeout(timeout);
  child.kill();
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
  console.error(`[smoke-mcpb] ${message}`);
  if (stderrBuffer.trim()) {
    console.error("[smoke-mcpb] server stderr:");
    console.error(stderrBuffer.trim());
  }
  process.exit(1);
}
