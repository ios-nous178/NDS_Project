/**
 * NDS 컴포넌트 CSS 추출 스크립트
 *
 * 각 컴포넌트의 xxxStyles 상수를 런타임에 평가하여
 * dist/styles.css 파일로 추출합니다.
 *
 * 실행: node scripts/extract-styles.js
 * 빌드 시: tsc && node scripts/extract-styles.js
 */

const fs = require("fs");
const path = require("path");

// 빌드된 JS에서 스타일 상수를 추출
const distDir = path.resolve(__dirname, "../dist");
const outFile = path.resolve(distDir, "styles.css");

// tokens 패키지를 먼저 로드
const tokensPath = path.resolve(__dirname, "../../tokens/dist/index.js");

// dist/index.js에서 모든 모듈 로드
// 각 컴포넌트 파일에서 xxxStyles 변수를 찾아 수집

const componentFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".js") && f !== "index.js");

let allStyles = "";
const header = `/* NDS Design System - Auto-generated CSS */\n/* Do not edit manually. Run: pnpm build */\n\n`;

// 각 컴포넌트 JS 파일에서 스타일 문자열을 추출
for (const file of componentFiles) {
  const filePath = path.join(distDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  // const xxxStyles = `...`; 패턴의 문자열을 찾음
  // 빌드된 JS에서는 템플릿 리터럴이 문자열 연결로 변환됨
  // 대신 모듈을 실제로 require해서 export된 값을 가져옴
}

// 더 안정적인 방법: 각 컴포넌트를 직접 require
// React를 모킹하여 DOM 없이 실행
const mockReact = {
  createContext: () => ({ Provider: () => null }),
  useContext: () => ({}),
  useId: () => "mock-id",
  useRef: () => ({ current: null }),
  useState: (v) => [v, () => {}],
  useCallback: (f) => f,
  useEffect: () => {},
  forwardRef: (c) => c,
  createElement: () => null,
  Fragment: "fragment",
  memo: (c) => c,
};

const mockReactDOM = {
  createPortal: () => null,
};

// Module resolution override
const Module = require("module");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === "react") return request;
  if (request === "react-dom/client") return request;
  if (request === "react-dom") return request;
  return originalResolve.call(this, request, parent, isMain, options);
};

const originalLoad = Module._cache;
require.cache[require.resolve("react")] = {
  id: "react",
  filename: "react",
  loaded: true,
  exports: mockReact,
};

// react-dom mock
const reactDomMockId = "react-dom";
require.cache[reactDomMockId] = {
  id: reactDomMockId,
  filename: reactDomMockId,
  loaded: true,
  exports: mockReactDOM,
};

// 이제 src 파일에서 직접 스타일 문자열을 정규식으로 추출하는 방식으로 변경
// (require 방식은 tokens 의존성 등으로 복잡)

const srcDir = path.resolve(__dirname, "../src");
const srcFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith(".tsx"));

// tokens 값을 먼저 로드
let tokens;
try {
  tokens = require(tokensPath);
} catch (e) {
  console.error("tokens 빌드가 필요합니다: pnpm --filter @nudge-eap/tokens build");
  process.exit(1);
}

const {
  colors,
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
  borderWidth,
  sizing,
  shadow,
  zIndex,
  transition,
  duration,
  easing,
} = tokens;

// 각 src 파일에서 스타일 템플릿 리터럴을 추출하고 평가
const styleVarPattern = /const\s+(\w+Styles)\s*=\s*`([\s\S]*?)`;/g;

let cssOutput = header;

for (const file of srcFiles) {
  const filePath = path.join(srcDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  let match;
  styleVarPattern.lastIndex = 0;

  while ((match = styleVarPattern.exec(content)) !== null) {
    const varName = match[1];
    const template = match[2];

    try {
      // 템플릿 리터럴 내의 ${...} 표현식을 평가
      const evaluated = template.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        try {
          return eval(expr);
        } catch (e) {
          console.warn(`  [WARN] ${file}:${varName} - eval failed for: ${expr}`);
          return `/* EVAL_FAILED: ${expr} */`;
        }
      });

      cssOutput += `/* ─── ${file.replace(".tsx", "")} ─── */\n`;
      cssOutput += evaluated + "\n\n";
    } catch (e) {
      console.warn(`  [WARN] Failed to process ${varName} in ${file}: ${e.message}`);
    }
  }
}

fs.writeFileSync(outFile, cssOutput, "utf-8");
const sizeKB = (Buffer.byteLength(cssOutput) / 1024).toFixed(1);
console.log(`✓ styles.css generated (${sizeKB} KB) → ${outFile}`);
