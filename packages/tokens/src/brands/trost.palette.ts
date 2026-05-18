/**
 * Trost Brand Palette — atomic 색상 스케일.
 *
 * trost.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * trost.ts(theme) 가 둘을 묶어 BrandTheme 로 export.
 *
 * (별도 파일로 분리한 이유: trost.ts ↔ trost.semantic.ts 순환 import 회피)
 */

export const trostYellow = {
  primary: "#FFF42E",
  light: "#FFF8B8",
  /** 검색 인풋 등 노란 테두리 (primary보다 약간 진한 톤) */
  border: "#FFE600",
} as const;

// ─── Trost × NudgeEAP Banner 토큰 ───────────────────────
export const trostEapBanner = {
  /** 배너 영역 배경 (연한 노랑) */
  bg: "#FFF8B8",
  /** 배너 내부 CTA 박스 배경 (흰색 칩) */
  ctaBg: "#FFFFFF",
  /** "넛지EAP" 강조 텍스트 색상 (NudgeEAP primary blue) */
  accent: "#2B96ED",
} as const;

export const trostCobalt = {
  500: "#4968FF",
  300: "#A3B3FF",
  100: "#EDF0FF",
  50: "#F6F7FF",
} as const;

export const trostPink = {
  500: "#F93E67",
  300: "#FFC1CE",
  100: "#FEECF0",
  50: "#FFF5F7",
} as const;

export const trostNeutral = {
  1000: "#000000",
  800: "#333333",
  700: "#606060",
  500: "#979797",
  400: "#C7C7C7",
  300: "#D8D8D8",
  200: "#E5E5E5",
  150: "#F2F2F2",
  100: "#F6F6F6",
  "cool-100": "#F4F5F7",
  "00": "#FFFFFF",
} as const;

export const trostStatus = {
  error: "#FF4111",
  blue: "#2C91FF",
  green: "#00BC78",
  orange: "#FF9D00",
} as const;
