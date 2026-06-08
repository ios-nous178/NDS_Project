/**
 * Geniet Semantic Colors — Figma role-based 트리의 Partial override.
 *
 * Geniet 가 NudgeEAP base(brands/nudge-eap.semantic.ts) 와 다른 부분만 명시.
 * generate-css.js 가 이 트리를 `dist/geniet.css` 의 `--semantic-*` 변수로 emit.
 * CSS cascade 에 의해 NudgeEAP base 의 같은 변수를 덮어쓴다.
 *
 * 누락된 키는 base 값이 그대로 유지된다.
 *
 * SSOT: Figma 지니어트-Dev / Colors (207:1484)
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
    page: { default: genietGray[100] }, // #F5F5F5 — Figma sample frame bg
    surface: {
      default: genietNeutral.white, // #FFFFFF
      subtle: genietGray[50], // #FAFAFA
    },
    section: { default: genietGray[100] }, // #F5F5F5
    brand: {
      default: genietMint[500], // #48C2C5
      subtle: genietMint[100], // #ECF8F9
    },
    inverse: { default: genietNeutral.black }, // #111111
    status: {
      error: genietRed[100], // #FFEBEE
      success: genietGreen[100], // #F1FBF6
      info: genietBlue[100], // #E4F5FF
      caution: genietYellow[100], // #FFF8DF
    },
    overlay: "rgba(0, 0, 0, 0.4)",
    disabled: genietGray[200], // #ECECEC
  },
  text: {
    strong: { default: genietNeutral.black }, // #111111
    normal: { default: genietGray[900] }, // #333333
    // Figma 의 input label · 본문 secondary 톤은 gray/700 (#777).
    // helper text 등 더 진한 보조 텍스트는 input.helpertextDefault 슬롯이 따로 잡음.
    subtle: { default: genietGray[700] }, // #777777 — input label
    muted: { default: genietGray[600] }, // #999999 — placeholder
    disabled: { default: genietGray[500] }, // #BBBBBB
    inverse: { default: genietNeutral.white }, // #FFFFFF
    brand: {
      default: genietMint[600], // #00A8AC — 흰 배경 가독성
      strong: genietMint[600], // #00A8AC
    },
    status: {
      success: genietGreen[600], // #18B264 — 텍스트 가독성 우선
      error: genietRed[600], // #FF3258
      caution: genietYellow[600], // #FFA500
      info: genietBlue[500], // #1FA3F9
    },
  },
  // Button — SSOT: Figma 지니어트-Dev / Button (207:1853).
  // Geniet 의 Solid Secondary 는 다른 브랜드와 달리 dark inverse 패턴(gray/900).
  // Solid Neutral 는 채워진 neutral gray (neutral 슬롯에서 별도로 표현).
  buttonBg: {
    default: genietMint[500], // #48C2C5  — Solid/Primary Default
    hover: genietMint[600], // #00A8AC   — Solid/Primary Hover
    pressed: genietMint[600], // #00A8AC
    disabled: genietGray[400], // #CCCCCC — 모든 Solid Disabled
    secondary: {
      // Solid/Secondary — dark inverse 패턴 (Geniet 고유)
      default: genietGray[900], // #333333
      hover: genietGray[800], // #666666
      disabled: genietGray[400], // #CCCCCC
    },
    outlined: {
      default: genietNeutral.white, // #FFFFFF
      hover: genietGray[50], // #FAFAFA — outlined hover bg
      disabled: genietNeutral.white, // #FFFFFF
    },
    neutral: {
      // Solid/Neutral — neutral gray filled
      default: genietGray[200], // #ECECEC
      hover: genietGray[100], // #F5F5F5
      disabled: genietGray[400], // #CCCCCC
    },
  },
  buttonText: {
    default: genietNeutral.white, // #FFFFFF — Solid/Primary 텍스트
    brand: genietMint[600], // #00A8AC — Outlined/Primary 텍스트
    // Solid/Secondary 텍스트 — dark inverse 패턴이라 흰 텍스트 (Geniet 고유).
    secondary: {
      default: genietNeutral.white, // #FFFFFF — gray-900 배경 위
      disabled: genietGray[600], // #999999 — disabled bg(#CCCCCC) 위에서 가독성 유지
    },
    neutral: genietGray[800], // #666666 — Outlined/Weak Neutral text
    neutralSolid: genietGray[800], // #666666 — Solid Neutral text (밝은 #ECECEC fill 위 어두운 글자)
    disabled: genietGray[600], // #999999 — Outlined disabled text (solid disabled 는 default 유지 = white)
  },
  buttonBorder: {
    outlined: {
      default: genietMint[600], // #00A8AC — Outlined/Primary border
      hover: genietMint[600], // #00A8AC
      disabled: genietGray[300], // #DDDDDD
    },
    neutral: {
      default: genietGray[300], // #DDDDDD — Outlined/Neutral border
      disabled: genietGray[300], // #DDDDDD
    },
  },
  icon: {
    strong: { default: genietGray[900] }, // #333333
    normal: { default: genietGray[800] }, // #666666
    disabled: { default: genietGray[500] }, // #BBBBBB
    inverse: { default: genietNeutral.white }, // #FFFFFF
    brand: { default: genietMint[600] }, // #00A8AC
    status: {
      success: genietGreen[500], // #49CA89
      error: genietRed[600], // #FF3258
      caution: genietYellow[500], // #FFB700
    },
  },
  border: {
    normal: { default: genietGray[300] }, // #DDDDDD
    strong: { default: genietGray[500] }, // #BBBBBB
    subtle: { default: genietGray[200] }, // #ECECEC
    focus: { default: genietMint[500] }, // #48C2C5
    brand: {
      default: genietMint[500], // #48C2C5
      disabled: genietGray[400], // #CCCCCC
    },
    disabled: { default: genietGray[200] }, // #ECECEC
    status: {
      error: genietRed[600], // #FF3258
      caution: genietYellow[500], // #FFB700
    },
  },
  fill: {
    brand: {
      default: genietMint[500], // #48C2C5
      hover: genietMint[600], // #00A8AC
      pressed: genietMint[600], // #00A8AC
      disabled: genietGray[300], // #DDDDDD
    },
    neutral: {
      default: genietGray[800], // #666666
      subtle: genietGray[100], // #F5F5F5
    },
    inverse: { default: genietNeutral.white }, // #FFFFFF
    status: {
      error: genietRed[600], // #FF3258
      caution: genietYellow[500], // #FFB700
    },
  },
  // Input — SSOT: Figma 지니어트-Dev / Input (207:2640).
  input: {
    bg: genietNeutral.white, // #FFFFFF
    bgDisabled: genietGray[100], // #F5F5F5 — disabled bg 는 더 진한 gray/100
    borderDefault: genietGray[300], // #DDDDDD
    borderHover: genietGray[400], // #CCCCCC
    borderFocus: genietMint[500], // #48C2C5 — typing state border
    borderError: genietRed[600], // #FF3258
    borderDisabled: genietGray[300], // #DDDDDD
    placeholder: genietGray[600], // #999999
    helpertextDefault: genietGray[800], // #666666 — placeholder 보다 진한 helper 톤
    helpertextSuccess: genietMint[600], // #00A8AC
    helpertextError: genietRed[600], // #FF3258
    helpertextDisabled: genietGray[500], // #BBBBBB — disabled input value 색상과 동일
  },
} as const;

export type GenietSemanticTokens = typeof genietSemantic;
