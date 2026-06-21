import {
  neutral,
  coolGray,
  blue,
  magenta,
  yellow,
  red,
  green,
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
  trostRed,
  trostBlue,
  trostGreen,
  trostSemantic,
  trostTheme,
  cashwalkBizCommon,
  cashwalkBizNeutral,
  cashwalkBizYellow,
  cashwalkBizCoralRed,
  cashwalkBizBlue,
  cashwalkBizGreen,
  cashwalkBizBrown,
  cashwalkBizSemantic,
  cashwalkBizTheme,
  cashwalkCommon,
  cashwalkNeutral,
  cashwalkYellow,
  cashwalkCoralRed,
  cashwalkBlue,
  cashwalkCornflower,
  cashwalkIndigo,
  cashwalkGreen,
  cashwalkBrown,
  genietMint,
  genietRed,
  genietYellow,
  genietBlue,
  genietPurple,
  genietGreen,
  genietGray,
  genietNeutral,
  genietTheme,
  runmileOrange,
  runmileBlue,
  runmileRed,
  runmileGray,
  runmileNeutral,
  runmileTheme,
} from "@nudge-design/tokens";

/**
 * Nudge Tailwind CSS Preset
 *
 * Usage in tailwind.config.ts:
 * ```
 * import { nudgeEapPreset } from "@nudge-design/tailwind-preset";
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
 * tailwind 클래스도 자동 반영된다. project override(예: Trost theme) 가 같은
 * var 를 redefine 하면 동일 클래스가 프로젝트 색상으로 렌더된다.
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
        // Trost 고유 atomic palette (Figma 컬러 가이드 5011:108 풀 스케일).
        // base 와 충돌하는 hue(neutral/yellow/red/blue/green)는 `trost-` prefix —
        // 안 그러면 아래 `...nudgeEapPreset` spread 가 base 값으로 덮어버린다.
        "trost-neutral": objectToPx(trostNeutral),
        "trost-yellow": objectToPx(trostYellow),
        "trost-red": objectToPx(trostRed),
        "trost-blue": objectToPx(trostBlue),
        "trost-green": objectToPx(trostGreen),
        cobalt: objectToPx(trostCobalt),
        pink: objectToPx(trostPink),

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
        sm: `${trostTheme.spacing!.radius!.sm}px`,
        md: `${trostTheme.spacing!.radius!.md}px`,
        DEFAULT: `${trostTheme.spacing!.radius!.lg}px`, // 기본 = Radius/Lg(8)
        lg: `${trostTheme.spacing!.radius!.lg}px`,
        xl: `${trostTheme.spacing!.radius!.xl}px`,
        "2xl": `${trostTheme.spacing!.radius!["2xl"]}px`,
        "3xl": `${trostTheme.spacing!.radius!["3xl"]}px`,
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

// trostSemantic / cashwalkBizSemantic 등은 prop 미사용 import 회피 위해 명시적 참조
void trostSemantic;
void cashwalkBizSemantic;
void magenta;

/** Pass-through: tokens are already string hex values */
function objectToPx(obj: Record<string, string | number>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v)]));
}

/**
 * CashwalkBiz Tailwind preset.
 *
 * 시멘틱 클래스(`bg-brand`, `text-brand-default` 등) 는 cashwalk-biz.css 가 var 를
 * 노란 톤으로 redefine 하므로 자동 캐포비 색상. 별도 색상 alias 만 추가:
 *   - `bg-cashwalk-biz-yellow-500` 같은 project-prefixed
 *   - `bg-brown-500` 같은 캐시워크 로고용
 *
 * Typography / radius / spacing 은 cashwalk-biz 가이드에 맞춘 별도 매핑.
 */
export const cashwalkBizPreset = {
  theme: {
    extend: {
      colors: {
        // 캐포비 고유 atomic palette
        "cashwalk-biz-neutral": objectToPx(cashwalkBizNeutral),
        "cashwalk-biz-yellow": objectToPx(cashwalkBizYellow),
        "cashwalk-biz-blue": objectToPx(cashwalkBizBlue),
        "cashwalk-biz-green": objectToPx(cashwalkBizGreen),
        "cashwalk-biz-coral-red": objectToPx(cashwalkBizCoralRed),
        brown: objectToPx(cashwalkBizBrown),
        common: objectToPx(cashwalkBizCommon),

        // 시멘틱 키는 nudgeEapPreset 의 CSS var 그대로 — cashwalk-biz.css 가 자동 redefine
        ...nudgeEapPreset.theme.extend.colors,
      },
      fontFamily: {
        sans: cashwalkBizTheme.typography!.fontFamily!.web.split(", "),
      },
      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        semibold: String(fontWeight.semibold),
        bold: String(fontWeight.bold),
      },
      fontSize: Object.fromEntries(
        Object.entries(cashwalkBizTheme.typography!.typeScale!).map(([key, val]) => [
          key,
          [`${val.fontSize}px`, { lineHeight: `${val.lineHeight}px` }],
        ]),
      ),
      spacing: cashwalkBizTheme.spacing?.spacing
        ? Object.fromEntries(
            Object.entries(cashwalkBizTheme.spacing.spacing).map(([k, v]) => [k, `${v}px`]),
          )
        : undefined,
      borderRadius: cashwalkBizTheme.spacing?.radius
        ? Object.fromEntries(
            Object.entries(cashwalkBizTheme.spacing.radius).map(([k, v]) => [
              k,
              v === 9999 ? "9999px" : `${v}px`,
            ]),
          )
        : undefined,
      borderWidth: cashwalkBizTheme.spacing?.borderWidth
        ? Object.fromEntries(
            Object.entries(cashwalkBizTheme.spacing.borderWidth).map(([k, v]) => [k, `${v}px`]),
          )
        : undefined,
    },
  },
};

/**
 * Cashwalk (캐시워크 · 소비자앱) Tailwind preset.
 *
 * cashwalk.css 가 시멘틱 var 를 노란 톤으로 redefine → 시멘틱 클래스 자동 캐시워크.
 * 별도 atomic alias 만 추가(cornflower=팀워크 · indigo=동네산책 accent 포함).
 * theme(palette+semantic) 만 가진 minimal 프로젝트 → typography/spacing 은 base extend 상속.
 */
export const cashwalkPreset = {
  theme: {
    extend: {
      ...nudgeEapPreset.theme.extend,
      colors: {
        "cashwalk-neutral": objectToPx(cashwalkNeutral),
        "cashwalk-yellow": objectToPx(cashwalkYellow),
        "cashwalk-blue": objectToPx(cashwalkBlue),
        "cashwalk-green": objectToPx(cashwalkGreen),
        "cashwalk-coral-red": objectToPx(cashwalkCoralRed),
        cornflower: objectToPx(cashwalkCornflower),
        indigo: objectToPx(cashwalkIndigo),
        brown: objectToPx(cashwalkBrown),
        common: objectToPx(cashwalkCommon),
        // 시멘틱 키는 nudgeEapPreset 의 CSS var 그대로 — cashwalk.css 가 자동 redefine
        ...nudgeEapPreset.theme.extend.colors,
      },
    },
  },
};

/**
 * Teamwork(팀워크) · 동네산책 Tailwind preset — cashwalk accent 형제.
 *
 * 팔레트(cornflower·indigo 포함)와 시멘틱 키가 cashwalk 와 동일하다. 시멘틱 클래스는 var 참조라
 * brand 색 차이는 **import 하는 CSS 파일**(`@nudge-design/tokens/css/teamwork` ·
 * `.../dongne-sanchaek`)이 var 를 accent 톤으로 redefine 해서 난다 → preset 자체는 cashwalk 와
 * 같다. 소비처가 의도(브랜드)대로 import 를 고를 수 있게 별도 이름으로 노출한다.
 */
export const teamworkPreset = cashwalkPreset;
export const dongneSanchaekPreset = cashwalkPreset;

/**
 * Geniet Tailwind preset.
 *
 * 시멘틱 클래스(`bg-brand`, `text-brand-default` 등) 는 geniet.css 가 var 를 민트 톤으로
 * redefine 하므로 자동 지니어트 색상. 별도 색상 alias 만 추가:
 *   - `bg-geniet-neutral-*` · `bg-mint-*` 같은 프로젝트 atomic
 * Typography / radius(곡률 xl=18 · 2xl=23 포함) / shadow 는 지니어트 가이드 매핑.
 */
export const genietPreset = {
  theme: {
    extend: {
      colors: {
        // 지니어트 고유 atomic palette
        "geniet-neutral": objectToPx(genietNeutral),
        "geniet-gray": objectToPx(genietGray),
        "geniet-red": objectToPx(genietRed),
        "geniet-yellow": objectToPx(genietYellow),
        "geniet-blue": objectToPx(genietBlue),
        "geniet-green": objectToPx(genietGreen),
        mint: objectToPx(genietMint),
        purple: objectToPx(genietPurple),

        // 시멘틱 키는 nudgeEapPreset 의 CSS var 그대로 — geniet.css 가 자동 redefine
        ...nudgeEapPreset.theme.extend.colors,
      },
      fontFamily: {
        sans: genietTheme.typography!.fontFamily!.web.split(", "),
      },
      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        bold: String(fontWeight.bold),
      },
      fontSize: Object.fromEntries(
        Object.entries(genietTheme.typography!.typeScale!).map(([key, val]) => [
          key,
          [`${val.fontSize}px`, { lineHeight: `${val.lineHeight}px` }],
        ]),
      ),
      spacing: Object.fromEntries(Object.entries(spacing).map(([key, val]) => [key, `${val}px`])),
      borderRadius: genietTheme.spacing?.radius
        ? {
            ...Object.fromEntries(
              Object.entries(genietTheme.spacing.radius).map(([k, v]) => [
                k,
                v === 9999 ? "9999px" : `${v}px`,
              ]),
            ),
            DEFAULT: `${genietTheme.spacing.radius.md}px`,
          }
        : undefined,
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
      boxShadow: genietTheme.elevation?.shadow
        ? Object.fromEntries(Object.entries(genietTheme.elevation.shadow))
        : undefined,
    },
  },
};

/**
 * Runmile Tailwind preset.
 *
 * 시멘틱 클래스(`bg-brand`, `text-brand-default` 등) 는 runmile.css 가 var 를 오렌지 톤으로
 * redefine 하므로 자동 런마일 색상. 별도 색상 alias 만 추가:
 *   - `bg-runmile-neutral-*` · `bg-orange-*` 같은 프로젝트 atomic
 * Typography / radius(Toss 스타일 4/6/8/12/16/pill) / shadow 는 런마일 가이드 매핑.
 */
export const runmilePreset = {
  theme: {
    extend: {
      colors: {
        // 런마일 고유 atomic palette
        "runmile-neutral": objectToPx(runmileNeutral),
        "runmile-gray": objectToPx(runmileGray),
        "runmile-red": objectToPx(runmileRed),
        "runmile-blue": objectToPx(runmileBlue),
        orange: objectToPx(runmileOrange),

        // 시멘틱 키는 nudgeEapPreset 의 CSS var 그대로 — runmile.css 가 자동 redefine
        ...nudgeEapPreset.theme.extend.colors,
      },
      fontFamily: {
        sans: runmileTheme.typography!.fontFamily!.web.split(", "),
      },
      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        bold: String(fontWeight.bold),
      },
      fontSize: Object.fromEntries(
        Object.entries(runmileTheme.typography!.typeScale!).map(([key, val]) => [
          key,
          [`${val.fontSize}px`, { lineHeight: `${val.lineHeight}px` }],
        ]),
      ),
      spacing: Object.fromEntries(Object.entries(spacing).map(([key, val]) => [key, `${val}px`])),
      borderRadius: runmileTheme.spacing?.radius
        ? {
            ...Object.fromEntries(
              Object.entries(runmileTheme.spacing.radius).map(([k, v]) => [
                k,
                v === 9999 ? "9999px" : `${v}px`,
              ]),
            ),
            DEFAULT: `${runmileTheme.spacing.radius.md}px`,
          }
        : undefined,
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
      boxShadow: runmileTheme.elevation?.shadow
        ? Object.fromEntries(Object.entries(runmileTheme.elevation.shadow))
        : undefined,
    },
  },
};

export default nudgeEapPreset;
