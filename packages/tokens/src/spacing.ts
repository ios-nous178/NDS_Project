// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

export const spacing = {
  "0": 0,
  1: 1,
  2: 2,
  4: 4,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  28: 28,
  30: 30,
  32: 32,
  33: 33,
  36: 36,
  40: 40,
  48: 48,
  64: 64,
  80: 80,
} as const;

export const gap = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
} as const;

export const padding = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export const radius = {
  none: 0,
  radius2: 2,
  sm: 4,
  xs: 6,
  md: 8,
  lg: 12,
  radius16: 16,
  radius24: 24,
  full: 9999,
  pill: 9999,
} as const;

export const shape = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

export const borderWidth = {
  none: 0,
  default: 1,
  focus: 2,
} as const;

export const stroke = {
  none: 0,
  default: 1,
  focus: 2,
} as const;

export const sizing = {
  icon: {
    xs: 16,
    sm: 20,
    default: 24,
  },
  button: {
    xl: 52,
    lg: 48,
    md: 44,
    sm: 42,
    xs: 38,
    field: 48,
  },
  tabs: {
    line: 50,
    pill: 35,
    square: 36,
  },
  appBar: {
    height: 52,
  },
  bottomBar: {
    height: 56,
  },
  input: {
    default: 48,
    field: 44,
  },
} as const;

export const grid = {
  mobile: {
    columns: 4,
    margin: 16,
    gutter: 8,
    contentWidth: 328,
  },
  desktop: {
    columns: 12,
    margin: 360,
    minMargin: 40,
    gutter: 24,
    contentWidth: 1200,
  },
} as const;
