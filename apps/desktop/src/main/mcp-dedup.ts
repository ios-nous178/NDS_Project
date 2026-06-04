/**
 * DS MCP 중복 제거 (harness-wins). electron 비의존(순수 node fs/child_process) — `node --test`
 * 로 단위 테스트한다(mcp-config.ts 는 `electron` 의 app 을 import 해 plain node 에서 못 띄움).
 *
 * 문제: 받는 사람/개발자가 DS MCP 를 직접 등록(어떤 이름이든)해두면 하네스 주입분(nudge-ds)과
 * 2개가 로드된다. 하네스는 **동봉 번들이 SSOT** 여야 스탬프/버전 보고가 일관되므로, 기존 DS
 * 서버는 끄고 우리 nudge-ds 만 남긴다.
 *  - codex : `codex mcp list --json` 으로 찾아 `-c mcp_servers.<name>.enabled=false` (모든 스코프).
 *  - claude: project(.mcp.json) 은 settings `disabledMcpjsonServers` 로 끄고, user/local 스코프는
 *            --strict-mcp-config(=figma 등 다른 서버까지 죽음) 없이는 못 끄므로 경고만(best-effort).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/** 하네스가 주입하는 서버 이름(이건 절대 끄지 않는다). */
export const HARNESS_MCP_NAME = "nudge-ds";

/** 등록된 MCP 서버가 우리 DS 서버인지 — 이름이 아니라 **실행 타깃 경로**로 판별(별칭 무관). */
const DS_SERVER_PATH_MARKERS = [
  "packages/mcp/dist/server.js", // monorepo dev (node ...)
  "dist/tools/server.mjs", // packaged 번들(mcpb, Electron-as-node)
  "@nudge-design/mcp", // 퍼블리시 패키지(npx @nudge-design/mcp)
];

/** command + args 토큰이 DS MCP 서버 실행을 가리키는가. PURE. */
export function looksLikeDsServer(commandAndArgs: string[]): boolean {
  const hay = commandAndArgs.join(" ");
  return DS_SERVER_PATH_MARKERS.some((m) => hay.includes(m));
}

/**
 * dev 탈출구 — 본인이 MCP 를 *개발 중*이라 라이브 빌드(monorepo dist)를 그대로 쓰고 싶을 때.
 * NUDGE_DS_KEEP_USER_MCP=1 이면 하네스가 기존 DS 서버를 끄지 않는다(중복 감수).
 */
export function keepUserMcp(): boolean {
  const v = process.env.NUDGE_DS_KEEP_USER_MCP;
  return v === "1" || v === "true";
}

// ── codex ───────────────────────────────────────────────────────────────────────

/** `codex mcp list --json` 의 서버 1건(우리가 읽는 최소 형태). */
export interface CodexMcpListEntry {
  name?: unknown;
  transport?: { command?: unknown; args?: unknown };
}

/**
 * PURE: codex 가 이미 등록한 서버 목록에서 **끌(= DS 중복)** 서버 이름을 고른다.
 * 우리 주입 이름(nudge-ds)은 제외하고, 실행 타깃이 DS 서버를 가리키는 것만.
 */
export function codexDuplicateDsServerNames(servers: CodexMcpListEntry[]): string[] {
  const out: string[] = [];
  for (const s of servers) {
    if (typeof s?.name !== "string" || s.name === HARNESS_MCP_NAME) continue;
    const t = s.transport ?? {};
    const cmd = typeof t.command === "string" ? t.command : "";
    const args = Array.isArray(t.args)
      ? t.args.filter((a): a is string => typeof a === "string")
      : [];
    if (looksLikeDsServer([cmd, ...args])) out.push(s.name);
  }
  return out;
}

/** 이름 목록 → codex 비활성화 `-c` 인자(`mcp_servers.<name>.enabled=false`). PURE. */
export function codexDisableArgsFor(names: string[]): string[] {
  return names.flatMap((n) => ["-c", `mcp_servers.${n}.enabled=false`]);
}

/**
 * 기존 DS 중복 서버를 끄는 codex `-c` 인자. `codex mcp list --json` 을 best-effort 로 조회 —
 * codex 구버전(--json 미지원)·오류·탈출구면 [](주입 자체는 codexMcpConfigArgs 가 별개로 처리하므로
 * 실패해도 무해). 호출부에서 codexMcpArgs 앞에 붙인다.
 */
export function codexDisableDuplicateDsArgs(codexBin: string, env: NodeJS.ProcessEnv): string[] {
  if (keepUserMcp()) return [];
  let parsed: unknown;
  try {
    // Windows .cmd/.bat 은 직접 실행 불가 → cmd.exe /c 경유(spawn 경로와 동일 규칙).
    const useCmd = process.platform === "win32" && /\.(cmd|bat)$/i.test(codexBin);
    const file = useCmd ? (process.env.ComSpec ?? process.env.COMSPEC ?? "cmd.exe") : codexBin;
    const a = ["mcp", "list", "--json"];
    const fullArgs = useCmd ? ["/d", "/s", "/c", codexBin, ...a] : a;
    const out = execFileSync(file, fullArgs, {
      env,
      timeout: 8000,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    });
    parsed = JSON.parse(out);
  } catch {
    return []; // 미발견/구버전/타임아웃 → 멱등하게 스킵
  }
  if (!Array.isArray(parsed)) return [];
  const names = codexDuplicateDsServerNames(parsed as CodexMcpListEntry[]);
  if (names.length) {
    console.log(
      `[harness] codex 기존 DS MCP 중복 비활성화: ${names.join(", ")} ` +
        `→ 하네스 번들 ${HARNESS_MCP_NAME} 우선 (해제: NUDGE_DS_KEEP_USER_MCP=1)`,
    );
  }
  return codexDisableArgsFor(names);
}

// ── claude ────────────────────────────────────────────────────────────────────────
// claude 는 codex 의 `-c enabled=false` 같은 범용 per-server 차단이 없다. 유일한 레버는
// settings 의 `disabledMcpjsonServers` 인데 이건 **project 스코프(.mcp.json) 서버만** 끈다.

/** claude config 에서 찾은 DS 중복 서버 — 끌 수 있는 것(.mcp.json) / 경고만(user·local) 으로 분류. */
export interface ClaudeDsDuplicates {
  /** project 스코프(.mcp.json) — disabledMcpjsonServers 로 비활성화 가능. */
  disableable: string[];
  /** user/local 스코프(~/.claude.json) — 비활성화 불가, 경고만. */
  unmanageable: string[];
}

/** PURE: claude mcpServers 맵에서 DS 서버 이름을 sink 에 모은다. */
export function scanDsServers(servers: unknown, sink: Set<string>): void {
  if (!servers || typeof servers !== "object") return;
  for (const [name, cfg] of Object.entries(servers as Record<string, unknown>)) {
    if (name === HARNESS_MCP_NAME) continue;
    const c = (cfg ?? {}) as { command?: unknown; args?: unknown; url?: unknown };
    const target =
      typeof c.command === "string" ? c.command : typeof c.url === "string" ? c.url : "";
    const args = Array.isArray(c.args)
      ? c.args.filter((a): a is string => typeof a === "string")
      : [];
    if (looksLikeDsServer([target, ...args])) sink.add(name);
  }
}

/**
 * claude 의 등록 MCP 중 DS 중복을 best-effort 로 찾는다. fs 만 읽고(파싱 실패는 무시) 부수효과 없음.
 *  - `<cwd>/.mcp.json` (project)            → disableable
 *  - `~/.claude.json` 의 mcpServers(user)     → unmanageable
 *  - `~/.claude.json` 의 projects[cwd](local) → unmanageable
 */
export function detectClaudeDsDuplicates(
  cwd: string,
  home: string = homedir(),
): ClaudeDsDuplicates {
  const disableable = new Set<string>();
  const unmanageable = new Set<string>();
  if (keepUserMcp()) return { disableable: [], unmanageable: [] };

  try {
    const p = join(cwd, ".mcp.json");
    if (existsSync(p)) {
      const j = JSON.parse(readFileSync(p, "utf8")) as { mcpServers?: unknown };
      scanDsServers(j.mcpServers, disableable);
    }
  } catch {
    /* .mcp.json 파싱 실패 무시 */
  }

  try {
    const cj = join(home, ".claude.json");
    if (existsSync(cj)) {
      const d = JSON.parse(readFileSync(cj, "utf8")) as {
        mcpServers?: unknown;
        projects?: Record<string, { mcpServers?: unknown }>;
      };
      scanDsServers(d.mcpServers, unmanageable);
      scanDsServers(d.projects?.[cwd]?.mcpServers, unmanageable);
    }
  } catch {
    /* ~/.claude.json 파싱 실패 무시 */
  }

  // .mcp.json 과 user 양쪽에 같은 이름이 있으면 disableable 우선(끌 수 있는 쪽).
  for (const n of disableable) unmanageable.delete(n);
  return { disableable: [...disableable], unmanageable: [...unmanageable] };
}
