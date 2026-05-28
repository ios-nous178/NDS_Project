import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const metadataPath = path.join(rootDir, "metadata", "tdsComponents.json");
const reactIndexPath = path.join(rootDir, "packages", "react", "src", "index.ts");
const htmlIndexPath = path.join(rootDir, "packages", "html", "src", "index.ts");
const outputPath = path.join(rootDir, "docs", "components", "brand-coverage.mdx");

const BRANDS = ["trost", "geniet", "nudge-eap", "cashwalk-biz"];
const BRAND_LABEL = {
  trost: "Trost",
  geniet: "Geniet",
  "nudge-eap": "NudgeEAP",
  "cashwalk-biz": "CashwalkBiz",
};

/**
 * packages/react/src/index.ts 와 packages/html/src/index.ts 를 직접 파싱해서
 * 코드상 실제 export 된 컴포넌트 이름 집합을 만든다. Story 와 같은 SSOT.
 */
async function readReactExports() {
  const src = await fs.readFile(reactIndexPath, "utf8");
  const exports = new Set();
  // export * from "./Button"; / export * from "./geniet";
  for (const m of src.matchAll(/export\s+\*\s+from\s+"\.\/([A-Z][^"]*)"/g)) {
    exports.add(m[1]);
  }
  return exports;
}

async function readHtmlExports() {
  const src = await fs.readFile(htmlIndexPath, "utf8");
  const exports = new Set();
  // export { NdsButton } from "./components/nds-button.js";
  for (const m of src.matchAll(/export\s+\{\s*Nds([A-Z][A-Za-z0-9]*)/g)) {
    exports.add(m[1]);
  }
  // export { NdsCard, NdsCardHeader, ... }
  for (const m of src.matchAll(/Nds([A-Z][A-Za-z0-9]*)/g)) {
    exports.add(m[1]);
  }
  return exports;
}

const data = JSON.parse(await fs.readFile(metadataPath, "utf8"));
const reactExports = await readReactExports();
const htmlExports = await readHtmlExports();

function hasBrandFigma(c, brand) {
  return Boolean(c.figmaByBrand?.[brand]);
}

/** 셀 마크: ● 코드+브랜드Figma / ○ 코드만 / — 없음 */
function reactCell(c, brand) {
  if (!c.nds) return "—";
  if (!reactExports.has(c.nds)) return "—";
  return hasBrandFigma(c, brand) ? "●" : "○";
}
function htmlCell(c, brand) {
  if (!c.nds) return "—";
  if (!htmlExports.has(c.nds)) return "—";
  return hasBrandFigma(c, brand) ? "●" : "○";
}

function brandFigmaCount(c) {
  return BRANDS.filter((b) => hasBrandFigma(c, b)).length;
}

/** 통계 */
const total = data.components.length;
const mapped = data.components.filter((c) => c.nds).length;
const gaps = data.components.filter((c) => !c.nds).length;
const reactCovered = data.components.filter((c) => c.nds && reactExports.has(c.nds)).length;
const htmlCovered = data.components.filter((c) => c.nds && htmlExports.has(c.nds)).length;
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
  "2. `pnpm generate:brand-coverage` 실행 → 이 페이지 재생성",
  "3. Storybook `Coverage / Brand × Component (목표)` 페이지에서도 동일 데이터로 확인",
  "",
  `_데이터 출처: \`metadata/tdsComponents.json\` · \`packages/react/src/index.ts\` · \`packages/html/src/index.ts\`_`,
);

await fs.writeFile(outputPath, `${lines.join("\n").trimEnd()}\n`, "utf8");
console.log(`Generated ${path.relative(rootDir, outputPath)}`);
