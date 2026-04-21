/**
 * NudgeEAP Brand Theme
 *
 * 기존 NudgeEAP 디자인 시스템의 기본 브랜드 토큰.
 * 기존 colors.ts, typography.ts 등의 값을 BrandTheme 형태로 재구성.
 */

import type { BrandTheme } from "./types";
import { neutral, coolGray, blue, magenta, yellow, red, green, semantic } from "../colors";
import { fontFamily, typeScale } from "../typography";
import { radius } from "../spacing";
import { shadow, zIndex } from "../elevation";

export const nudgeEapTheme: BrandTheme = {
  name: "nudge-eap",
  palette: {
    neutral,
    coolGray,
    blue,
    magenta,
    yellow,
    red,
    green,
  },
  semantic: {
    ...semantic,
    primary: {
      ...semantic.primary,
      fg: semantic.text.inverse, // 파란 배경 → 흰색 텍스트
    },
  },
  typography: {
    fontFamily,
    typeScale,
  },
  spacing: {
    radius,
  },
  elevation: {
    shadow,
    zIndex,
  },
};
