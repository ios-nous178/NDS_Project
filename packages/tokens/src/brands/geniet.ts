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

import type { BrandTheme } from "./types.js";
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
  actionsLayout: "split",
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
      display1: { fontSize: 52, lineHeight: 74, letterSpacing: 0 }, // 브랜드/캠페인 대형 타이틀
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
    // Gap — 요소 간 거리(itemSpacing), 의도 기반. SSOT: Figma 지니어트 Library / Spacing (3034:2).
    // base 대비: default 10→8 (가장 빈번한 표준 간격), section 40 신규.
    gap: {
      tight: 4, // Chip·Badge·Icon+Text 등 매우 가까운 그룹
      default: 8, // 표준 컴포넌트 내부 — 가장 빈번 ★ (base 10 → 8)
      comfortable: 12, // 폼 필드·세그먼트·의미 단위 그룹
      loose: 16, // 컴포넌트↔컴포넌트·카드 내 위계
      wide: 24, // 큰 영역↔큰 영역·폼 그룹 간
      section: 40, // Section↔Section·페이지 블록 분리 (신규)
    },
    // Inset — 내부 여백(padding), 사용처 기반. SSOT: 같은 가이드.
    // base 대비: chip 8→6, button 14 / section 32 신규.
    inset: {
      chip: 6, // Chip·Badge·작은 Tag 내부 (base 8 → 6)
      input: 12, // Input·Dropdown 좌우 padding
      button: 14, // Button 상하 padding (신규)
      card: 16, // Card·Toast·일반 컨테이너
      "card-large": 20, // 큰 Card·Hero 카드
      modal: 24, // Modal·Bottom Sheet·Drawer
      section: 32, // 페이지 Section·큰 영역 padding (신규)
    },
    // DESIGN.md (brands/geniet) — 8px md 기본, xl=18 / 2xl=23 은 Geniet 고유 곡률
    // (radius 는 Spacing 가이드 범위 밖 — 기존 유지)
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
  //   footer nav — Figma 지니어트 BottomNav 가이드 (90:2): active = mint600 #00A8AC + bold,
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
    // DESIGN.md card-default — 8px radius, 1px #ECECEC border
    card: { radius: 8, borderColor: genietGray[200] },
    // DESIGN.md — 8px radius, Material 3-layer shadow 는 elevation.shadow[3]
    modal: { radius: 8 },
    // DESIGN.md chip-active — selected = brand action 색 (mint/600) + 흰색
    chip: {
      selectedBackground: genietMint[600],
      selectedText: genietNeutral.white,
      selectedBorder: genietMint[600],
    },
    // Geniet 패턴 — track gray/200, active = brand mint/600
    toggle: {
      trackW: 40,
      trackH: 24,
      trackBg: genietGray[200],
      trackActiveBg: genietMint[600],
    },
    // 토스트는 Elevation 가이드(3031:6) 의 E1 Subtle 사용 ("작은 토스트")
    toast: { shadow: "0 2px 6px rgba(221, 221, 221, 0.6)" },
    // DESIGN.md — 18px 상단 radius (rounded-t-[18px])
    "bottom-sheet": {
      radius: 18,
      handleWidth: 50,
      handleHeight: 4,
      handleColor: genietGray[300],
    },
  },
};
