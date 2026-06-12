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
import { neutral, coolGray, blue, magenta, yellow, red, coralRed, green, amber } from "../colors.js";
import { fontFamily, typeScale } from "../typography.js";
import { radius } from "../spacing.js";
import { shadow, zIndex } from "../elevation.js";
import { nudgeEapSemantic } from "./nudge-eap.semantic.js";

export { nudgeEapSemantic };
export type { NudgeEapSemanticTokens } from "./nudge-eap.semantic.js";

export const nudgeEapTheme: BrandTheme = {
  name: "nudge-eap",
  actionsLayout: "split",
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
  components: {
    // 캐포비 데이터-뷰 팔레트 (아토믹 외 — 디자이너 토큰화 대기). 모든 브랜드 공통 기본값.
    chart: {
      line: "#FFD200",
      "1": "#007AFF",
      "2": "#FF8437",
      "3": "#FFD200",
      "4": "#34C759",
      empty: "#BBBBBB",
    },
    rating: { star: "#FFD54F" },
    // Toast — 단일 다크 토스트 (Figma 1330:2). role-based 시멘틱 변수 집합 밖이라 --nds-* 슬롯.
    // 모든 브랜드 공통 기본값 (캐포비는 Toast 자체가 banned → Snackbar).
    toast: {
      bg: "rgba(33, 33, 33, 0.92)",
      shadow: "0px 8px 12px rgba(0, 0, 0, 0.18)",
    },
    // Tooltip — 단일 다크 톤 (Figma 1380:13 #333). "중립 채움" 역할 = fill.neutral 시멘틱에 바인딩 →
    // base #383838 / 캐포비 #333 으로 브랜드 cascade(슬롯값=시멘틱 var). 모든 브랜드 :root emit.
    tooltip: { bg: "var(--semantic-fill-neutral-default)" },
  },
};
