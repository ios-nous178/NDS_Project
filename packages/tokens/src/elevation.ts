// Elevation Tokens — 컴포넌트 실측 + 추가 정의

/** Box shadow tokens */
export const shadow = {
  /** 카드, 드롭다운 등 가벼운 그림자 — 🆕 Figma 미정의 */
  sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
  /** Modal 실측값 — ✅ Figma 실측 (Modal) */
  md: "0 4px 12px rgba(0, 0, 0, 0.15)",
  /** Popup 실측값 — ✅ Figma 실측 (Popup) */
  lg: "0 11px 15px -7px rgba(0, 0, 0, 0.2)",
  /** BottomSheet 실측값 — ✅ Figma 실측 (BottomSheet 상방 그림자) */
  up: "0 -4px 12px rgba(0, 0, 0, 0.1)",
  none: "none",
} as const;

/** Z-index layering tokens — 🆕 Figma 미정의 (컴포넌트 실측 기반 정리) */
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  appBar: 300,
  modal: 1000, // ✅ 컴포넌트 실측 (Modal)
  popup: 1100, // ✅ 컴포넌트 실측 (Popup)
  toast: 1200,
} as const;

export const elevation = {
  shadow,
  zIndex,
} as const;
