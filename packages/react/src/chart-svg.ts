// ⚠️ 동기화: packages/html/src/components/chart-svg.ts 와 동일 로직 유지 (react/html 듀얼 패턴).
/**
 * chart-svg — 프레임워크 무관 순수 차트 SVG 빌더 (line / grouped-bar).
 * DOM 의존 없음 → Node 테스트 가능. nds-chart(웹컴포넌트)·React Chart 가 공유.
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계 (node 3001:47404)
 */

export const CHART_CLASS = "nds-chart";
export const CHART_SVG_CLASS = `${CHART_CLASS}__svg`;
export const CHART_GRID_CLASS = `${CHART_CLASS}__grid`;
export const CHART_AXIS_CLASS = `${CHART_CLASS}__axis`;
export const CHART_LABEL_CLASS = `${CHART_CLASS}__label`;
export const CHART_TOOLTIP_CLASS = `${CHART_CLASS}__tooltip`;
export const CHART_LEGEND_CLASS = `${CHART_CLASS}__legend`;
export const CHART_LEGEND_ITEM_CLASS = `${CHART_CLASS}__legend-item`;
export const CHART_LEGEND_DOT_CLASS = `${CHART_CLASS}__legend-dot`;

export interface ChartSeries {
  name?: string;
  color?: string;
  values: number[];
}

export interface ChartTooltip {
  index: number;
  seriesIndex?: number;
  text?: string;
}

export interface ChartConfig {
  type: "line" | "bar" | "donut";
  labels: string[];
  series: ChartSeries[];
  yMax?: number;
  yTicks?: number;
  tooltip?: ChartTooltip;
}

/* ─── 레이아웃 상수 (viewBox 좌표계) ─── */
const VIEW_W = 640;
const PAD_L = 72;
const PAD_R = 20;
const PAD_T = 16;
const PAD_B = 36;
const PLOT_H = 240;
const VIEW_H = PAD_T + PLOT_H + PAD_B;
const PLOT_W = VIEW_W - PAD_L - PAD_R;

export function esc(s: string): string {
  return String(s).replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;",
  );
}

export function comma(v: number): string {
  return Math.round(v).toLocaleString("en-US");
}

/** 데이터 최대값 → 보기 좋은 상한 (ticks 로 나누어 떨어지도록). */
export function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const f = v / base;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nf * base;
}

/** 시리즈 기본 팔레트 (--nds-chart-* 미정의 시 fallback). 캐포비 데이터-뷰 색. */
const DEFAULT_FILL = ["#007AFF", "#FF8437", "#FFD200", "#34C759"];

export function seriesColor(type: string, i: number, explicit?: string): string {
  if (explicit) return explicit;
  if (type === "line" && i === 0) return "var(--nds-chart-line, #FFD200)";
  return `var(--nds-chart-${i + 1}, ${DEFAULT_FILL[i] ?? DEFAULT_FILL[0]})`;
}

/* ─── 도넛(성별 분포 등) 레이아웃 — 정사각 viewBox ─── */
const DONUT_VIEW = 220;
const DONUT_CX = 110;
const DONUT_CY = 110;
const DONUT_OUTER = 88;
const DONUT_INNER = 52;

interface DonutSeg {
  name: string;
  color: string;
  value: number;
}

function donutSegs(cfg: ChartConfig): DonutSeg[] {
  return cfg.series.map((s, i) => ({
    name: s.name ?? "",
    color: seriesColor("donut", i, s.color),
    value: s.values.reduce((a, b) => a + (Number(b) || 0), 0),
  }));
}

/**
 * 도넛 SVG — 각 세그먼트를 stroke-dasharray 링으로 그린다(100%·빈 상태도 안전).
 * total=0 이면 전체 회색 링(--nds-chart-empty). 시작각 -90(상단), 시계방향.
 */
export function buildDonutSvg(cfg: ChartConfig): string {
  const segs = donutSegs(cfg);
  const total = segs.reduce((a, s) => a + s.value, 0);
  const rMid = (DONUT_OUTER + DONUT_INNER) / 2;
  const w = DONUT_OUTER - DONUT_INNER;
  const circ = 2 * Math.PI * rMid;
  const parts: string[] = [];
  if (total <= 0) {
    parts.push(
      `<circle cx="${DONUT_CX}" cy="${DONUT_CY}" r="${rMid}" fill="none" stroke="var(--nds-chart-empty, #BBBBBB)" stroke-width="${w}" />`,
    );
  } else {
    let cum = -90;
    for (const s of segs) {
      if (s.value <= 0) continue;
      const f = s.value / total;
      const segLen = f * circ;
      parts.push(
        `<circle cx="${DONUT_CX}" cy="${DONUT_CY}" r="${rMid}" fill="none" stroke="${s.color}" stroke-width="${w}" stroke-dasharray="${segLen.toFixed(2)} ${(circ - segLen).toFixed(2)}" transform="rotate(${cum.toFixed(2)} ${DONUT_CX} ${DONUT_CY})" />`,
      );
      cum += f * 360;
    }
  }
  return `<svg class="${CHART_SVG_CLASS}" viewBox="0 0 ${DONUT_VIEW} ${DONUT_VIEW}" role="img" preserveAspectRatio="xMidYMid meet">${parts.join(
    "",
  )}</svg>`;
}

/** 순수 SVG 빌더 — 문자열 반환. */
export function buildChartSvg(cfg: ChartConfig): string {
  const { type, labels, series } = cfg;
  if (type === "donut") return buildDonutSvg(cfg);
  const ticks = Math.max(1, cfg.yTicks ?? 4);

  const dataMax = Math.max(0, ...series.flatMap((s) => s.values));
  const yMax = cfg.yMax && cfg.yMax > 0 ? cfg.yMax : niceCeil(dataMax / ticks) * ticks || 1;

  const xToPx = (i: number, n: number) =>
    n <= 1 ? PAD_L + PLOT_W / 2 : PAD_L + (PLOT_W * i) / (n - 1);
  const yToPx = (v: number) => PAD_T + PLOT_H - (Math.max(0, v) / yMax) * PLOT_H;

  const parts: string[] = [];

  /* ── 가로 그리드 + y 눈금 라벨 ── */
  for (let t = 0; t <= ticks; t++) {
    const y = PAD_T + PLOT_H - (PLOT_H * t) / ticks;
    parts.push(
      `<line class="${CHART_GRID_CLASS}" x1="${PAD_L}" y1="${y}" x2="${PAD_L + PLOT_W}" y2="${y}" />`,
    );
    parts.push(
      `<text class="${CHART_LABEL_CLASS}" x="${PAD_L - 10}" y="${y + 4}" text-anchor="end">${esc(
        comma((yMax * t) / ticks),
      )}</text>`,
    );
  }

  /* ── 좌측 세로축 + 하단 가로축 ── */
  parts.push(
    `<line class="${CHART_AXIS_CLASS}" x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + PLOT_H}" />`,
  );
  parts.push(
    `<line class="${CHART_AXIS_CLASS}" x1="${PAD_L}" y1="${PAD_T + PLOT_H}" x2="${PAD_L + PLOT_W}" y2="${PAD_T + PLOT_H}" />`,
  );

  const n = labels.length;

  if (type === "bar") {
    const S = Math.max(1, series.length);
    const slot = PLOT_W / Math.max(1, n);
    const barAreaW = slot * 0.62;
    const barW = Math.min(barAreaW / S, 26);
    const groupW = barW * S;
    for (let i = 0; i < n; i++) {
      const cx = PAD_L + slot * (i + 0.5);
      const startX = cx - groupW / 2;
      series.forEach((s, si) => {
        const v = s.values[i] ?? 0;
        const x = startX + si * barW;
        const y = yToPx(v);
        const h = PAD_T + PLOT_H - y;
        parts.push(
          `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(barW - 2).toFixed(
            1,
          )}" height="${Math.max(0, h).toFixed(1)}" rx="3" fill="${seriesColor(type, si, s.color)}" />`,
        );
      });
      parts.push(
        `<text class="${CHART_LABEL_CLASS}" x="${cx.toFixed(1)}" y="${PAD_T + PLOT_H + 22}" text-anchor="middle">${esc(
          labels[i] ?? "",
        )}</text>`,
      );
    }
  } else {
    series.forEach((s, si) => {
      const color = seriesColor(type, si, s.color);
      const pts = s.values.map((v, i) => `${xToPx(i, n).toFixed(1)},${yToPx(v).toFixed(1)}`);
      parts.push(
        `<polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />`,
      );
      s.values.forEach((v, i) => {
        parts.push(
          `<circle cx="${xToPx(i, n).toFixed(1)}" cy="${yToPx(v).toFixed(1)}" r="4" fill="${color}" />`,
        );
      });
    });
    for (let i = 0; i < n; i++) {
      parts.push(
        `<text class="${CHART_LABEL_CLASS}" x="${xToPx(i, n).toFixed(1)}" y="${PAD_T + PLOT_H + 22}" text-anchor="middle">${esc(
          labels[i] ?? "",
        )}</text>`,
      );
    }
  }

  /* ── 툴팁 (선택) ── */
  if (cfg.tooltip && labels.length) {
    const idx = Math.max(0, Math.min(n - 1, cfg.tooltip.index));
    const si = cfg.tooltip.seriesIndex ?? 0;
    const s = series[si];
    if (s) {
      const v = s.values[idx] ?? 0;
      let ax: number;
      let ay: number;
      if (type === "bar") {
        const slot = PLOT_W / Math.max(1, n);
        ax = PAD_L + slot * (idx + 0.5);
        ay = yToPx(v);
      } else {
        ax = xToPx(idx, n);
        ay = yToPx(v);
      }
      const txt = cfg.tooltip.text ?? comma(v);
      const boxW = txt.length * 7.5 + 24;
      const boxH = 30;
      let bx = ax - boxW / 2;
      bx = Math.max(PAD_L, Math.min(bx, PAD_L + PLOT_W - boxW));
      const by = Math.max(PAD_T, ay - boxH - 12);
      parts.push(
        `<rect class="${CHART_TOOLTIP_CLASS}__box" x="${bx.toFixed(1)}" y="${by.toFixed(
          1,
        )}" width="${boxW.toFixed(1)}" height="${boxH}" rx="8" />`,
      );
      parts.push(
        `<text class="${CHART_TOOLTIP_CLASS}__text" x="${(bx + boxW / 2).toFixed(1)}" y="${(
          by +
          boxH / 2 +
          4
        ).toFixed(1)}" text-anchor="middle">${esc(txt)}</text>`,
      );
    }
  }

  return `<svg class="${CHART_SVG_CLASS}" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" preserveAspectRatio="xMidYMid meet">${parts.join(
    "",
  )}</svg>`;
}

/** 범례 HTML (시리즈명이 있을 때만). */
export function buildLegendItems(cfg: ChartConfig): { color: string; name: string }[] {
  return cfg.series
    .map((s, i) => ({ color: seriesColor(cfg.type, i, s.color), name: s.name ?? "" }))
    .filter((x) => x.name);
}

export function buildLegendHtml(cfg: ChartConfig): string {
  if (cfg.type === "donut") {
    const segs = donutSegs(cfg).filter((s) => s.name);
    if (!segs.length) return "";
    const total = segs.reduce((a, s) => a + s.value, 0);
    const inner = segs
      .map(
        (s) =>
          `<span class="${CHART_LEGEND_ITEM_CLASS}"><span class="${CHART_LEGEND_DOT_CLASS}" style="background:${s.color}"></span>${esc(
            s.name,
          )} <b class="${CHART_CLASS}__legend-pct">${
            total > 0 ? Math.round((s.value / total) * 100) : 0
          }%</b></span>`,
      )
      .join("");
    return `<div class="${CHART_LEGEND_CLASS}">${inner}</div>`;
  }
  const items = buildLegendItems(cfg);
  if (!items.length) return "";
  const inner = items
    .map(
      (x) =>
        `<span class="${CHART_LEGEND_ITEM_CLASS}"><span class="${CHART_LEGEND_DOT_CLASS}" style="background:${x.color}"></span>${esc(
          x.name,
        )}</span>`,
    )
    .join("");
  return `<div class="${CHART_LEGEND_CLASS}">${inner}</div>`;
}
