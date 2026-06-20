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
 * 핵심: 프로젝트 액션 색 = mint/600 (#00A8AC), hover mint/700, pressed mint/800.
 *       (구버전의 mint/500 #48C2C5 primary 에서 한 단계 깊어짐)
 */

import {
  genietBlue,
  genietGray,
  genietGreen,
  genietMint,
  genietNeutral,
  genietRed,
  genietYellow,
} from "./geniet.palette.js";

export const genietSemantic = {
  bg: {
    page: { default: genietGray[50] }, // #FAFAFA
    surface: {
      default: genietNeutral.white, // #FFFFFF
      subtle: genietGray[50], // #FAFAFA
    },
    section: { default: genietGray[100] }, // #F5F5F5
    brand: {
      default: genietMint[600], // #00A8AC
      subtle: genietMint[50], // #F2FAFA
    },
    inverse: { default: genietNeutral.black }, // #111111
    status: {
      error: genietRed[50], // #FFF0F2
      success: genietGreen[50], // #F1FBF6
      info: genietBlue[50], // #F0F9FF
      caution: genietYellow[50], // #FFFBE6
    },
    overlay: "rgba(0, 0, 0, 0.4)",
    disabled: genietGray[200], // #ECECEC
  },
  text: {
    strong: { default: genietNeutral.black }, // #111111
    normal: { default: genietGray[800] }, // #333333
    subtle: { default: genietGray[700] }, // #555555 — input label / 본문 보조
    muted: { default: genietGray[500] }, // #999999 — placeholder
    disabled: { default: genietGray[400] }, // #CCCCCC
    inverse: { default: genietNeutral.white }, // #FFFFFF
    brand: {
      default: genietMint[600], // #00A8AC
      strong: genietMint[700], // #008286
    },
    status: {
      success: genietGreen[600], // #18B264
      error: genietRed[600], // #FF3258
      caution: genietYellow[500], // #FFB700
      info: genietBlue[600], // #1488D3
    },
  },
  // Button — SSOT: Figma 지니어트 Library / Semantic Color (3009:2).
  // Secondary 는 옅은 mint subtle (다른 프로젝트 soft secondary 와 동일 패턴).
  // 구버전의 dark-inverse(gray/900) 패턴은 폐기됨.
  buttonBg: {
    default: genietMint[600], // #00A8AC — Solid/Primary Default
    hover: genietMint[700], // #008286 — Solid/Primary Hover
    pressed: genietMint[800], // #005A5C — Solid/Primary Pressed
    disabled: genietGray[300], // #DDDDDD — 모든 Solid Disabled
    secondary: {
      // Solid/Secondary — 옅은 mint subtle
      default: genietMint[50], // #F2FAFA
      hover: genietMint[100], // #ECF5F9
      disabled: genietGray[200], // #ECECEC
    },
    outlined: {
      default: genietNeutral.white, // #FFFFFF
      hover: genietMint[50], // #F2FAFA — outlined hover bg
      disabled: genietNeutral.white, // #FFFFFF
    },
    neutral: {
      // Solid/Neutral — neutral gray filled (DS extension, Figma 시멘틱 가이드 미정의)
      default: genietGray[200], // #ECECEC
      hover: genietGray[100], // #F5F5F5
      disabled: genietGray[300], // #DDDDDD
    },
  },
  buttonText: {
    default: genietNeutral.white, // #FFFFFF — Solid/Primary 텍스트
    brand: genietMint[600], // #00A8AC — Outlined/Primary 텍스트
    // Solid/Secondary 텍스트 — 옅은 mint 배경 위 brand mint 텍스트.
    secondary: {
      default: genietMint[600], // #00A8AC
      disabled: genietGray[500], // #999999
    },
    neutral: genietGray[700], // #555555 — Outlined/Weak Neutral text
    neutralSolid: genietGray[700], // #555555 — Solid Neutral text (밝은 #ECECEC fill 위)
    neutralDisabled: genietGray[500], // #999999 — Outlined/Neutral disabled text
    disabled: genietGray[500], // #999999 — Outlined disabled text
  },
  buttonBorder: {
    outlined: {
      default: genietMint[600], // #00A8AC — Outlined/Primary border
      hover: genietMint[700], // #008286
      disabled: genietGray[300], // #DDDDDD
    },
    neutral: {
      default: genietGray[300], // #DDDDDD — Outlined/Assistive border
      disabled: genietGray[200], // #ECECEC
    },
  },
  icon: {
    strong: { default: genietNeutral.black }, // #111111
    normal: { default: genietGray[700] }, // #555555
    disabled: { default: genietGray[400] }, // #CCCCCC
    inverse: { default: genietNeutral.white }, // #FFFFFF
    brand: { default: genietMint[600] }, // #00A8AC
    status: {
      success: genietGreen[600], // #18B264
      error: genietRed[600], // #FF3258
      caution: genietYellow[500], // #FFB700
    },
  },
  border: {
    normal: { default: genietGray[200] }, // #ECECEC
    strong: { default: genietGray[500] }, // #999999
    subtle: { default: genietGray[100] }, // #F5F5F5
    focus: { default: genietMint[600] }, // #00A8AC
    brand: {
      default: genietMint[600], // #00A8AC
      disabled: genietGray[300], // #DDDDDD
    },
    disabled: { default: genietGray[200] }, // #ECECEC
    status: {
      error: genietRed[600], // #FF3258
      caution: genietYellow[500], // #FFB700
    },
  },
  fill: {
    brand: {
      default: genietMint[600], // #00A8AC
      hover: genietMint[700], // #008286
      pressed: genietMint[800], // #005A5C
      disabled: genietGray[300], // #DDDDDD
    },
    neutral: {
      default: genietGray[800], // #333333
      subtle: genietGray[100], // #F5F5F5
    },
    inverse: { default: genietNeutral.white }, // #FFFFFF
    status: {
      error: genietRed[600], // #FF3258
      caution: genietYellow[500], // #FFB700
    },
  },
  // Input — SSOT: Figma 지니어트 Library / Semantic Color (3009:2).
  input: {
    bg: genietNeutral.white, // #FFFFFF
    bgDisabled: genietGray[50], // #FAFAFA
    borderDefault: genietGray[300], // #DDDDDD
    borderHover: genietGray[400], // #CCCCCC
    borderFocus: genietMint[600], // #00A8AC — typing state border
    borderError: genietRed[600], // #FF3258
    borderDisabled: genietGray[300], // #DDDDDD
    placeholder: genietGray[500], // #999999
    helpertextDefault: genietGray[500], // #999999
    helpertextSuccess: genietMint[600], // #00A8AC
    helpertextError: genietRed[600], // #FF3258
    helpertextDisabled: genietGray[400], // #CCCCCC
  },
} as const;

export type GenietSemanticTokens = typeof genietSemantic;
