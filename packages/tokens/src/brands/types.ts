/**
 * Brand Theme — 브랜드별 토큰 오버라이드 타입 정의
 *
 * 시멘틱 트리는 Figma SemanticColorGuide(171:6675) role-based 구조의 Partial.
 * 브랜드는 자기 정체성에 영향을 주는 그룹만 골라 override 한다 — 누락된 키는
 * base(NudgeEAP) 값이 그대로 cascade 된다.
 */

import type { TypeStyle } from "../typography.js";
import type { ActionsLayout } from "../actionsLayout.js";

/** 팔레트 컬러 — 브랜드 고유 색상 스케일 */
export type ColorScale = Record<string | number, string>;

/** 시멘틱 컬러 — Figma role-based 트리의 Partial */
export interface SemanticColors {
  bg?: {
    page?: { default?: string };
    surface?: { default?: string; subtle?: string };
    section?: { default?: string };
    brand?: { default?: string; subtle?: string };
    inverse?: { default?: string };
    status?: {
      error?: string;
      success?: string;
      info?: string;
      caution?: string;
    };
    /** Figma `--bg-overlay` */
    overlay?: string;
    /** DS extension — disabled bg */
    disabled?: string;
  };
  text?: {
    strong?: { default?: string };
    normal?: { default?: string };
    subtle?: { default?: string };
    muted?: { default?: string };
    disabled?: { default?: string };
    inverse?: { default?: string };
    brand?: { default?: string; strong?: string };
    /**
     * Inline 링크 텍스트. CashwalkBiz 가이드에 명시된 `Text/Link/Default` 슬롯.
     * NudgeEAP base 에는 없고, brand 가이드가 link 를 별도 컬러로 분리할 때 사용.
     */
    link?: { default?: string };
    status?: {
      success?: string;
      error?: string;
      caution?: string;
      info?: string;
    };
  };
  buttonBg?: {
    default?: string;
    hover?: string;
    pressed?: string;
    disabled?: string;
    secondary?: { default?: string; hover?: string; disabled?: string };
    outlined?: { default?: string; hover?: string; disabled?: string };
    /**
     * Filled neutral 톤. Geniet 의 "Solid Neutral" 처럼 primary/secondary 보다
     * 낮은 위계에서 사용되는 채워진 회색 버튼 패턴. NudgeEAP base / Trost 는
     * 기본 사용 안 함 (해당 브랜드는 outlined 로 같은 위계를 표현).
     */
    neutral?: { default?: string; hover?: string; disabled?: string };
  };
  /**
   * `secondary` — Solid/Secondary 텍스트 색. 브랜드별로 의도가 달라 분리:
   *   · NudgeEAP: brand blue (light blue bg 위)
   *   · Trost: cobalt brand (cobalt-50 bg 위)
   *   · Geniet: white (dark inverse bg 위) — Geniet 고유 패턴
   * `neutral` — Geniet 의 neutral/outlined-neutral 버튼 텍스트 색
   * (보통 gray/strong). 다른 브랜드는 미사용.
   */
  buttonText?: {
    default?: string;
    brand?: string;
    secondary?: { default?: string; disabled?: string };
    /** Outlined/Weak Neutral enabled 텍스트 (흰/투명 bg → 어두운 톤). */
    neutral?: string;
    /**
     * Solid Neutral 텍스트 — fill 명도 대비용. 어두운 fill(cashpobi #111·nudge cool-gray)=흰,
     * 밝은 fill(geniet #ECECEC·runmile #F2F4F6)=어두운 톤. `neutral`(outlined)과 분리.
     */
    neutralSolid?: string;
    /** Neutral disabled 텍스트 (Outlined). */
    neutralDisabled?: string;
    disabled?: string;
  };
  buttonBorder?: {
    outlined?: { default?: string; hover?: string; disabled?: string };
    neutral?: { default?: string; disabled?: string };
  };
  icon?: {
    strong?: { default?: string };
    normal?: { default?: string };
    /**
     * 약한 아이콘 톤. Figma 런마일 library (20:94) 가 아이콘 컬러 슬롯을
     * `gray600` 으로 명시한 자리 — BottomNav inactive / secondary 아이콘 등에
     * 사용. 다른 brand 는 미정의 시 fallback (base = neutral medium).
     */
    muted?: { default?: string };
    disabled?: { default?: string };
    inverse?: { default?: string };
    brand?: { default?: string };
    status?: { success?: string; error?: string; caution?: string };
  };
  border?: {
    normal?: { default?: string };
    strong?: { default?: string };
    subtle?: { default?: string };
    focus?: { default?: string };
    brand?: { default?: string; disabled?: string };
    disabled?: { default?: string };
    status?: { error?: string; caution?: string };
  };
  fill?: {
    brand?: { default?: string; hover?: string; pressed?: string; disabled?: string };
    neutral?: { default?: string; subtle?: string };
    inverse?: { default?: string };
    status?: { error?: string; caution?: string };
  };
  input?: {
    bg?: string;
    bgDisabled?: string;
    borderDefault?: string;
    borderHover?: string;
    borderFocus?: string;
    borderError?: string;
    borderDisabled?: string;
    placeholder?: string;
    helpertextDefault?: string;
    helpertextSuccess?: string;
    helpertextError?: string;
    helpertextDisabled?: string;
  };
  /**
   * 모달/팝업 confirm(주 액션) 버튼 색. base 는 brand 토큰을 `var(...)` 로 참조 → 브랜드별
   * 자기 brand 색으로 late-bind. **캐포비만 neutral 검정으로 override**(Primary+Neutral tone 체계).
   * data-brand 캐스케이드가 아니라 토큰(`:root` 변수)으로 흐르게 해, data-brand 속성을 안 쓰는
   * standalone 목업(브랜드 :root CSS 교체)에서도 캐포비 모달/팝업 버튼이 검정으로 나오게 한다.
   */
  confirmCta?: {
    bg?: string;
    hover?: string;
    active?: string;
    text?: string;
  };
  /**
   * 캐시워크 로고 등 brand identity asset 전용 색상 슬롯.
   * CashwalkBiz 가이드의 `Brand/Logo/{Default,Subtle,Strong}` (Brown 톤).
   * NudgeEAP base / Trost / Geniet 는 사용하지 않음 — 로고 raw hex 또는 별도 자산 사용.
   */
  brandLogo?: {
    default?: string;
    subtle?: string;
    strong?: string;
  };
}

/** 타이포그래피 오버라이드 */
export interface TypographyOverrides {
  fontFamily: {
    web: string;
    system: string;
  };
  typeScale: Record<string, TypeStyle>;
}

/** 스페이싱/라디어스 오버라이드 — 모두 partial, 누락 키는 base cascade */
export interface SpacingOverrides {
  /** Atomic spacing scale — `--spacing-{key}` */
  spacing?: Record<string | number, number>;
  /** Semantic gap — `--semantic-gap-{key}` (tight/default/comfortable/loose/wide 등) */
  gap?: Record<string, number>;
  /** Heading 별 다음 요소 간격 — `--semantic-gap-title-{key}` */
  gapTitle?: Record<string, number>;
  /** 컨테이너 내부 padding — `--semantic-inset-{key}` (chip/input/card/modal/section/page 등) */
  inset?: Record<string, number>;
  radius?: Record<string, number>;
  shape?: Record<string, number>;
  borderWidth?: Record<string, number>;
  stroke?: Record<string, number>;
  /** Grid system — gutter / margin / contentWidth 등 */
  grid?: {
    mobile?: {
      columns?: number;
      margin?: number;
      gutter?: number;
      contentWidth?: number;
    };
    desktop?: {
      columns?: number;
      margin?: number;
      minMargin?: number;
      gutter?: number;
      contentWidth?: number;
    };
  };
  /**
   * Admin/page layout 토큰 — CashwalkBiz 가이드의 Layout/Page · Sidebar · Content · MaxContent.
   * NudgeEAP base / Trost / Geniet 는 미사용. emit: `--layout-{key}` (px).
   */
  layout?: {
    page?: number;
    sidebar?: number;
    content?: number;
    maxContent?: number;
  };
}

/** 엘리베이션 오버라이드 */
export interface ElevationOverrides {
  shadow?: Record<string, string>;
  zIndex?: Record<string, number>;
}

/**
 * 컴포넌트 단위 오버라이드 — primitive 토큰(`radius.md` 등)을 손대지 않고
 * 특정 컴포넌트만 브랜드 가이드에 맞게 보정할 때 사용.
 * emit: `--nds-{component}-{prop}` CSS var. 컴포넌트는 이 var 를 fallback 패턴으로 읽어 cascade.
 * (오버라이드를 안 정의한 브랜드는 컴포넌트의 fallback 값이 그대로 적용 — 기존 동작 유지)
 * 예) CashwalkBiz admin 은 input radius 4px / height 40px / padding-x = inset-input (base 8/48/inset-card).
 *
 * value 가 number 면 `${value}px` 로 emit, string 이면 그대로 (`var(--semantic-inset-input)` 같은 CSS var 참조 가능).
 */
type ComponentValue = number | string;
export interface ComponentOverrides {
  input?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    /** Input 패밀리 기본 테두리 색 — `--nds-input-border-color`. 미설정 시 input.borderDefault fallback. */
    borderColor?: ComponentValue;
  };
  /**
   * Select(Dropdown). 캐포비 InputGuide(3080:741)는 trigger/option Body2 14/20,
   * 선택 항목 = 회색 배경(#F5F5F5) + Strong 텍스트 + Medium 500 + radius 6 + 메뉴 inset.
   * 다른 브랜드는 fallback (Body3 13/18, brand-tint 선택, flat option) 유지.
   */
  select?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
    optionPadding?: ComponentValue;
    optionRadius?: ComponentValue;
    optionSelectedBg?: ComponentValue;
    optionSelectedColor?: ComponentValue;
    optionSelectedWeight?: ComponentValue;
    dropdownPadding?: ComponentValue;
    dropdownGap?: ComponentValue;
  };
  textarea?: {
    radius?: ComponentValue;
    paddingX?: ComponentValue;
    paddingY?: ComponentValue;
    minHeight?: ComponentValue;
  };
  datepicker?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
  };
  /** TextField/FormField 라벨 — 캐포비는 Strong(#111). 다른 브랜드는 Normal(#333) fallback. */
  "form-field"?: { labelColor?: ComponentValue };
  /** ActionChip — 캐포비 radius 6 / bg #ECECEC. 다른 브랜드는 radius.sm(4) / fill.neutralSubtle fallback. */
  "action-chip"?: { radius?: ComponentValue; bg?: ComponentValue };
  /**
   * Chip(SelectChip) selected 상태의 채움 위 텍스트/보더/배경 override.
   * 캐포비는 노랑 채움 위 가독성을 위해 selectedText=검정(#111). 다른 브랜드는 fallback
   * (FILL_COLORS — selected 텍스트 inverse 흰) 유지. 좌측 ✓ 체크 아이콘은 currentColor 를 따른다.
   */
  chip?: {
    selectedBackground?: ComponentValue;
    selectedText?: ComponentValue;
    selectedBorder?: ComponentValue;
  };
  /**
   * Footer.TabBar 의 nav 시각 변형. Geniet BottomNav 가이드는 active=mint600 + bold,
   * label Pretendard 10/12. 다른 브랜드는 fallback (active=textRole.normal #333, label 11/14).
   */
  footer?: {
    navActiveColor?: ComponentValue;
    navInactiveColor?: ComponentValue;
    navLabelFontSize?: ComponentValue;
    navLabelLineHeight?: ComponentValue;
    navLabelWeight?: ComponentValue;
    navActiveLabelWeight?: ComponentValue;
    /** 다크 푸터 텍스트 톤 — 회사명/뮤트/부가 링크. 미설정 시 textRole.subtle/muted fallback. */
    companyColor?: ComponentValue;
    mutedColor?: ComponentValue;
    extraColor?: ComponentValue;
  };
  /** Card 셸 — radius / 테두리. 미설정 시 radius.lg / borderRole.normal fallback. */
  card?: { radius?: ComponentValue; borderColor?: ComponentValue };
  /** Modal 컨테이너 radius. 미설정 시 radius.md fallback. */
  modal?: { radius?: ComponentValue };
  /** BottomSheet — 상단 radius / drag handle 치수·색. */
  "bottom-sheet"?: {
    radius?: ComponentValue;
    handleWidth?: ComponentValue;
    handleHeight?: ComponentValue;
    handleColor?: ComponentValue;
  };
  /** Toggle 트랙 치수·색 + 썸 그림자. 미설정 시 44×24 / borderRole.normal / fill.brand fallback. */
  toggle?: {
    trackW?: ComponentValue;
    trackH?: ComponentValue;
    trackBg?: ComponentValue;
    trackActiveBg?: ComponentValue;
    thumbShadow?: ComponentValue;
  };
  /** Pagination active 페이지 시각 — 런마일은 brand orange 가 아닌 gray800 fill (Figma 120:1234). */
  pagination?: {
    activeBg?: ComponentValue;
    activeBgHover?: ComponentValue;
    activeText?: ComponentValue;
  };
  /**
   * Checkbox 시각 변형. 캐포비 가이드(3082:899)는 box 15×15 / 1.25px border / radius 2px /
   * unchecked border #DDD / disabled = 색 변경 없이 opacity 0.4. 다른 브랜드는 fallback 유지.
   */
  checkbox?: {
    size?: ComponentValue;
    borderWidth?: ComponentValue;
    radius?: ComponentValue;
    borderColor?: ComponentValue;
    disabledOpacity?: ComponentValue;
    disabledBg?: ComponentValue;
    disabledBorderColor?: ComponentValue;
    disabledCheckedBg?: ComponentValue;
    disabledCheckedBorderColor?: ComponentValue;
  };
  /**
   * Badge(Label) 시각 변형. 캐포비 ChipGuide(3782:20558 · Rounded Square):
   *   radius 5 · padding 4/10 · Caption 12/16 · Medium(500) (base 는 bold·radius 4/6).
   *   톤(색)은 ghost 변형 + semantic 색이 이미 캐포비값으로 cascade → 별도 색 override 불필요.
   * 다른 브랜드는 fallback (bold·md radius 4) 유지.
   */
  badge?: {
    radius?: ComponentValue;
    height?: ComponentValue;
    paddingX?: ComponentValue;
    paddingY?: ComponentValue;
    fontSize?: ComponentValue;
    lineHeight?: ComponentValue;
    fontWeight?: ComponentValue;
  };
  /**
   * Tab 시각 변형. 캐포비 가이드(3544:206):
   *   Underline(line) = subtitle1 16/24 · default medium(500) · indicator 2px · padding 16/12(h48)
   *   Box(chip) = radius 10 · padding 20/14(h52) · selected bg-inverse(#111) ·
   *               default button-bg-disabled(#ddd) + 양쪽 흰 텍스트 bold
   * 다른 브랜드는 fallback (line body3 14/20·indicator 3px, chip pill·subtle gray) 유지.
   */
  tabs?: {
    lineFontSize?: ComponentValue;
    lineLineHeight?: ComponentValue;
    lineDefaultWeight?: ComponentValue;
    lineIndicatorHeight?: ComponentValue;
    lineTabHeight?: ComponentValue;
    linePaddingX?: ComponentValue;
    chipRadius?: ComponentValue;
    chipTabHeight?: ComponentValue;
    chipPaddingX?: ComponentValue;
    chipFontSize?: ComponentValue;
    chipLineHeight?: ComponentValue;
    chipSelectedBg?: ComponentValue;
    chipDefaultBg?: ComponentValue;
    chipDefaultColor?: ComponentValue;
    chipDefaultWeight?: ComponentValue;
  };
  /**
   * Tooltip 다크 말풍선 배경 슬롯. 캐포비는 Fill/Neutral(#333) — base inverse(#111)와 다름.
   * 다른 브랜드는 미설정 → 컴포넌트 fallback (surface.inverse) 유지.
   */
  tooltip?: { bg?: ComponentValue };
  /**
   * Chart — 어드민 통계 차트 시리즈 색 슬롯 (`--nds-chart-*`).
   * 기본값(캐포비 데이터-뷰 팔레트)은 base(nudge-eap) theme 이 :root 로 emit —
   * 컴포넌트 요소에 박지 않아야 브랜드 :root override 가 마스킹되지 않는다.
   * 데이터-뷰 색은 아토믹 팔레트 밖(디자이너 토큰화 대기) — hex 직접 기입 허용 예외.
   */
  chart?: {
    line?: ComponentValue;
    "1"?: ComponentValue;
    "2"?: ComponentValue;
    "3"?: ComponentValue;
    "4"?: ComponentValue;
    empty?: ComponentValue;
  };
  /** 별점(StarRating/ReviewCard/각종 카드) — 채움 `--nds-rating-star` · 빈 별 `--nds-rating-star-empty` */
  rating?: { star?: ComponentValue; starEmpty?: ComponentValue };
  /**
   * Toast — 단일 다크 토스트의 배경/그림자 슬롯 (`--nds-toast-bg` / `--nds-toast-shadow`).
   * Figma 1330:2 의 다크값(#212121·0.92)과 drop shadow 는 role-based 시멘틱 변수(Figma SSOT)
   * 집합 밖이라 `--semantic-*` 이 아닌 `--nds-*` 컴포넌트 슬롯으로 둔다. base(nudge-eap) theme 이
   * :root 로 기본값을 emit — 브랜드 :root override 여지. (캐포비는 Toast 자체가 banned.)
   */
  toast?: { bg?: ComponentValue; shadow?: ComponentValue };
}

/** 브랜드 테마 전체 정의 */
export interface BrandTheme {
  name: string;
  /**
   * 컴포넌트 액션(버튼) 기본 배치 — Modal/Popup 등 푸터 배치 하네스의 브랜드 기본값.
   *   · "split" — 가로 균등 분할(2버튼 50/50, 1버튼 full).
   *   · "end"   — 우측 정렬 hug(admin 톤).
   * 색/pill 모양은 토큰/cascade 가 따로 담당하고, 이 값은 구조 variant 만 정한다.
   * 컴포넌트는 `actionsLayout` prop / `actions-layout` 속성으로 override 가능.
   * 미지정 시 `DEFAULT_ACTIONS_LAYOUT`("split") fallback. 새 브랜드는 반드시 선언해야
   * 하며 `pnpm lint:actions-layout` 가 누락을 막는다. (SSOT — react/html 양쪽이 읽음)
   */
  actionsLayout?: ActionsLayout;
  /** 브랜드 고유 팔레트 컬러 */
  palette: Record<string, ColorScale>;
  /** 시맨틱 컬러 오버라이드 (Figma role-based 트리의 Partial) */
  semantic: SemanticColors;
  /** 타이포그래피 오버라이드 (미지정 시 기본값 사용) */
  typography?: Partial<TypographyOverrides>;
  /** 스페이싱 오버라이드 (미지정 시 기본값 사용) */
  spacing?: SpacingOverrides;
  /** 엘리베이션 오버라이드 (미지정 시 기본값 사용) */
  elevation?: ElevationOverrides;
  /** 컴포넌트 단위 오버라이드 (input / select / textarea / datepicker 등) */
  components?: ComponentOverrides;
}
