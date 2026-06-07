import {
  appEventsLogPath,
  buildAppEvent,
  hashProjectPath,
  resolveWritableLogDir,
  safeAppendAppEvent,
  type AppEventInput,
} from "@nudge-design/mockup-core";

/**
 * 앱 작업 흐름 이벤트 1건을 로컬 `.ds-app-events.jsonl` 에 best-effort 적재.
 *
 * main 의 단일 진입점 — 호출자는 절대 projectPath 를 넘기고, 여기서 `projectPathHash` 로
 * 변환해 기록한다(절대경로는 로그에 남기지 않음). 로컬 전용(전송 OFF). 실패해도 throw 하지
 * 않는다 — 이벤트 로깅 실패가 본 기능(검증/내보내기/에이전트)을 막으면 안 된다.
 */
export function logAppEvent(
  projectPath: string,
  input: Omit<AppEventInput, "projectPathHash">,
): void {
  try {
    const dir = resolveWritableLogDir({ cwd: projectPath });
    const event = buildAppEvent({ ...input, projectPathHash: hashProjectPath(projectPath) });
    safeAppendAppEvent(event, appEventsLogPath(dir));
  } catch {
    /* best-effort */
  }
}
