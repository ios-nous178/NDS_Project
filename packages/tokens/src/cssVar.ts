// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

const v = (name: string) => `var(${name})`;

export const cv = {
  primary: {
    main: v("--color-semantic-primary-main"),
    hover: v("--color-semantic-primary-hover"),
    pressed: v("--color-semantic-primary-pressed"),
    lighter: v("--color-semantic-primary-lighter"),
    bg: v("--color-semantic-primary-bg"),
    bgLighter: v("--color-semantic-primary-bgLighter"),
    fg: v("--color-semantic-primary-fg"),
  },
  secondary: {
    sub: v("--color-semantic-secondary-sub"),
    lighter: v("--color-semantic-secondary-lighter"),
    bg: v("--color-semantic-secondary-bg"),
    bgLighter: v("--color-semantic-secondary-bgLighter"),
  },
  error: {
    main: v("--color-semantic-error-main"),
    bg: v("--color-semantic-error-bg"),
  },
  caution: {
    main: v("--color-semantic-caution-main"),
    text: v("--color-semantic-caution-text"),
    bg: v("--color-semantic-caution-bg"),
  },
  success: {
    main: v("--color-semantic-success-main"),
    bg: v("--color-semantic-success-bg"),
  },
  text: {
    strong: v("--color-semantic-text-strong"),
    normal: v("--color-semantic-text-normal"),
    default: v("--color-semantic-text-default"),
    subtle: v("--color-semantic-text-subtle"),
    disabled: v("--color-semantic-text-disabled"),
    placeholder: v("--color-semantic-text-placeholder"),
    inverse: v("--color-semantic-text-inverse"),
  },
  bg: {
    white: v("--color-semantic-bg-white"),
    light: v("--color-semantic-bg-light"),
    coolGray: v("--color-semantic-bg-coolGray"),
    coolGrayLighter: v("--color-semantic-bg-coolGrayLighter"),
    disabled: v("--color-semantic-bg-disabled"),
    overlay: v("--color-semantic-bg-overlay"),
  },
  border: {
    default: v("--color-semantic-border-default"),
    light: v("--color-semantic-border-light"),
    focus: v("--color-semantic-border-focus"),
    disabled: v("--color-semantic-border-disabled"),
  },
  icon: {
    default: v("--color-semantic-icon-default"),
    subtle: v("--color-semantic-icon-subtle"),
    inverse: v("--color-semantic-icon-inverse"),
  },
  status: {
    default: v("--color-semantic-status-default"),
    success: v("--color-semantic-status-success"),
    error: v("--color-semantic-status-error"),
  },
} as const;

export type CssVarRef = typeof cv;
