/**
 * Brand Theme Definitions for Storybook
 *
 * SSOT 체인:
 *   brands/{trost,geniet}/DESIGN.md
 *     → packages/tokens/src/brands/{trost,geniet}.{palette,semantic}.ts
 *       → packages/tokens/scripts/generate-css.js
 *         → packages/tokens/dist/{trost,geniet}.css   ← `--semantic-*` 토큰 SSOT
 *
 * 이 파일은 dist/{brand}.css 의 :root 토큰을 빌드 시점에 ?raw 로 읽어 자동 sync 한다.
 * 그래서 palette/semantic.ts 가 바뀌고 tokens 빌드가 돌면 storybook 의 brand 토글도 자동 반영.
 *
 * 추가로 컴포넌트 레벨(--nds-*) 토큰은 dist css 에 없으므로 아래 cssVars 에 수동 명시.
 * 같은 키가 양쪽에 있으면 cssVars 명시값이 dist 를 override (storybook 의도된 미세 조정용).
 *
 * preview.ts 와 manager.ts 둘 다 이 파일의 `brandThemes` 를 단일 source 로 사용.
 */

// dist/{brand}.css 의 :root 블록을 ?raw 로 가져와서 토큰 자동 sync.
import trostDistCss from "../../../packages/tokens/dist/trost.css?raw";
import genietDistCss from "../../../packages/tokens/dist/geniet.css?raw";

function parseCssRootVars(raw: string): Record<string, string> {
  const rootBlock = raw.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootBlock) return {};
  const vars: Record<string, string> = {};
  for (const m of rootBlock[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

/** dist/{brand}.css 에서 파싱한 시멘틱 토큰. tokens 패키지가 SSOT 인 부분. */
const distVars: Record<string, Record<string, string>> = {
  trost: parseCssRootVars(trostDistCss),
  geniet: parseCssRootVars(genietDistCss),
};

export interface BrandTheme {
  name: string;
  label: string;
  description: string;
  /** CSS custom properties to inject on :root (dist vars + 수동 override merge 결과) */
  cssVars: Record<string, string>;
  /** Extra CSS file to import (from @nudge-eap/tokens) */
  cssImport?: string;
}

/** 수동 정의 (메타 + --nds-* 컴포넌트 토큰 + dist 와 다르게 두고 싶은 override). */
const _rawBrandThemes: Record<string, BrandTheme> = {
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
      // ── Semantic role tokens (cv.* 가 참조하는 --semantic-*-default 네임스페이스) ──
      // 컴포넌트(Button.tsx 등) 가 style prop 으로 var(--semantic-bg-brand-default) 같은 토큰을 inline 박기 때문에,
      // 이 토큰들이 :root 에 brand override 로 들어가야 색상이 실제로 변함.
      "--semantic-bg-brand-default": "#FFF42E",
      "--semantic-bg-brand-subtle": "#FFF8B8",
      "--semantic-bg-status-info": "#EDF0FF",
      "--semantic-bg-section-default": "#F4F5F7",
      "--semantic-fill-brand-hover": "#FFE600",
      "--semantic-fill-brand-pressed": "#E6D200",
      "--semantic-fill-status-error": "#FF4111",
      "--semantic-text-normal-default": "#333333",
      "--semantic-text-subtle-default": "#606060",
      "--semantic-text-inverse-default": "#000000",
      "--semantic-text-brand-default": "#000000",
      "--semantic-border-normal-default": "#E5E5E5",
      "--semantic-border-focus-default": "#4968FF",
      "--semantic-border-brand-default": "#FFF42E",
      "--semantic-icon-status-success": "#00BC78",

      // ── Semantic palette aliases (구버전 토큰 — Trost 전용 컴포넌트가 참조) ──
      "--semantic-primary-main": "#FFF42E",
      "--semantic-primary-hover": "#FFE600",
      "--semantic-primary-pressed": "#E6D200",
      "--semantic-primary-lighter": "#FFF8B8",
      "--semantic-primary-bg": "#FFF8B8",
      "--semantic-primary-bgLighter": "#FFFCE6",
      "--semantic-primary-fg": "#000000",
      "--semantic-secondary-sub": "#4968FF",
      "--semantic-secondary-lighter": "#A3B3FF",
      "--semantic-secondary-bg": "#EDF0FF",
      "--semantic-secondary-bgLighter": "#F6F7FF",
      "--semantic-error-main": "#FF4111",
      "--semantic-success-main": "#00BC78",
      "--semantic-text-default": "#333333",
      "--semantic-text-subtle": "#606060",
      "--semantic-icon-strong-default": "#333333",
      "--semantic-icon-normal-default": "#606060",
      "--semantic-icon-brand-default": "#4968FF",
      "--semantic-border-default": "#E5E5E5",
      "--semantic-border-focus": "#4968FF",
      "--semantic-bg-coolGray": "#F4F5F7",
      "--semantic-bg-overlay": "rgba(0, 0, 0, 0.7)",

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
    cssImport: "geniet",
    cssVars: {
      // 기본 `--semantic-*` role tokens 은 dist/geniet.css 에서 자동 sync.
      // 여기에는 legacy 별칭 + `--nds-*` 컴포넌트 토큰만 명시.
      // GenietHomepage(실제 운영 코드) 패턴 evidence 와 DESIGN.md 사양 미러.

      // ── Semantic palette aliases (구버전 토큰 — dist 미포함, 일부 legacy 컴포넌트 참조) ──
      "--semantic-primary-main": "#48C2C5",
      "--semantic-primary-hover": "#00A8AC",
      "--semantic-primary-pressed": "#00A8AC",
      "--semantic-primary-lighter": "#7ED4D6",
      "--semantic-primary-bg": "#ECF8F9",
      "--semantic-primary-bgLighter": "#ECF8F9",
      "--semantic-primary-fg": "#FFFFFF",
      "--semantic-secondary-sub": "#00A8AC",
      "--semantic-error-main": "#FF3258",
      "--semantic-success-main": "#49CA89",
      "--semantic-text-default": "#111111",
      "--semantic-text-subtle": "#777777",
      "--semantic-text-disabled": "#BBBBBB",
      "--semantic-border-default": "#DDDDDD",
      "--semantic-border-focus": "#48C2C5",
      "--semantic-bg-light": "#FAFAFA",
      "--semantic-bg-coolGray": "#F5F5F5",

      // ── Component-level overrides ──
      // Button: 틸 CTA, 8px radius (rounded-lg) — GenietHomepage 기본
      "--nds-button-background": "#48C2C5",
      "--nds-button-text-color": "#FFFFFF",
      "--nds-button-border-color": "#48C2C5",
      "--nds-button-radius": "8px",
      "--nds-button-hover-background": "#00A8AC",

      // Input — GenietHomepage: border #DDD (gray/300)
      "--nds-input-border-color": "#DDDDDD",

      // Badge / Chip idle (DESIGN.md chip-idle: bg surface-150 + text on-surface-secondary)
      "--nds-badge-background": "#F5F5F5",
      "--nds-badge-text-color": "#666666",

      // Card — 8px radius, 1px #ECECEC border (DESIGN.md card-default)
      "--nds-card-radius": "8px",
      "--nds-card-border-color": "#ECECEC",

      // Typography — Pretendard (DESIGN.md: 시스템 폰트 기본 + Pretendard baseline)
      "--font-web":
        "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Helvetica, Arial, sans-serif, system-ui",

      // Radius — DESIGN.md: xs4 / sm6 / md8 / lg12 / xl18 / 2xl23 / pill
      "--radius-sm": "6px",
      "--radius-xl": "18px",
      "--radius-2xl": "23px",

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

      // ── Toast ── GenietHomepage(MobileGlobalToast): bg-[#111111cc] rounded-xl(12px)
      //   py-3 px-4 text-sm(14px) font-medium — backdrop-blur 적용
      "--nds-toast-background": "rgba(17, 17, 17, 0.8)",
      "--nds-toast-radius": "12px",
      "--nds-toast-padding": "12px 16px",
      "--nds-toast-font-size": "14px",
      "--nds-toast-font-weight": "500",
      "--nds-toast-shadow": "0 2px 6px rgba(0, 0, 0, 0.15)",

      // ── Modal ── DESIGN.md: 8px radius, 24px padding, Material 3-layer shadow
      "--nds-modal-radius": "8px",

      // ── Chip / TabButton ── DESIGN.md chip-active/idle:
      //   selected=primary mint + 흰색, idle=surface-150 + on-surface-secondary, pill
      "--nds-chip-selected-background": "#48C2C5",
      "--nds-chip-selected-text": "#FFFFFF",
      "--nds-chip-selected-border": "#48C2C5",
      "--nds-chip-border": "#F5F5F5",
      "--nds-chip-text": "#777777",
      "--nds-chip-font-size": "14px",
      "--nds-chip-font-weight": "400",

      // ── BottomSheet ── DESIGN.md: 18px 상단 radius (rounded-t-[18px])
      "--nds-bottom-sheet-radius": "18px",
      "--nds-bottom-sheet-handle-width": "50px",
      "--nds-bottom-sheet-handle-height": "4px",
      "--nds-bottom-sheet-handle-color": "#DDDDDD",

      // ── Toggle ── (Geniet 패턴: track gray/200, active mint, 둥근 thumb)
      "--nds-toggle-track-w": "40px",
      "--nds-toggle-track-h": "24px",
      "--nds-toggle-track-bg": "#ECECEC",
      "--nds-toggle-track-active-bg": "#48C2C5",

      // Footer
      "--nds-footer-company-color": "#999999",
      "--nds-footer-muted-color": "#777777",
      "--nds-footer-extra-color": "#999999",
    },
  },
};

/**
 * 최종 brandThemes — dist/{brand}.css 의 :root 토큰을 base 로 깔고,
 * _rawBrandThemes 의 수동 cssVars 가 그 위를 override.
 *
 * 자동 sync: tokens 패키지 빌드(`pnpm build --filter @nudge-eap/tokens`) 시 dist css 갱신
 * → storybook 재로드 시 새 값 반영.
 *
 * Override: 같은 토큰을 _rawBrandThemes 의 cssVars 에 명시하면 dist 보다 우선.
 */
export const brandThemes: Record<string, BrandTheme> = Object.fromEntries(
  Object.entries(_rawBrandThemes).map(([key, theme]) => [
    key,
    {
      ...theme,
      cssVars: { ...(distVars[key] ?? {}), ...theme.cssVars },
    },
  ]),
);

export const defaultBrand = "nudge-eap";
export const brandKeys = Object.keys(brandThemes);
