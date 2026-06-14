/**
 * tools/feedback/types.ts — 데스크탑 하네스가 수집하는 유저 피드백 데이터 모델.
 *
 * 두 종류만 존재한다:
 *  - `revision-request`: "이 목업에 수정요청이 있나요?" 토글에서 "예" → 수정내용.
 *  - `feedback`        : 별도 "기타 피드백" 자유 입력.
 *
 * usage(`MockupUsage`)와 의도적으로 분리한다 — 같은 webhook URL 로 보내더라도 body 의
 * `kind` 판별자로 Apps Script 가 별도 시트/탭에 적재해야 usage 통계가 오염되지 않는다.
 * (그 분기가 준비되기 전까지 데스크탑은 로컬 JSONL 저장만 하고 전송은 OFF.)
 */
// satisfaction = 목업 결과 👍/👎 만족도(객관 점수 옆 주관 신호). comment 없이 sentiment 만으로 성립.
export type FeedbackKind = "revision-request" | "feedback" | "satisfaction";

export interface FeedbackEntry {
  /** webhook consumer 용 idempotency 키. */
  feedbackId: string;
  kind: FeedbackKind;
  /** 피드백 대상 화면 표시명(보통 선택된 목업 rel 경로). */
  screen: string;
  comment: string;
  /** OS 사용자명. 알 수 없으면 null. */
  reviewer: string | null;
  /** detectDsVersions(projectPath).primary — 이 피드백이 본 DS 버전. */
  dsVersion: string | null;
  /** 프로젝트 루트 기준 목업 파일 rel 경로. */
  mockupFile: string;
  /** 만족도(satisfaction) — 👍=up / 👎=down. 일반 피드백이면 생략. */
  sentiment?: "up" | "down";
  /** 평가 시점의 객관 품질 점수(validate scores.overall) — 주관↔객관 페어링. */
  scoreOverall?: number | null;
  /** ISO timestamp. */
  timestamp: string;
}

/** buildFeedbackEntry 입력 — feedbackId / timestamp 는 자동 생성된다. */
export interface FeedbackInput {
  kind: FeedbackKind;
  screen: string;
  comment: string;
  reviewer?: string | null;
  dsVersion?: string | null;
  mockupFile: string;
  sentiment?: "up" | "down";
  scoreOverall?: number | null;
}
