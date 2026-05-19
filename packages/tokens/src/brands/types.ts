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
  };
  /**
   * `secondary` — Solid/Secondary 텍스트 색. 브랜드별로 의도가 달라 분리:
   *   · NudgeEAP: brand blue (light blue bg 위)
   *   · Trost: cobalt brand (cobalt-50 bg 위)
   *   · Geniet: white (dark inverse bg 위) — Geniet 고유 패턴
   */
  buttonText?: {
    default?: string;
    brand?: string;
    secondary?: { default?: string; disabled?: string };
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
}

/** 타이포그래피 오버라이드 */
export interface TypographyOverrides {
  fontFamily: {
    web: string;
    system: string;
  };
  typeScale: Record<string, TypeStyle>;
}

/** 스페이싱/라디어스 오버라이드 */
export interface SpacingOverrides {
  radius?: Record<string, number>;
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
