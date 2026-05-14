#!/usr/bin/env node
/**
 * DS의 빌드된 dist를 읽어서 MCP가 사용할 컴포넌트 카탈로그를 생성한다.
 * 출력: packages/mcp/catalog.json
 *
 * (참고) packages/mcp/manifest.json 은 mcpb(Desktop Extension) 번들 스펙용으로
 * 별도 관리한다. 컴포넌트/토큰/아이콘 메타데이터는 catalog.json 에만 들어간다.
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

/**
 * d.ts에서 `<ComponentName>Props` 인터페이스/타입을 찾아 props를 추출한다.
 * - 첫 번째 `*Props` 가 아니라 파일명과 매칭되는 `<basename>Props` 를 우선 선택
 *   (예: Button.d.ts → `ButtonProps`, `ButtonSlotProps`/`ButtonOptionProps` 등은 무시)
 * - `extends ...` 가 있어도 본문 `{ ... }` 만 캡처
 * - 중첩 제네릭(`Record<string, X<Y>>`) 까지 한 prop 라인으로 읽도록 라인 분할 후 파싱
 */
/**
 * 같은 .d.ts (또는 다른 컴포넌트 .d.ts) 안의
 *   `(export )?type <Name> = "a" | "b" | "c";`
 * 류 string-literal union 선언을 수집해 typeName → string[] 맵을 만든다.
 * 이걸 갖고 prop.type 이 named union (e.g. IconButtonSize) 일 때 실제 멤버를 풀어준다.
 */
function collectStringLiteralUnions(dirs) {
  const result = {};
  // type Name = "a" | "b" ...;  (한 줄 또는 여러 줄, 우측은 string-literal | 만)
  const re = /(?:export\s+)?(?:declare\s+)?type\s+(\w+)\s*=\s*((?:\s*"[^"]*"\s*(?:\|\s*)?)+);/g;
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".d.ts"));
    for (const f of files) {
      const src = fs.readFileSync(path.join(dir, f), "utf-8");
      let m;
      while ((m = re.exec(src)) !== null) {
        const name = m[1];
        const values = [...m[2].matchAll(/"([^"]*)"/g)].map((x) => x[1]);
        if (values.length > 0) result[name] = values;
      }
    }
  }
  return result;
}

/**
 * prop.type 문자열에서 허용값(string[])을 추출.
 *   - "a" | "b" 인라인 union → ["a", "b"]
 *   - 명명된 union (IconButtonSize) → unionMap 조회
 *   - 위 두 가지 외 (boolean / number / 객체 / 함수 / 미해석 타입 등) → null
 * `| undefined` / `| null` 은 무시.
 */
function resolvePropAllowedValues(typeStr, unionMap) {
  if (!typeStr) return null;
  // 파이프로 잘라 옵셔널 키워드를 제거
  const parts = typeStr
    .split("|")
    .map((p) => p.trim())
    .filter((p) => p && p !== "undefined" && p !== "null");
  if (parts.length === 0) return null;

  const collected = [];
  for (const part of parts) {
    const lit = part.match(/^"([^"]*)"$/);
    if (lit) {
      collected.push(lit[1]);
      continue;
    }
    if (/^[A-Za-z_][\w]*$/.test(part) && unionMap[part]) {
      collected.push(...unionMap[part]);
      continue;
    }
    // 이 prop 은 string-literal union 형태가 아님 → 검증 대상 아님
    return null;
  }
  return collected.length > 0 ? [...new Set(collected)] : null;
}

function extractPropsFromDts(dtsPath) {
  if (!fs.existsSync(dtsPath)) return null;
  const src = fs.readFileSync(dtsPath, "utf-8");
  const basename = path.basename(dtsPath).replace(/\.d\.ts$/, "");
  const preferredName = `${basename}Props`;

  // 모든 `<Name>Props` 선언을 수집 (interface/type 둘 다)
  const declRegex = /(?:export\s+)?(?:interface|type)\s+(\w+Props)\b/g;
  const candidates = [];
  let dm;
  while ((dm = declRegex.exec(src)) !== null) {
    candidates.push({ name: dm[1], index: dm.index });
  }
  if (candidates.length === 0) return null;

  const chosen =
    candidates.find((c) => c.name === preferredName) ??
    candidates.find((c) => /Slot|Option|Item/.test(c.name) === false) ??
    candidates[0];

  // 선택된 인터페이스의 `{ ... }` 본문을 brace 매칭으로 정확히 추출
  const after = src.slice(chosen.index);
  const open = after.indexOf("{");
  if (open === -1) return null;
  let depth = 0;
  let end = -1;
  for (let i = open; i < after.length; i++) {
    const ch = after[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return null;
  const body = after.slice(open + 1, end);

  // prop 라인 파싱 — `;` 로 분리 (블록 주석/한 줄 주석 모두 제거 후)
  const cleaned = body.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*\n/g, "\n");
  const props = [];
  for (const raw of cleaned.split(";")) {
    const line = raw.trim();
    if (!line) continue;
    // 형태: <name>?: <type>  | "<quoted>"?: <type>
    const m = line.match(/^(?:"([^"]+)"|(\w+))(\??):\s*([\s\S]+)$/);
    if (!m) continue;
    const name = m[1] ?? m[2];
    props.push({ name, optional: m[3] === "?", type: m[4].trim().replace(/\s+/g, " ") });
  }
  return { typeName: chosen.name, props };
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
  const hasBaseCssExport = Boolean(tokensPkg.exports?.["./css"]);

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

    const cssImport = cssExports.includes(slug)
      ? `@nudge-eap/tokens/css/${slug}`
      : slug === "nudge-eap" && hasBaseCssExport
        ? "@nudge-eap/tokens/css"
        : null;
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
const unionMap = collectStringLiteralUnions([reactDist]);
const components = componentNames.map((name) => {
  const dtsPath = path.join(reactDist, `${name}.d.ts`);
  const propsInfo = extractPropsFromDts(dtsPath);
  const props = (propsInfo?.props ?? []).map((p) => {
    const allowedValues = resolvePropAllowedValues(p.type, unionMap);
    return allowedValues ? { ...p, allowedValues } : p;
  });
  return {
    name,
    props,
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

const catalog = {
  generatedAt: new Date().toISOString(),
  packages: packagesMeta,
  components: components.sort((a, b) => a.name.localeCompare(b.name)),
  icons: icons.sort(),
  tokens: tokens.sort((a, b) => a.name.localeCompare(b.name)),
  brands: brands.sort((a, b) => a.slug.localeCompare(b.slug)),
};

const outPath = path.resolve(__dirname, "../catalog.json");
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

// 기존 manifest.json (컴포넌트 카탈로그 자리) 은 mcpb 번들 스펙용으로 자리를 비워야 한다.
// 과거 빌드 산출물이 남아 있으면 제거하여 헷갈리는 일을 막는다.
const legacyManifestPath = path.resolve(__dirname, "../manifest.json");
if (fs.existsSync(legacyManifestPath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(legacyManifestPath, "utf-8"));
    if (parsed && (parsed.components || parsed.repoRoot)) {
      fs.unlinkSync(legacyManifestPath);
      console.log("[mcp] removed legacy manifest.json (catalog moved to catalog.json)");
    }
  } catch {
    // mcpb manifest 가 들어가 있으면 JSON parse 후 components 없음 → 그대로 둠
  }
}

console.log(
  `[mcp] catalog written: ${path.relative(repoRoot, outPath)} ` +
    `(components=${catalog.components.length}, icons=${catalog.icons.length}, ` +
    `tokens=${catalog.tokens.length}, brands=${catalog.brands.length})`,
);
