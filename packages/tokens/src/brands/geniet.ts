/**
 * Geniet Brand Theme
 *
 * 지니어트(다이어트 정보 + 식품 칼로리 + 건강식품 커머스) 브랜드 토큰.
 * SSOT: Figma 지니어트-Dev / Colors (207:1484)
 *
 * 구성:
 *   - geniet.palette.ts   : atomic 컬러 스케일 (genietMint / genietGray / ...)
 *   - geniet.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base override)
 *   - geniet.ts (이 파일) : palette + semantic + typography/spacing/elevation 묶음
 */

import type { BrandTheme } from "./types";
import {
  genietBlue,
  genietGray,
  genietGreen,
  genietMint,
  genietNeutral,
  genietPurple,
  genietRed,
  genietStatus,
  genietYellow,
} from "./geniet.palette.js";
import { genietSemantic } from "./geniet.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export {
  genietMint,
  genietRed,
  genietYellow,
  genietBlue,
  genietPurple,
  genietGreen,
  genietGray,
  genietNeutral,
  genietStatus,
};
export { genietSemantic };
export type { GenietSemanticTokens } from "./geniet.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const genietTheme: BrandTheme = {
  name: "geniet",
  palette: {
    mint: genietMint,
    red: genietRed,
    yellow: genietYellow,
    blue: genietBlue,
    purple: genietPurple,
    green: genietGreen,
    gray: genietGray,
    neutral: genietNeutral,
    status: genietStatus,
  },
  semantic: genietSemantic,
  typography: {
    // SSOT: Figma 지니어트-Dev / Typography (207:1735).
    // 시스템 폰트 기본 + 디자인 baseline 은 Pretendard.
    // Figma 분류(Title1/2 · Subtitle1/2 · Body1/2/3 · Caption · Label) →
    // 본 시스템의 headline*/body*/caption*/label 키에 best-fit 매핑.
    fontFamily: {
      web: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",
      system:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    },
    typeScale: {
      headline1: { fontSize: 22, lineHeight: 28, letterSpacing: 0 }, // Title1
      headline2: { fontSize: 22, lineHeight: 28, letterSpacing: 0 }, // Title1
      headline3: { fontSize: 18, lineHeight: 26, letterSpacing: 0 }, // Title2
      headline4: { fontSize: 18, lineHeight: 26, letterSpacing: 0 }, // Title2
      headline5: { fontSize: 16, lineHeight: 24, letterSpacing: 0 }, // Subtitle1
      body1: { fontSize: 15, lineHeight: 22, letterSpacing: 0 }, // Body1
      body2: { fontSize: 14, lineHeight: 20, letterSpacing: 0 }, // Body2 / Subtitle2
      body3: { fontSize: 13, lineHeight: 18, letterSpacing: 0 }, // Body3
      caption1: { fontSize: 12, lineHeight: 16, letterSpacing: 0 }, // Caption
      caption2: { fontSize: 12, lineHeight: 16, letterSpacing: 0 }, // Caption
      label: { fontSize: 11, lineHeight: 14, letterSpacing: 0 }, // Label (Bold)
    },
  },
  spacing: {
    // DESIGN.md (brands/geniet) — 8px md 기본, xl=18 / 2xl=23 은 Geniet 고유 곡률
    radius: {
      none: 0,
      xs: 4,
      sm: 6,
      md: 8,
      lg: 12,
      xl: 18,
      "2xl": 23,
      pill: 9999,
    },
  },
  elevation: {
    shadow: {
      "0": "none",
      "1": "0 0 6px rgba(0, 0, 0, 0.04)", // subtle — 미세 구분
      "2": "0 2px 6px rgba(0, 0, 0, 0.15)", // float — 플로팅 버튼
      "3": "0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 24px 38px 3px rgba(0, 0, 0, 0.14)", // modal — Material 스타일
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
  // Component overrides — Figma 지니어트 BottomNav 가이드 (90:2).
  //   active = mint600 #00A8AC + bold, inactive = gray500 #999.
  //   label = Pretendard 10/12 (base 11/14 보다 컴팩트).
  components: {
    footer: {
      navActiveColor: "var(--semantic-text-brand-default)", // #00A8AC
      navInactiveColor: "var(--semantic-text-muted-default)", // #999
      navLabelFontSize: 10,
      navLabelLineHeight: 12,
      navActiveLabelWeight: "700",
    },
  },
};
