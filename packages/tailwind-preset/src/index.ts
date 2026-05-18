import {
  neutral,
  coolGray,
  blue,
  magenta,
  yellow,
  red,
  green,
  semantic,
  fontFamily,
  fontWeight,
  typeScale,
  spacing,
  radius,
  sizing,
  trostYellow,
  trostCobalt,
  trostPink,
  trostNeutral,
  trostStatus,
  trostSemantic,
  trostTheme,
} from "@nudge-eap/tokens";

/**
 * NudgeEAP Tailwind CSS Preset
 *
 * Usage in tailwind.config.ts:
 * ```
 * import { nudgeEapPreset } from "@nudge-eap/tailwind-preset";
 * export default { presets: [nudgeEapPreset] };
 * ```
 *
 * 색상 키는 Figma SemanticColorGuide(171:6675)의 role 명을 따른다.
 *   - bg.*       → BG group        (`--semantic-bg-*`)
 *   - text.*     → Text group       (`--semantic-text-*`)
 *   - icon.*     → Icon group       (`--semantic-icon-*`)
 *   - border.*   → Border group     (`--semantic-border-*`)
 *   - fill.*     → Fill group       (`--semantic-fill-*`)
 *   - button.*   → Button{BG,...}    (`--semantic-button-*`)
 *   - input.*    → Input group      (`--semantic-input-*`)
 *
 * 시멘틱 색상은 hex 가 아닌 CSS var 로 노출 — DS tokens.css 가 변경되면
 * tailwind 클래스도 자동 반영된다. brand override(예: Trost theme) 가 같은
 * var 를 redefine 하면 동일 클래스가 브랜드 색상으로 렌더된다.
 */
export const nudgeEapPreset = {
  theme: {
    extend: {
      colors: {
        // ── Atomic palette ──
        neutral: objectToPx(neutral),
        "cool-gray": objectToPx(coolGray),
        blue: objectToPx(blue),
        magenta: objectToPx(magenta),
        yellow: objectToPx(yellow),
        red: objectToPx(red),
        green: objectToPx(green),

        // ── Semantic (Figma role-based) — CSS var references ──
        "bg-page": "var(--semantic-bg-page-default)",
        "bg-surface": "var(--semantic-bg-surface-default)",
        "bg-surface-subtle": "var(--semantic-bg-surface-subtle)",
        "bg-section": "var(--semantic-bg-section-default)",
        "bg-brand": "var(--semantic-bg-brand-default)",
        "bg-brand-subtle": "var(--semantic-bg-brand-subtle)",
        "bg-inverse": "var(--semantic-bg-inverse-default)",
        "bg-status-error": "var(--semantic-bg-status-error)",
        "bg-status-success": "var(--semantic-bg-status-success)",
        "bg-status-info": "var(--semantic-bg-status-info)",
        "bg-status-caution": "var(--semantic-bg-status-caution)",
        "bg-overlay": "var(--semantic-bg-overlay)",
        "bg-disabled": "var(--semantic-bg-disabled)",

        "text-strong": "var(--semantic-text-strong-default)",
        "text-normal": "var(--semantic-text-normal-default)",
        "text-subtle": "var(--semantic-text-subtle-default)",
        "text-muted": "var(--semantic-text-muted-default)",
        "text-disabled": "var(--semantic-text-disabled-default)",
        "text-inverse": "var(--semantic-text-inverse-default)",
        "text-brand": "var(--semantic-text-brand-default)",
        "text-brand-strong": "var(--semantic-text-brand-strong)",
        "text-status-success": "var(--semantic-text-status-success)",
        "text-status-error": "var(--semantic-text-status-error)",
        "text-status-caution": "var(--semantic-text-status-caution)",
        "text-status-info": "var(--semantic-text-status-info)",

        "icon-strong": "var(--semantic-icon-strong-default)",
        "icon-normal": "var(--semantic-icon-normal-default)",
        "icon-disabled": "var(--semantic-icon-disabled-default)",
        "icon-inverse": "var(--semantic-icon-inverse-default)",
        "icon-brand": "var(--semantic-icon-brand-default)",
        "icon-status-success": "var(--semantic-icon-status-success)",
        "icon-status-error": "var(--semantic-icon-status-error)",
        "icon-status-caution": "var(--semantic-icon-status-caution)",

        "border-normal": "var(--semantic-border-normal-default)",
        "border-strong": "var(--semantic-border-strong-default)",
        "border-subtle": "var(--semantic-border-subtle-default)",
        "border-focus": "var(--semantic-border-focus-default)",
        "border-brand": "var(--semantic-border-brand-default)",
        "border-disabled": "var(--semantic-border-disabled-default)",
        "border-status-error": "var(--semantic-border-status-error)",
        "border-status-caution": "var(--semantic-border-status-caution)",

        "fill-brand": "var(--semantic-fill-brand-default)",
        "fill-brand-hover": "var(--semantic-fill-brand-hover)",
        "fill-brand-pressed": "var(--semantic-fill-brand-pressed)",
        "fill-brand-disabled": "var(--semantic-fill-brand-disabled)",
        "fill-neutral": "var(--semantic-fill-neutral-default)",
        "fill-neutral-subtle": "var(--semantic-fill-neutral-subtle)",
        "fill-inverse": "var(--semantic-fill-inverse-default)",
        "fill-status-error": "var(--semantic-fill-status-error)",
        "fill-status-caution": "var(--semantic-fill-status-caution)",
      },
      fontFamily: {
        sans: fontFamily.web.split(", "),
      },
      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        bold: String(fontWeight.bold),
      },
      fontSize: Object.fromEntries(
        Object.entries(typeScale).map(([key, val]) => [
          key,
          [`${val.fontSize}px`, { lineHeight: `${val.lineHeight}px` }],
        ]),
      ),
      spacing: Object.fromEntries(Object.entries(spacing).map(([key, val]) => [key, `${val}px`])),
      borderRadius: {
        none: "0px",
        sm: `${radius.sm}px`,
        DEFAULT: `${radius.md}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
        pill: `${radius.pill}px`,
      },
      height: {
        "btn-lg": `${sizing.button.lg}px`,
        "btn-md": `${sizing.button.md}px`,
        "btn-sm": `${sizing.button.sm}px`,
        "btn-xs": `${sizing.button.xs}px`,
        "btn-field": `${sizing.button.field}px`,
        appbar: `${sizing.appBar.height}px`,
        bottombar: `${sizing.bottomBar.height}px`,
        input: `${sizing.input.default}px`,
        "input-field": `${sizing.input.field}px`,
      },
    },
  },
};

/**
 * Trost Tailwind CSS Preset
 *
 * Trost 도 같은 시멘틱 색상 키(`bg-brand`, `text-brand-default` 등)를 쓰지만,
 * trost.css 가 같은 var 를 노란색 계열로 redefine 하므로 클래스가 자동으로
 * Trost 색으로 렌더된다. 따라서 색상 매핑은 nudgeEapPreset 와 동일하게 둔다.
 * 차이가 나는 것은 typography / radius / shadow 등 비-색상 토큰뿐.
 */
export const trostPreset = {
  theme: {
    extend: {
      colors: {
        // Trost 고유 atomic palette
        "trost-neutral": objectToPx(trostNeutral),
        "trost-yellow": objectToPx(trostYellow),
        cobalt: objectToPx(trostCobalt),
        pink: objectToPx(trostPink),
        status: objectToPx(trostStatus),

        // 시멘틱 키는 nudgeEapPreset 와 동일한 CSS var 사용
        ...nudgeEapPreset.theme.extend.colors,
      },
      fontFamily: {
        sans: trostTheme.typography!.fontFamily!.web.split(", "),
      },
      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        bold: String(fontWeight.bold),
      },
      fontSize: Object.fromEntries(
        Object.entries(trostTheme.typography!.typeScale!).map(([key, val]) => [
          key,
          [`${val.fontSize}px`, { lineHeight: `${val.lineHeight}px` }],
        ]),
      ),
      spacing: Object.fromEntries(Object.entries(spacing).map(([key, val]) => [key, `${val}px`])),
      borderRadius: {
        none: "0px",
        xs: `${trostTheme.spacing!.radius!.xs}px`,
        sm: `${trostTheme.spacing!.radius!.sm}px`,
        DEFAULT: `${trostTheme.spacing!.radius!.md}px`,
        md: `${trostTheme.spacing!.radius!.md}px`,
        lg: `${trostTheme.spacing!.radius!.lg}px`,
        xl: `${trostTheme.spacing!.radius!.xl}px`,
        pill: "9999px",
      },
      height: {
        "btn-lg": `${sizing.button.lg}px`,
        "btn-md": `${sizing.button.md}px`,
        "btn-sm": `${sizing.button.sm}px`,
        "btn-xs": `${sizing.button.xs}px`,
        "btn-field": `${sizing.button.field}px`,
        appbar: `${sizing.appBar.height}px`,
        bottombar: `${sizing.bottomBar.height}px`,
        input: `${sizing.input.default}px`,
        "input-field": `${sizing.input.field}px`,
      },
      boxShadow: trostTheme.elevation?.shadow
        ? Object.fromEntries(Object.entries(trostTheme.elevation.shadow))
        : undefined,
    },
  },
};

// trostSemantic / semantic / trostStatus 등은 prop 미사용 import 회피 위해 명시적 참조
void trostSemantic;
void semantic;
void magenta;

/** Pass-through: tokens are already string hex values */
function objectToPx(obj: Record<string, string | number>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v)]));
}

export default nudgeEapPreset;
