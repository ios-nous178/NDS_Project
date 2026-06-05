/**
 * <nds-chart> — 캐포비 어드민 통계 차트 (line / grouped-bar) 의 vanilla Web Component.
 *
 * 무번들러 목업용 — 런타임 차트 라이브러리 없이 정적 inline-SVG 로 렌더.
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계 (node 3001:47404)
 *
 * 사용 예 (라인):
 *   <nds-chart type="line">
 *     <script type="application/json">
 *       { "labels": ["10","20","30","40","50","60"],
 *         "series": [{ "name": "지급된 캐시", "values": [12,28,33,40,42,47] }],
 *         "tooltip": { "index": 3, "text": "123,456,789 w/s" } }
 *     </script>
 *   </nds-chart>
 *
 * 사용 예 (그룹 막대):
 *   <nds-chart type="bar">
 *     <script type="application/json">
 *       { "labels": ["10","20","30","40","50","60"],
 *         "series": [
 *           { "name": "남성", "values": [14,15,22,25,26,16] },
 *           { "name": "여성", "values": [14,18,20,28,26,14] } ] }
 *     </script>
 *   </nds-chart>
 *
 * 데이터는 자식 <script type="application/json"> 또는 data="..." 속성으로 전달.
 * 속성: type(line|bar) / data(JSON) / y-max / y-ticks / no-legend
 *
 * 시리즈 색 기본값 (--nds-chart-* 토큰으로 오버라이드 가능):
 *   line  = var(--nds-chart-line)  #FFD200
 *   bar n = var(--nds-chart-{n})   1=#007AFF(남성) · 2=#FF8437(여성)
 */

import { NdsElement, define } from "../base/nds-element.js";
import {
  CHART_CLASS,
  buildChartSvg,
  buildLegendHtml,
  type ChartConfig,
  type ChartTooltip,
} from "./chart-svg.js";

export class NdsChart extends NdsElement {
  static elementName = "nds-chart";

  static get observedAttributes(): readonly string[] {
    return ["type", "data", "y-max", "y-ticks", "no-legend"];
  }

  private _root: HTMLDivElement | null = null;
  private _scriptRaw: string | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // 데이터 <script> 를 한 번 읽어 보관 후 자식 정리.
    const script = this.querySelector('script[type="application/json"]');
    if (script) this._scriptRaw = script.textContent;
    Array.from(this.childNodes).forEach((node) => node.parentNode?.removeChild(node));

    const root = document.createElement("div");
    root.className = CHART_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseConfig(): ChartConfig | null {
    const raw = this.getAttribute("data") ?? this._scriptRaw;
    if (!raw || !raw.trim()) return null;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn("[nds-chart] data 가 유효한 JSON 이 아닙니다.", {
        error: err,
        rawHead: raw.slice(0, 80),
      });
      return null;
    }
    const typeAttr = this.getAttribute("type");
    const type: "line" | "bar" =
      typeAttr === "bar" || typeAttr === "line"
        ? typeAttr
        : (parsed.type as string) === "bar"
          ? "bar"
          : "line";
    const labels = Array.isArray(parsed.labels) ? (parsed.labels as unknown[]).map(String) : [];
    const series = Array.isArray(parsed.series)
      ? (parsed.series as Record<string, unknown>[])
          .filter((s) => s && Array.isArray(s.values))
          .map((s) => ({
            name: typeof s.name === "string" ? s.name : undefined,
            color: typeof s.color === "string" ? s.color : undefined,
            values: (s.values as unknown[]).map((v) =>
              typeof v === "number" ? v : Number(v) || 0,
            ),
          }))
      : [];
    const yMaxAttr = this.getAttribute("y-max");
    const yTicksAttr = this.getAttribute("y-ticks");
    return {
      type,
      labels,
      series,
      yMax: yMaxAttr ? Number(yMaxAttr) : typeof parsed.yMax === "number" ? parsed.yMax : undefined,
      yTicks: yTicksAttr
        ? Number(yTicksAttr)
        : typeof parsed.yTicks === "number"
          ? parsed.yTicks
          : undefined,
      tooltip:
        parsed.tooltip && typeof (parsed.tooltip as ChartTooltip).index === "number"
          ? (parsed.tooltip as ChartTooltip)
          : undefined,
    };
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const cfg = this._parseConfig();
    if (!cfg || !cfg.series.length) {
      this._root.innerHTML = "";
      return;
    }
    const showLegend = !this.boolAttr("no-legend");
    this._root.innerHTML = buildChartSvg(cfg) + (showLegend ? buildLegendHtml(cfg) : "");
  }
}

define(NdsChart);
