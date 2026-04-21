/**
 * Generates CSS custom properties from compiled token JS files.
 * Run after tsc: node scripts/generate-css.js
 *
 * Outputs:
 *   dist/tokens.css  — NudgeEAP 기본 토큰
 *   dist/trost.css   — Trost 브랜드 오버라이드 토큰
 */
const fs = require("fs");
const path = require("path");

const { colors } = require("../dist/colors");
const { spacing, radius, borderWidth, sizing } = require("../dist/spacing");
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

// ─── NudgeEAP tokens.css (기존) ─────────────────────────

function generateBaseTokens() {
  const lines = [":root {"];

  // Colors
  flattenToVars(colors, "", lines);

  // Spacing
  lines.push("");
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${key}: ${value}px;`);
  }

  // Radius
  lines.push("");
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
  }

  // Border Width
  lines.push("");
  for (const [key, value] of Object.entries(borderWidth)) {
    lines.push(`  --border-${key}: ${value}px;`);
  }

  // Sizing
  lines.push("");
  flattenSizing(sizing, "", lines);

  // Font Family
  lines.push("");
  for (const [key, value] of Object.entries(fontFamily)) {
    lines.push(`  --font-${key}: ${value};`);
  }

  // Font Weight
  lines.push("");
  for (const [key, value] of Object.entries(fontWeight)) {
    lines.push(`  --font-weight-${key}: ${value};`);
  }

  // Type Scale
  lines.push("");
  for (const [key, value] of Object.entries(typeScale)) {
    lines.push(`  --text-${key}-size: ${value.fontSize}px;`);
    lines.push(`  --text-${key}-line-height: ${value.lineHeight}px;`);
    lines.push(`  --text-${key}-weight: ${value.fontWeight};`);
  }

  lines.push("}");
  return lines.join("\n") + "\n";
}

// ─── Trost brand override CSS ───────────────────────────

function generateTrostTokens() {
  const { trostTheme } = require("../dist/brands/trost");

  const lines = [
    "/**",
    " * Trost Brand Tokens",
    " * NudgeEAP tokens.css 이후에 import하면 브랜드 토큰이 오버라이드됩니다.",
    " *",
    " * Usage:",
    " *   @import '@nudge-eap/tokens/css';",
    " *   @import '@nudge-eap/tokens/css/trost';",
    " */",
    ":root {",
  ];

  const { palette, semantic, typography, spacing: spacingOverrides, elevation } = trostTheme;

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
        lines.push(`  --font-${key}: ${value};`);
      }
    }
    if (typography.typeScale) {
      lines.push("");
      for (const [key, value] of Object.entries(typography.typeScale)) {
        lines.push(`  --text-${key}-size: ${value.fontSize}px;`);
        lines.push(`  --text-${key}-line-height: ${value.lineHeight}px;`);
        lines.push(`  --text-${key}-weight: ${value.fontWeight};`);
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
fs.writeFileSync(trostPath, generateTrostTokens());
console.log(`Generated ${trostPath}`);
