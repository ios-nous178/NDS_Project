/**
 * Trost Brand Palette — atomic 색상 스케일.
 *
 * Figma 컬러 가이드(5011:108) 1:1 미러 — Yellow / Cobalt / Pink / Gray(neutral)
 * + 상태 스케일 Red / Blue / Green. 풀 numeric stop(50~900).
 *
 * trost.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * trost.ts(theme) 가 둘을 묶어 BrandTheme 로 export.
 *
 * (별도 파일로 분리한 이유: trost.ts ↔ trost.semantic.ts 순환 import 회피)
 */

// 브랜드 컬러. `text` = brand-as-text/icon 용 orange accent (Yellow/text, #FF9D00).
// 노랑 primary 는 면적 큰 채움(button/banner bg)용이지 텍스트로는 가독성 때문에 안 쓴다.
export const trostYellow = {
  50: "#FFFFEE",
  100: "#FFFDD9",
  200: "#FFF8B8",
  300: "#FFF785",
  400: "#FFF552",
  500: "#FFF42E", // primary
  600: "#E5D820",
  700: "#B8AC15",
  800: "#807800",
  900: "#4D4800",
  text: "#FF9D00",
} as const;

// Point(액센트) 컬러 — Figma 가이드 Key Pair 의 코발트. focus / point 역할.
export const trostCobalt = {
  50: "#F6F7FF",
  100: "#EDF0FF",
  200: "#C9D3FF",
  300: "#A3B3FF",
  400: "#7589FF",
  500: "#4968FF",
  600: "#3050E5",
  700: "#2138B8",
  800: "#152582",
  900: "#0A1352",
} as const;

export const trostPink = {
  50: "#FFF5F7",
  100: "#FEECF0",
  200: "#FFD7E0",
  300: "#FFC1CE",
  400: "#FB85A0",
  500: "#F93E67",
  600: "#DD2B57",
  700: "#B01C44",
  800: "#7F1131",
  900: "#4D0A1E",
} as const;

// Gray. `00` = Common/White, `1000` = Common/Black (가이드 Common 세트).
export const trostNeutral = {
  50: "#FAFAFA",
  100: "#F6F6F6",
  150: "#F2F2F2",
  200: "#E5E5E5",
  300: "#D8D8D8",
  400: "#C7C7C7",
  500: "#979797",
  600: "#7D7D7D",
  700: "#606060",
  800: "#333333",
  900: "#1A1A1A",
  "cool-100": "#F4F5F7",
  "00": "#FFFFFF",
  1000: "#000000",
} as const;

// ─── 상태 스케일 (Figma 가이드 Red / Blue / Green) ───────────────────
// error=Red · info=Blue · success=Green. 시멘틱이 stop 단위로 참조한다.

export const trostRed = {
  50: "#FFF1EC",
  100: "#FFDDD0",
  200: "#FFBFA5",
  300: "#FF9C72",
  400: "#FF6E37",
  500: "#FF4111",
  600: "#E62F00",
  700: "#B82500",
  800: "#801A00",
  900: "#4D1000",
} as const;

export const trostBlue = {
  50: "#ECF5FF",
  100: "#D4E9FF",
  200: "#ABD2FF",
  300: "#7DB7FF",
  400: "#519DFF",
  500: "#2C91FF",
  600: "#1A78E5",
  700: "#105FB8",
  800: "#074280",
  900: "#03284D",
} as const;

export const trostGreen = {
  50: "#E5F9F1",
  100: "#C4F0E0",
  200: "#94E2C3",
  300: "#5CD2A0",
  400: "#2BC489",
  500: "#00BC78",
  600: "#00A06A",
  700: "#008055",
  800: "#005A3C",
  900: "#00362B",
} as const;
