/**
 * MCP 프로세스 수명 동안 유지되는 세션 상태.
 *
 * stdio MCP 서버는 클라이언트 한 명당 프로세스 하나라 별도 sessionId 분리 없이 모듈
 * 전역 변수로 충분하다. 다음 두 종류의 안티패턴을 잡기 위해 도입:
 *
 *  1) validate_html_mockup({ report: false }) 를 연속 호출하면서 마지막 1회를 true 로
 *     되돌리지 않아 구글시트에 적재가 누락되는 사고. → 호출 카운터를 응답에 노출.
 *  2) get_guide({ topic: 'principles' }) 를 한 번도 호출하지 않은 채 mockup 작업을
 *     시작해서 emoji/native/raw-landmark 위반을 사후에 패치하는 토큰 낭비. →
 *     validate/build 응답에 reminder 를 띄움.
 */

interface SessionState {
  principlesCalledAt?: number;
  visualRefEmitted: boolean;
  reportSuppressCount: number;
  reportSentCount: number;
}

const state: SessionState = {
  principlesCalledAt: undefined,
  visualRefEmitted: false,
  reportSuppressCount: 0,
  reportSentCount: 0,
};

export function markPrinciplesCalled(): void {
  state.principlesCalledAt = Date.now();
}

export function principlesAcked(): boolean {
  return state.principlesCalledAt !== undefined;
}

export function principlesCalledAt(): number | undefined {
  return state.principlesCalledAt;
}

/**
 * visual-reference 게이트 프롬프트를 이번 세션에서 풀로 1회 내보냈는지.
 * 게이트 강제는 툴 description / 생성된 CLAUDE.md / pattern:visual-reference 가이드에
 * 3중으로 박혀 있어, 매 조회 응답에 풀 블록을 재첨부하는 건 순수 토큰 중복이다.
 * 첫 응답만 풀로 싣고 이후엔 슬림 stub 으로 대체하기 위한 플래그.
 */
export function markVisualRefEmitted(): void {
  state.visualRefEmitted = true;
}

export function visualRefEmitted(): boolean {
  return state.visualRefEmitted;
}

/** report:false 호출 1회. 누적 카운트를 돌려준다. */
export function noteReportSuppressed(): number {
  state.reportSuppressCount += 1;
  return state.reportSuppressCount;
}

/** report:true (또는 default) 호출 1회. suppress 카운터를 리셋한다. */
export function noteReportSent(): void {
  state.reportSuppressCount = 0;
  state.reportSentCount += 1;
}

export function getReportSuppressCount(): number {
  return state.reportSuppressCount;
}

export function getReportSentCount(): number {
  return state.reportSentCount;
}

/** 테스트 / 디버깅용. */
export function _resetSessionState(): void {
  state.principlesCalledAt = undefined;
  state.visualRefEmitted = false;
  state.reportSuppressCount = 0;
  state.reportSentCount = 0;
}
