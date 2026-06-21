/**
 * @nudge-design/styles — bundle every per-component xxxStyles literal in src/ into
 * a single dist/styles.css. This used to live in @nudge-design/react but was split
 * out so @nudge-design/html (and any other framework adapter) can depend on the
 * CSS bundle without dragging in React.
 *
 * Pipeline: read every .ts file in src/, regex out the `xxxStyles` template
 * literal, evaluate the ${...} interpolations against tokens loaded directly
 * from @nudge-design/tokens source files (no compiled artifact needed), write the
 * concatenated result to dist/styles.css.
 *
 * Run: node scripts/extract-styles.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ─── tokens 소스에서 직접 값 로드 ─── */

const tokensDir = path.resolve(__dirname, "../../tokens/src");

function loadTokenModule(filename) {
  let src = fs.readFileSync(path.join(tokensDir, filename), "utf-8");
  src = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\/\/.*$/gm, "")
    .replace(/export\s+type\s+\w+\s*=\s*\{[^}]*\};?/gs, "")
    .replace(/export\s+type\s+.*$/gm, "")
    .replace(/export\s+/g, "")
    .replace(/\s+as\s+const/g, "");
  return src;
}

function loadCssVarRefs() {
  let src = fs.readFileSync(path.join(tokensDir, "cssVar.ts"), "utf-8");
  src = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\/\/.*$/gm, "")
    .replace(/export\s+type\s+.*$/gm, "")
    .replace(/export\s+const\s+cv\s*=/, "const cv =")
    // 헬퍼(v/vf 등) 화살표 함수 파라미터의 `: string` 타입 주석 제거 (new Function 은 순수 JS).
    .replace(/:\s*string/g, "")
    .replace(/\s+as\s+const/g, "");

  const evalCv = new Function(`
    ${src}
    return cv;
  `);

  return evalCv();
}

const tokensSrc = [
  loadTokenModule("colors.ts"),
  loadTokenModule("typography.ts"),
  loadTokenModule("spacing.ts"),
  loadTokenModule("elevation.ts"),
  loadTokenModule("motion.ts"),
].join("\n");

const tokenEval = new Function(`
  ${tokensSrc}
  return {
    colors, gray, common, coolGray, blue, pink, orange, yellow, red, green,
    fontFamily, fontWeight, typeScale,
    spacing, radius, borderWidth, sizing, grid,
    shadow, zIndex,
    transition, duration, easing,
  };
`);

const tokens = tokenEval();
tokens.cv = loadCssVarRefs();

/* ─── 컴포넌트 CSS 추출 ─── */

const srcDir = path.resolve(__dirname, "../src");
const distDir = path.resolve(__dirname, "../dist");
const outFile = path.resolve(distDir, "styles.css");

const srcFiles = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith(".ts"))
  .sort();

const header = `/* NDS Design System — Auto-generated styles */\n/* Do not edit. Regenerate: pnpm --filter @nudge-design/styles build */\n\n`;
const styleVarPattern = /(?:export\s+)?const\s+(\w+Styles)\s*=\s*`([\s\S]*?)`;/g;
const classConstPattern =
  /const\s+(\w+(?:CLASS|_CLASS))\s*=\s*(?:`([^`]*)`|"([^"]*)"|'([^']*)')\s*;/g;
const simpleConstPattern = /const\s+(\w+)\s*(?::[^=]+)?=\s*([{[][\s\S]*?[\]}])\s*;/g;

function collectSimpleConstants(content, localVars) {
  simpleConstPattern.lastIndex = 0;
  let match;
  while ((match = simpleConstPattern.exec(content)) !== null) {
    const [, name, expression] = match;
    if (name in localVars) continue;
    try {
      const fn = new Function(...Object.keys(localVars), `return (${expression})`);
      const value = fn(...Object.values(localVars));
      if (Array.isArray(value) || (value && typeof value === "object")) {
        localVars[name] = value;
      }
    } catch {
      // Ignore non-serializable constants.
    }
  }
}

let cssOutput = header;
let count = 0;
const unresolvedExpressions = [];

for (const file of srcFiles) {
  const content = fs.readFileSync(path.join(srcDir, file), "utf-8");

  const localVars = { ...tokens };

  classConstPattern.lastIndex = 0;
  let cm;
  while ((cm = classConstPattern.exec(content)) !== null) {
    const name = cm[1];
    const val = cm[2] ?? cm[3] ?? cm[4];
    const resolved = val.replace(/\$\{(\w+)\}/g, (_, ref) => localVars[ref] ?? "");
    localVars[name] = resolved;
  }

  collectSimpleConstants(content, localVars);

  styleVarPattern.lastIndex = 0;
  let match;
  while ((match = styleVarPattern.exec(content)) !== null) {
    const varName = match[1];
    const template = match[2];

    try {
      const evaluated = template.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        try {
          const fn = new Function(...Object.keys(localVars), `return (${expr})`);
          return fn(...Object.values(localVars));
        } catch (e) {
          unresolvedExpressions.push(`${file}:${varName} — ${expr}: ${e.message}`);
          return `/* ${expr} */`;
        }
      });

      cssOutput += `/* ── ${file.replace(".ts", "")} ── */\n`;
      cssOutput += evaluated.trim() + "\n\n";
      count++;
    } catch (e) {
      unresolvedExpressions.push(`${file}:${varName} — ${e.message}`);
    }
  }
}

if (unresolvedExpressions.length > 0) {
  console.error("✗ Failed to extract component styles. Unresolved template expressions:");
  for (const message of unresolvedExpressions) {
    console.error(`  - ${message}`);
  }
  process.exit(1);
}

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(outFile, cssOutput, "utf-8");

const sizeKB = (Buffer.byteLength(cssOutput) / 1024).toFixed(1);
console.log(
  `✓ styles.css (${count} blocks, ${sizeKB} KB) → ${path.relative(process.cwd(), outFile)}`,
);
