#!/usr/bin/env node
/**
 * DS의 빌드된 dist를 읽어서 MCP가 사용할 manifest.json을 생성한다.
 * 출력: packages/mcp/manifest.json
 *
 * 실행 전 packages/{tokens,react,icons}가 빌드되어 있어야 한다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

function readDtsExports(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".d.ts") && !f.endsWith(".d.ts.map"))
    .map((f) => f.replace(/\.d\.ts$/, ""))
    .filter((n) => n !== "index" && /^[A-Z]/.test(n));
}

function extractPropsFromDts(dtsPath) {
  if (!fs.existsSync(dtsPath)) return null;
  const src = fs.readFileSync(dtsPath, "utf-8");
  const propsMatch =
    src.match(/(?:type|interface)\s+(\w+Props)\s*=?\s*\{([^}]*)\}/s) ||
    src.match(/(?:type|interface)\s+(\w+Props)\s+extends\s+[^{]+\{([^}]*)\}/s);
  if (!propsMatch) return null;
  const body = propsMatch[2];
  const props = [];
  const lineRegex = /(\w+)(\??):\s*([^;\n]+)[;\n]/g;
  let m;
  while ((m = lineRegex.exec(body)) !== null) {
    props.push({ name: m[1], optional: m[2] === "?", type: m[3].trim() });
  }
  return { typeName: propsMatch[1], props };
}

const reactDist = path.join(repoRoot, "packages/react/dist");
const iconsDist = path.join(repoRoot, "packages/icons/dist");
const tokensCssPath = path.join(repoRoot, "packages/tokens/dist/tokens.css");

/* ─── 각 DS 패키지의 메타정보(deps, peer, version) 수집 ─── */
function readPkg(relDir) {
  const pkgPath = path.join(repoRoot, relDir, "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  return {
    name: pkg.name,
    version: pkg.version,
    dependencies: pkg.dependencies ?? {},
    peerDependencies: pkg.peerDependencies ?? {},
    cssExports: Object.entries(pkg.exports ?? {})
      .filter(([k, v]) => typeof v === "string" && v.endsWith(".css"))
      .map(([k]) => `${pkg.name}${k.replace(/^\./, "")}`),
  };
}

const packagesMeta = [
  readPkg("packages/tokens"),
  readPkg("packages/react"),
  readPkg("packages/icons"),
  readPkg("packages/tailwind-preset"),
].filter(Boolean);

const componentNames = readDtsExports(reactDist);
const components = componentNames.map((name) => {
  const dtsPath = path.join(reactDist, `${name}.d.ts`);
  const propsInfo = extractPropsFromDts(dtsPath);
  return {
    name,
    props: propsInfo?.props ?? [],
    dtsRelPath: `packages/react/dist/${name}.d.ts`,
  };
});

const icons = readDtsExports(iconsDist).filter((n) => n.endsWith("Icon"));

let tokens = [];
if (fs.existsSync(tokensCssPath)) {
  const css = fs.readFileSync(tokensCssPath, "utf-8");
  const seen = new Map();
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    if (!seen.has(m[1])) seen.set(m[1], m[2].trim());
  }
  tokens = [...seen.entries()].map(([name, value]) => {
    const group = name.replace(/^--/, "").split("-")[0];
    return { name, value, group };
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  repoRoot,
  packages: packagesMeta,
  components: components.sort((a, b) => a.name.localeCompare(b.name)),
  icons: icons.sort(),
  tokens: tokens.sort((a, b) => a.name.localeCompare(b.name)),
};

const outPath = path.resolve(__dirname, "../manifest.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log(
  `[mcp] manifest written: ${path.relative(repoRoot, outPath)} ` +
    `(components=${manifest.components.length}, icons=${manifest.icons.length}, tokens=${manifest.tokens.length})`,
);
