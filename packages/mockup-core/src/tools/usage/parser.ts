/**
 * tools/usage/parser.ts — 순수 파싱 레이어.
 *
 * mockup .tsx 소스를 받아 MockupUsage 데이터 구조로 변환한다. 파일 시스템 접근은
 * `parseMockupUsage(filePath)` 호출 시의 readFileSync 한 번만 — `parseMockupSource`
 * 를 쓰면 디스크 없이 문자열만으로도 파싱 가능하므로 단위 테스트에 적합하다.
 *
 * webhook · log · queue · scan 같은 IO 는 sibling `./tracker.ts` 에 분리되어 있다.
 */
import { readFileSync } from "node:fs";
import { basename, relative, resolve, sep } from "node:path";
import { parse } from "@babel/parser";
import type {
  Node,
  ImportDeclaration,
  JSXElement,
  JSXOpeningElement,
  JSXAttribute,
  JSXIdentifier,
  JSXMemberExpression,
} from "@babel/types";
import type {
  Brand,
  Context,
  MockupUsage,
  DsUsageEntry,
  AdminCmsEntry,
  CustomNativeEntry,
  ExternalEntry,
} from "../../types/usage.js";

/**
 * DS 패키지로 인정하는 import source prefix 들.
 * `@nudge-design/html` 도 DS 로 카운트한다 — html 패키지의 Web Component (`<nds-button>` 등) 는
 * lowercase JSX 태그로 등장하므로 import 출처보다 태그 이름으로 판별한다 (NDS_HTML_TAG_RE 참고).
 * 다만 클래스 단위로 import 해서 직접 register 하는 경우도 있으니, import source 도 함께 인정.
 */
const DS_PACKAGE_PREFIXES = ["@nudge-design/react", "@nudge-design/html"] as const;
const ADMIN_CMS_PACKAGE = "antd";
const TRACKED_NATIVE_TAGS = new Set([
  "button",
  "input",
  "select",
  "textarea",
  "a",
  "label",
  "form",
  "fieldset",
]);
/** `nds-button`, `nds-icon-button` 같은 DS Web Component tag — kebab → PascalCase 매핑용. */
const NDS_HTML_TAG_RE = /^nds-([a-z][a-z0-9-]*)$/;

const TRACKED_VARIANT_PROPS = ["variant", "size", "color", "tone", "kind"] as const;

/* ───────────── avoidable(있는데 안 씀) vs forced(없어서 못 씀) 분류 ─────────────
 *
 * non-DS 요소 하나하나를 카탈로그에 비춰 "DS 대체재가 있느냐"로 가른다.
 *  - avoidable: DS 에 같은 역할의 컴포넌트가 있는데 native/antd/external 로 그림 → 회피 가능한 미스
 *  - forced:    DS 에 대체재가 없어 어쩔 수 없이 custom → DS 커버리지 공백 신호
 *
 * 카탈로그는 `configureUsageCatalog` 로 주입한다(validator 들과 동일한 SSOT 패턴).
 * MCP 서버 / 데스크탑 하네스가 부트스트랩 시 1회 호출. 미주입이면 아래 DEFAULT_DS_NAMES
 * (항상 존재하는 4종 native 대체재)만으로 보수적으로 판정한다.
 */

/** native HTML 태그 → DS 컴포넌트 후보 이름. 카탈로그 멤버십으로 존재 여부 확정. */
const NATIVE_DS_CANDIDATE: Record<string, string> = {
  button: "Button",
  input: "Input",
  select: "Select",
  textarea: "Textarea",
  a: "Link",
  label: "FormLabel",
  form: "Form",
  fieldset: "Fieldset",
};

/** 카탈로그 미주입 시 fallback — DS 에 확실히 존재하는 native 대체재(= html convert TAG_REWRITES 셋). */
const DEFAULT_DS_NAMES = new Set(["Button", "Input", "Select", "Textarea"]);

let dsComponentNames: Set<string> | null = null;

/**
 * usage 분류기에 DS 컴포넌트 카탈로그(이름 셋)를 주입한다. avoidable/forced 판정 정밀도를 올림.
 * 미주입이어도 동작하지만(DEFAULT_DS_NAMES 만 사용), 외부 프로젝트 정밀 집계엔 주입 권장.
 */
export function configureUsageCatalog(componentNames: Set<string>): void {
  dsComponentNames = componentNames;
}

/** DS 카탈로그에 후보 이름이 존재하는가. 미주입이면 항상 존재하는 native 대체재만 true. */
function hasDsEquivalent(candidate: string | null | undefined): boolean {
  if (!candidate) return false;
  if (dsComponentNames) return dsComponentNames.has(candidate);
  return DEFAULT_DS_NAMES.has(candidate);
}

interface ImportInfo {
  source: string;
  imported: string; // original name in source module (or "default", "*")
}

export interface ParseOptions {
  /** Override the context auto-detected from imports. */
  contextHint?: Context;
  /** Override brand auto-detected from filename/path. */
  brandHint?: Brand;
  /** Override mockup display name. */
  mockupNameHint?: string;
  /** Working directory used to relativize `mockupFile`. Defaults to cwd. */
  cwd?: string;
}

export function parseMockupUsage(filePath: string, opts: ParseOptions = {}): MockupUsage {
  const absPath = resolve(filePath);
  const source = readFileSync(absPath, "utf8");
  return parseMockupSource(source, absPath, opts);
}

/**
 * Pure variant — parse a mockup directly from a source string. Used by tests
 * and any future caller that already has the source in memory.
 */
export function parseMockupSource(
  source: string,
  absPath: string,
  opts: ParseOptions = {},
): MockupUsage {
  const cwd = opts.cwd ?? process.cwd();
  const warnings: string[] = [];

  let ast: Node;
  try {
    ast = parse(source, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: true,
    }) as unknown as Node;
  } catch (err) {
    warnings.push(`parser failed: ${(err as Error).message}`);
    return emptyUsage(absPath, cwd, opts, warnings);
  }

  // identifier (local name) -> { source, imported }
  const importMap = new Map<string, ImportInfo>();
  collectImports(ast, importMap);

  const dsCounts = new Map<string, DsUsageEntry>();
  const cmsCounts = new Map<string, AdminCmsEntry>();
  const nativeCounts = new Map<string, CustomNativeEntry>();
  const externalCounts = new Map<string, ExternalEntry>();

  walkJsx(ast, (jsx) => {
    const opening = jsx.openingElement;
    const nameInfo = readElementName(opening);
    if (!nameInfo) return;

    const { rootName, slot, isMemberExpression: _ignore } = nameInfo;

    if (isLowerCaseTag(rootName) && !slot) {
      // DS Web Component (<nds-button> 등) — PascalCase 컴포넌트명으로 매핑해서 dsCounts 합산.
      const ndsName = ndsTagToComponentName(rootName);
      if (ndsName) {
        const props = readVariantProps(opening);
        incrementDs(dsCounts, ndsName, undefined, props);
        return;
      }
      // native HTML element
      if (!TRACKED_NATIVE_TAGS.has(rootName)) return;
      incrementNative(nativeCounts, rootName);
      return;
    }

    const imp = importMap.get(rootName);
    if (!imp) {
      // capitalized but not imported — likely a local helper component defined in same file
      // Track as external with source "<local>" for visibility
      incrementExternal(externalCounts, rootName, "<local>");
      return;
    }

    if (isDsSource(imp.source)) {
      const props = readVariantProps(opening);
      incrementDs(dsCounts, rootName, slot, props);
      return;
    }
    if (imp.source === ADMIN_CMS_PACKAGE) {
      incrementCms(cmsCounts, slot ? `${rootName}.${slot}` : rootName);
      return;
    }
    incrementExternal(externalCounts, slot ? `${rootName}.${slot}` : rootName, imp.source);
  });

  const ds = [...dsCounts.values()].sort(sortByComponent);
  const adminCms = [...cmsCounts.values()].sort(sortByComponent);
  const customNative = [...nativeCounts.values()].sort((a, b) => a.tag.localeCompare(b.tag));
  const external = [...externalCounts.values()].sort(sortByComponent);

  const context: Context = opts.contextHint ?? detectContext(importMap);
  const brand: Brand = opts.brandHint ?? detectBrand(absPath);
  const mockupName = opts.mockupNameHint ?? defaultMockupName(absPath);

  const totalDs = sumCount(ds);
  const totalAdminCms = sumCount(adminCms);
  const totalCustomNative = customNative.reduce((acc, n) => acc + n.count, 0);
  const totalExternal = sumCount(external);
  const totalTracked = totalDs + totalAdminCms + totalCustomNative + totalExternal;
  const dsRatio = totalTracked === 0 ? 0 : Math.round((totalDs / totalTracked) * 100);

  // non-DS 요소를 avoidable(대체재 있음) / forced(대체재 없음)로 가른다.
  //  · native: 태그 → DS 후보 이름 매핑 후 카탈로그 멤버십.
  //  · antd / external: 컴포넌트 베이스 이름(slot 제거)이 그대로 DS 카탈로그에 있으면 avoidable.
  //
  // 카탈로그(configureUsageCatalog) 미주입 시 hasDsEquivalent 는 native 4종(DEFAULT_DS_NAMES)
  // 으로만 판정하므로, antd/external 대부분이 forced 로 오분류돼 채택률(adoptionRatio)이 실제보다
  // 높게 잡힌다. 이 silent degradation 을 parserWarnings 로 자가 보고해 "조용한 부풀림"을
  // 호출부가 인지할 수 있게 한다. (MCP 서버 경로는 server.ts 가 부트스트랩 시 자동 주입한다.)
  if (
    dsComponentNames === null &&
    (cmsCounts.size > 0 || externalCounts.size > 0 || nativeCounts.size > 0)
  ) {
    warnings.push(
      "DS 카탈로그 미주입(configureUsageCatalog 미호출) — avoidable/forced 분류가 native 4종" +
        "(Button/Input/Select/Textarea) fallback 으로만 이뤄져 채택률(adoptionRatio)이 실제보다 높게" +
        " 잡힐 수 있습니다. 독립 호출 시 configureUsageCatalog(componentNames) 를 먼저 호출하세요.",
    );
  }
  let avoidableMiss = 0;
  let forcedCustom = 0;
  for (const n of customNative) {
    if (hasDsEquivalent(NATIVE_DS_CANDIDATE[n.tag])) avoidableMiss += n.count;
    else forcedCustom += n.count;
  }
  for (const c of adminCms) {
    if (hasDsEquivalent(baseComponentName(c.component))) avoidableMiss += c.count;
    else forcedCustom += c.count;
  }
  for (const e of external) {
    if (hasDsEquivalent(baseComponentName(e.component))) avoidableMiss += e.count;
    else forcedCustom += e.count;
  }
  const adoptionDenom = totalDs + avoidableMiss;
  const adoptionRatio = adoptionDenom === 0 ? 0 : Math.round((totalDs / adoptionDenom) * 100);
  const overallRatio = dsRatio; // == DS / (DS + avoidable + forced)

  return {
    date: new Date().toISOString().slice(0, 10),
    mockupFile: relativeSafe(absPath, cwd),
    mockupName,
    context,
    brand,
    ds,
    adminCms,
    customNative,
    external,
    meta: {
      totalDs,
      totalAdminCms,
      totalCustomNative,
      totalExternal,
      dsRatio,
      avoidableMiss,
      forcedCustom,
      adoptionRatio,
      overallRatio,
      parserWarnings: warnings,
    },
  };
}

export function serializeUsage(usage: MockupUsage): string {
  return JSON.stringify(usage);
}

/* ───────────── shared path helper (also used by tracker.ts scan) ───────────── */

export function relativeSafe(absPath: string, cwd: string): string {
  const r = relative(cwd, absPath);
  if (r.startsWith("..") || r.length === 0) return absPath;
  return r.split(sep).join("/");
}

/* ───────────── internals ───────────── */

function emptyUsage(
  absPath: string,
  cwd: string,
  opts: ParseOptions,
  warnings: string[],
): MockupUsage {
  return {
    date: new Date().toISOString().slice(0, 10),
    mockupFile: relativeSafe(absPath, cwd),
    mockupName: opts.mockupNameHint ?? defaultMockupName(absPath),
    context: opts.contextHint ?? "unknown",
    brand: opts.brandHint ?? detectBrand(absPath),
    ds: [],
    adminCms: [],
    customNative: [],
    external: [],
    meta: {
      totalDs: 0,
      totalAdminCms: 0,
      totalCustomNative: 0,
      totalExternal: 0,
      dsRatio: 0,
      avoidableMiss: 0,
      forcedCustom: 0,
      adoptionRatio: 0,
      overallRatio: 0,
      parserWarnings: warnings,
    },
  };
}

/** "Tabs.Tab" / "Select.Option" → "Tabs" / "Select". slot 제거 후 카탈로그 매칭용 베이스 이름. */
function baseComponentName(component: string): string {
  const dot = component.indexOf(".");
  return dot === -1 ? component : component.slice(0, dot);
}

function defaultMockupName(absPath: string): string {
  return basename(absPath).replace(/\.(stories\.)?(tsx|jsx|ts|js)$/i, "");
}

function detectBrand(absPath: string): Brand {
  const lower = absPath.toLowerCase();
  if (/(trost)/i.test(lower)) return "trost";
  if (/(geniet)/i.test(lower)) return "geniet";
  // 한국어 alias 는 "캐시워크 포 비즈니스". "캐포비" / "비지니스" 오타는 legacy alias 로 backward-compat.
  if (
    /(cashwalk-biz|cashwalk[-_ ]for[-_ ]business|캐시워크[-_ ]?포[-_ ]?비[즈지]니스|캐포비)/i.test(
      lower,
    )
  )
    return "cashwalk-biz";
  if (/(nudge[-_]?eap)/i.test(lower)) return "nudge-eap";
  if (/(runmile|런마일)/i.test(lower)) return "runmile";
  return null;
}

function detectContext(importMap: Map<string, ImportInfo>): Context {
  for (const info of importMap.values()) {
    if (info.source === ADMIN_CMS_PACKAGE || info.source.startsWith("antd/")) return "admin-cms";
  }
  for (const info of importMap.values()) {
    if (isDsSource(info.source)) return "user-app";
  }
  return "unknown";
}

function isDsSource(source: string): boolean {
  for (const prefix of DS_PACKAGE_PREFIXES) {
    if (source === prefix || source.startsWith(`${prefix}/`)) return true;
  }
  return false;
}

function isLowerCaseTag(name: string): boolean {
  return /^[a-z]/.test(name);
}

/**
 * `nds-button` → `Button`, `nds-icon-button` → `IconButton`.
 * 모르는 tag (NDS prefix 가 아닌 다른 kebab custom element) 는 null.
 *
 * 일부 React 명명이 단순 PascalCase 변환과 다른 경우 (FAB 약어, SegmentedControl 풀네임)
 * 는 NDS_TAG_TO_REACT_ALIAS 로 보정. 카탈로그 (scripts/emit-manifest.mjs) 와 동일한 alias 셋.
 */
const NDS_TAG_TO_REACT_ALIAS: Record<string, string> = {
  "nds-fab": "FAB",
  "nds-segmented": "SegmentedControl",
};
export function ndsTagToComponentName(tag: string): string | null {
  if (NDS_TAG_TO_REACT_ALIAS[tag]) return NDS_TAG_TO_REACT_ALIAS[tag];
  const m = NDS_HTML_TAG_RE.exec(tag);
  if (!m) return null;
  return m[1]
    .split("-")
    .map((part) => (part.length === 0 ? "" : part[0].toUpperCase() + part.slice(1)))
    .join("");
}

function collectImports(root: Node, into: Map<string, ImportInfo>): void {
  walk(root, (node) => {
    if (node.type !== "ImportDeclaration") return;
    const decl = node as ImportDeclaration;
    const source = decl.source.value;
    for (const spec of decl.specifiers) {
      if (spec.type === "ImportSpecifier") {
        const imported =
          spec.imported.type === "Identifier" ? spec.imported.name : spec.imported.value;
        into.set(spec.local.name, { source, imported });
      } else if (spec.type === "ImportDefaultSpecifier") {
        into.set(spec.local.name, { source, imported: "default" });
      } else if (spec.type === "ImportNamespaceSpecifier") {
        into.set(spec.local.name, { source, imported: "*" });
      }
    }
  });
}

function walkJsx(root: Node, visit: (el: JSXElement) => void): void {
  walk(root, (node) => {
    if (node.type === "JSXElement") visit(node as JSXElement);
  });
}

/** Lightweight recursive walker. We don't need scope tracking. */
function walk(node: unknown, visit: (n: Node) => void): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit);
    return;
  }
  const maybeNode = node as { type?: string };
  if (typeof maybeNode.type === "string") {
    visit(node as Node);
  }
  for (const key of Object.keys(node as object)) {
    if (key === "loc" || key === "range" || key === "tokens" || key === "comments") continue;
    walk((node as Record<string, unknown>)[key], visit);
  }
}

interface ElementName {
  rootName: string;
  slot?: string;
  isMemberExpression: boolean;
}

function readElementName(opening: JSXOpeningElement): ElementName | null {
  const name = opening.name;
  if (name.type === "JSXIdentifier") {
    return { rootName: (name as JSXIdentifier).name, isMemberExpression: false };
  }
  if (name.type === "JSXMemberExpression") {
    const me = name as JSXMemberExpression;
    const root = findRootJsxIdentifier(me);
    if (!root) return null;
    return { rootName: root, slot: me.property.name, isMemberExpression: true };
  }
  return null;
}

function findRootJsxIdentifier(node: JSXMemberExpression | JSXIdentifier): string | null {
  if (node.type === "JSXIdentifier") return node.name;
  const obj = node.object;
  if (obj.type === "JSXIdentifier") return obj.name;
  if (obj.type === "JSXMemberExpression") return findRootJsxIdentifier(obj);
  return null;
}

interface VariantProps {
  variant?: string;
  size?: string;
  color?: string;
}

function readVariantProps(opening: JSXOpeningElement): VariantProps {
  const out: VariantProps = {};
  for (const attr of opening.attributes) {
    if (attr.type !== "JSXAttribute") continue;
    const a = attr as JSXAttribute;
    if (a.name.type !== "JSXIdentifier") continue;
    const name = a.name.name;
    if (!TRACKED_VARIANT_PROPS.includes(name as (typeof TRACKED_VARIANT_PROPS)[number])) continue;
    const value = readAttrLiteral(a);
    if (name === "tone" || name === "kind") {
      if (!out.variant) out.variant = value;
    } else if (name === "variant" || name === "size" || name === "color") {
      out[name] = value;
    }
  }
  return out;
}

function readAttrLiteral(attr: JSXAttribute): string {
  const value = attr.value;
  if (!value) return "true";
  if (value.type === "StringLiteral") return value.value;
  if (value.type === "JSXExpressionContainer") {
    const expr = value.expression;
    if (expr.type === "StringLiteral") return expr.value;
    if (expr.type === "NumericLiteral") return String(expr.value);
    if (expr.type === "BooleanLiteral") return String(expr.value);
    if (expr.type === "NullLiteral") return "null";
    return "unknown";
  }
  return "unknown";
}

function incrementNative(map: Map<string, CustomNativeEntry>, tag: string) {
  const cur = map.get(tag);
  if (cur) cur.count += 1;
  else map.set(tag, { tag, count: 1 });
}

function incrementDs(
  map: Map<string, DsUsageEntry>,
  component: string,
  slot: string | undefined,
  props: VariantProps,
) {
  const key = [
    component,
    slot ?? "",
    props.variant ?? "",
    props.size ?? "",
    props.color ?? "",
  ].join("|");
  const cur = map.get(key);
  if (cur) {
    cur.count += 1;
    return;
  }
  const entry: DsUsageEntry = { component, count: 1 };
  if (slot) entry.slot = slot;
  if (props.variant !== undefined) entry.variant = props.variant;
  if (props.size !== undefined) entry.size = props.size;
  if (props.color !== undefined) entry.color = props.color;
  map.set(key, entry);
}

function incrementCms(map: Map<string, AdminCmsEntry>, component: string) {
  const cur = map.get(component);
  if (cur) cur.count += 1;
  else map.set(component, { component, count: 1 });
}

function incrementExternal(map: Map<string, ExternalEntry>, component: string, source: string) {
  const key = `${component}::${source}`;
  const cur = map.get(key);
  if (cur) cur.count += 1;
  else map.set(key, { component, source, count: 1 });
}

function sortByComponent<T extends { component: string }>(a: T, b: T): number {
  return a.component.localeCompare(b.component);
}

function sumCount(arr: Array<{ count: number }>): number {
  return arr.reduce((acc, x) => acc + x.count, 0);
}
