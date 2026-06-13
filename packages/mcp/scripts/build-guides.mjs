#!/usr/bin/env node
/**
 * build-guides.mjs — guides-src/**.md → src/guides.generated.ts 생성기.
 *
 * 가이드 본문 SSOT = packages/mcp/guides-src/{components,patterns}/<Name>.md.
 * 이 스크립트가 .md 를 파싱(guides-md.mjs)·스키마 검증해 COMPONENT_GUIDES /
 * PATTERN_GUIDES 를 TS 로 방출한다. guides.ts 는 생성물을 re-export 만 한다.
 *
 * 검증(빌드 게이트):
 *   - 알 수 없는 top-level 필드(오타) — tsc excess-property 와 이중 가드
 *   - summary 필수 · figmaNodeUrl 형식 · 브랜드 키(brand-profiles BRAND_SLUGS) 유효성
 *
 * 사용:
 *   node scripts/build-guides.mjs          # src/guides.generated.ts 재생성
 *   node scripts/build-guides.mjs --check  # 검증 + 생성물 stale 검사 (CI/lint)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRAND_SLUGS } from "@nudge-design/tokens/brand-profiles";
import { parseGuide } from "./guides-md.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.join(__dirname, "..");
const SRC_DIR = path.join(PKG, "guides-src");
const OUT_PATH = path.join(PKG, "src/guides.generated.ts");
const CHECK = process.argv.includes("--check");

const BRAND_KEYS = new Set([...BRAND_SLUGS, "*"]);

const COMPONENT_FIELDS = new Set([
  "name",
  "summary",
  "pitfalls",
  "recommended",
  "usagePolicy",
  "examples",
  "examplesHtml",
  "_htmlStatus",
  "colorMatrix",
  "sizeMatrix",
  "stateMatrix",
  "matrixOverrides",
  "validPropValues",
  "assetManifest",
  "forcedProps",
  "figmaNodeUrl",
  "references",
  "accessibility",
  "interactivePattern",
  "standalone",
  "composeWith",
]);
const PATTERN_FIELDS = new Set([
  "name",
  "summary",
  "rules",
  "avoid",
  "ruleGroups",
  "avoidGroups",
  "metrics",
  "referenceInputs",
  "examples",
  "figmaNodeUrl",
  "references",
  "_readyMade",
]);
const BRAND_KEYED_FIELDS = ["matrixOverrides", "validPropValues", "assetManifest"];

function fail(msg) {
  console.error(`[build-guides] ✗ ${msg}`);
  process.exitCode = 1;
}

function validate(kind, file, guide) {
  const allowed = kind === "components" ? COMPONENT_FIELDS : PATTERN_FIELDS;
  for (const key of Object.keys(guide)) {
    if (!allowed.has(key)) fail(`${file}: 알 수 없는 필드 "${key}" (오타?)`);
  }
  if (typeof guide.summary !== "string" || guide.summary.trim() === "") {
    fail(`${file}: summary(## summary 섹션) 필수`);
  }
  // Trost 웹 계열은 Zeplin 이 디자인 SSOT 라 zpl.io 도 허용 (예: TrostWebHeader).
  if (guide.figmaNodeUrl && !/^https:\/\/(www\.figma\.com|zpl\.io)\//.test(guide.figmaNodeUrl)) {
    fail(`${file}: figmaNodeUrl 형식 오류(figma.com/zpl.io 아님) — ${guide.figmaNodeUrl}`);
  }
  for (const field of BRAND_KEYED_FIELDS) {
    for (const brand of Object.keys(guide[field] ?? {})) {
      if (!BRAND_KEYS.has(brand)) fail(`${file}: ${field} 의 브랜드 키 "${brand}" 미지`);
    }
  }
  for (const [prop, byBrand] of Object.entries(guide.forcedProps ?? {})) {
    for (const brand of Object.keys(byBrand ?? {})) {
      if (!BRAND_KEYS.has(brand)) fail(`${file}: forcedProps.${prop} 브랜드 키 "${brand}" 미지`);
    }
  }
  for (const ref of guide.references ?? []) {
    if (ref?.brand && !BRAND_KEYS.has(ref.brand)) {
      fail(`${file}: references[].brand "${ref.brand}" 미지`);
    }
  }
}

/**
 * ruleGroups/avoidGroups 가 있고 평탄 rules/avoid 섹션이 .md 에 없으면 그룹에서 파생한다
 * (구 guides.ts 의 flattenGroups 의미 보존 — 예: visual-antipatterns).
 * 둘 다 명시한 가이드(ui-direction-proposal — 평탄본이 수동 큐레이션)는 그대로 둔다.
 */
function deriveFromGroups(guide) {
  if (guide.ruleGroups && !guide.rules) {
    guide.rules = guide.ruleGroups.flatMap((g) => g.items);
  }
  if (guide.avoidGroups && !guide.avoid) {
    guide.avoid = guide.avoidGroups.flatMap((g) => g.items);
  }
}

function readDir(kind) {
  const dir = path.join(SRC_DIR, kind);
  const out = {};
  for (const file of fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()) {
    const key = file.replace(/\.md$/, "");
    const rel = `guides-src/${kind}/${file}`;
    try {
      const guide = parseGuide(rel, key, fs.readFileSync(path.join(dir, file), "utf8"));
      if (kind === "patterns") deriveFromGroups(guide);
      validate(kind, rel, guide);
      out[key] = guide;
    } catch (e) {
      fail(e instanceof Error ? e.message : String(e));
    }
  }
  return out;
}

const components = readDir("components");
const patterns = readDir("patterns");

const generated = `/**
 * AUTO-GENERATED — packages/mcp/guides-src/**.md 에서 build-guides.mjs 가 생성. 직접 수정 금지.
 *
 * 가이드 본문 수정 → guides-src/{components|patterns}/<Name>.md 를 고치고
 * \`pnpm --filter @nudge-design/mcp build:guides\` 로 재생성해 함께 커밋한다.
 * (check-ssot 의 build-guides --check 가 stale 을 차단한다.)
 */
import type { ComponentGuide, PatternGuide } from "./guide-types.js";

export const COMPONENT_GUIDES: Record<string, ComponentGuide> = ${JSON.stringify(components, null, 2)};

export const PATTERN_GUIDES: Record<string, PatternGuide> = ${JSON.stringify(patterns, null, 2)};
`;

if (process.exitCode) {
  console.error("[build-guides] 검증 실패 — 생성 중단");
  process.exit(1);
}

if (CHECK) {
  const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf8") : "";
  if (current !== generated) {
    console.error(
      "[build-guides] ✗ src/guides.generated.ts 가 guides-src 와 어긋남(stale) — " +
        "`pnpm --filter @nudge-design/mcp build:guides` 로 재생성해 커밋하세요.",
    );
    process.exit(1);
  }
  console.log(
    `[build-guides] ✓ 검증 통과 (components=${Object.keys(components).length}, patterns=${Object.keys(patterns).length}, 생성물 fresh)`,
  );
} else {
  fs.writeFileSync(OUT_PATH, generated, "utf8");
  console.log(
    `[build-guides] 생성: components=${Object.keys(components).length} · patterns=${Object.keys(patterns).length} → src/guides.generated.ts`,
  );
}
