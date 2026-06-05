/**
 * CashwalkBiz (캐포비 · 캐시워크 포 비지니스) Brand Palette — atomic 색상 스케일.
 *
 * SSOT: Figma 캐포비 Library / Color - Atomic (3218:458)
 *   https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/캐포비---Library?node-id=3218-458
 *
 * 7 families · 62 swatches:
 *   - Common  : 00 / 1000              (white · black 절대값)
 *   - Neutral : 50 ~ 900               (grayscale 10단)
 *   - Primary Yellow : 50 ~ 900        (brand primary, 500 = #FFD200)
 *   - Coral Red : 50 ~ 900             (error status)
 *   - Blue : 50 ~ 900                  (info status / Apple system blue)
 *   - Green : 50 ~ 900                 (success status)
 *   - Brown : 50 ~ 900                 (캐시워크 로고용 — 시멘틱 매핑 X)
 *
 * cashwalk-biz.semantic.ts 가 이 palette 를 참조해 시멘틱 트리를 만들고,
 * cashwalk-biz.ts (theme) 가 둘을 묶어 BrandTheme 로 export.
 */

// ─── Common ─────────────────────────────────────────────
export const cashwalkBizCommon = {
  "00": "#FFFFFF",
  1000: "#000000",
} as const;

// ─── Neutral ────────────────────────────────────────────
export const cashwalkBizNeutral = {
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
export const cashwalkBizYellow = {
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
export const cashwalkBizCoralRed = {
  50: "#FFF5F5",
  100: "#FFECEC",
  200: "#FFCDCD",
  300: "#FF9A9A",
  400: "#FF7070",
  500: "#FC3500", // 에러 SSOT — Figma 입력 에러(보더/헬퍼/필수*) 와 정합 (이전 #FF4141)
  600: "#E83030",
  700: "#C42020",
  800: "#A01414",
  900: "#7A0A0A",
} as const;

// ─── Blue ───────────────────────────────────────────────
export const cashwalkBizBlue = {
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

// ─── Green ──────────────────────────────────────────────
export const cashwalkBizGreen = {
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
// 시멘틱 트리에는 매핑되지 않는다 — 로고 / 브랜드 라이브러리에서만 사용.
export const cashwalkBizBrown = {
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

// ─── Status alias (semantic 빠른 참조용) ────────────────
export const cashwalkBizStatus = {
  error: cashwalkBizCoralRed[500], // #FC3500
  success: cashwalkBizGreen[500], // #00CC5B
  info: cashwalkBizBlue[500], // #007AFF
  caution: cashwalkBizYellow[700], // #FEAF01 — 노랑은 텍스트 가독성 떨어져 700 사용
} as const;
