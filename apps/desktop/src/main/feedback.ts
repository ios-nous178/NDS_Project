import os from "node:os";
import {
  buildFeedbackEntry,
  detectDsVersions,
  feedbackLogPath,
  resolveWritableLogDir,
  safeAppendFeedbackToLog,
  type FeedbackEntry,
  type FeedbackKind,
} from "@nudge-design/mockup-core";

export interface SubmitFeedbackArgs {
  projectPath: string;
  kind: FeedbackKind;
  /** 피드백 대상 화면 표시명(보통 선택된 목업 rel 경로). */
  screen: string;
  comment: string;
  /** 프로젝트 루트 기준 목업 파일 rel 경로. */
  mockupFile: string;
}

export interface SubmitFeedbackResult {
  ok: boolean;
  entry?: FeedbackEntry;
  /** 실제로 기록된 로그 파일 절대경로(성공 시). */
  logPath?: string;
  error?: string;
}

/** os.userInfo() 는 일부 환경(컨테이너 등)에서 throw — null 로 방어. */
function currentReviewer(): string | null {
  try {
    return os.userInfo().username || null;
  } catch {
    return null;
  }
}

/**
 * 유저 피드백 1건을 로컬 `.ds-feedback-log.jsonl` 에 적재한다.
 *
 * reviewer=OS 사용자, dsVersion=프로젝트에 설치된 @nudge-design/react 버전.
 * 저장 위치는 core resolveWritableLogDir 로 결정(프로젝트 루트, `/` cwd 방어).
 *
 * ⛔ webhook 전송은 일부러 하지 않는다 — usage 와 같은 URL 이지만 Apps Script 가
 *    body 의 kind("feedback")로 분기해 별도 시트에 적재하도록 준비되기 전까지는
 *    usage 시트 오염을 막기 위해 로컬 저장만 한다. (core postJsonToWebhook 준비됨.)
 */
export function submitFeedback(args: SubmitFeedbackArgs): SubmitFeedbackResult {
  const comment = args.comment.trim();
  if (!comment) return { ok: false, error: "내용이 비어 있습니다." };

  const dir = resolveWritableLogDir({ cwd: args.projectPath });
  const entry = buildFeedbackEntry({
    kind: args.kind,
    screen: args.screen,
    comment,
    reviewer: currentReviewer(),
    dsVersion: detectDsVersions(args.projectPath).primary,
    mockupFile: args.mockupFile,
  });

  const res = safeAppendFeedbackToLog(entry, feedbackLogPath(dir));
  if (res.logPath == null) return { ok: false, error: res.logError ?? "로그 기록 실패" };
  return { ok: true, entry, logPath: res.logPath };
}
