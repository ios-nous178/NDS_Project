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
    page: { default: trostNeutral[150] }, // #F2F2F2
    surface: { default: trostNeutral["00"], subtle: trostNeutral[100] },
    section: { default: trostNeutral["cool-100"] },
    brand: { default: trostYellow.primary, subtle: trostYellow.light },
    status: {
      error: "#FEE9E6",
      success: "#E6F9F2",
      info: trostCobalt[100],
      caution: "#FFF8E6",
    },
    overlay: "rgba(0, 0, 0, 0.7)", // Trost 70% scrim (NudgeEAP base 40%)
    disabled: trostNeutral[200],
  },
  text: {
    strong: { default: trostNeutral[1000] }, // #000000 — Trost 강세
    normal: { default: trostNeutral[800] }, // #333333
    subtle: { default: trostNeutral[700] }, // #606060
    muted: { default: trostNeutral[500] }, // #979797
    disabled: { default: trostNeutral[400] }, // #C7C7C7
    inverse: { default: trostNeutral["00"] },
    // 노란 배경에 brand-default 텍스트를 쓰면 가독성이 떨어지므로 Trost 는
    // brand-default 를 어두운 노랑(#E6D200)으로, brand-strong 을 더 어두운
    // 노랑으로 둔다.
    brand: { default: "#E6D200", strong: "#A39200" },
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
    brand: { default: "#E6D200" }, // 노랑은 아이콘 자체로는 잘 안 보이므로 짙은 톤
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
