/**
 * Elevation tokens — Figma 가이드(556:2) 정합
 *
 * 4 Levels (E0 ~ E3). Shadow는 시각 장식이 아닌 "다른 요소 위에 떠있음"을 표현하는 수단입니다.
 * 기본 UI는 Border 기반으로 구성하고, Elevation은 다른 요소 위에 올라가는 경우에만 사용합니다.
 *
 * | Level | Key       | 역할             | 사용처                                     |
 * | ----- | --------- | ---------------- | ------------------------------------------ |
 * | E0    | "0"       | 기본 (Base)      | 페이지, Section, 기본 Card                 |
 * | E1    | "1"       | 부유 (Subtle)    | Card Hover, Sticky Header, Pinned Row      |
 * | E2    | "2"       | 오버레이(Overlay)| Dropdown, Popover, Tooltip, Datepicker     |
 * | E3    | "3"       | 최상위 (Modal)   | Modal, Dialog, Bottom Sheet, Toast         |
 */

export const shadow = {
  "0": "none",
  "1": "0px 1px 4px rgba(0, 0, 0, 0.08)",
  "2": "0px 4px 12px rgba(0, 0, 0, 0.10)",
  "3": "0px 8px 24px rgba(0, 0, 0, 0.12)",
} as const;

/** 의미 기반 alias — 코드 가독성용 */
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
  toast: 1200,
} as const;

export const elevation = {
  shadow,
  zIndex,
} as const;
