import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildManifest, serializeManifest } from "./coverage-manifest.mjs";

/**
 * 프로젝트 커버리지 데이터 출처 생성기.
 *
 * 보드/표 렌더링은 공유 컴포넌트(@nudge-design/catalog 의 ProjectCoverageTable)가 담당하고,
 * docs 페이지(docs/components/project-coverage.mdx)는 그 컴포넌트를 직접 렌더하는 hand-written mdx.
 * 따라서 이 스크립트는 그 단일 데이터 출처인 metadata/coverage-manifest.json 만 생성한다.
 * (예전엔 docs 정적 markdown 표까지 emit 했으나, 라이브 보드로 통합되며 제거.)
 *
 * 출력은 generatedAt 을 보존해 결정적 → `--check` 는 순수 콘텐츠 비교(check-ssot 게이트).
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const manifestJsonPath = path.join(rootDir, "metadata", "coverage-manifest.json");
const checkMode = process.argv.includes("--check");

const manifest = await buildManifest();
const previousGeneratedAt = await readPreviousGeneratedAt(manifestJsonPath);
const manifestBody = `${JSON.stringify(
  serializeManifest(manifest, previousGeneratedAt ?? undefined),
  null,
  2,
)}\n`;

if (checkMode) {
  const current = await readExistingText(manifestJsonPath);
  if (current !== manifestBody) {
    console.error(
      "[generate-project-coverage] metadata/coverage-manifest.json 이 stale 합니다. Run `pnpm generate:project-coverage`.",
    );
    process.exit(1);
  }
  console.log(
    `[generate-project-coverage] up to date (${path.relative(rootDir, manifestJsonPath)})`,
  );
} else {
  await fs.writeFile(manifestJsonPath, manifestBody, "utf8");
  console.log(`Generated ${path.relative(rootDir, manifestJsonPath)}`);
}

async function readPreviousGeneratedAt(filePath) {
  try {
    const json = JSON.parse(await fs.readFile(filePath, "utf8"));
    return typeof json.generatedAt === "string" ? json.generatedAt : undefined;
  } catch {
    return undefined;
  }
}

async function readExistingText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}
