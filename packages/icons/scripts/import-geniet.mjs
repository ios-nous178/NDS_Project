/**
 * Geniet 원본 SVG → @nudge-design/icons svg/ 로 정제 import.
 *
 * Geniet 홈페이지(GenietHomePage) 의 public/images 하위 SVG 는 viewBox 가 16/18/20/24/28/54/64 로 제각각이고,
 * fill 도 #xxx 박혀 있어 Nudge DS 표준(viewBox 24×24, currentColor) 에 맞지 않는다.
 * 이 스크립트는 19개 UI 아이콘만 골라 정제해서 packages/icons/svg/geniet-*.svg 로 떨군다.
 *
 * 사용법: node packages/icons/scripts/import-geniet.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG_DIR = join(__dirname, "..", "svg");
const GENIET_ROOT = "/Users/nudge_133/Desktop/GenietHomePage/public/images";

// [원본 상대경로, 신규 파일명] — Geniet 36개 중 UI 아이콘 19개.
// 일러스트(share/invite/banner/recommendcode-bg) 7개와 mood 캐릭터(condition+emoji) 10개는 제외.
const MAPPING = [
  ["alarm/ic-alarm-orange.svg", "geniet-alarm"],
  ["friend-invite/ic-02-arrow-down-darkgray.svg", "geniet-arrow-down"],
  ["friend-invite/ic-02-arrow-up-darkgray.svg", "geniet-arrow-up"],
  ["friend-invite/ic-arrow-right-white.svg", "geniet-arrow-right"],
  ["home/stepper/ic-arrow-right-white.svg", "geniet-arrow-right-stepper"],
  ["friend-invite/ic-back-black.svg", "geniet-arrow-back"],
  ["friend-invite/ic-copy.svg", "geniet-copy"],
  ["header/pc/ic-cashreview.svg", "geniet-cashreview"],
  ["header/pc/ic-confetti.svg", "geniet-confetti"],
  ["header/pc/ic-coupon.svg", "geniet-coupon"],
  ["header/pc/ic-login.svg", "geniet-login"],
  ["header/pc/ic-logout.svg", "geniet-logout"],
  ["header/pc/ic-my-page.svg", "geniet-mypage"],
  ["coupon-shop/gpoint.svg", "geniet-gpoint"],
  ["homt/hc-btn-play.svg", "geniet-play"],
  ["icon/footer/ic-bottomnavi-record-off.svg", "geniet-record-off"],
  ["icon/footer/ic-bottomnavi-record-on.svg", "geniet-record-on"],
  ["icon/header/ic-menu-black.svg", "geniet-menu"],
  ["icon/ic-checkcircle-mint.svg", "geniet-checkcircle"],
];

// 흰색 / 투명 / 참조 → 보존. 그 외 hex 색상 → currentColor.
function isPreservedColor(value) {
  const v = value.trim().toLowerCase();
  if (v === "none" || v === "white" || v === "transparent") return true;
  if (v.startsWith("url(")) return true;
  // #fff #ffffff #fefefe (Geniet 의 "안쪽 흰색" 패턴) 까지 흰색 계열로 간주.
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
  const attrs = svgTag[1];
  const viewBoxMatch = attrs.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) throw new Error("no viewBox");
  const [, , , w, h] = viewBoxMatch[1].trim().split(/\s+/).concat([null, null]);
  // viewBox 는 "minX minY width height"
  const parts = viewBoxMatch[1].trim().split(/\s+/);
  const origW = parseFloat(parts[2]);
  const origH = parseFloat(parts[3]);

  const innerMatch = svgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  let inner = innerMatch[1];

  // 빈 placeholder bbox path 제거 (`<path d="M0 0h24v24H0z"/>` 류 — 부모가 currentColor 가 되면 검정 사각형으로 보임)
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
    const srcPath = join(GENIET_ROOT, src);
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
  console.log(`\n  Wrote ${written} Geniet icons to ${SVG_DIR}`);
}

main();
