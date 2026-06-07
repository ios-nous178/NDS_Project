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
  /** NDS 전체 사용률 0–100 (overallRatio == 기존 dsRatio). 항상 표기되는 하한값. */
  ratio: number;
  /**
   * A 작업: 채택률(쓸 수 있었던 것 중 DS 비율). `ratio`(전체)와 **다를 때만** "채택 A% · 전체 B%"
   * 2단 표기. 생략하거나 ratio 와 같으면 단일 "전체%"로 폴백.
   * (HTML 목업은 모든 non-DS 가 avoidable·forced 0 이라 구조상 A==B → 자연히 단일 표기.)
   */
  adoptionRatio?: number;
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
  bg: "rgba(22,24,29,.82)", // 반투명 — 뒤 UI 가 비치게(backdrop-filter blur 와 함께).
  border: "rgba(255,255,255,.12)",
  text: "#E8EAED",
  dim: "#9AA0AA",
  accent: "#FFD33D", // Nudge 옐로우
  height: 28,
};

/**
 * 고정 스탬프 바 마크업(style + div) 문자열.
 * - 좌측 하단 **플로팅 pill**(풀폭 X) — UI 를 최소로 가린다. 반투명 + backdrop blur.
 * - X 버튼으로 즉시 숨김(인라인 onclick 으로 스탬프 엘리먼트 전체 제거 — JS 의존 최소).
 * - pointer-events:auto 는 X 클릭을 위해 필요. pill 자체만 작게 차지(나머지 화면은 비방해).
 * - 인쇄 시 숨김(@media print).
 */
export function renderDsStampBar(info: DsStampInfo): string {
  const ds = escHtml((info.dsVersion ?? "").trim() || "—");
  const clampPct = (n: number): number => Math.max(0, Math.min(100, Math.round(n)));
  const overall = clampPct(info.ratio);
  const adoption =
    typeof info.adoptionRatio === "number" ? clampPct(info.adoptionRatio) : undefined;
  // 채택률이 전체와 다를 때만 2단 표기 — "있었는데 안 쓴(avoidable)" 갭이 있다는 신호.
  const ndsValue =
    adoption !== undefined && adoption !== overall
      ? `채택 ${adoption}% · 전체 ${overall}%`
      : `${overall}%`;
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
    seg("NDS", ndsValue, STAMP.accent),
  ];
  if (appV) {
    parts.push(divider, seg("STUDIO", `v${escHtml(appV)}`));
  }

  // X 닫기 — 클릭 시 스탬프 엘리먼트(bar + style)를 모두 제거한다. 따옴표 충돌 없도록
  // querySelector 는 작은따옴표, onclick 값은 큰따옴표.
  const close =
    `<button type="button" ${DS_STAMP_MARKER}="close" aria-label="숨기기" title="숨기기" ` +
    `onclick="for(var n of document.querySelectorAll('[${DS_STAMP_MARKER}]'))n.remove()" style="` +
    `display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;` +
    `width:18px;height:18px;padding:0;margin:0;border:0;border-radius:999px;cursor:pointer;` +
    `background:rgba(255,255,255,.08);color:${STAMP.dim};font-size:14px;line-height:1;` +
    `font-family:inherit">&times;</button>`;

  const style =
    `<style ${DS_STAMP_MARKER}="style">` +
    `@media print{[${DS_STAMP_MARKER}]{display:none!important}}` +
    `</style>`;

  const bar =
    `<div ${DS_STAMP_MARKER}="bar" role="contentinfo" aria-label="Nudge DS 적용 정보" style="` +
    `position:fixed;left:12px;bottom:12px;height:${STAMP.height}px;box-sizing:border-box;margin:0;` +
    `display:inline-flex;align-items:center;gap:9px;padding:0 6px 0 12px;` +
    `background:${STAMP.bg};border:1px solid ${STAMP.border};border-radius:999px;` +
    `-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(0,0,0,.32);` +
    `font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1;` +
    `color:${STAMP.text};white-space:nowrap;overflow:hidden;` +
    `z-index:2147483647;pointer-events:auto;user-select:none;-webkit-font-smoothing:antialiased">` +
    parts.join("") +
    divider +
    close +
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
