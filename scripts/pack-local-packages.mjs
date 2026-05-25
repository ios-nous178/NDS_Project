#!/usr/bin/env node
/**
 * pack-local-packages.mjs — build & pack DS packages into local-packages/
 *
 * Usage:
 *   node scripts/pack-local-packages.mjs              # build + pack all
 *   node scripts/pack-local-packages.mjs --no-build   # pack only (assumes already built)
 *
 * Output: local-packages/nudge-eap-{name}-{version}.tgz (4 files)
 * Old .tgz files for the same package (different version) are removed automatically.
 *
 * Version contract: DS 패키지 4개(tokens/react/icons/tailwind-preset)의 package.json
 * version 이 SSOT 이고, 루트 package.json version 은 그 미러 (sync-mcpb-version.mjs 가
 * 동기화). 이 스크립트는 두 값이 일치하는지 *검증만* 한다. 드리프트가 있으면
 * 종료 — 조용한 다운그레이드를 만들지 않는다.
 *
 * 드리프트가 발생하는 시나리오는 보통 둘 중 하나:
 *   1. `pnpm version-packages` 직후 sync-mcpb-version.mjs 가 안 돌았다 → 그걸 실행
 *   2. 누군가 루트나 DS 패키지 version 을 손으로 건드렸다 → 의도 확인 후 정리
 *
 * MCP(packages/mcp/manifest.json) 는 DS 와 분리된 별도 버전. MCP 가이드/룰만
 * 바뀐 릴리즈에서는 DS 패키지 4개 버전을 굳이 올릴 필요가 없어, 외부 프로젝트의
 * 불필요한 reinstall 을 피한다.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "local-packages");

const PACKAGES = ["tokens", "react", "icons", "tailwind-preset"];

// SSOT version 검증 대상 외에 mcpb 와 함께 배포하는 부가 패키지.
// MCP 처럼 별도 라이프사이클로 — html 만 변경된 릴리즈에서 DS 4개를 같이
// 끌어올리지 않는다. 외부 mockup 프로젝트는 .tgz 를 같이 받는다.
const EXTRA_PACKAGES = ["html"];

const skipBuild = process.argv.includes("--no-build");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Assert: 루트 package.json ↔ DS 4개 package.json version 일치 ────────────
//
// 과거에는 이 자리에서 루트 → DS 로 force-sync 했는데, 그게 stale 루트
// version 으로 릴리즈된 DS 패키지를 조용히 다운그레이드시키는 사고를 만들었다.
// 이제는 검증만 한다. 드리프트가 있으면 sync-mcpb-version.mjs 가 SSOT 미러를
// 끌어올리는 책임이다.

const rootPkgPath = path.join(ROOT, "package.json");
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
const rootVersion = rootPkg.version;
if (!rootVersion || typeof rootVersion !== "string" || rootVersion === "0.0.0") {
  console.error(
    `✗ 루트 package.json 의 version 을 읽을 수 없거나 "0.0.0" 입니다: ${rootVersion}\n` +
      `  DS 공유 버전의 미러이므로 의미있는 SemVer 값이어야 합니다.`,
  );
  process.exit(1);
}

const dsPkgs = PACKAGES.map((name) => {
  const pkgJsonPath = path.join(ROOT, "packages", name, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  return { name, version: pkg.version };
});

const drift = dsPkgs.filter((p) => p.version !== rootVersion);

if (drift.length > 0) {
  console.error(
    `✗ Version drift detected (root vs DS packages):\n` +
      `  root package.json: ${rootVersion}\n` +
      drift.map((p) => `  @nudge-eap/${p.name}: ${p.version}`).join("\n") +
      `\n\n` +
      `  Likely causes:\n` +
      `    1. \`pnpm version-packages\` 후 sync 가 안 돌았다 → \`pnpm sync:mcpb-version\` 실행\n` +
      `    2. 루트 또는 DS 패키지 version 을 손으로 건드렸다 → 의도 확인 후 정리\n` +
      `\n  pack 은 다운그레이드를 만들지 않도록 여기서 중단합니다.`,
  );
  process.exit(1);
}

console.log(`🔖 DS version verified: ${rootVersion} (root ↔ all DS packages in sync)\n`);

// ── Build (optional) ────────────────────────────────────────

const ALL_PACKAGES = [...PACKAGES, ...EXTRA_PACKAGES];

if (!skipBuild) {
  const filterArgs = ALL_PACKAGES.map((n) => `--filter @nudge-eap/${n}`).join(" ");
  console.log(`📦 Building: ${ALL_PACKAGES.map((n) => `@nudge-eap/${n}`).join(", ")}`);
  execSync(`pnpm build ${filterArgs}`, { cwd: ROOT, stdio: "inherit" });
  console.log("");
}

// ── Pack each package ───────────────────────────────────────

const summary = [];

for (const name of ALL_PACKAGES) {
  const pkgDir = path.join(ROOT, "packages", name);
  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf-8"));
  const version = pkgJson.version;
  const expectedFile = `nudge-eap-${name}-${version}.tgz`;

  console.log(`📦 Packing @nudge-eap/${name} (v${version})...`);

  // Clean up old .tgz files for this package (different versions)
  const prefix = `nudge-eap-${name}-`;
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.startsWith(prefix) && f.endsWith(".tgz") && f !== expectedFile) {
      fs.unlinkSync(path.join(OUT_DIR, f));
      console.log(`  🗑  Removed stale: ${f}`);
    }
  }

  execSync(`pnpm pack --pack-destination "${OUT_DIR}"`, {
    cwd: pkgDir,
    stdio: ["ignore", "pipe", "inherit"],
  });

  const outPath = path.join(OUT_DIR, expectedFile);
  if (!fs.existsSync(outPath)) {
    console.error(`  ✗ Expected ${expectedFile} but it was not created`);
    process.exit(1);
  }

  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`  ✓ ${expectedFile} (${sizeKb} KB)`);
  summary.push({ name, version, file: expectedFile, sizeKb });
}

// ── Summary ─────────────────────────────────────────────────

console.log("\n✓ All packages packed:");
for (const s of summary) {
  console.log(`  local-packages/${s.file}`);
}
console.log(`\nNext: in your mockup project, reinstall with the updated .tgz files.`);
