/**
 * Cashwalk (캐시워크 · 소비자앱) Brand Palette — atomic 색상 스케일.
 *
 * SSOT: Figma 캐시워크 컬러 가이드 (676:3228)
 *
 * families:
 *   - Common      : 00 / 1000          (white · black 절대값)
 *   - Neutral     : 50 ~ 900           (grayscale 10단)
 *   - Primary Yellow : 50 ~ 900        (brand primary, 500 = #FFD200)
 *   - Coral Red   : 50 ~ 900           (error status, 500 = #FF4141 — 가이드 정합)
 *   - Blue        : 50 ~ 900           (info status / system blue)
 *   - Cornflower  : 50 ~ 900           (팀워크 accent)
 *   - Indigo      : 50 ~ 900           (동네산책 accent)
 *   - Green       : 50 ~ 900           (success status)
 *   - Brown       : 50 ~ 900           (캐시워크 로고용 — 시멘틱 매핑 X)
 *
 * cashwalk.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * cashwalk.ts (theme) 가 둘을 묶어 ProjectTheme 로 export.
 */

// ─── Common ─────────────────────────────────────────────
export const cashwalkCommon = {
  "00": "#FFFFFF",
  1000: "#000000",
} as const;

// ─── Neutral ────────────────────────────────────────────
export const cashwalkNeutral = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#EEEEEE",
  300: "#E7E7E7",
  400: "#DDDDDD",
  500: "#BBBBBB",
  600: "#999999",
  700: "#666666",
  800: "#333333",
  900: "#111111",
} as const;

// ─── Primary Yellow ─────────────────────────────────────
export const cashwalkYellow = {
  50: "#FFFEF5",
  100: "#FFFAE5",
  200: "#FFF0AC",
  300: "#FFE673",
  400: "#FFDC39",
  500: "#FFD200",
  600: "#FFC400",
  700: "#FEAF01",
  800: "#FD9B02",
  900: "#FC8703",
} as const;

// ─── Coral Red ──────────────────────────────────────────
export const cashwalkRed = {
  50: "#FFF5F5",
  100: "#FFECEC",
  200: "#FFCDCD",
  300: "#FF9A9A",
  400: "#FF7070",
  500: "#FF4141", // 에러 SSOT — 캐시워크 가이드 정합 (캐포비는 #FC3500)
  600: "#E83030",
  700: "#C42020",
  800: "#A01414",
  900: "#7A0A0A",
} as const;

// ─── Blue ───────────────────────────────────────────────
export const cashwalkBlue = {
  50: "#F5FAFF",
  100: "#E5F2FF",
  200: "#B8DCFF",
  300: "#80BFFF",
  400: "#4BA1FF",
  500: "#007AFF",
  600: "#006FE6",
  700: "#0058B8",
  800: "#00428C",
  900: "#002D60",
} as const;

// ─── Cornflower (팀워크 accent) ─────────────────────────
export const cashwalkCornflower = {
  50: "#F7FAFE",
  100: "#ECF2FE",
  200: "#C9DAFB",
  300: "#9EBCF8",
  400: "#75A0F5",
  500: "#3D79F1",
  600: "#2B6EF7",
  700: "#2C57AE",
  800: "#224385",
  900: "#172E5B",
} as const;

// ─── Indigo (동네산책 accent) ───────────────────────────
export const cashwalkIndigo = {
  50: "#F2F7FF",
  100: "#CED8FD",
  200: "#A9B8FA",
  300: "#8599F8",
  400: "#6079F6",
  500: "#3B45D9",
  600: "#2C34B3", // TODO verify indigo 600/800 from Figma 676:3228
  700: "#1D248C",
  800: "#1D248C", // TODO verify indigo 600/800 from Figma 676:3228
  900: "#0E1366",
} as const;

// ─── Green ──────────────────────────────────────────────
export const cashwalkGreen = {
  50: "#E5F8EE",
  100: "#C7F0D8",
  200: "#8CE0B0",
  300: "#4DD089",
  400: "#1ACC6E",
  500: "#00CC5B",
  600: "#00B350",
  700: "#009240",
  800: "#007030",
  900: "#004D20",
} as const;

// ─── Brown (캐시워크 로고용) ────────────────────────────
// 시멘틱 트리에는 매핑되지 않는다 — 로고 / 프로젝트 라이브러리에서만 사용.
export const cashwalkBrown = {
  50: "#FAF5F4",
  100: "#F2EAE8",
  200: "#DCC9C6",
  300: "#B89F9A",
  400: "#87706B",
  500: "#5E5050",
  600: "#4F4242",
  700: "#403535",
  800: "#312828",
  900: "#221B1B",
} as const;