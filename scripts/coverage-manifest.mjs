import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Brand × Component Coverage manifest builder.
 *
 * 단일 SSOT — 두 곳이 이걸 통해 같은 판정 데이터를 본다:
 *   1) scripts/generate-brand-coverage.mjs  (docs MDX 생성)
 *   2) apps/storybook/.../BrandComponentCoverage.stories.tsx (보드 UI)
 *
 * Storybook 은 metadata/coverage-manifest.json 을 import 해서 사용한다.
 * `pre*` 훅에서 generate:brand-coverage 가 매번 돌기 때문에 파일은 항상 fresh.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const reactSrcDir = path.join(rootDir, "packages", "react", "src");
const reactIndexPath = path.join(reactSrcDir, "index.ts");
const htmlIndexPath = path.join(rootDir, "packages", "html", "src", "index.ts");

export const BRANDS = ["trost", "geniet", "nudge-eap", "cashwalk-biz", "runmile"];

export const BRAND_LABEL = {
  trost: "Trost",
  geniet: "Geniet",
  "nudge-eap": "NudgeEAP",
  "cashwalk-biz": "CashwalkBiz",
  runmile: "Runmile",
};

async function readReactExports() {
  const src = await fs.readFile(reactIndexPath, "utf8");
  const exports = new Set();
  for (const m of src.matchAll(/export\s+\*\s+from\s+"\.\/([A-Z][^"]*)"/g)) {
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

async function readBrandChromeFor(brand) {
  const brandDir = path.join(reactSrcDir, brand);
  const entries = await fs.readdir(brandDir, { withFileTypes: true });
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

async function readBrandChrome() {
  const out = {};
  for (const b of BRANDS) {
    out[b] = await readBrandChromeFor(b);
  }
  return out;
}

/**
 * 셀 판정 — 일반 컴포넌트는 react/html index 기반, brandChrome 행은 브랜드 chrome 폴더 기반.
 * Storybook 과 docs generator 가 같은 함수 결과를 쓰도록 한 곳에 둔다.
 */
export function reactStatus(c, brand, { reactExports, brandChrome }) {
  if (!c.nds) return "missing";
  const codeExists = c.brandChrome
    ? (brandChrome[brand]?.has(c.nds) ?? false)
    : reactExports.has(c.nds);
  if (!codeExists) return "missing";
  return c.figmaByBrand?.[brand] ? "synced" : "code";
}

export function htmlStatus(c, brand, { htmlExports }) {
  if (!c.nds) return "missing";
  if (!htmlExports.has(c.nds)) return "missing";
  return c.figmaByBrand?.[brand] ? "synced" : "code";
}

/** 메모리상 manifest 객체 (Set 포함). docs generator 가 직접 소비. */
export async function buildManifest() {
  const [reactExports, htmlExports, brandChrome] = await Promise.all([
    readReactExports(),
    readHtmlExports(),
    readBrandChrome(),
  ]);
  return { reactExports, htmlExports, brandChrome };
}

/** 직렬화 — Storybook 이 import 할 수 있게 Set → sorted array. */
export function serializeManifest(manifest) {
  return {
    brands: BRANDS,
    brandLabel: BRAND_LABEL,
    reactExports: [...manifest.reactExports].sort(),
    htmlExports: [...manifest.htmlExports].sort(),
    brandChrome: Object.fromEntries(
      BRANDS.map((b) => [b, [...(manifest.brandChrome[b] ?? [])].sort()]),
    ),
    generatedAt: new Date().toISOString(),
  };
}

/** metadata/coverage-manifest.json 에 직렬화 결과 기록 — Storybook 소스. */
export async function writeManifestJson(manifest) {
  const outPath = path.join(rootDir, "metadata", "coverage-manifest.json");
  const json = serializeManifest(manifest);
  const body = `${JSON.stringify(json, null, 2)}\n`;
  await fs.writeFile(outPath, body, "utf8");
  return outPath;
}
