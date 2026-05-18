/**
 * NudgeEAP Brand Theme
 *
 * 기본 브랜드. base tokens.css 가 NudgeEAP 값으로 emit 되므로 brand override
 * 는 비어 있다. (다른 브랜드가 override 할 때만 필요)
 */

import type { BrandTheme } from "./types";
import { neutral, coolGray, blue, magenta, yellow, red, green } from "../colors";
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
  semantic: {}, // base tokens.css 가 곧 NudgeEAP 정의
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
