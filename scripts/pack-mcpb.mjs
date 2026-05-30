#!/usr/bin/env node
/**
 * pack-mcpb.mjs — Claude Desktop Extension(.mcpb) 번들 생성
 *
 * 결과물: dist-mcpb/nudge-ds.mcpb (= zip 파일)
 *
 * 사용:
 *   node scripts/pack-mcpb.mjs                # 풀 빌드 + 패킹
 *   node scripts/pack-mcpb.mjs --no-build     # 빌드 생략 (이미 빌드된 상태)
 *   node scripts/pack-mcpb.mjs --no-install   # node_modules 설치 생략 (오프라인 등)
 *
 * 번들 구조:
 *   manifest.json                      ← mcpb 스펙
 *   catalog.json                       ← 컴포넌트 카탈로그
 *   dist/server.js                     ← MCP 진입점
 *   node_modules/                      ← 런타임 의존성 (npm install --omit=dev)
 *   local-packages/*.tgz               ← DS 패키지 4종
 *   package.json                       ← npm install 시드용
 *
 * mcpb CLI 가 설치되어 있으면 mcpb pack 으로 압축하고, 없으면 zip 으로 폴백한다.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_ROOT = path.join(ROOT, "dist-mcpb");
const BUNDLE_NAME = "nudge-ds";
const BUNDLE_DIR = path.join(OUT_ROOT, BUNDLE_NAME);
const MCPB_PATH = path.join(OUT_ROOT, `${BUNDLE_NAME}.mcpb`);

const skipBuild = process.argv.includes("--no-build");
const skipInstall = process.argv.includes("--no-install");

const runtimeDeps = [
  "@babel/parser",
  "@babel/traverse",
  "@babel/types",
  "@modelcontextprotocol/sdk",
  "cheerio",
];

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

if (!skipBuild) {
  // local-packages/*.tgz 갱신 (catalog 와 같은 버전)
  run("pnpm", ["release:local"]);
  // dist/server.js + catalog.json 생성
  run("pnpm", ["build", "--filter", "@nudge-design/mcp"]);
}

const mcpPkg = readJson(path.join(ROOT, "packages/mcp/package.json"));
const mcpManifest = readJson(path.join(ROOT, "packages/mcp/manifest.json"));
const deps = Object.fromEntries(runtimeDeps.map((name) => [name, mcpPkg.dependencies[name]]));

// manifest.json 의 version 이 mcpb 버전의 정의(SSOT)다.
// 과거에는 packages/mcp/package.json 으로 덮어쓰는 로직이 있었으나, manifest 를
// 손으로 올린 의도를 빌드가 되돌려 놓는 부작용이 있어 제거함.
console.log(`[pack-mcpb] manifest.version = ${mcpManifest.version}`);

removeIfExists(BUNDLE_DIR);
ensureDir(BUNDLE_DIR);
ensureDir(OUT_ROOT);

// 1) MCP dist + 메타데이터
copyFile(path.join(ROOT, "packages/mcp/manifest.json"), path.join(BUNDLE_DIR, "manifest.json"));
copyFile(path.join(ROOT, "packages/mcp/catalog.json"), path.join(BUNDLE_DIR, "catalog.json"));
copyDir(path.join(ROOT, "packages/mcp/dist"), path.join(BUNDLE_DIR, "dist"));

// 1-b) prebuilt DS 단일 자산(html intent inline 의 자원) — dist/server.js 옆 dist/standalone 에
//      두어 mockup-core 의 resolver(__dirname/standalone)가 찾게 한다.
const mcpbStandaloneSrc = path.join(ROOT, "packages/html/dist/standalone");
if (!fs.existsSync(path.join(mcpbStandaloneSrc, "manifest.json"))) {
  console.error(
    `[pack-mcpb] ${path.relative(ROOT, mcpbStandaloneSrc)}/manifest.json 없음 — ` +
      `'pnpm release:local' 또는 'pnpm build --filter @nudge-design/html' 로 먼저 생성하세요.`,
  );
  process.exit(1);
}
copyDir(mcpbStandaloneSrc, path.join(BUNDLE_DIR, "dist/standalone"));

// 2) 외부 목업 프로젝트에 설치할 DS .tgz 동봉
copyDir(path.join(ROOT, "local-packages"), path.join(BUNDLE_DIR, "local-packages"));

// 3) node_modules 시드용 package.json
fs.writeFileSync(
  path.join(BUNDLE_DIR, "package.json"),
  `${JSON.stringify(
    {
      name: "nudge-ds-mcpb-bundle",
      private: true,
      type: "module",
      main: "dist/server.js",
      dependencies: deps,
    },
    null,
    2,
  )}\n`,
  "utf-8",
);

// 4) 런타임 의존성 설치
if (!skipInstall) {
  console.log("\n[pack-mcpb] installing runtime dependencies into bundle...");
  execSync("npm install --omit=dev --ignore-scripts --no-audit --no-fund", {
    cwd: BUNDLE_DIR,
    stdio: "inherit",
  });
}

// 5) .mcpb 압축
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
