#!/usr/bin/env node
/**
 * DS의 빌드된 dist를 읽어서 MCP가 사용할 컴포넌트 카탈로그를 생성한다.
 * 출력: packages/mcp/catalog.json
 *
 * (참고) packages/mcp/manifest.json 은 mcpb(Desktop Extension) 번들 스펙용으로
 * 별도 관리한다. 컴포넌트/토큰/아이콘 메타데이터는 catalog.json 에만 들어간다.
 *
 * 실행 전 packages/{tokens,react,icons,styles}가 빌드되어 있어야 한다.
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
 * 아이콘 패키지는 dist/index.d.ts 하나로 모든 아이콘을 re-export 한다
 * (per-icon .d.ts 는 mono/ · multicolor/ 하위에 있어 top-level readDtsExports 로는 안 잡힘).
 * index.d.ts 의 `export { XIcon } from "..."` 선언에서 컴포넌트 이름만 추출한다.
 * `export type { XIconProps }` 같은 type-only re-export 는 `export\s+\{` 패턴과
 * `\w*Icon$` 필터로 자연스럽게 제외된다.
 */
function readIconExports(distDir) {
  const indexDts = path.join(distDir, "index.d.ts");
  if (!fs.existsSync(indexDts)) {
    return readDtsExports(distDir).filter((n) => n.endsWith("Icon"));
  }
  const src = fs.readFileSync(indexDts, "utf-8");
  const names = new Set();
  const re = /export\s+\{([^}]*)\}\s*from/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    for (const part of m[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        .trim();
      if (/^[A-Z]\w*Icon$/.test(name)) names.add(name);
    }
  }
  return [...names];
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

  const dirs = fs.existsSync(brandsRoot)
    ? fs
        .readdirSync(brandsRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    : [];

  const slugs = new Set([
    ...dirs,
    ...cssExports,
    ...jsThemes.filter((name) => !name.includes(".")),
  ]);

  return [...slugs].map((slug) => {
    const designMd = path.join(brandsRoot, slug, "DESIGN.md");
    const fm = readBrandFrontmatter(designMd) ?? {
      version: undefined,
      name: slug,
      description: undefined,
      colors: {},
      fontFamilies: [],
    };

    const cssImport = cssExports.includes(slug)
      ? `@nudge-design/tokens/css/${slug}`
      : slug === "nudge-eap" && hasBaseCssExport
        ? "@nudge-design/tokens/css"
        : null;
    const jsExport = jsThemes.includes(slug) ? `@nudge-design/tokens/brands` : null;

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
      designMdRelPath: fs.existsSync(designMd) ? `brands/${slug}/DESIGN.md` : "",
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
      .filter(([_k, v]) => typeof v === "string" && v.endsWith(".css"))
      .map(([k]) => `${pkg.name}${k.replace(/^\./, "")}`),
  };
}

const packagesMeta = [
  readPkg("packages/tokens"),
  readPkg("packages/react"),
  readPkg("packages/icons"),
  readPkg("packages/tailwind-preset"),
  // @nudge-design/styles: framework-agnostic CSS bundle. @nudge-design/react 가
  // 빌드 시 이 CSS 를 미러해 자기 dist/styles.css 로 노출하므로 외부 React
  // 프로젝트는 여전히 @nudge-design/react/styles.css 를 import 하면 된다.
  readPkg("packages/styles"),
  // @nudge-design/html: vanilla Web Components (experimental, 별도 라이프사이클).
  // .mcpb 에 동봉되며 외부 mockup 프로젝트에서 install 가능.
  readPkg("packages/html"),
].filter(Boolean);

const componentNames = readDtsExports(reactDist);
const unionMap = collectStringLiteralUnions([reactDist]);

/**
 * `nds-icon-button` → `IconButton`. emit-manifest 가 components 와 nds-* 메타를
 * cross-link 할 때 사용. parser.ts 의 ndsTagToComponentName 과 동일 컨벤션.
 *
 * 일부 React 명명이 PascalCase 단순 변환과 다른 경우 (FAB 약어, SegmentedControl 풀네임)
 * 는 NDS_TAG_TO_REACT_ALIAS 로 보정한다 — 둘은 의미적으로 동일 컴포넌트라 한 엔트리에 합치는 게 맞음.
 */
const NDS_TAG_TO_REACT_ALIAS = {
  "nds-fab": "FAB",
  "nds-segmented": "SegmentedControl",
};
function ndsTagToPascal(tag) {
  if (NDS_TAG_TO_REACT_ALIAS[tag]) return NDS_TAG_TO_REACT_ALIAS[tag];
  const m = /^nds-([a-z][a-z0-9-]*)$/.exec(tag);
  if (!m) return null;
  return m[1]
    .split("-")
    .map((p) => (p.length === 0 ? "" : p[0].toUpperCase() + p.slice(1)))
    .join("");
}

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

const icons = readIconExports(iconsDist);

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

// @nudge-design/html 의 custom element 태그 목록 — validate_html_mockup 이
// "이 <nds-foo> 태그가 진짜 존재하나?" 를 알기 위해 catalog 에 박아둔다.
// packages/html/src/components/nds-*.ts 파일의 static elementName 을 우선 읽는다.
// 한 파일에 nds-select-option / nds-footer-* 같은 보조 엘리먼트가 같이 등록될 수
// 있으므로 파일명만 보면 validator false positive 가 생긴다.
function collectNdsHtmlTags() {
  const dir = path.join(repoRoot, "packages/html/src/components");
  if (!fs.existsSync(dir)) return [];
  const tags = new Set();
  for (const file of fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("nds-") && f.endsWith(".ts") && !f.endsWith(".styles.ts"))) {
    const src = fs.readFileSync(path.join(dir, file), "utf-8");
    tags.add(file.replace(/\.ts$/, ""));
    for (const match of src.matchAll(/static\s+elementName\s*=\s*["'](nds-[a-z0-9-]+)["']/g)) {
      tags.add(match[1]);
    }
  }
  return [...tags].sort();
}
const ndsHtmlTags = collectNdsHtmlTags();

/**
 * 각 nds-* 컴포넌트의 attribute enum 추출.
 *
 * 패턴 (컨벤션):
 *   const VARIANTS: readonly XxxVariant[] = ["a", "b", ...];
 *   const SIZES:    readonly XxxSize[]    = [...];
 *   const COLORS:   readonly XxxColor[]   = [...];
 *   const TONES:    readonly XxxTone[]    = [...];
 *   const ORIENTATIONS: readonly XxxOrientation[] = [...];
 *
 * BUTTON_VARIANTS 처럼 prefix 가 있어도 잡는다.
 * sibling .styles.ts 파일도 같이 본다 (nds-button 만 styles 분리).
 *
 * 결과: { tag: "nds-button", attrs: { variant: [...], size: [...], color: [...] } }
 */
function collectNdsHtmlElements() {
  const dir = path.join(repoRoot, "packages/html/src/components");
  if (!fs.existsSync(dir)) return [];

  const ATTR_KEYS = {
    VARIANTS: "variant",
    SIZES: "size",
    COLORS: "color",
    TONES: "tone",
    ORIENTATIONS: "orientation",
  };

  const elementFiles = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("nds-") && f.endsWith(".ts") && !f.endsWith(".styles.ts"))
    .sort();

  const out = [];
  for (const file of elementFiles) {
    const tag = file.replace(/\.ts$/, "");
    const mainSrc = fs.readFileSync(path.join(dir, file), "utf-8");
    const stylesPath = path.join(dir, file.replace(/\.ts$/, ".styles.ts"));
    const stylesSrc = fs.existsSync(stylesPath) ? fs.readFileSync(stylesPath, "utf-8") : "";
    const combined = mainSrc + "\n" + stylesSrc;

    const attrs = {};
    for (const [marker, attrName] of Object.entries(ATTR_KEYS)) {
      // 정규식: `const <prefix?>VARIANTS<:type>? = ["a", "b", ...]`
      const re = new RegExp(`const\\s+(?:[A-Z_]+_)?${marker}\\b[^=]*=\\s*\\[([^\\]]+)\\]`, "m");
      const m = combined.match(re);
      if (!m) continue;
      const values = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
      if (values.length > 0) attrs[attrName] = values;
    }
    out.push({ tag, attrs, observedAttrs: extractObservedAttrs(mainSrc, tag) });
  }
  return out;
}

/**
 * 파일의 메인 엘리먼트(`static elementName === tag`)의 observedAttributes 배열을 뽑는다.
 * 한 파일에 보조 엘리먼트(nds-accordion-item 등)가 같이 있으면 그쪽 observedAttributes
 * 까지 섞이지 않도록, elementName 선언 위치부터 첫 observedAttributes return 만 읽는다.
 * elementName 선언이 없으면(메인 = 파일명) 파일 첫 observedAttributes 로 폴백.
 * react props ↔ html attr 이름 set parity 비교(check-mirror-parity)의 한쪽 축.
 */
function extractObservedAttrs(src, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const elIdx = src.search(new RegExp(`static\\s+elementName\\s*=\\s*["']${escaped}["']`));
  const scope = elIdx >= 0 ? src.slice(elIdx) : src;
  const m = scope.match(
    /static\s+get\s+observedAttributes\s*\([^)]*\)\s*:[^{]*\{\s*return\s*\[([\s\S]*?)\]/,
  );
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}
const ndsHtmlElements = collectNdsHtmlElements();

// UI 컴포넌트가 아니라 개발 도구 / 오버레이로 분류되는 nds-* 태그.
// catalog 의 components 리스트에는 노출하지 않는다 (find_component / list_components 가
// 이걸 진짜 UI primitive 로 오해하지 않도록). validate 용 태그 목록에는 그대로 남아 있다.
const DEV_ONLY_NDS_TAGS = new Set(["nds-inspector"]);

// nds-* 메타를 components 엔트리에 cross-link.
// PascalCase 로 매칭되는 React 컴포넌트가 있으면 htmlTag / htmlAttrs 를 채워준다.
// React 쪽에 같은 이름이 없는 nds-* 는 (html 전용 컴포넌트로 신규 추가된 경우)
// components 에 합류시킨다 — 이러면 외부 mockup 이 html 만 써도 find_component 가 잡아냄.
{
  const componentIndex = new Map(components.map((c) => [c.name, c]));
  for (const el of ndsHtmlElements) {
    if (DEV_ONLY_NDS_TAGS.has(el.tag)) continue;
    const pascal = ndsTagToPascal(el.tag);
    if (!pascal) continue;
    const existing = componentIndex.get(pascal);
    if (existing) {
      existing.htmlTag = el.tag;
      if (Object.keys(el.attrs).length > 0) existing.htmlAttrs = el.attrs;
      if (el.observedAttrs.length > 0) existing.htmlObservedAttrs = el.observedAttrs;
      continue;
    }
    // React 에 짝이 없는 html-only 컴포넌트 — props 는 없지만 htmlAttrs 가 곧 prop 스펙 역할.
    const entry = {
      name: pascal,
      props: [],
      dtsRelPath: `packages/html/src/components/${el.tag}.ts`,
      htmlTag: el.tag,
    };
    if (Object.keys(el.attrs).length > 0) entry.htmlAttrs = el.attrs;
    if (el.observedAttrs.length > 0) entry.htmlObservedAttrs = el.observedAttrs;
    components.push(entry);
    componentIndex.set(pascal, entry);
  }
}

const catalog = {
  generatedAt: new Date().toISOString(),
  packages: packagesMeta,
  components: components.sort((a, b) => a.name.localeCompare(b.name)),
  icons: icons.sort(),
  tokens: tokens.sort((a, b) => a.name.localeCompare(b.name)),
  brands: brands.sort((a, b) => a.slug.localeCompare(b.slug)),
  ndsHtmlTags,
  ndsHtmlElements,
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
