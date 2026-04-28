/**
 * Trost Brand Theme
 *
 * 트로스트(한국 #1 온라인 심리 상담 플랫폼) 브랜드 토큰.
 * colors_and_type.css 실측값 기반.
 */

import type { BrandTheme } from "./types";

// ─── Palette ────────────────────────────────────────────

export const trostYellow = {
  primary: "#FFF42E",
  light: "#FFF8B8",
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

// ─── Semantic ───────────────────────────────────────────

export const trostSemantic = {
  primary: {
    main: trostYellow.primary,
    hover: "#FFE600",
    pressed: "#E6D200",
    lighter: trostYellow.light,
    bg: trostYellow.light,
    bgLighter: "#FFFCE6",
    fg: "#000000", // 노란 배경 → 검정 텍스트
  },
  secondary: {
    sub: trostCobalt[500],
    lighter: trostCobalt[300],
    bg: trostCobalt[100],
    bgLighter: trostCobalt[50],
  },
  error: {
    main: trostStatus.error,
    bg: "#FEE9E6",
  },
  caution: {
    main: trostStatus.orange,
    text: trostStatus.orange,
    bg: "#FFF8E6",
  },
  success: {
    main: trostStatus.green,
    bg: "#E6F9F2",
  },
  text: {
    strong: trostNeutral[1000], // #000000
    normal: trostNeutral[800], // #333333
    default: trostNeutral[800],
    disabled: trostNeutral[500],
    placeholder: trostNeutral[500],
    subtle: trostNeutral[700],
    inverse: trostNeutral["00"],
  },
  bg: {
    white: trostNeutral["00"],
    light: trostNeutral[100],
    coolGray: trostNeutral["cool-100"],
    coolGrayLighter: trostNeutral[150],
    disabled: trostNeutral[200],
    overlay: "rgba(0, 0, 0, 0.7)", // Trost는 70% scrim
  },
  border: {
    default: trostNeutral[200],
    light: trostNeutral[150],
    focus: trostCobalt[500],
    disabled: trostNeutral[200],
  },
  icon: {
    default: trostNeutral[800],
    subtle: trostNeutral[500],
    inverse: trostNeutral["00"],
  },
} as const;

// ─── Brand Theme ────────────────────────────────────────

export const trostTheme: BrandTheme = {
  name: "trost",
  palette: {
    yellow: trostYellow,
    cobalt: trostCobalt,
    pink: trostPink,
    neutral: trostNeutral,
    status: trostStatus,
  },
  semantic: trostSemantic,
  typography: {
    fontFamily: {
      web: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",
      system:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    },
    typeScale: {
      headline1: { fontSize: 26, lineHeight: 38, letterSpacing: 0, fontWeight: 700 },
      headline2: { fontSize: 24, lineHeight: 34, letterSpacing: 0, fontWeight: 700 },
      headline3: { fontSize: 22, lineHeight: 30, letterSpacing: 0, fontWeight: 700 },
      headline4: { fontSize: 18, lineHeight: 26, letterSpacing: 0, fontWeight: 700 },
      // headline5 — Trost에 없으므로 headline4와 동일
      headline5: { fontSize: 18, lineHeight: 26, letterSpacing: 0, fontWeight: 700 },
      body1: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: 400 },
      body2: { fontSize: 15, lineHeight: 22, letterSpacing: 0, fontWeight: 400 },
      body3: { fontSize: 14, lineHeight: 20, letterSpacing: 0, fontWeight: 400 },
      caption1: { fontSize: 13, lineHeight: 18, letterSpacing: 0, fontWeight: 400 },
      caption2: { fontSize: 12, lineHeight: 18, letterSpacing: 0, fontWeight: 400 },
      label: { fontSize: 12, lineHeight: 18, letterSpacing: 0, fontWeight: 500 },
    },
  },
  spacing: {
    radius: {
      none: 0,
      xs: 6,
      sm: 6, // Trost sm = 6px (NudgeEAP: 4px)
      md: 8,
      lg: 12,
      xl: 20, // Trost 고유: pill 형태 칩
      pill: 9999,
    },
  },
  elevation: {
    shadow: {
      sm: "0 2px 16px rgba(0, 0, 0, 0.12)", // Trost card shadow
      md: "0 4px 12px rgba(0, 0, 0, 0.15)",
      lg: "0 11px 15px -7px rgba(0, 0, 0, 0.2)",
      up: "0 -4px 12px rgba(0, 0, 0, 0.1)",
      hairline: "inset 0 0 0 1px #E5E5E5", // Trost 고유: hairline inset border
      none: "none",
    },
    zIndex: {
      base: 0,
      stickyHeader: 50,
      bottomSheet: 100,
      bottomFixedInput: 200,
      fullscreenBottomSheet: 300,
      toast: 400,
    },
  },
};
