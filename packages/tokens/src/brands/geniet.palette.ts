/**
 * Geniet Brand Palette — atomic 색상 스케일.
 *
 * SSOT: Figma 지니어트-Dev / Colors (207:1484)
 *   https://www.figma.com/design/wDL8a2RbsglC8KjNufn3ks/지니어트-Dev?node-id=207-1484
 *
 * Naming convention `geniet/{category}/{color}/{level}` 에서 category 는
 * brand wiring 시 의미를 가지므로 코드에서는 평탄한 family 키
 * (`mint` / `red` / `yellow` / `blue` / `purple` / `green` / `gray` / `neutral`)
 * 로만 노출 — generate-css.js 가 `--color-{family}-{stop}` 으로 emit.
 *
 * geniet.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * geniet.ts(theme) 가 둘을 묶어 BrandTheme 로 export.
 */

// ─── Primary (Mint) ─────────────────────────────────────
export const genietMint = {
  100: "#ECF8F9",
  400: "#7ED4D6",
  500: "#48C2C5",
  600: "#00A8AC",
} as const;

// ─── Secondary ──────────────────────────────────────────
export const genietRed = {
  100: "#FFEBEE",
  400: "#FF8192",
  500: "#FF6177",
  600: "#FF3258",
} as const;

export const genietYellow = {
  100: "#FFF8DF",
  400: "#FFD54C",
  500: "#FFB700",
  600: "#FFA500",
} as const;

export const genietBlue = {
  100: "#E4F5FF",
  400: "#62BEFA",
  500: "#1FA3F9",
} as const;

export const genietPurple = {
  100: "#E6EAFF",
  400: "#7A8EFF",
  500: "#546EFD",
} as const;

export const genietGreen = {
  100: "#F1FBF6",
  200: "#DBF8EA",
  300: "#80E9B4",
  400: "#55D695",
  500: "#49CA89",
  600: "#18B264",
} as const;

// ─── Grayscale ──────────────────────────────────────────
export const genietGray = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#ECECEC",
  300: "#DDDDDD",
  400: "#CCCCCC",
  500: "#BBBBBB",
  600: "#999999",
  700: "#777777",
  800: "#666666",
  900: "#333333",
} as const;

// ─── Black & White ──────────────────────────────────────
export const genietNeutral = {
  black: "#111111",
  white: "#FFFFFF",
} as const;

// ─── Status alias (semantic 빠른 참조용) ────────────────
export const genietStatus = {
  error: genietRed[600], // #FF3258
  success: genietGreen[500], // #49CA89
  info: genietBlue[500], // #1FA3F9
  caution: genietYellow[500], // #FFB700
} as const;
