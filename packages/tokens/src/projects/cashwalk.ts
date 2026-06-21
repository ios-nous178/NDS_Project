/**
 * Cashwalk (캐시워크 · 소비자앱) Brand Theme — palette + semantic, 구조는 base 상속.
 *
 * SSOT:
 *   - Color 가이드          : Figma 캐시워크 (676:3228)
 *   - SemanticColorGuide    : Figma 캐시워크 (676:3643)
 *
 * 구성:
 *   - cashwalk.palette.ts   : atomic 컬러 스케일 (Common / Neutral / Primary Yellow / ...)
 *   - cashwalk.semantic.ts  : Figma role-based 시멘틱 트리 (NudgeEAP base partial override)
 *   - cashwalk.ts (이 파일) : palette + semantic 묶음
 *
 * 소비자앱 테마 — typography/spacing/components override 없이 base 구조 상속.
 * (캐포비 admin 의 무거운 커스터마이징과 달리 색만 캐시워크 정체성으로 흘린다.)
 */

import type { ProjectTheme } from "./types.js";
import {
  cashwalkBlue,
  cashwalkBrown,
  cashwalkCommon,
  cashwalkRed,
  cashwalkCornflower,
  cashwalkGreen,
  cashwalkIndigo,
  cashwalkGray,
  cashwalkYellow,
} from "./cashwalk.palette.js";
import { cashwalkSemantic } from "./cashwalk.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export {
  cashwalkCommon,
  cashwalkGray,
  cashwalkYellow,
  cashwalkRed,
  cashwalkBlue,
  cashwalkCornflower,
  cashwalkIndigo,
  cashwalkGreen,
  cashwalkBrown,
};
export { cashwalkSemantic };
export type { CashwalkSemanticTokens } from "./cashwalk.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const cashwalkTheme: ProjectTheme = {
  name: "cashwalk",
  actionsLayout: "end",
  palette: {
    common: cashwalkCommon,
    gray: cashwalkGray,
    yellow: cashwalkYellow,
    red: cashwalkRed,
    blue: cashwalkBlue,
    cornflower: cashwalkCornflower,
    indigo: cashwalkIndigo,
    green: cashwalkGreen,
    brown: cashwalkBrown,
  },
  semantic: cashwalkSemantic,
  // Elevation — Figma 캐시워크 Library / Elevation (67:56). 4단계 Effect Style.
  //   E1 Card y1·blur3·8% / E2 Dropdown y2·blur8·10% / E3 Popover y6·blur16·12% / E4 Modal y12·blur32·16%.
  elevation: {
    shadow: {
      "0": "none", // E0 None — 기본 본문·플랫 카드
      "1": "0px 1px 3px rgba(0, 0, 0, 0.08)", // E1 — Card·기본 카드
      "2": "0px 2px 8px rgba(0, 0, 0, 0.1)", // E2 — Dropdown
      "3": "0px 6px 16px rgba(0, 0, 0, 0.12)", // E3 — Popover
      "4": "0px 12px 32px rgba(0, 0, 0, 0.16)", // E4 — Modal·Dialog
    },
  },
};
