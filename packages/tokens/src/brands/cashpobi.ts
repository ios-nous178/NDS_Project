/**
 * Cashpobi (캐포비 · 캐시워크 포 비지니스) Brand Theme
 *
 * SSOT:
 *   - Color - Atomic         : Figma 캐포비 Library (171:6674)
 *   - SemanticColorGuide     : Figma 캐포비 Library (3222:458)
 *   - TypographyGuide        : Figma 캐포비 Library (3037:458)
 *   - GridBorderRadiusGuide  : Figma 캐포비 Library (3267:458)
 *   - SpacingGuide           : Figma 캐포비 Library (3054:458)
 *   - ElevationGuide         : Figma 캐포비 Library (3280:458)
 *
 * 구성:
 *   - cashpobi.palette.ts   : atomic 컬러 스케일 (Common / Neutral / Primary Yellow / ...)
 *   - cashpobi.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base partial override)
 *   - cashpobi.ts (이 파일) : palette + semantic + typography + spacing 묶음
 *
 * Elevation (shadow E0~E3) 은 NudgeEAP base 값과 정확히 일치 → override 없이 cascade.
 * Gap (tight/default/comfortable/loose/wide) 도 base 와 동일 → cascade.
 */

import type { BrandTheme } from "./types";
import {
  cashpobiBlue,
  cashpobiBrown,
  cashpobiCommon,
  cashpobiCoralRed,
  cashpobiGreen,
  cashpobiNeutral,
  cashpobiStatus,
  cashpobiYellow,
} from "./cashpobi.palette.js";
import { cashpobiSemantic } from "./cashpobi.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export {
  cashpobiCommon,
  cashpobiNeutral,
  cashpobiYellow,
  cashpobiCoralRed,
  cashpobiBlue,
  cashpobiGreen,
  cashpobiBrown,
  cashpobiStatus,
};
export { cashpobiSemantic };
export type { CashpobiSemanticTokens } from "./cashpobi.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const cashpobiTheme: BrandTheme = {
  name: "cashpobi",
  palette: {
    common: cashpobiCommon,
    neutral: cashpobiNeutral,
    yellow: cashpobiYellow,
    coralRed: cashpobiCoralRed,
    blue: cashpobiBlue,
    green: cashpobiGreen,
    brown: cashpobiBrown,
    status: cashpobiStatus,
  },
  semantic: cashpobiSemantic,
  typography: {
    // SSOT: Figma TypographyGuide (3037:458). Pretendard, 10 styles.
    // 캐포비 명명(Heading1/2 · Title1/2 · Subtitle1/2 · Body1/2/3 · Caption · Label) →
    // 본 시스템 키(headline1~5 · body1~3 · caption1/2 · label) 에 best-fit 매핑.
    // display1~3 은 캐포비 admin 가이드에 없으므로 NudgeEAP base cascade.
    fontFamily: {
      web: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",
      system:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    },
    typeScale: {
      headline1: { fontSize: 32, lineHeight: 40, letterSpacing: 0 }, // Heading1 — 페이지 메인 타이틀
      headline2: { fontSize: 24, lineHeight: 32, letterSpacing: 0 }, // Heading2 — 섹션 타이틀
      headline3: { fontSize: 20, lineHeight: 28, letterSpacing: 0 }, // Title1 — 주요 페이지 타이틀
      headline4: { fontSize: 18, lineHeight: 26, letterSpacing: 0 }, // Title2 — 카드 타이틀
      headline5: { fontSize: 16, lineHeight: 24, letterSpacing: 0 }, // Subtitle1 — 카드 내부 제목
      body1: { fontSize: 15, lineHeight: 22, letterSpacing: 0 }, // Body1 — 리스트/카드 본문
      body2: { fontSize: 14, lineHeight: 20, letterSpacing: 0 }, // Body2 / Subtitle2 — 기본 본문
      body3: { fontSize: 13, lineHeight: 18, letterSpacing: 0 }, // Body3 — 날짜/단위
      caption1: { fontSize: 12, lineHeight: 16, letterSpacing: 0 }, // Caption — 작은 설명
      caption2: { fontSize: 12, lineHeight: 16, letterSpacing: 0 }, // Caption (캐포비 미정의)
      label: { fontSize: 11, lineHeight: 14, letterSpacing: 0 }, // Label — 버튼 / 입력 라벨
    },
  },
  spacing: {
    // SSOT: Figma SpacingGuide (3054:458) — Atomic 20 tokens. base 의 1/7/11/13/33/80 은 미사용,
    // 캐포비는 56 추가. emit 시 base 값을 캐포비 set 으로 redefine (cascade).
    spacing: {
      "0": 0,
      "2": 2,
      "4": 4,
      "6": 6,
      "8": 8,
      "10": 10,
      "12": 12,
      "14": 14,
      "16": 16,
      "18": 18,
      "20": 20,
      "24": 24,
      "28": 28,
      "30": 30,
      "32": 32,
      "36": 36,
      "40": 40,
      "48": 48,
      "56": 56,
      "64": 64,
    },
    // Inset 7 tokens — Figma SpacingGuide. input 10px 가 캐포비 기본 (base 12px 와 다름).
    inset: {
      chip: 8,
      input: 10, // ★ 캐포비 기본 (base 12)
      card: 16,
      "card-large": 20,
      modal: 24,
      section: 30, // 신규
      page: 48, // 신규
    },
    // Gap/Title — Figma SpacingGuide. typeScale 매핑(Heading1=headline1, ...) 과 정합.
    gapTitle: {
      h1: 20, // 32px Heading1 다음
      h2: 16, // 24px Heading2 다음
      h3: 12, // 20px Title1 다음
      h4: 10, // 18px Title2 다음 (base 6 과 다름)
      h5: 8, // 16px Subtitle1 다음
      h6: 6, // 14px Subtitle2 다음 (캐포비 신규 슬롯)
    },
    // Radius — Figma GridBorderRadiusGuide. 가이드는 raw px 키(0/2/4/...)만 사용하지만
    // 명명 키(sm/md/lg/pill)도 base 와 동일하게 유지 → 컴포넌트가 어느 쪽 이름을 쓰든 작동.
    radius: {
      none: 0,
      "0": 0,
      "2": 2,
      "4": 4,
      "6": 6,
      "8": 8,
      "10": 10,
      "12": 12,
      "16": 16,
      "24": 24,
      "28": 28,
      sm: 4,
      md: 8,
      lg: 12,
      pill: 9999,
    },
    // Border / Stroke — Figma GridBorderRadiusGuide. Thin(1.5px) 캐포비 추가.
    borderWidth: {
      none: 0,
      default: 1,
      thin: 1.5,
      focus: 2,
    },
    stroke: {
      none: 0,
      default: 1,
      thin: 1.5,
      focus: 2,
    },
    // Grid — Figma SpacingGuide. Mobile gutter/margin 은 base 와 동일, desktop margin 만 다름.
    grid: {
      mobile: { gutter: 8, margin: 16 },
      desktop: { gutter: 24, margin: 40 }, // base 360 → 캐포비 admin 40
    },
    // Layout (캐포비 신규) — Figma GridBorderRadiusGuide.
    layout: {
      page: 1920, // 전체 admin 페이지 너비
      sidebar: 300, // 좌측 고정 사이드바
      content: 1395, // 콘텐츠 영역 기본
      maxContent: 1600, // 콘텐츠 max-width
    },
  },
  // Elevation — Figma ElevationGuide 의 E0~E3 가 NudgeEAP base shadow 와 완전 일치
  // → override 없이 cascade. zIndex 도 base 따라감.
};
