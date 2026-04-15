/**
 * SVG → React Component Generator
 *
 * svg/ 폴더의 모든 .svg 파일을 읽어서 src/ 에 React 컴포넌트로 생성합니다.
 * 외부 의존성 없이 순수 Node.js로 동작합니다.
 *
 * 사용법: node scripts/generate.js
 *
 * 아이콘 추가 방법:
 *   1. Figma에서 아이콘을 SVG로 export
 *   2. svg/ 폴더에 kebab-case 이름으로 저장 (예: chevron-right.svg)
 *   3. pnpm --filter @nudge-eap/icons build
 */
const fs = require("fs");
const path = require("path");

const SVG_DIR = path.join(__dirname, "..", "svg");
const SRC_DIR = path.join(__dirname, "..", "src");

// kebab-case → PascalCase
function toPascalCase(str) {
  return str.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

// SVG string → React component string
function svgToComponent(svgContent, componentName) {
  // Extract inner content of <svg> tag
  const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  if (!svgMatch) throw new Error("Invalid SVG");

  const innerSvg = svgMatch[1].trim();

  // Convert SVG attributes to JSX
  const jsxInner = innerSvg
    .replace(/stroke-width/g, "strokeWidth")
    .replace(/stroke-linecap/g, "strokeLinecap")
    .replace(/stroke-linejoin/g, "strokeLinejoin")
    .replace(/fill-rule/g, "fillRule")
    .replace(/clip-rule/g, "clipRule")
    .replace(/clip-path/g, "clipPath")
    .replace(/xmlns:xlink/g, "xmlnsXlink");

  return `import React from "react";

export interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ${componentName} = React.forwardRef<SVGSVGElement, ${componentName}Props>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      ${jsxInner}
    </svg>
  )
);

${componentName}.displayName = "${componentName}";
`;
}

// Main
function main() {
  if (!fs.existsSync(SRC_DIR)) fs.mkdirSync(SRC_DIR, { recursive: true });

  const svgFiles = fs.readdirSync(SVG_DIR).filter((f) => f.endsWith(".svg"));
  const exports = [];

  for (const file of svgFiles) {
    const name = file.replace(".svg", "");
    const componentName = toPascalCase(name) + "Icon";
    const svgContent = fs.readFileSync(path.join(SVG_DIR, file), "utf-8");

    const component = svgToComponent(svgContent, componentName);
    const outFile = `${componentName}.tsx`;

    fs.writeFileSync(path.join(SRC_DIR, outFile), component);
    exports.push({ componentName, outFile });

    console.log(`  ✓ ${file} → ${outFile}`);
  }

  // Generate index.ts
  const indexContent =
    exports
      .map((e) => `export { ${e.componentName} } from "./${e.outFile.replace(".tsx", "")}";`)
      .join("\n") +
    "\n" +
    exports
      .map(
        (e) => `export type { ${e.componentName}Props } from "./${e.outFile.replace(".tsx", "")}";`,
      )
      .join("\n") +
    "\n";

  fs.writeFileSync(path.join(SRC_DIR, "index.ts"), indexContent);

  console.log(`\n  Generated ${exports.length} icon components + index.ts`);
}

main();
