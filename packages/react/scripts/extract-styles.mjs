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
const tokensDistDir = path.resolve(__dirname, "../../tokens/dist");

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
    colors, neutral, coolGray, blue, magenta, yellow, red, green, semantic,
    fontFamily, fontWeight, typeScale,
    spacing, radius, borderWidth, sizing,
    shadow, zIndex,
    transition, duration, easing,
  };
`);

const tokens = tokenEval();

// cv (CSS variable references) — 빌드된 JS에서 import (TypeScript 구문 포함이라 eval 불가)
const { cv } = await import(path.join(tokensDistDir, "cssVar.js"));
tokens.cv = cv;

// eapVar (Figma SemanticColorGuide CSS variable references) — 마찬가지로 빌드된 JS에서 import
const { eapVar } = await import(path.join(tokensDistDir, "eap.js"));
tokens.eapVar = eapVar;

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

let cssOutput = header;
let count = 0;

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
          console.warn(`  ⚠ ${file}:${varName} — ${expr}: ${e.message}`);
          return `/* ${expr} */`;
        }
      });

      cssOutput += `/* ── ${file.replace(".tsx", "")} ── */\n`;
      cssOutput += evaluated.trim() + "\n\n";
      count++;
    } catch (e) {
      console.warn(`  ⚠ ${file}:${varName} — ${e.message}`);
    }
  }
}

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(outFile, cssOutput, "utf-8");

const sizeKB = (Buffer.byteLength(cssOutput) / 1024).toFixed(1);
console.log(
  `✓ styles.css (${count} blocks, ${sizeKB} KB) → ${path.relative(process.cwd(), outFile)}`,
);
