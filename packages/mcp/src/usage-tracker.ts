import { readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname, basename, relative, resolve, sep } from "node:path";
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
} from "./types/usage.js";

const DS_PACKAGE_PREFIX = "@nudge-eap/react";
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

const TRACKED_VARIANT_PROPS = ["variant", "size", "color", "tone", "kind"] as const;

interface ImportInfo {
  source: string;
  imported: string; // original name in source module (or "default", "*")
}

interface ParseOptions {
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
  const cwd = opts.cwd ?? process.cwd();
  const absPath = resolve(filePath);
  const source = readFileSync(absPath, "utf8");
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
      totalDs: sumCount(ds),
      totalAdminCms: sumCount(adminCms),
      totalCustomNative: customNative.reduce((acc, n) => acc + n.count, 0),
      totalExternal: sumCount(external),
      parserWarnings: warnings,
    },
  };
}

export function serializeUsage(usage: MockupUsage): string {
  return JSON.stringify(usage);
}

export function appendUsageToLog(usage: MockupUsage, logPath: string): void {
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, serializeUsage(usage) + "\n", "utf8");
}

export async function postUsageToWebhook(
  usage: MockupUsage,
  url: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: serializeUsage(usage),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body: body.slice(0, 500) };
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
      parserWarnings: warnings,
    },
  };
}

function defaultMockupName(absPath: string): string {
  return basename(absPath).replace(/\.(stories\.)?(tsx|jsx|ts|js)$/i, "");
}

function relativeSafe(absPath: string, cwd: string): string {
  const r = relative(cwd, absPath);
  if (r.startsWith("..") || r.length === 0) return absPath;
  return r.split(sep).join("/");
}

function detectBrand(absPath: string): Brand {
  const lower = absPath.toLowerCase();
  if (/(trost)/i.test(lower)) return "trost";
  if (/(geniet)/i.test(lower)) return "geniet";
  if (/(nudge[-_]?eap)/i.test(lower)) return "nudge-eap";
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
  return source === DS_PACKAGE_PREFIX || source.startsWith(`${DS_PACKAGE_PREFIX}/`);
}

function isLowerCaseTag(name: string): boolean {
  return /^[a-z]/.test(name);
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
    // Recurse to find root identifier; capture immediate property as slot.
    const root = findRootJsxIdentifier(me);
    if (!root) return null;
    return { rootName: root, slot: me.property.name, isMemberExpression: true };
  }
  // JSXNamespacedName — not used in this project. Skip.
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
    // map secondary names into primary buckets
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
  if (!value) return "true"; // boolean shorthand: <Button selected />
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
