/**
 * tools/ds-stamp.ts — 목업 산출물에 강제로 박는 "고정 DS 스탬프 바".
 *
 * 목적: 생성된 목업(공유용 dist + 앱 라이브 미리보기)에 **에이전트가 우회할 수 없는**
 * 고정 형태·고정 색의 하단 바를 박아 DS 버전 / NDS 적용률 / (호스트)앱 버전을 항상 노출한다.
 * LLM 이 까먹어도 빌더/프로토콜 단계에서 결정론적으로 주입되므로 누락이 불가능하다.
 *
 * 순수 문자열 연산(no fs / no cheerio) — build-html(dist) 과 mockup-protocol(preview)
 * 양쪽에서 같은 함수로 주입한다. 카운트/버전 측정은 호출부 책임(countHtmlUsage / detectDsVersions).
 *
 * 멱등: injectDsStampBar 는 항상 기존 스탬프를 먼저 걷어내고 새로 박으므로 재주입해도 1개만 남는다.
 */

/** 스탬프 엘리먼트(style/bar 공통)를 식별하는 attribute. strip 의 기준. */
export const DS_STAMP_MARKER = "data-nds-stamp";

export interface DsStampInfo {
  /** DS 버전(detectDsVersions().primary). null/빈 값이면 "—". */
  dsVersion?: string | null;
  /** NDS 적용 비율 0–100(countHtmlUsage().dsRatio). */
  ratio: number;
  /** 호스트 제품 버전 — 데스크탑 하네스면 Nudge Studio 버전. 없으면 STUDIO 세그먼트 생략. */
  appVersion?: string | null;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 고정 팔레트 — 브랜드 cascade 와 무관한 "시스템 워터마크" 색. 어떤 목업 위에서도 동일하게 보인다.
const STAMP = {
  bg: "#16181D",
  border: "#2A2E37",
  text: "#E8EAED",
  dim: "#9AA0AA",
  accent: "#FFD33D", // Nudge 옐로우
  height: 26,
};

/**
 * 고정 스탬프 바 마크업(style + div) 문자열.
 * - position:fixed 하단 풀폭 바, pointer-events:none(클릭/스크롤 비방해), z-index 최상단.
 * - body 에 padding-bottom 을 줘 콘텐츠가 바에 가리지 않게 한다.
 * - 인쇄 시 숨김(@media print).
 */
export function renderDsStampBar(info: DsStampInfo): string {
  const ds = escHtml((info.dsVersion ?? "").trim() || "—");
  const ratio = Math.max(0, Math.min(100, Math.round(info.ratio)));
  const appV = (info.appVersion ?? "").trim();

  const divider = `<span aria-hidden="true" style="width:1px;height:11px;background:rgba(255,255,255,.16);flex:0 0 auto"></span>`;
  const seg = (label: string, value: string, valueColor: string = STAMP.text): string =>
    `<span style="display:inline-flex;align-items:center;gap:5px;flex:0 0 auto">` +
    `<span style="color:${STAMP.dim};font-weight:600">${label}</span>` +
    `<span style="color:${valueColor};font-weight:700">${value}</span></span>`;

  const parts = [
    `<span style="display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;color:${STAMP.accent};font-weight:800;letter-spacing:.04em">` +
      `<span style="font-size:9px;line-height:1">◆</span>NUDGE&nbsp;DS</span>`,
    divider,
    seg("DS", `v${ds}`),
    divider,
    seg("NDS", `${ratio}%`, STAMP.accent),
  ];
  if (appV) {
    parts.push(divider, seg("STUDIO", `v${escHtml(appV)}`));
  }

  const style =
    `<style ${DS_STAMP_MARKER}="style">` +
    `html{--nds-stamp-h:${STAMP.height}px}` +
    `body{padding-bottom:var(--nds-stamp-h)!important}` +
    `@media print{[${DS_STAMP_MARKER}]{display:none!important}}` +
    `</style>`;

  const bar =
    `<div ${DS_STAMP_MARKER}="bar" role="contentinfo" aria-label="Nudge DS 적용 정보" style="` +
    `position:fixed;left:0;right:0;bottom:0;height:${STAMP.height}px;box-sizing:border-box;margin:0;` +
    `display:flex;align-items:center;justify-content:center;gap:10px;padding:0 14px;` +
    `background:${STAMP.bg};border-top:1px solid ${STAMP.border};` +
    `font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1;` +
    `color:${STAMP.text};white-space:nowrap;overflow:hidden;` +
    `z-index:2147483647;pointer-events:none;user-select:none;-webkit-font-smoothing:antialiased">` +
    parts.join("") +
    `</div>`;

  return style + bar;
}

/** 기존 스탬프(style + bar)를 모두 제거. 재주입 멱등성의 핵심. */
export function stripDsStampBar(html: string): string {
  return html
    .replace(/<style\b[^>]*\bdata-nds-stamp\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<div\b[^>]*\bdata-nds-stamp\b[^>]*>[\s\S]*?<\/div>/gi, "");
}

/**
 * HTML 에 고정 스탬프 바를 주입(기존 스탬프는 먼저 제거 → 항상 1개). </body> 직전에 삽입하고,
 * </body> 가 없으면 끝에 덧붙인다.
 */
export function injectDsStampBar(html: string, info: DsStampInfo): string {
  const cleaned = stripDsStampBar(html);
  const block = renderDsStampBar(info);
  if (/<\/body>/i.test(cleaned)) return cleaned.replace(/<\/body>/i, `${block}</body>`);
  return cleaned + block;
}
