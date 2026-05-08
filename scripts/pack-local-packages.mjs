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
