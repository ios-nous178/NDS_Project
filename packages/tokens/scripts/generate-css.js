/**
 * Generates CSS custom properties from compiled token JS files.
 * Run after tsc: node scripts/generate-css.js
 */
const fs = require("fs");
const path = require("path");

const { colors } = require("../dist/colors");
const { spacing, radius, borderWidth, sizing } = require("../dist/spacing");
const { fontFamily, fontWeight, typeScale } = require("../dist/typography");

const lines = [":root {"];

// --- Colors ---
function flattenColors(obj, prefix) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "string") {
      lines.push(`  --color-${varName}: ${value};`);
    } else {
      flattenColors(value, varName);
    }
  }
}
flattenColors(colors, "");

// --- Spacing ---
lines.push("");
for (const [key, value] of Object.entries(spacing)) {
  lines.push(`  --spacing-${key}: ${value}px;`);
}

// --- Radius ---
lines.push("");
for (const [key, value] of Object.entries(radius)) {
  lines.push(`  --radius-${key}: ${value === 9999 ? "9999px" : value + "px"};`);
}

// --- Border Width ---
lines.push("");
for (const [key, value] of Object.entries(borderWidth)) {
  lines.push(`  --border-${key}: ${value}px;`);
}

// --- Sizing ---
lines.push("");
function flattenSizing(obj, prefix) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "number") {
      lines.push(`  --size-${varName}: ${value}px;`);
    } else {
      flattenSizing(value, varName);
    }
  }
}
flattenSizing(sizing, "");

// --- Font Family ---
lines.push("");
for (const [key, value] of Object.entries(fontFamily)) {
  lines.push(`  --font-${key}: ${value};`);
}

// --- Font Weight ---
lines.push("");
for (const [key, value] of Object.entries(fontWeight)) {
  lines.push(`  --font-weight-${key}: ${value};`);
}

// --- Type Scale ---
lines.push("");
for (const [key, value] of Object.entries(typeScale)) {
  lines.push(`  --text-${key}-size: ${value.fontSize}px;`);
  lines.push(`  --text-${key}-line-height: ${value.lineHeight}px;`);
  lines.push(`  --text-${key}-weight: ${value.fontWeight};`);
}

lines.push("}");

const outPath = path.join(__dirname, "..", "dist", "tokens.css");
fs.writeFileSync(outPath, lines.join("\n") + "\n");
console.log(`Generated ${outPath}`);
