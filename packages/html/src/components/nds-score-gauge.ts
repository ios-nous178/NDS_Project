/**
 * <nds-score-gauge> — DS ScoreGauge 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-score-gauge value="62" max="100" show-label show-legend></nds-score-gauge>
 *
 *   <nds-score-gauge
 *     value="14" max="21"
 *     segments='[
 *       {"level":"normal","label":"정상","from":0,"to":5},
 *       {"level":"mild","label":"주의","from":5,"to":10},
 *       {"level":"moderate","label":"경계","from":10,"to":15},
 *       {"level":"severe","label":"심각","from":15,"to":21}
 *     ]'
 *   ></nds-score-gauge>
 *
 * 속성:
 *   value: 점수
 *   max: 최대 (default 100)
 *   segments: JSON 배열 (custom level 구간)
 *   show-label: 단계 라벨 노출
 *   show-legend: 범례 노출
 *   value-suffix: 값 뒤 단위 (default "점")
 */

import { NdsElement, define } from "../base/nds-element.js";
import { cv } from "@nudge-eap/tokens";

const SG_CLASS = "nds-score-gauge";
const SG_TRACK_CLASS = `${SG_CLASS}__track`;
const SG_NEEDLE_CLASS = `${SG_CLASS}__needle`;
const SG_VALUE_CLASS = `${SG_CLASS}__value`;
const SG_VALUE_NUMBER_CLASS = `${SG_CLASS}__value-number`;
const SG_VALUE_MAX_CLASS = `${SG_CLASS}__value-max`;
const SG_LABEL_CLASS = `${SG_CLASS}__label`;
const SG_LEGEND_CLASS = `${SG_CLASS}__legend`;
const SG_LEGEND_ITEM_CLASS = `${SG_CLASS}__legend-item`;

export type GaugeLevel = "normal" | "mild" | "moderate" | "severe";

interface GaugeSegment {
  level: GaugeLevel;
  label: string;
  from: number;
  to: number;
}

const LEVEL_COLOR_VAR: Record<GaugeLevel, string> = {
  normal: cv.iconRole.statusSuccess,
  mild: cv.iconRole.statusCaution,
  moderate: cv.textRole.statusCaution,
  severe: cv.iconRole.statusError,
};

const defaultSegments = (max: number): GaugeSegment[] => [
  { level: "normal", label: "정상", from: 0, to: max * 0.4 },
  { level: "mild", label: "주의", from: max * 0.4, to: max * 0.6 },
  { level: "moderate", label: "경계", from: max * 0.6, to: max * 0.8 },
  { level: "severe", label: "심각", from: max * 0.8, to: max + 0.001 },
];

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const findLevel = (value: number, segments: GaugeSegment[]): GaugeSegment =>
  segments.find((s) => value >= s.from && value < s.to) ?? segments[segments.length - 1];

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  thickness: number,
) => {
  const outerStart = polar(cx, cy, r, startDeg);
  const outerEnd = polar(cx, cy, r, endDeg);
  const innerStart = polar(cx, cy, r - thickness, endDeg);
  const innerEnd = polar(cx, cy, r - thickness, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${r - thickness} ${r - thickness} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
};

export class NdsScoreGauge extends NdsElement {
  static elementName = "nds-score-gauge";

  static get observedAttributes(): readonly string[] {
    return ["value", "max", "segments", "show-label", "show-legend", "value-suffix"];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SG_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseSegments(max: number): GaugeSegment[] {
    const raw = this.getAttribute("segments");
    if (!raw) return defaultSegments(max);
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return defaultSegments(max);
      const valid = parsed.filter(
        (s) =>
          s &&
          typeof s.level === "string" &&
          typeof s.label === "string" &&
          typeof s.from === "number" &&
          typeof s.to === "number",
      ) as GaugeSegment[];
      return valid.length > 0 ? valid : defaultSegments(max);
    } catch {
      return defaultSegments(max);
    }
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = parseFloat(this.attr("value", "0"));
    const max = parseFloat(this.attr("max", "100"));
    const segs = this._parseSegments(max);
    const showLabel = this.attr("show-label", "false") !== "false";
    const showLegend = this.attr("show-legend", "false") !== "false";
    const valueSuffix = this.getAttribute("value-suffix") ?? "점";

    const clamped = clamp(value, 0, max);
    const angleRange = 180;
    const valueDeg = (clamped / max) * angleRange;
    const current = findLevel(value, segs);
    const thickness = 18;

    this._root.innerHTML = "";

    const trackWrap = document.createElement("div");
    trackWrap.dataset.slot = "track";
    trackWrap.className = SG_TRACK_CLASS;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 110");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    segs.forEach((seg) => {
      const startDeg = (seg.from / max) * angleRange;
      const endDeg = (Math.min(seg.to, max) / max) * angleRange;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", arcPath(100, 100, 90, startDeg, endDeg, thickness));
      path.setAttribute("fill", LEVEL_COLOR_VAR[seg.level]);
      path.setAttribute("opacity", "0.9");
      svg.appendChild(path);
    });

    const needle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    needle.dataset.slot = "needle";
    needle.setAttribute("class", SG_NEEDLE_CLASS);
    needle.style.transform = `rotate(${valueDeg - 90}deg)`;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "100");
    line.setAttribute("y1", "100");
    line.setAttribute("x2", "100");
    line.setAttribute("y2", "22");
    line.setAttribute("stroke", cv.iconRole.strong);
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");

    const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c1.setAttribute("cx", "100");
    c1.setAttribute("cy", "100");
    c1.setAttribute("r", "6");
    c1.setAttribute("fill", cv.iconRole.strong);

    const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c2.setAttribute("cx", "100");
    c2.setAttribute("cy", "100");
    c2.setAttribute("r", "3");
    c2.setAttribute("fill", cv.surface.default);

    needle.append(line, c1, c2);
    svg.appendChild(needle);
    trackWrap.appendChild(svg);
    this._root.appendChild(trackWrap);

    const valueWrap = document.createElement("div");
    valueWrap.dataset.slot = "value";
    valueWrap.className = SG_VALUE_CLASS;

    const valueNumber = document.createElement("span");
    valueNumber.dataset.slot = "value-number";
    valueNumber.className = SG_VALUE_NUMBER_CLASS;
    valueNumber.textContent = String(value);

    const valueMax = document.createElement("span");
    valueMax.dataset.slot = "value-max";
    valueMax.className = SG_VALUE_MAX_CLASS;
    valueMax.textContent = `/ ${max}${valueSuffix}`;

    valueWrap.append(valueNumber, valueMax);
    this._root.appendChild(valueWrap);

    if (showLabel) {
      const labelEl = document.createElement("span");
      labelEl.dataset.slot = "label";
      labelEl.dataset.level = current.level;
      labelEl.className = SG_LABEL_CLASS;
      labelEl.textContent = current.label;
      this._root.appendChild(labelEl);
    }

    if (showLegend) {
      const legend = document.createElement("div");
      legend.dataset.slot = "legend";
      legend.className = SG_LEGEND_CLASS;
      segs.forEach((seg) => {
        const item = document.createElement("span");
        item.dataset.slot = "legend-item";
        item.className = SG_LEGEND_ITEM_CLASS;
        item.style.setProperty("--nds-gauge-legend-color", LEVEL_COLOR_VAR[seg.level]);
        item.textContent = seg.label;
        legend.appendChild(item);
      });
      this._root.appendChild(legend);
    }
  }
}

define(NdsScoreGauge);
