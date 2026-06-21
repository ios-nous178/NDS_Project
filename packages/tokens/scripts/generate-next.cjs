/**
 * P2 신규 파이프 (비파괴) — reference-carrying 토큰을 alias 그래프 보존하며 3-emit.
 * 기존 generate-css.cjs(값-동결 hex)는 그대로 두고 dist/next/ 에 나란히 출력한다.
 *
 *   dist/next/tokens.css         — base semantic 이 `var(--color-…)` 로 primitive 를 *가리킴*
 *   dist/next/{brand}.css        — 브랜드 팔레트 + 브랜드 semantic override(var 체인), base 위 cascade
 *   dist/next/tokens.dtcg.json   — DTCG: semantic 이 `{color.…}` alias 참조 (base)
 *   dist/next/figma-variables.json — Figma 업로드 intermediate: semantic = brand=mode, alias-by-name
 *
 * 값 동치 검증은 scripts/check-value-freeze.cjs. nds component 티어 ref화는 후속.
 */
const fs = require("fs");
const path = require("path");

const { colors } = require("../dist/colors");
const { isRef } = require("../dist/ref.js");
const { tokenMeta } = require("../dist/token-meta.js");
const dim = require("../dist/spacing"); // spacing/gap/gapTitle/inset/radius/borderWidth/stroke/sizing/grid
const { typeScale } = require("../dist/typography");
const { nudgeEapTheme } = require("../dist/projects/nudge-eap");
const { trostTheme } = require("../dist/projects/trost");
const { genietTheme } = require("../dist/projects/geniet");
const { cashwalkBizTheme } = require("../dist/projects/cashwalk-biz");
const { cashwalkTheme } = require("../dist/projects/cashwalk");
const { teamworkTheme } = require("../dist/projects/teamwork");
const { dongneSanchaekTheme } = require("../dist/projects/dongne-sanchaek");
const { runmileTheme } = require("../dist/projects/runmile");

const BRANDS = [
  { mode: "nudge-eap", theme: nudgeEapTheme }, // base — palette=colors, semantic=full
  { mode: "trost", theme: trostTheme },
  { mode: "geniet", theme: genietTheme },
  { mode: "cashwalk-biz", theme: cashwalkBizTheme },
  { mode: "cashwalk", theme: cashwalkTheme },
  { mode: "teamwork", theme: teamworkTheme }, // cashwalk 형제 — cornflower accent
  { mode: "dongne-sanchaek", theme: dongneSanchaekTheme }, // cashwalk 형제 — indigo accent
  { mode: "runmile", theme: runmileTheme },
];

function camelToKebab(s) {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
/** ref("color.coolGray.50") → "var(--color-coolGray-50)" (flattenPaletteVars 명명과 정합) */
function refToCssVar(r) {
  const [, family, stop] = r.$ref.split(".");
  return `var(--color-${family}-${stop})`;
}
/** ref("color.coolGray.50") → "{color.coolGray.50}" (DTCG alias 표기) */
function refToDtcg(r) {
  return `{${r.$ref}}`;
}
/** ref("color.coolGray.50") → "coolGray/50" (Figma variable name, 컬렉션은 mode 가 결정) */
function refToFigmaAlias(r) {
  const [, family, stop] = r.$ref.split(".");
  return `${family}/${stop}`;
}

// ─── CSS ────────────────────────────────────────────────
function paletteCssLines(palette) {
  const lines = [];
  for (const [family, scale] of Object.entries(palette)) {
    for (const [stop, value] of Object.entries(scale)) {
      if (typeof value === "string") lines.push(`  --color-${family}-${stop}: ${value};`);
    }
  }
  return lines;
}
function semanticCssLines(tree) {
  const lines = [];
  (function walk(obj, prefix) {
    for (const [key, value] of Object.entries(obj)) {
      const name = prefix ? `${prefix}-${camelToKebab(key)}` : camelToKebab(key);
      if (isRef(value)) lines.push(`  --semantic-${name}: ${refToCssVar(value)};`);
      else if (typeof value === "string") lines.push(`  --semantic-${name}: ${value};`);
      else if (value && typeof value === "object") walk(value, name);
    }
  })(tree, "");
  return lines;
}

const nextDir = path.join(__dirname, "..", "dist", "next");
fs.mkdirSync(nextDir, { recursive: true });

// base: tokens.css = color primitives + base semantic
{
  const lines = [":root {", "  /* ── Color primitives (atomic) ── */"];
  lines.push(...paletteCssLines(colors));
  lines.push("", "  /* ── Semantic (alias → primitive via var()) ── */");
  lines.push(...semanticCssLines(nudgeEapTheme.semantic));
  lines.push("}");
  fs.writeFileSync(path.join(nextDir, "tokens.css"), lines.join("\n") + "\n");
}
// brands: {brand}.css = brand palette + brand semantic override (cascade over tokens.css)
for (const { mode, theme } of BRANDS) {
  if (mode === "nudge-eap") continue;
  const lines = [":root {", "  /* ── Palette ── */"];
  lines.push(...paletteCssLines(theme.palette));
  lines.push("", "  /* ── Semantic override (alias → primitive via var()) ── */");
  lines.push(...semanticCssLines(theme.semantic));
  lines.push("}");
  fs.writeFileSync(path.join(nextDir, `${mode}.css`), lines.join("\n") + "\n");
}

// ─── DTCG (base) ────────────────────────────────────────
const dtcg = { color: {}, semantic: {} };
for (const [family, scale] of Object.entries(colors)) {
  dtcg.color[family] = {};
  for (const [stop, value] of Object.entries(scale)) {
    dtcg.color[family][stop] = { $value: value, $type: "color" };
  }
}
(function walkDtcg(obj, node) {
  for (const [key, value] of Object.entries(obj)) {
    if (isRef(value)) node[key] = { $value: refToDtcg(value), $type: "color" };
    else if (typeof value === "string") node[key] = { $value: value, $type: "color" };
    else if (value && typeof value === "object") {
      node[key] = {};
      walkDtcg(value, node[key]);
    }
  }
})(nudgeEapTheme.semantic, dtcg.semantic);
fs.writeFileSync(path.join(nextDir, "tokens.dtcg.json"), JSON.stringify(dtcg, null, 2) + "\n");

// ─── figma-variables.json (semantic = brand=mode, alias-by-name) ─────────────
// base+brand 를 mode 별로 merge(Figma 모드엔 CSS cascade 없음). ref → alias-by-name,
// 리터럴 → 값. 컬렉션 토폴로지(Core+Brand 분할)·Figma ID 해석은 P4.
function isLeaf(v) {
  return isRef(v) || typeof v === "string";
}
function deepMerge(base, over) {
  if (over === undefined) return base;
  if (isLeaf(over)) return over;
  const src = isLeaf(base) || base == null ? {} : base;
  const out = { ...src };
  for (const k of Object.keys(over)) out[k] = deepMerge(src[k], over[k]);
  return out;
}
function flattenSemantic(tree, prefix, acc) {
  for (const [key, value] of Object.entries(tree)) {
    const name = prefix ? `${prefix}/${camelToKebab(key)}` : camelToKebab(key);
    if (isLeaf(value)) acc[name] = value;
    else if (value && typeof value === "object") flattenSemantic(value, name, acc);
  }
  return acc;
}

// Figma 플러그인/변수 표시 순서: common → 그레이계열 → 표준 컬러 → 브랜드 고유색(나머지 abc).
const FAMILY_ORDER = [
  "common",
  "gray",
  "coolGray",
  "blue",
  "teal",
  "green",
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
];
const familyRank = (fam) => {
  const i = FAMILY_ORDER.indexOf(fam);
  return i >= 0 ? i : FAMILY_ORDER.length; // 브랜드 고유색(indigo/cornflower/brown 등) → 맨 뒤
};
const buildPrims = (palette) => {
  const out = {};
  const fams = Object.entries(palette).sort((a, b) => {
    const r = familyRank(a[0]) - familyRank(b[0]);
    return r !== 0 ? r : a[0].localeCompare(b[0]);
  });
  for (const [family, scale] of fams)
    for (const [stop, value] of Object.entries(scale)) out[`${family}/${stop}`] = value;
  return out;
};
// primitives: 브랜드별 컬렉션(nudge-eap 포함 — "core" 라는 별칭 없이 자기 이름으로).
const primitives = {};
const variables = {};
const allNames = new Set();
const perMode = {};
for (const { mode, theme } of BRANDS) {
  const merged = deepMerge(nudgeEapTheme.semantic, mode === "nudge-eap" ? {} : theme.semantic);
  perMode[mode] = flattenSemantic(merged, "", {});
  Object.keys(perMode[mode]).forEach((n) => allNames.add(n));
  primitives[mode] = buildPrims(theme.palette);
}
// ── Figma 변수 패널 순서 = 변수 생성 순서. 알파벳(.sort) 대신 논리 순서로 정렬해
//    패널이 뒤죽박죽 아닌 가이드 순서로 보이게 한다. ──
//   Semantic: SemanticColorGuide 카테고리 순서(bg→text→icon→border→fill→button*→input→cta),
//             카테고리 내부는 base 시멘틱 트리 순서.
//   Dimension: dimMap 정의 순서(spacing→gap→inset→radius→border-width→stroke→size→grid→typo).
const SEM_CAT_ORDER = [
  "bg", "text", "icon", "border", "fill",
  "button-bg", "button-text", "button-border", "input", "confirm-cta",
];
const orderByBase = (names, baseKeys, catOrder) => {
  const sub = new Map(baseKeys.map((n, i) => [n, i]));
  const catRank = (n) => {
    if (!catOrder) return 0;
    const i = catOrder.indexOf(n.split("/")[0]);
    return i < 0 ? catOrder.length : i;
  };
  return [...names].sort(
    (a, b) =>
      catRank(a) - catRank(b) ||
      (sub.has(a) ? sub.get(a) : 1e9) - (sub.has(b) ? sub.get(b) : 1e9) ||
      a.localeCompare(b),
  );
};
for (const name of orderByBase(allNames, Object.keys(perMode["nudge-eap"]), SEM_CAT_ORDER)) {
  const valuesByMode = {};
  for (const { mode } of BRANDS) {
    const leaf = perMode[mode][name];
    if (leaf === undefined) continue;
    valuesByMode[mode] = isRef(leaf) ? { alias: refToFigmaAlias(leaf) } : { value: leaf };
  }
  variables[name] = { type: "COLOR", valuesByMode };
}
// ─── dimensions (FLOAT, brand=mode) — Figma FLOAT 변수: gap/padding·corner·stroke·텍스트 바인딩 ───
function flatNum(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const name = prefix ? `${prefix}/${k}` : k;
    if (typeof v === "number") out[name] = v;
    else if (v && typeof v === "object") flatNum(v, name, out);
  }
  return out;
}
const tsKey = (s) => s.replace(/([a-z])(\d)/g, "$1-$2"); // body2 → body-2
function dimMap(theme) {
  const ov = (theme && theme.spacing) || {};
  const tsOv = (theme && theme.typography && theme.typography.typeScale) || {};
  const out = {};
  flatNum({ ...dim.spacing, ...(ov.spacing || {}) }, "spacing", out);
  flatNum({ ...dim.gap, ...(ov.gap || {}) }, "gap", out);
  flatNum({ ...dim.gapTitle, ...(ov.gapTitle || {}) }, "gap-title", out);
  flatNum({ ...dim.inset, ...(ov.inset || {}) }, "inset", out);
  flatNum({ ...dim.radius, ...(ov.radius || {}) }, "radius", out);
  flatNum({ ...dim.borderWidth, ...(ov.borderWidth || {}) }, "border-width", out);
  flatNum({ ...dim.stroke, ...(ov.stroke || {}) }, "stroke", out);
  flatNum(dim.sizing, "size", out);
  flatNum({ ...dim.grid, ...(ov.grid || {}) }, "grid", out);
  const ts = { ...typeScale, ...tsOv };
  for (const [k, v] of Object.entries(ts)) {
    const kk = tsKey(k);
    out[`font-size/${kk}`] = v.fontSize;
    out[`line-height/${kk}`] = v.lineHeight;
    if (v.letterSpacing != null) out[`letter-spacing/${kk}`] = v.letterSpacing;
  }
  return out;
}
const dimByMode = {};
for (const { mode, theme } of BRANDS) dimByMode[mode] = dimMap(mode === "nudge-eap" ? null : theme);
const dimNames = new Set();
for (const m of Object.values(dimByMode)) for (const n of Object.keys(m)) dimNames.add(n);
const dimVariables = {};
for (const name of orderByBase(dimNames, Object.keys(dimByMode["nudge-eap"]))) {
  const vbm = {};
  for (const { mode } of BRANDS)
    if (dimByMode[mode][name] != null) vbm[mode] = { value: dimByMode[mode][name] };
  dimVariables[name] = { type: "FLOAT", valuesByMode: vbm };
}
// typeScale 키 목록(Text Style 생성용) — 본문 weight/family 는 보류, size/lh/ls 만 변수 바인딩.
const textStyleKeys = Object.keys(typeScale).map(tsKey);

// ─── elevation (box-shadow per brand=mode) — Figma Effect Style 소스. 문자열 그대로 두고
//     플러그인이 파싱해 DropShadow 효과 + Effect Style 로 만든다(변수 타입에 그림자가 없으므로). ───
const { shadow: baseShadow } = require("../dist/elevation");
const elevByMode = {};
for (const { mode, theme } of BRANDS)
  elevByMode[mode] = {
    ...baseShadow,
    ...((mode !== "nudge-eap" && theme.elevation && theme.elevation.shadow) || {}),
  };
const elevNames = new Set();
for (const m of Object.values(elevByMode)) for (const n of Object.keys(m)) elevNames.add(n);
const elevVariables = {};
for (const name of [...elevNames].sort((a, b) =>
  String(a).localeCompare(String(b), undefined, { numeric: true }),
)) {
  const vbm = {};
  for (const { mode } of BRANDS)
    if (elevByMode[mode][name] != null) vbm[mode] = { value: elevByMode[mode][name] };
  elevVariables[name] = { valuesByMode: vbm };
}

const figma = {
  $comment:
    "P2 v1 intermediate. semantic=brand=mode, alias=variable name(컬렉션 미지정). " +
    "브랜드별 Primitive 컬렉션 분할·Figma ID 해석·alias→VARIABLE_ALIAS 변환은 P4 업로드 단계. " +
    "alias 'family/stop' 는 각 브랜드 mode=Primitive/{Brand}(nudge-eap 포함) 로 해석. " +
    "family 순서: common → gray/coolGray → 표준컬러 → 브랜드 고유색.",
  primitives,
  semantic: { modes: BRANDS.map((b) => b.mode), variables },
  dimensions: { modes: BRANDS.map((b) => b.mode), variables: dimVariables, textStyleKeys },
  elevation: { modes: BRANDS.map((b) => b.mode), variables: elevVariables },
  meta: tokenMeta,
};
fs.writeFileSync(path.join(nextDir, "figma-variables.json"), JSON.stringify(figma, null, 2) + "\n");

const brandCss = BRANDS.filter((b) => b.mode !== "nudge-eap").map((b) => `${b.mode}.css`);
console.log(
  `Generated dist/next/{tokens.css, ${brandCss.join(", ")}, tokens.dtcg.json, figma-variables.json}`,
);
