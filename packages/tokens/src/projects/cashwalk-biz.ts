/**
 * CashwalkBiz (캐포비 · 캐시워크 포 비지니스) Brand Theme
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
 *   - cashwalk-biz.palette.ts   : atomic 컬러 스케일 (Common / Neutral / Primary Yellow / ...)
 *   - cashwalk-biz.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base partial override)
 *   - cashwalk-biz.ts (이 파일) : palette + semantic + typography + spacing 묶음
 *
 * Elevation (shadow E0~E3) 은 NudgeEAP base 값과 정확히 일치 → override 없이 cascade.
 * Gap (tight/default/comfortable/loose/wide) 도 base 와 동일 → cascade.
 */

import type { ProjectTheme } from "./types.js";
import {
  cashwalkBizBlue,
  cashwalkBizBrown,
  cashwalkBizCommon,
  cashwalkBizCoralRed,
  cashwalkBizGreen,
  cashwalkBizNeutral,
  cashwalkBizYellow,
} from "./cashwalk-biz.palette.js";
import { cashwalkBizSemantic } from "./cashwalk-biz.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export {
  cashwalkBizCommon,
  cashwalkBizNeutral,
  cashwalkBizYellow,
  cashwalkBizCoralRed,
  cashwalkBizBlue,
  cashwalkBizGreen,
  cashwalkBizBrown,
};
export { cashwalkBizSemantic };
export type { CashwalkBizSemanticTokens } from "./cashwalk-biz.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const cashwalkBizTheme: ProjectTheme = {
  name: "cashwalk-biz",
  actionsLayout: "end",
  palette: {
    common: cashwalkBizCommon,
    neutral: cashwalkBizNeutral,
    yellow: cashwalkBizYellow,
    coralRed: cashwalkBizCoralRed,
    blue: cashwalkBizBlue,
    green: cashwalkBizGreen,
    brown: cashwalkBizBrown,
  },
  semantic: cashwalkBizSemantic,
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
    // Inset 7 tokens — Figma SpacingGuide. input inset 은 12px (base 와 동일).
    inset: {
      chip: 8,
      input: 12,
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

  // Component overrides — Figma 캐포비 InputGuide (3080:741) 기준.
  // base(NudgeEAP/Trost/Geniet) 는 input rounded 8px / height 48px / padding-x = --semantic-inset-card.
  // 캐포비 admin 은 rounded 10px / height 48px / padding-x = --semantic-inset-input(10px). (height 48 = base 와 동일 행 표준, fc223c7a 정합)
  // emit: `--nds-{component}-{prop}` → 각 컴포넌트가 fallback 으로 읽어 cascade (다른 프로젝트는 fallback 그대로).
  components: {
    // 입력 패밀리(input/select/textarea/datepicker) radius·height 는 --nds-input-radius / --nds-input-height
    // 하나씩을 공유한다. 여기(input)만 바꾸면 나머지는 var(--nds-input-*) 참조로 전부 따라온다.
    // (회고: 토큰을 컴포넌트마다 따로 박으면 일괄 변경이 안 됨 — 한 knob 으로 묶는 게 시멘틱 cascade 의 취지.)
    input: { radius: 10, height: 48, paddingX: "var(--semantic-inset-input)" },
    // Select — 캐포비 InputGuide(3080:741 · Dropdown/DropdownItem).
    //   trigger·option 텍스트는 Input Typography 표준 value 15/22 (Figma 4247:1964 · 프로젝트 무관) —
    //   옛 캐포비 dense 14/20 override(--nds-select-font-size/-line-height) 는 폐지. base body2(15/22) cascade.
    //   선택 항목 = 회색 배경(Section #F5F5F5) + Strong 텍스트 + Medium 500 (base 의 brand-tint 와 다름),
    //   메뉴 항목 radius 6 / padding 8·12, 메뉴 컨테이너 inset 4 / 항목 간 gap 2.
    select: {
      radius: "var(--nds-input-radius)",
      height: "var(--nds-input-height)",
      optionPadding: "8px 12px",
      optionRadius: 6,
      optionSelectedBg: "var(--semantic-bg-section-default)",
      optionSelectedColor: "var(--semantic-text-strong-default)",
      optionSelectedWeight: "500",
      dropdownPadding: 4,
      dropdownGap: 2,
    },
    // Textarea — 캐포비 가이드(3063:643): px 12 / py 10(inset-input) / min-height 100 (base 80).
    textarea: { radius: "var(--nds-input-radius)", paddingX: 12, minHeight: 100 },
    // DateInput — 캐포비 가이드(3076:756). trigger 텍스트는 Input Typography 표준 value 15/22
    //   (Figma 4247:1964 · 프로젝트 무관) — 옛 dense 14/20 폰트 override 폐지(컴포넌트가 value 토큰 직접 적용).
    datepicker: {
      radius: "var(--nds-input-radius)",
      height: "var(--nds-input-height)",
      paddingX: "var(--semantic-inset-input)",
    },
    // TextField 라벨 — 캐포비 가이드는 Text/Strong(#111). base 는 Normal(#333).
    "form-field": { labelColor: "var(--semantic-text-strong-default)" },
    // ActionChip — 캐포비 가이드(3079:554): radius 6 / bg #ECECEC (Neutral 100·200 사이 raw).
    "action-chip": { radius: 6, bg: "#ECECEC" },
    // Chip(SelectChip) — 캐포비 프로젝트 채움(노랑 #FFD200) 위 텍스트는 검정.
    //   base 의 selected fill 텍스트는 inverse(흰)인데 노랑 위 흰 글씨는 대비가 약함 →
    //   ButtonText/Default(노랑 위 검정)와 동일 운용으로 selected 텍스트를 strong(#111)으로 override.
    //   좌측 ✓ 체크/아이콘은 currentColor(=텍스트색)를 따르므로 함께 검정으로 렌더된다.
    //   (bg 는 그대로 노랑 채움 유지 — selected-background 는 override 안 함.)
    chip: { selectedText: "var(--semantic-text-strong-default)" },
    // Badge(Label) — 캐포비 ChipGuide(3782:20558 · Rounded Square):
    //   radius 5 / padding 4·10 / Caption 12/16 / Medium(500) (base bold·radius 4/6).
    //   톤은 ghost 변형 + semantic 색 cascade 로 이미 캐포비값(#FFFAE5/#FD9B02 등) 적용.
    //   Pill(완전둥근) identity 태그는 radius 만 pill 로 인라인 지정해 사용.
    badge: {
      radius: 5,
      height: 24,
      paddingX: 10,
      paddingY: 4,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "500",
    },
    // Figma 캐포비 CheckboxGuide (3082:899):
    //   box 15×15 / 1.25px border / radius 2px / unchecked border #DDD (border.strong)
    //   disabled = 색 변경 없이 단순 opacity 0.4
    checkbox: {
      size: 15,
      borderWidth: 1.25,
      radius: 2,
      borderColor: "var(--semantic-border-strong-default)",
      disabledOpacity: "0.4",
      // disabled 색 변경 무력화 — default 와 동일하게 emit
      disabledBg: "var(--semantic-bg-surface-default)",
      disabledBorderColor: "var(--semantic-border-strong-default)",
      disabledCheckedBg: "var(--semantic-fill-brand-default)",
      disabledCheckedBorderColor: "var(--semantic-fill-brand-default)",
    },
    // Figma 캐포비 Tab 가이드 (3544:206):
    //   Underline: subtitle1 16/24, default medium(500), indicator 2px, padding 16/12 → height 48
    //   Box(chip): radius 10, padding 20/14 → height 52, selected bg-inverse(#111).
    //   비활성 chip 컬러는 NudgeEAP 스타일(subtle bg + subtle text)로 통일 — 기존 흰 텍스트
    //   /button-bg-disabled "의도된 저대비"는 hover 시 배경이 더 연해지고 글자가 검정으로
    //   뒤집혀 어색했다(사용자 피드백 2026-06). 치수(radius/height/padding/weight)는 유지.
    tab: {
      lineFontSize: 16,
      lineLineHeight: 24,
      lineDefaultWeight: "500",
      lineIndicatorHeight: 2,
      lineTabHeight: 48,
      linePaddingX: 16,
      chipRadius: 10,
      chipTabHeight: 52,
      chipPaddingX: 20,
      chipFontSize: 16,
      chipLineHeight: 24,
      chipSelectedBg: "var(--semantic-bg-inverse-default)",
      chipDefaultBg: "var(--semantic-bg-surface-subtle)",
      chipDefaultColor: "var(--semantic-text-subtle-default)",
      chipDefaultWeight: "700",
    },
    // Tooltip bg(#333333) 는 base theme 이 --nds-tooltip-bg 로 전 프로젝트 동일 emit — 프로젝트 override 불필요.
    // 캐포비 리치 툴팁의 compact 타이포는 styles/Tooltip.ts 의 [data-project] 블록이 담당.
    // BottomSheet — 가이드 명시 top radius 20px (storybook brand-themes.ts 에서 SSOT 회수).
    "bottom-sheet": { radius: 20 },
    // Snackbar — 캐포비 admin: variant 무시 흰카드(그림자) + 큰 타이틀/아이콘 + 회색 닫기 (Figma 3001:51644).
    // ① --nds-snackbar-bg 가 variant bg 를 덮고 아이콘 색만 variant 유지. (styles/Snackbar.ts 의 [data-project] 블록 제거 대체)
    snackbar: {
      bg: "var(--semantic-bg-surface-default)",
      border: "var(--semantic-border-subtle-default)",
      shadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
      titleFontSize: 14, // Body2 (base Body3 13)
      titleLineHeight: 20,
      iconSize: 24, // base 20
      closeColor: "var(--semantic-icon-normal-default)",
      closeOpacity: "1",
    },
    // FormSection — admin 카드 radius 16 (base 12, Modal admin 과 동일 cascade 패턴).
    "form-section": { radius: 16 },
    // Toggle — admin ON 트랙 초록(status-success) + 초록 위 라벨 흰색. on/off 스위치 관습(켜짐=초록).
    toggle: {
      trackActiveBg: "var(--semantic-icon-status-success)",
      labelActiveColor: "var(--semantic-text-inverse-default)",
    },
    // SelectedItemRow — admin gray/200 fill + radius 10 (삭제 글리프는 styles [data-project] 유지).
    "selected-item-row": {
      bg: "var(--semantic-border-normal-default)",
      radius: 10,
    },
    // TagInput — add 버튼 neutral(Secondary tone 부재) + stacked 태그 gray fill/radius 10 (삭제 글리프 styles [data-project]).
    "tag-input": {
      addBg: "var(--semantic-button-bg-neutral-default)",
      addColor: "var(--semantic-button-text-neutral-solid)",
      stackedBg: "var(--semantic-border-normal-default)",
      stackedRadius: 10,
    },
    // Pagination — admin boxed(테두리 박스 white + Border/Normal, radius 4, 34h) · active 검정 fill · boxed disabled.
    // Figma PaginationGuide 4118:1186. (옛 styles/Pagination.ts [data-project] 블록 대체)
    pagination: {
      gap: 6,
      itemHeight: 34,
      itemBorder: "1px solid var(--semantic-border-normal-default)",
      itemRadius: 4,
      itemBg: "var(--semantic-bg-surface-default)",
      itemColor: "var(--semantic-text-normal-default)",
      itemWeight: "500",
      activeBg: "var(--semantic-fill-neutral-default)",
      activeBgHover: "var(--semantic-fill-neutral-default)",
      activeWeight: "500",
      disabledOpacity: "1",
      disabledBg: "var(--semantic-bg-surface-subtle)",
      disabledColor: "var(--semantic-text-disabled-default)",
    },
  },
};
