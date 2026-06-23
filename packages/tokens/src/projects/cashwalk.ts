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
 *
 * ★ 이 theme(palette + semantic)이 DS 의 **base** 다 — generate-css.cjs 가 `dist/tokens.css`
 * (:root, 프로젝트 미설정 기본)를 cashwalk 팔레트+시멘틱으로 emit. 별도 cashwalk.css 는 없다.
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
  // Elevation override 없음 — cashwalk=base 이므로 base elevation.ts(Figma 캐시워크 67:56,
  // 4단계 E1~E4)를 그대로 상속. (옛 여기 박혀있던 shadow 블록은 base 로 안 흘러가는 dead 라 제거.)
};
