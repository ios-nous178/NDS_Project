import {
  readFileSync,
  appendFileSync,
  writeFileSync,
  unlinkSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
  type Dirent,
} from "node:fs";
import { dirname, basename, relative, resolve, sep, join } from "node:path";
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
  PendingMockupReport,
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

interface PostUsageOptions {
  retries?: number;
  timeoutMs?: number;
  retryDelayMs?: number;
}

export async function postUsageToWebhook(
  usage: MockupUsage,
  url: string,
  opts: PostUsageOptions = {},
): Promise<{ ok: boolean; status: number; body: string; attempts: number }> {
  const retries = opts.retries ?? 3;
  const timeoutMs = opts.timeoutMs ?? 10000;
  const retryDelayMs = opts.retryDelayMs ?? 500;
  const body = serializeUsage(usage);
  let lastError: Error | null = null;
  let lastResponse: { ok: boolean; status: number; body: string; attempts: number } | null = null;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          signal: controller.signal,
        });
        const text = await res.text();
        lastResponse = {
          ok: res.ok,
          status: res.status,
          body: text.slice(0, 500),
          attempts: attempt,
        };
        if (res.ok || !isRetryableStatus(res.status) || attempt > retries) return lastResponse;
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      lastError = err as Error;
      if (attempt > retries) break;
    }
    await sleep(retryDelayMs * attempt);
  }

  if (lastResponse) return lastResponse;
  throw lastError ?? new Error("Failed to POST usage webhook");
}

/* ───────────── pending-report scanner ───────────── */

export interface UsageWebhookQueueFlushResult {
  attempted: number;
  succeeded: number;
  failed: number;
  remaining: number;
}

interface UsageWebhookQueueEntry {
  enqueuedAt: string;
  usage: MockupUsage;
}

export function enqueueUsageWebhook(usage: MockupUsage, queuePath: string): void {
  mkdirSync(dirname(queuePath), { recursive: true });
  const entry: UsageWebhookQueueEntry = {
    enqueuedAt: new Date().toISOString(),
    usage,
  };
  appendFileSync(queuePath, JSON.stringify(entry) + "\n", "utf8");
}

export async function flushUsageWebhookQueue(
  queuePath: string,
  url: string,
  opts: PostUsageOptions & { maxEntries?: number } = {},
): Promise<UsageWebhookQueueFlushResult> {
  if (!existsSync(queuePath)) return { attempted: 0, succeeded: 0, failed: 0, remaining: 0 };

  let raw: string;
  try {
    raw = readFileSync(queuePath, "utf8");
  } catch {
    return { attempted: 0, succeeded: 0, failed: 0, remaining: 0 };
  }

  const entries = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => parseQueueEntry(line))
    .filter((entry): entry is UsageWebhookQueueEntry => entry !== null);
  if (entries.length === 0) {
    unlinkQueue(queuePath);
    return { attempted: 0, succeeded: 0, failed: 0, remaining: 0 };
  }

  const maxEntries = opts.maxEntries ?? 20;
  const retryNow = entries.slice(0, maxEntries);
  const untouched = entries.slice(maxEntries);
  const failedEntries: UsageWebhookQueueEntry[] = [];
  let succeeded = 0;

  for (const entry of retryNow) {
    try {
      const res = await postUsageToWebhook(entry.usage, url, opts);
      if (res.ok) succeeded += 1;
      else failedEntries.push(entry);
    } catch {
      failedEntries.push(entry);
    }
  }

  const remainingEntries = [...failedEntries, ...untouched];
  if (remainingEntries.length === 0) {
    unlinkQueue(queuePath);
  } else {
    mkdirSync(dirname(queuePath), { recursive: true });
    writeFileSync(
      queuePath,
      remainingEntries.map((entry) => JSON.stringify(entry)).join("\n") + "\n",
      "utf8",
    );
  }

  return {
    attempted: retryNow.length,
    succeeded,
    failed: failedEntries.length,
    remaining: remainingEntries.length,
  };
}

const MOCKUP_FILENAME_RE = /Mockup\.tsx$/i;
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
  ".next",
  ".turbo",
  ".cache",
  ".pnpm",
  ".yarn",
  ".vite",
  ".storybook-static",
]);
const DEFAULT_SCAN_MAX_DEPTH = 8;
const DEFAULT_SCAN_MAX_FILES = 200;

interface ScanOptions {
  /** Hard cap on number of `*Mockup.tsx` files to consider. Default 200. */
  maxFiles?: number;
  /** Max directory depth from cwd. Default 8. */
  maxDepth?: number;
}

/**
 * Scan `cwd` for mockup `.tsx` files whose mtime is newer than the most recent entry
 * in `.ds-usage-log.jsonl` (or that have never been reported). Used by the MCP
 * dispatch wrapper to auto-fire `report_mockup_usage` when downstream tools run.
 */
export function scanPendingMockupReports(
  cwd: string,
  opts: ScanOptions = {},
): PendingMockupReport[] {
  const logPath = join(cwd, ".ds-usage-log.jsonl");
  const lastLogged = readLastLoggedMap(logPath);

  const candidates = findMockupCandidates(cwd, opts);
  const pending: PendingMockupReport[] = [];
  for (const abs of candidates) {
    let mtimeMs: number;
    try {
      mtimeMs = statSync(abs).mtimeMs;
    } catch {
      continue;
    }
    const rel = relativeSafe(abs, cwd);
    const lastLogMs = lastLogged.get(rel) ?? null;
    if (lastLogMs == null) {
      pending.push({ filePath: rel, mtimeMs, lastLoggedAtMs: null, reason: "never-reported" });
    } else if (mtimeMs > lastLogMs) {
      pending.push({
        filePath: rel,
        mtimeMs,
        lastLoggedAtMs: lastLogMs,
        reason: "modified-since-last-report",
      });
    }
  }
  // newest first — auto-fire prioritizes recent work
  pending.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return pending;
}

function readLastLoggedMap(logPath: string): Map<string, number> {
  const map = new Map<string, number>();
  if (!existsSync(logPath)) return map;
  let raw: string;
  try {
    raw = readFileSync(logPath, "utf8");
  } catch {
    return map;
  }
  for (const line of raw.split("\n")) {
    if (!line) continue;
    let entry: { mockupFile?: string; loggedAt?: string; date?: string };
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (!entry.mockupFile) continue;
    // Prefer ISO `loggedAt`. For legacy entries with only a `date`, fall back to
    // start-of-day in UTC: this keeps cross-day reports counted as covered, but
    // ensures any same-day edit after that report still trips the scanner.
    // A one-time false-positive re-fire on first scan against legacy entries is
    // acceptable — it acts as a backfill.
    let ts = 0;
    if (entry.loggedAt) ts = Date.parse(entry.loggedAt);
    else if (entry.date) ts = Date.parse(`${entry.date}T00:00:00Z`);
    if (!Number.isFinite(ts) || ts <= 0) continue;
    const prev = map.get(entry.mockupFile) ?? 0;
    if (ts > prev) map.set(entry.mockupFile, ts);
  }
  return map;
}

function findMockupCandidates(cwd: string, opts: ScanOptions): string[] {
  const maxFiles = opts.maxFiles ?? DEFAULT_SCAN_MAX_FILES;
  const maxDepth = opts.maxDepth ?? DEFAULT_SCAN_MAX_DEPTH;
  const out: string[] = [];

  const walk = (dir: string, depth: number): boolean => {
    if (depth > maxDepth) return true;
    let entries: Dirent<string>[];
    try {
      entries = readdirSync(dir, { withFileTypes: true, encoding: "utf8" }) as Dirent<string>[];
    } catch {
      return true;
    }
    for (const e of entries) {
      if (out.length >= maxFiles) return false;
      if (e.isDirectory()) {
        if (e.name.startsWith(".") || SKIP_DIRS.has(e.name)) continue;
        if (!walk(join(dir, e.name), depth + 1)) return false;
      } else if (e.isFile()) {
        if (!MOCKUP_FILENAME_RE.test(e.name)) continue;
        if (e.name.endsWith(".stories.tsx") || e.name.endsWith(".test.tsx")) continue;
        out.push(join(dir, e.name));
      }
    }
    return true;
  };
  walk(cwd, 0);
  return out;
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function parseQueueEntry(line: string): UsageWebhookQueueEntry | null {
  try {
    const parsed = JSON.parse(line) as Partial<UsageWebhookQueueEntry> | MockupUsage;
    if (!parsed || typeof parsed !== "object") return null;
    if ("usage" in parsed && parsed.usage) {
      return {
        enqueuedAt:
          typeof parsed.enqueuedAt === "string" ? parsed.enqueuedAt : new Date().toISOString(),
        usage: parsed.usage,
      };
    }
    if ("mockupFile" in parsed) {
      return { enqueuedAt: new Date().toISOString(), usage: parsed as MockupUsage };
    }
  } catch {
    return null;
  }
  return null;
}

function unlinkQueue(queuePath: string): void {
  try {
    unlinkSync(queuePath);
  } catch {
    // Best-effort cleanup only.
  }
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
