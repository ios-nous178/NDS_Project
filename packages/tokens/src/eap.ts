/**
 * NudgeEAP 전용 시멘틱 매핑 레이어 (`--eap-*`)
 *
 * Figma 라이브러리(SemanticColorGuide, 68 tokens · 8 roles)와 1:1 매핑되는
 * 컴포넌트 역할 기반 토큰. 기존 atomic 팔레트(colors.ts) 및 NudgeEAP semantic
 * 토큰을 alias로 참조하며, Figma에서만 등장하는 값은 hex literal로 직접 지정.
 *
 * - 출처: figma.com/design/MqR7O3uvBvH5tVngwzbqGH (node 222:2 + Input 섹션 294:12)
 * - CSS 변수 컨벤션: `--eap-{group}-{role}-{variant}` 또는 `--eap-{group}-{variant}`
 *   (예: `--eap-bg-brand-default`, `--eap-button-bg-pressed`, `--eap-input-bg`)
 * - 적용 범위: NudgeEAP 브랜드 한정. Trost/Moneple은 자체 brand CSS만 사용.
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

/** `var(--eap-*)` 참조 헬퍼 — runtime에서 CSS 변수로 컴포넌트에 주입 */
const v = (name: string) => `var(${name})`;

export const eapVar = {
  bg: {
    page: { default: v("--eap-bg-page-default") },
    surface: {
      default: v("--eap-bg-surface-default"),
      subtle: v("--eap-bg-surface-subtle"),
    },
    section: { default: v("--eap-bg-section-default") },
    brand: {
      default: v("--eap-bg-brand-default"),
      subtle: v("--eap-bg-brand-subtle"),
    },
    inverse: { default: v("--eap-bg-inverse-default") },
    status: {
      error: v("--eap-bg-status-error"),
      success: v("--eap-bg-status-success"),
      info: v("--eap-bg-status-info"),
      caution: v("--eap-bg-status-caution"),
    },
  },
  text: {
    strong: { default: v("--eap-text-strong-default") },
    normal: { default: v("--eap-text-normal-default") },
    subtle: { default: v("--eap-text-subtle-default") },
    muted: { default: v("--eap-text-muted-default") },
    disabled: { default: v("--eap-text-disabled-default") },
    inverse: { default: v("--eap-text-inverse-default") },
    brand: {
      default: v("--eap-text-brand-default"),
      strong: v("--eap-text-brand-strong"),
    },
    status: {
      success: v("--eap-text-status-success"),
      error: v("--eap-text-status-error"),
      caution: v("--eap-text-status-caution"),
      info: v("--eap-text-status-info"),
    },
  },
  buttonBg: {
    default: v("--eap-button-bg-default"),
    hover: v("--eap-button-bg-hover"),
    pressed: v("--eap-button-bg-pressed"),
    disabled: v("--eap-button-bg-disabled"),
    secondary: {
      default: v("--eap-button-bg-secondary-default"),
      hover: v("--eap-button-bg-secondary-hover"),
      disabled: v("--eap-button-bg-secondary-disabled"),
    },
    outlined: {
      default: v("--eap-button-bg-outlined-default"),
      hover: v("--eap-button-bg-outlined-hover"),
      disabled: v("--eap-button-bg-outlined-disabled"),
    },
  },
  buttonText: {
    default: v("--eap-button-text-default"),
    brand: v("--eap-button-text-brand"),
    disabled: v("--eap-button-text-disabled"),
  },
  buttonBorder: {
    outlined: {
      default: v("--eap-button-border-outlined-default"),
      hover: v("--eap-button-border-outlined-hover"),
      disabled: v("--eap-button-border-outlined-disabled"),
    },
    assistive: {
      default: v("--eap-button-border-assistive-default"),
      disabled: v("--eap-button-border-assistive-disabled"),
    },
  },
  icon: {
    strong: { default: v("--eap-icon-strong-default") },
    normal: { default: v("--eap-icon-normal-default") },
    disabled: { default: v("--eap-icon-disabled-default") },
    inverse: { default: v("--eap-icon-inverse-default") },
    brand: { default: v("--eap-icon-brand-default") },
    status: {
      success: v("--eap-icon-status-success"),
      error: v("--eap-icon-status-error"),
      caution: v("--eap-icon-status-caution"),
    },
  },
  border: {
    normal: { default: v("--eap-border-normal-default") },
    strong: { default: v("--eap-border-strong-default") },
    subtle: { default: v("--eap-border-subtle-default") },
    focus: { default: v("--eap-border-focus-default") },
    brand: {
      default: v("--eap-border-brand-default"),
      disabled: v("--eap-border-brand-disabled"),
    },
    disabled: { default: v("--eap-border-disabled-default") },
    status: {
      error: v("--eap-border-status-error"),
      caution: v("--eap-border-status-caution"),
    },
  },
  fill: {
    brand: {
      default: v("--eap-fill-brand-default"),
      hover: v("--eap-fill-brand-hover"),
      pressed: v("--eap-fill-brand-pressed"),
      disabled: v("--eap-fill-brand-disabled"),
    },
    neutral: {
      default: v("--eap-fill-neutral-default"),
      subtle: v("--eap-fill-neutral-subtle"),
    },
    inverse: { default: v("--eap-fill-inverse-default") },
    status: {
      error: v("--eap-fill-status-error"),
      caution: v("--eap-fill-status-caution"),
    },
  },
  input: {
    bg: v("--eap-input-bg"),
    bgDisabled: v("--eap-input-bg-disabled"),
    borderDefault: v("--eap-input-border-default"),
    borderHover: v("--eap-input-border-hover"),
    borderFocus: v("--eap-input-border-focus"),
    borderError: v("--eap-input-border-error"),
    borderDisabled: v("--eap-input-border-disabled"),
    placeholder: v("--eap-input-placeholder"),
    helpertextDefault: v("--eap-input-helpertext-default"),
    helpertextSuccess: v("--eap-input-helpertext-success"),
    helpertextError: v("--eap-input-helpertext-error"),
    helpertextDisabled: v("--eap-input-helpertext-disabled"),
  },
} as const;

export type EapTokens = typeof eap;
export type EapVarRef = typeof eapVar;
