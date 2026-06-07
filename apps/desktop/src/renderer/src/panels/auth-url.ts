/**
 * PTY(터미널) 출력에서 OAuth 로그인 URL 을 추출한다.
 *
 * 왜 필요한가: 앱에 임베드된 claude 가 로그인 시 브라우저를 직접 띄우려 하지만, GUI 앱이
 * 띄운 PTY 안에서는 새 창이 안 열리는 경우가 있다(특히 Windows). 그래서 출력 스트림에서
 * 인증 URL 을 가로채 Electron 의 shell.openExternal 로 앱이 대신 연다.
 *
 * 두 형태를 모두 잡는다:
 *  1) OSC 8 하이퍼링크 — `ESC ] 8 ; params ; <URL> (BEL|ESC\)`. URL 이 이스케이프 시퀀스
 *     안에 통째로 들어 있어 터미널 폭에 따른 줄바꿈에 안 깨진다(가장 견고).
 *  2) 평문 URL — ANSI/OSC 제거 후 정규식. 줄바꿈으로 잘릴 수 있어 best-effort.
 *
 * 인증 URL 만 연다(oauth 경로). 에이전트가 작업 중 출력하는 일반 claude.ai 링크는 제외.
 */

// ANSI/터미널 이스케이프 파싱이라 제어문자(\x1b·\x07)가 정규식에 들어가는 게 의도된 것.
// eslint-disable-next-line no-control-regex
const OSC8_RE = /\x1b\]8;[^;]*;([^\x07\x1b]*)(?:\x07|\x1b\\)/g;
// CSI / OSC / 단일 ESC 시퀀스 제거용.
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b[@-Z\\-_]/g;
const URL_RE = /https?:\/\/[^\s'"<>\\)\]]+/g;

/** 인증 플로우 URL 인가 — claude/anthropic 도메인 + oauth/authorize 경로. */
function isAuthUrl(url: string): boolean {
  if (!/^https:\/\/(claude\.ai|[^/]*\.anthropic\.com)\//i.test(url)) return false;
  return /oauth|authorize/i.test(url);
}

/** 끝의 구두점(닫는 괄호·마침표 등 터미널 장식)을 떼어 깨끗한 URL 로. */
function trimTrailing(url: string): string {
  return url.replace(/[.,;:'")\]}>]+$/, "");
}

/**
 * 버퍼에서 인증 URL 들을 추출(중복 제거). 버퍼는 청크 경계를 잇기 위해 호출 측이 누적·유지한다.
 */
export function extractAuthUrls(buffer: string): string[] {
  const found = new Set<string>();

  // 1) OSC 8 하이퍼링크 안의 URL.
  for (const m of buffer.matchAll(OSC8_RE)) {
    const url = trimTrailing(m[1] ?? "");
    if (isAuthUrl(url)) found.add(url);
  }

  // 2) ANSI 제거 후 평문 URL. 단, 잘림 방지를 위해 뒤에 공백/제어문자가 와서 "완결"된 것만.
  const plain = buffer.replace(ANSI_RE, "");
  for (const m of plain.matchAll(URL_RE)) {
    const end = m.index + m[0].length;
    const terminated = end < plain.length && /[\s)]/.test(plain[end] ?? "");
    if (!terminated) continue; // 버퍼 끝에 걸쳐 아직 다 안 들어온 URL 은 다음 청크에서.
    const url = trimTrailing(m[0]);
    if (isAuthUrl(url)) found.add(url);
  }

  return [...found];
}
