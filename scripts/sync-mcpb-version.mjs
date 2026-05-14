#!/usr/bin/env node
/**
 * sync-mcpb-version.mjs — DS 패키지 버전 → packages/mcp/manifest.json 동기화
 *
 * `pnpm version-packages` (changeset version) 가 DS 패키지의 package.json
 * version 을 bump 한 뒤에도 MCPB manifest.json 은 그대로 남는다. release-mcpb
 * 워크플로우는 manifest.json 의 version 을 release tag 로 쓰므로, 이걸 자동
 * 동기화해 줘야 한 PR 안에서 외부 전파까지 마무리된다.
 *
 * 동기화 규칙: DS 패키지(@nudge-eap/{react,tokens,icons,tailwind-preset}) 중
 * semver 최댓값을 manifest.json 의 version 으로 채택한다.
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
];
const MANIFEST_PATH = path.join(ROOT, "packages/mcp/manifest.json");
const MCP_PKG_PATH = path.join(ROOT, "packages/mcp/package.json");

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
const currentVersion = manifest.version;

if (currentVersion === targetVersion) {
  console.log(
    `[sync-mcpb-version] manifest.json already at ${targetVersion} (max DS package = ${maxEntry.name})`,
  );
  process.exit(0);
}

if (mode === "check") {
  console.error(
    `[sync-mcpb-version] manifest.json out of sync: have ${currentVersion}, expected ${targetVersion} (max DS package = ${maxEntry.name})\n` +
      `  Run \`pnpm sync:mcpb-version\` to fix.`,
  );
  process.exit(1);
}

manifest.version = targetVersion;
writeJson(MANIFEST_PATH, manifest);
console.log(
  `[sync-mcpb-version] manifest.json ${currentVersion} → ${targetVersion} (anchor: ${maxEntry.name}@${targetVersion})`,
);

// `@nudge-eap/mcp` (내부 패키지) 의 package.json version 도 같이 맞춰주면
// 외부 의존성/로그에서 일관성이 생기지만, 사용자가 의도적으로 분리해 두었으면
// 건드리지 않는다. mcp 가 이미 같은 값이면 손대지 않음.
const mcpPkg = readJson(MCP_PKG_PATH);
if (mcpPkg.version !== targetVersion) {
  console.warn(
    `[sync-mcpb-version] note: packages/mcp/package.json is at ${mcpPkg.version} (manifest is at ${targetVersion}). ` +
      `If you want them in lockstep, bump it manually or add a changeset for @nudge-eap/mcp.`,
  );
}
