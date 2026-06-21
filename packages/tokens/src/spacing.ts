// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

import { ref } from "./ref.js";

export const spacing = {
  "0": 0,
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  28: 28,
  30: 30,
  32: 32,
  36: 36,
  40: 40,
  48: 48,
  80: 80,
} as const;

export const gap = {
  tight: ref("spacing.4"),
  default: ref("spacing.10"),
  comfortable: ref("spacing.12"),
  loose: ref("spacing.16"),
  wide: ref("spacing.24"),
  label: ref("spacing.8"),
} as const;

export const gapTitle = {
  h1: ref("spacing.12"),
  h2: ref("spacing.12"),
  h3: ref("spacing.12"),
  h4: ref("spacing.6"),
  h5: ref("spacing.8"),
} as const;

export const inset = {
  chip: ref("spacing.8"),
  input: ref("spacing.12"),
  card: ref("spacing.16"),
  "card-large": ref("spacing.20"),
  modal: ref("spacing.24"),
} as const;

export const radius = {
  2: 2,
  4: 4,
  8: 8,
  10: 10,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  full: 9999,
} as const;

export const stroke = {
  none: 0,
  thin: 1,
  medium: 1.5,
  bold: 2,
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
  listRow: {
    sm: 40,
    md: 56,
    lg: 72,
    xl: 96,
    compactPc: 42,
    tablePc: 64,
    avatarPc: 80,
    thumbnailPc: 106,
    thumbnailMobile: 124,
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
