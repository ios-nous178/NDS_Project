/**
 * Runmile Brand Theme
 *
 * 런마일(러닝 대회 정보/커뮤니티 플랫폼) 브랜드 토큰.
 * SSOT: Figma 런마일 Library (MssCIDnDdAjStQXHclPNIc)
 *   ColorGuide          (5005:2)  — main / black / blue / red / green / yellow / base
 *   SemanticColorGuide  (5009:2)  — BG · Text · Icon · Border · Fill role 트리
 *   Typography          (5011:2)  — Heading / Title / Subtitle / Body / Label (Pretendard)
 *   Elevation           (5020:6)  — E0~E3 drop shadow
 *   Spacing             (5025:16) — 2pt 기반 스케일 (값은 base --spacing-* 와 동일)
 *   Border & Radius     (5024:16) — Radius None~3XL/Full · Border W-Default/Icon/Strong
 *
 * 구성:
 *   - runmile.palette.ts   : atomic 컬러 스케일 (runmileOrange / runmileGray / ...)
 *   - runmile.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base override)
 *   - runmile.ts (이 파일) : palette + semantic + typography/spacing/elevation 묶음
 */

import type { BrandTheme } from "./types.js";
import {
  runmileBlue,
  runmileGray,
  runmileGreen,
  runmileNeutral,
  runmileOrange,
  runmileRed,
  runmileStatus,
  runmileYellow,
} from "./runmile.palette.js";
import { runmileSemantic } from "./runmile.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export {
  runmileOrange,
  runmileBlue,
  runmileRed,
  runmileGreen,
  runmileYellow,
  runmileGray,
  runmileNeutral,
  runmileStatus,
};
export { runmileSemantic };
export type { RunmileSemanticTokens } from "./runmile.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const runmileTheme: BrandTheme = {
  name: "runmile",
  actionsLayout: "split",
  palette: {
    orange: runmileOrange,
    blue: runmileBlue,
    red: runmileRed,
    green: runmileGreen,
    yellow: runmileYellow,
    gray: runmileGray,
    neutral: runmileNeutral,
    status: runmileStatus,
  },
  semantic: runmileSemantic,
  typography: {
    // SSOT: Figma 런마일 library / Typography (63:447). 시스템 폰트 기본 + 디자인 baseline 은 Pretendard.
    // Figma 분류 (Heading / Title1·2 / Subtitle1·2·3 / Body1·2 / label) →
    // 본 시스템의 headline*/body*/caption*/label 키에 best-fit 매핑.
    fontFamily: {
      web: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",
      system:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    },
    typeScale: {
      headline1: { fontSize: 24, lineHeight: 30, letterSpacing: 0 }, // Heading
      headline2: { fontSize: 20, lineHeight: 24, letterSpacing: 0 }, // Title 1
      headline3: { fontSize: 18, lineHeight: 24, letterSpacing: 0 }, // Title 2
      headline4: { fontSize: 16, lineHeight: 24, letterSpacing: 0 }, // Subtitle 1
      headline5: { fontSize: 15, lineHeight: 22, letterSpacing: 0 }, // Subtitle 2
      body1: { fontSize: 14, lineHeight: 20, letterSpacing: 0 }, // Subtitle 3
      body2: { fontSize: 13, lineHeight: 18, letterSpacing: 0 }, // Body 1
      body3: { fontSize: 13, lineHeight: 18, letterSpacing: 0 }, // Body 1
      caption1: { fontSize: 12, lineHeight: 16, letterSpacing: 0 }, // Body 2
      caption2: { fontSize: 12, lineHeight: 16, letterSpacing: 0 }, // Body 2
      label: { fontSize: 11, lineHeight: 14, letterSpacing: 0 }, // label
    },
  },
  spacing: {
    // Radius — Figma Border&Radius 가이드 (5024:16). None~3XL + Full(pill).
    // 스페이싱 스케일(2pt) 값은 base --spacing-* 와 동일해 override 불필요.
    radius: {
      none: 0,
      xs: 4,
      sm: 6,
      md: 8,
      lg: 12,
      xl: 15,
      "2xl": 20,
      "3xl": 24,
      pill: 9999,
    },
    // shape = radius 동기 alias (정책 스케일 일치).
    shape: {
      none: 0,
      xs: 4,
      sm: 6,
      md: 8,
      lg: 12,
      xl: 15,
      "2xl": 20,
      "3xl": 24,
      pill: 9999,
    },
    // Border Width — Figma Border&Radius 가이드 (5024:16). W-Default/Icon/Strong.
    borderWidth: {
      none: 0,
      default: 1,
      icon: 1.5,
      strong: 2,
    },
  },
  elevation: {
    // Drop shadow — Figma Elevation 가이드 (5020:6). E0~E3.
    shadow: {
      "0": "none",
      "1": "0 1px 4px rgba(0, 0, 0, 0.1)",
      "2": "0 1px 4px 2px rgba(0, 0, 0, 0.03)",
      "3": "0 4px 13px rgba(0, 0, 0, 0.06)",
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
  // Component overrides
  //   footer nav — BottomNav (Figma 83:887): active=black + filled icon, inactive=gray600 + stroke,
  //   label = Pretendard Medium 12/16 (Figma 실측). 나머지는 Figma 런마일 library 실측값
  //   (기존에 storybook brand-themes.ts 에만 살던 값을 SSOT 로 회수 — 외부 소비자도 동일 적용).
  components: {
    footer: {
      navActiveColor: "var(--semantic-icon-strong-default)", // black #221E1F
      navInactiveColor: "var(--semantic-icon-muted-default)", // gray600 #8B95A1
      navLabelFontSize: 12,
      navLabelLineHeight: 16,
      navLabelWeight: "500",
      navActiveLabelWeight: "500",
    },
    // gray400 border (Figma 144:609)
    input: { borderColor: runmileGray[400] },
    // Toss 스타일 radius
    card: { radius: 12 },
    "bottom-sheet": { radius: 16, handleColor: runmileGray[300] },
    // Chip selected — orange500 채움 (Figma 172:566)
    chip: {
      selectedBackground: runmileOrange[500],
      selectedText: runmileNeutral.white,
      selectedBorder: runmileOrange[500],
    },
    // Pagination active = gray800 fill, brand orange 아님 (Figma 120:1234)
    pagination: {
      activeBg: runmileGray[800],
      activeBgHover: runmileGray[900],
      activeText: runmileNeutral.white,
    },
  },
};
