/**
 * Trost 원본 SVG → @nudge-eap/icons svg/ 로 정제 import.
 *
 * Trost 홈페이지(TrostAstroHomepage)의 public/images 하위 SVG는 viewBox 가 18/20/24/28/32/60 으로
 * 제각각이고 fill 에 브랜드 hex 가 박혀 있어 NudgeEAP DS 표준(viewBox 24×24, currentColor) 에 맞지 않는다.
 * 이 스크립트는 UI 아이콘 17개를 정제해서 packages/icons/svg/trost-*.svg 로 떨군다.
 *
 * 사용법: node packages/icons/scripts/import-trost.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG_DIR = join(__dirname, "..", "svg");
const TROST_ROOT = "/Users/nudge_133/Desktop/00_Trost/TrostAstroHomepage/public/images";

// [원본 상대경로, 신규 파일명]
// 정사각형 viewBox 만 선별 (rank 26×18 은 비례 왜곡 우려로 제외).
const MAPPING = [
  ["common/logo-mindkey-symbol.svg", "trost-mindkey-symbol"],
  ["common/ic-mental-depression.svg", "trost-mental-depression"],
  ["common/ic-mental-emotion.svg", "trost-mental-emotion"],
  ["common/ic-mental-event.svg", "trost-mental-event"],
  ["common/ic-mental-mbti.svg", "trost-mental-mbti"],
  ["common/ic-mental-medicine.svg", "trost-mental-medicine"],
  ["common/ic-mental-routine.svg", "trost-mental-routine"],
  ["common/ic-mental-selfesteem.svg", "trost-mental-selfesteem"],
  ["common/ic-mental-sound.svg", "trost-mental-sound"],
  ["common/ic-mental-location-hospital.svg", "trost-mental-location-hospital"],
  ["service/test/ic_testresult_safe.svg", "trost-testresult-safe"],
  ["service/test/ic_testresult_warning.svg", "trost-testresult-warning"],
  ["service/test/ic_testresult_danger.svg", "trost-testresult-danger"],
  ["service/test/ic_trost_link_circle.svg", "trost-link-circle"],
  ["service/test/ic_trost_plus_circle.svg", "trost-plus-circle"],
  ["header/ic-energy-coin.svg", "trost-energy-coin"],
  ["home/ic_psych_test.svg", "trost-psych-test"],
];

// 흰색 / 투명 / 참조 → 보존. 그 외 hex 색상 → currentColor.
function isPreservedColor(value) {
  const v = value.trim().toLowerCase();
  if (v === "none" || v === "white" || v === "transparent") return true;
  if (v.startsWith("url(")) return true;
  // #fff #ffffff #fefefe (안쪽 흰색 패턴) 까지 흰색 계열로 간주.
  if (/^#(fff|ffffff|fefefe)$/i.test(v)) return true;
  return false;
}

function replaceColorAttr(svg, attr) {
  return svg.replace(new RegExp(`${attr}="([^"]+)"`, "g"), (m, val) => {
    if (isPreservedColor(val)) return m;
    if (val.startsWith("#") || val.startsWith("rgb")) return `${attr}="currentColor"`;
    return m;
  });
}

function transform(svgText) {
  const svgTag = svgText.match(/<svg([^>]*)>/);
  if (!svgTag) throw new Error("no <svg> tag");
  const viewBoxMatch = svgTag[1].match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) throw new Error("no viewBox");
  const parts = viewBoxMatch[1].trim().split(/\s+/);
  const origW = parseFloat(parts[2]);
  const origH = parseFloat(parts[3]);

  const innerMatch = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  let inner = innerMatch[1];

  // 빈 placeholder bbox path 제거 (`<path d="M0 0h32v32H0z"/>` 류 — 부모가 currentColor 가 되면 검정 사각형으로 보임)
  inner = inner.replace(/\s*<path[^>]*\sd="M0 0h\d+v\d+H0z"[^>]*\/>\s*/g, "\n");

  // 색상 치환
  inner = replaceColorAttr(inner, "fill");
  inner = replaceColorAttr(inner, "stroke");

  // 인라인 style 제거 (generate.js 도 strip 하지만 일관성 위해)
  inner = inner.replace(/\s+style="[^"]*"/g, "");

  // 사이즈가 24 가 아니면 transform scale 적용
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
    const srcPath = join(TROST_ROOT, src);
    if (!existsSync(srcPath)) {
      console.error(`  ✗ missing: ${srcPath}`);
      continue;
    }
    const raw = readFileSync(srcPath, "utf-8");
    const out = transform(raw);
    const outPath = join(SVG_DIR, `${name}.svg`);
    writeFileSync(outPath, out);
    console.log(`  ✓ ${src} → ${name}.svg`);
    written++;
  }
  console.log(`\n  Wrote ${written} Trost icons to ${SVG_DIR}`);
}

main();
