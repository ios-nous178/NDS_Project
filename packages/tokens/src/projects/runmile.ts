/**
 * Runmile Brand Theme
 *
 * 런마일(러닝 대회 정보/커뮤니티 플랫폼) 프로젝트 토큰.
 * SSOT: Figma 런마일 Library (MssCIDnDdAjStQXHclPNIc)
 *   ColorGuide          (5005:2)  — main / black / blue / red / green / yellow / base
 *   SemanticColorGuide  (5009:2)  — BG · Text · Icon · Border · Fill role 트리
 *   Typography          (5011:2)  — Heading / Title / Subtitle / Body / Label (Pretendard)
 *   Elevation           (5020:6)  — E0~E3 drop shadow
 *   Spacing             (5025:16) — 2pt 기반 스케일 (값은 base --spacing-* 와 동일)
 *   Border & Radius     (5024:16) — Radius None~3XL/Full · Border W-Default/Icon/Strong
 *
 * 구성:
 *   - runmile.palette.ts   : atomic 컬러 스케일 (runmileOrange / runmileCoolGray / ...)
 *   - runmile.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base override)
 *   - runmile.ts (이 파일) : palette + semantic + typography/spacing/elevation 묶음
 */

import type { ProjectTheme } from "./types.js";
import {
  runmileBlue,
  runmileCoolGray,
  runmileGreen,
  runmileCommon,
  runmileOrange,
  runmileRed,
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
  runmileCoolGray,
  runmileCommon,
};
export { runmileSemantic };
export type { RunmileSemanticTokens } from "./runmile.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const runmileTheme: ProjectTheme = {
  name: "runmile",
  actionsLayout: "split",
  palette: {
    orange: runmileOrange,
    blue: runmileBlue,
    red: runmileRed,
    green: runmileGreen,
    yellow: runmileYellow,
    coolGray: runmileCoolGray,
    common: runmileCommon,
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
    // radius 토큰 override 없음 — 숫자 단일 스케일(base) 사용. 곡률 차이는 --nds-{c}-radius 슬롯.
    // 스페이싱 스케일(2pt) 값도 base --spacing-* 와 동일해 override 불필요.
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
    // Button 높이 — Figma 런마일 ButtonGuide (5124:390): Mini 40 / S 44 / M 48 / L 52 / XL 56.
    // base sizing.button (52/48/44/42/.../32) 와 달라 size별 height override. XS·field 는 base 유지.
    button: {
      heightXl: 56,
      heightLg: 52,
      heightMd: 48,
      heightSm: 44,
      heightMini: 40,
    },
    footer: {
      navActiveColor: "var(--semantic-icon-strong-default)", // black #221E1F
      navInactiveColor: "var(--semantic-icon-muted-default)", // gray600 #8B95A1
      navLabelFontSize: 12,
      navLabelLineHeight: 16,
      navLabelWeight: "500",
      navActiveLabelWeight: "500",
    },
    // gray400 border (Figma 144:609)
    input: { borderColor: runmileCoolGray[400] },
    // Toss 스타일 radius
    card: { radius: 12 },
    "bottom-sheet": { radius: 16, handleColor: runmileCoolGray[300] },
    // Chip selected — orange500 채움 (Figma 172:566)
    chip: {
      selectedBackground: runmileOrange[500],
      selectedText: runmileCommon.white,
      selectedBorder: runmileOrange[500],
    },
    // Tab — Figma 런마일 TabsGuide (5111:138): active = 검정(#221E1F) · 포인트색(주황) 아님.
    //   underline active 텍스트·인디케이터는 이미 text/strong(검정) 정합. chip active bg 만
    //   기본 fill.neutral(#333D4B) 이라 → text/strong(#221E1F) 로 내려 검정으로 맞춘다.
    //   (fill.neutral 은 Chip 컴포넌트가 공유하므로 전역 변경 금지 — Tab 전용 슬롯만 override.)
    tab: { chipSelectedBg: "var(--semantic-text-strong-default)" },
    // Pagination — Figma 런마일 PaginationGuide (5055:29): element 24×24 · radius 6 · 칩 간격 8 ·
    //   active = gray800 채움(brand orange 아님) + 흰 텍스트 bold · inactive = gray800 medium(500) ·
    //   이전/다음 화살표 20×20 gray600(#8B95A1).
    pagination: {
      gap: 8,
      itemHeight: 24,
      itemMinWidth: 24,
      itemRadius: 6,
      itemWeight: "500",
      activeBg: runmileCoolGray[800],
      activeBgHover: runmileCoolGray[900],
      activeText: runmileCommon.white,
      arrowColor: runmileCoolGray[600], // #8B95A1
      arrowSize: 20,
    },
    // ─ Controls 가이드 (5111:345) ─
    // Checkbox·Radio 24×24. on 상태 = brand 오렌지 + 흰 체크/점 → checkedBg/checkedColor 미설정
    // (fill.brand fallback = runmileOrange500 이 곧 on 색). off border=Border/Default·disabled=BG/Disabled 도 정합.
    checkbox: { size: 24 },
    radio: { size: 24 },
    // Toggle 51×31 — OFF 트랙 = BG/Disabled(gray200 #F2F4F6), ON = brand 오렌지(fill.brand fallback),
    // 노브 흰색(surface.default fallback). 썸 25 · offset 3 · travel 20 (=51-25-3-3).
    toggle: {
      trackW: 51,
      trackH: 31,
      trackBg: "var(--semantic-bg-disabled)", // #F2F4F6 — BG/Disabled (OFF 트랙)
      thumbSize: 25,
      thumbOffset: 3,
      thumbTravel: 20,
    },
    // ─ Toast 가이드 (5085:234) ─ 다크 토스트.
    // ①--nds-snackbar-bg 가 전 variant 를 다크 카드로 통일하고 컬러 아이콘만 차이(Figma 정합).
    // status 아이콘색(success 초록·error 빨강 등)은 semantic cascade 로 자동. radius/fg 는 신설 슬롯.
    snackbar: {
      bg: "rgba(34, 30, 31, 0.85)", // #221E1F @ 0.85 — BG/Surface/Strong
      fg: "var(--semantic-text-onbrand-default)", // #FFFFFF — Text/OnBrand
      radius: 12, // Radius/LG
      shadow: "0 1px 4px 2px rgba(0, 0, 0, 0.03)", // Elevation/2
      iconSize: 24,
      titleFontWeight: "500", // Body1 Medium (string — number 면 px 가 붙음)
      infoIcon: "var(--semantic-text-status-info)", // info 아이콘 파랑 #007AFF (brand 오렌지 대신)
      actionBg: "transparent", // 액션 = text 버튼(칩 없음)
      actionColor: "var(--semantic-text-brand-default)", // Text/Brand 오렌지 #FF5B37
      closeColor: "var(--semantic-icon-onbrand-default)", // 흰 닫기
    },
    // 단일 다크 Toast 컴포넌트도 같은 런마일 다크 톤으로 정합.
    toast: {
      bg: "rgba(34, 30, 31, 0.85)",
      shadow: "0 1px 4px 2px rgba(0, 0, 0, 0.03)",
    },
    // ─ Tooltip 가이드 (5085:314) ─ BG/Surface/Strong #221E1F α0.9 · Radius/SM 6 · 화살표 8×8 · 본문 12/16.
    tooltip: {
      bg: "rgba(34, 30, 31, 0.9)", // #221E1F @ 0.9 (컨테이너+화살표 공용)
      radius: 6, // Radius/SM
      fontSize: 12, // Body2 Medium 12
      lineHeight: 16,
      arrowW: 4, // 밑변 8 (절반 4)
      arrowH: 8, // 높이 8 → 8×8 삼각형
    },
    // ─ Modal 가이드 (5085:27) ─ Radius/3XL 24 · Elevation/3 · Title=Strong · Body=Text/Normal(subtle) 13/18.
    // (치수 296/328 은 React DEVICE_WIDTH 하드코딩이라 base 294/332 유지 — 4px 차 무시.)
    modal: {
      radius: 24,
      shadow: "0 4px 13px rgba(0, 0, 0, 0.06)", // Elevation/3
      titleColor: "var(--semantic-text-strong-default)", // Title=Text/Strong #221E1F
      bodyColor: "var(--semantic-text-subtle-default)", // Body=Text/Normal #4E5968
      bodyFontSize: 13, // Body1 Regular 13
      bodyLineHeight: 18,
    },
    // ─ Popup(가운데 confirm 다이얼로그) ─ 모달 패밀리. Radius 2XL 20 · Elevation/3.
    popup: {
      radius: 20,
      shadow: "0 4px 13px rgba(0, 0, 0, 0.06)", // Elevation/3
    },
  },
};
