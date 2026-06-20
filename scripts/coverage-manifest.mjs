import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS, PROJECT_LABEL, reactStatus, htmlStatus } from "./coverage-logic.mjs";

/**
 * Project × Component Coverage manifest builder.
 *
 * 단일 SSOT — 두 곳이 이걸 통해 같은 판정 데이터를 본다:
 *   1) scripts/generate-project-coverage.mjs  (docs MDX 생성)
 *   2) apps/storybook/.../ProjectComponentCoverage.stories.tsx (보드 UI)
 *
 * Storybook 은 metadata/coverage-manifest.json 을 import 해서 사용한다.
 * `pre*` 훅에서 generate:project-coverage 가 매번 돌기 때문에 파일은 항상 fresh.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const reactSrcDir = path.join(rootDir, "packages", "react", "src");
const reactIndexPath = path.join(reactSrcDir, "index.ts");
const htmlIndexPath = path.join(rootDir, "packages", "html", "src", "index.ts");

// 프로젝트 상수·셀 판정 로직의 SSOT 는 coverage-logic.mjs (node-free, 스토리도 공유).
// 기존 소비처(generate-project-coverage.mjs)가 이 모듈에서 import 하던 심볼을 그대로 재노출한다.
export { PROJECTS, PROJECT_LABEL, reactStatus, htmlStatus };

async function readReactExports() {
  const src = await fs.readFile(reactIndexPath, "utf8");
  const exports = new Set();
  // NodeNext 전환으로 specifier 에 .js 확장자가 붙는다 — 컴포넌트명에서는 떼어낸다.
  for (const m of src.matchAll(/export\s+\*\s+from\s+"\.\/([A-Z][^"]*?)(?:\.js)?"/g)) {
    exports.add(m[1]);
  }
  return exports;
}

async function readHtmlExports() {
  const src = await fs.readFile(htmlIndexPath, "utf8");
  const exports = new Set();
  for (const m of src.matchAll(/Nds([A-Z][A-Za-z0-9]*)/g)) {
    exports.add(m[1]);
  }
  return exports;
}

async function readProjectChromeFor(project) {
  const projectDir = path.join(reactSrcDir, project);
  let entries;
  try {
    entries = await fs.readdir(projectDir, { withFileTypes: true });
  } catch (e) {
    // 프로젝트 chrome 통합으로 일부 프로젝트 dir(geniet/runmile/cashwalk-biz)은 제거됨 — chrome 0.
    if (e.code === "ENOENT") return new Set();
    throw e;
  }
  const names = new Set();
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!e.name.endsWith(".tsx")) continue;
    const base = e.name.slice(0, -".tsx".length);
    if (base === "index" || base === "types") continue;
    names.add(base);
  }
  return names;
}

async function readProjectChrome() {
  const out = {};
  for (const b of PROJECTS) {
    out[b] = await readProjectChromeFor(b);
  }
  return out;
}

// reactStatus / htmlStatus 셀 판정은 coverage-logic.mjs 로 이동(위에서 re-export).

/** 메모리상 manifest 객체 (Set 포함). docs generator 가 직접 소비. */
export async function buildManifest() {
  const [reactExports, htmlExports, projectChrome] = await Promise.all([
    readReactExports(),
    readHtmlExports(),
    readProjectChrome(),
  ]);
  return { reactExports, htmlExports, projectChrome };
}

/** 직렬화 — Storybook 이 import 할 수 있게 Set → sorted array. */
export function serializeManifest(manifest, generatedAt = new Date().toISOString()) {
  return {
    projects: PROJECTS,
    projectLabel: PROJECT_LABEL,
    reactExports: [...manifest.reactExports].sort(),
    htmlExports: [...manifest.htmlExports].sort(),
    projectChrome: Object.fromEntries(
      PROJECTS.map((b) => [b, [...(manifest.projectChrome[b] ?? [])].sort()]),
    ),
    generatedAt,
  };
}

/** metadata/coverage-manifest.json 에 직렬화 결과 기록 — Storybook 소스. */
export async function writeManifestJson(manifest, generatedAt) {
  const outPath = path.join(rootDir, "metadata", "coverage-manifest.json");
  const json = serializeManifest(manifest, generatedAt);
  const body = `${JSON.stringify(json, null, 2)}\n`;
  await fs.writeFile(outPath, body, "utf8");
  return outPath;
}
