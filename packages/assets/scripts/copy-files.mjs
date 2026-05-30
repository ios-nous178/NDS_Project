#!/usr/bin/env node
/**
 * src 하위 자산 카테고리들을 dist/files/ 로 복사.
 *
 * tsc 는 .ts 만 빌드하므로 PNG/WEBP/SVG 는 따로 복사해야 한다.
 * 그래야 `@nudge-design/assets/files/{category}/{path}` import 가 동작하고,
 * apps/storybook · packages/html/test-fixture 도 이 디렉토리를 동기화 소스로 쓴다.
 *
 * 카테고리:
 *   - brand-logos/  — 5 브랜드 로고
 *   - sns-logos/    — SNS 로그인 버튼용 (naver/kakao/google/apple × white/main/black)
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = resolve(__dirname, "..", "src");
const DST_ROOT = resolve(__dirname, "..", "dist", "files");

const CATEGORIES = [
  "brand-logos",
  "sns-logos",
  "profile-images",
  "illustrations",
  "marathon-events",
  // NudgeEAP "img" section (file mvecozaRQoGRePffskRgmh, section 20:1699)
  "psych-tests",
  "menu-app",
  "menu-web",
  "circle-icons",
  "consult",
  "gift",
  "3d",
  "rank",
  "eap-profiles",
];

// src 에 더 이상 없는 파일이 dist 에 stale 로 남는 걸 방지 — 매 빌드마다 reset.
await rm(DST_ROOT, { recursive: true, force: true });

async function copyRecursive(src, dst) {
  await mkdir(dst, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const dstPath = resolve(dst, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, dstPath);
    } else if (entry.isFile()) {
      // .ts/.tsx 는 tsc 가 처리. 바이너리 자산만 복사.
      if (/\.(ts|tsx)$/.test(entry.name)) continue;
      await cp(srcPath, dstPath);
    }
  }
}

async function countFiles(dir) {
  if (!existsSync(dir)) return 0;
  let count = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) count += await countFiles(resolve(dir, entry.name));
    else count++;
  }
  return count;
}

for (const category of CATEGORIES) {
  const src = resolve(SRC_ROOT, category);
  if (!existsSync(src)) continue;
  const dst = resolve(DST_ROOT, category);
  await copyRecursive(src, dst);
  const n = await countFiles(dst);
  console.log(`✓ ${category}: copied ${n} files`);
}
