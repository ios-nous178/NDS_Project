/**
 * Geniet Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * Geniet 가 NudgeEAP base(projects/nudge-eap.semantic.ts) 와 다른 부분만 명시.
 * generate-css.cjs 가 이 트리를 `dist/geniet.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다.
 *
 * 누락된 키는 base 값이 그대로 유지된다.
 *
 * SSOT: Figma 지니어트 Library / Semantic Color (3009:2)
 *   https://www.figma.com/design/0LLw2nSq9AUhXww7pWFRlm/?node-id=3009-2
 *
 * 핵심: 프로젝트 액션 색 = teal/600 (#00A8AC), hover teal/700, pressed teal/800.
 *       (구버전의 teal/500 #48C2C5 primary 에서 한 단계 깊어짐)
 */

import { ref } from "../ref.js";

export const genietSemantic = {
  bg: {
    page: { default: ref("color.gray.50") }, // #FAFAFA
    surface: {
      default: ref("color.common.white"), // #FFFFFF
      subtle: ref("color.gray.50"), // #FAFAFA
    },
    section: { default: ref("color.gray.100") }, // #F5F5F5
    brand: {
      default: ref("color.teal.600"), // #00A8AC
      subtle: ref("color.teal.50"), // #F2FAFA
    },
    inverse: { default: ref("color.common.black") }, // #111111
    status: {
      error: ref("color.red.50"), // #FFF0F2
      success: ref("color.green.50"), // #F1FBF6
      info: ref("color.blue.50"), // #F0F9FF
      caution: ref("color.yellow.50"), // #FFFBE6
    },
    overlay: "rgba(0, 0, 0, 0.4)",
    disabled: ref("color.gray.200"), // #ECECEC
  },
  text: {
    strong: { default: ref("color.common.black") }, // #111111
    normal: { default: ref("color.gray.800") }, // #333333
    subtle: { default: ref("color.gray.700") }, // #555555 — input label / 본문 보조
    muted: { default: ref("color.gray.500") }, // #999999 — placeholder
    disabled: { default: ref("color.gray.400") }, // #CCCCCC
    inverse: { default: ref("color.common.white") }, // #FFFFFF
    brand: {
      default: ref("color.teal.600"), // #00A8AC
      strong: ref("color.teal.700"), // #008286
    },
    status: {
      success: ref("color.green.600"), // #18B264
      error: ref("color.red.600"), // #FF3258
      caution: ref("color.yellow.500"), // #FFB700
      info: ref("color.blue.600"), // #1488D3
    },
  },
  // Button — SSOT: Figma 지니어트 Library / Semantic Color (3009:2).
  // Secondary 는 옅은 teal subtle (다른 프로젝트 soft secondary 와 동일 패턴).
  // 구버전의 dark-inverse(gray/900) 패턴은 폐기됨.
  buttonBg: {
    default: ref("color.teal.600"), // #00A8AC — Solid/Primary Default
    hover: ref("color.teal.700"), // #008286 — Solid/Primary Hover
    pressed: ref("color.teal.800"), // #005A5C — Solid/Primary Pressed
    disabled: ref("color.gray.300"), // #DDDDDD — 모든 Solid Disabled
    secondary: {
      // Solid/Secondary — 옅은 teal subtle
      default: ref("color.teal.50"), // #F2FAFA
      hover: ref("color.teal.100"), // #ECF5F9
      disabled: ref("color.gray.200"), // #ECECEC
    },
    outlined: {
      default: ref("color.common.white"), // #FFFFFF
      hover: ref("color.teal.50"), // #F2FAFA — outlined hover bg
      disabled: ref("color.common.white"), // #FFFFFF
    },
    neutral: {
      // Solid/Neutral — neutral gray filled (DS extension, Figma 시멘틱 가이드 미정의)
      default: ref("color.gray.200"), // #ECECEC
      hover: ref("color.gray.100"), // #F5F5F5
      disabled: ref("color.gray.300"), // #DDDDDD
    },
  },
  buttonText: {
    default: ref("color.common.white"), // #FFFFFF — Solid/Primary 텍스트
    brand: ref("color.teal.600"), // #00A8AC — Outlined/Primary 텍스트
    // Solid/Secondary 텍스트 — 옅은 teal 배경 위 brand teal 텍스트.
    secondary: {
      default: ref("color.teal.600"), // #00A8AC
      disabled: ref("color.gray.500"), // #999999
    },
    neutral: ref("color.gray.700"), // #555555 — Outlined/Weak Neutral text
    neutralSolid: ref("color.gray.700"), // #555555 — Solid Neutral text (밝은 #ECECEC fill 위)
    neutralDisabled: ref("color.gray.500"), // #999999 — Outlined/Neutral disabled text
    disabled: ref("color.gray.500"), // #999999 — Outlined disabled text
  },
  buttonBorder: {
    outlined: {
      default: ref("color.teal.600"), // #00A8AC — Outlined/Primary border
      hover: ref("color.teal.700"), // #008286
      disabled: ref("color.gray.300"), // #DDDDDD
    },
    neutral: {
      default: ref("color.gray.300"), // #DDDDDD — Outlined/Assistive border
      disabled: ref("color.gray.200"), // #ECECEC
    },
  },
  icon: {
    strong: { default: ref("color.common.black") }, // #111111
    normal: { default: ref("color.gray.700") }, // #555555
    disabled: { default: ref("color.gray.400") }, // #CCCCCC
    inverse: { default: ref("color.common.white") }, // #FFFFFF
    brand: { default: ref("color.teal.600") }, // #00A8AC
    status: {
      success: ref("color.green.600"), // #18B264
      error: ref("color.red.600"), // #FF3258
      caution: ref("color.yellow.500"), // #FFB700
    },
  },
  border: {
    normal: { default: ref("color.gray.200") }, // #ECECEC
    strong: { default: ref("color.gray.500") }, // #999999
    subtle: { default: ref("color.gray.100") }, // #F5F5F5
    focus: { default: ref("color.teal.600") }, // #00A8AC
    brand: {
      default: ref("color.teal.600"), // #00A8AC
      disabled: ref("color.gray.300"), // #DDDDDD
    },
    disabled: { default: ref("color.gray.200") }, // #ECECEC
    status: {
      error: ref("color.red.600"), // #FF3258
      caution: ref("color.yellow.500"), // #FFB700
    },
  },
  fill: {
    brand: {
      default: ref("color.teal.600"), // #00A8AC
      hover: ref("color.teal.700"), // #008286
      pressed: ref("color.teal.800"), // #005A5C
      disabled: ref("color.gray.300"), // #DDDDDD
    },
    neutral: {
      default: ref("color.gray.800"), // #333333
      subtle: ref("color.gray.100"), // #F5F5F5
    },
    inverse: { default: ref("color.common.white") }, // #FFFFFF
    status: {
      error: ref("color.red.600"), // #FF3258
      caution: ref("color.yellow.500"), // #FFB700
    },
  },
  // Input — SSOT: Figma 지니어트 Library / Semantic Color (3009:2).
  input: {
    bg: ref("color.common.white"), // #FFFFFF
    bgDisabled: ref("color.gray.50"), // #FAFAFA
    borderDefault: ref("color.gray.300"), // #DDDDDD
    borderHover: ref("color.gray.400"), // #CCCCCC
    borderFocus: ref("color.teal.600"), // #00A8AC — typing state border
    borderError: ref("color.red.600"), // #FF3258
    borderDisabled: ref("color.gray.300"), // #DDDDDD
    placeholder: ref("color.gray.500"), // #999999
    helpertextDefault: ref("color.gray.500"), // #999999
    helpertextSuccess: ref("color.teal.600"), // #00A8AC
    helpertextError: ref("color.red.600"), // #FF3258
    helpertextDisabled: ref("color.gray.400"), // #CCCCCC
  },
} as const;

export type GenietSemanticTokens = typeof genietSemantic;
