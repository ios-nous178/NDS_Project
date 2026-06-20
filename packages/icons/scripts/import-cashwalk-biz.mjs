/**
 * Figma 캐포비-Library (7dCJU5lNPfgcAjFPwbbLIu) IconLibraryGuide(3112:948) → svg/ import.
 *
 * Figma 카탈로그는 46 icons / 6 categories (Navigation/Action/Status/Social/GNB/Selection)
 * 인데, 17개는 이미 공용 아이콘으로 존재(chevron-*, close, plus, search, delete, edit,
 * refresh, filter, info, like, comment, share, calendar, download)해서 중복 import 하지
 * 않는다. 캐포비 카탈로그 스토리에서 공용 + 캐포비 prefix 를 함께 보여줘 46개 다 노출.
 *
 * 캐포비 전용으로 import 하는 29개:
 *   · Figma asset 다운 (20): arrow-up/down/right, caution, check, check-circle-on/off,
 *     checkbox-error/on/on-green, error, gnb-channel/chat/member/quiz/setting, message-quiz,
 *     question, radio-off, ripple
 *   · 합성/CSS-only (9, 인라인 SVG): radio-on, delete-circle, search-delete, bubble,
 *     gnb-banner, gnb-cash, banner, checkbox-off, open
 *
 * 사용:
 *   1. 사전: 31개 단일-image SVG 를 /tmp/figma-cashwalk-biz/{name}.svg 로 curl 받기
 *      (URL 매핑은 .release-notes 가 아닌 이 스크립트 헤더 참조)
 *   2. node packages/icons/scripts/import-cashwalk-biz.mjs
 *   3. pnpm --filter @nudge-design/icons build
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG_DIR = join(__dirname, "..", "svg");
const SRC_DIR = "/tmp/figma-cashwalk-biz";

// 다운 받은 Figma asset 중 캐포비 전용으로 옮길 것만 명시.
// 공용과 중복되는 close/plus/search/delete/edit/refresh/filter/info/like/comment/
// share/calendar/download 는 import 생략.
const FROM_FIGMA = [
  "arrow-up",
  "arrow-down",
  "arrow-right",
  "calendar", // DatePicker 트리거에서 project 별 swap — CashwalkBiz 는 filled + dot grid 변종.
  "caution",
  "check",
  "check-circle-on",
  "check-circle-off",
  "checkbox-error",
  "checkbox-on",
  "checkbox-on-green",
  "error",
  "gnb-channel",
  "gnb-chat",
  "gnb-member",
  "gnb-quiz",
  "gnb-setting",
  "message-quiz",
  "question",
  "radio-off",
  "ripple",
];

// 합성/CSS-only — Figma 단일 asset 으로 export 안 되어 직접 작성한 SVG.
// 24×24 viewBox + currentColor 표준 (stroke 1.5px 가 캐포비 라인 두께 기본).
// 시각적 근사치라 디테일은 차후 Figma 와 비교해 조정 가능.
const INLINE = {
  "radio-on": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
</svg>
`,
  "delete-circle": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.5"/>
  <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`,
  "search-delete": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10.5" cy="10.5" r="6.25" stroke="currentColor" stroke-width="1.5"/>
  <path d="M15 15l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M8.5 8.5l4 4M12.5 8.5l-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
</svg>
`,
  bubble: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H13l-4.5 4v-4H6.5A2.5 2.5 0 014 14.5v-8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="8.5" cy="10.5" r="1" fill="currentColor"/>
  <circle cx="12" cy="10.5" r="1" fill="currentColor"/>
  <circle cx="15.5" cy="10.5" r="1" fill="currentColor"/>
</svg>
`,
  "gnb-banner": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.25" stroke="currentColor" stroke-width="1.5"/>
  <path d="M3.75 9h16.5" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="7" cy="7" r="0.85" fill="currentColor"/>
</svg>
`,
  "gnb-cash": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
  <path d="M12 6.5v11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M15 9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 1.75 3 1.75 3 .65 3 1.75-1.34 2-3 2-3-.9-3-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`,
  banner: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3.25" y="6.5" width="17.5" height="11" rx="2.25" stroke="currentColor" stroke-width="1.5"/>
  <path d="M7.5 14V10h1.4l1.6 2.6V10h1.4v4H10.5L8.9 11.4V14H7.5zm6.6 0V10h3.4v1.1h-2v.5h1.8v1h-1.8v.3h2V14h-3.4z" fill="currentColor"/>
</svg>
`,
  "checkbox-off": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3.5" stroke="currentColor" stroke-width="1.5"/>
</svg>
`,
  open: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 4H5a1.5 1.5 0 00-1.5 1.5v13.5A1.5 1.5 0 005 20.5h13.5A1.5 1.5 0 0020 19v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M14 4h6v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20 4l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`,
};

// 색상 보존 규칙 — 흰색/투명/url 참조는 그대로 유지, 그 외 hex/var() 는 currentColor.
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

  // 빈 bounds placeholder path 제거.
  inner = inner.replace(/\s*<path[^>]*\sd="M0 0h\d+v\d+H0z"[^>]*\/>\s*/g, "\n");
  inner = inner.replace(/<g[^>]*id="Bounds"[^>]*>\s*<\/g>/g, "");

  inner = replaceColorAttr(inner, "fill");
  inner = replaceColorAttr(inner, "stroke");

  inner = inner.replace(/\s+style="[^"]*"/g, "");
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

  // 1) Figma 다운 받은 SVG 들 정제 후 cashwalk-biz-* 로 출력.
  for (const name of FROM_FIGMA) {
    const srcPath = join(SRC_DIR, `${name}.svg`);
    if (!existsSync(srcPath)) {
      console.error(`  ✗ missing: ${srcPath}`);
      continue;
    }
    const raw = readFileSync(srcPath, "utf-8");
    const out = transform(raw);
    const outPath = join(SVG_DIR, `cashwalk-biz-${name}.svg`);
    writeFileSync(outPath, out);
    console.log(`  ✓ ${name} → cashwalk-biz-${name}.svg`);
    written++;
  }

  // 2) 인라인 SVG (합성/CSS-only) 들 cashwalk-biz-* 로 출력.
  for (const [name, svg] of Object.entries(INLINE)) {
    const outPath = join(SVG_DIR, `cashwalk-biz-${name}.svg`);
    writeFileSync(outPath, svg);
    console.log(`  ✓ inline → cashwalk-biz-${name}.svg`);
    written++;
  }

  console.log(`\n  Wrote ${written} CashwalkBiz icons to ${SVG_DIR}`);
}

main();
