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
     * Inline 링크 텍스트. Cashpobi 가이드에 명시된 `Text/Link/Default` 슬롯.
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
    assistive?: string;
    disabled?: string;
  };
  buttonBorder?: {
    outlined?: { default?: string; hover?: string; disabled?: string };
    assistive?: { default?: string; disabled?: string };
  };
  icon?: {
    strong?: { default?: string };
    normal?: { default?: string };
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
   * Cashpobi 가이드의 `Brand/Logo/{Default,Subtle,Strong}` (Brown 톤).
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
  /** Semantic gap — `--gap-{key}` (tight/default/comfortable/loose/wide 등) */
  gap?: Record<string, number>;
  /** Heading 별 다음 요소 간격 — `--gap-title-{key}` */
  gapTitle?: Record<string, number>;
  /** 컨테이너 내부 padding — `--inset-{key}` (chip/input/card/modal/section/page 등) */
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
   * Admin/page layout 토큰 — Cashpobi 가이드의 Layout/Page · Sidebar · Content · MaxContent.
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
}
