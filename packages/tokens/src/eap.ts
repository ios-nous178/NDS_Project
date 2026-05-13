/**
 * Role-based semantic tokens (Figma SemanticColorGuide 222:2 + Input 294:12)
 *
 * 8 roles · 68 tokens. atomic palette(colors.ts) 및 palette-semantic 토큰을
 * alias 로 참조한다. CSS emit 시 `--semantic-{group}-{role}-{variant}`
 * namespace 로 노출됨 (구 `--eap-*` 에서 통합).
 *
 * JS 측 참조는 `cv` (cssVar.ts) 에서 일원화. 외부 코드는 이 파일을 직접
 * import 하지 않는다 — 빌드 파이프라인(generate-css.js) 전용.
 */

import { neutral, coolGray, blue, yellow, red, green, semantic } from "./colors.js";

// blue는 atomic 스케일이 Figma와 디커플링되어 사용하지 않지만, 미래 참조용으로 import 유지
void blue;

/** Bright Blue · 700 — Figma 신규값, 현재 semantic.primary.pressed(#1B65BA)와 다름 */
const brightBlue700 = "#0E71CF";

export const eap = {
  bg: {
    page: { default: coolGray[50] }, // #F8F9FB
    surface: {
      default: neutral["00"], // #FFFFFF
      subtle: neutral[50], // #FAFAFA
    },
    section: { default: coolGray[100] }, // #F3F4F6
    brand: {
      default: semantic.primary.main, // #2B96ED
      subtle: semantic.primary.bgLighter, // #F1F8FD
    },
    inverse: { default: neutral[900] }, // #111111
    status: {
      error: red[50], // #FEE9E6
      success: green[50], // #E5F7F4
      info: semantic.primary.bg, // #E3F2FC
      caution: yellow[50], // #FFFAE8
    },
  },
  text: {
    strong: { default: neutral[900] }, // #111111
    normal: { default: neutral[800] }, // #383838
    subtle: { default: neutral[700] }, // #666666
    muted: { default: neutral[500] }, // #999999
    disabled: { default: neutral[400] }, // #C7C7C7
    inverse: { default: neutral["00"] }, // #FFFFFF
    brand: {
      default: semantic.primary.main, // #2B96ED
      strong: semantic.primary.pressed, // #1B65BA — Figma Bright Blue 800
    },
    status: {
      success: green[400], // #00A07C
      error: red[500], // #F13F00
      caution: semantic.caution.text, // #FFA100
      info: semantic.primary.hover, // #017EE4
    },
  },
  buttonBg: {
    default: semantic.primary.main, // #2B96ED
    hover: semantic.primary.hover, // #017EE4
    pressed: brightBlue700, // #0E71CF
    disabled: neutral[300], // #D8D8D8
    secondary: {
      default: semantic.primary.bgLighter, // #F1F8FD
      hover: semantic.primary.bg, // #E3F2FC
      disabled: coolGray[200], // #E6E7EB
    },
    outlined: {
      default: neutral["00"], // #FFFFFF
      hover: semantic.primary.bgLighter, // #F1F8FD
      disabled: neutral["00"], // #FFFFFF
    },
  },
  buttonText: {
    default: neutral["00"], // #FFFFFF
    brand: semantic.primary.main, // #2B96ED
    disabled: neutral[500], // #999999
  },
  buttonBorder: {
    outlined: {
      default: semantic.primary.main, // #2B96ED
      hover: semantic.primary.main, // #2B96ED
      disabled: coolGray[400], // #9CA2AE
    },
    assistive: {
      default: neutral[300], // #D8D8D8
      disabled: neutral[200], // #ECECEC
    },
  },
  /**
   * Figma `Section_Icon` (227:2). 8 roles · 단일 variant(default).
   * 단독 배치된 아이콘 컬러는 hex 직접 지정 대신 본 토큰(`--eap-icon-*`)을 사용한다.
   */
  icon: {
    strong: { default: neutral[800] }, // #383838 ← Neutral · 800
    normal: { default: neutral[700] }, // #666666 ← Figma Neutral · 600
    disabled: { default: neutral[400] }, // #C7C7C7 ← Figma Neutral · 200
    inverse: { default: neutral["00"] }, // #FFFFFF ← Neutral · 00 (white)
    brand: { default: semantic.primary.main }, // #2B96ED ← Atomic/Bright Blue · 500
    status: {
      success: green[300], // #13BFA2 ← Atomic/Green · 500
      error: red[500], // #F13F00 ← Atomic/Orange Red · 500
      caution: yellow[500], // #FFC303 ← Golden Yellow · 500
    },
  },
  border: {
    normal: { default: neutral[300] }, // #D8D8D8
    strong: { default: neutral[500] }, // #999999
    subtle: { default: neutral[200] }, // #ECECEC
    focus: { default: semantic.primary.main }, // #2B96ED
    brand: {
      default: semantic.primary.main, // #2B96ED
      disabled: coolGray[400], // #9CA2AE
    },
    disabled: { default: neutral[200] }, // #ECECEC
    status: {
      error: red[500], // #F13F00
      caution: yellow[500], // #FFC303
    },
  },
  fill: {
    brand: {
      default: semantic.primary.main, // #2B96ED
      hover: semantic.primary.hover, // #017EE4
      pressed: brightBlue700, // #0E71CF
      disabled: neutral[300], // #D8D8D8
    },
    neutral: {
      default: neutral[800], // #383838
      subtle: neutral[100], // #F5F5F5
    },
    inverse: { default: neutral["00"] }, // #FFFFFF
    status: {
      error: red[500], // #F13F00
      caution: yellow[500], // #FFC303
    },
  },
  /**
   * Figma `Section_Input` (294:12).
   * `--eap-input-bg`/`--eap-input-placeholder`는 suffix 없이 emit되도록
   * 다른 그룹과 달리 flat camelCase 구조 사용.
   * `helpertext*`는 Figma CSS 변수 표기(`--eap-input-helpertext-*`)에 맞춰
   * 한 단어로 유지.
   */
  input: {
    bg: neutral["00"], // #FFFFFF — --eap-input-bg
    bgDisabled: neutral[50], // #FAFAFA — --eap-input-bg-disabled
    borderDefault: neutral[300], // #D8D8D8 — --eap-input-border-default
    borderHover: neutral[400], // #C7C7C7 — --eap-input-border-hover
    borderFocus: semantic.primary.main, // #2B96ED — --eap-input-border-focus
    borderError: red[500], // #F13F00 — --eap-input-border-error
    borderDisabled: neutral[300], // #D8D8D8 — --eap-input-border-disabled
    placeholder: neutral[500], // #999999 — --eap-input-placeholder
    helpertextDefault: neutral[500], // #999999 ← Text/Muted/Default
    helpertextSuccess: semantic.primary.main, // #2B96ED ← Text/Brand/Default
    helpertextError: red[500], // #F13F00 ← Text/Status/Error
    helpertextDisabled: neutral[400], // #C7C7C7 ← Text/Disabled/Default
  },
} as const;

export type EapTokens = typeof eap;
