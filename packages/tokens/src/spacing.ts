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
  tight: 4,
  default: 10,
  comfortable: 12,
  loose: 16,
  wide: 24,
  label: 8,
} as const;

export const gapTitle = {
  h1: 12,
  h2: 12,
  h3: 12,
  h4: 6,
  h5: 8,
} as const;

export const inset = {
  chip: 8,
  input: 12,
  card: 16,
  "card-large": 20,
  modal: 24,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 9999,
} as const;

export const shape = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 9999,
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
    mini: 32,
    field: 48,
  },
  tabs: {
    line: {
      mobile: 50,
      pc: 56,
    },
    chip: {
      mobile: 36,
      pc: 44,
    },
    segment: {
      pc: 56,
    },
  },
  appBar: {
    height: 52,
  },
  bottomBar: {
    height: 56,
  },
  input: {
    default: 48,
    field: 48,
    compact: 40,
  },
  fieldWidth: {
    xs: 120,
    sm: 200,
    md: 304,
    lg: 400,
    xl: 488,
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
