import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  looksLikeDsServer,
  codexDuplicateDsServerNames,
  codexDisableArgsFor,
  scanDsServers,
  detectClaudeDsDuplicates,
  HARNESS_MCP_NAME,
  type CodexMcpListEntry,
} from "./mcp-dedup.ts";

// ── looksLikeDsServer: 경로 마커 기반(이름 무관) ────────────────────────────────
test("looksLikeDsServer: DS 서버 경로 3종 매치", () => {
  assert.equal(looksLikeDsServer(["node", "/x/packages/mcp/dist/server.js"]), true); // monorepo
  assert.equal(looksLikeDsServer(["/electron", "/r/mcp/dist/tools/server.mjs"]), true); // 번들
  assert.equal(looksLikeDsServer(["npx", "@nudge-design/mcp"]), true); // 퍼블리시
});

test("looksLikeDsServer: 무관 서버는 false", () => {
  assert.equal(looksLikeDsServer(["npx", "-y", "@zeplin/mcp-server@latest"]), false);
  assert.equal(looksLikeDsServer(["https://mcp.figma.com/mcp"]), false);
  assert.equal(looksLikeDsServer([]), false);
});

// ── codex: mcp list --json → 끌 서버 이름 ──────────────────────────────────────
test("codexDuplicateDsServerNames: 다른 이름의 DS 서버만 고른다", () => {
  const servers: CodexMcpListEntry[] = [
    {
      name: "nudge-eap-ds",
      transport: { command: "node", args: ["/a/packages/mcp/dist/server.js"] },
    },
    { name: "figma", transport: { command: "npx", args: ["@figma/mcp"] } },
    { name: "zeplin", transport: { command: "npx", args: ["-y", "@zeplin/mcp-server@latest"] } },
  ];
  assert.deepEqual(codexDuplicateDsServerNames(servers), ["nudge-eap-ds"]);
});

test("codexDuplicateDsServerNames: 하네스 주입 이름(nudge-ds)은 제외", () => {
  const servers: CodexMcpListEntry[] = [
    {
      name: HARNESS_MCP_NAME,
      transport: { command: "node", args: ["/x/packages/mcp/dist/server.js"] },
    },
  ];
  assert.deepEqual(codexDuplicateDsServerNames(servers), []);
});

test("codexDuplicateDsServerNames: 깨진/누락 엔트리는 안전하게 무시", () => {
  const servers = [
    { transport: { command: "node", args: ["/x/packages/mcp/dist/server.js"] } }, // name 없음
    { name: 123 }, // name 비문자열
    { name: "no-transport" }, // transport 없음
    { name: "weird-args", transport: { command: "node", args: "notarray" } }, // args 비배열
  ] as unknown as CodexMcpListEntry[];
  assert.deepEqual(codexDuplicateDsServerNames(servers), []);
});

test("codexDisableArgsFor: 이름 → -c enabled=false 인자", () => {
  assert.deepEqual(codexDisableArgsFor(["a", "b"]), [
    "-c",
    "mcp_servers.a.enabled=false",
    "-c",
    "mcp_servers.b.enabled=false",
  ]);
  assert.deepEqual(codexDisableArgsFor([]), []);
});

// ── claude: scanDsServers ──────────────────────────────────────────────────────
test("scanDsServers: DS 서버 이름만 sink 에 추가, nudge-ds 제외", () => {
  const sink = new Set<string>();
  scanDsServers(
    {
      "nudge-ds": { command: "node", args: ["/x/packages/mcp/dist/server.js"] }, // 제외
      "my-ds": { command: "node", args: ["/y/packages/mcp/dist/server.js"] },
      figma: { url: "https://mcp.figma.com/mcp" },
    },
    sink,
  );
  assert.deepEqual([...sink], ["my-ds"]);
});

test("scanDsServers: null/비객체는 무해", () => {
  const sink = new Set<string>();
  scanDsServers(null, sink);
  scanDsServers(undefined, sink);
  scanDsServers("nope", sink);
  assert.equal(sink.size, 0);
});

// ── claude: detectClaudeDsDuplicates (.mcp.json=disableable / claude.json=unmanageable) ──
function fixture(): { cwd: string; home: string } {
  const root = mkdtempSync(join(tmpdir(), "nudge-dedup-test-"));
  const cwd = join(root, "proj");
  const home = join(root, "home");
  mkdirSync(cwd, { recursive: true });
  mkdirSync(home, { recursive: true });
  return { cwd, home };
}

test("detectClaudeDsDuplicates: project(.mcp.json)=disableable, user/local=unmanageable", () => {
  const { cwd, home } = fixture();
  writeFileSync(
    join(cwd, ".mcp.json"),
    JSON.stringify({
      mcpServers: {
        "dup-proj": { command: "node", args: ["/z/packages/mcp/dist/server.js"] },
        figma: { url: "https://mcp.figma.com/mcp" },
      },
    }),
  );
  writeFileSync(
    join(home, ".claude.json"),
    JSON.stringify({
      mcpServers: {
        "dup-user": { command: "npx", args: ["@nudge-design/mcp"] },
        zeplin: { command: "npx" },
      },
      projects: {
        [cwd]: {
          mcpServers: { "dup-local": { command: "/e", args: ["/r/dist/tools/server.mjs"] } },
        },
      },
    }),
  );
  const r = detectClaudeDsDuplicates(cwd, home);
  assert.deepEqual(r.disableable, ["dup-proj"]);
  assert.deepEqual(r.unmanageable.sort(), ["dup-local", "dup-user"]);
});

test("detectClaudeDsDuplicates: 같은 이름이 양쪽에 있으면 disableable 우선", () => {
  const { cwd, home } = fixture();
  writeFileSync(
    join(cwd, ".mcp.json"),
    JSON.stringify({
      mcpServers: { dup: { command: "node", args: ["/packages/mcp/dist/server.js"] } },
    }),
  );
  writeFileSync(
    join(home, ".claude.json"),
    JSON.stringify({
      mcpServers: { dup: { command: "node", args: ["/packages/mcp/dist/server.js"] } },
    }),
  );
  const r = detectClaudeDsDuplicates(cwd, home);
  assert.deepEqual(r.disableable, ["dup"]);
  assert.deepEqual(r.unmanageable, []);
});

test("detectClaudeDsDuplicates: 파일 없으면 빈 결과(무해)", () => {
  const { cwd, home } = fixture();
  const r = detectClaudeDsDuplicates(cwd, home);
  assert.deepEqual(r, { disableable: [], unmanageable: [] });
});

test("detectClaudeDsDuplicates: NUDGE_DS_KEEP_USER_MCP=1 이면 감지 스킵", () => {
  const { cwd, home } = fixture();
  writeFileSync(
    join(cwd, ".mcp.json"),
    JSON.stringify({
      mcpServers: { dup: { command: "node", args: ["/packages/mcp/dist/server.js"] } },
    }),
  );
  const prev = process.env.NUDGE_DS_KEEP_USER_MCP;
  process.env.NUDGE_DS_KEEP_USER_MCP = "1";
  try {
    assert.deepEqual(detectClaudeDsDuplicates(cwd, home), { disableable: [], unmanageable: [] });
  } finally {
    if (prev === undefined) delete process.env.NUDGE_DS_KEEP_USER_MCP;
    else process.env.NUDGE_DS_KEEP_USER_MCP = prev;
  }
});
