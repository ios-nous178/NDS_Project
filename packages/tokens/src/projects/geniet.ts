/**
 * Geniet Brand Theme
 *
 * 지니어트(다이어트 정보 + 식품 칼로리 + 건강식품 커머스) 프로젝트 토큰.
 * SSOT: Figma 지니어트-Dev / Colors (207:1484)
 *
 * 구성:
 *   - geniet.palette.ts   : atomic 컬러 스케일 (genietTeal / genietGray / ...)
 *   - geniet.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base override)
 *   - geniet.ts (이 파일) : palette + semantic + typography/spacing/elevation 묶음
 */

import type { ProjectTheme } from "./types.js";
import {
  genietBlue,
  genietGray,
  genietGreen,
  genietTeal,
  genietCommon,
  genietPurple,
  genietRed,
  genietYellow,
} from "./geniet.palette.js";
import { genietSemantic } from "./geniet.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export {
  genietTeal,
  genietRed,
  genietYellow,
  genietBlue,
  genietPurple,
  genietGreen,
  genietGray,
  genietCommon,
};
export { genietSemantic };
export type { GenietSemanticTokens } from "./geniet.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const genietTheme: ProjectTheme = {
  name: "geniet",
  actionsLayout: "split",
  palette: {
    teal: genietTeal,
    red: genietRed,
    yellow: genietYellow,
    blue: genietBlue,
    purple: genietPurple,
    green: genietGreen,
    gray: genietGray,
    common: genietCommon,
  },
  semantic: genietSemantic,
  typography: {
    // SSOT: Figma 지니어트 Library / Typography Scale (3013:2).
    // 14 scale steps × Bold/Medium/Regular = 42 text styles. Pretendard baseline.
    // Display(3) + Headline(5) + Body(3) + Caption(2) + Label(1) → DS typeScale 키와 1:1.
    // (구버전의 Title/Subtitle best-fit 매핑은 폐기 — base 표준 램프와 동일해짐.)
    fontFamily: {
      web: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",
      system:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    },
    typeScale: {
      display1: { fontSize: 52, lineHeight: 74, letterSpacing: 0 }, // 프로젝트/캠페인 대형 타이틀
      display2: { fontSize: 48, lineHeight: 62, letterSpacing: 0 }, // 강조형 대형 페이지 타이틀
      display3: { fontSize: 40, lineHeight: 52, letterSpacing: 0 }, // 핵심 메시지·프로모션 타이틀
      headline1: { fontSize: 36, lineHeight: 48, letterSpacing: 0 }, // 주요 페이지 타이틀
      headline2: { fontSize: 28, lineHeight: 38, letterSpacing: 0 }, // 섹션 타이틀·화면 내 큰 제목
      headline3: { fontSize: 24, lineHeight: 32, letterSpacing: 0 }, // 카드 타이틀·콘텐츠 그룹명
      headline4: { fontSize: 20, lineHeight: 28, letterSpacing: 0 }, // 리스트/모달 헤더
      headline5: { fontSize: 18, lineHeight: 26, letterSpacing: 0 }, // 작은 섹션 제목·보조 타이틀
      body1: { fontSize: 16, lineHeight: 24, letterSpacing: 0 }, // 주요 본문
      body2: { fontSize: 15, lineHeight: 22, letterSpacing: 0 }, // 일반 본문·리스트
      body3: { fontSize: 14, lineHeight: 20, letterSpacing: 0 }, // 보조 본문·캡션
      caption1: { fontSize: 13, lineHeight: 18, letterSpacing: 0 }, // 날짜·수치·메타
      caption2: { fontSize: 12, lineHeight: 16, letterSpacing: 0 }, // 경고·안내·보조
      label: { fontSize: 11, lineHeight: 14, letterSpacing: 0 }, // 버튼 라벨·인디케이터
    },
  },
  spacing: {
    // Gap·Inset 은 캐시워크 SpacingGuide(361:1328) 공통 사용 — 프로젝트 override 제거.
    //   (옛 지니어트 가이드 3034:2 의 default 8·chip 6 + 미사용 section/button 토큰 폐지
    //    → base 캐시워크 값 default 10·chip 8 로 통일. radius·stroke 도 base 공통.)
    // Section/Container 가이드(1385:13): PC max-width 만 1280 — 구조적 레이아웃이라 유지(스페이싱 스케일 아님).
    grid: {
      desktop: { contentWidth: 1280 },
    },
  },
  elevation: {
    // SSOT: Figma 지니어트 Library / Elevation (3031:6) — 4 levels E0~E3.
    shadow: {
      "0": "none", // E0 None — 일반 본문·기본 카드·테이블 row
      "1": "0 2px 6px rgba(221, 221, 221, 0.6)", // E1 Subtle — 뜨는 작은 버튼·카드 TOP 버튼·작은 토스트
      "2": "0 3px 15px rgba(0, 0, 0, 0.1)", // E2 Default — 제품 카드·Contained 버튼·Dropdown·Tooltip
      "3": "0 12px 32px rgba(0, 0, 0, 0.16)", // E3 Overlay — Modal·Popover·큰 overlay·Bottom Sheet
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
  //   footer nav — Figma 지니어트 BottomNav 가이드 (90:2): active = teal600 #00A8AC + bold,
  //   inactive = gray500 #999, label = Pretendard 10/12 (base 11/14 보다 컴팩트).
  //   나머지는 GenietHomepage 운영 코드/DESIGN.md 실측값
  //   (기존에 storybook brand-themes.ts 에만 살던 값을 SSOT 로 회수 — 외부 소비자도 동일 적용).
  components: {
    footer: {
      navActiveColor: "var(--semantic-text-brand-default)", // #00A8AC
      navInactiveColor: "var(--semantic-text-muted-default)", // #999
      navLabelFontSize: 10,
      navLabelLineHeight: 12,
      navActiveLabelWeight: "700",
      companyColor: genietGray[500], // #999999 (gray 램프 리넘버: 구 gray[600])
      mutedColor: genietGray[600], // #777777 (구 gray[700])
      extraColor: genietGray[500], // #999999 (구 gray[600])
    },
    input: { borderColor: genietGray[300] },
    // Button — S/XS 높이는 캐시워크 ButtonGuide(262:1815) 공통(base sm40/xs36)으로 흡수 → override 제거.
    // Radius 가이드(3134:2): Card = Shape/LG = 12px. border 1px #ECECEC.
    card: { radius: 12, borderColor: genietGray[200] },
    // Radius 가이드: Modal = Shape/XL = 16px. (그림자는 elevation.shadow[3] = E3 Overlay)
    modal: { radius: 16 },
    // Badge&Chip 가이드(3058:84): Chip Selected = Teal/50 bg + Teal/600 text (옅은 필터 칩).
    // (Pill 형태는 컴포넌트 기본 radius.full. 구 teal/600 solid+흰 텍스트는 과교정이라 환원.)
    chip: {
      selectedBackground: genietTeal[50], // #F2FAFA
      selectedText: genietTeal[600], // #00A8AC
      selectedBorder: genietTeal[50], // bg 와 동일 — borderless 라이트 칩
      // 치수 — 가이드(3058:84): h32 고정(다른 크기는 padding 조절) · padding 6/14 · Medium 13.
      height: 32,
      paddingY: 6,
      paddingX: 14,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "500",
    },
    // Control 가이드(171:9904): toggle 51×31, on=brand teal, off=gray/200.
    // 썸 27 + 상하 여백 2 → 트랙(31)에 꽉 차고, travel = 51-27-2*2 = 20.
    toggle: {
      trackW: 51,
      trackH: 31,
      trackBg: genietGray[200],
      trackActiveBg: genietTeal[600],
      thumbSize: 27,
      thumbOffset: 2,
      thumbTravel: 20,
    },
    // Control 가이드(171:9904): checkcircle/radio = 24×24, on=brand teal.
    checkbox: { size: 24 },
    radio: { size: 24 },
    // Tab 가이드(3132:94585): Chip 스타일 active = 흑백(#111). Underline 은 tone=color 로 teal(시멘틱 자동).
    tab: {
      chipSelectedBg: "var(--semantic-bg-inverse-default)", // #111
    },
    // Pagination 가이드(3216:1930): active 페이지 = 흑백(#111) + radius 4, cell 28,
    // 화살표 아이콘 24×24 gray/600.
    pagination: {
      activeBg: "var(--semantic-bg-inverse-default)", // #111
      activeBgHover: "var(--semantic-bg-inverse-default)",
      itemHeight: 28,
      itemRadius: 4,
      arrowSize: 24,
      arrowColor: genietGray[600], // #777777
    },
    // Alert 가이드(1054:30) + Radius 가이드(3134:2): Alert = Shape/MD 8 (base lg 12).
    "notice-alert": { radius: 8 },
    // Toast 가이드(1330:2): bg Black/0.92, shadow drop y8·blur24·18% black.
    // (Elevation 가이드는 토스트를 E1로 분류하지만, 전용 Toast 가이드의 명시 그림자가 우선.)
    toast: {
      bg: "rgba(17, 17, 17, 0.92)", // Black(#111)/0.92
      shadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
    },
    // Radius 가이드(3134:2): Bottom Sheet = Shape/XL = 16px (상단 모서리만)
    "bottom-sheet": {
      radius: 16,
      handleWidth: 50,
      handleHeight: 4,
      handleColor: genietGray[300],
    },
  },
};
