#!/usr/bin/env node
/**
 * Publish @nudge-design/assets and @nudge-design/icons artifacts to S3.
 *
 * Default mode is dry-run. Use --apply to execute AWS CLI commands.
 *
 * Release URLs:
 *   https://asset.nudge-dev.com/nds-assets/assets/{assetVersion}/files/...
 *   https://asset.nudge-dev.com/nds-assets/icons/{iconVersion}/vanilla.js
 *   https://asset.nudge-dev.com/nds-assets/icons/{iconVersion}/mono/vanilla.js
 *   https://asset.nudge-dev.com/nds-assets/icons/{iconVersion}/multicolor/vanilla.js
 *
 * Channel URLs:
 *   https://asset.nudge-dev.com/nds-assets/channels/assets-dev/files/...
 *   https://asset.nudge-dev.com/nds-assets/channels/icons-dev/vanilla.js
 *   https://asset.nudge-dev.com/nds-assets/channels/icons-dev/mono/vanilla.js
 *   https://asset.nudge-dev.com/nds-assets/channels/icons-dev/multicolor/vanilla.js
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const mode = valueOf("--mode") ?? "release";
const bucket = valueOf("--bucket") ?? process.env.NUDGE_DS_ASSET_S3_BUCKET;
const prefix = (valueOf("--prefix") ?? "nds-assets").replace(/^\/+|\/+$/g, "");
const cdnOrigin = (
  valueOf("--cdn-origin") ??
  process.env.NUDGE_DS_ASSET_CDN_ORIGIN ??
  process.env.NUDGE_DS_CDN_ORIGIN ??
  "https://nudge-design-assets.s3.ap-northeast-2.amazonaws.com"
).replace(/\/+$/g, "");

if (!bucket) {
  fail("Missing bucket. Pass --bucket=<name> or set NUDGE_DS_ASSET_S3_BUCKET.");
}
if (!["release", "channel"].includes(mode)) {
  fail(`Invalid --mode=${mode}. Use release or channel.`);
}

const assetPkg = readJson(path.join(ROOT, "packages/assets/package.json"));
const iconPkg = readJson(path.join(ROOT, "packages/icons/package.json"));

const targets =
  mode === "release"
    ? [
        {
          label: "assets",
          localDir: "packages/assets/dist/files",
          localManifest: "packages/assets/dist/manifest.json",
          s3Prefix: `${prefix}/assets/${assetPkg.version}`,
          url: `${cdnOrigin}/${prefix}/assets/${assetPkg.version}/files`,
          immutable: true,
        },
        {
          label: "icons",
          localDir: "packages/icons/dist",
          localManifest: "packages/icons/dist/manifest.json",
          s3Prefix: `${prefix}/icons/${iconPkg.version}`,
          url: `${cdnOrigin}/${prefix}/icons/${iconPkg.version}`,
          immutable: true,
          include: ["vanilla.js", "mono/vanilla.js", "multicolor/vanilla.js", "manifest.json"],
        },
      ]
    : [
        {
          label: "assets",
          localDir: "packages/assets/dist/files",
          localManifest: "packages/assets/dist/manifest.json",
          s3Prefix: `${prefix}/channels/assets-dev`,
          url: `${cdnOrigin}/${prefix}/channels/assets-dev/files`,
          immutable: false,
        },
        {
          label: "icons",
          localDir: "packages/icons/dist",
          localManifest: "packages/icons/dist/manifest.json",
          s3Prefix: `${prefix}/channels/icons-dev`,
          url: `${cdnOrigin}/${prefix}/channels/icons-dev`,
          immutable: false,
          include: ["vanilla.js", "mono/vanilla.js", "multicolor/vanilla.js", "manifest.json"],
        },
      ];

for (const target of targets) {
  assertExists(path.join(ROOT, target.localDir), target.localDir);
  assertExists(path.join(ROOT, target.localManifest), target.localManifest);
}

console.log(`[publish-assets-s3] mode=${mode} bucket=${bucket} apply=${apply ? "yes" : "no"}`);
for (const target of targets) {
  console.log(`\n${target.label}: ${target.url}`);
  if (target.immutable && apply) {
    assertS3PrefixEmpty(`s3://${bucket}/${target.s3Prefix}/`);
  }
  if (target.label === "assets") {
    run([
      "aws",
      "s3",
      "sync",
      path.join(ROOT, target.localDir),
      `s3://${bucket}/${target.s3Prefix}/files`,
      "--cache-control",
      target.immutable ? "public,max-age=31536000,immutable" : "public,max-age=60",
    ]);
    run([
      "aws",
      "s3",
      "cp",
      path.join(ROOT, target.localManifest),
      `s3://${bucket}/${target.s3Prefix}/manifest.json`,
      "--cache-control",
      target.immutable ? "public,max-age=300" : "no-cache",
      "--content-type",
      "application/json",
    ]);
  } else {
    for (const file of target.include ?? []) {
      const contentType = file.endsWith(".json") ? "application/json" : "text/javascript";
      run([
        "aws",
        "s3",
        "cp",
        path.join(ROOT, target.localDir, file),
        `s3://${bucket}/${target.s3Prefix}/${file}`,
        "--cache-control",
        target.immutable ? "public,max-age=31536000,immutable" : "public,max-age=60",
        "--content-type",
        contentType,
      ]);
    }
  }
}

if (!apply) {
  console.log("\nDry-run only. Add --apply to execute.");
}

function valueOf(name) {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find((v) => v.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function assertExists(abs, label) {
  if (!fs.existsSync(abs)) fail(`Missing ${label}. Build assets/icons before publishing.`);
}

function run(cmd, options = {}) {
  console.log(`$ ${cmd.map(quote).join(" ")}`);
  if (!apply) return;
  const result = spawnSync(cmd[0], cmd.slice(1), { stdio: "inherit" });
  if (result.status !== 0 && !options.allowFailure) {
    process.exit(result.status ?? 1);
  }
}

function assertS3PrefixEmpty(s3Uri) {
  const result = spawnSync("aws", ["s3", "ls", s3Uri], { encoding: "utf8" });
  if (result.status === 0 && result.stdout.trim()) {
    fail(`Release target already exists: ${s3Uri}`);
  }
  if (result.status !== 0 && result.stderr && !/NoSuchBucket|Not Found|404/i.test(result.stderr)) {
    process.stderr.write(result.stderr);
  }
}

function quote(value) {
  return /\s/.test(value) ? JSON.stringify(value) : value;
}

function fail(message) {
  console.error(`[publish-assets-s3] ${message}`);
  process.exit(1);
}
