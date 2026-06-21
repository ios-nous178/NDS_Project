/**
 * Runmile Brand Palette — atomic 색상 스케일.
 *
 * SSOT: Figma 런마일 Library — ColorGuide (5005:2)
 *   https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/런마일---Library?node-id=5005-2
 *
 * Figma 명명(`color-main/*` / `color-black/*` / `color-blue/*` …)을 본 시스템의 평탄한
 * family 키로 매핑 — primary=orange(main) · gray(black) · blue · red · green · yellow ·
 * neutral(base black/white). generate-css.js 가 `--color-{family}-{stop}` 으로 emit.
 *
 * runmile.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * runmile.ts (theme) 가 둘을 묶어 ProjectTheme 로 export.
 */

// ─── Primary (Orange · Figma `color-main`) ──────────────
export const runmileOrange = {
  50: "#FFF7F5",
  100: "#FFF0ED",
  200: "#FFE2DC",
  300: "#FECDC1",
  400: "#FF805C",
  500: "#FF5B37",
} as const;

// ─── Blue (Figma `color-blue`) ──────────────────────────
export const runmileBlue = {
  25: "#E3F4FF",
  50: "#BBE2FF",
  100: "#8DD0FF",
  200: "#56BDFF",
  300: "#009EFF",
  400: "#008FFF",
  500: "#007AFF",
} as const;

// ─── Red (Figma `color-red`) ────────────────────────────
export const runmileRed = {
  25: "#FFF9F9",
  50: "#FFF1F1",
  100: "#FFE4E4",
  200: "#FFC2C3",
  300: "#FF8B8D",
  400: "#FF575A",
  500: "#FF2428",
} as const;

// ─── Green (Figma `color-green`) ────────────────────────
export const runmileGreen = {
  25: "#F7FCF9",
  50: "#E5F8EB",
  100: "#C0EDCD",
  200: "#95E1AD",
  300: "#62D68A",
  400: "#2ECC70",
  500: "#00C255",
} as const;

// ─── Yellow (Figma `color-yellow`) ──────────────────────
// `text` = 노랑 위 텍스트/아이콘용 접근성 톤 (Figma `color-yellow/text`).
export const runmileYellow = {
  25: "#FFFCF2",
  50: "#FFF8E5",
  100: "#FFF3CC",
  200: "#FFEA99",
  300: "#FFDF66",
  400: "#FFD233",
  500: "#FFC400",
  text: "#F39E00",
} as const;

// ─── Grayscale (Toss-style cool gray · Figma `color-black`) ──
export const runmileCoolGray = {
  100: "#F9FAFB",
  200: "#F2F4F6",
  300: "#E5E8EB",
  400: "#D1D6DB",
  500: "#B0B8C1",
  600: "#8B95A1", // Figma color-black/600 (구 #919CAA 에서 갱신)
  700: "#6B7684",
  800: "#4E5968",
  900: "#333D4B",
} as const;

// ─── Common (흑·백, Figma `color-base`) ─────────────────
export const runmileCommon = {
  "00": "#FFFFFF",
  1000: "#000000",
  white: "#FFFFFF",
  black: "#221E1F",
} as const;