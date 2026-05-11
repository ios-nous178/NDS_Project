// Auto-generated from DESIGN.md — do not edit manually
// Run `pnpm generate:tokens` to regenerate

export const neutral = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#ECECEC",
  300: "#D8D8D8",
  400: "#C7C7C7",
  500: "#999999",
  600: "#777777",
  700: "#666666",
  800: "#383838",
  900: "#111111",
  1000: "#000000",
  "00": "#FFFFFF",
} as const;

export const coolGray = {
  50: "#F8F9FB",
  100: "#F3F4F6",
  200: "#E6E7EB",
  300: "#D2D5D9",
  400: "#9CA2AE",
  500: "#6C7280",
  600: "#4E5462",
} as const;

export const blue = {
  10: "#F8FCFE",
  25: "#EAF6FD",
  50: "#E1F2FC",
  100: "#B6DDF9",
  200: "#87C9F6",
  300: "#53B2F3",
  400: "#1AA3F2",
  500: "#0094F0",
  600: "#0086E3",
  700: "#0074D0",
  800: "#0063BF",
  900: "#0046A0",
} as const;

export const magenta = {
  50: "#FDF1F5",
  100: "#FCE3EC",
  200: "#F8B8CF",
  300: "#F15890",
  500: "#ED2E77",
  600: "#D9005C",
  800: "#C30058",
} as const;

export const yellow = {
  50: "#FFFAE8",
  100: "#FFEDB3",
  200: "#FFE282",
  300: "#FFD84F",
  400: "#FFCD27",
  500: "#FFC303",
} as const;

export const red = {
  50: "#FEE9E6",
  100: "#FFA98C",
  200: "#FF875D",
  400: "#FF4E0C",
  500: "#F13F00",
  700: "#E33800",
  800: "#CB2700",
} as const;

export const green = {
  50: "#E5F7F4",
  100: "#AAE3D7",
  200: "#6FD2BD",
  300: "#13BFA2",
  400: "#00A07C",
  500: "#008260",
} as const;

export const semantic = {
  primary: {
    main: "#2B96ED",
    hover: "#017EE4",
    pressed: "#1B65BA",
    lighter: "#91CAF6",
    bg: "#E3F2FC",
    bgLighter: "#F1F8FD",
    fg: neutral["00"],
  },
  secondary: {
    sub: magenta[500],
    lighter: magenta[200],
    bg: magenta[100],
    bgLighter: magenta[50],
  },
  error: {
    main: red[500],
    bg: red[50],
  },
  caution: {
    main: yellow[500],
    text: "#FFA100",
    bg: yellow[50],
  },
  success: {
    main: green[300],
    bg: green[50],
  },
  text: {
    strong: neutral[1000],
    normal: neutral[900],
    default: neutral[800],
    subtle: neutral[700],
    disabled: neutral[500],
    placeholder: neutral[500],
    inverse: neutral["00"],
  },
  bg: {
    white: neutral["00"],
    light: neutral[50],
    coolGray: coolGray[100],
    coolGrayLighter: coolGray[50],
    disabled: neutral[200],
    overlay: "rgba(0,0,0,0.5)",
  },
  border: {
    default: neutral[300],
    light: neutral[200],
    focus: "#2B96ED",
    disabled: neutral[200],
  },
  icon: {
    default: neutral[800],
    subtle: neutral[500],
    inverse: neutral["00"],
  },
} as const;

export const colors = {
  neutral,
  coolGray,
  blue,
  magenta,
  yellow,
  red,
  green,
  semantic,
} as const;
