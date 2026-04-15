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
} from "@nudge-eap/tokens";

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

/** Pass-through: tokens are already string hex values */
function objectToPx(obj: Record<string, string | number>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v)]));
}

export default nudgeEapPreset;
