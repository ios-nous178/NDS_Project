// Motion Tokens — 컴포넌트 실측 기반

/** Transition duration (ms) */
export const duration = {
  fast: 150, // 🆕 Figma 미정의
  default: 200, // ✅ 컴포넌트 실측 (전 컴포넌트 공통)
  slow: 300, // ✅ 컴포넌트 실측 (Tabs indicator)
} as const;

/** Easing functions */
export const easing = {
  default: "ease",
  easeOut: "ease-out", // ✅ 컴포넌트 실측 (Modal/Popup/BottomSheet 애니메이션)
} as const;

/** Pre-composed transition shorthand */
export const transition = {
  default: `${duration.default}ms ${easing.default}`,
  slow: `${duration.slow}ms ${easing.default}`,
} as const;

export const motion = {
  duration,
  easing,
  transition,
} as const;
