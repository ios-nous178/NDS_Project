/**
 * Brand Theme — 브랜드별 토큰 오버라이드 타입 정의
 *
 * 각 브랜드(NudgeEAP, Trost 등)는 이 인터페이스를 구현하여
 * 시맨틱 토큰만 교체하면 동일한 컴포넌트를 브랜드에 맞게 렌더링할 수 있다.
 */

import type { TypeStyle } from "../typography";

/** 팔레트 컬러 — 브랜드 고유 색상 스케일 */
export type ColorScale = Record<string | number, string>;

/** 시맨틱 컬러 — 컴포넌트가 실제 참조하는 의미 기반 토큰 */
export interface SemanticColors {
  primary: {
    main: string;
    hover: string;
    pressed: string;
    lighter: string;
    bg: string;
    bgLighter: string;
    /** primary 배경 위 텍스트 색상 (NudgeEAP: white, Trost: black) */
    fg: string;
  };
  secondary: {
    sub: string;
    lighter: string;
    bg: string;
    bgLighter: string;
  };
  error: {
    main: string;
    bg: string;
  };
  caution: {
    main: string;
    text: string;
    bg: string;
  };
  success: {
    main: string;
    bg: string;
  };
  text: {
    default: string;
    disabled: string;
    placeholder: string;
    subtle: string;
    inverse: string;
  };
  bg: {
    white: string;
    light: string;
    coolGray: string;
    coolGrayLighter: string;
    disabled: string;
    overlay: string;
  };
  border: {
    default: string;
    light: string;
    focus: string;
    disabled: string;
  };
  icon: {
    default: string;
    subtle: string;
    inverse: string;
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
  /** 시맨틱 컬러 매핑 */
  semantic: SemanticColors;
  /** 타이포그래피 오버라이드 (미지정 시 기본값 사용) */
  typography?: Partial<TypographyOverrides>;
  /** 스페이싱 오버라이드 (미지정 시 기본값 사용) */
  spacing?: SpacingOverrides;
  /** 엘리베이션 오버라이드 (미지정 시 기본값 사용) */
  elevation?: ElevationOverrides;
}
