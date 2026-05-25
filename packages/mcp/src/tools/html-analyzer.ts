/**
 * HTML 입력용 분석 / 변환 / 사용량 보고 도구 모음.
 *
 *   analyze_html_mockup       — validate 결과 + DS 화율 / 카운트 통계
 *   convert_html_to_ds_html   — raw HTML → nds-* dialect (단순 태그 교체 + hex 토큰 매칭)
 *   report_html_mockup_usage  — HTML 의 nds-* / native 태그 카운트 로컬 로그 (webhook 은 v0.1)
 *
 * 모두 cheerio 기반. validate_html_mockup 과 같은 파서를 사용.
 */

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import * as cheerio from "cheerio";
import { validateHtmlSource, type HtmlViolation } from "./html-validator.js";
import { ndsTagToComponentName } from "./usage/parser.js";
import {
  appendUsageToLog,
  detectDsVersions,
  enqueueUsageWebhook,
  flushUsageWebhookQueue,
  postUsageToWebhook,
  type UsageWebhookQueueFlushResult,
} from "./usage/tracker.js";
import type { Brand, Context, DsUsageEntry, MockupUsage } from "../types/usage.js";

const USAGE_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzgWCu2Y5BygcMakF9qItU3d-bvducUD3mFkryqLQ5RiSRPF1ExzUnkyYDimsTb7d74/exec";

interface DomElement {
  type: string;
  tagName: string;
  attribs: Record<string, string>;
  startIndex?: number | null;
}

const NATIVE_INTERACTIVE_TAGS = new Set(["button", "input", "select", "textarea", "form"]);

/* ───────── 공통 카운트 헬퍼 ───────── */

export interface HtmlUsageCounts {
  /** <nds-*> custom element 인스턴스 수 + tag 별 분포 */
  ndsTags: { total: number; byTag: Record<string, number> };
  /** nds-* class 가 박힌 일반 element 수 (예: <button class="nds-button">) */
  ndsClassed: { total: number; byClass: Record<string, number> };
  /** nds-* 래퍼/클래스 없는 native interactive element */
  nativeUnwrapped: { total: number; byTag: Record<string, number> };
  /** 모든 element 총 수 (script/style 제외) */
  totalElements: number;
  /**
   * DS 적용 비율 (0-100).
   * (ndsTags + ndsClassed) / (ndsTags + ndsClassed + nativeUnwrapped + plain leaves).
   * plain leaves 는 보수적으로 nativeUnwrapped 만 count — div/p/span 같은 layout 은 분모에서 제외.
   */
  dsRatio: number;
}

export function countHtmlUsage(source: string): HtmlUsageCounts {
  const $ = cheerio.load(source, { xmlMode: false });
  const ndsTagsByTag: Record<string, number> = {};
  const ndsClassByClass: Record<string, number> = {};
  const nativeByTag: Record<string, number> = {};
  let totalElements = 0;

  $("*").each((_i, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    if (tag === "script" || tag === "style") return;
    totalElements++;

    if (tag.startsWith("nds-")) {
      ndsTagsByTag[tag] = (ndsTagsByTag[tag] ?? 0) + 1;
      return; // nds-* 안의 inner button 등은 이미 wrapper 가 카운트됨
    }

    const attribs = el.attribs ?? {};
    const cls = (attribs.class ?? "").split(/\s+/).filter(Boolean);
    const ndsBase = cls.find(
      (c) => /^nds-[a-z0-9-]+$/.test(c) && !c.includes("__") && !c.includes("--"),
    );
    if (ndsBase) {
      ndsClassByClass[ndsBase] = (ndsClassByClass[ndsBase] ?? 0) + 1;
      return;
    }

    if (NATIVE_INTERACTIVE_TAGS.has(tag)) {
      // inner of nds-* wrapper 인지 — 그러면 카운트 제외
      let cur: DomElement | null = ((el as unknown as { parent?: DomElement }).parent ??
        null) as DomElement | null;
      let insideWrapper = false;
      while (cur) {
        if (cur.type === "tag" && cur.tagName?.toLowerCase().startsWith("nds-")) {
          insideWrapper = true;
          break;
        }
        cur = ((cur as unknown as { parent?: DomElement }).parent ?? null) as DomElement | null;
      }
      if (!insideWrapper) {
        nativeByTag[tag] = (nativeByTag[tag] ?? 0) + 1;
      }
    }
  });

  const ndsTagsTotal = sumValues(ndsTagsByTag);
  const ndsClassTotal = sumValues(ndsClassByClass);
  const nativeTotal = sumValues(nativeByTag);
  const denom = ndsTagsTotal + ndsClassTotal + nativeTotal;
  const dsRatio = denom === 0 ? 0 : Math.round(((ndsTagsTotal + ndsClassTotal) / denom) * 100);

  return {
    ndsTags: { total: ndsTagsTotal, byTag: ndsTagsByTag },
    ndsClassed: { total: ndsClassTotal, byClass: ndsClassByClass },
    nativeUnwrapped: { total: nativeTotal, byTag: nativeByTag },
    totalElements,
    dsRatio,
  };
}

function sumValues(o: Record<string, number>): number {
  return Object.values(o).reduce((s, v) => s + v, 0);
}

function readSourceArgs(args: { source?: string; filePath?: string }): {
  source: string;
  filePath: string | null;
} {
  if (args.source) return { source: args.source, filePath: null };
  if (args.filePath) {
    const p = path.resolve(args.filePath);
    if (!fs.existsSync(p)) throw new Error(`File not found: ${p}`);
    return { source: fs.readFileSync(p, "utf-8"), filePath: p };
  }
  throw new Error("Provide either `source` (HTML string) or `filePath`.");
}

/* ───────── analyze_html_mockup ───────── */

export interface AnalyzeHtmlMockupArgs {
  source?: string;
  filePath?: string;
}

export interface AnalyzeHtmlMockupResult {
  filePath: string | null;
  counts: HtmlUsageCounts;
  violations: HtmlViolation[];
  violationsByRule: Record<string, number>;
  humanReadable: string;
  recommendations: string[];
  jsxOnlyNotice: string;
}

export function analyzeHtmlMockup(args: AnalyzeHtmlMockupArgs): AnalyzeHtmlMockupResult {
  const { source, filePath } = readSourceArgs(args);
  const counts = countHtmlUsage(source);
  const violations = validateHtmlSource(source);

  const violationsByRule: Record<string, number> = {};
  for (const v of violations) violationsByRule[v.rule] = (violationsByRule[v.rule] ?? 0) + 1;

  const recommendations: string[] = [];
  if (counts.nativeUnwrapped.total > 0) {
    const top = Object.entries(counts.nativeUnwrapped.byTag)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t, n]) => `${t}×${n}`)
      .join(", ");
    recommendations.push(
      `native interactive ${counts.nativeUnwrapped.total}건 (${top}) → convert_html_to_ds_html 으로 nds-* 로 변환.`,
    );
  }
  if (violationsByRule["inline-color"]) {
    recommendations.push(
      `inline-color ${violationsByRule["inline-color"]}건 → find_token({ query }) 으로 토큰 매칭 후 var(--..) 로 교체.`,
    );
  }
  if (violationsByRule["non-4pt-spacing"]) {
    recommendations.push(
      `non-4pt-spacing ${violationsByRule["non-4pt-spacing"]}건 → 4 의 배수 또는 semantic --gap-* / --inset-* 으로.`,
    );
  }
  if (violationsByRule["unknown-token"]) {
    recommendations.push(
      `unknown-token ${violationsByRule["unknown-token"]}건 → 오타이거나 폐기된 토큰. find_token 으로 후보 확인.`,
    );
  }
  if (recommendations.length === 0 && violations.length === 0) {
    recommendations.push("위반 없음. DS 적용률 " + counts.dsRatio + "%.");
  }

  const humanReadable =
    `[html] DS ratio ${counts.dsRatio}% · ` +
    `nds-tag ${counts.ndsTags.total} · nds-class ${counts.ndsClassed.total} · ` +
    `native unwrapped ${counts.nativeUnwrapped.total} · violations ${violations.length}`;

  return {
    filePath,
    counts,
    violations,
    violationsByRule,
    humanReadable,
    recommendations,
    jsxOnlyNotice:
      "prop 의미 검증 (Card.Header 이중 padding, IconButton size union 등) 은 .tsx 시점에서만 가능합니다. " +
      "수정이 prop 의미와 관련되면 .tsx 로 돌아가서 validate_mockup / report_mockup_usage 를 사용하세요.",
  };
}

/* ───────── report_html_mockup_usage ───────── */

export interface ReportHtmlMockupUsageArgs {
  source?: string;
  filePath?: string;
  mockupName?: string;
  context?: Context;
  brand?: Exclude<Brand, null>;
  cwd?: string;
  /** 기본 false (.tsx report 와 동일). true 면 로그/webhook 모두 생략. */
  dryRun?: boolean;
}

export interface ReportHtmlMockupUsageResult {
  filePath: string | null;
  mockupName: string;
  counts: HtmlUsageCounts;
  /** webhook payload 로 사용된 MockupUsage (.tsx report 와 동일 스키마). */
  usage: MockupUsage;
  loggedAt: string;
  logPath: string | null;
  webhook: {
    attempted: boolean;
    ok?: boolean;
    status?: number;
    attempts?: number;
    error?: string;
    queued?: boolean;
    queuePath?: string;
    flushedQueue?: UsageWebhookQueueFlushResult;
  };
  humanReadable: string;
  _nextSuggestion: string;
}

/**
 * HTML mockup 의 nds-* / native 사용 카운트를 .tsx report 와 동일한 webhook 으로 적재.
 *
 * - nds-* tag → DsUsageEntry (component 명은 ndsTagToComponentName 로 PascalCase 변환)
 * - nds-className 흉내 → CustomNativeEntry 에 `nds-imitation:<class>` 로 분리 적재
 *   (시트에서 "흉내" vs "실 native" 를 구분할 수 있도록)
 * - native unwrapped → CustomNativeEntry
 *
 * 같은 `.ds-usage-log.jsonl` 와 같은 Google Apps Script webhook 으로 보내므로 시트에서
 * .tsx · .html 양쪽 mockup 이 한 줄씩 누적된다.
 */
export async function reportHtmlMockupUsage(
  args: ReportHtmlMockupUsageArgs,
): Promise<ReportHtmlMockupUsageResult> {
  const { source, filePath } = readSourceArgs(args);
  const counts = countHtmlUsage(source);
  const loggedAt = new Date().toISOString();
  const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
  const mockupName =
    args.mockupName ??
    (filePath ? path.basename(filePath) : `html-snippet-${loggedAt.replace(/[:.]/g, "-")}`);

  const usage = buildMockupUsageFromHtmlCounts({
    counts,
    filePath,
    mockupName,
    cwd,
    context: args.context ?? "user-app",
    brand: args.brand ?? null,
    loggedAt,
  });

  const dryRun = args.dryRun === true;

  let logPath: string | null = null;
  if (!dryRun) {
    logPath = path.join(cwd, ".ds-usage-log.jsonl");
    appendUsageToLog(usage, logPath);
  }

  const webhook: ReportHtmlMockupUsageResult["webhook"] = { attempted: false };
  if (!dryRun) {
    const queuePath = path.join(cwd, ".ds-usage-webhook-queue.jsonl");
    const flushedQueue = await flushUsageWebhookQueue(queuePath, USAGE_WEBHOOK_URL);
    if (flushedQueue.attempted > 0 || flushedQueue.remaining > 0) {
      webhook.flushedQueue = flushedQueue;
    }
    webhook.attempted = true;
    try {
      const res = await postUsageToWebhook(usage, USAGE_WEBHOOK_URL);
      webhook.ok = res.ok;
      webhook.status = res.status;
      webhook.attempts = res.attempts;
      if (!res.ok) {
        enqueueUsageWebhook(usage, queuePath);
        webhook.queued = true;
        webhook.queuePath = queuePath;
      }
    } catch (err) {
      webhook.ok = false;
      webhook.error = (err as Error).message;
      enqueueUsageWebhook(usage, queuePath);
      webhook.queued = true;
      webhook.queuePath = queuePath;
    }
  }

  const webhookStatus = !webhook.attempted
    ? "skipped"
    : webhook.ok
      ? "ok"
      : `queued(${webhook.status ?? "err"})`;
  const dsVersionLabel = usage.dsVersions?.primary ?? "unknown";
  const humanReadable =
    `[html-usage] ${mockupName} (${usage.brand ?? "?"}) · DS@${dsVersionLabel} · ` +
    `DS ${counts.ndsTags.total} (${counts.dsRatio}%) · ` +
    `nds-class ${counts.ndsClassed.total} · native ${counts.nativeUnwrapped.total} · ` +
    `webhook ${webhookStatus}`;

  const _nextSuggestion =
    "⚠️ MUST: 사용자에게 보여줄 한 줄 요약(humanReadable)에는 **DS 사용 비율(%) 과 DS 버전** 이 항상 함께 들어가야 합니다. " +
    "기본 형식 예: '[html-usage] <name> (<brand>) · DS@<version> · DS <n> (<ratio>%) · ...'. " +
    "이 결과를 사용자에게 한 줄로 보여준 다음, build_singlefile_html 로 dist/index.html 단일 산출물을 만드세요.";

  return {
    filePath,
    mockupName,
    counts,
    usage,
    loggedAt,
    logPath,
    webhook,
    humanReadable,
    _nextSuggestion,
  };
}

interface BuildUsageArgs {
  counts: HtmlUsageCounts;
  filePath: string | null;
  mockupName: string;
  cwd: string;
  context: Context;
  brand: Brand;
  loggedAt: string;
}

function buildMockupUsageFromHtmlCounts(args: BuildUsageArgs): MockupUsage {
  const { counts, filePath, mockupName, cwd, context, brand, loggedAt } = args;

  const ds: DsUsageEntry[] = [];
  for (const [tag, count] of Object.entries(counts.ndsTags.byTag)) {
    const component = ndsTagToComponentName(tag) ?? tag.replace(/^nds-/, "");
    ds.push({ component, count });
  }
  ds.sort((a, b) => b.count - a.count);

  // nds-* className 흉내는 실제 DS 사용이 아니므로 customNative 에 별도 prefix 로 분리.
  // 시트에서 "흉내" vs "raw native" 를 구분할 수 있다.
  const customNative: { tag: string; count: number }[] = [];
  for (const [cls, count] of Object.entries(counts.ndsClassed.byClass)) {
    customNative.push({ tag: `nds-imitation:${cls}`, count });
  }
  for (const [tag, count] of Object.entries(counts.nativeUnwrapped.byTag)) {
    customNative.push({ tag, count });
  }
  customNative.sort((a, b) => b.count - a.count);

  const dsVersions = detectDsVersions(cwd);
  const mockupFile = filePath ? path.relative(cwd, filePath) : `inline:${mockupName}`;

  const usage: MockupUsage = {
    date: loggedAt.slice(0, 10),
    loggedAt,
    mockupFile,
    mockupName,
    context,
    brand,
    dsVersions,
    ds,
    adminCms: [],
    customNative,
    external: [],
    meta: {
      totalDs: counts.ndsTags.total,
      totalAdminCms: 0,
      totalCustomNative: counts.nativeUnwrapped.total + counts.ndsClassed.total,
      totalExternal: 0,
      dsRatio: counts.dsRatio,
      parserWarnings: [],
    },
  };
  usage.usageId = createHash("sha256")
    .update(`${usage.mockupFile}\n${usage.loggedAt}`)
    .digest("hex")
    .slice(0, 24);
  return usage;
}

/* ───────── convert_html_to_ds_html ───────── */

/**
 * native HTML tag → nds-* dialect 매핑.
 * 모든 attribute 는 그대로 유지하되, 의미 다른 attribute (예: button.type) 는 그대로 둠.
 * v0 한계: variant/color 추론 없음. 단순 태그만 바꿔준다.
 */
const TAG_REWRITES: Record<string, string> = {
  button: "nds-button",
  input: "nds-input",
  textarea: "nds-textarea",
  select: "nds-select",
};

const SELECT_OPTION_TAG = "option";

export interface ConvertHtmlToDsHtmlArgs {
  source?: string;
  filePath?: string;
  /** true 면 inline hex 색상을 토큰으로 자동 치환 (정확 매칭만). 기본 true. */
  rewriteInlineColors?: boolean;
}

export interface ConvertHtmlChange {
  rule: string;
  from: string;
  to: string;
  line: number;
}

export interface ConvertHtmlToDsHtmlResult {
  filePath: string | null;
  output: string;
  changes: ConvertHtmlChange[];
  unchanged: string[];
  humanReadable: string;
}

export function convertHtmlToDsHtml(args: ConvertHtmlToDsHtmlArgs): ConvertHtmlToDsHtmlResult {
  const { source, filePath } = readSourceArgs(args);
  const rewriteInlineColors = args.rewriteInlineColors !== false;
  const changes: ConvertHtmlChange[] = [];
  const unchanged: string[] = [];

  const $ = cheerio.load(source, { xmlMode: false });

  // 1. tag 교체. cheerio 는 직접 tag rename API 가 없어서 attribute/children copy + replaceWith.
  $("*").each((_i, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    const target = TAG_REWRITES[tag];
    if (!target) return;

    // 이미 nds-* wrapper 안에 있으면 건드리지 않음 (우리 WC inner DOM)
    let cur: DomElement | null = (el as unknown as { parent?: DomElement }).parent ?? null;
    while (cur) {
      if (cur.type === "tag" && cur.tagName?.toLowerCase().startsWith("nds-")) return;
      cur = (cur as unknown as { parent?: DomElement }).parent ?? null;
    }

    const $el = $(el);
    const attrs = (el as unknown as { attribs: Record<string, string> }).attribs ?? {};
    // type="button" 같이 redundant 한 건 새 element 가 알아서 처리 → drop
    const skipAttrs = new Set(tag === "button" ? ["type"] : []);
    const attrPairs = Object.entries(attrs).filter(([k]) => !skipAttrs.has(k));

    const attrString = attrPairs.map(([k, v]) => ` ${k}="${escapeAttr(v)}"`).join("");
    let inner = $el.html() ?? "";

    // <select><option> → <nds-select><nds-select-option> 변환
    if (tag === "select") {
      inner = inner.replace(
        new RegExp(`<${SELECT_OPTION_TAG}(\\s[^>]*)?>`, "g"),
        "<nds-select-option$1>",
      );
      inner = inner.replace(new RegExp(`</${SELECT_OPTION_TAG}>`, "g"), "</nds-select-option>");
    }

    const replacement = `<${target}${attrString}>${inner}</${target}>`;
    const offset = (el as unknown as { startIndex?: number }).startIndex ?? 0;
    changes.push({
      rule: `rewrite-tag:${tag}→${target}`,
      from: `<${tag}>`,
      to: `<${target}>`,
      line: lineAt(source, offset),
    });
    $el.replaceWith(replacement);
  });

  let output = $.html();

  // 2. inline hex color 치환 (단순 정확 매칭만).
  // 사용자 토큰 catalog 의 hex 와 정확 일치하면 var(--..) 로 교체.
  // catalog 주입은 v0.1 — 현재는 알려진 기본 매핑만.
  if (rewriteInlineColors) {
    const hexReplacements = [
      { hex: "#ffffff", token: "var(--semantic-bg-surface-default)" },
      { hex: "#fff", token: "var(--semantic-bg-surface-default)" },
      { hex: "#000000", token: "var(--semantic-text-strong-default)" },
      { hex: "#000", token: "var(--semantic-text-strong-default)" },
    ];
    for (const { hex, token } of hexReplacements) {
      const re = new RegExp(`(style="[^"]*?:)\\s*${escapeRegex(hex)}\\b`, "gi");
      let n = 0;
      output = output.replace(re, (_full, prefix) => {
        n++;
        return `${prefix} ${token}`;
      });
      if (n > 0) {
        changes.push({ rule: "rewrite-hex-to-token", from: hex, to: token, line: 0 });
      }
    }
  }

  // 3. 미변환 알림 — convert 가 어떻게 안 만진 부분이 남아있는지.
  if (!TAG_REWRITES.button && /<button\b/.test(output)) unchanged.push("button");
  // hex 미 매칭 (catalog 와 일치 안 함)
  const remainingHex = output.match(/style="[^"]*#[0-9a-fA-F]{3,8}\b/g);
  if (remainingHex && remainingHex.length > 0) {
    unchanged.push(`${remainingHex.length} hex (catalog 미매칭)`);
  }

  const humanReadable =
    `[convert] ${changes.length} change(s)` +
    (unchanged.length > 0 ? ` · 남은 작업: ${unchanged.join(", ")}` : "");

  return {
    filePath,
    output,
    changes,
    unchanged,
    humanReadable,
  };
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function lineAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}
