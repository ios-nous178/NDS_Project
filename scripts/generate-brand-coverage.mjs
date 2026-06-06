import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BRANDS,
  BRAND_LABEL,
  buildManifest,
  htmlStatus,
  reactStatus,
  serializeManifest,
} from "./coverage-manifest.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const metadataPath = path.join(rootDir, "metadata", "tdsComponents.json");
const manifestJsonPath = path.join(rootDir, "metadata", "coverage-manifest.json");
const outputPath = path.join(rootDir, "docs", "components", "brand-coverage.mdx");
const checkMode = process.argv.includes("--check");

const data = JSON.parse(await fs.readFile(metadataPath, "utf8"));

const manifest = await buildManifest();
const previousManifestGeneratedAt = await readPreviousGeneratedAt(manifestJsonPath);

/** 셀 마크: ● 코드+브랜드Figma / ○ 코드만 / — 없음. brandChrome 행은 브랜드 chrome 폴더 기준. */
function glyph(status) {
  return status === "synced" ? "●" : status === "code" ? "○" : "—";
}
function reactCell(c, brand) {
  return glyph(reactStatus(c, brand, manifest));
}
function htmlCell(c, brand) {
  return glyph(htmlStatus(c, brand, manifest));
}

function hasBrandFigma(c, brand) {
  return Boolean(c.figmaByBrand?.[brand]);
}

/** 통계 — 일반 컴포넌트는 react/html exports, brandChrome 행은 브랜드 chrome union 기준. */
const total = data.components.length;
const mapped = data.components.filter((c) => c.nds).length;
const gaps = data.components.filter((c) => !c.nds).length;
const reactCovered = data.components.filter((c) => {
  if (!c.nds) return false;
  if (c.brandChrome) return BRANDS.some((b) => manifest.brandChrome[b]?.has(c.nds));
  return manifest.reactExports.has(c.nds);
}).length;
const htmlCovered = data.components.filter((c) => c.nds && manifest.htmlExports.has(c.nds)).length;
const figmaPerBrand = Object.fromEntries(
  BRANDS.map((b) => [b, data.components.filter((c) => hasBrandFigma(c, b)).length]),
);

/** 카테고리별 그룹핑 */
const groups = {};
for (const c of data.components) {
  groups[c.category] ??= [];
  groups[c.category].push(c);
}

function escapeCell(value) {
  if (!value) return "";
  return String(value)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\|/g, "\\|");
}

const lines = [
  "---",
  "sidebar_position: 2",
  "title: 브랜드 컴포넌트 커버리지",
  "---",
  "",
  "<!-- AUTO-GENERATED FILE. Run `pnpm generate:brand-coverage` after updating metadata/tdsComponents.json. -->",
  "<!-- markdownlint-disable MD024 MD013 -->",
  "",
  "# 브랜드 × 컴포넌트 커버리지",
  "",
  "NDS 가 결국 갖춰야 할 **목표 컴포넌트** 리스트를 baseline 으로,",
  "4개 브랜드 × 2개 패키지(@nudge-design/react, @nudge-design/html) 의 구현 현황을 보여줍니다.",
  "",
  "범례:",
  "",
  "- `●` 코드 + 해당 브랜드 Figma 가이드 둘 다 ✓",
  "- `○` 코드 있음, 이 브랜드 Figma 가이드 미정합",
  "- `—` 코드 없음",
  "",
  "> 브랜드 Figma 가이드는 `metadata/tdsComponents.json` 의 `figmaByBrand[brand]` 슬롯이 SSOT. 슬롯이 채워질수록 `○` 가 `●` 로 점등됩니다.",
  "> `brandChrome: true` 컴포넌트(예: Navbar→AppBar)는 `packages/react/src/{brand}/` 폴더에 해당 파일이 있어야 코드 있음으로 판정됩니다.",
  "",
  "## 요약",
  "",
  "| 항목 | 값 |",
  "|---|---|",
  `| 목표 컴포넌트 (rows) | ${total} |`,
  `| NDS 매핑됨 | ${mapped} / ${total} |`,
  `| NDS 미구현 (gap) | ${gaps} |`,
  `| React 커버 | ${reactCovered} / ${total} |`,
  `| HTML 커버 | ${htmlCovered} / ${total} |`,
  ...BRANDS.map((b) => `| Figma 정합 — ${BRAND_LABEL[b]} | ${figmaPerBrand[b]} / ${total} |`),
  "",
];

for (const [categoryKey, items] of Object.entries(groups)) {
  const categoryLabel = data.categories[categoryKey] ?? categoryKey;
  lines.push(`## ${categoryLabel}`, "");
  const brandHeaders = BRANDS.map((b) => `${BRAND_LABEL[b]} (R · H)`).join(" | ");
  lines.push(`| 목표 컴포넌트 | NDS 대응 | ${brandHeaders} |`);
  const sep = ["---", "---", ...BRANDS.map(() => "---")].join(" | ");
  lines.push(`| ${sep} |`);
  for (const c of items) {
    const target = `[${c.tds}](${c.docsUrl})`;
    const ndsCell = c.nds
      ? `**${c.nds}**${c.ndsNote ? `<br /><span style={{fontSize:11,opacity:0.7}}>${escapeCell(c.ndsNote)}</span>` : ""}`
      : `_미매핑_${c.ndsNote ? `<br /><span style={{fontSize:11,opacity:0.7}}>${escapeCell(c.ndsNote)}</span>` : ""}`;
    const brandCells = BRANDS.map((b) => `${reactCell(c, b)} · ${htmlCell(c, b)}`).join(" | ");
    lines.push(`| ${target} | ${ndsCell} | ${brandCells} |`);
  }
  lines.push("");
}

lines.push(
  "## 갱신 방법",
  "",
  "1. 브랜드별 Figma 가이드가 새로 추가되면 `metadata/tdsComponents.json` 의 해당 컴포넌트 `figmaByBrand` 객체에 URL 추가",
  "2. `pnpm generate:brand-coverage` 실행 → 이 페이지 + `metadata/coverage-manifest.json` 재생성",
  "3. Storybook `Coverage / Brand × Component (목표)` 페이지에서도 동일 데이터로 확인",
  "",
  `_데이터 출처: \`metadata/tdsComponents.json\` · \`metadata/coverage-manifest.json\` (parsed from \`packages/{react,html}/src/index.ts\` + \`packages/react/src/{brand}/\`)_`,
);

const docsBody = `${lines.join("\n").trimEnd()}\n`;
const manifestBody = `${JSON.stringify(
  serializeManifest(manifest, previousManifestGeneratedAt ?? undefined),
  null,
  2,
)}\n`;

if (checkMode) {
  const [currentDocs, currentManifest] = await Promise.all([
    readExistingText(outputPath),
    readExistingText(manifestJsonPath),
  ]);
  if (currentDocs !== docsBody || currentManifest !== manifestBody) {
    console.error(
      "[generate-brand-coverage] docs/components/brand-coverage.mdx 또는 metadata/coverage-manifest.json 이 stale 합니다. " +
        "Run `pnpm generate:brand-coverage`.",
    );
    process.exit(1);
  }
} else {
  await Promise.all([
    fs.writeFile(outputPath, docsBody, "utf8"),
    fs.writeFile(manifestJsonPath, manifestBody, "utf8"),
  ]);
}

console.log(
  checkMode
    ? `[generate-brand-coverage] up to date (${path.relative(rootDir, outputPath)}, ${path.relative(rootDir, manifestJsonPath)})`
    : `Generated ${path.relative(rootDir, outputPath)}\nGenerated ${path.relative(rootDir, manifestJsonPath)}`,
);

async function readPreviousGeneratedAt(filePath) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(text);
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
