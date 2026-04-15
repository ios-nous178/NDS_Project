// Spacing Tokens — Figma 팝업/컴포넌트 레드라인 실측 기반

export const spacing = {
  0: 0,
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
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  30: 30,
  33: 33,
  36: 36,
  48: 48,
  64: 64,
  80: 80,
} as const;

export const radius = {
  none: 0,
  xs: 6, // ⚠️ Figma 실측 (Badge) — 기존 토큰 누락
  sm: 4,
  md: 8, // 기본값: Button, Input, Modal 등 거의 모든 컴포넌트
  lg: 12,
  pill: 9999, // Toggle track, full-round
} as const;

export const borderWidth = {
  none: 0,
  default: 1,
} as const;

export const sizing = {
  icon: {
    xs: 16,
    default: 24,
    sm: 20, // ⚠️ Figma 실측 (SearchInput clear 아이콘) — 기존 토큰 누락
  },
  button: {
    xl: 56, // ⚠️ Figma 실측 (Button xl) — 기존 토큰 누락
    lg: 48,
    md: 44,
    sm: 42,
    xs: 38,
    field: 48,
  },
  tabs: {
    line: 50, // ⚠️ Figma 실측 (Tabs line trigger) — 기존 토큰 누락
    pill: 35, // ⚠️ Figma 실측 (Tabs pill trigger) — 기존 토큰 누락
    square: 36, // ⚠️ Figma 실측 (Tabs square trigger) — 기존 토큰 누락
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
