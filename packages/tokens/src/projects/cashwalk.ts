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
  cashwalkCoralRed,
  cashwalkCornflower,
  cashwalkGreen,
  cashwalkIndigo,
  cashwalkNeutral,
  cashwalkStatus,
  cashwalkYellow,
} from "./cashwalk.palette.js";
import { cashwalkSemantic } from "./cashwalk.semantic.js";

// palette / semantic 모두 외부에서 직접 import 가능하도록 re-export
export {
  cashwalkCommon,
  cashwalkNeutral,
  cashwalkYellow,
  cashwalkCoralRed,
  cashwalkBlue,
  cashwalkCornflower,
  cashwalkIndigo,
  cashwalkGreen,
  cashwalkBrown,
  cashwalkStatus,
};
export { cashwalkSemantic };
export type { CashwalkSemanticTokens } from "./cashwalk.semantic.js";

// ─── Brand Theme ────────────────────────────────────────

export const cashwalkTheme: ProjectTheme = {
  name: "cashwalk",
  actionsLayout: "end",
  palette: {
    common: cashwalkCommon,
    neutral: cashwalkNeutral,
    yellow: cashwalkYellow,
    coralRed: cashwalkCoralRed,
    blue: cashwalkBlue,
    cornflower: cashwalkCornflower,
    indigo: cashwalkIndigo,
    green: cashwalkGreen,
    brown: cashwalkBrown,
    status: cashwalkStatus,
  },
  semantic: cashwalkSemantic,
};
