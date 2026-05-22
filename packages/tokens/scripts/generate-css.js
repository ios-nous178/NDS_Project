/**
 * Generates CSS custom properties from compiled token JS files.
 * Run after tsc: node scripts/generate-css.js
 *
 * Outputs:
 *   dist/tokens.css   — NudgeEAP 기본 토큰
 *   dist/trost.css    — Trost 브랜드 오버라이드 토큰
 *   dist/geniet.css   — Geniet 브랜드 오버라이드 토큰
 *   dist/cashpobi.css — Cashpobi 브랜드 오버라이드 토큰
 */
const fs = require("fs");
const path = require("path");

const { colors } = require("../dist/colors");
const { nudgeEapSemantic } = require("../dist/brands/nudge-eap.semantic.js");
const {
  spacing,
  gap,
  gapTitle,
  inset,
  radius,
  shape,
  borderWidth,
  stroke,
  sizing,
  grid,
} = require("../dist/spacing");
const { fontFamily, fontWeight, typeScale } = require("../dist/typography");
const { shadow, zIndex } = require("../dist/elevation");

// ─── Helper ─────────────────────────────────────────────

/** atomic palette → `--color-{group}-{stop}` */
function flattenPaletteVars(obj, prefix, lines) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "string") {
      lines.push(`  --color-${varName}: ${value};`);
    } else if (typeof value === "object" && value !== null) {
      flattenPaletteVars(value, varName, lines);
    }
  }
}

/** role-based 트리(`nudgeEapSemantic` / `trostSemantic` 등) → `--semantic-{group}-{role}-{variant}` (camelCase → kebab-case) */
function flattenRoleSemanticVars(obj, prefix, lines) {
  for (const [key, value] of Object.entries(obj)) {
    const part = camelToKebab(key);
    const varName = prefix ? `${prefix}-${part}` : part;
    if (typeof value === "string") {
      lines.push(`  --semantic-${varName}: ${value};`);
    } else if (typeof value === "object" && value !== null) {
      flattenRoleSemanticVars(value, varName, lines);
    }
  }
}

function flattenSizing(obj, prefix, lines) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "number") {
      lines.push(`  --size-${varName}: ${value}px;`);
    } else {
      flattenSizing(value, varName, lines);
    }
  }
}

function camelToKebab(s) {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * typeScale 키(camelCase + 숫자)를 Figma 가이드의 kebab 형태로 변환.
 *   body1 → body-1 / display3 → display-3 / headline1 → headline-1 / label → label
 */
function typeScaleKeyToFigma(s) {
  return s.replace(/([a-z])(\d)/g, "$1-$2");
}

/**
 * fontFamily 키를 Figma 가이드 이름으로 매핑.
 *   web → default (Figma --font-family-default 와 정합)
 *   system → system
 */
function fontFamilyKeyToFigma(key) {
  if (key === "web") return "default";
  return key;
}

// ─── NudgeEAP tokens.css ────────────────────────────────

function generateBaseTokens() {
  const lines = [":root {"];

  // Atomic palette → `--color-{group}-{stop}`
  flattenPaletteVars(colors, "", lines);

  // Semantic — 1:1 Figma SemanticColorGuide (171:6675) mirror.
  // BG / Text / Button{BG,Text,Border} / Input / Icon / Border / Fill +
  // DS extension (bg-disabled). emit: `--semantic-{group}-{role}-{variant}` (kebab).
  lines.push("");
  lines.push("  /* ── Semantic (role-based, Figma SemanticColorGuide 171:6675) ── */");
  flattenRoleSemanticVars(nudgeEapSemantic, "", lines);

  // Spacing — Primitive Scale (Figma · SpacingGuide, 4pt grid)
  lines.push("");
  lines.push("  /* ── Spacing (Primitive, Figma · SpacingGuide) ── */");
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${key}: ${value}px;`);
  }

  // Gap — Semantic (Figma · SpacingGuide / Gap)
  lines.push("");
  lines.push("  /* ── Gap (Semantic, Figma · SpacingGuide / Gap) ── */");
  for (const [key, value] of Object.entries(gap)) {
    lines.push(`  --gap-${key}: ${value}px;`);
  }

  // Gap/Title — 헤딩 ↔ 서브타이틀 간격 (Figma TitleGapGuide 859:5614)
  lines.push("");
  lines.push("  /* ── Gap/Title (Figma · TitleGapGuide 859:5614) ── */");
  for (const [key, value] of Object.entries(gapTitle)) {
    lines.push(`  --gap-title-${key}: ${value}px;`);
  }

  // Inset — Semantic (Figma · SpacingGuide / Inset) — 사용처 기반 컨테이너 내부 여백
  lines.push("");
  lines.push("  /* ── Inset (Semantic, Figma · SpacingGuide / Inset) ── */");
  for (const [key, value] of Object.entries(inset)) {
    lines.push(`  --inset-${key}: ${value}px;`);
  }

  // Grid — 거터·마진 (Figma · SpacingGuide / Grid)
  lines.push("");
  lines.push("  /* ── Grid (Figma · SpacingGuide / Grid) ── */");
  lines.push(`  --grid-gutter-mobile: ${grid.mobile.gutter}px;`);
  lines.push(`  --grid-gutter-pc: ${grid.desktop.gutter}px;`);
  lines.push(`  --grid-margin-mobile: ${grid.mobile.margin}px;`);
  lines.push(`  --grid-margin-pc: ${grid.desktop.margin}px;`);
  lines.push(`  --grid-margin-pc-min: ${grid.desktop.minMargin}px;`);
  lines.push(`  --grid-content-mobile: ${grid.mobile.contentWidth}px;`);
  lines.push(`  --grid-content-pc: ${grid.desktop.contentWidth}px;`);

  // Radius — Policy scale
  lines.push("");
  lines.push("  /* ── Radius (Policy Scale) ── */");
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
  }

  // Shape — Semantic policy alias
  lines.push("");
  lines.push("  /* ── Shape (Semantic Policy Alias) ── */");
  for (const [key, value] of Object.entries(shape)) {
    lines.push(`  --shape-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
  }

  // Border Width — Primitive (Figma · BorderGuide)
  lines.push("");
  lines.push("  /* ── Border Width (Primitive, Figma · BorderGuide) ── */");
  for (const [key, value] of Object.entries(borderWidth)) {
    lines.push(`  --border-${key}: ${value}px;`);
  }

  // Stroke — Semantic (Figma · BorderGuide / Semantic)
  lines.push("");
  lines.push("  /* ── Stroke (Semantic, Figma · BorderGuide / Semantic) ── */");
  for (const [key, value] of Object.entries(stroke)) {
    lines.push(`  --stroke-${key}: ${value}px;`);
  }

  // Sizing
  lines.push("");
  flattenSizing(sizing, "", lines);

  // Font Family — Figma 가이드 명명(--font-family-default / -system)에 맞춤
  lines.push("");
  for (const [key, value] of Object.entries(fontFamily)) {
    lines.push(`  --font-family-${fontFamilyKeyToFigma(key)}: ${value};`);
  }

  // Font Weight
  lines.push("");
  for (const [key, value] of Object.entries(fontWeight)) {
    lines.push(`  --font-weight-${key}: ${value};`);
  }

  // Type Scale — Figma 가이드 변수명(--font-size-body-1 / --line-height-body-1)에 정합.
  // fontWeight 는 스케일에 묶지 않고(스케일당 default 없음), --font-weight-* 토큰을
  // 사용처에서 직접 조합한다.
  lines.push("");
  for (const [key, value] of Object.entries(typeScale)) {
    const figmaKey = typeScaleKeyToFigma(key);
    lines.push(`  --font-size-${figmaKey}: ${value.fontSize}px;`);
    lines.push(`  --line-height-${figmaKey}: ${value.lineHeight}px;`);
  }

  // Shadow — Figma · ElevationGuide(556:2). E0 ~ E3 → --shadow-0 ~ --shadow-3
  lines.push("");
  lines.push("  /* ── Shadow (Figma · ElevationGuide 556:2) ── */");
  for (const [key, value] of Object.entries(shadow)) {
    lines.push(`  --shadow-${key}: ${value};`);
  }

  // Z-Index
  lines.push("");
  lines.push("  /* ── Z-Index ── */");
  for (const [key, value] of Object.entries(zIndex)) {
    lines.push(`  --z-${key}: ${value};`);
  }

  lines.push("}");
  return lines.join("\n") + "\n";
}

// ─── Brand override CSS ────────────────────────────────

function generateBrandTokens({ theme, title, cssImport }) {
  const pascalTitle = title.charAt(0).toUpperCase() + title.slice(1);

  const lines = [
    "/**",
    ` * ${pascalTitle} Brand Tokens`,
    " * NudgeEAP tokens.css 이후에 import하면 브랜드 토큰이 오버라이드됩니다.",
    " *",
    " * Usage:",
    " *   @import '@nudge-eap/tokens/css';",
    ` *   @import '@nudge-eap/tokens/css/${cssImport}';`,
    " */",
    ":root {",
  ];

  const { palette, semantic, typography, spacing: spacingOverrides, elevation, components } = theme;

  // Palette colors
  lines.push("  /* ── Palette ── */");
  for (const [family, scale] of Object.entries(palette)) {
    for (const [stop, value] of Object.entries(scale)) {
      lines.push(`  --color-${family}-${stop}: ${value};`);
    }
  }

  // Semantic colors — Figma role-based 트리 Partial 만 override
  lines.push("");
  lines.push("  /* ── Semantic (Figma role-based) ── */");
  flattenRoleSemanticVars(semantic, "", lines);

  // Typography
  if (typography) {
    lines.push("");
    lines.push("  /* ── Typography ── */");
    if (typography.fontFamily) {
      for (const [key, value] of Object.entries(typography.fontFamily)) {
        lines.push(`  --font-family-${fontFamilyKeyToFigma(key)}: ${value};`);
      }
    }
    if (typography.typeScale) {
      lines.push("");
      for (const [key, value] of Object.entries(typography.typeScale)) {
        const figmaKey = typeScaleKeyToFigma(key);
        lines.push(`  --font-size-${figmaKey}: ${value.fontSize}px;`);
        lines.push(`  --line-height-${figmaKey}: ${value.lineHeight}px;`);
      }
    }
  }

  // Atomic spacing scale — `--spacing-{key}`
  if (spacingOverrides && spacingOverrides.spacing) {
    lines.push("");
    lines.push("  /* ── Spacing ── */");
    for (const [key, value] of Object.entries(spacingOverrides.spacing)) {
      lines.push(`  --spacing-${key}: ${value}px;`);
    }
  }

  // Gap — `--gap-{key}`
  if (spacingOverrides && spacingOverrides.gap) {
    lines.push("");
    lines.push("  /* ── Gap ── */");
    for (const [key, value] of Object.entries(spacingOverrides.gap)) {
      lines.push(`  --gap-${key}: ${value}px;`);
    }
  }

  // Gap/Title — `--gap-title-{key}`
  if (spacingOverrides && spacingOverrides.gapTitle) {
    lines.push("");
    lines.push("  /* ── Gap/Title ── */");
    for (const [key, value] of Object.entries(spacingOverrides.gapTitle)) {
      lines.push(`  --gap-title-${key}: ${value}px;`);
    }
  }

  // Inset — `--inset-{key}`
  if (spacingOverrides && spacingOverrides.inset) {
    lines.push("");
    lines.push("  /* ── Inset ── */");
    for (const [key, value] of Object.entries(spacingOverrides.inset)) {
      lines.push(`  --inset-${key}: ${value}px;`);
    }
  }

  // Radius
  if (spacingOverrides && spacingOverrides.radius) {
    lines.push("");
    lines.push("  /* ── Radius ── */");
    for (const [key, value] of Object.entries(spacingOverrides.radius)) {
      lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
    }
  }

  // Shape — `--shape-{key}`
  if (spacingOverrides && spacingOverrides.shape) {
    lines.push("");
    lines.push("  /* ── Shape ── */");
    for (const [key, value] of Object.entries(spacingOverrides.shape)) {
      lines.push(`  --shape-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
    }
  }

  // Border Width — `--border-{key}`
  if (spacingOverrides && spacingOverrides.borderWidth) {
    lines.push("");
    lines.push("  /* ── Border Width ── */");
    for (const [key, value] of Object.entries(spacingOverrides.borderWidth)) {
      lines.push(`  --border-${key}: ${value}px;`);
    }
  }

  // Stroke — `--stroke-{key}`
  if (spacingOverrides && spacingOverrides.stroke) {
    lines.push("");
    lines.push("  /* ── Stroke ── */");
    for (const [key, value] of Object.entries(spacingOverrides.stroke)) {
      lines.push(`  --stroke-${key}: ${value}px;`);
    }
  }

  // Grid — `--grid-{gutter|margin}-{mobile|pc}` / content width
  if (spacingOverrides && spacingOverrides.grid) {
    lines.push("");
    lines.push("  /* ── Grid ── */");
    const g = spacingOverrides.grid;
    if (g.mobile) {
      if (g.mobile.gutter != null) lines.push(`  --grid-gutter-mobile: ${g.mobile.gutter}px;`);
      if (g.mobile.margin != null) lines.push(`  --grid-margin-mobile: ${g.mobile.margin}px;`);
      if (g.mobile.contentWidth != null)
        lines.push(`  --grid-content-mobile: ${g.mobile.contentWidth}px;`);
    }
    if (g.desktop) {
      if (g.desktop.gutter != null) lines.push(`  --grid-gutter-pc: ${g.desktop.gutter}px;`);
      if (g.desktop.margin != null) lines.push(`  --grid-margin-pc: ${g.desktop.margin}px;`);
      if (g.desktop.minMargin != null)
        lines.push(`  --grid-margin-pc-min: ${g.desktop.minMargin}px;`);
      if (g.desktop.contentWidth != null)
        lines.push(`  --grid-content-pc: ${g.desktop.contentWidth}px;`);
    }
  }

  // Layout (캐포비 전용 admin 너비 토큰) — `--layout-{key}`
  if (spacingOverrides && spacingOverrides.layout) {
    lines.push("");
    lines.push("  /* ── Layout (admin) ── */");
    for (const [key, value] of Object.entries(spacingOverrides.layout)) {
      const kebab = camelToKebab(key);
      lines.push(`  --layout-${kebab}: ${value}px;`);
    }
  }

  // Component overrides — `--nds-{component}-{prop}`
  //   number → `${n}px`, string → 그대로 (`var(--inset-input)` 같은 CSS var 참조 허용).
  //   컴포넌트가 fallback 패턴(`var(--nds-input-padding-x, var(--inset-card))`)으로 읽어 cascade.
  if (components) {
    const componentBlocks = [];
    for (const [component, props] of Object.entries(components)) {
      if (!props) continue;
      for (const [prop, value] of Object.entries(props)) {
        let cssValue;
        if (typeof value === "number") cssValue = `${value}px`;
        else if (typeof value === "string") cssValue = value;
        else continue;
        componentBlocks.push(`  --nds-${component}-${camelToKebab(prop)}: ${cssValue};`);
      }
    }
    if (componentBlocks.length > 0) {
      lines.push("");
      lines.push("  /* ── Components (component-level overrides) ── */");
      lines.push(...componentBlocks);
    }
  }

  // Elevation
  if (elevation) {
    if (elevation.shadow) {
      lines.push("");
      lines.push("  /* ── Shadow ── */");
      for (const [key, value] of Object.entries(elevation.shadow)) {
        lines.push(`  --shadow-${key}: ${value};`);
      }
    }
    if (elevation.zIndex) {
      lines.push("");
      lines.push("  /* ── Z-Index ── */");
      for (const [key, value] of Object.entries(elevation.zIndex)) {
        lines.push(`  --z-${key}: ${value};`);
      }
    }
  }

  lines.push("}");
  return lines.join("\n") + "\n";
}

// ─── Write files ────────────────────────────────────────

const distDir = path.join(__dirname, "..", "dist");

const tokensPath = path.join(distDir, "tokens.css");
fs.writeFileSync(tokensPath, generateBaseTokens());
console.log(`Generated ${tokensPath}`);

const trostPath = path.join(distDir, "trost.css");
const { trostTheme } = require("../dist/brands/trost");
fs.writeFileSync(
  trostPath,
  generateBrandTokens({ theme: trostTheme, title: "trost", cssImport: "trost" }),
);
console.log(`Generated ${trostPath}`);

const genietPath = path.join(distDir, "geniet.css");
const { genietTheme } = require("../dist/brands/geniet");
fs.writeFileSync(
  genietPath,
  generateBrandTokens({ theme: genietTheme, title: "geniet", cssImport: "geniet" }),
);
console.log(`Generated ${genietPath}`);

const cashpobiPath = path.join(distDir, "cashpobi.css");
const { cashpobiTheme } = require("../dist/brands/cashpobi");
fs.writeFileSync(
  cashpobiPath,
  generateBrandTokens({ theme: cashpobiTheme, title: "cashpobi", cssImport: "cashpobi" }),
);
console.log(`Generated ${cashpobiPath}`);
