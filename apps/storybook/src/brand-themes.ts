/**
 * Brand Theme Definitions for Storybook
 *
 * DESIGN.md YAML front matter에서 추출한 브랜드별 CSS 변수 오버라이드.
 * Storybook decorator에서 선택된 브랜드에 따라 :root에 주입됩니다.
 *
 * 컴포넌트는 var(--nds-*, fallback) 패턴을 사용하므로,
 * --nds-* 변수를 세팅하면 폴백 대신 브랜드 값이 적용됩니다.
 */

export interface BrandTheme {
  name: string;
  label: string;
  description: string;
  /** CSS custom properties to inject on :root */
  cssVars: Record<string, string>;
  /** Extra CSS file to import (from @nudge-eap/tokens) */
  cssImport?: string;
}

export const brandThemes: Record<string, BrandTheme> = {
  "nudge-eap": {
    name: "nudge-eap",
    label: "NudgeEAP",
    description: "블루 기반 EAP 멘탈케어 플랫폼",
    cssVars: {
      // NudgeEAP는 기본 토큰이므로 오버라이드 없음 — 폴백 값이 곧 NudgeEAP
    },
  },
  trost: {
    name: "trost",
    label: "Trost (트로스트)",
    description: "옐로우 시그니처 심리 상담 플랫폼",
    cssImport: "trost",
    cssVars: {
      // ── Semantic color overrides ──
      "--color-semantic-primary-main": "#FFF42E",
      "--color-semantic-primary-hover": "#FFE600",
      "--color-semantic-primary-pressed": "#E6D200",
      "--color-semantic-primary-lighter": "#FFF8B8",
      "--color-semantic-primary-bg": "#FFF8B8",
      "--color-semantic-primary-bgLighter": "#FFFCE6",
      "--color-semantic-primary-fg": "#000000",
      "--color-semantic-secondary-sub": "#4968FF",
      "--color-semantic-secondary-lighter": "#A3B3FF",
      "--color-semantic-secondary-bg": "#EDF0FF",
      "--color-semantic-secondary-bgLighter": "#F6F7FF",
      "--color-semantic-error-main": "#FF4111",
      "--color-semantic-success-main": "#00BC78",
      "--color-semantic-text-default": "#333333",
      "--color-semantic-text-subtle": "#606060",
      "--color-semantic-border-default": "#E5E5E5",
      "--color-semantic-border-focus": "#4968FF",
      "--color-semantic-bg-coolGray": "#F4F5F7",
      "--color-semantic-bg-overlay": "rgba(0, 0, 0, 0.7)",

      // ── Component-level overrides ──
      // Button: pill 옐로우 CTA (트로스트 시그니처)
      "--nds-button-background": "#FFF42E",
      "--nds-button-text-color": "#000000",
      "--nds-button-border-color": "#FFF42E",
      "--nds-button-radius": "9999px",
      "--nds-button-hover-background": "#FFE600",

      // Input: cobalt focus
      "--nds-input-border-color": "#E5E5E5",

      // Badge
      "--nds-badge-background": "#F4F5F7",
      "--nds-badge-text-color": "#606060",

      // Card
      "--nds-card-radius": "12px",

      // Typography
      "--font-web":
        "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",

      // Radius
      "--radius-sm": "6px",
      "--radius-xl": "20px",

      // AppBar
      "--nds-app-bar-search-border-color": "#FFD92E",
      "--nds-app-bar-search-border-width": "2px",
      "--nds-app-bar-search-radius": "24px",
      "--nds-app-bar-gnb-font-size": "17px",
      "--nds-app-bar-gnb-active-color": "#000000",
      "--nds-app-bar-gnb-inactive-color": "#999999",
      "--nds-app-bar-gnb-active-border-width": "3px",
      "--nds-app-bar-auth-font-size": "16px",
      "--nds-app-bar-auth-font-weight": "700",

      // ── Toggle ──
      // 트로스트: 40×24, unchecked=#EEE, checked=#333, 썸 그림자 material-like
      "--nds-toggle-track-w": "40px",
      "--nds-toggle-track-h": "24px",
      "--nds-toggle-track-bg": "#EEEEEE",
      "--nds-toggle-track-active-bg": "#333333",
      "--nds-toggle-thumb-shadow":
        "0 1px 1px 0 rgba(0,0,0,0.24), 0 0 1px 0 rgba(0,0,0,0.12), 0 2.4px 0.8px rgba(0,0,0,0.06), 0 2.4px 6.4px rgba(0,0,0,0.15)",

      // ── Toast ──
      // 트로스트: bg-black, rounded-xl(12px), px-4 py-3.5, text-[15px] medium, max-w-300, shadow
      "--nds-toast-background": "#000000",
      "--nds-toast-radius": "12px",
      "--nds-toast-padding": "14px 16px",
      "--nds-toast-font-size": "15px",
      "--nds-toast-font-weight": "500",
      "--nds-toast-max-width": "300px",
      "--nds-toast-shadow": "0px 4px 16px rgba(0,0,0,0.15)",

      // ── Modal ──
      // 트로스트: rounded-xl(12px), scale 애니메이션, z-9999, backdrop 50%
      "--nds-modal-radius": "12px",

      // ── Chip (= TabButton) ──
      // 트로스트: selected=bg-gray-800 text-white border-none, unselected=bg-#F4F5F7 border-none
      "--nds-chip-selected-background": "#333333",
      "--nds-chip-selected-text": "#FFFFFF",
      "--nds-chip-selected-border": "#333333",
      "--nds-chip-border": "#ECECEC",
      "--nds-chip-text": "#606060",
      "--nds-chip-font-size": "14px",
      "--nds-chip-font-weight": "500",

      // ── Card ──
      // 트로스트: border #e0e0e0
      "--nds-card-border-color": "#E0E0E0",

      // ── BottomSheet ──
      // 트로스트: rounded-t-2xl(16px), drag handle h-1 w-[50px] bg-[#e5e5e5]
      "--nds-bottom-sheet-radius": "16px",
      "--nds-bottom-sheet-handle-width": "50px",
      "--nds-bottom-sheet-handle-height": "4px",
      "--nds-bottom-sheet-handle-color": "#E5E5E5",

      // Footer (dark)
      "--nds-footer-company-color": "#cccccc",
      "--nds-footer-muted-color": "#888888",
      "--nds-footer-extra-color": "#cccccc",
    },
  },
  geniet: {
    name: "geniet",
    label: "Geniet (지니어트)",
    description: "틸 기반 건강 관리 + 리워드 커머스",
    cssVars: {
      // ── Semantic color overrides ──
      "--color-semantic-primary-main": "#48C2C5",
      "--color-semantic-primary-hover": "#00A8AC",
      "--color-semantic-primary-pressed": "#00A8AC",
      "--color-semantic-primary-lighter": "#7ED4D6",
      "--color-semantic-primary-bg": "#E4F6F7",
      "--color-semantic-primary-bgLighter": "#ECF8F9",
      "--color-semantic-primary-fg": "#FFFFFF",
      "--color-semantic-secondary-sub": "#00A8AC",
      "--color-semantic-error-main": "#FF3258",
      "--color-semantic-success-main": "#55D695",
      "--color-semantic-text-default": "#111111",
      "--color-semantic-text-subtle": "#666666",
      "--color-semantic-text-disabled": "#999999",
      "--color-semantic-border-default": "#ECECEC",
      "--color-semantic-border-focus": "#48C2C5",
      "--color-semantic-bg-light": "#FAFAFA",
      "--color-semantic-bg-coolGray": "#F5F5F5",

      // ── Component-level overrides ──
      // Button: 틸 CTA
      "--nds-button-background": "#48C2C5",
      "--nds-button-text-color": "#FFFFFF",
      "--nds-button-border-color": "#48C2C5",
      "--nds-button-radius": "8px",
      "--nds-button-hover-background": "#00A8AC",

      // Input
      "--nds-input-border-color": "#ECECEC",

      // Badge
      "--nds-badge-background": "#F5F5F5",
      "--nds-badge-text-color": "#666666",

      // Card
      "--nds-card-radius": "8px",

      // Typography: Noto Sans KR
      "--font-web": "'Noto Sans KR', sans-serif",

      // Radius
      "--radius-sm": "6px",

      // AppBar
      "--nds-app-bar-search-border-color": "#48C2C5",
      "--nds-app-bar-search-border-width": "2px",
      "--nds-app-bar-search-radius": "27px",
      "--nds-app-bar-gnb-font-size": "18px",
      "--nds-app-bar-gnb-active-color": "#48C2C5",
      "--nds-app-bar-gnb-inactive-color": "#111111",
      "--nds-app-bar-gnb-active-border-width": "3px",
      "--nds-app-bar-gnb-gap": "24px",
      "--nds-app-bar-auth-font-size": "15px",
      "--nds-app-bar-auth-font-weight": "400",
    },
  },
};

export const defaultBrand = "nudge-eap";
export const brandKeys = Object.keys(brandThemes);
