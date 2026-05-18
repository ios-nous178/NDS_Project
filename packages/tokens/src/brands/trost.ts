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

// ─── Semantic (Figma role-based) ────────────────────────
//
// 브랜드 정체성에 영향을 주는 그룹만 override. 누락된 키는 base(NudgeEAP)
// 가 cascade 된다.

export const trostSemantic = {
  bg: {
    page: { default: trostNeutral[150] }, // #F2F2F2
    surface: { default: trostNeutral["00"], subtle: trostNeutral[100] },
    section: { default: trostNeutral["cool-100"] },
    brand: { default: trostYellow.primary, subtle: trostYellow.light },
    status: {
      error: "#FEE9E6",
      success: "#E6F9F2",
      info: trostCobalt[100],
      caution: "#FFF8E6",
    },
    overlay: "rgba(0, 0, 0, 0.7)", // Trost 70% scrim (NudgeEAP base 40%)
    disabled: trostNeutral[200],
  },
  text: {
    strong: { default: trostNeutral[1000] }, // #000000 — Trost 강세
    normal: { default: trostNeutral[800] }, // #333333
    subtle: { default: trostNeutral[700] }, // #606060
    muted: { default: trostNeutral[500] }, // #979797
    disabled: { default: trostNeutral[400] }, // #C7C7C7
    inverse: { default: trostNeutral["00"] },
    // 노란 배경에 brand-default 텍스트를 쓰면 가독성이 떨어지므로 Trost 는
    // brand-default 를 어두운 노랑(#E6D200)으로, brand-strong 을 더 어두운
    // 노랑으로 둔다.
    brand: { default: "#E6D200", strong: "#A39200" },
    status: {
      success: trostStatus.green,
      error: trostStatus.error,
      caution: trostStatus.orange,
      info: trostCobalt[500],
    },
  },
  buttonBg: {
    default: trostYellow.primary, // #FFF42E
    hover: "#FFE600",
    pressed: "#E6D200",
    disabled: trostNeutral[200],
    secondary: {
      default: trostCobalt[50],
      hover: trostCobalt[100],
      disabled: trostNeutral[200],
    },
    outlined: {
      default: trostNeutral["00"],
      hover: trostYellow.light,
      disabled: trostNeutral["00"],
    },
  },
  buttonText: {
    default: "#000000", // 노란 배경 → 검정 텍스트 (Trost 특성)
    brand: "#E6D200",
    disabled: trostNeutral[500],
  },
  buttonBorder: {
    outlined: {
      default: trostYellow.border, // #FFE600
      hover: trostYellow.border,
      disabled: trostNeutral[300],
    },
    assistive: { default: trostNeutral[200], disabled: trostNeutral[200] },
  },
  icon: {
    strong: { default: trostNeutral[800] },
    normal: { default: trostNeutral[700] },
    disabled: { default: trostNeutral[400] },
    inverse: { default: trostNeutral["00"] },
    brand: { default: "#E6D200" }, // 노랑은 아이콘 자체로는 잘 안 보이므로 짙은 톤
    status: {
      success: trostStatus.green,
      error: trostStatus.error,
      caution: trostStatus.orange,
    },
  },
  border: {
    normal: { default: trostNeutral[200] },
    strong: { default: trostNeutral[500] },
    subtle: { default: trostNeutral[150] },
    focus: { default: trostCobalt[500] }, // Trost focus = cobalt (브랜드 정체성)
    brand: { default: trostYellow.border, disabled: trostNeutral[300] },
    disabled: { default: trostNeutral[200] },
    status: { error: trostStatus.error, caution: trostStatus.orange },
  },
  fill: {
    brand: {
      default: trostYellow.primary,
      hover: "#FFE600",
      pressed: "#E6D200",
      disabled: trostNeutral[300],
    },
    neutral: { default: trostNeutral[800], subtle: trostNeutral[100] },
    inverse: { default: trostNeutral["00"] },
    status: { error: trostStatus.error, caution: trostStatus.orange },
  },
  input: {
    bg: trostNeutral["00"],
    bgDisabled: trostNeutral[100],
    borderDefault: trostNeutral[200],
    borderHover: trostNeutral[400],
    borderFocus: trostCobalt[500],
    borderError: trostStatus.error,
    borderDisabled: trostNeutral[200],
    placeholder: trostNeutral[500],
    helpertextDefault: trostNeutral[500],
    helpertextSuccess: trostCobalt[500],
    helpertextError: trostStatus.error,
    helpertextDisabled: trostNeutral[400],
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
      headline1: { fontSize: 26, lineHeight: 38, letterSpacing: 0 },
      headline2: { fontSize: 24, lineHeight: 34, letterSpacing: 0 },
      headline3: { fontSize: 22, lineHeight: 30, letterSpacing: 0 },
      headline4: { fontSize: 18, lineHeight: 26, letterSpacing: 0 },
      // headline5 — Trost에 없으므로 headline4와 동일
      headline5: { fontSize: 18, lineHeight: 26, letterSpacing: 0 },
      body1: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
      body2: { fontSize: 15, lineHeight: 22, letterSpacing: 0 },
      body3: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
      caption1: { fontSize: 13, lineHeight: 18, letterSpacing: 0 },
      caption2: { fontSize: 12, lineHeight: 18, letterSpacing: 0 },
      label: { fontSize: 12, lineHeight: 18, letterSpacing: 0 },
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
    // Figma 가이드(556:2) — 4 Levels (E0 ~ E3). 기본 UI는 Border, Shadow는 떠있는 요소에만.
    shadow: {
      "0": "none",
      "1": "0px 2px 16px rgba(0, 0, 0, 0.10)", // Trost: 약간 더 부드러운 카드 호버 shadow
      "2": "0px 4px 12px rgba(0, 0, 0, 0.10)",
      "3": "0px 8px 24px rgba(0, 0, 0, 0.12)",
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
