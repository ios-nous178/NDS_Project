/**
 * NudgeEAP Brand Theme — base brand.
 *
 * NudgeEAP 는 DS 의 default. `dist/tokens.css` (브랜드 무관 base CSS) 가
 * 이 theme 의 `semantic` 으로 emit 된다. 다른 브랜드(Trost / Geniet) 는
 * brands/{brand}.semantic.ts 에서 partial override 를 명시하고,
 * `dist/{brand}.css` cascade 로 base 변수를 덮어쓴다.
 *
 * 구성:
 *   - nudge-eap.semantic.ts : Figma SemanticColorGuide 1:1 미러 (full definition)
 *   - nudge-eap.ts (이 파일): palette + semantic + typography/spacing/elevation 묶음
 */

import type { BrandTheme } from "./types";
import { neutral, coolGray, blue, magenta, yellow, red, coralRed, green, amber } from "../colors";
import { fontFamily, typeScale } from "../typography";
import { radius } from "../spacing";
import { shadow, zIndex } from "../elevation";
import { nudgeEapSemantic } from "./nudge-eap.semantic.js";

export { nudgeEapSemantic };
export type { NudgeEapSemanticTokens } from "./nudge-eap.semantic.js";

export const nudgeEapTheme: BrandTheme = {
  name: "nudge-eap",
  palette: {
    neutral,
    coolGray,
    blue,
    magenta,
    yellow,
    red,
    coralRed,
    green,
    amber,
  },
  semantic: nudgeEapSemantic,
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
