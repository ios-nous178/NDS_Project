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
const OUTPUT = path.join(ROOT, "docs/semantic-tokens.md");

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
    guide: meta,
  });
}

function badge(meta) {
  if (!meta) return "";
  if (meta.status === "core") return `🟦 core${meta.figmaNode ? ` (${meta.figmaNode})` : ""}`;
  if (meta.status === "experimental") return `⬜ experimental${meta.note ? ` — ${meta.note}` : ""}`;
  return "";
}

function escape(s) {
  return (s ?? "").replace(/\|/g, "\\|");
}

function swatch(hex) {
  if (!hex) return "";
  const m = hex.match(/#([0-9A-Fa-f]{3,8})/);
  if (!m) return `\`${hex}\``;
  return `\`${hex}\``;
}

const lines = [];
lines.push("---");
lines.push("title: 시멘틱 토큰");
lines.push("sidebar_position: 4");
lines.push("---");
lines.push("");
lines.push("# 시멘틱 토큰 카탈로그");
lines.push("");
lines.push(
  "NudgeEAP 디자인 시스템에서 컴포넌트가 사용하는 시멘틱 토큰 전체 목록. 모든 변수는 단일 `--semantic-*` namespace 로 통합됨.",
);
lines.push("");
lines.push("- **CSS 변수**: 컴포넌트 스타일에서 `var(--semantic-...)` 로 사용");
lines.push(
  "- **JS 참조**: `@nudge-eap/tokens` 에서 `cv.{group}.{key}` 로 import (예: `cv.primary.main`)",
);
lines.push(
  "- **가이드**: 🟦 core = Figma 가이드에 정식 등재 / ⬜ experimental = 합의 전 (Figma 노드 표기는 `MqR7O3uvBvH5tVngwzbqGH` 파일 기준)",
);
lines.push(
  "- **값**: NudgeEAP 기본값. Trost 칸은 해당 브랜드에서 override 한 값 (빈 칸 = 기본값 상속)",
);
lines.push("");
lines.push("자동 생성: `node scripts/generate-semantic-tokens-doc.mjs`");
lines.push("");

let totalCount = 0;
for (const [groupKey, groupTitle] of GROUPS) {
  const rows = rowsByGroup.get(groupKey);
  if (!rows || rows.length === 0) continue;
  totalCount += rows.length;

  lines.push(`## ${groupTitle}`);
  lines.push("");
  lines.push("| CSS 변수 | JS 참조 | NudgeEAP | Trost | 가이드 |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const r of rows) {
    lines.push(
      `| \`${r.varName}\` | \`${r.cvPath}\` | ${swatch(r.base)} | ${swatch(r.trost)} | ${escape(badge(r.guide))} |`,
    );
  }
  lines.push("");
}

const unmapped = rowsByGroup.get("_unmapped");
if (unmapped && unmapped.length > 0) {
  lines.push("## (cv 매핑 없음)");
  lines.push("");
  lines.push(
    "아래 CSS 변수는 generate-css.js 가 emit 하지만 `cv` 객체에는 노출되지 않음 (직접 `var(...)` 로만 사용).",
  );
  lines.push("");
  lines.push("| CSS 변수 | NudgeEAP | Trost |");
  lines.push("| --- | --- | --- |");
  for (const r of unmapped) {
    lines.push(`| \`${r.varName}\` | ${swatch(r.base)} | ${swatch(r.trost)} |`);
  }
  lines.push("");
  totalCount += unmapped.length;
}

lines.push("---");
lines.push("");
lines.push(`총 ${totalCount} 개 시멘틱 토큰.`);
lines.push("");

fs.writeFileSync(OUTPUT, lines.join("\n"));
console.log(`✓ ${path.relative(ROOT, OUTPUT)} (${totalCount} tokens)`);
