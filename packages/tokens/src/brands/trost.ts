/**
 * Trost Brand Theme
 *
 * 트로스트(한국 #1 온라인 심리 상담 플랫폼) 브랜드 토큰.
 * colors_and_type.css 실측값 기반.
 *
 * 구성:
 *   - trost.palette.ts   : atomic 컬러 스케일 (trostYellow / trostCobalt / ...)
 *   - trost.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base override)
 *   - trost.ts (이 파일) : palette + semantic 을 묶어 BrandTheme 로 export
 */

import type { BrandTheme } from "./types";
import {
  trostCobalt,
  trostEapBanner,
  trostNeutral,
  trostPink,
  trostStatus,
  trostYellow,
} from "./trost.palette.js";
import { trostSemantic } from "./trost.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export — API 호환 유지
export { trostYellow, trostEapBanner, trostCobalt, trostPink, trostNeutral, trostStatus };
export { trostSemantic };
export type { TrostSemanticTokens } from "./trost.semantic.js";

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
