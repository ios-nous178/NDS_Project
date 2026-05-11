/**
 * Generates CSS custom properties from compiled token JS files.
 * Run after tsc: node scripts/generate-css.js
 *
 * Outputs:
 *   dist/tokens.css  — NudgeEAP 기본 토큰
 *   dist/trost.css   — Trost 브랜드 오버라이드 토큰
 *   dist/moneple.css — Moneple 브랜드 오버라이드 토큰
 */
const fs = require("fs");
const path = require("path");

const { colors } = require("../dist/colors");
const { eap } = require("../dist/eap");
const {
  spacing,
  gap,
  padding,
  radius,
  shape,
  borderWidth,
  stroke,
  sizing,
  grid,
} = require("../dist/spacing");
const { fontFamily, fontWeight, typeScale } = require("../dist/typography");

// ─── Helper ─────────────────────────────────────────────

function flattenToVars(obj, prefix, lines) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "string") {
      lines.push(`  --color-${varName}: ${value};`);
    } else if (typeof value === "object" && value !== null) {
      flattenToVars(value, varName, lines);
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

function flattenEapVars(obj, prefix, lines) {
  for (const [key, value] of Object.entries(obj)) {
    const part = camelToKebab(key);
    const varName = prefix ? `${prefix}-${part}` : part;
    if (typeof value === "string") {
      lines.push(`  --eap-${varName}: ${value};`);
    } else if (typeof value === "object" && value !== null) {
      flattenEapVars(value, varName, lines);
    }
  }
}

// ─── NudgeEAP tokens.css (기존) ─────────────────────────

function generateBaseTokens() {
  const lines = [":root {"];

  // Colors
  flattenToVars(colors, "", lines);

  // EAP semantic mapping (Figma SemanticColorGuide · NudgeEAP 한정)
  lines.push("");
  lines.push("  /* ── EAP Semantic (Figma 222:2) ── */");
  flattenEapVars(eap, "", lines);

  // Spacing — Primitive Scale (Figma · SpacingGuide, 4pt grid)
  // 기존 --spacing-N 유지 + Figma 가이드 명칭과 매칭되는 --eap-space-N alias 도 emit
  lines.push("");
  lines.push("  /* ── Spacing (Primitive, Figma · SpacingGuide) ── */");
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${key}: ${value}px;`);
  }
  lines.push("");
  lines.push("  /* Figma 가이드 alias (--eap-space-N, 16 primitives) */");
  const figmaSpacePrimitive = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40];
  for (const n of figmaSpacePrimitive) {
    lines.push(`  --eap-space-${n}: ${n}px;`);
  }

  // Gap — Semantic (Figma · SpacingGuide / Gap)
  lines.push("");
  lines.push("  /* ── Gap (Semantic, Figma · SpacingGuide / Gap) ── */");
  for (const [key, value] of Object.entries(gap)) {
    lines.push(`  --gap-${key}: ${value}px;`);
    lines.push(`  --eap-gap-${key}: ${value}px;`);
  }

  // Padding — Semantic (Figma · SpacingGuide / Padding)
  lines.push("");
  lines.push("  /* ── Padding (Semantic, Figma · SpacingGuide / Padding) ── */");
  for (const [key, value] of Object.entries(padding)) {
    lines.push(`  --padding-${key}: ${value}px;`);
    lines.push(`  --eap-padding-${key}: ${value}px;`);
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
  lines.push(`  --eap-grid-gutter-mo: ${grid.mobile.gutter}px;`);
  lines.push(`  --eap-grid-gutter-pc: ${grid.desktop.gutter}px;`);
  lines.push(`  --eap-grid-margin-mo: ${grid.mobile.margin}px;`);
  lines.push(`  --eap-grid-margin-pc: ${grid.desktop.margin}px;`);

  // Radius — Primitive (Figma · RadiusGuide)
  lines.push("");
  lines.push("  /* ── Radius (Primitive, Figma · RadiusGuide) ── */");
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
  }
  lines.push("");
  lines.push("  /* Figma 가이드 alias (--eap-radius-N / full) */");
  const figmaRadiusPrimitive = [0, 2, 4, 6, 8, 12, 16, 24];
  for (const n of figmaRadiusPrimitive) {
    lines.push(`  --eap-radius-${n}: ${n}px;`);
  }
  lines.push(`  --eap-radius-full: 9999px;`);

  // Shape — Semantic (Figma · RadiusGuide / Semantic)
  lines.push("");
  lines.push("  /* ── Shape (Semantic, Figma · RadiusGuide / Semantic) ── */");
  for (const [key, value] of Object.entries(shape)) {
    lines.push(`  --shape-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
    lines.push(`  --eap-shape-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
  }

  // Border Width — Primitive (Figma · BorderGuide)
  lines.push("");
  lines.push("  /* ── Border Width (Primitive, Figma · BorderGuide) ── */");
  for (const [key, value] of Object.entries(borderWidth)) {
    lines.push(`  --border-${key}: ${value}px;`);
  }
  lines.push(`  --eap-border-width-0: 0px;`);
  lines.push(`  --eap-border-width-1: 1px;`);
  lines.push(`  --eap-border-width-2: 2px;`);

  // Stroke — Semantic (Figma · BorderGuide / Semantic)
  lines.push("");
  lines.push("  /* ── Stroke (Semantic, Figma · BorderGuide / Semantic) ── */");
  for (const [key, value] of Object.entries(stroke)) {
    lines.push(`  --stroke-${key}: ${value}px;`);
    lines.push(`  --eap-stroke-${key}: ${value}px;`);
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

  const { palette, semantic, typography, spacing: spacingOverrides, elevation } = theme;

  // Palette colors
  lines.push("  /* ── Palette ── */");
  for (const [family, scale] of Object.entries(palette)) {
    for (const [stop, value] of Object.entries(scale)) {
      lines.push(`  --color-${family}-${stop}: ${value};`);
    }
  }

  // Semantic colors
  lines.push("");
  lines.push("  /* ── Semantic ── */");
  flattenToVars(semantic, "semantic", lines);

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

  // Radius
  if (spacingOverrides && spacingOverrides.radius) {
    lines.push("");
    lines.push("  /* ── Radius ── */");
    for (const [key, value] of Object.entries(spacingOverrides.radius)) {
      lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
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

const moneplePath = path.join(distDir, "moneple.css");
const { monepleTheme } = require("../dist/brands/moneple");
fs.writeFileSync(
  moneplePath,
  generateBrandTokens({ theme: monepleTheme, title: "moneple", cssImport: "moneple" }),
);
console.log(`Generated ${moneplePath}`);
