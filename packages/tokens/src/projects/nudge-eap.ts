/**
 * NudgeEAP Brand Theme — 옵트인 오버레이(옛 base).
 *
 * 과거엔 DS 의 base 였으나, base 가 Cashwalk 로 바뀌면서 NudgeEAP 는 일반 프로젝트
 * 오버레이(`dist/nudge-eap.css`)로 분리됐다. 소비처가 `@nudge-design/tokens/css/nudge-eap`
 * 를 base(`tokens.css`) 위에 얹으면 EAP 파란색이 복원된다(full semantic override).
 *
 * 단, base 의 **비색상 기본값**(components: chart/rating/toast/tooltip 등 프로젝트 무관 슬롯)
 * 은 여전히 이 theme 에서 가져온다 — generate-css.cjs 가 base 비색상 소스로 참조한다.
 *
 * 구성:
 *   - nudge-eap.semantic.ts : Figma SemanticColorGuide 1:1 미러 (full definition)
 *   - nudge-eap.ts (이 파일): palette + semantic + typography/spacing/elevation 묶음
 */

import type { ProjectTheme } from "./types.js";
import {
  gray,
  common,
  coolGray,
  blue,
  pink,
  yellow,
  orange,
  red,
  green,
  purple,
  teal,
} from "../colors.js";
import { fontFamily, typeScale } from "../typography.js";
import { radius } from "../spacing.js";
import { shadow, zIndex } from "../elevation.js";
import { nudgeEapSemantic } from "./nudge-eap.semantic.js";

export { nudgeEapSemantic };
export type { NudgeEapSemanticTokens } from "./nudge-eap.semantic.js";

export const nudgeEapTheme: ProjectTheme = {
  name: "nudge-eap",
  actionsLayout: "split",
  palette: {
    gray,
    common,
    coolGray,
    blue,
    pink,
    yellow,
    orange,
    red,
    green,
    purple,
    teal,
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
    // 캐포비 데이터-뷰 팔레트 (아토믹 외 — 디자이너 토큰화 대기). 모든 프로젝트 공통 기본값.
    chart: {
      line: "#FFD200",
      "1": "#007AFF",
      "2": "#FF8437",
      "3": "#FFD200",
      "4": "#34C759",
      empty: "#BBBBBB",
    },
    rating: { star: "#FFD54F", starEmpty: gray[300] }, // 빈 별 — 팔레트 내 최근접 그레이(#D8D8D8)
    // Toast — 단일 다크 토스트 (Figma 1330:2). role-based 시멘틱 변수 집합 밖이라 --nds-* 슬롯.
    // 모든 프로젝트 공통 기본값 (캐포비는 Toast 자체가 banned → Snackbar).
    toast: {
      bg: "rgba(33, 33, 33, 0.92)",
      shadow: "0px 8px 12px rgba(0, 0, 0, 0.18)",
    },
    // Tooltip — 단일 다크 톤 #333333 (Figma 1380:13). role-based 시멘틱 변수 집합 밖이라 --nds-* 슬롯.
    // 전 프로젝트 동일 톤(디자이너 확정) — base theme :root emit, 프로젝트 override 없음.
    tooltip: { bg: "#333333" },
  },
};
