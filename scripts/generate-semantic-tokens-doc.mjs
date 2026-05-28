#!/usr/bin/env node
/**
 * generate-semantic-tokens-doc.mjs
 *
 * `packages/tokens/dist/{tokens,trost}.css` 와 cssVar.ts/guide.ts 를
 * 합쳐 `docs/semantic-tokens.md` 를 생성한다. 컴포넌트에서 사용하는 시멘틱
 * 토큰 전체 카탈로그.
 *
 * Usage: node scripts/generate-semantic-tokens-doc.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TOKENS_DIST = path.join(ROOT, "packages/tokens/dist");
const CSSVAR_SRC = path.join(ROOT, "packages/tokens/src/cssVar.ts");
const GUIDE_SRC = path.join(ROOT, "packages/tokens/src/guide.ts");
const OUTPUT = path.join(ROOT, "docs/semantic-tokens.mdx");
const LEGACY_OUTPUT = path.join(ROOT, "docs/semantic-tokens.md");

/* ─── Parsers ───────────────────────────────────────────── */

function parseCssVars(file) {
  const text = fs.readFileSync(file, "utf8");
  const out = new Map();
  const re = /^\s*(--[\w-]+):\s*([^;]+);/gm;
  let m;
  while ((m = re.exec(text))) {
    if (m[1].startsWith("--semantic-")) out.set(m[1], m[2].trim());
  }
  return out;
}

/** cv.x.y 형태 JS 참조 ↔ CSS 변수명 매핑 추출 */
function parseCvReferences(file) {
  const text = fs.readFileSync(file, "utf8");
  const map = new Map(); // varName → cv path
  // cv 객체 트리를 단순 파싱 — 들여쓰기 기반 (그룹 한 단계만 있는 평면 구조 가정)
  const lines = text.split("\n");
  let group = null;
  for (const line of lines) {
    const groupMatch = line.match(/^\s{2}(\w+):\s*{\s*$/);
    if (groupMatch) {
      group = groupMatch[1];
      continue;
    }
    if (line.match(/^\s{2}},?\s*$/)) {
      group = null;
      continue;
    }
    const entryMatch = line.match(/^\s+(\w+):\s*v\("(--semantic-[\w-]+)"\),?/);
    if (entryMatch && group) {
      const [, key, varName] = entryMatch;
      map.set(varName, `cv.${group}.${key}`);
    }
  }
  return map;
}

/** guide.ts 의 semanticGuide 객체 파싱 — dotted path → meta */
function parseGuide(file) {
  const text = fs.readFileSync(file, "utf8");
  const map = new Map();
  const re =
    /"([\w.]+)":\s*\{\s*status:\s*"(\w+)"(?:,\s*figmaNode:\s*"([\d:]+)")?(?:,\s*note:\s*"([^"]+)")?\s*\}/g;
  let m;
  while ((m = re.exec(text))) {
    const [, key, status, figmaNode, note] = m;
    map.set(key, { status, figmaNode, note });
  }
  return map;
}

/* ─── Group classification ──────────────────────────────── */

/** cv path 의 group 키로 1차 분류 */
const GROUPS = [
  ["primary", "Palette · Primary"],
  ["secondary", "Palette · Secondary"],
  ["error", "Palette · Error"],
  ["caution", "Palette · Caution"],
  ["success", "Palette · Success"],
  ["text", "Palette · Text"],
  ["bg", "Palette · Background"],
  ["border", "Palette · Border"],
  ["icon", "Palette · Icon"],
  ["status", "Palette · Status"],
  ["surface", "Role · Surface (배경)"],
  ["textRole", "Role · Text"],
  ["iconRole", "Role · Icon"],
  ["borderRole", "Role · Border"],
  ["button", "Role · Button"],
  ["fill", "Role · Fill"],
  ["input", "Role · Input"],
];

function cvGroupKey(cvPath) {
  if (!cvPath) return "_unmapped";
  const m = cvPath.match(/^cv\.(\w+)\./);
  return m ? m[1] : "_unmapped";
}

/** guide lookup 용 dotted path: cv path 에서 `cv.` 제거 */
function guidePath(cvPath) {
  return cvPath?.replace(/^cv\./, "");
}

/* ─── Build markdown ───────────────────────────────────── */

const base = parseCssVars(path.join(TOKENS_DIST, "tokens.css"));
const trost = parseCssVars(path.join(TOKENS_DIST, "trost.css"));
const geniet = parseCssVars(path.join(TOKENS_DIST, "geniet.css"));
const cvMap = parseCvReferences(CSSVAR_SRC);
const guide = parseGuide(GUIDE_SRC);

// 그룹별 row 정리
const rowsByGroup = new Map();
for (const [varName, value] of base) {
  const cvPath = cvMap.get(varName);
  const gKey = cvGroupKey(cvPath);
  if (!rowsByGroup.has(gKey)) rowsByGroup.set(gKey, []);
  const meta = cvPath ? guide.get(guidePath(cvPath)) : undefined;
  rowsByGroup.get(gKey).push({
    varName,
    cvPath: cvPath ?? "—",
    base: value,
    trost: trost.get(varName) ?? "",
    geniet: geniet.get(varName) ?? "",
    guide: meta,
  });
}

const GROUP_INTROS = {
  surface: "페이지·서피스·섹션 등 **배경 색상**. UI 의 가장 기본 레이어.",
  textRole:
    "**텍스트 위계** — strong → normal → subtle → muted 순으로 약해짐. 브랜드·상태 색상 포함.",
  iconRole: "**아이콘 색상** — 텍스트와 같은 위계를 따름.",
  borderRole: "**경계선** — strong / normal / subtle 위계.",
  button: "버튼 컴포넌트가 사용하는 fill / border / text 색상. 대개 컴포넌트 통해 사용.",
  fill: "Chip · Badge · Tag 등 fill 형태 컴포넌트 색상.",
  input: "Input · Field 입력 영역 색상.",
  primary: "Primary 팔레트 — 브랜드 메인 색상 (legacy palette).",
  secondary: "Secondary 팔레트 — 보조 강조 색상 (legacy palette).",
  error: "Error 팔레트 (legacy).",
  caution: "Caution 팔레트 (legacy).",
  success: "Success 팔레트 (legacy).",
  text: "Text 팔레트 (legacy).",
  bg: "Background 팔레트 (legacy).",
  border: "Border 팔레트 (legacy).",
  icon: "Icon 팔레트 (legacy).",
  status: "상태 색상 (성공·에러·경고·정보).",
};

function attr(name, value) {
  if (value === undefined || value === null || value === "") return "";
  // 큰따옴표 안전 처리
  const safe = String(value).replace(/"/g, "&quot;");
  return ` ${name}="${safe}"`;
}

const lines = [];
lines.push("---");
lines.push("title: 시멘틱 토큰");
lines.push("sidebar_position: 4");
lines.push("---");
lines.push("");
lines.push(
  'import { SectionNav, TokenGrid, TokenCard } from "@site/src/components/SemanticTokens";',
);
lines.push("");
lines.push("# 시멘틱 토큰");
lines.push("");
lines.push(
  "디자인 시스템 컴포넌트가 사용하는 모든 시멘틱 토큰을 한 페이지에서 시각적으로 확인. NudgeEAP 가 기본값, **Trost / Geniet** 은 해당 브랜드에서 다른 값일 때만 카드 하단에 표시됩니다.",
);
lines.push("");
lines.push(
  "- 컴포넌트 스타일에서 `var(--semantic-...)` 로 사용 — 카드의 `⧉` 아이콘으로 한 번에 복사",
);
lines.push("- JS 에서는 `@nudge-design/tokens` 의 `cv.{group}.{key}` (예: `cv.surface.brand`)");
lines.push("- **CORE** 배지 = Figma 가이드에 정식 등재 / **EXPERIMENTAL** = 합의 전");
lines.push("");
lines.push(
  "> 자동 생성 — 값 수정은 `packages/tokens/` 에서, 페이지 재생성은 `node scripts/generate-semantic-tokens-doc.mjs`.",
);
lines.push("");

function anchor(title) {
  return title
    .toLowerCase()
    .replace(/[·().·]/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

// 1단계: 섹션 메타 모으기 (SectionNav 용)
const sections = [];
let totalCount = 0;
for (const [groupKey, groupTitle] of GROUPS) {
  const rows = rowsByGroup.get(groupKey);
  if (!rows || rows.length === 0) continue;
  sections.push({ groupKey, groupTitle, rows, anchor: anchor(groupTitle) });
  totalCount += rows.length;
}
const unmappedRows = rowsByGroup.get("_unmapped") ?? [];
if (unmappedRows.length > 0) {
  sections.push({
    groupKey: "_unmapped",
    groupTitle: "cv 매핑 없음",
    rows: unmappedRows,
    anchor: anchor("cv 매핑 없음"),
  });
  totalCount += unmappedRows.length;
}

// 2단계: SectionNav emit
lines.push("<SectionNav items={[");
for (const s of sections) {
  lines.push(`  { label: "${s.groupTitle}", count: ${s.rows.length}, href: "#${s.anchor}" },`);
}
lines.push("]} />");
lines.push("");

// 3단계: 섹션별 카드 그리드 emit
function nameLabel(cvPath) {
  // "cv.surface.page" → "surface.page"
  return cvPath && cvPath !== "—" ? cvPath.replace(/^cv\./, "") : "";
}

for (const s of sections) {
  lines.push(`## ${s.groupTitle}`);
  lines.push("");
  const intro = GROUP_INTROS[s.groupKey];
  if (intro) {
    lines.push(intro);
    lines.push("");
  }
  if (s.groupKey === "_unmapped") {
    lines.push(
      "아래 CSS 변수는 generate-css.js 가 emit 하지만 `cv` 객체에는 노출되지 않음 — 직접 `var(...)` 로만 사용.",
    );
    lines.push("");
  }
  lines.push("<TokenGrid>");
  for (const r of s.rows) {
    const propsStr = [
      attr("name", nameLabel(r.cvPath) || r.varName),
      attr("cssVar", r.varName),
      attr("base", r.base),
      attr("trost", r.trost),
      attr("geniet", r.geniet),
      attr("guide", r.guide?.status),
      attr("figmaNode", r.guide?.figmaNode),
    ].join("");
    lines.push(`  <TokenCard${propsStr} />`);
  }
  lines.push("</TokenGrid>");
  lines.push("");
}

lines.push("---");
lines.push("");
lines.push(`총 ${totalCount} 개 시멘틱 토큰.`);
lines.push("");

fs.writeFileSync(OUTPUT, lines.join("\n"));
// 과거 .md 잔재가 있으면 제거 (Docusaurus 가 두 확장자 중 하나만 라우팅하도록)
if (fs.existsSync(LEGACY_OUTPUT)) {
  fs.unlinkSync(LEGACY_OUTPUT);
}
console.log(`✓ ${path.relative(ROOT, OUTPUT)} (${totalCount} tokens)`);
