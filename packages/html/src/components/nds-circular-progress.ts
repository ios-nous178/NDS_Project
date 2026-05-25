/**
 * <nds-circular-progress> — DS CircularProgress 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React CircularProgress.tsx 와 동일):
 *   <nds-circular-progress value="72" caption="완료"></nds-circular-progress>
 *     └─ <div class="nds-circular-progress" data-slot="root" role="progressbar" ...>
 *          ├─ <svg class="nds-circular-progress__svg">...</svg>
 *          └─ <div class="nds-circular-progress__label">...</div>
 */

import { NdsElement, define } from "../base/nds-element.js";

const CP_CLASS = "nds-circular-progress";
const CP_SVG_CLASS = `${CP_CLASS}__svg`;
const CP_TRACK_CLASS = `${CP_CLASS}__track`;
const CP_FILL_CLASS = `${CP_CLASS}__fill`;
const CP_LABEL_CLASS = `${CP_CLASS}__label`;
const CP_VALUE_CLASS = `${CP_CLASS}__value`;
const CP_CAPTION_CLASS = `${CP_CLASS}__caption`;

const FORWARDED_ATTRS = ["aria-labelledby", "title"] as const;

export class NdsCircularProgress extends NdsElement {
  static elementName = "nds-circular-progress";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "max",
      "size",
      "thickness",
      "color",
      "track-color",
      "label",
      "caption",
      "hide-label",
      "aria-label",
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
    root.className = CP_CLASS;
    root.dataset.slot = "root";
    root.setAttribute("role", "progressbar");
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const value = this._numberAttr("value", 0);
    const max = this._numberAttr("max", 100);
    const safeMax = max > 0 ? max : 100;
    const size = Math.max(1, this._numberAttr("size", 80));
    const stroke = this._numberAttr("thickness", Math.max(4, Math.round(size / 12)));
    const radius = Math.max(0, (size - stroke) / 2);
    const circumference = 2 * Math.PI * radius;
    const ratio = clamp(value / safeMax, 0, 1);
    const dashOffset = circumference * (1 - ratio);
    const percent = Math.round(ratio * 100);
    const valueSize = Math.max(12, Math.round(size / 5));

    this._root.setAttribute("aria-valuemin", "0");
    this._root.setAttribute("aria-valuemax", String(safeMax));
    this._root.setAttribute("aria-valuenow", String(value));
    this._root.setAttribute("aria-label", this.getAttribute("aria-label") ?? "진행도");
    this._root.style.width = `${size}px`;
    this._root.style.height = `${size}px`;
    this._root.style.setProperty("--nds-cp-value-size", `${valueSize}px`);
    this._setOptionalVar("color", "--nds-cp-fill");
    this._setOptionalVar("track-color", "--nds-cp-track");

    for (const name of FORWARDED_ATTRS) {
      const attrValue = this.getAttribute(name);
      if (attrValue === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, attrValue);
    }

    this._root.replaceChildren(
      this._createSvg(size, radius, stroke, circumference, dashOffset),
      ...this._createLabel(percent),
    );
  }

  private _createSvg(
    size: number,
    radius: number,
    stroke: number,
    circumference: number,
    dashOffset: number,
  ): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", CP_SVG_CLASS);
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));

    const cx = String(size / 2);
    const cy = String(size / 2);
    const r = String(radius);
    const strokeWidth = String(stroke);

    const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    track.setAttribute("class", CP_TRACK_CLASS);
    track.setAttribute("cx", cx);
    track.setAttribute("cy", cy);
    track.setAttribute("r", r);
    track.setAttribute("stroke-width", strokeWidth);

    const fill = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    fill.setAttribute("class", CP_FILL_CLASS);
    fill.setAttribute("cx", cx);
    fill.setAttribute("cy", cy);
    fill.setAttribute("r", r);
    fill.setAttribute("stroke-width", strokeWidth);
    fill.setAttribute("stroke-dasharray", String(circumference));
    fill.setAttribute("stroke-dashoffset", String(dashOffset));

    svg.append(track, fill);
    return svg;
  }

  private _createLabel(percent: number): Node[] {
    if (this.boolAttr("hide-label")) return [];

    const label = document.createElement("div");
    const value = document.createElement("span");
    label.className = CP_LABEL_CLASS;
    value.className = CP_VALUE_CLASS;
    value.textContent = this.getAttribute("label") ?? `${percent}%`;
    label.appendChild(value);

    const captionText = this.getAttribute("caption");
    if (captionText !== null) {
      const caption = document.createElement("span");
      caption.className = CP_CAPTION_CLASS;
      caption.textContent = captionText;
      label.appendChild(caption);
    }

    return [label];
  }

  private _setOptionalVar(attrName: string, varName: string): void {
    if (!this._root) return;
    const value = this.getAttribute(attrName);
    if (value === null || value.trim() === "") this._root.style.removeProperty(varName);
    else this._root.style.setProperty(varName, value);
  }

  private _numberAttr(name: string, fallback: number): number {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

define(NdsCircularProgress);
