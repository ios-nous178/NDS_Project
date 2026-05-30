/**
 * tools/events/types.ts — 앱 작업 흐름 이벤트 로그(`.ds-app-events.jsonl`)의 데이터 모델.
 *
 * 목적: "나중에 문제를 재현하거나 피드백 맥락을 이해하는 데 필요한" 의미있는 액션만 거칠게
 * 기록한다. 일반 버튼 클릭 전부 같은 노이즈는 담지 않는다.
 *
 * local-first: 모든 이벤트는 로컬 JSONL 에 먼저 적재. 클라우드(Supabase) sync 는 후속 —
 * 그때 절대경로 대신 `projectPathHash` 만 전송한다(절대경로는 로컬 전용).
 *
 * 에이전트(claude/codex)는 PTY 로 구동하므로 구조적 메시지 파싱은 하지 않는다.
 * 따라서 `agent_*` 이벤트는 시작/완료/실패 수준의 거친 신호만 담는다(payload 로 보강).
 */
export type AppEventType =
  | "project_opened"
  | "mockup_selected"
  | "validation_completed"
  | "export_completed"
  | "feedback_submitted"
  | "agent_started"
  | "agent_response_completed"
  | "agent_failed"
  | "error_occurred";

export interface AppEvent {
  /** webhook/sync consumer 용 idempotency 키. */
  eventId: string;
  type: AppEventType;
  /** 에이전트 세션과 연결되는 이벤트면 그 세션 id. */
  sessionId?: string;
  /** 절대경로 SHA-256(앞 16자). 로그엔 항상 hash 만 — 절대경로는 로컬 UI 에서만 별도 보관. */
  projectPathHash: string;
  /** 프로젝트 루트 기준 목업 rel 경로(해당되면). */
  mockupFile?: string;
  /** 이벤트별 가변 필드(검증 pass/fail 요약, 에이전트 종류, 에러 메시지 등). */
  payload?: Record<string, unknown>;
  /** ISO timestamp. */
  timestamp: string;
}

export interface AppEventInput {
  type: AppEventType;
  projectPathHash: string;
  sessionId?: string;
  mockupFile?: string;
  payload?: Record<string, unknown>;
}
