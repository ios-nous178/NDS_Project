// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

export const shadow = {
  sm: "0 1px 3px rgba(0,0,0,0.1)",
  md: "0 4px 12px rgba(0,0,0,0.15)",
  lg: "0 11px 15px -7px rgba(0,0,0,0.2)",
  up: "0 -4px 12px rgba(0,0,0,0.1)",
  none: "none",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  appBar: 300,
  modal: 1000,
  popup: 1100,
  toast: 1200,
} as const;

export const elevation = {
  shadow,
  zIndex,
} as const;
