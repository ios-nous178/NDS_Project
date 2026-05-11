/**
 * Moneple Brand Theme
 *
 * Moneple is a multi-tenant community surface. These defaults mirror the
 * Moneple05 community-home mockup and can be overridden by tenant CSS vars.
 */

import type { BrandTheme } from "./types";

// ─── Moneple05 Community Palette ───────────────────────

export const monepleYellow = {
  primary: "#FFF42E",
  hover: "#FFE52E",
  pressed: "#E6D200",
  bg: "#FFFCE4",
  light: "#FFF8B8",
  border: "#FFE52E",
} as const;

export const monepleCobalt = {
  500: "#4968FF",
  300: "#A3B3FF",
  100: "#EDF0FF",
  50: "#F6F7FF",
} as const;

export const moneplePink = {
  500: "#F93E67",
  300: "#FFC1CE",
  100: "#FEECF0",
  50: "#FFF5F7",
} as const;

export const monepleNeutral = {
  1000: "#000000",
  900: "#151515",
  800: "#333333",
  700: "#666666",
  600: "#696868",
  500: "#918F8F",
  450: "#999999",
  400: "#BBBBBB",
  300: "#DDDDDD",
  250: "#E5E5E5",
  200: "#EDEDED",
  150: "#F4F4F4",
  100: "#F5F5F5",
  80: "#FAFAFA",
  "cool-100": "#F4F5F7",
  "00": "#FFFFFF",
} as const;

export const monepleLegacyNeutral = {
  1000: "#000000",
  800: "#333333",
  700: "#606060",
  500: "#979797",
  400: "#C7C7C7",
  300: "#D8D8D8",
  200: "#E5E5E5",
  150: "#F2F2F2",
  100: "#F6F6F6",
  "cool-100": "#F4F5F7",
  "00": "#FFFFFF",
} as const;

export const monepleStatus = {
  error: "#FF4111",
  blue: "#2C91FF",
  green: "#00BC78",
  orange: "#FF9D00",
} as const;

export const monepleSemantic = {
  primary: {
    main: monepleYellow.primary,
    hover: monepleYellow.hover,
    pressed: monepleYellow.pressed,
    lighter: monepleYellow.light,
    bg: monepleYellow.bg,
    bgLighter: monepleYellow.bg,
    fg: monepleNeutral[800],
  },
  secondary: {
    sub: monepleCobalt[500],
    lighter: monepleCobalt[300],
    bg: monepleCobalt[100],
    bgLighter: monepleCobalt[50],
  },
  error: {
    main: monepleStatus.error,
    bg: "#FEE9E6",
  },
  caution: {
    main: monepleStatus.orange,
    text: monepleStatus.orange,
    bg: "#FFF8E6",
  },
  success: {
    main: monepleStatus.green,
    bg: "#E6F9F2",
  },
  text: {
    strong: monepleNeutral[1000],
    normal: monepleNeutral[800],
    default: monepleNeutral[800],
    disabled: monepleNeutral[400],
    placeholder: monepleNeutral[450],
    subtle: monepleNeutral[700],
    inverse: monepleNeutral["00"],
  },
  bg: {
    white: monepleNeutral["00"],
    light: monepleNeutral[100],
    coolGray: monepleNeutral[150],
    coolGrayLighter: monepleNeutral[150],
    disabled: monepleNeutral[200],
    overlay: "rgba(0, 0, 0, 0.5)",
  },
  border: {
    default: monepleNeutral[200],
    light: monepleNeutral[150],
    focus: monepleCobalt[500],
    disabled: monepleNeutral[200],
  },
  icon: {
    default: monepleNeutral[800],
    subtle: monepleNeutral[450],
    inverse: monepleNeutral["00"],
  },
} as const;

// ─── Brand Theme ────────────────────────────────────────

export const monepleTheme: BrandTheme = {
  name: "moneple",
  palette: {
    yellow: monepleYellow,
    cobalt: monepleCobalt,
    pink: moneplePink,
    neutral: monepleNeutral,
    legacyNeutral: monepleLegacyNeutral,
    status: monepleStatus,
  },
  semantic: monepleSemantic,
  typography: {
    fontFamily: {
      web: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",
      system: "system-ui, -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif",
    },
    typeScale: {
      headline1: { fontSize: 26, lineHeight: 38, letterSpacing: 0 },
      headline2: { fontSize: 24, lineHeight: 34, letterSpacing: 0 },
      headline3: { fontSize: 20, lineHeight: 28, letterSpacing: 0 },
      headline4: { fontSize: 18, lineHeight: 26, letterSpacing: 0 },
      headline5: { fontSize: 18, lineHeight: 26, letterSpacing: 0 },
      body1: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
      body2: { fontSize: 15, lineHeight: 22, letterSpacing: 0 },
      body3: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
      caption1: { fontSize: 13, lineHeight: 18, letterSpacing: 0 },
      caption2: { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
      label: { fontSize: 11, lineHeight: 14, letterSpacing: 0 },
    },
  },
  spacing: {
    radius: {
      none: 0,
      xs: 3,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      sheet: 16,
      chip: 20,
      pill: 9999,
    },
  },
  elevation: {
    shadow: {
      sm: "0 0 16px rgba(0, 0, 0, 0.06)",
      md: "0 4px 12px rgba(0, 0, 0, 0.12)",
      lg: "0 8px 24px rgba(0, 0, 0, 0.16)",
      up: "0 -4px 12px rgba(0, 0, 0, 0.1)",
      none: "none",
    },
    zIndex: {
      base: 0,
      dropdown: 100,
      stickyHeader: 50,
      sidePanel: 200,
      modal: 8000,
      overlay: 9998,
      sheet: 9999,
      toast: 10000,
    },
  },
};
