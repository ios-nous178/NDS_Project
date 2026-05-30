/**
 * tools/events/log.ts — `.ds-app-events.jsonl` append / read + projectPath 해시.
 *
 * usage/feedback 로그와 동일한 패턴: 쓰기 위치는 `resolveWritableLogDir({ cwd })` 로
 * 결정하고, append 실패(EROFS/EACCES)는 throw 대신 swallow 한다.
 *
 * webhook/Supabase 전송은 이 모듈의 책임이 아니다 — local-first 로 로컬에만 적재하고
 * sync 는 후속(그때 `projectPathHash` 만 전송).
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";

import type { AppEvent, AppEventInput } from "./types.js";

export const APP_EVENTS_FILENAME = ".ds-app-events.jsonl";

export function appEventsLogPath(dir: string): string {
  return path.join(dir, APP_EVENTS_FILENAME);
}

/**
 * 절대 프로젝트 경로를 SHA-256 앞 16자로 해시. 로그/sync 에는 절대경로 대신 이 값만 남긴다
 * (`/Users/...` 같은 개인 경로 유출 방지). 같은 프로젝트는 항상 같은 hash → 집계 가능.
 */
export function hashProjectPath(absPath: string): string {
  return createHash("sha256").update(path.resolve(absPath)).digest("hex").slice(0, 16);
}

/** eventId(uuid) / timestamp(ISO) 를 채워 완전한 AppEvent 를 만든다. */
export function buildAppEvent(input: AppEventInput): AppEvent {
  return {
    eventId: randomUUID(),
    type: input.type,
    sessionId: input.sessionId,
    projectPathHash: input.projectPathHash,
    mockupFile: input.mockupFile,
    payload: input.payload,
    timestamp: new Date().toISOString(),
  };
}

export function appendAppEvent(event: AppEvent, logPath: string): void {
  mkdirSync(path.dirname(logPath), { recursive: true });
  appendFileSync(logPath, JSON.stringify(event) + "\n", "utf8");
}

/** appendAppEvent 를 감싸 환경 실패를 swallow. 성공: { logPath } / 실패: { logPath: null, logError }. */
export function safeAppendAppEvent(
  event: AppEvent,
  logPath: string,
): { logPath: string | null; logError?: string } {
  try {
    appendAppEvent(event, logPath);
    return { logPath };
  } catch (err) {
    return { logPath: null, logError: (err as Error).message };
  }
}

/** 로그를 읽어 newest-last 배열로. 깨진 라인 skip. 후속 sync/조회용. */
export function readAppEvents(logPath: string): AppEvent[] {
  if (!existsSync(logPath)) return [];
  let raw: string;
  try {
    raw = readFileSync(logPath, "utf8");
  } catch {
    return [];
  }
  const out: AppEvent[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line) as AppEvent);
    } catch {
      /* skip 깨진 라인 */
    }
  }
  return out;
}
