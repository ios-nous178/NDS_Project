// docs/**/*.{md,mdx} 를 apps/docs/static/raw/docs/ 로 복사.
// "다른 도구로 열기" 드롭다운이 raw.githubusercontent.com (private repo → 404) 대신
// 같은-오리진 /raw/docs/... 경로로 마크다운을 받게 하기 위함.
// predev / prebuild 직전에 실행.

import { readdir, mkdir, copyFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(here, "../../../docs");
const targetRoot = path.resolve(here, "../static/raw/docs");

await rm(targetRoot, { recursive: true, force: true });
await mkdir(targetRoot, { recursive: true });

let count = 0;
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(srcPath);
      continue;
    }
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    const rel = path.relative(docsRoot, srcPath);
    const dstPath = path.join(targetRoot, rel);
    await mkdir(path.dirname(dstPath), { recursive: true });
    await copyFile(srcPath, dstPath);
    count += 1;
  }
}

await walk(docsRoot);
console.log(`[copy-raw-docs] ${count} files → ${path.relative(process.cwd(), targetRoot)}`);
