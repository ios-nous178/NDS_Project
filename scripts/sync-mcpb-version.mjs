#!/usr/bin/env node
/**
 * sync-mcpb-version.mjs — DS 패키지 버전 → 파생 버전 미러 동기화
 *
 * DS 패키지(@nudge-design/{react,tokens,icons,tailwind-preset}) 의 package.json
 * version 이 SSOT 이고, 다음 두 파생 미러를 같은 버전으로 맞춘다.
 *
 *   1. packages/mcp/manifest.json   — release-mcpb 워크플로우가 release tag 로 사용
 *   2. 루트 package.json            — pack-local-packages.mjs 가 tarball 파일명에 박는 값
 *
 * `pnpm version-packages` (changeset version) 가 DS 패키지의 package.json 만
 * bump 하므로, 이 스크립트가 후속으로 미러들을 끌어올린다. 루트 미러까지 같이
 * 처리하지 않으면 pack-local-packages.mjs 가 stale 루트 version 으로 DS 4개
 * 패키지를 다운그레이드하는 사고가 재발한다.
 *
 * 동기화 규칙: 4개 DS 패키지 중 semver 최댓값을 두 미러의 version 으로 채택.
 *
 * Usage:
 *   node scripts/sync-mcpb-version.mjs           # write (default)
 *   node scripts/sync-mcpb-version.mjs --check   # CI lint: exit 1 if out of sync
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DS_PACKAGE_DIRS = [
  "packages/react",
  "packages/tokens",
  "packages/icons",
  "packages/tailwind-preset",
  "packages/styles",
];
const MANIFEST_PATH = path.join(ROOT, "packages/mcp/manifest.json");
const MCP_PKG_PATH = path.join(ROOT, "packages/mcp/package.json");
const ROOT_PKG_PATH = path.join(ROOT, "package.json");

const mode = process.argv.includes("--check") ? "check" : "write";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", "utf-8");
}

function parseSemver(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(v);
  if (!m) throw new Error(`Invalid semver: ${v}`);
  return {
    raw: v,
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] ?? null,
  };
}

function cmpSemver(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  // stable > prerelease for the same x.y.z (release > rc/alpha/beta)
  if (a.prerelease == null && b.prerelease != null) return 1;
  if (a.prerelease != null && b.prerelease == null) return -1;
  if (a.prerelease == null && b.prerelease == null) return 0;
  return a.prerelease.localeCompare(b.prerelease);
}

const dsVersions = DS_PACKAGE_DIRS.map((dir) => {
  const pkgPath = path.join(ROOT, dir, "package.json");
  const pkg = readJson(pkgPath);
  return { name: pkg.name, dir, version: parseSemver(pkg.version) };
});

const maxEntry = dsVersions.reduce((best, cur) =>
  cmpSemver(cur.version, best.version) > 0 ? cur : best,
);
const targetVersion = maxEntry.version.raw;

const manifest = readJson(MANIFEST_PATH);
const rootPkg = readJson(ROOT_PKG_PATH);

const mirrors = [
  { label: "packages/mcp/manifest.json", path: MANIFEST_PATH, obj: manifest },
  { label: "package.json (root)", path: ROOT_PKG_PATH, obj: rootPkg },
];

const drift = mirrors.filter((m) => m.obj.version !== targetVersion);

if (drift.length === 0) {
  console.log(
    `[sync-mcpb-version] all mirrors already at ${targetVersion} (max DS package = ${maxEntry.name})`,
  );
  process.exit(0);
}

if (mode === "check") {
  console.error(
    `[sync-mcpb-version] mirror(s) out of sync (max DS package = ${maxEntry.name}@${targetVersion}):`,
  );
  for (const m of drift) {
    console.error(`  - ${m.label}: have ${m.obj.version}, expected ${targetVersion}`);
  }
  console.error(`  Run \`pnpm sync:mcpb-version\` to fix.`);
  process.exit(1);
}

for (const m of drift) {
  const before = m.obj.version;
  m.obj.version = targetVersion;
  writeJson(m.path, m.obj);
  console.log(
    `[sync-mcpb-version] ${m.label} ${before} → ${targetVersion} (anchor: ${maxEntry.name}@${targetVersion})`,
  );
}

// `@nudge-design/mcp` (내부 패키지) 의 package.json version 도 같이 맞춰주면
// 외부 의존성/로그에서 일관성이 생기지만, 사용자가 의도적으로 분리해 두었으면
// 건드리지 않는다. mcp 가 이미 같은 값이면 손대지 않음.
const mcpPkg = readJson(MCP_PKG_PATH);
if (mcpPkg.version !== targetVersion) {
  console.warn(
    `[sync-mcpb-version] note: packages/mcp/package.json is at ${mcpPkg.version} (manifest is at ${targetVersion}). ` +
      `If you want them in lockstep, bump it manually or add a changeset for @nudge-design/mcp.`,
  );
}
