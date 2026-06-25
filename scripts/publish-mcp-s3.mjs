#!/usr/bin/env node
/**
 * publish-mcp-s3.mjs — Nudge DS MCP **본체**를 S3(에셋 버킷)에 발행.
 *
 * 레포가 프라이빗이라 GitHub Release 로는 외부 사용자가 산출물을 못 받는다.
 * 그래서 진짜 본체는 에셋 버킷에 올리고, 사용자에겐 얇은 부트스트랩만 배포한다
 * (bootstrap.mjs 가 실행 때마다 여기 version.json 을 보고 최신 본체를 받아간다).
 *
 * 입력: pack-mcpb.mjs 가 만든 본체 디렉터리(dist-mcpb/nudge-ds/embedded).
 *       → 먼저 `node scripts/pack-mcpb.mjs` 로 빌드해 두어야 한다.
 *
 * S3 레이아웃 (prefix=nds-assets/mcp):
 *   builds/{buildId}/nudge-ds-bundle.tar.gz      ← 본체 tar.gz (content-addressed, immutable)
 *   bootstrap.mjs                                ← 터미널 install.sh 가 받아가는 런처
 *   install.sh                                   ← 터미널 원클릭 설치
 *   version.json                                 ← 포인터 {version,buildId,bundleUrl,sha256} (no-cache, 마지막 flip)
 *
 * buildId(=git sha) 로 content-addressing 하므로, 버전(semver)을 안 올려도 main push 마다
 * 새 빌드가 새 경로에 올라가고 version.json 이 그걸 가리킨다 → 클라이언트가 다음 실행에 받아감.
 *
 * 기본은 dry-run. 실제 업로드는 --apply.
 *   node scripts/publish-mcp-s3.mjs            # dry-run
 *   node scripts/publish-mcp-s3.mjs --apply    # 업로드
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MCP = path.join(ROOT, "packages/mcp");
const BODY_DIR = path.join(ROOT, "dist-mcpb/nudge-ds/embedded");
const OUT_DIR = path.join(ROOT, "dist-mcpb");

const apply = process.argv.includes("--apply");
const bucket = valueOf("--bucket") ?? process.env.NUDGE_DS_ASSET_S3_BUCKET;
const prefix = (valueOf("--prefix") ?? "nds-assets/mcp").replace(/^\/+|\/+$/g, "");
// ⚠ `||` (not `??`): CI 는 미설정 변수를 빈 문자열로 넘기므로 빈 값도 폴백해야
//    bundleUrl 이 상대경로가 되는 걸 막는다.
const cdnOrigin = (
  valueOf("--cdn-origin") ||
  process.env.NUDGE_DS_ASSET_CDN_ORIGIN ||
  process.env.NUDGE_DS_CDN_ORIGIN ||
  "https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com"
).replace(/\/+$/g, "");

if (!bucket) fail("Missing bucket. Pass --bucket=<name> or set NUDGE_DS_ASSET_S3_BUCKET.");

const version = readJson(path.join(MCP, "manifest.json")).version;
if (!version) fail("manifest.json 에서 version 을 읽지 못함.");

assertExists(BODY_DIR, "dist-mcpb/nudge-ds/embedded");
assertExists(serverEntry(BODY_DIR), "embedded/tools/server.mjs");
const bootstrapSrc = path.join(MCP, "bootstrap.mjs");
const installSrc = path.join(MCP, "install.sh");
assertExists(bootstrapSrc, "packages/mcp/bootstrap.mjs");
assertExists(installSrc, "packages/mcp/install.sh");

// ── 1) 본체 tar.gz + sha256 + buildId ─────────────────────────────────────────
const tarPath = path.join(OUT_DIR, `nudge-ds-bundle.tar.gz`);
console.log(`[publish-mcp-s3] tar → ${path.relative(ROOT, tarPath)}`);
const tar = spawnSync("tar", ["-czf", tarPath, "-C", BODY_DIR, "."], { stdio: "inherit" });
if (tar.error || tar.status !== 0) fail("tar 생성 실패 (system tar 필요).");
const sha = sha256File(tarPath);
// buildId: CI 가 주는 git sha 우선 → 로컬 git → 최후에 tar sha256 prefix(=항상 content-addressed)
let buildId = (process.env.NUDGE_DS_BUILD_ID || gitShortSha() || sha.slice(0, 12)).trim();
// 풀 git sha(40 hex)면 12자로 줄여 경로를 짧게.
if (/^[0-9a-f]{40}$/i.test(buildId)) buildId = buildId.slice(0, 12);

const bundleKey = `${prefix}/builds/${buildId}/nudge-ds-bundle.tar.gz`;
const bundleUrl = `${cdnOrigin}/${bundleKey}`;

// ── 2) version.json (포인터) ─────────────────────────────────────────────────
const versionJson = {
  version,
  buildId,
  bundleUrl,
  sha256: sha,
  publishedAt: new Date().toISOString(),
};
const versionJsonPath = path.join(OUT_DIR, "mcp-version.json");
fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2));

console.log(
  `[publish-mcp-s3] version=${version} build=${buildId} bucket=${bucket} apply=${apply ? "yes" : "no"}`,
);
console.log(`  bundle : ${bundleUrl}`);
console.log(`  sha256 : ${sha}`);
console.log(`  pointer: ${cdnOrigin}/${prefix}/version.json`);
console.log(`  install: ${cdnOrigin}/${prefix}/install.sh`);

// ── 3) 업로드 (immutable 본체 → 부속 → 마지막에 version.json flip) ────────────
// content-addressed 라 같은 buildId 재실행이면 본체는 이미 있음 → 건너뛰고 포인터만 갱신(idempotent).
if (apply && s3KeyExists(`s3://${bucket}/${bundleKey}`)) {
  console.log(`[publish-mcp-s3] 본체 이미 존재(build=${buildId}) — 업로드 건너뜀.`);
} else {
  s3cp(tarPath, `s3://${bucket}/${bundleKey}`, {
    cache: "public,max-age=31536000,immutable",
    type: "application/gzip",
  });
}
s3cp(bootstrapSrc, `s3://${bucket}/${prefix}/bootstrap.mjs`, {
  cache: "no-cache",
  type: "text/javascript",
});
s3cp(installSrc, `s3://${bucket}/${prefix}/install.sh`, {
  cache: "no-cache",
  type: "text/x-shellscript",
});
// version.json 은 본체가 다 올라간 뒤 마지막에 — 포인터가 가리키는 본체가 항상 존재하도록.
s3cp(versionJsonPath, `s3://${bucket}/${prefix}/version.json`, {
  cache: "no-cache",
  type: "application/json",
});

if (!apply) console.log("\nDry-run only. Add --apply to execute.");
else console.log("\n✓ MCP 본체 발행 완료. 사용자는 다음 실행부터 자동 반영됩니다.");

// ── helpers ──────────────────────────────────────────────────────────────────
function serverEntry(dir) {
  return path.join(dir, "tools", "server.mjs");
}
function s3cp(src, dst, { cache, type }) {
  const cmd = ["aws", "s3", "cp", src, dst, "--cache-control", cache, "--content-type", type];
  console.log(`$ ${cmd.join(" ")}`);
  if (!apply) return;
  const r = spawnSync(cmd[0], cmd.slice(1), { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
function s3KeyExists(uri) {
  const r = spawnSync("aws", ["s3", "ls", uri], { encoding: "utf8" });
  return r.status === 0 && !!r.stdout.trim();
}
function gitShortSha() {
  const r = spawnSync("git", ["rev-parse", "--short=12", "HEAD"], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : "";
}
function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}
function valueOf(name) {
  const p = `${name}=`;
  const a = process.argv.slice(2).find((v) => v.startsWith(p));
  return a ? a.slice(p.length) : undefined;
}
function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function assertExists(abs, label) {
  if (!fs.existsSync(abs))
    fail(`Missing ${label}. 'node scripts/pack-mcpb.mjs' 로 먼저 빌드하세요.`);
}
function fail(msg) {
  console.error(`[publish-mcp-s3] ${msg}`);
  process.exit(1);
}
