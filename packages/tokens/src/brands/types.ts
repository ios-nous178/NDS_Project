/**
 * Brand Theme — 브랜드별 토큰 오버라이드 타입 정의
 *
 * 시멘틱 트리는 Figma SemanticColorGuide(171:6675) role-based 구조의 Partial.
 * 브랜드는 자기 정체성에 영향을 주는 그룹만 골라 override 한다 — 누락된 키는
 * base(NudgeEAP) 값이 그대로 cascade 된다.
 */

import type { TypeStyle } from "../typography";

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
     * Filled neutral 톤. Geniet 의 "Solid Assistive" 처럼 primary/secondary 보다
     * 낮은 위계에서 사용되는 채워진 회색 버튼 패턴. NudgeEAP base / Trost 는
     * 기본 사용 안 함 (해당 브랜드는 outlined 로 같은 위계를 표현).
     */
    assistive?: { default?: string; hover?: string; disabled?: string };
  };
  /**
   * `secondary` — Solid/Secondary 텍스트 색. 브랜드별로 의도가 달라 분리:
   *   · NudgeEAP: brand blue (light blue bg 위)
   *   · Trost: cobalt brand (cobalt-50 bg 위)
   *   · Geniet: white (dark inverse bg 위) — Geniet 고유 패턴
   * `assistive` — Geniet 의 assistive/outlined-assistive 버튼 텍스트 색
   * (보통 gray/strong). 다른 브랜드는 미사용.
   */
  buttonText?: {
    default?: string;
    brand?: string;
    secondary?: { default?: string; disabled?: string };
    /** Solid/Outlined Assistive enabled 텍스트 (공용). */
    assistive?: string;
    /**
     * Outlined Assistive disabled 텍스트. Solid Assistive disabled 는 보편적으로
     * `cv.surface.default` (white) 를 사용해 base 가 처리 → 별도 슬롯 불필요.
     */
    assistiveDisabled?: string;
    disabled?: string;
  };
  buttonBorder?: {
    outlined?: { default?: string; hover?: string; disabled?: string };
    assistive?: { default?: string; disabled?: string };
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
  input?: { radius?: ComponentValue; height?: ComponentValue; paddingX?: ComponentValue };
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
}

/** 브랜드 테마 전체 정의 */
export interface BrandTheme {
  name: string;
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
