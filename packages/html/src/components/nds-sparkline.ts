/**
 * <nds-sparkline> — DS Sparkline 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";

const SL_CLASS = "nds-sparkline";
const SVG_NS = "http://www.w3.org/2000/svg";

export type SparklineKind = "line" | "area" | "bar";

interface NormalizedPoint {
  x: number;
  y: number;
}

const KINDS: readonly SparklineKind[] = ["line", "area", "bar"];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsSparkline extends NdsElement {
  static elementName = "nds-sparkline";

  static get observedAttributes(): readonly string[] {
    return [
      "data",
      "kind",
      "color",
      "width",
      "height",
      "stroke-width",
      "show-baseline",
      "show-last-dot",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SL_CLASS;
    root.setAttribute("role", "img");
    root.style.display = "inline-block";
    root.style.lineHeight = "0";
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const data = this._data();
    const kind = this._normalizedKind();
    const width = this._numberAttr("width", 120);
    const height = this._numberAttr("height", 36);
    const strokeWidth = this._numberAttr("stroke-width", 2);
    const color = this.attr("color", "var(--semantic-icon-brand-default)");

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }
    if (!this._root.hasAttribute("aria-label") && !this._root.hasAttribute("aria-labelledby")) {
      this._root.setAttribute("aria-label", "추세 차트");
    }

    this._root.replaceChildren(
      createSparklineSvg({
        data,
        kind,
        color,
        width,
        height,
        strokeWidth,
        showBaseline: this.boolAttr("show-baseline"),
        showLastDot:
          !this.hasAttribute("show-last-dot") || this.getAttribute("show-last-dot") !== "false",
      }),
    );
  }

  private _data(): number[] {
    const raw = this.getAttribute("data");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.map(Number).filter(Number.isFinite);
    } catch {
      /* fall through to comma list */
    }
    return raw.split(",").map(Number).filter(Number.isFinite);
  }

  private _normalizedKind(): SparklineKind {
    const value = this.attr("kind", "line");
    return (KINDS as readonly string[]).includes(value) ? (value as SparklineKind) : "line";
  }

  private _numberAttr(name: string, defaultValue: number): number {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) && value > 0 ? value : defaultValue;
  }
}

function createSparklineSvg(options: {
  data: number[];
  kind: SparklineKind;
  color: string;
  width: number;
  height: number;
  strokeWidth: number;
  showBaseline: boolean;
  showLastDot: boolean;
}): SVGSVGElement {
  const { data, kind, color, width, height, strokeWidth, showBaseline, showLastDot } = options;
  const pad = 2;
  const { points, midY } = normalize(data, width, height, pad);
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");

  if (showBaseline) {
    const baseline = document.createElementNS(SVG_NS, "line");
    baseline.setAttribute("x1", String(pad));
    baseline.setAttribute("x2", String(width - pad));
    baseline.setAttribute("y1", String(midY));
    baseline.setAttribute("y2", String(midY));
    baseline.setAttribute("stroke", "rgba(0,0,0,0.08)");
    baseline.setAttribute("stroke-width", "1");
    baseline.setAttribute("stroke-dasharray", "2 3");
    svg.appendChild(baseline);
  }

  if (kind === "bar") {
    const barW = (width - pad * 2) / (Math.max(points.length, 1) * 1.4);
    for (const p of points) {
      const rect = document.createElementNS(SVG_NS, "rect");
      rect.setAttribute("x", String(p.x - barW / 2));
      rect.setAttribute("y", String(p.y));
      rect.setAttribute("width", String(barW));
      rect.setAttribute("height", String(Math.max(1, height - pad - p.y)));
      rect.setAttribute("fill", color);
      rect.setAttribute("rx", "1");
      svg.appendChild(rect);
    }
    return svg;
  }

  if (kind === "area" && points.length > 0) {
    const last = points[points.length - 1];
    const first = points[0];
    const area = document.createElementNS(SVG_NS, "path");
    area.setAttribute(
      "d",
      `${linePath} L${last.x.toFixed(1)},${(height - pad).toFixed(1)} L${first.x.toFixed(1)},${(height - pad).toFixed(1)} Z`,
    );
    area.setAttribute("fill", color);
    area.setAttribute("fill-opacity", "0.2");
    svg.appendChild(area);
  }

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", linePath);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", String(strokeWidth));
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);

  if (showLastDot && points.length > 0) {
    const last = points[points.length - 1];
    const dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("cx", String(last.x));
    dot.setAttribute("cy", String(last.y));
    dot.setAttribute("r", String(strokeWidth + 0.5));
    dot.setAttribute("fill", color);
    svg.appendChild(dot);
  }

  return svg;
}

function normalize(
  data: number[],
  width: number,
  height: number,
  pad: number,
): { points: NormalizedPoint[]; midY: number } {
  if (data.length === 0) return { points: [], midY: height / 2 };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const usableW = width - pad * 2;
  const usableH = height - pad * 2;
  const stepX = data.length === 1 ? 0 : usableW / (data.length - 1);
  const points = data.map((value, index) => ({
    x: pad + stepX * index,
    y: pad + usableH - ((value - min) / range) * usableH,
  }));
  const midY = pad + usableH - ((0 - min) / range) * usableH;
  return { points, midY: Math.max(pad, Math.min(height - pad, midY)) };
}

define(NdsSparkline);
