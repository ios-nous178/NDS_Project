// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

export const fontFamily = {
  web: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  system: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export type TypeStyle = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export const typeScale = {
  display1: { fontSize: 52, lineHeight: 74, letterSpacing: 0 },
  display2: { fontSize: 48, lineHeight: 62, letterSpacing: 0 },
  display3: { fontSize: 40, lineHeight: 52, letterSpacing: 0 },
  headline1: { fontSize: 36, lineHeight: 48, letterSpacing: 0 },
  headline2: { fontSize: 28, lineHeight: 38, letterSpacing: 0 },
  headline3: { fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  headline4: { fontSize: 20, lineHeight: 28, letterSpacing: 0 },
  headline5: { fontSize: 18, lineHeight: 26, letterSpacing: 0 },
  body1: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  body2: { fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  body3: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  caption1: { fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  caption2: { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  label: { fontSize: 11, lineHeight: 14, letterSpacing: 0 },
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  typeScale,
} as const;
