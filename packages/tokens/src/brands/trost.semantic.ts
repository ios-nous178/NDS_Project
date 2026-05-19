/**
 * Trost Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * Trost 가 NudgeEAP base(brands/nudge-eap.semantic.ts) 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/trost.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다.
 *
 * 누락된 키는 base 값이 그대로 유지된다 (예: text.muted 가 없으면 NudgeEAP 의
 * `--semantic-text-muted-default` 가 그대로 적용).
 */

import { trostCobalt, trostNeutral, trostStatus, trostYellow } from "./trost.palette.js";

export const trostSemantic = {
  bg: {
    // 페이지 bg 는 흰색 — UtilityHeader / TabNav / 일반 본문 모두 #fff.
    // (trostNeutral[150] = #F2F2F2 는 section divider 색으로 border.subtle 에 매핑됨.)
    page: { default: trostNeutral["00"] },
    surface: { default: trostNeutral["00"], subtle: trostNeutral[100] },
    section: { default: trostNeutral["cool-100"] },
    brand: { default: trostYellow.primary, subtle: trostYellow.light },
    status: {
      error: "#FEE9E6",
      success: "#E6F9F2",
      info: trostCobalt[100],
      caution: "#FFF8E6",
    },
    // Bible 카드 등 실측 overlay 는 60% (`bg-black/60`). NudgeEAP base 는 40%.
    overlay: "rgba(0, 0, 0, 0.6)",
    disabled: trostNeutral[200],
  },
  text: {
    strong: { default: trostNeutral[1000] }, // #000000 — Trost 강세
    normal: { default: trostNeutral[800] }, // #333333
    subtle: { default: trostNeutral[700] }, // #606060
    muted: { default: trostNeutral[500] }, // #979797
    disabled: { default: trostNeutral[400] }, // #C7C7C7
    inverse: { default: trostNeutral["00"] },
    // 트로스트의 "활성 / 선택 / 자사 강조" 텍스트는 코드 실측상 모두 orange
    // (#FF9D00) — 활성 카테고리 / 인용 멘션 / 댓글 멘션 prefix / 활성 sub-tab /
    // EAP 다운로드 툴팁의 "트로스트" 강조 등. 노랑 primary 는 면적이 큰 button bg
    // 용이지 텍스트로는 가독성 때문에 안 쓰이므로 brand-as-text 는 orange 가 맞다.
    brand: { default: trostStatus.orange, strong: trostStatus.orange },
    status: {
      success: trostStatus.green,
      error: trostStatus.error,
      caution: trostStatus.orange,
      info: trostCobalt[500],
    },
  },
  buttonBg: {
    default: trostYellow.primary, // #FFF42E
    hover: "#FFE600",
    pressed: "#E6D200",
    disabled: trostNeutral[200],
    secondary: {
      default: trostCobalt[50],
      hover: trostCobalt[100],
      disabled: trostNeutral[200],
    },
    outlined: {
      default: trostNeutral["00"],
      hover: trostYellow.light,
      disabled: trostNeutral["00"],
    },
  },
  buttonText: {
    default: "#000000", // 노란 배경 → 검정 텍스트 (Trost 특성)
    brand: "#E6D200",
    // Solid/Secondary 텍스트 — cobalt-50 배경 위에 cobalt 텍스트.
    secondary: {
      default: trostCobalt[500],
      disabled: trostNeutral[500],
    },
    disabled: trostNeutral[500],
  },
  buttonBorder: {
    outlined: {
      default: trostYellow.border, // #FFE600
      hover: trostYellow.border,
      disabled: trostNeutral[300],
    },
    assistive: { default: trostNeutral[200], disabled: trostNeutral[200] },
  },
  icon: {
    strong: { default: trostNeutral[800] },
    normal: { default: trostNeutral[700] },
    disabled: { default: trostNeutral[400] },
    inverse: { default: trostNeutral["00"] },
    // text.brand 와 동일하게 brand-as-icon 도 orange. 노랑은 면적이 큰 button bg /
    // banner bg 용이지 작은 아이콘으로는 가독성이 떨어진다.
    brand: { default: trostStatus.orange },
    status: {
      success: trostStatus.green,
      error: trostStatus.error,
      caution: trostStatus.orange,
    },
  },
  border: {
    normal: { default: trostNeutral[200] },
    strong: { default: trostNeutral[500] },
    subtle: { default: trostNeutral[150] },
    focus: { default: trostCobalt[500] }, // Trost focus = cobalt (브랜드 정체성)
    brand: { default: trostYellow.border, disabled: trostNeutral[300] },
    disabled: { default: trostNeutral[200] },
    status: { error: trostStatus.error, caution: trostStatus.orange },
  },
  fill: {
    brand: {
      default: trostYellow.primary,
      hover: "#FFE600",
      pressed: "#E6D200",
      disabled: trostNeutral[300],
    },
    neutral: { default: trostNeutral[800], subtle: trostNeutral[100] },
    inverse: { default: trostNeutral["00"] },
    status: { error: trostStatus.error, caution: trostStatus.orange },
  },
  input: {
    bg: trostNeutral["00"],
    bgDisabled: trostNeutral[100],
    borderDefault: trostNeutral[200],
    borderHover: trostNeutral[400],
    borderFocus: trostCobalt[500],
    borderError: trostStatus.error,
    borderDisabled: trostNeutral[200],
    placeholder: trostNeutral[500],
    helpertextDefault: trostNeutral[500],
    helpertextSuccess: trostCobalt[500],
    helpertextError: trostStatus.error,
    helpertextDisabled: trostNeutral[400],
  },
} as const;

export type TrostSemanticTokens = typeof trostSemantic;
