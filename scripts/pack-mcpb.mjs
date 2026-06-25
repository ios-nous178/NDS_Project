#!/usr/bin/env node
/**
 * pack-mcpb.mjs — Claude Desktop Extension(.mcpb) 번들 생성
 *
 * 결과물: dist-mcpb/nudge-ds.mcpb (= zip 파일)
 *
 * 사용:
 *   node scripts/pack-mcpb.mjs                # 풀 빌드 + 패킹
 *   node scripts/pack-mcpb.mjs --no-build     # 빌드 생략 (이미 빌드된 상태)
 *
 * 번들 구조 (= bundle-mcp-desktop 과 동일한 single-file 레이아웃):
 *   manifest.json                      ← mcpb 스펙 (Claude Desktop 이 루트에서 읽음)
 *   dist/
 *     tools/server.mjs                 ← esbuild 단일 파일 (workspace deps 까지 인라인)
 *     catalog.json                     ← server 의 __dirname/../catalog.json
 *     manifest.json                    ← server 의 __dirname/../manifest.json (version 표시용)
 *     standalone/                      ← prebuilt DS 단일 자산 (../standalone sidecar)
 *     assets/                          ← DS 화면 이미지 (../assets sidecar)
 *     icons/vanilla.js                 ← find_icon({name}) vanilla 정의 (../icons/vanilla.js)
 *     local-packages/*.tgz             ← get_setup 가 외부 목업 프로젝트에 설치 안내하는 DS .tgz
 *
 * 왜 esbuild 단일 파일인가:
 *  - MCP 서버는 @nudge-design/mockup-core·assets·icons(workspace) 를 런타임에 정적 import 한다.
 *    예전의 npm-install 방식은 이 workspace 패키지(특히 mockup-core)를 node_modules 에 넣지 못해
 *    `ERR_MODULE_NOT_FOUND: @nudge-design/mockup-core` 로 부팅이 깨졌다.
 *  - esbuild 로 전부 인라인하면 node_modules / local-packages 시드 없이 한 파일로 동작한다.
 *    (apps/desktop 의 bundle-mcp-desktop.mjs 와 동일한 해결책 — 그쪽은 이미 이 방식이다.)
 *
 * 왜 dist/tools/server.mjs 깊이인가:
 *  - 단일 파일로 합치면 모든 모듈의 import.meta.url 이 출력 파일 위치로 collapse 된다.
 *  - sidecar resolver(standalone/asset/icon)들이 `__dirname/../{standalone,assets,icons}` 를
 *    탐색하므로, server.mjs 를 dist/tools 에 두고 자산을 dist/ 바로 아래에 둬야 ③ 전략이 맞는다.
 *
 * mcpb CLI 가 설치되어 있으면 mcpb pack 으로 압축하고, 없으면 zip 으로 폴백한다.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MCP = path.join(ROOT, "packages/mcp");
const OUT_ROOT = path.join(ROOT, "dist-mcpb");
const BUNDLE_NAME = "nudge-ds";
const BUNDLE_DIR = path.join(OUT_ROOT, BUNDLE_NAME);
const MCPB_PATH = path.join(OUT_ROOT, `${BUNDLE_NAME}.mcpb`);

const skipBuild = process.argv.includes("--no-build");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function removeIfExists(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else if (entry.isFile()) copyFile(srcPath, destPath);
  }
}

function run(command, args, options = {}) {
  console.log(`$ ${[command, ...args].join(" ")}`);
  execFileSync(command, args, { cwd: ROOT, stdio: "inherit", ...options });
}

// Windows 는 pnpm 이 pnpm.cmd 라 execFile(no-shell)로는 ENOENT.
const PNPM = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

if (!skipBuild) {
  // local-packages/*.tgz 갱신 (catalog 와 같은 버전) + 의존 패키지 dist 보장
  run(PNPM, ["release:local"]);
  // dist/server.js + catalog.json 생성
  run(PNPM, ["build", "--filter", "@nudge-design/mcp"]);
}

const mcpManifest = readJson(path.join(MCP, "manifest.json"));
// manifest.json 의 version 이 mcpb 버전의 정의(SSOT)다.
console.log(`[pack-mcpb] manifest.version = ${mcpManifest.version}`);

const serverEntry = path.join(MCP, "dist/server.js");
if (!fs.existsSync(serverEntry)) {
  console.error(
    `[pack-mcpb] ${path.relative(ROOT, serverEntry)} 없음 — --no-build 없이 실행하세요.`,
  );
  process.exit(1);
}

// ── prebuilt sidecar 입력 가드 (없으면 빌드가 런타임에 깨짐) ─────────────────
const standaloneSrc = path.join(ROOT, "packages/html/dist/standalone");
if (!fs.existsSync(path.join(standaloneSrc, "manifest.json"))) {
  console.error(
    `[pack-mcpb] ${path.relative(ROOT, standaloneSrc)}/manifest.json 없음 — ` +
      `'pnpm build --filter @nudge-design/html' 로 먼저 생성하세요.`,
  );
  process.exit(1);
}
const assetsFilesSrc = path.join(ROOT, "packages/assets/dist/files");
if (!fs.existsSync(assetsFilesSrc)) {
  console.error(
    `[pack-mcpb] ${path.relative(ROOT, assetsFilesSrc)} 없음 — ` +
      `'pnpm build --filter @nudge-design/assets' 로 먼저 생성하세요.`,
  );
  process.exit(1);
}
const iconsVanillaSrc = path.join(ROOT, "packages/icons/dist/vanilla.js");
if (!fs.existsSync(iconsVanillaSrc)) {
  console.error(
    `[pack-mcpb] ${path.relative(ROOT, iconsVanillaSrc)} 없음 — ` +
      `'pnpm build --filter @nudge-design/icons' 로 먼저 생성하세요.`,
  );
  process.exit(1);
}
const assetsManifestSrc = path.join(ROOT, "packages/assets/dist/manifest.json");

// ── DS 정합성 하드 게이트 — 깨진 .mcpb 발행 차단 ──────────────────────────────
//   --no-build 경로(html build 가 안 돌아 registry 임베드 게이트가 안 뜀)와 일반 경로 모두에서
//   (1) 런타임 등록 누락(빈 박스 회귀)과 (2) react dist 없이 생성된 깨진 catalog(컴포넌트 0개)를
//   패킹 직전에 확정 차단한다.
run("node", ["scripts/check-runtime-registry.mjs"]);
const packCatalog = readJson(path.join(MCP, "catalog.json"));
const reactComponentCount = (packCatalog.components ?? []).filter((c) =>
  String(c.dtsRelPath ?? "").startsWith("packages/react/"),
).length;
const MIN_REACT_COMPONENTS = 50; // 현재 ~121개. 50 미만이면 react dist 없이 만든 깨진 카탈로그.
if (reactComponentCount < MIN_REACT_COMPONENTS) {
  console.error(
    `[pack-mcpb] catalog.json 의 react 컴포넌트가 ${reactComponentCount}개뿐 (기대 ≥ ${MIN_REACT_COMPONENTS}) — ` +
      `react dist 없이 생성된 깨진 카탈로그입니다. 'pnpm build' 후 (필요 시 --no-build 빼고) 다시 패킹하세요.`,
  );
  process.exit(1);
}

removeIfExists(BUNDLE_DIR);
ensureDir(path.join(BUNDLE_DIR, "embedded/tools"));
ensureDir(OUT_ROOT);

// 1) esbuild 단일 파일 (workspace deps 포함 전부 인라인, node: 빌트인만 외부)
//    본체는 embedded/ 아래에 둔다 — bootstrap.mjs 가 첫 실행/오프라인 폴백으로 쓰는 floor.
console.log("[pack-mcpb] esbuild → embedded/tools/server.mjs");
await build({
  entryPoints: [serverEntry],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: path.join(BUNDLE_DIR, "embedded/tools/server.mjs"),
  // ESM 출력에서 번들된 CJS 의존성(cheerio→undici 등)이 쓰는 require 를 살린다.
  banner: {
    js: "import{createRequire as __nudgeCR}from'node:module';const require=__nudgeCR(import.meta.url);",
  },
  logLevel: "warning",
});

// 2) 런타임 부속 자산 (server.mjs 의 __dirname/../* 로 resolve — 이제 embedded/ 기준)
copyFile(path.join(MCP, "manifest.json"), path.join(BUNDLE_DIR, "embedded/manifest.json"));
copyFile(path.join(MCP, "catalog.json"), path.join(BUNDLE_DIR, "embedded/catalog.json"));
copyDir(standaloneSrc, path.join(BUNDLE_DIR, "embedded/standalone"));
copyDir(assetsFilesSrc, path.join(BUNDLE_DIR, "embedded/assets"));
if (fs.existsSync(assetsManifestSrc))
  copyFile(assetsManifestSrc, path.join(BUNDLE_DIR, "embedded/assets/manifest.json"));
copyFile(iconsVanillaSrc, path.join(BUNDLE_DIR, "embedded/icons/vanilla.js"));

// 3) get_setup 가 외부 목업 프로젝트에 설치 안내하는 DS .tgz.
//    server 는 mcpb 모드에서 __dirname/../local-packages (= embedded/local-packages) 를 읽는다.
copyDir(path.join(ROOT, "local-packages"), path.join(BUNDLE_DIR, "embedded/local-packages"));

// 4) 자기갱신 부트스트랩 — mcp_config 가 실행하는 진짜 엔트리.
//    실행 때마다 S3 version.json 을 보고 최신 본체를 받아 embedded 대신 그걸로 띄운다.
copyFile(path.join(MCP, "bootstrap.mjs"), path.join(BUNDLE_DIR, "bootstrap.mjs"));

// 5) Claude Desktop 이 인식할 루트 manifest.json — SSOT(packages/mcp/manifest.json)에
//    부트스트랩 엔트리/환경만 덧씌운 변환본. (원본 manifest 구조는 건드리지 않는다.)
const rootManifest = {
  ...mcpManifest,
  server: {
    ...mcpManifest.server,
    entry_point: "bootstrap.mjs",
    mcp_config: {
      command: "node",
      args: ["${__dirname}/bootstrap.mjs"],
      env: {
        NUDGE_DS_INSTALL_MODE: "mcpb",
        // 부트스트랩이 즉시 폴백으로 쓰는 동봉 본체. 캐시에 최신이 있으면 그쪽이 우선.
        NUDGE_DS_EMBEDDED_DIR: "${__dirname}/embedded",
        NUDGE_DS_ASSET_VERSION:
          mcpManifest.server?.mcp_config?.env?.NUDGE_DS_ASSET_VERSION ?? "0.0.2",
      },
    },
  },
};
fs.writeFileSync(path.join(BUNDLE_DIR, "manifest.json"), JSON.stringify(rootManifest, null, 2));

// 6) .mcpb 압축
removeIfExists(MCPB_PATH);

const mcpb = spawnSync("mcpb", ["pack", BUNDLE_DIR, MCPB_PATH], { stdio: "inherit" });
if (mcpb.error || mcpb.status !== 0) {
  console.warn("[pack-mcpb] mcpb CLI not found or failed. Falling back to plain zip.");
  // 주의: Claude Desktop 은 zip 최상위에 manifest.json 이 있어야 인식한다.
  // BUNDLE_DIR 안에서 "." 를 압축해서 폴더 한 단계를 제거한다.
  const zip = spawnSync("zip", ["-qr", MCPB_PATH, "."], {
    cwd: BUNDLE_DIR,
    stdio: "inherit",
  });
  if (zip.status !== 0) {
    console.error("[pack-mcpb] zip fallback also failed. Bundle folder is at:");
    console.error(`  ${path.relative(ROOT, BUNDLE_DIR)}`);
    process.exit(1);
  }
}

console.log("\n✓ mcpb bundle created:");
console.log(`  ${path.relative(ROOT, BUNDLE_DIR)}`);
if (fs.existsSync(MCPB_PATH)) console.log(`  ${path.relative(ROOT, MCPB_PATH)}`);
console.log(
  "\nInstall: drag the .mcpb file into Claude Desktop (Settings → Extensions → Install from file).",
);
