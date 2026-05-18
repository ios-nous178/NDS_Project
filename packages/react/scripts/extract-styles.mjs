/**
 * NDS 컴포넌트 CSS 추출 스크립트
 *
 * src/*.tsx에서 xxxStyles 템플릿 리터럴을 추출하고,
 * tokens 소스 파일의 값으로 평가하여 dist/styles.css를 생성합니다.
 *
 * 실행: node scripts/extract-styles.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ─── tokens 소스에서 직접 값 로드 ─── */

const tokensDir = path.resolve(__dirname, "../../tokens/src");

function loadTokenModule(filename) {
  let src = fs.readFileSync(path.join(tokensDir, filename), "utf-8");
  // TypeScript 구문 제거
  src = src
    .replace(/\/\*[\s\S]*?\*\//g, "") // 블록 주석
    .replace(/^\/\/.*$/gm, "") // 라인 주석
    .replace(/export\s+type\s+\w+\s*=\s*\{[^}]*\};?/gs, "") // export type X = { ... };
    .replace(/export\s+type\s+.*$/gm, "") // export type (한 줄)
    .replace(/export\s+/g, "") // export 키워드
    .replace(/\s+as\s+const/g, ""); // as const
  return src;
}

function loadCssVarRefs() {
  let src = fs.readFileSync(path.join(tokensDir, "cssVar.ts"), "utf-8");
  src = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\/\/.*$/gm, "")
    .replace(/export\s+type\s+.*$/gm, "")
    .replace(/export\s+const\s+cv\s*=/, "const cv =")
    .replace(/\(name:\s*string\)/g, "(name)")
    .replace(/\s+as\s+const/g, "");

  const evalCv = new Function(`
    ${src}
    return cv;
  `);

  return evalCv();
}

// tokens를 하나의 스코프로 합쳐서 eval
const tokensSrc = [
  loadTokenModule("colors.ts"),
  loadTokenModule("typography.ts"),
  loadTokenModule("spacing.ts"),
  loadTokenModule("elevation.ts"),
  loadTokenModule("motion.ts"),
].join("\n");

// eval 스코프에서 모든 토큰 변수를 정의
const tokenEval = new Function(`
  ${tokensSrc}
  return {
    colors, neutral, coolGray, blue, magenta, yellow, red, green,
    fontFamily, fontWeight, typeScale,
    spacing, radius, borderWidth, sizing, grid,
    shadow, zIndex,
    transition, duration, easing,
  };
`);

const tokens = tokenEval();

// cv (CSS variable references). Read source directly to avoid Node module-type
// warnings from importing dist ESM inside a package without "type": "module".
const cv = loadCssVarRefs();
tokens.cv = cv;

/* ─── 컴포넌트 CSS 추출 ─── */

const srcDir = path.resolve(__dirname, "../src");
const distDir = path.resolve(__dirname, "../dist");
const outFile = path.resolve(distDir, "styles.css");

const srcFiles = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith(".tsx"))
  .sort();

const header = `/* NDS Design System — Auto-generated styles */\n/* Do not edit. Regenerate: pnpm build */\n\n`;
const styleVarPattern = /const\s+(\w+Styles)\s*=\s*`([\s\S]*?)`;/g;
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
      // Ignore non-serializable constants such as ReactNode maps with JSX.
    }
  }
}

let cssOutput = header;
let count = 0;
const unresolvedExpressions = [];

for (const file of srcFiles) {
  const content = fs.readFileSync(path.join(srcDir, file), "utf-8");

  // 1) 해당 파일의 클래스명 상수를 먼저 수집
  const localVars = { ...tokens };
  classConstPattern.lastIndex = 0;
  let cm;
  while ((cm = classConstPattern.exec(content)) !== null) {
    const name = cm[1];
    const val = cm[2] ?? cm[3] ?? cm[4];
    // 템플릿 리터럴 내 ${...} 해석 (e.g. `${INPUT_CLASS}__root`)
    const resolved = val.replace(/\$\{(\w+)\}/g, (_, ref) => localVars[ref] ?? "");
    localVars[name] = resolved;
  }

  // Collect local serializable arrays/objects used as CSS fallbacks
  // e.g. DEFAULT_COLORS[0], KIND_BG.info, TONE_FG.info.
  collectSimpleConstants(content, localVars);

  // 2) 스타일 템플릿 리터럴 추출 및 평가
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

      cssOutput += `/* ── ${file.replace(".tsx", "")} ── */\n`;
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
