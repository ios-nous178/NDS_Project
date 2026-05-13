#!/usr/bin/env node
/**
 * sync-tokens.mjs — DESIGN.md (SOT) → packages/tokens/src/*.ts
 *
 * Usage:
 *   node scripts/sync-tokens.mjs --check   # CI lint: exits 1 if out of sync
 *   node scripts/sync-tokens.mjs --write   # regenerate token source files
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TOKENS_SRC = path.join(ROOT, "packages", "tokens", "src");
const DESIGN_MD = path.join(ROOT, "DESIGN.md");

const mode = process.argv.includes("--write") ? "write" : "check";

// ── Parse DESIGN.md frontmatter (failsafe → all keys are strings) ──

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("No frontmatter found in DESIGN.md");
  return parseYaml(match[1], { schema: "failsafe" });
}

const raw = fs.readFileSync(DESIGN_MD, "utf-8");
const tokens = parseFrontmatter(raw);

// ── Helpers ────────────────────────────────────────────────

const HEADER =
  "// Auto-generated from DESIGN.md — do not edit manually\n// Run `pnpm generate:tokens` to regenerate\n\n";

function stripUnit(val) {
  if (typeof val === "string" && val.endsWith("px")) return Number(val.replace("px", ""));
  if (typeof val === "string" && val.endsWith("ms")) return Number(val.replace("ms", ""));
  return Number(val);
}

/** Format a JS object key — quote strings that aren't valid identifiers */
function fmtKey(k) {
  if (/^\d+$/.test(k) && !k.startsWith("0")) return k; // numeric literal
  if (k.startsWith("0") && k.length > 1) return JSON.stringify(k); // "00"
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)) return k; // valid identifier
  return JSON.stringify(k);
}

/** Resolve "{blue.500}" → { expr: 'blue[500]', scale: 'blue', stop: '500' } */
function parseRef(val) {
  if (typeof val !== "string") return null;
  const m = val.match(/^\{(\w+)\.(\w+)\}$/);
  if (!m) return null;
  const [, scale, stop] = m;
  const key =
    /^\d+$/.test(stop) && !stop.startsWith("0") ? `[${stop}]` : `[${JSON.stringify(stop)}]`;
  return { expr: `${scale}${key}`, scale, stop };
}

function indent(level) {
  return "  ".repeat(level);
}

// ── Generate colors.ts ─────────────────────────────────────

function generateColors() {
  const lines = [HEADER];
  const primitiveNames = Object.keys(tokens.primitives);

  // Primitive scales
  for (const name of primitiveNames) {
    const scale = tokens.primitives[name];
    lines.push(`export const ${name} = {`);
    for (const [stop, hex] of Object.entries(scale)) {
      lines.push(`  ${fmtKey(stop)}: ${JSON.stringify(hex)},`);
    }
    lines.push("} as const;\n");
  }

  // Semantic colors — nested object referencing primitives
  const sem = tokens.colors;
  lines.push("export const semantic = {");
  for (const [group, entries] of Object.entries(sem)) {
    lines.push(`  ${group}: {`);
    for (const [key, val] of Object.entries(entries)) {
      const ref = parseRef(val);
      if (ref) {
        lines.push(`    ${fmtKey(key)}: ${ref.expr},`);
      } else {
        lines.push(`    ${fmtKey(key)}: ${JSON.stringify(val)},`);
      }
    }
    lines.push("  },");
  }
  lines.push("} as const;\n");

  // Aggregate
  lines.push("export const colors = {");
  for (const name of primitiveNames) {
    lines.push(`  ${name},`);
  }
  lines.push("  semantic,");
  lines.push("} as const;\n");

  return lines.join("\n");
}

// ── Generate spacing.ts ────────────────────────────────────

function generateSpacing() {
  const lines = [HEADER];

  // spacing (Figma · SpacingGuide · Primitive)
  lines.push("export const spacing = {");
  for (const [k, v] of Object.entries(tokens.spacing)) {
    lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
  }
  lines.push("} as const;\n");

  // gap (Figma · SpacingGuide · Semantic Gap)
  if (tokens.gap) {
    lines.push("export const gap = {");
    for (const [k, v] of Object.entries(tokens.gap)) {
      lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
    }
    lines.push("} as const;\n");
  }

  // padding (Figma · SpacingGuide · Semantic Padding)
  if (tokens.padding) {
    lines.push("export const padding = {");
    for (const [k, v] of Object.entries(tokens.padding)) {
      lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
    }
    lines.push("} as const;\n");
  }

  // radius (Figma · RadiusGuide · Primitive)
  lines.push("export const radius = {");
  for (const [k, v] of Object.entries(tokens.rounded)) {
    lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
  }
  lines.push("} as const;\n");

  // shape (Figma · RadiusGuide · Semantic Shape)
  if (tokens.shape) {
    lines.push("export const shape = {");
    for (const [k, v] of Object.entries(tokens.shape)) {
      lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
    }
    lines.push("} as const;\n");
  }

  // borderWidth (Figma · BorderGuide · Primitive)
  lines.push("export const borderWidth = {");
  for (const [k, v] of Object.entries(tokens.borderWidth)) {
    lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
  }
  lines.push("} as const;\n");

  // stroke (Figma · BorderGuide · Semantic Stroke)
  if (tokens.stroke) {
    lines.push("export const stroke = {");
    for (const [k, v] of Object.entries(tokens.stroke)) {
      lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
    }
    lines.push("} as const;\n");
  }

  // sizing (nested)
  lines.push("export const sizing = {");
  for (const [group, entries] of Object.entries(tokens.sizing)) {
    lines.push(`  ${group}: {`);
    for (const [k, v] of Object.entries(entries)) {
      lines.push(`    ${fmtKey(k)}: ${stripUnit(v)},`);
    }
    lines.push("  },");
  }
  lines.push("} as const;\n");

  // grid (Figma · SpacingGuide · Grid)
  if (tokens.grid) {
    lines.push("export const grid = {");
    for (const [bp, entries] of Object.entries(tokens.grid)) {
      lines.push(`  ${bp}: {`);
      for (const [k, v] of Object.entries(entries)) {
        // columns 는 unitless 정수, 그 외는 px 값
        if (k === "columns") {
          lines.push(`    ${fmtKey(k)}: ${Number(v)},`);
        } else {
          lines.push(`    ${fmtKey(k)}: ${stripUnit(v)},`);
        }
      }
      lines.push("  },");
    }
    lines.push("} as const;\n");
  }

  return lines.join("\n");
}

// ── Generate typography.ts ─────────────────────────────────

function generateTypography() {
  const lines = [HEADER];
  const typo = tokens.typography;

  // fontFamily
  lines.push("export const fontFamily = {");
  for (const [k, v] of Object.entries(typo.fontFamily)) {
    lines.push(`  ${fmtKey(k)}: ${JSON.stringify(v)},`);
  }
  lines.push("} as const;\n");

  // fontWeight
  lines.push("export const fontWeight = {");
  for (const [k, v] of Object.entries(typo.fontWeight)) {
    lines.push(`  ${fmtKey(k)}: ${Number(v)},`);
  }
  lines.push("} as const;\n");

  // TypeStyle type — fontWeight 는 typeScale 에 포함하지 않는다 (Figma 가이드는
  // 각 스케일을 Bold/Medium/Regular 3개 weight 모두 등가로 노출. 단일 default 두지 않음).
  // 사용처에서 fontWeight 토큰을 별도로 명시한다.
  lines.push("export type TypeStyle = {");
  lines.push("  fontSize: number;");
  lines.push("  lineHeight: number;");
  lines.push("  letterSpacing: number;");
  lines.push("};\n");

  lines.push("export const typeScale = {");
  for (const [name, style] of Object.entries(typo.typeScale)) {
    // Convert kebab-case to camelCase for keys
    const camelName = name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    lines.push(
      `  ${camelName}: { fontSize: ${stripUnit(style.fontSize)}, lineHeight: ${stripUnit(style.lineHeight)}, letterSpacing: ${stripUnit(style.letterSpacing)} },`,
    );
  }
  lines.push("} as const;\n");

  // Aggregate
  lines.push("export const typography = {");
  lines.push("  fontFamily,");
  lines.push("  fontWeight,");
  lines.push("  typeScale,");
  lines.push("} as const;\n");

  return lines.join("\n");
}

// ── Generate elevation.ts ──────────────────────────────────

function generateElevation() {
  const lines = [HEADER];
  const elev = tokens.elevation;

  // shadow
  lines.push("export const shadow = {");
  for (const [k, v] of Object.entries(elev.shadow)) {
    lines.push(`  ${fmtKey(k)}: ${JSON.stringify(v)},`);
  }
  lines.push("} as const;\n");

  // zIndex
  lines.push("export const zIndex = {");
  for (const [k, v] of Object.entries(elev.zIndex)) {
    lines.push(`  ${fmtKey(k)}: ${Number(v)},`);
  }
  lines.push("} as const;\n");

  // Aggregate
  lines.push("export const elevation = {");
  lines.push("  shadow,");
  lines.push("  zIndex,");
  lines.push("} as const;\n");

  return lines.join("\n");
}

// ── Generate motion.ts ─────────────────────────────────────

function generateMotion() {
  const lines = [HEADER];
  const mot = tokens.motion;

  // duration
  lines.push("export const duration = {");
  for (const [k, v] of Object.entries(mot.duration)) {
    lines.push(`  ${fmtKey(k)}: ${stripUnit(v)},`);
  }
  lines.push("} as const;\n");

  // easing
  lines.push("export const easing = {");
  for (const [k, v] of Object.entries(mot.easing)) {
    lines.push(`  ${fmtKey(k)}: ${JSON.stringify(v)},`);
  }
  lines.push("} as const;\n");

  // transition — compose from duration + easing references
  lines.push("export const transition = {");
  for (const [k, v] of Object.entries(mot.transition)) {
    // Parse "200ms ease" → find matching duration/easing tokens
    const match = v.match(/^(\d+)ms\s+(.+)$/);
    if (match) {
      const [, ms, easingVal] = match;
      const durKey = Object.entries(mot.duration).find(
        ([, dv]) => stripUnit(dv) === Number(ms),
      )?.[0];
      const easKey = Object.entries(mot.easing).find(([, ev]) => ev === easingVal)?.[0];
      if (durKey && easKey) {
        lines.push(`  ${fmtKey(k)}: \`\${duration.${durKey}}ms \${easing.${easKey}}\`,`);
        continue;
      }
    }
    lines.push(`  ${fmtKey(k)}: ${JSON.stringify(v)},`);
  }
  lines.push("} as const;\n");

  // Aggregate
  lines.push("export const motion = {");
  lines.push("  duration,");
  lines.push("  easing,");
  lines.push("  transition,");
  lines.push("} as const;\n");

  return lines.join("\n");
}

// cssVar.ts 는 더 이상 DESIGN.md 에서 자동 생성하지 않는다.
// 시멘틱 토큰이 단일 `--semantic-*` namespace 로 통일되면서, palette-style 그룹과
// role-based 그룹(구 `--eap-*`)을 함께 노출해야 해 수동 관리한다.

// ── Orchestrate ────────────────────────────────────────────

const FILES = {
  "colors.ts": generateColors,
  "spacing.ts": generateSpacing,
  "typography.ts": generateTypography,
  "elevation.ts": generateElevation,
  "motion.ts": generateMotion,
};

let hasError = false;

for (const [filename, generator] of Object.entries(FILES)) {
  const filePath = path.join(TOKENS_SRC, filename);
  const generated = generator();

  if (mode === "write") {
    fs.writeFileSync(filePath, generated);
    console.log(`  ✓ ${filename}`);
  } else {
    // --check mode
    const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";
    if (existing !== generated) {
      hasError = true;
      console.error(`  ✗ ${filename} is out of sync with DESIGN.md`);

      // Show first differing line for debugging
      const genLines = generated.split("\n");
      const existLines = existing.split("\n");
      for (let i = 0; i < Math.max(genLines.length, existLines.length); i++) {
        if (genLines[i] !== existLines[i]) {
          console.error(`    Line ${i + 1}:`);
          console.error(`      expected: ${genLines[i] ?? "(missing)"}`);
          console.error(`      actual:   ${existLines[i] ?? "(missing)"}`);
          break;
        }
      }
    } else {
      console.log(`  ✓ ${filename}`);
    }
  }
}

if (mode === "write") {
  console.log("\nTokens generated from DESIGN.md ✓");
} else if (hasError) {
  console.error("\nToken files are out of sync with DESIGN.md. Run `pnpm generate:tokens` to fix.");
  process.exit(1);
} else {
  console.log("\nAll token files match DESIGN.md ✓");
}
