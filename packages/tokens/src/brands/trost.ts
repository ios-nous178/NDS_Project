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

import type { BrandTheme } from "./types.js";
import {
  trostBlue,
  trostCobalt,
  trostGreen,
  trostNeutral,
  trostPink,
  trostRed,
  trostYellow,
} from "./trost.palette.js";
import { trostSemantic } from "./trost.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export — API 호환 유지
export { trostYellow, trostCobalt, trostPink, trostNeutral, trostRed, trostBlue, trostGreen };
export { trostSemantic };
export type { TrostSemanticTokens } from "./trost.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const trostTheme: BrandTheme = {
  name: "trost",
  actionsLayout: "split",
  palette: {
    yellow: trostYellow,
    cobalt: trostCobalt,
    pink: trostPink,
    neutral: trostNeutral,
    red: trostRed,
    blue: trostBlue,
    green: trostGreen,
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
      headline4: { fontSize: 20, lineHeight: 30, letterSpacing: 0 },
      headline5: { fontSize: 18, lineHeight: 26, letterSpacing: 0 },
      body1: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
      body2: { fontSize: 15, lineHeight: 22, letterSpacing: 0 },
      body3: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
      caption1: { fontSize: 13, lineHeight: 18, letterSpacing: 0 },
      caption2: { fontSize: 12, lineHeight: 18, letterSpacing: 0 },
      label: { fontSize: 11, lineHeight: 18, letterSpacing: 0 },
    },
  },
  spacing: {
    // Semantic Gap (Figma 스페이싱 가이드 806:271) — base 와 다른 것만 override.
    // (tight 4 · comfortable 12 · loose 16 · wide 24 · label 8 은 base 동일 → cascade)
    gap: {
      default: 8, // base 10 → 가이드 Gap/Default 8
      section: 40, // 신규 — Gap/Section (페이지 내 섹션 간)
    },
    // Semantic Inset (가이드 806:271) — base 와 다른 것만 override.
    // (input 12 · card 16 · card-large 20 · modal 24 는 base 동일 → cascade)
    inset: {
      chip: 6, // base 8 → 가이드 Inset/Chip 6
      button: 14, // 신규 — Inset/Button (S/M 버튼 좌우)
      section: 32, // 신규 — Inset/Section (페이지 섹션 외곽)
    },
    // Semantic Radius (Figma 보더&레디우스 가이드 5179:108).
    radius: {
      none: 0,
      sm: 4, // Badge·Tag
      md: 6, // Input·Chip·Dropdown
      lg: 8, // 기본 — Button·Card·ListItem
      xl: 12, // 강조 카드·콘텐츠 박스
      "2xl": 16, // Modal·Sheet
      "3xl": 24, // BottomSheet·큰 모달
      pill: 9999,
    },
    // Stroke Width (가이드 5179:108) — Hairline/Default 1 · Strong(focus) 1.5 · Bold(error/강조) 2.
    stroke: { hairline: 1, default: 1, strong: 1.5, bold: 2 },
    borderWidth: { hairline: 1, default: 1, strong: 1.5, bold: 2 },
  },
  elevation: {
    // Figma 엘리베이션 가이드(5036:108) — 6 Levels (E0~E5), 2겹 drop-shadow.
    // E0 None / E1 Subtle / E2 Default / E3 Overlay / E4 Modal / E5 Dialog.
    shadow: {
      "0": "none",
      "1": "0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 1px 1px 0 rgba(0, 0, 0, 0.04)",
      "2": "0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
      "3": "0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      "4": "0 8px 24px 0 rgba(0, 0, 0, 0.16), 0 4px 8px 0 rgba(0, 0, 0, 0.08)",
      "5": "0 12px 32px 0 rgba(0, 0, 0, 0.2), 0 6px 12px 0 rgba(0, 0, 0, 0.1)",
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
  // Component overrides — 트로스트 운영 코드 실측값.
  // (기존에 storybook brand-themes.ts 에만 살던 값을 SSOT 로 회수 — 외부 소비자도 동일 적용)
  components: {
    input: { borderColor: trostNeutral[200], radius: 6 }, // 가이드 Input = Radius/Md 6
    // Button — 가이드 Button(5043:108): Small 40 (base sm 42). Large 48·Medium 44 는 base 동일.
    // 검정 Primary=color="neutral"(buttonBg.neutral), 노랑=color="primary", 블루=color="secondary".
    button: { heightSm: 40 },
    // 카드 테두리 #E0E0E0 — neutral 스케일 밖 실측값 (200 #E5E5E5 / 300 #D8D8D8 사이)
    card: { radius: 8, borderColor: "#E0E0E0" }, // 가이드 Card = Radius/Lg 8
    modal: { radius: 16, padTop: 24 }, // 가이드 Modal(171:9899) = Radius/2xl 16 · 상단 패딩 24
    // 셀렉트 칩 — 가이드 Badge&Chip(5107:130): selected = 노랑 보더 + 옅은 노랑 bg + orange 텍스트
    // (outlined-selected 룩). 구 "노란 브랜드 위 다크 채움(#333)" 에서 신 가이드로 변경. 높이 30.
    chip: {
      height: 30,
      paddingX: 10,
      selectedBackground: trostYellow[100], // #FFFDD9 (BG/Brand/Subtle)
      selectedText: trostYellow.text, // #FF9D00 (Text/Brand)
      selectedBorder: trostYellow[500], // #FFF42E (Border/Brand)
    },
    // Tab tone="color" 액센트 — 가이드 Tabs(5301:108) Line/Chip/Segment 활성색 = Point 코발트.
    // brand=노랑은 면적 채움 전용(텍스트·인디케이터 가독성↓)이라 탭 강조는 Point 로 분리.
    tab: {
      accentFill: trostCobalt[500], // #4968FF — line indicator + chip/segment 활성 채움
      accentText: trostCobalt[500], // #4968FF — line 활성 텍스트
      accentOn: trostNeutral["00"], // #FFFFFF — 코발트 채움 위 텍스트
    },
    // Controls 가이드(5158:108) — Checkbox·Radio 컨트롤 24×24, on 상태는 brand 노랑이 아닌
    // 다크(#333) + 흰 체크/점(노랑 위 가독성). 칩 선택색과 동일 톤.
    checkbox: {
      size: 24,
      checkedBg: trostNeutral[800],
      checkedBorder: trostNeutral[800],
      checkColor: trostNeutral["00"],
    },
    radio: { size: 24, checkedColor: trostNeutral[800] },
    // Toggle 50×30 (Controls 가이드 5158:108) — unchecked #EEE(스케일 밖 실측), checked 다크,
    // 썸 24·offset 3·travel 20(=50-24-3-3), material-like 그림자
    toggle: {
      trackW: 50,
      trackH: 30,
      trackBg: "#EEEEEE",
      trackActiveBg: trostNeutral[800],
      thumbSize: 24,
      thumbOffset: 3,
      thumbTravel: 20,
      thumbShadow:
        "0 1px 1px 0 rgba(0,0,0,0.24), 0 0 1px 0 rgba(0,0,0,0.12), 0 2.4px 0.8px rgba(0,0,0,0.06), 0 2.4px 6.4px rgba(0,0,0,0.15)",
    },
    // 토스트 가이드(806:1277) — drop y8 · blur24 · 18% black
    toast: { shadow: "0px 8px 24px rgba(0,0,0,0.18)" },
    // BottomSheet 가이드(5258:128): top radius 20, drag handle 40×4 #E5E5E5(=Border/Normal)
    "bottom-sheet": {
      radius: 24, // 가이드 BottomSheet = Radius/3xl 24
      handleWidth: 50,
      handleHeight: 4,
      handleColor: trostNeutral[200],
    },
    // 다크 푸터 텍스트 톤 — neutral 스케일 밖 실측값 (#CCC/#888)
    footer: { companyColor: "#CCCCCC", mutedColor: "#888888", extraColor: "#CCCCCC" },
  },
};
