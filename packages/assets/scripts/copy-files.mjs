#!/usr/bin/env node
/**
 * src/files 하위 자산 taxonomy 를 dist/files/ 로 복사.
 *
 * tsc 는 .ts 만 빌드하므로 PNG/WEBP/SVG 는 따로 복사해야 한다.
 * 그래야 `@nudge-design/assets/files/{brand|shared}/{path}` import 가 동작하고,
 * apps/storybook · packages/html/test-fixture 도 이 디렉토리를 동기화 소스로 쓴다.
 *
 * public taxonomy:
 *   - brand/{slug}/... — 브랜드/프로덕트 전용 자산
 *   - shared/...       — 제3자/공용 자산
 *
 * 주의: 여기서 만든 dist/files 전체(래스터 포함)는 빌드 산출물이지만 npm tgz 에 전부
 * 담기진 않는다. package.json `files` 는 벡터(SVG)만 publish 하고 래스터(PNG/JPG/WEBP)는
 * 제외한다 — 래스터는 S3(scripts/publish-assets-s3.mjs → remote-url)로 전달. dist/files 는
 * 그 S3 업로드 소스이자 로컬 목업 인라이너·desktop 번들 동봉본이라 계속 통째로 생성한다.
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = resolve(__dirname, "..", "src");
const FILES_ROOT = resolve(SRC_ROOT, "files");
const DST_ROOT = resolve(__dirname, "..", "dist", "files");

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

if (!existsSync(FILES_ROOT)) {
  throw new Error(`assets files root not found: ${FILES_ROOT}`);
}

await copyRecursive(FILES_ROOT, DST_ROOT);
const n = await countFiles(DST_ROOT);
console.log(`✓ files: copied ${n} files`);
