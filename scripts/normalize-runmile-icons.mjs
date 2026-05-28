#!/usr/bin/env node
/**
 * Figma 런마일 library 의 아이콘 SVG asset 을
 * 24×24 viewBox + currentColor 형태로 정규화해서
 * packages/icons/svg/{mono,multicolor}/ 에 저장한다.
 *
 * Figma 의 base symbol 은 vector path 자체를 export 해 주지만, 컨테이너 css 의
 * inset / rotate / scale 변환이 따로 적용된 상태로 보여 준다. 정규화는 이
 * 변환을 미리 SVG `<g transform="...">` 로 박아 24×24 viewBox 안에 정확한
 * 위치/회전을 재현한다.
 *
 * Figma asset URL 은 1회성 export 라 만료된다. SSOT 는 git 에 들어간 SVG.
 *
 * 사용: node scripts/normalize-runmile-icons.mjs
 *
 * Item shape:
 *   { name: 'runmile-foo', src: 'foo.svg', transform: 'translate(...) ...' }   // single layer
 *   { name: 'runmile-foo', composite: [{ src, transform }, ...] }              // multi-layer
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");
const SRC_DIR = "/tmp/runmile-icons";
const MONO_DIR = path.join(REPO, "packages/icons/svg/mono");
const MULTI_DIR = path.join(REPO, "packages/icons/svg/multicolor");

const ITEMS = [
  // ─── BottomNav (Figma 83:887) ─────────────────────────
  { name: "runmile-home-active", src: "home-fill.svg", transform: "translate(2 2.1504)" },
  { name: "runmile-home", src: "home-stroke.svg", transform: "translate(2 1)" },
  {
    name: "runmile-challenge-active",
    src: "challenge-fill.svg",
    transform: "translate(4.6392 2.1288)",
  },
  { name: "runmile-challenge", src: "challenge-stroke.svg", transform: "translate(4.6392 2.1288)" },
  {
    name: "runmile-community-active",
    src: "community-fill.svg",
    transform: "translate(1.7496 2.8008)",
  },
  {
    name: "runmile-community",
    src: "community-stroke-inner.svg",
    transform: "translate(1.7496 2.8008)",
  },
  { name: "runmile-mypage-active", src: "user-fill.svg", transform: "translate(3.4992 2.94)" },
  { name: "runmile-mypage", src: "user-stroke.svg", transform: "translate(3.9864 2.94)" },

  // ─── Text Input helpers ───────────────────────────────
  { name: "runmile-search-clear", src: "search-clear.svg", transform: "translate(2 2)" },
  // 14×14 컨테이너의 11.666 path → 24×24 안에 (24-14)/2 + 8.33%inset = 6.166
  {
    name: "runmile-circle-warning",
    src: "circle-warning-fill.svg",
    transform: "translate(6.166 6.166)",
  },
  { name: "runmile-circle-check", src: "circle-check.svg", transform: "translate(6.166 6.166)" },

  // ─── Navigation ───────────────────────────────────────
  { name: "runmile-arrow-left", src: "nav-arrow-left.svg", transform: "translate(8.3 4.15)" },
  {
    name: "runmile-arrow-right",
    src: "nav-arrow-right.svg",
    transform: "translate(15.7 4.15) scale(-1 1)",
  },
  {
    name: "runmile-arrow-up",
    src: "nav-arrow-up.svg",
    transform: "translate(4.15 16.35) rotate(-90)",
  },
  {
    name: "runmile-arrow-down",
    src: "nav-arrow-down.svg",
    transform: "translate(4.15 7.65) rotate(-90) scale(-1 1)",
  },
  { name: "runmile-back", src: "nav-back.svg", transform: "translate(2.9 5.15)" },
  { name: "runmile-close", src: "nav-close.svg", transform: "translate(4.15 4.15)" },
  { name: "runmile-top", src: "nav-top.svg", transform: "translate(18.85 3.15) rotate(90)" },
  {
    name: "runmile-bottom",
    src: "nav-bottom.svg",
    transform: "translate(18.85 20.85) rotate(90) scale(-1 1)",
  },
  { name: "runmile-plus", src: "nav-plus.svg", transform: "translate(3.15 3.15)" },
  { name: "runmile-minus", src: "nav-minus.svg", transform: "translate(3.15 11.15)" },

  // ─── Action ────────────────────────────────────────────
  { name: "runmile-search", src: "act-search.svg", transform: "translate(2.65 2.65)" },
  { name: "runmile-mail", src: "act-mail.svg", transform: "translate(1 3)" },
  { name: "runmile-refresh", src: "act-refresh.svg", transform: "translate(3.5808 2.1072)" },
  { name: "runmile-filter", src: "act-filter.svg", transform: "translate(2.15 5)" },
  { name: "runmile-thumb", src: "act-thumb.svg", transform: "translate(3.4 3.15)" },
  { name: "runmile-eye", src: "act-eye.svg", transform: "translate(2.1648 4.0008)" },
  { name: "runmile-login", src: "act-login.svg", transform: "translate(3.6504 2.1504)" },
  { name: "runmile-out", src: "act-out.svg", transform: "translate(3.6504 2.1504)" },
  { name: "runmile-share", src: "act-share.svg", transform: "translate(3.1512 2.1504)" },
  { name: "runmile-hamburger", src: "act-hamburger.svg", transform: "translate(3.1512 5.1504)" },
  { name: "runmile-export", src: "act-export.svg", transform: "translate(0.6504 0.8496)" },
  { name: "runmile-ban", src: "act-ban.svg", transform: "translate(1.0008 1.9968)" },
  { name: "runmile-copy", src: "act-copy.svg", transform: "translate(3.3408 2.8392)" },
  { name: "runmile-reply", src: "act-reply.svg", transform: "translate(4.3992 3.9)" },
  { name: "runmile-image", src: "act-image.svg", transform: "translate(1.9992 1.9992)" },
  { name: "runmile-null", src: "act-null.svg", transform: "translate(3 3)" },

  // ─── Multi-layer (composite) ───────────────────────────
  // image-error: 큰 vector + 작은 warn badge
  {
    name: "runmile-image-error",
    composite: [
      { src: "act-image-error-main.svg", transform: "translate(2.2392 2.8608)" },
      { src: "act-image-error-warn.svg", transform: "translate(14.4504 14.0304)" },
    ],
  },
  // verticalkebab: 같은 dot 3개 세로 배치 (top/middle/bottom)
  {
    name: "runmile-kebab-vertical",
    composite: [
      { src: "act-kebab-dot.svg", transform: "translate(10 3)" },
      { src: "act-kebab-dot.svg", transform: "translate(10 10)" },
      { src: "act-kebab-dot.svg", transform: "translate(10 17)" },
    ],
  },
  // horzionkebab: 같은 dot 3개 가로 배치
  {
    name: "runmile-kebab-horizontal",
    composite: [
      { src: "act-kebab-dot.svg", transform: "translate(3 10)" },
      { src: "act-kebab-dot.svg", transform: "translate(10 10)" },
      { src: "act-kebab-dot.svg", transform: "translate(17 10)" },
    ],
  },

  // ─── Domain stroke/fill pairs (Figma 20:94 / Icon page) ───
  { name: "runmile-calendar", src: "dom-calendar-stroke.svg", transform: "translate(3 2.1504)" },
  {
    name: "runmile-calendar-active",
    src: "dom-calendar-fill.svg",
    transform: "translate(3 2.1504)",
  },
  {
    name: "runmile-shoe-active",
    src: "dom-shoe-fill.svg",
    transform: "translate(1.1304 1.1784)",
  },
  { name: "runmile-shoe", src: "dom-shoe-stroke.svg", transform: "translate(1.788 1.848)" },
  { name: "runmile-user", src: "dom-user-stroke.svg", transform: "translate(3.9864 2.94)" },
  {
    name: "runmile-user-active",
    src: "dom-user-fill.svg",
    transform: "translate(3.4992 2.94)",
  },
  // circlewarn outline (mono outline 안내 아이콘 — fill 은 이미 runmile-circle-warning 으로 있음)
  {
    name: "runmile-circle-warning-stroke",
    src: "dom-circlewarn-stroke.svg",
    transform: "translate(2 2)",
  },
  { name: "runmile-questionmark", src: "dom-questionmark-stroke.svg", transform: "translate(2 2)" },
  {
    name: "runmile-questionmark-active",
    src: "dom-questionmark-fill.svg",
    transform: "translate(2 2)",
  },
  {
    name: "runmile-camera",
    src: "dom-camera-stroke.svg",
    transform: "translate(0.888 2.0016)",
  },
  {
    name: "runmile-camera-active",
    src: "dom-camera-fill.svg",
    transform: "translate(1.0008 1.9992)",
  },
  { name: "runmile-trash", src: "dom-trash-stroke.svg", transform: "translate(2.15 1.5)" },
  {
    name: "runmile-trash-active",
    src: "dom-trash-fill.svg",
    transform: "translate(2.15 1.5)",
  },
  {
    name: "runmile-pen",
    src: "dom-pen-stroke.svg",
    transform: "translate(3.1392 2.8296)",
  },
  {
    name: "runmile-pen-active",
    src: "dom-pen-fill.svg",
    transform: "translate(0.72 1.5192)",
  },
  // home2 (도메인 home — BottomNav home 과는 다른 디자인): stroke 는 2 layer 합성.
  {
    name: "runmile-home-classic",
    composite: [
      { src: "dom-home2-stroke-a.svg", transform: "translate(2 1)" },
      { src: "dom-home2-stroke-b.svg", transform: "translate(2 2.1504)" },
    ],
  },
  {
    name: "runmile-home-classic-active",
    src: "dom-home2-fill.svg",
    transform: "translate(2 2.1528)",
  },
  { name: "runmile-bookmark", src: "dom-bookmark-stroke.svg", transform: "translate(4 3)" },
  {
    name: "runmile-bookmark-active",
    composite: [
      { src: "dom-bookmark-fill-a.svg", transform: "translate(4 3)" },
      { src: "dom-bookmark-fill-b.svg", transform: "translate(4 3)" },
    ],
  },
  {
    name: "runmile-alram",
    src: "dom-alram-stroke.svg",
    transform: "translate(2.4432 1.9992)",
  },
  {
    name: "runmile-alram-active",
    src: "dom-alram-fill.svg",
    transform: "translate(2.4336 1.9992)",
  },
  { name: "runmile-alram-off", src: "dom-alram-off.svg", transform: "translate(2.57 2)" },
  {
    name: "runmile-chatting",
    src: "dom-chatting-stroke.svg",
    transform: "translate(1.1304 1.1472)",
  },
  {
    name: "runmile-chatting-active",
    src: "dom-chatting-fill.svg",
    transform: "translate(1.488 1.5096)",
  },
  { name: "runmile-setting", src: "dom-setting-stroke.svg", transform: "translate(2 1.5)" },
  {
    name: "runmile-setting-active",
    src: "dom-setting-fill.svg",
    transform: "translate(2 1.5)",
  },
  { name: "runmile-information", src: "dom-info-stroke.svg", transform: "translate(2 2)" },
  { name: "runmile-information-active", src: "dom-info-fill.svg", transform: "translate(2 2)" },
  {
    name: "runmile-people",
    src: "dom-people-stroke.svg",
    transform: "translate(2 4.4112)",
  },
  {
    name: "runmile-people-active",
    src: "dom-people-fill.svg",
    transform: "translate(2 4.4112)",
  },

  // ─── State toggle icons (icon/checkbox · radio · like · eye2) ───
  // checkbox: storke(테두리) + ic(체크 마크) 두 layer 합성. inset 8.33%.
  {
    name: "runmile-checkbox",
    composite: [
      { src: "st-checkbox-off-stroke.svg", transform: "translate(2 2)" },
      { src: "st-checkbox-off-mark.svg", transform: "translate(2 2)" },
    ],
  },
  {
    name: "runmile-checkbox-active",
    composite: [
      { src: "st-checkbox-on-stroke.svg", transform: "translate(2 2)" },
      { src: "st-checkbox-on-mark.svg", transform: "translate(2 2)" },
    ],
  },
  // radiobutton: single layer inset 8.33%.
  { name: "runmile-radio", src: "st-radio-off.svg", transform: "translate(2 2)" },
  { name: "runmile-radio-active", src: "st-radio-on.svg", transform: "translate(2 2)" },
  // like (heart): inset 16.67/12.5 → top/bottom 4, left/right 3. 16wide × 16tall.
  { name: "runmile-like", src: "st-like-off.svg", transform: "translate(3 4)" },
  { name: "runmile-like-active", src: "st-like-on.svg", transform: "translate(3 4)" },
  // eye2: inset 12.5(off)/18.75(on) top/bottom, full width.
  { name: "runmile-eye-off", src: "st-eye-off.svg", transform: "translate(0 3)" },
  { name: "runmile-eye-on", src: "st-eye-on.svg", transform: "translate(0 4.5)" },

  // ─── Multicolor (icon/{fire,confetti,caution,circlecheck}/color) ───
  // Fire 28:322 — outer flame (orange) + inner flame (yellow)
  {
    name: "runmile-fire-color",
    multicolor: true,
    composite: [
      { src: "mc-fire-outer.svg", transform: "translate(3.996 2.1912)" },
      { src: "mc-fire-inner.svg", transform: "translate(7.9968 11.1912)" },
    ],
  },
  // CirclecheckColor 131:1492 — gray stroke ring + green check fill (24px standalone variant).
  {
    name: "runmile-circle-check-color",
    multicolor: true,
    composite: [
      { src: "mc-circlecheck-stroke.svg", transform: "translate(2 2)" },
      { src: "mc-circlecheck-fill.svg", transform: "translate(2 2)" },
    ],
  },
  // Caution 571:3040 — yellow triangle + white "!" bar + dot
  {
    name: "runmile-caution-color",
    multicolor: true,
    composite: [
      { src: "mc-caution-triangle.svg", transform: "translate(1.9992 3)" },
      { src: "mc-caution-bar.svg", transform: "translate(10.9872 8.856)" },
      { src: "mc-caution-dot.svg", transform: "translate(11.0928 16.0416)" },
    ],
  },
  // Confetti 235:2103 — party popper (party color mix). mask layer 는 생략, main path 들만 합성.
  {
    name: "runmile-confetti-color",
    multicolor: true,
    composite: [
      { src: "mc-confetti-base.svg", transform: "translate(0 0)" },
      { src: "mc-confetti-cone.svg", transform: "translate(3 4.7064)" },
      { src: "mc-confetti-bit1.svg", transform: "translate(14.8488 1.7376)" },
      { src: "mc-confetti-bit2.svg", transform: "translate(12.6264 0.9984)" },
      { src: "mc-confetti-bit3.svg", transform: "translate(19.296 9.888)" },
      { src: "mc-confetti-bit4.svg", transform: "translate(19.332 6.1992)" },
    ],
  },
];

function readInner(srcFile, { multicolor = false } = {}) {
  const raw = fs.readFileSync(path.join(SRC_DIR, srcFile), "utf-8");
  const inner = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]?.trim();
  if (!inner) throw new Error(`No <svg> body in ${srcFile}`);
  if (multicolor) {
    // multicolor 는 디자인 가이드의 색을 그대로 보존. var(--fill-N, #HEX) → #HEX (fallback).
    return inner.replace(/var\(--(?:fill|stroke)-\d+,\s*([^)]+)\)/g, "$1");
  }
  // mono — currentColor 화
  return inner
    .replace(/var\(--fill-0,\s*[^)]+\)/g, "currentColor")
    .replace(/var\(--stroke-0,\s*[^)]+\)/g, "currentColor");
}

function indentLines(s, indent) {
  return s
    .split("\n")
    .map((l) => indent + l)
    .join("\n");
}

function normalize(item) {
  const layers = item.composite ?? [{ src: item.src, transform: item.transform }];
  const multicolor = Boolean(item.multicolor);
  const body = layers
    .map(({ src, transform }) => {
      const inner = readInner(src, { multicolor });
      return `  <g transform="${transform}">\n${indentLines(inner, "    ")}\n  </g>`;
    })
    .join("\n");

  const out = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
${body}
</svg>
`;
  const outDir = multicolor ? MULTI_DIR : MONO_DIR;
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${item.name}.svg`);
  fs.writeFileSync(outPath, out);
  console.log(`Wrote ${path.relative(REPO, outPath)}`);
}

for (const it of ITEMS) normalize(it);
