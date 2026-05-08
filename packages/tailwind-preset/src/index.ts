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
  monepleYellow,
  monepleCobalt,
  moneplePink,
  monepleNeutral,
  monepleStatus,
  monepleSemantic,
  monepleTheme,
} from "@nudge-eap/tokens";
import { trostTheme } from "@nudge-eap/tokens";

/**
 * NudgeEAP Tailwind CSS Preset
 *
 * Usage in tailwind.config.ts:
 * ```
 * import { nudgeEapPreset } from "@nudge-eap/tailwind-preset";
 * export default { presets: [nudgeEapPreset] };
 * ```
 */
export const nudgeEapPreset = {
  theme: {
    extend: {
      colors: {
        neutral: objectToPx(neutral),
        "cool-gray": objectToPx(coolGray),
        blue: objectToPx(blue),
        magenta: objectToPx(magenta),
        yellow: objectToPx(yellow),
        red: objectToPx(red),
        green: objectToPx(green),
        primary: {
          main: semantic.primary.main,
          hover: semantic.primary.hover,
          lighter: semantic.primary.lighter,
          bg: semantic.primary.bg,
          "bg-lighter": semantic.primary.bgLighter,
        },
        secondary: {
          sub: semantic.secondary.sub,
          lighter: semantic.secondary.lighter,
          bg: semantic.secondary.bg,
          "bg-lighter": semantic.secondary.bgLighter,
        },
        error: {
          main: semantic.error.main,
          bg: semantic.error.bg,
        },
        caution: {
          main: semantic.caution.main,
          text: semantic.caution.text,
          bg: semantic.caution.bg,
        },
        success: {
          main: semantic.success.main,
          bg: semantic.success.bg,
        },
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
          [
            `${val.fontSize}px`,
            { lineHeight: `${val.lineHeight}px`, fontWeight: String(val.fontWeight) },
          ],
        ]),
      ),
      spacing: Object.fromEntries(Object.entries(spacing).map(([key, val]) => [key, `${val}px`])),
      borderRadius: {
        none: `${radius.none}px`,
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
 * Usage in tailwind.config.ts:
 * ```
 * import { trostPreset } from "@nudge-eap/tailwind-preset";
 * export default { presets: [trostPreset] };
 * ```
 */
export const trostPreset = {
  theme: {
    extend: {
      colors: {
        neutral: objectToPx(trostNeutral),
        yellow: objectToPx(trostYellow),
        cobalt: objectToPx(trostCobalt),
        pink: objectToPx(trostPink),
        status: objectToPx(trostStatus),
        primary: {
          main: trostSemantic.primary.main,
          hover: trostSemantic.primary.hover,
          lighter: trostSemantic.primary.lighter,
          bg: trostSemantic.primary.bg,
          "bg-lighter": trostSemantic.primary.bgLighter,
          fg: trostSemantic.primary.fg,
        },
        secondary: {
          sub: trostSemantic.secondary.sub,
          lighter: trostSemantic.secondary.lighter,
          bg: trostSemantic.secondary.bg,
          "bg-lighter": trostSemantic.secondary.bgLighter,
        },
        error: {
          main: trostSemantic.error.main,
          bg: trostSemantic.error.bg,
        },
        caution: {
          main: trostSemantic.caution.main,
          text: trostSemantic.caution.text,
          bg: trostSemantic.caution.bg,
        },
        success: {
          main: trostSemantic.success.main,
          bg: trostSemantic.success.bg,
        },
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
          [
            `${val.fontSize}px`,
            { lineHeight: `${val.lineHeight}px`, fontWeight: String(val.fontWeight) },
          ],
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
      boxShadow: {
        sm: trostTheme.elevation!.shadow!.sm,
        md: trostTheme.elevation!.shadow!.md,
        lg: trostTheme.elevation!.shadow!.lg,
        up: trostTheme.elevation!.shadow!.up,
        hairline: trostTheme.elevation!.shadow!.hairline,
        none: "none",
      },
    },
  },
};

/**
 * Moneple Tailwind CSS Preset
 *
 * Moneple production colors are tenant-driven CSS variables. The preset mirrors
 * the Moneple05 community surface so Tailwind users get the same defaults as CSS.
 */
export const moneplePreset = {
  theme: {
    extend: {
      colors: {
        neutral: objectToPx(monepleNeutral),
        yellow: objectToPx(monepleYellow),
        cobalt: objectToPx(monepleCobalt),
        pink: objectToPx(moneplePink),
        status: objectToPx(monepleStatus),
        primary: {
          main: monepleSemantic.primary.main,
          hover: monepleSemantic.primary.hover,
          lighter: monepleSemantic.primary.lighter,
          bg: monepleSemantic.primary.bg,
          "bg-lighter": monepleSemantic.primary.bgLighter,
          fg: monepleSemantic.primary.fg,
        },
        secondary: {
          sub: monepleSemantic.secondary.sub,
          lighter: monepleSemantic.secondary.lighter,
          bg: monepleSemantic.secondary.bg,
          "bg-lighter": monepleSemantic.secondary.bgLighter,
        },
        error: {
          main: monepleSemantic.error.main,
          bg: monepleSemantic.error.bg,
        },
        caution: {
          main: monepleSemantic.caution.main,
          text: monepleSemantic.caution.text,
          bg: monepleSemantic.caution.bg,
        },
        success: {
          main: monepleSemantic.success.main,
          bg: monepleSemantic.success.bg,
        },
      },
      fontFamily: {
        sans: monepleTheme.typography!.fontFamily!.web.split(", "),
      },
      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        bold: String(fontWeight.bold),
      },
      fontSize: Object.fromEntries(
        Object.entries(monepleTheme.typography!.typeScale!).map(([key, val]) => [
          key,
          [
            `${val.fontSize}px`,
            { lineHeight: `${val.lineHeight}px`, fontWeight: String(val.fontWeight) },
          ],
        ]),
      ),
      spacing: Object.fromEntries(Object.entries(spacing).map(([key, val]) => [key, `${val}px`])),
      borderRadius: {
        none: "0px",
        xs: `${monepleTheme.spacing!.radius!.xs}px`,
        sm: `${monepleTheme.spacing!.radius!.sm}px`,
        DEFAULT: `${monepleTheme.spacing!.radius!.md}px`,
        md: `${monepleTheme.spacing!.radius!.md}px`,
        lg: `${monepleTheme.spacing!.radius!.lg}px`,
        xl: `${monepleTheme.spacing!.radius!.xl}px`,
        sheet: `${monepleTheme.spacing!.radius!.sheet}px`,
        chip: `${monepleTheme.spacing!.radius!.chip}px`,
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
      boxShadow: {
        sm: monepleTheme.elevation!.shadow!.sm,
        md: monepleTheme.elevation!.shadow!.md,
        lg: monepleTheme.elevation!.shadow!.lg,
        up: monepleTheme.elevation!.shadow!.up,
        none: "none",
      },
      zIndex: Object.fromEntries(
        Object.entries(monepleTheme.elevation!.zIndex!).map(([key, val]) => [key, String(val)]),
      ),
    },
  },
};

/** Pass-through: tokens are already string hex values */
function objectToPx(obj: Record<string, string | number>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v)]));
}

export default nudgeEapPreset;
