import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "electron";

/**
 * 번들 MCP 자동 주입 — nudge-ds MCP 서버를 데스크탑 앱이 직접 띄우도록
 * claude `--mcp-config` 설정 파일을 생성한다.
 *
 * 핵심 설계:
 *  - 서버 런타임은 사용자 머신의 node 가 아니라 **Electron-as-node**
 *    (process.execPath + ELECTRON_RUN_AS_NODE=1)로 띄운다 → 받는 사람이
 *    node / MCP 를 따로 설치하지 않아도 nudge-ds 도구가 붙는다(앱 자체완결).
 *  - 번들 산출물은 `dist-mcpb/nudge-ds/`(pack-mcpb.mjs) 를 electron-builder
 *    extraResources 로 `resources/mcp/` 에 그대로 동봉한 것 → server + node_modules
 *    + catalog.json 이 한 트리에 있어 `install-mode = mcpb` 로 자동 동작.
 *  - **비-strict**(--strict-mcp-config 미사용): 사용자의 기존 MCP 서버 / 프로젝트
 *    .mcp.json 은 그대로 함께 로드되고, 그 위에 nudge-ds 만 얹는다.
 */

const __dirname_ = dirname(fileURLToPath(import.meta.url));

interface ResolvedEntry {
  /** server.js 절대 경로 */
  entry: string;
  /** packaged(extraResources) 번들이면 true → install-mode 를 mcpb 로 고정 */
  packaged: boolean;
}

/** 번들된(packaged) 또는 모노레포(dev) MCP 서버 진입점을 해석. 없으면 null. */
function resolveMcpServerEntry(): ResolvedEntry | null {
  const resourcesPath = (process as NodeJS.Process & { resourcesPath?: string }).resourcesPath;
  if (resourcesPath) {
    // esbuild 단일 파일 번들 — dist/tools/server.mjs 깊이여야 server 의 catalog/references
    // 경로 수식(__dirname/../ , __dirname/../..)이 모두 성립한다 (bundle-mcp-desktop.mjs 참고).
    const packaged = join(resourcesPath, "mcp", "dist", "tools", "server.mjs");
    if (existsSync(packaged)) return { entry: packaged, packaged: true };
  }

  // dev / 모노레포: dirname 에서 위로 올라가며 packages/mcp/dist/server.js 탐색.
  // (먼저 `pnpm build --filter @nudge-design/mcp` 로 dist 가 생성돼 있어야 한다.)
  let dir = __dirname_;
  for (let i = 0; i < 8; i += 1) {
    const candidate = join(dir, "packages", "mcp", "dist", "server.js");
    if (existsSync(candidate)) return { entry: candidate, packaged: false };
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** 번들 nudge-ds MCP 서버 실행 스펙 — claude(--mcp-config json) / codex(-c mcp_servers.*) 양쪽이 공유. */
export interface BundledMcpServerSpec {
  /** 서버를 띄울 실행 파일 = Electron-as-node (process.execPath). */
  command: string;
  /** server.mjs(packaged) 또는 dist/server.js(dev) 1건. */
  args: string[];
  /** 런타임 env (ELECTRON_RUN_AS_NODE + packaged sidecar 경로들). */
  env: Record<string, string>;
  /** packaged(extraResources) 번들이면 true. */
  packaged: boolean;
}

let cachedSpec: BundledMcpServerSpec | null | undefined;

/**
 * 번들 MCP 서버의 실행 스펙(command/args/env)을 해석한다. 못 찾으면 null.
 * claude 는 이걸 .mcp.json 으로 직렬화하고, codex 는 -c mcp_servers.* override 로 푼다.
 */
export function bundledMcpServerSpec(): BundledMcpServerSpec | null {
  if (cachedSpec !== undefined) return cachedSpec;
  const resolved = resolveMcpServerEntry();
  if (!resolved) return (cachedSpec = null);

  const env: Record<string, string> = {
    // Electron 바이너리를 순수 node 로 동작시킨다 (창/도크 없이 stdio MCP 만).
    ELECTRON_RUN_AS_NODE: "1",
  };
  // packaged 번들은 모노레포 디렉터리가 없어 자동 감지도 mcpb 로 떨어지지만 명시한다.
  // dev 경로는 강제하지 않는다 — 서버가 모노레포를 감지해 dev 모드로 동작해야 함.
  if (resolved.packaged) {
    env.NUDGE_DS_INSTALL_MODE = "mcpb";
    // prebuilt DS 단일 자산(html intent inline 의 자원) 위치를 명시 — single-file server.mjs 의
    // import.meta.url 기반 sidecar 추정이 빗나가도 확실히 찾게 한다(bundle-mcp-desktop 이 dist/standalone 에 복사).
    // entry = resources/mcp/dist/tools/server.mjs → ../standalone = resources/mcp/dist/standalone.
    env.NUDGE_DS_STANDALONE_DIR = join(dirname(resolved.entry), "..", "standalone");
    // DS 화면 이미지 자산(asset-inliner 가 목업 참조분만 base64 inline). 동일 패턴 →
    // ../assets = resources/mcp/dist/assets (bundle-mcp-desktop 이 dist/files 를 복사).
    env.NUDGE_DS_ASSETS_DIR = join(dirname(resolved.entry), "..", "assets");
    // find_icon({name}) 이 lazy 로드하는 아이콘 vanilla 정의(viewBox+body). 동일 패턴 →
    // ../icons/vanilla.js (bundle-mcp-desktop 이 packages/icons/dist/vanilla.js 를 복사).
    env.NUDGE_DS_ICONS_VANILLA = join(dirname(resolved.entry), "..", "icons", "vanilla.js");
  }

  return (cachedSpec = {
    command: process.execPath,
    args: [resolved.entry],
    env,
    packaged: resolved.packaged,
  });
}

/**
 * 번들 빌드 스탬프(BUILD_STAMP.json — bundle-mcp-desktop.mjs 가 git HEAD/시각 기록)를 읽어
 * 로그에 붙일 접미사로. 어떤 빌드의 MCP 가 붙었는지 packaged 앱 디버깅 때 보이게 한다(없으면 "").
 * entry = .../dist/tools/server.mjs → ../BUILD_STAMP.json = .../dist/BUILD_STAMP.json.
 */
function bundleStampSuffix(entry: string): string {
  try {
    const stampPath = join(dirname(entry), "..", "BUILD_STAMP.json");
    if (!existsSync(stampPath)) return "";
    const s = JSON.parse(readFileSync(stampPath, "utf8")) as { gitHead?: string; builtAt?: string };
    return ` [bundle ${s.gitHead ?? "?"} @ ${s.builtAt ?? "?"}]`;
  } catch {
    return "";
  }
}

let cached: string | null | undefined;

/**
 * claude `--mcp-config` 로 넘길 설정 파일 경로를 반환. 번들 서버를 못 찾으면 null
 * (주입을 건너뛰고 에이전트 실행 자체는 막지 않는다).
 *
 * 결과는 userData/mcp/nudge-ds.mcp.json 에 1회 기록 후 캐시한다.
 */
export function ensureBundledMcpConfig(): string | null {
  if (cached !== undefined) return cached;

  const spec = bundledMcpServerSpec();
  if (!spec) {
    console.warn(
      "[harness] 번들 MCP 서버(server.js)를 찾지 못해 nudge-ds 자동 주입을 건너뜁니다. " +
        "(dev 라면 'pnpm build --filter @nudge-design/mcp' 후 재시작)",
    );
    cached = null;
    return null;
  }

  const config = {
    mcpServers: {
      "nudge-ds": { command: spec.command, args: spec.args, env: spec.env },
    },
  };

  const dir = join(app.getPath("userData"), "mcp");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "nudge-ds.mcp.json");
  writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, "utf8");

  console.log(
    `[harness] 번들 MCP 자동 주입(claude): ${file} → ${spec.args[0]} ` +
      `(${spec.packaged ? "packaged/mcpb" : "dev/monorepo"})${bundleStampSuffix(spec.args[0])}`,
  );
  cached = file;
  return file;
}

/**
 * codex CLI 용 nudge-ds MCP 주입 인자. claude 의 --mcp-config(추가형) 등가물 —
 * codex 는 `-c mcp_servers.<name>.<key>=<TOML>` config override 로 서버를 얹는다.
 * (-c 는 전역 옵션이라 호출부에서 prompt/`resume` 서브커맨드보다 **앞에** 둬야 한다.)
 *
 * 값은 codex 가 TOML 로 파싱하므로 basic string("…")으로 직렬화한다 — Windows 경로의
 * 백슬래시·따옴표까지 안전하게 이스케이프된다. 번들을 못 찾으면 [](주입 생략, 실행은 계속).
 */
export function codexMcpConfigArgs(): string[] {
  const spec = bundledMcpServerSpec();
  if (!spec) {
    console.warn(
      "[harness] 번들 MCP 서버를 찾지 못해 codex nudge-ds 주입을 건너뜁니다. " +
        "(dev 라면 'pnpm build --filter @nudge-design/mcp' 후 재시작)",
    );
    return [];
  }
  // TOML basic string — 모든 경로/값에 안전(백슬래시·따옴표 이스케이프).
  const toml = (s: string): string => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  const argsToml = `[${spec.args.map(toml).join(", ")}]`;
  const envToml = `{ ${Object.entries(spec.env)
    .map(([k, v]) => `${k} = ${toml(v)}`)
    .join(", ")} }`;
  console.log(
    `[harness] 번들 MCP 자동 주입(codex): -c mcp_servers.nudge-ds → ${spec.args[0]} ` +
      `(${spec.packaged ? "packaged/mcpb" : "dev/monorepo"})${bundleStampSuffix(spec.args[0])}`,
  );
  return [
    "-c",
    `mcp_servers.nudge-ds.command=${toml(spec.command)}`,
    "-c",
    `mcp_servers.nudge-ds.args=${argsToml}`,
    "-c",
    `mcp_servers.nudge-ds.env=${envToml}`,
  ];
}
