/**
 * Runmile Brand Palette — atomic 색상 스케일.
 *
 * SSOT: Figma 런마일 library (60:1245)
 *   https://www.figma.com/design/udH9ME1HnHk4kbxR17Neig/런마일-library--Copy-?node-id=60-1245
 *
 * 네이밍 규칙(`runmile/[category]/[color]/[level]`)에서 category 는 build 시
 * 의미를 가지므로 코드에서는 평탄한 family 키 (`orange` / `blue` / `red` /
 * `gray` / `neutral`) 로만 노출 — generate-css.js 가 `--color-{family}-{stop}`
 * 으로 emit.
 *
 * runmile.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * runmile.ts (theme) 가 둘을 묶어 BrandTheme 로 export.
 */

// ─── Primary (Orange) ───────────────────────────────────
export const runmileOrange = {
  100: "#FFF7F5",
  200: "#FFF0ED",
  300: "#FECDC1",
  400: "#FF805C",
  500: "#FF5B37",
} as const;

// ─── Secondary ──────────────────────────────────────────
export const runmileBlue = {
  500: "#007AFF",
} as const;

export const runmileRed = {
  200: "#FFE9E9",
  500: "#FF2428",
} as const;

// ─── Grayscale (Toss-style cool gray) ───────────────────
export const runmileGray = {
  100: "#F9FAFB",
  200: "#F2F4F6",
  300: "#E5E8EB",
  400: "#D1D6DB",
  500: "#B0B8C1",
  600: "#919CAA",
  700: "#6B7684",
  800: "#4E5968",
  900: "#333D4B",
} as const;

// ─── Black & White ──────────────────────────────────────
export const runmileNeutral = {
  black: "#221E1F",
  white: "#FFFFFF",
} as const;

// ─── Status alias (semantic 빠른 참조용) ────────────────
export const runmileStatus = {
  error: runmileRed[500], // #FF2428
  info: runmileBlue[500], // #007AFF
} as const;
