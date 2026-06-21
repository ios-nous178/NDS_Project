/**
 * Geniet Brand Palette — atomic 색상 스케일.
 *
 * SSOT: Figma 지니어트 Library / Color Atomic (3004:2)
 *   https://www.figma.com/design/0LLw2nSq9AUhXww7pWFRlm/?node-id=3004-2
 *
 * 각 family 는 50~900 풀 10-step 램프 (Figma Atomic 가이드와 1:1).
 * Naming convention `geniet/{category}/{color}/{level}` 에서 category 는
 * brand wiring 시 의미를 가지므로 코드에서는 평탄한 family 키
 * (`mint` / `red` / `yellow` / `blue` / `purple` / `green` / `gray` / `neutral`)
 * 로만 노출 — generate-css.cjs 가 `--color-{family}-{stop}` 으로 emit.
 *
 * geniet.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * geniet.ts(theme) 가 둘을 묶어 ProjectTheme 로 export.
 */

// ─── Primary (Mint) ─────────────────────────────────────
// 프로젝트 액션 색 = mint/600 (#00A8AC). hover=700 / pressed=800.
export const genietMint = {
  50: "#F2FAFA",
  100: "#ECF5F9",
  200: "#CAF2F5",
  300: "#B1E5E5",
  400: "#7ED4D6",
  500: "#48C2C5",
  600: "#00A8AC",
  700: "#008286",
  800: "#005A5C",
  900: "#003234",
} as const;

// ─── Secondary ──────────────────────────────────────────
export const genietRed = {
  50: "#FFF0F2",
  100: "#FFEBEE",
  200: "#FFCDD4",
  300: "#FFA0AA",
  400: "#FF8192",
  500: "#FF6177",
  600: "#FF3258",
  700: "#D9263F",
  800: "#B41C2F",
  900: "#8C0F1E",
} as const;

export const genietYellow = {
  50: "#FFFBE6",
  100: "#FFF8DF",
  200: "#FFF3D0",
  300: "#FFE489",
  400: "#FFD54C",
  500: "#FFB700",
  600: "#FFA500",
  700: "#CC8400",
  800: "#996300",
  900: "#664200",
} as const;

export const genietBlue = {
  50: "#F0F9FF",
  100: "#E4F5FF",
  200: "#CFEDFF",
  300: "#A8DDFF",
  400: "#62BEFA",
  500: "#1FA3F9",
  600: "#1488D3",
  700: "#0E6DAD",
  800: "#0A5287",
  900: "#06375E",
} as const;

export const genietPurple = {
  50: "#F2F4FF",
  100: "#E6EAFF",
  200: "#C5CFFF",
  300: "#9DA8FF",
  400: "#7A8EFF",
  500: "#546EFD",
  600: "#3D55DA",
  700: "#2D40B3",
  800: "#1F2D8C",
  900: "#131D66",
} as const;

export const genietGreen = {
  50: "#F1FBF6",
  100: "#DBF8EA",
  200: "#BFEFD8",
  300: "#8AE0BA",
  400: "#55D695",
  500: "#49CA89",
  600: "#18B264",
  700: "#149354",
  800: "#0F7440",
  900: "#0A5630",
} as const;

// ─── Grayscale ──────────────────────────────────────────
// Figma Atomic 가이드 표준 10-step. 900 = #111111 (= neutral.black).
export const genietGray = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#ECECEC",
  300: "#DDDDDD",
  400: "#CCCCCC",
  500: "#999999",
  600: "#777777",
  700: "#555555",
  800: "#333333",
  900: "#111111",
} as const;

// ─── Black & White ──────────────────────────────────────
export const genietNeutral = {
  black: "#111111",
  white: "#FFFFFF",
} as const;