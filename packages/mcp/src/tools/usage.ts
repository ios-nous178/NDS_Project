import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseMockupUsage } from "./usage/parser.js";
import {
  detectDsVersions,
  postUsageToWebhook,
  scanPendingMockupReports,
  scanMockupsForBuildEvent,
  enqueueUsageWebhook,
  flushUsageWebhookQueue,
  type UsageWebhookQueueFlushResult,
} from "./usage/tracker.js";
import {
  isFilesystemRoot,
  resolveQueueDir,
  resolveWritableLogDir,
  safeAppendUsageToLog,
} from "./usage/log-path.js";
import { detectWorkspaceIntent } from "@nudge-design/mockup-core/tools/build-html";
import { reportHtmlMockupUsage } from "@nudge-design/mockup-core/tools/html-analyzer";
import { USAGE_WEBHOOK_URL } from "@nudge-design/mockup-core";
import type { MockupUsage, PendingMockupReport } from "../types/usage.js";

/**
 * 고정 큐 dir 의 webhook 재시도 큐를 한 번 비운다 (best-effort, throw 안 함).
 * report 가 한동안 안 불릴 수 있는 지점(예: dev_server stop)에서 호출해 밀린 실패분을 흘려보낸다.
 */
export async function flushPendingUsageWebhookQueue(): Promise<UsageWebhookQueueFlushResult | null> {
  try {
    const queuePath = path.join(resolveQueueDir(), ".ds-usage-webhook-queue.jsonl");
    return await flushUsageWebhookQueue(queuePath, USAGE_WEBHOOK_URL);
  } catch {
    return null;
  }
}

export async function reportMockupUsage(args: {
  filePath: string;
  mockupName?: string;
  context?: "user-app" | "admin-cms" | "unknown";
  brand?: "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile";
  cwd?: string;
  dryRun?: boolean;
}): Promise<{
  usage: MockupUsage;
  logPath: string | null;
  logError?: string;
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
}> {
  const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
  const filePath = path.isAbsolute(args.filePath)
    ? args.filePath
    : path.resolve(cwd, args.filePath);
  // 로그/큐 디렉토리는 EROFS 안전: 호출자 cwd 가 / 면 HOME/tmp 로 폴백.
  const logDir = resolveWritableLogDir({ cwd: args.cwd, filePath });

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const usage = parseMockupUsage(filePath, {
    cwd,
    mockupNameHint: args.mockupName,
    contextHint: args.context,
    brandHint: args.brand,
  });
  // Always attach the installed DS versions — analytics row carries (ratio + version).
  usage.dsVersions = detectDsVersions(cwd);
  // Stamp full ISO timestamp so the pending-report scanner can detect same-day edits
  // that happen after a prior report.
  usage.loggedAt = new Date().toISOString();
  usage.usageId = createUsageId(usage);

  const dryRun = args.dryRun === true;
  let logPath: string | null = null;
  let logError: string | undefined;
  if (!dryRun) {
    const candidate = path.join(logDir, ".ds-usage-log.jsonl");
    const appended = safeAppendUsageToLog(usage, candidate);
    logPath = appended.logPath;
    logError = appended.logError;
  }

  const webhook: {
    attempted: boolean;
    ok?: boolean;
    status?: number;
    attempts?: number;
    error?: string;
    queued?: boolean;
    queuePath?: string;
    flushedQueue?: UsageWebhookQueueFlushResult;
  } = {
    attempted: false,
  };
  if (!dryRun) {
    // 큐는 cwd-독립 고정 dir — 호출마다 logDir 이 바뀌어도 고아 안 됨(보냈는데 안 옴 방지).
    const queuePath = path.join(resolveQueueDir(), ".ds-usage-webhook-queue.jsonl");
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

  // 사람이 보기 좋게 한 줄 요약 (사용자에게 보여줘야 의미 있음).
  // MUST: DS 사용 비율(%)과 DS 버전은 항상 함께 표기한다 — 두 값은 분리해서 빠뜨릴 수 없는 한 쌍이다.
  const { totalDs, totalAdminCms, totalCustomNative, totalExternal, dsRatio } = usage.meta;
  const webhookStatus = !webhook.attempted
    ? "skipped"
    : webhook.ok
      ? "ok"
      : `queued(${webhook.status ?? "err"})`;
  const queueStatus = webhook.flushedQueue
    ? ` · queue retry ${webhook.flushedQueue.succeeded}/${webhook.flushedQueue.attempted}`
    : "";
  const dsVersionLabel = formatDsVersionLabel(usage.dsVersions);
  const humanReadable =
    `[usage] ${usage.mockupName} (${usage.brand ?? "?"}) · DS@${dsVersionLabel} · ` +
    `DS ${totalDs} (${dsRatio}%) · antd ${totalAdminCms} · native ${totalCustomNative} · external ${totalExternal} · webhook ${webhookStatus}${queueStatus}`;

  const _nextSuggestion =
    "⚠️ MUST: 사용자에게 보여줄 한 줄 요약(humanReadable)에는 **DS 사용 비율(%) 과 DS 버전** 이 항상 함께 들어가야 합니다 — 둘 중 하나만 노출하거나 생략하지 마세요. " +
    "기본 형식 예: '[usage] <name> (<brand>) · DS@<version> · DS <n> (<ratio>%) · ...'. " +
    "이 결과를 사용자에게 한 줄로 보여준 다음, 아래 단계는 **물어보지 말고 그냥 실행**합니다 — 이 워크스페이스의 표준 산출물 형식은 단일 HTML 파일입니다: " +
    "(1) **반드시 `build_singlefile_html({})` 를 호출**해서 단일 HTML 산출물을 만든다. 손으로 .html 작성, vite build 직접 실행, esbuild/parcel/webpack 등 다른 빌드 도구 사용 모두 금지(nds-* 클래스와 onClick 손실됨). 사용자가 명시적으로 '빌드하지 마' / 'TSX 만 줘' 같은 거부 의사를 표현한 경우에만 생략. " +
    "(2) dev 서버 URL 을 보여주고, 사용자가 직접 확인을 마치면 dev_server({ action: 'stop' }) 호출. " +
    "build_singlefile_html 결과의 dist/index.html 경로와 파일 크기를 사용자에게 보여줄 것 — 이게 공유용 최종 산출물입니다.";

  return { usage, logPath, logError, webhook, humanReadable, _nextSuggestion };
}

/* ───────────── 사용량 보고 자동화 가드레일 ─────────────
 *
 * Claude가 mockup .tsx를 수정/생성한 뒤 `report_mockup_usage` 호출을 빠뜨리는
 * 사고가 반복돼서, 목업 생성 직후 자주 호출되는 도구에서만 자동 트리거한다.
 * 일반 조회 도구에서는 외부 대형 프로젝트를 매번 스캔하지 않는다.
 *
 *  - POST_CREATION_TOOLS: mockup 생성/수정 직후 자연스럽게 호출되는 도구.
 *    응답 직전에 펜딩 파일들에 대해 reportMockupUsage 자동 발화.
 */

const POST_CREATION_TOOLS = new Set<string>([
  "validate_mockup",
  "validate_html_mockup",
  "dev_server",
  "build_singlefile_html",
]);

const MAX_AUTO_REPORTS_PER_CALL = 5;

function createUsageId(usage: MockupUsage): string {
  return createHash("sha256")
    .update(`${usage.mockupFile}\n${usage.loggedAt ?? usage.date}`)
    .digest("hex")
    .slice(0, 24);
}

function formatDsSummary(outcomes: AutoReportOutcome[]): string {
  if (outcomes.length === 0) return "";
  return outcomes
    .map((o) => {
      const ratio = typeof o.dsRatio === "number" ? `${o.dsRatio}%` : "?%";
      const version = o.dsVersion ?? "unknown";
      const name = o.filePath.split("/").pop() ?? o.filePath;
      return `${name} (DS@${version} · ${ratio})`;
    })
    .join(", ");
}

function formatDsVersionLabel(versions: MockupUsage["dsVersions"]): string {
  if (!versions) return "unknown";
  if (versions.primary) {
    return versions.source === "package.json" ? `${versions.primary} (declared)` : versions.primary;
  }
  return versions.source === "unknown" ? "not-installed" : "unknown";
}

function extractCwdFromArgs(args: unknown): string | undefined {
  if (!args || typeof args !== "object") return undefined;
  const cwd = (args as { cwd?: unknown }).cwd;
  return typeof cwd === "string" && cwd.length > 0 ? cwd : undefined;
}

interface AutoReportOutcome {
  filePath: string;
  ok: boolean;
  webhookStatus?: number;
  webhookAttempts?: number;
  webhookError?: string;
  queued?: boolean;
  totalDs?: number;
  /** % of tracked JSX that came from @nudge-design/react. Always surfaced alongside dsVersion. */
  dsRatio?: number;
  /** Installed @nudge-design/react version (or declared range fallback). Always paired with dsRatio. */
  dsVersion?: string | null;
  reason: PendingMockupReport["reason"];
}

async function autoReportPendingMockups(
  cwd: string,
  pending: PendingMockupReport[],
): Promise<AutoReportOutcome[]> {
  const slice = pending.slice(0, MAX_AUTO_REPORTS_PER_CALL);
  const outcomes: AutoReportOutcome[] = [];
  // serialize POSTs to keep the shared Apps Script webhook happy
  for (const p of slice) {
    const isHtml = /\.html?$/i.test(p.filePath);
    try {
      const res = isHtml
        ? await reportHtmlMockupUsage({ filePath: p.filePath, cwd })
        : await reportMockupUsage({ filePath: p.filePath, cwd });
      outcomes.push({
        filePath: p.filePath,
        ok: res.webhook.ok === true,
        webhookStatus: res.webhook.status,
        webhookAttempts: res.webhook.attempts,
        webhookError: res.webhook.error,
        queued: res.webhook.queued,
        totalDs: res.usage.meta.totalDs,
        dsRatio: res.usage.meta.dsRatio,
        dsVersion: res.usage.dsVersions?.primary ?? null,
        reason: p.reason,
      });
    } catch (err) {
      outcomes.push({
        filePath: p.filePath,
        ok: false,
        webhookError: (err as Error).message,
        reason: p.reason,
      });
    }
  }
  return outcomes;
}

interface UsageGuardOutcome {
  autoReported?: AutoReportOutcome[];
  pendingNotReported?: PendingMockupReport[];
  notice?: string;
}

export async function runUsageGuards(toolName: string, args: unknown): Promise<UsageGuardOutcome> {
  if (!POST_CREATION_TOOLS.has(toolName)) return {};

  const cwd = extractCwdFromArgs(args) ?? process.cwd();
  // Claude Desktop 환경에서는 process.cwd() 가 '/' 인 경우가 있다. 루트에서 mockup 후보를
  // 스캔하는 것 자체가 무의미하고 .ds-usage-log.jsonl 쓰기도 EROFS 로 실패하므로 조용히 스킵.
  // 사용자가 명시적으로 cwd 를 넘기거나 DS_USAGE_LOG_DIR env 를 설정해야 가드가 동작.
  if (isFilesystemRoot(cwd)) return {};
  const isBuildEvent = toolName === "build_singlefile_html";
  const shouldAutoReport =
    isBuildEvent ||
    (args !== null &&
      typeof args === "object" &&
      (args as { autoReport?: unknown }).autoReport === true);
  if (!shouldAutoReport) return {};

  // 워크스페이스 intent 자동 감지 — scanner 가 .tsx vs .html 후보를 다르게 산출하도록.
  // validate_html_mockup 처럼 HTML 명시 도구는 항상 html, build_singlefile_html 은 detect 결과 사용.
  const intent: "react" | "html" =
    toolName === "validate_html_mockup" ? "html" : detectWorkspaceIntent(cwd);

  let pending: PendingMockupReport[];
  try {
    pending = scanPendingMockupReports(cwd, intent);
  } catch {
    return {};
  }

  // Build event = "ship moment" → webhook 은 무조건 1건 이상 발사한다.
  // mtime 기반 pending 이 비어 있어도 가장 최근 mockup 을 force-report.
  if (isBuildEvent) {
    const reported = new Set(pending.map((p) => p.filePath));
    let forced: PendingMockupReport[] = [];
    try {
      forced = scanMockupsForBuildEvent(cwd, intent);
    } catch {
      forced = [];
    }
    for (const f of forced) {
      if (!reported.has(f.filePath)) pending.unshift(f);
    }
  }

  if (pending.length === 0) return {};

  const outcomes = await autoReportPendingMockups(cwd, pending);
  const leftover = pending.slice(outcomes.length);
  const builtEntries = outcomes.filter((o) => o.reason === "build-event");
  const noticePrefix = isBuildEvent
    ? builtEntries.length > 0
      ? `build_singlefile_html 직후 ${builtEntries.length}건을 webhook 으로 강제 전송했습니다 (build 이벤트 = 시트 적재 필수). `
      : `build_singlefile_html 직후 ${outcomes.length}건을 webhook 으로 전송했습니다. `
    : `자동으로 ${outcomes.length}건의 mockup 사용량을 webhook으로 전송했습니다. ` +
      `(빠뜨릴 뻔한 report_mockup_usage 호출을 MCP 가드레일이 대신 수행함) `;
  const dsSummary = formatDsSummary(outcomes);
  const mustLine =
    "⚠️ MUST: 사용자에게 알릴 때 **DS 사용 비율(%) 과 DS 버전** 을 반드시 함께 한 줄에 표기하세요 (둘 중 하나만 노출 금지). " +
    (dsSummary ? `이번 보고된 mockup: ${dsSummary}. ` : "");
  const notice =
    noticePrefix +
    mustLine +
    (leftover.length > 0
      ? `남은 ${leftover.length}건은 cap을 초과해 보류 — 다음 호출 때 처리됩니다.`
      : "사용자에게 한 줄로 알려주세요.");
  return {
    autoReported: outcomes,
    pendingNotReported: leftover.length > 0 ? leftover : undefined,
    notice,
  };
}

export function attachUsageGuardOutcome(result: unknown, guard: UsageGuardOutcome): unknown {
  if (!guard.autoReported && !guard.pendingNotReported && !guard.notice) return result;
  const base: Record<string, unknown> =
    result && typeof result === "object" && !Array.isArray(result)
      ? { ...(result as Record<string, unknown>) }
      : { result };
  if (guard.autoReported) base._autoReportedUsage = guard.autoReported;
  if (guard.pendingNotReported) base._pendingMockupReports = guard.pendingNotReported;
  if (guard.notice) base._usageGuardNotice = guard.notice;
  return base;
}
