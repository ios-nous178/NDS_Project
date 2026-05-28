/**
 * Figma 지니어트-Dev (wDL8a2RbsglC8KjNufn3ks) bottom nav + header 에서 추출한 SVG → svg/ 정제 import.
 *
 * Figma asset URL 은 `fill="var(--fill-0, #111111)"` 패턴 + width/height="100%" + preserveAspectRatio="none"
 * 같은 Figma 전용 속성을 갖고 오는데, Nudge DS 표준(viewBox 24×24, currentColor)에 맞춰 정제.
 *
 * 사용법:
 *   1. /tmp/figma-geniet/{name}.svg 에 원본 SVG 떨군 뒤 (curl)
 *   2. node packages/icons/scripts/import-figma-geniet.mjs
 *
 * 매핑 (Figma asset hash → svg/ 신규 파일명) 은 MAPPING 배열에 명시.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG_DIR = join(__dirname, "..", "svg");
const SRC_DIR = "/tmp/figma-geniet";

// [원본 파일명 (확장자 제외), svg/ 신규 파일명]
const MAPPING = [
  ["geniet-home-on", "geniet-home-on"], // bottomnavi/home/on — 홈 active
  ["geniet-write-off", "geniet-write-off"], // bottomnavi/write/off — 기록 inactive
  ["geniet-benefit-on", "geniet-benefit-on"], // bottomnavi/benefit/on
  ["geniet-benefit-off", "geniet-benefit-off"],
  ["geniet-review-on", "geniet-review-on"], // bottomnavi/review state=active
  ["geniet-review-off", "geniet-review-off"], // state=inactive
  ["geniet-community", "geniet-community"], // bottomnavi/community
  ["geniet-search", "geniet-search"], // header search
];

// 흰색 / 투명 / 참조 → 보존. var() 도 currentColor 로 치환 (fallback hex 무시).
function isPreservedColor(value) {
  const v = value.trim().toLowerCase();
  if (v === "none" || v === "white" || v === "transparent") return true;
  if (v.startsWith("url(")) return true;
  if (/^#(fff|ffffff|fefefe)$/i.test(v)) return true;
  return false;
}

function replaceColorAttr(svg, attr) {
  return svg.replace(new RegExp(`${attr}="([^"]+)"`, "g"), (m, val) => {
    if (isPreservedColor(val)) return m;
    // Figma 식 var(--fill-0, #111111) 도 currentColor 로.
    if (val.startsWith("var(")) return `${attr}="currentColor"`;
    if (val.startsWith("#") || val.startsWith("rgb")) return `${attr}="currentColor"`;
    return m;
  });
}

function transform(svgText) {
  const viewBoxMatch = svgText.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) throw new Error("no viewBox");
  const parts = viewBoxMatch[1].trim().split(/\s+/);
  const origW = parseFloat(parts[2]);
  const origH = parseFloat(parts[3]);

  const innerMatch = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  let inner = innerMatch[1];

  // 빈 placeholder bbox path 제거 (currentColor 상속 시 검정 사각형 방지)
  inner = inner.replace(/\s*<path[^>]*\sd="M0 0h\d+v\d+H0z"[^>]*\/>\s*/g, "\n");

  inner = replaceColorAttr(inner, "fill");
  inner = replaceColorAttr(inner, "stroke");

  // 인라인 style 제거 (generate.js 도 strip 하지만 일관성 위해)
  inner = inner.replace(/\s+style="[^"]*"/g, "");
  // preserveAspectRatio (Figma 특이) — generate.js 가 wrapping 시 새 viewBox 박으니 inner 의 건 제거 (없어도 무해)
  inner = inner.replace(/\s+preserveAspectRatio="[^"]*"/g, "");

  let body = inner.trim();
  if (origW !== 24 || origH !== 24) {
    const sx = +(24 / origW).toFixed(6);
    const sy = +(24 / origH).toFixed(6);
    body = `<g transform="scale(${sx} ${sy})">\n${body}\n</g>`;
  }

  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${body}\n</svg>\n`;
}

function main() {
  let written = 0;
  for (const [src, name] of MAPPING) {
    const srcPath = join(SRC_DIR, `${src}.svg`);
    if (!existsSync(srcPath)) {
      console.error(`  ✗ missing: ${srcPath}`);
      continue;
    }
    const raw = readFileSync(srcPath, "utf-8");
    const out = transform(raw);
    const outPath = join(SVG_DIR, `${name}.svg`);
    writeFileSync(outPath, out);
    console.log(`  ✓ ${src}.svg → ${name}.svg`);
    written++;
  }
  console.log(`\n  Wrote ${written} Figma-Geniet icons to ${SVG_DIR}`);
}

main();
