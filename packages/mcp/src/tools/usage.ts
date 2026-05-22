import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseMockupUsage } from "./usage/parser.js";
import {
  appendUsageToLog,
  postUsageToWebhook,
  scanPendingMockupReports,
  scanMockupsForBuildEvent,
  enqueueUsageWebhook,
  flushUsageWebhookQueue,
  type UsageWebhookQueueFlushResult,
} from "./usage/tracker.js";
import type { MockupUsage, PendingMockupReport } from "../types/usage.js";

const USAGE_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzgWCu2Y5BygcMakF9qItU3d-bvducUD3mFkryqLQ5RiSRPF1ExzUnkyYDimsTb7d74/exec";

export async function reportMockupUsage(args: {
  filePath: string;
  mockupName?: string;
  context?: "user-app" | "admin-cms" | "unknown";
  brand?: "trost" | "geniet" | "nudge-eap" | "cashpobi";
  cwd?: string;
  dryRun?: boolean;
}): Promise<{
  usage: MockupUsage;
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
}> {
  const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
  const filePath = path.isAbsolute(args.filePath)
    ? args.filePath
    : path.resolve(cwd, args.filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const usage = parseMockupUsage(filePath, {
    cwd,
    mockupNameHint: args.mockupName,
    contextHint: args.context,
    brandHint: args.brand,
  });
  // Stamp full ISO timestamp so the pending-report scanner can detect same-day edits
  // that happen after a prior report.
  usage.loggedAt = new Date().toISOString();
  usage.usageId = createUsageId(usage);

  const dryRun = args.dryRun === true;
  let logPath: string | null = null;
  if (!dryRun) {
    logPath = path.join(cwd, ".ds-usage-log.jsonl");
    appendUsageToLog(usage, logPath);
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

  // 사람이 보기 좋게 한 줄 요약 (사용자에게 보여줘야 의미 있음)
  const { totalDs, totalAdminCms, totalCustomNative, totalExternal } = usage.meta;
  const total = totalDs + totalAdminCms + totalCustomNative + totalExternal;
  const dsRatio = total === 0 ? 0 : Math.round((totalDs / total) * 100);
  const webhookStatus = !webhook.attempted
    ? "skipped"
    : webhook.ok
      ? "ok"
      : `queued(${webhook.status ?? "err"})`;
  const queueStatus = webhook.flushedQueue
    ? ` · queue retry ${webhook.flushedQueue.succeeded}/${webhook.flushedQueue.attempted}`
    : "";
  const humanReadable =
    `[usage] ${usage.mockupName} (${usage.brand ?? "?"}): ` +
    `DS ${totalDs} (${dsRatio}%) · antd ${totalAdminCms} · native ${totalCustomNative} · external ${totalExternal} · webhook ${webhookStatus}${queueStatus}`;

  const _nextSuggestion =
    "이 결과를 사용자에게 한 줄로 보여주세요 (humanReadable 필드). 그 다음 단계는 다음 두 가지이며 **물어보지 말고 그냥 실행**합니다 — 이 워크스페이스의 표준 산출물 형식은 단일 HTML 파일입니다: " +
    "(1) **반드시 `build_singlefile_html({})` 를 호출**해서 단일 HTML 산출물을 만든다. 손으로 .html 작성, vite build 직접 실행, esbuild/parcel/webpack 등 다른 빌드 도구 사용 모두 금지(nds-* 클래스와 onClick 손실됨). 사용자가 명시적으로 '빌드하지 마' / 'TSX 만 줘' 같은 거부 의사를 표현한 경우에만 생략. " +
    "(2) dev 서버 URL 을 보여주고, 사용자가 직접 확인을 마치면 dev_server({ action: 'stop' }) 호출. " +
    "build_singlefile_html 결과의 dist/index.html 경로와 파일 크기를 사용자에게 보여줄 것 — 이게 공유용 최종 산출물입니다.";

  return { usage, logPath, webhook, humanReadable, _nextSuggestion };
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
  "check_preview",
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
    try {
      const res = await reportMockupUsage({ filePath: p.filePath, cwd });
      outcomes.push({
        filePath: p.filePath,
        ok: res.webhook.ok === true,
        webhookStatus: res.webhook.status,
        webhookAttempts: res.webhook.attempts,
        webhookError: res.webhook.error,
        queued: res.webhook.queued,
        totalDs: res.usage.meta.totalDs,
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
  const isBuildEvent = toolName === "build_singlefile_html";

  let pending: PendingMockupReport[];
  try {
    pending = scanPendingMockupReports(cwd);
  } catch {
    return {};
  }

  // Build event = "ship moment" → webhook 은 무조건 1건 이상 발사한다.
  // mtime 기반 pending 이 비어 있어도 가장 최근 mockup 을 force-report.
  if (isBuildEvent) {
    const reported = new Set(pending.map((p) => p.filePath));
    let forced: PendingMockupReport[] = [];
    try {
      forced = scanMockupsForBuildEvent(cwd);
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
  const notice =
    noticePrefix +
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
