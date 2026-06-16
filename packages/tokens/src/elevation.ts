// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

export const shadow = {
  "0": "none",
  1: "0px 1px 4px rgba(0, 0, 0, 0.08)",
  2: "0px 4px 12px rgba(0, 0, 0, 0.10)",
  3: "0px 8px 24px rgba(0, 0, 0, 0.12)",
  e2: "0px 2px 4px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
} as const;

export const elevationLevel = {
  none: shadow["0"],
  subtle: shadow["1"],
  overlay: shadow["2"],
  modal: shadow["3"],
} as const;

export type ShadowLevel = keyof typeof shadow;
export type ElevationLevelName = keyof typeof elevationLevel;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  appBar: 300,
  modal: 1000,
  popup: 1100,
  tooltip: 1400,
  toast: 1500,
} as const;

export const elevation = {
  shadow,
  zIndex,
} as const;
