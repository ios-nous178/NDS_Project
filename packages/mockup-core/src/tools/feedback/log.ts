/**
 * tools/feedback/log.ts — `.ds-feedback-log.jsonl` append / read IO.
 *
 * usage 의 `tools/usage/log-path.ts` 패턴을 미러한다: 쓰기 위치는 호출자가
 * `resolveWritableLogDir({ cwd })` 로 결정하고(여기선 그 결과 dir 만 받음), append 실패
 * (EROFS / EACCES 등)는 throw 대신 swallow 해 UI 가 logError 로 표면화하게 둔다.
 *
 * webhook 전송은 이 모듈의 책임이 아니다 — usage 와 동일한 URL 로 보내되 `kind` 분기가
 * Apps Script 에 준비되기 전까지 데스크탑은 로컬 저장만 한다(전송 OFF).
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

import type { FeedbackEntry, FeedbackInput } from "./types.js";

export const FEEDBACK_LOG_FILENAME = ".ds-feedback-log.jsonl";
export const FEEDBACK_WEBHOOK_QUEUE_FILENAME = ".ds-feedback-webhook-queue.jsonl";

export function feedbackLogPath(dir: string): string {
  return path.join(dir, FEEDBACK_LOG_FILENAME);
}

/** feedbackId(uuid) / timestamp(ISO) 를 채워 완전한 FeedbackEntry 를 만든다. */
export function buildFeedbackEntry(input: FeedbackInput): FeedbackEntry {
  return {
    feedbackId: randomUUID(),
    kind: input.kind,
    screen: input.screen,
    comment: input.comment,
    reviewer: input.reviewer ?? null,
    dsVersion: input.dsVersion ?? null,
    mockupFile: input.mockupFile,
    timestamp: new Date().toISOString(),
  };
}

export function appendFeedbackToLog(entry: FeedbackEntry, logPath: string): void {
  mkdirSync(path.dirname(logPath), { recursive: true });
  appendFileSync(logPath, JSON.stringify(entry) + "\n", "utf8");
}

/**
 * appendFeedbackToLog 를 감싸 환경 실패를 swallow.
 * 성공: { logPath } / 실패: { logPath: null, logError }.
 */
export function safeAppendFeedbackToLog(
  entry: FeedbackEntry,
  logPath: string,
): { logPath: string | null; logError?: string } {
  try {
    appendFeedbackToLog(entry, logPath);
    return { logPath };
  } catch (err) {
    return { logPath: null, logError: (err as Error).message };
  }
}

/**
 * 로그 파일을 읽어 newest-last 순서의 엔트리 배열로 반환. 깨진 라인은 skip.
 * 현재 데스크탑 UI 는 인라인 목록을 안 띄우지만(후속), 후속 `feedback:list` 가
 * 바로 쓸 수 있도록 같이 둔다 — 순수 read 라 비용이 거의 없다.
 */
export function readFeedbackLog(logPath: string): FeedbackEntry[] {
  if (!existsSync(logPath)) return [];
  let raw: string;
  try {
    raw = readFileSync(logPath, "utf8");
  } catch {
    return [];
  }
  const out: FeedbackEntry[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line) as FeedbackEntry);
    } catch {
      /* skip 깨진 라인 */
    }
  }
  return out;
}
