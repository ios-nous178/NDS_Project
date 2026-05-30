import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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

let cached: string | null | undefined;

/**
 * claude `--mcp-config` 로 넘길 설정 파일 경로를 반환. 번들 서버를 못 찾으면 null
 * (주입을 건너뛰고 에이전트 실행 자체는 막지 않는다).
 *
 * 결과는 userData/mcp/nudge-ds.mcp.json 에 1회 기록 후 캐시한다.
 */
export function ensureBundledMcpConfig(): string | null {
  if (cached !== undefined) return cached;

  const resolved = resolveMcpServerEntry();
  if (!resolved) {
    console.warn(
      "[harness] 번들 MCP 서버(server.js)를 찾지 못해 nudge-ds 자동 주입을 건너뜁니다. " +
        "(dev 라면 'pnpm build --filter @nudge-design/mcp' 후 재시작)",
    );
    cached = null;
    return null;
  }

  const env: Record<string, string> = {
    // Electron 바이너리를 순수 node 로 동작시킨다 (창/도크 없이 stdio MCP 만).
    ELECTRON_RUN_AS_NODE: "1",
  };
  // packaged 번들은 모노레포 디렉터리가 없어 자동 감지도 mcpb 로 떨어지지만 명시한다.
  // dev 경로는 강제하지 않는다 — 서버가 모노레포를 감지해 dev 모드로 동작해야 함.
  if (resolved.packaged) env.NUDGE_DS_INSTALL_MODE = "mcpb";

  const config = {
    mcpServers: {
      "nudge-ds": {
        command: process.execPath,
        args: [resolved.entry],
        env,
      },
    },
  };

  const dir = join(app.getPath("userData"), "mcp");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "nudge-ds.mcp.json");
  writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, "utf8");

  console.log(
    `[harness] 번들 MCP 자동 주입: ${file} → ${resolved.entry} ` +
      `(${resolved.packaged ? "packaged/mcpb" : "dev/monorepo"})`,
  );
  cached = file;
  return file;
}
