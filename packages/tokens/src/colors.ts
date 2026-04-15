// Color Tokens — Figma Design Guide (430:4212) 실측 기반

export const neutral = {
  1000: "#000000",
  900: "#111111",
  800: "#383838",
  700: "#666666",
  600: "#777777",
  500: "#999999",
  400: "#C7C7C7",
  300: "#D8D8D8",
  200: "#ECECEC",
  100: "#F5F5F5",
  50: "#FAFAFA",
  "00": "#FFFFFF",
} as const;

export const coolGray = {
  600: "#4E5462",
  500: "#6C7280",
  400: "#9CA2AE",
  300: "#D2D5D9",
  200: "#E6E7EB",
  100: "#F3F4F6",
  50: "#F8F9FB",
} as const;

export const blue = {
  800: "#1B65BA",
  600: "#017EE4",
  500: "#2B96ED",
  400: "#47A5F0",
  300: "#67B5F2",
  200: "#91CAF6",
  100: "#E3F2FC",
  50: "#F1F8FD",
} as const;

export const magenta = {
  800: "#C30058",
  600: "#EA005F",
  500: "#ED2E77",
  300: "#F15890",
  200: "#F8B8CF",
  100: "#FCE3EC",
  50: "#FDF1F5",
} as const;

export const yellow = {
  600: "#FFA100",
  500: "#FFC303",
  400: "#FFC303", // ⚠️ Figma 실측: 500과 동일 — 디자이너 확인 필요
  300: "#FFD84F",
  200: "#FFE282",
  100: "#FFEDB3",
  50: "#FFFAE8",
} as const;

export const red = {
  500: "#F13F00",
  50: "#FEE9E6",
} as const;

export const green = {
  500: "#00A07C",
  400: "#00B08F",
  300: "#13BFA2",
  200: "#6FD2BD",
  100: "#AAE3D7",
  50: "#E5F7F4",
} as const;

/** Semantic color aliases */
export const semantic = {
  primary: {
    main: blue[500],
    hover: blue[600],
    pressed: blue[800], // 🆕 Figma 미정의 — 디자이너 확인 필요
    lighter: blue[200],
    bg: blue[100],
    bgLighter: blue[50],
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
    text: yellow[600],
    bg: yellow[50],
  },
  success: {
    main: green[300],
    bg: green[50],
  },
  text: {
    default: neutral[800],
    disabled: neutral[500],
    placeholder: neutral[500],
    subtle: neutral[700],
    inverse: neutral["00"], // 🆕 Figma 미정의 — 어두운 배경 위 흰색 텍스트
  },
  bg: {
    white: neutral["00"],
    light: neutral[50],
    coolGray: coolGray[100],
    coolGrayLighter: coolGray[50],
    disabled: neutral[200], // 🆕 Figma 미정의 — 디자이너 확인 필요
    overlay: "rgba(0, 0, 0, 0.5)", // 🆕 Figma 실측 (Modal/Popup 배경 딤)
  },
  border: {
    default: neutral[300],
    light: neutral[200],
    focus: blue[500],
    disabled: neutral[200], // ���� Figma 미정의 — 디자이너 확인 필요
  },
  icon: {
    default: neutral[800], // 🆕 Figma 미정의 — 일반 아이콘
    subtle: neutral[500], // 🆕 Figma 미정의 — 보조 아이콘 (close, clear 등)
    inverse: neutral["00"], // 🆕 Figma 미정의 — 어두운 배경 위 아이콘
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
