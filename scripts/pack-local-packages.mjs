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
 * Version sync: 루트 package.json 의 version 이 DS 공유 버전의 SSOT 다. 매
 * 실행마다 4개 DS 패키지(tokens/react/icons/tailwind-preset)의 package.json
 * version 을 거기에 맞춰 sync 한다. 이렇게 해야 tarball 파일명이 매 릴리즈마다
 * 바뀌어 외부 mockup 프로젝트 npm cache miss 가 강제되고, "DS 업데이트했는데
 * 새 export 가 안 보임" 사고가 사라진다.
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

const skipBuild = process.argv.includes("--no-build");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Sync DS package.json versions to root package.json version (SSOT) ───

const rootPkgPath = path.join(ROOT, "package.json");
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
const targetVersion = rootPkg.version;
if (!targetVersion || typeof targetVersion !== "string" || targetVersion === "0.0.0") {
  console.error(
    `✗ 루트 package.json 의 version 을 읽을 수 없거나 "0.0.0" 입니다: ${targetVersion}\n` +
      `  DS 공유 버전의 SSOT 이므로 의미있는 SemVer 값으로 설정해야 합니다.`,
  );
  process.exit(1);
}

console.log(`🔖 Target DS version (from root package.json): ${targetVersion}`);
const synced = [];
for (const name of PACKAGES) {
  const pkgJsonPath = path.join(ROOT, "packages", name, "package.json");
  const raw = fs.readFileSync(pkgJsonPath, "utf-8");
  const pkg = JSON.parse(raw);
  if (pkg.version === targetVersion) continue;

  const trailingNewline = raw.endsWith("\n") ? "\n" : "";
  const oldVersion = pkg.version;
  pkg.version = targetVersion;
  fs.writeFileSync(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}${trailingNewline}`, "utf-8");
  synced.push(`${name}: ${oldVersion} → ${targetVersion}`);
}
if (synced.length > 0) {
  console.log("  Bumped:");
  for (const line of synced) console.log(`    ${line}`);
} else {
  console.log("  (already in sync)");
}
console.log("");

// ── Build (optional) ────────────────────────────────────────

if (!skipBuild) {
  const filterArgs = PACKAGES.map((n) => `--filter @nudge-eap/${n}`).join(" ");
  console.log(`📦 Building: ${PACKAGES.map((n) => `@nudge-eap/${n}`).join(", ")}`);
  execSync(`pnpm build ${filterArgs}`, { cwd: ROOT, stdio: "inherit" });
  console.log("");
}

// ── Pack each package ───────────────────────────────────────

const summary = [];

for (const name of PACKAGES) {
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
