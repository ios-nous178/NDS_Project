/**
 * Runmile Brand Theme
 *
 * 런마일(러닝 대회 정보/커뮤니티 플랫폼) 브랜드 토큰.
 * SSOT: Figma 런마일 library
 *   Colors    (60:1245)  — orange / blue / red / gray / neutral
 *   Typography (63:447)  — Heading / Title / Subtitle / Body / Label
 *   BottomNav  (83:887)  — 4탭, active=black filled / inactive=gray outline
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
  runmileNeutral,
  runmileOrange,
  runmileRed,
  runmileStatus,
} from "./runmile.palette.js";
import { runmileSemantic } from "./runmile.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export { runmileOrange, runmileBlue, runmileRed, runmileGray, runmileNeutral, runmileStatus };
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
    // Toss 스타일 radius — 4/6/8/12/16/pill
    radius: {
      none: 0,
      xs: 4,
      sm: 6,
      md: 8,
      lg: 12,
      xl: 16,
      pill: 9999,
    },
  },
  elevation: {
    shadow: {
      "0": "none",
      "1": "0 1px 2px rgba(0, 0, 0, 0.04)",
      "2": "0 2px 8px rgba(0, 0, 0, 0.08)",
      "3": "0 8px 24px rgba(0, 0, 0, 0.12)",
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
      navInactiveColor: "var(--semantic-icon-muted-default)", // gray600 #919CAA
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
