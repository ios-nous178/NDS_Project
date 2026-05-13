// Semantic color CSS variable references.
// `--semantic-*` 단일 namespace로 통일된 시멘틱 토큰 진입점.
//
// 1) Palette-style 그룹 (primary/secondary/error/caution/success/text/bg/border/icon/status)
//    - DESIGN.md `colors` 섹션의 값을 alias.
// 2) Role-based 그룹 (surface/bgRole/textRole/iconRole/borderRole/button/fill/input)
//    - 구 `--eap-*` 트리를 흡수. 컴포넌트 역할 기반 시멘틱.
//
// 두 그룹 모두 같은 CSS namespace(`--semantic-*`)에 emit 된다.
// generate-css.js 가 `colors.semantic` + role 트리(`./eap.ts`의 `eap` 객체)를 합쳐 출력.

const v = (name: string) => `var(${name})`;

export const cv = {
  // ── Palette groups (legacy cv shape) ─────────────────────
  primary: {
    main: v("--semantic-primary-main"),
    hover: v("--semantic-primary-hover"),
    pressed: v("--semantic-primary-pressed"),
    lighter: v("--semantic-primary-lighter"),
    bg: v("--semantic-primary-bg"),
    bgLighter: v("--semantic-primary-bgLighter"),
    fg: v("--semantic-primary-fg"),
  },
  secondary: {
    sub: v("--semantic-secondary-sub"),
    lighter: v("--semantic-secondary-lighter"),
    bg: v("--semantic-secondary-bg"),
    bgLighter: v("--semantic-secondary-bgLighter"),
  },
  error: {
    main: v("--semantic-error-main"),
    bg: v("--semantic-error-bg"),
  },
  caution: {
    main: v("--semantic-caution-main"),
    text: v("--semantic-caution-text"),
    bg: v("--semantic-caution-bg"),
  },
  success: {
    main: v("--semantic-success-main"),
    bg: v("--semantic-success-bg"),
  },
  text: {
    strong: v("--semantic-text-strong"),
    normal: v("--semantic-text-normal"),
    default: v("--semantic-text-default"),
    subtle: v("--semantic-text-subtle"),
    disabled: v("--semantic-text-disabled"),
    placeholder: v("--semantic-text-placeholder"),
    inverse: v("--semantic-text-inverse"),
  },
  bg: {
    white: v("--semantic-bg-white"),
    light: v("--semantic-bg-light"),
    coolGray: v("--semantic-bg-coolGray"),
    coolGrayLighter: v("--semantic-bg-coolGrayLighter"),
    disabled: v("--semantic-bg-disabled"),
    overlay: v("--semantic-bg-overlay"),
  },
  border: {
    default: v("--semantic-border-default"),
    light: v("--semantic-border-light"),
    focus: v("--semantic-border-focus"),
    disabled: v("--semantic-border-disabled"),
  },
  icon: {
    default: v("--semantic-icon-default"),
    subtle: v("--semantic-icon-subtle"),
    inverse: v("--semantic-icon-inverse"),
  },
  status: {
    default: v("--semantic-status-default"),
    success: v("--semantic-status-success"),
    error: v("--semantic-status-error"),
  },

  // ── Role groups (merged from former --eap-* tree) ────────
  surface: {
    page: v("--semantic-bg-page-default"),
    default: v("--semantic-bg-surface-default"),
    subtle: v("--semantic-bg-surface-subtle"),
    section: v("--semantic-bg-section-default"),
    brand: v("--semantic-bg-brand-default"),
    brandSubtle: v("--semantic-bg-brand-subtle"),
    inverse: v("--semantic-bg-inverse-default"),
    statusError: v("--semantic-bg-status-error"),
    statusSuccess: v("--semantic-bg-status-success"),
    statusInfo: v("--semantic-bg-status-info"),
    statusCaution: v("--semantic-bg-status-caution"),
  },
  textRole: {
    strong: v("--semantic-text-strong-default"),
    normal: v("--semantic-text-normal-default"),
    subtle: v("--semantic-text-subtle-default"),
    muted: v("--semantic-text-muted-default"),
    disabled: v("--semantic-text-disabled-default"),
    inverse: v("--semantic-text-inverse-default"),
    brand: v("--semantic-text-brand-default"),
    brandStrong: v("--semantic-text-brand-strong"),
    statusSuccess: v("--semantic-text-status-success"),
    statusError: v("--semantic-text-status-error"),
    statusCaution: v("--semantic-text-status-caution"),
    statusInfo: v("--semantic-text-status-info"),
  },
  iconRole: {
    strong: v("--semantic-icon-strong-default"),
    normal: v("--semantic-icon-normal-default"),
    disabled: v("--semantic-icon-disabled-default"),
    inverse: v("--semantic-icon-inverse-default"),
    brand: v("--semantic-icon-brand-default"),
    statusSuccess: v("--semantic-icon-status-success"),
    statusError: v("--semantic-icon-status-error"),
    statusCaution: v("--semantic-icon-status-caution"),
  },
  borderRole: {
    normal: v("--semantic-border-normal-default"),
    strong: v("--semantic-border-strong-default"),
    subtle: v("--semantic-border-subtle-default"),
    focus: v("--semantic-border-focus-default"),
    brand: v("--semantic-border-brand-default"),
    brandDisabled: v("--semantic-border-brand-disabled"),
    disabled: v("--semantic-border-disabled-default"),
    statusError: v("--semantic-border-status-error"),
    statusCaution: v("--semantic-border-status-caution"),
  },
  button: {
    bgDefault: v("--semantic-button-bg-default"),
    bgHover: v("--semantic-button-bg-hover"),
    bgPressed: v("--semantic-button-bg-pressed"),
    bgDisabled: v("--semantic-button-bg-disabled"),
    bgSecondary: v("--semantic-button-bg-secondary-default"),
    bgSecondaryHover: v("--semantic-button-bg-secondary-hover"),
    bgSecondaryDisabled: v("--semantic-button-bg-secondary-disabled"),
    bgOutlined: v("--semantic-button-bg-outlined-default"),
    bgOutlinedHover: v("--semantic-button-bg-outlined-hover"),
    bgOutlinedDisabled: v("--semantic-button-bg-outlined-disabled"),
    textDefault: v("--semantic-button-text-default"),
    textBrand: v("--semantic-button-text-brand"),
    textDisabled: v("--semantic-button-text-disabled"),
    borderOutlined: v("--semantic-button-border-outlined-default"),
    borderOutlinedHover: v("--semantic-button-border-outlined-hover"),
    borderOutlinedDisabled: v("--semantic-button-border-outlined-disabled"),
    borderAssistive: v("--semantic-button-border-assistive-default"),
    borderAssistiveDisabled: v("--semantic-button-border-assistive-disabled"),
  },
  fill: {
    brand: v("--semantic-fill-brand-default"),
    brandHover: v("--semantic-fill-brand-hover"),
    brandPressed: v("--semantic-fill-brand-pressed"),
    brandDisabled: v("--semantic-fill-brand-disabled"),
    neutral: v("--semantic-fill-neutral-default"),
    neutralSubtle: v("--semantic-fill-neutral-subtle"),
    inverse: v("--semantic-fill-inverse-default"),
    statusError: v("--semantic-fill-status-error"),
    statusCaution: v("--semantic-fill-status-caution"),
  },
  input: {
    bg: v("--semantic-input-bg"),
    bgDisabled: v("--semantic-input-bg-disabled"),
    borderDefault: v("--semantic-input-border-default"),
    borderHover: v("--semantic-input-border-hover"),
    borderFocus: v("--semantic-input-border-focus"),
    borderError: v("--semantic-input-border-error"),
    borderDisabled: v("--semantic-input-border-disabled"),
    placeholder: v("--semantic-input-placeholder"),
    helpertextDefault: v("--semantic-input-helpertext-default"),
    helpertextSuccess: v("--semantic-input-helpertext-success"),
    helpertextError: v("--semantic-input-helpertext-error"),
    helpertextDisabled: v("--semantic-input-helpertext-disabled"),
  },
} as const;

export type CssVarRef = typeof cv;
