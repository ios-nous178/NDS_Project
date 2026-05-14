/**
 * tools/usage/tracker.ts — usage 데이터의 IO 레이어.
 *
 * 책임 범위:
 *  - `.ds-usage-log.jsonl` append
 *  - 공용 Google Sheets webhook POST + 재시도
 *  - 실패 시 큐 파일에 적재 / 재시도 flush
 *  - 외부 프로젝트 cwd 를 스캔해 보고되지 않은 `*Mockup.tsx` 후보 산출
 *
 * 파싱 책임은 sibling `./parser.ts` 에, MCP tool 진입 (응답 정형 / 가드레일) 은
 * 부모 `../usage.ts` 에 있다. 이 파일은 순수 IO 만 다루므로 fetch / fs 만 모킹하면
 * 단위 테스트가 가능하다.
 */
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
import { dirname, join } from "node:path";
import type { MockupUsage, PendingMockupReport } from "../../types/usage.js";
import { relativeSafe, serializeUsage } from "./parser.js";

export function appendUsageToLog(usage: MockupUsage, logPath: string): void {
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, serializeUsage(usage) + "\n", "utf8");
}

export interface PostUsageOptions {
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

/* ───────────── webhook 재시도 큐 ───────────── */

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

/* ───────────── pending-report scanner ───────────── */

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
