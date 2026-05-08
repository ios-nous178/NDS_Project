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
const tokensDistDir = path.join(repoRoot, "packages/tokens/dist");
const tokensBrandsDir = path.join(tokensDistDir, "brands");
const tokensPkgPath = path.join(repoRoot, "packages/tokens/package.json");
const brandsRoot = path.join(repoRoot, "brands");

/* ─── 브랜드 수집 ──────────────────────────────────────────────
 * brands/{name}/DESIGN.md 의 YAML 프론트매터(--- ... ---)에서
 * version / name / description / colors.* / typography.*.fontFamily 를 읽고,
 * packages/tokens/package.json 의 exports 와 dist/brands 디렉토리를 함께 보고
 * - css export 존재 여부
 * - JS theme export 존재 여부
 * 를 정리한다. 새 브랜드 폴더가 추가되면 자동으로 잡힌다.
 * ───────────────────────────────────────────────────────────── */

function readBrandFrontmatter(designMdPath) {
  if (!fs.existsSync(designMdPath)) return null;
  const text = fs.readFileSync(designMdPath, "utf-8");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm = {
    version: undefined,
    name: undefined,
    description: undefined,
    colors: {},
    fontFamilies: new Set(),
  };

  const lines = match[1].split("\n");
  let section = null;
  let typeStyle = null; // current type style key (display / headline-1 ...)

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim() || line.trim().startsWith("#")) continue;

    // top level keys
    const top = line.match(/^([a-zA-Z][\w-]*):\s*(.*)$/);
    if (top && !line.startsWith(" ")) {
      section = top[1];
      const rest = top[2].trim();
      if (section === "version" && rest) fm.version = stripQuotes(rest);
      if (section === "name" && rest) fm.name = stripQuotes(rest);
      if (section === "description" && rest) fm.description = stripQuotes(rest);
      typeStyle = null;
      continue;
    }

    // colors.<key>: "#xxx"
    if (section === "colors") {
      const m = line.match(/^\s+([\w-]+):\s*"?(#[0-9a-fA-F]{3,8}|[\w(),.\s]+?)"?\s*$/);
      if (m) {
        fm.colors[m[1]] = m[2].replace(/^"|"$/g, "");
        continue;
      }
    }

    // typography.<key>.fontFamily: <name>
    if (section === "typography") {
      // 2-space indent = type style key (e.g. "  display:"), 4-space indent = property
      const styleHead = line.match(/^\s{2}([\w-]+):\s*$/);
      if (styleHead) {
        typeStyle = styleHead[1];
        continue;
      }
      const ff = line.match(/^\s{4}fontFamily:\s*"?([^"]+?)"?\s*$/);
      if (ff && typeStyle) {
        fm.fontFamilies.add(ff[1]);
        continue;
      }
    }
  }

  return {
    version: fm.version,
    name: fm.name,
    description: fm.description,
    colors: fm.colors,
    fontFamilies: [...fm.fontFamilies],
  };
}

function stripQuotes(s) {
  return s.replace(/^"|"$/g, "");
}

function collectBrands() {
  if (!fs.existsSync(brandsRoot)) return [];

  const tokensPkg = fs.existsSync(tokensPkgPath)
    ? JSON.parse(fs.readFileSync(tokensPkgPath, "utf-8"))
    : { exports: {} };
  const cssExports = Object.keys(tokensPkg.exports ?? {})
    .filter((k) => k.startsWith("./css/"))
    .map((k) => k.replace(/^\.\/css\//, ""));

  const jsThemes = fs.existsSync(tokensBrandsDir)
    ? fs
        .readdirSync(tokensBrandsDir)
        .filter((f) => f.endsWith(".d.ts") && !f.endsWith(".d.ts.map"))
        .map((f) => f.replace(/\.d\.ts$/, ""))
        .filter((n) => n !== "index" && n !== "types")
    : [];

  const dirs = fs
    .readdirSync(brandsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  return dirs.map((slug) => {
    const designMd = path.join(brandsRoot, slug, "DESIGN.md");
    const fm = readBrandFrontmatter(designMd) ?? {
      version: undefined,
      name: slug,
      description: undefined,
      colors: {},
      fontFamilies: [],
    };

    const cssImport = cssExports.includes(slug) ? `@nudge-eap/tokens/css/${slug}` : null;
    const jsExport = jsThemes.includes(slug) ? `@nudge-eap/tokens/brands` : null;

    return {
      slug,
      name: fm.name ?? slug,
      version: fm.version,
      description: fm.description,
      primaryColor: fm.colors.primary ?? null,
      keyColors: {
        primary: fm.colors.primary ?? null,
        secondary: fm.colors.secondary ?? null,
        error: fm.colors.error ?? null,
        caution: fm.colors.caution ?? null,
        success: fm.colors.success ?? null,
        surface: fm.colors.surface ?? null,
        onSurface: fm.colors["on-surface"] ?? null,
      },
      fontFamilies: fm.fontFamilies,
      designMdRelPath: `brands/${slug}/DESIGN.md`,
      cssImport,
      jsExport,
      ready: Boolean(cssImport),
    };
  });
}

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

const brands = collectBrands();

const manifest = {
  generatedAt: new Date().toISOString(),
  repoRoot,
  packages: packagesMeta,
  components: components.sort((a, b) => a.name.localeCompare(b.name)),
  icons: icons.sort(),
  tokens: tokens.sort((a, b) => a.name.localeCompare(b.name)),
  brands: brands.sort((a, b) => a.slug.localeCompare(b.slug)),
};

const outPath = path.resolve(__dirname, "../manifest.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log(
  `[mcp] manifest written: ${path.relative(repoRoot, outPath)} ` +
    `(components=${manifest.components.length}, icons=${manifest.icons.length}, ` +
    `tokens=${manifest.tokens.length}, brands=${manifest.brands.length})`,
);
