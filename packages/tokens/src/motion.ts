// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

export const duration = {
  fast: 150,
  default: 200,
  slow: 300,
} as const;

export const easing = {
  default: "ease",
  easeOut: "ease-out",
} as const;

export const transition = {
  default: `${duration.default}ms ${easing.default}`,
  slow: `${duration.slow}ms ${easing.default}`,
} as const;

export const motion = {
  duration,
  easing,
  transition,
} as const;
