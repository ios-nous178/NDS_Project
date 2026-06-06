/**
 * <nds-circular-progress> — DS CircularProgress 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-circular-progress value="75" max="100" size="120" color="#ff0000"></nds-circular-progress>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { circularMetrics } from "./viz-svg.js";

const CP_CLASS = "nds-circular-progress";
const CP_SVG_CLASS = `${CP_CLASS}__svg`;
const CP_TRACK_CLASS = `${CP_CLASS}__track`;
const CP_FILL_CLASS = `${CP_CLASS}__fill`;
const CP_LABEL_CLASS = `${CP_CLASS}__label`;
const CP_VALUE_CLASS = `${CP_CLASS}__value`;
const CP_CAPTION_CLASS = `${CP_CLASS}__caption`;

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
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _svg: SVGSVGElement | null = null;
  private _trackCircle: SVGCircleElement | null = null;
  private _fillCircle: SVGCircleElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.setAttribute("role", "progressbar");
    root.setAttribute("aria-valuemin", "0");
    root.setAttribute("aria-label", "진행도");
    root.className = CP_CLASS;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", CP_SVG_CLASS);

    const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    track.setAttribute("class", CP_TRACK_CLASS);

    const fill = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    fill.setAttribute("class", CP_FILL_CLASS);

    svg.append(track, fill);

    root.appendChild(svg);
    this.appendChild(root);

    this._root = root;
    this._svg = svg;
    this._trackCircle = track;
    this._fillCircle = fill;
  }

  protected update(): void {
    if (!this._root || !this._svg || !this._trackCircle || !this._fillCircle) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = parseFloat(this.attr("value", "0"));
    const max = parseFloat(this.attr("max", "100"));
    const size = parseFloat(this.attr("size", "80"));
    const thicknessAttr = this.getAttribute("thickness");
    const color = this.getAttribute("color");
    const trackColor = this.getAttribute("track-color");
    const label = this.getAttribute("label");
    const caption = this.getAttribute("caption");
    const hideLabel = this.boolAttr("hide-label");

    const { stroke, radius, circumference, dashOffset, percent, valueSize } = circularMetrics(
      value,
      max,
      size,
      thicknessAttr ? parseFloat(thicknessAttr) : undefined,
    );

    this._root.setAttribute("aria-valuemax", String(max));
    this._root.setAttribute("aria-valuenow", String(value));
    this._root.style.width = `${size}px`;
    this._root.style.height = `${size}px`;
    this._root.style.setProperty("--nds-cp-value-size", `${valueSize}px`);

    if (color) this._root.style.setProperty("--nds-cp-fill", color);
    else this._root.style.removeProperty("--nds-cp-fill");

    if (trackColor) this._root.style.setProperty("--nds-cp-track", trackColor);
    else this._root.style.removeProperty("--nds-cp-track");

    this._svg.setAttribute("width", String(size));
    this._svg.setAttribute("height", String(size));

    [this._trackCircle, this._fillCircle].forEach((c) => {
      c.setAttribute("cx", String(size / 2));
      c.setAttribute("cy", String(size / 2));
      c.setAttribute("r", String(radius));
      c.setAttribute("stroke-width", String(stroke));
    });

    this._fillCircle.setAttribute("stroke-dasharray", String(circumference));
    this._fillCircle.setAttribute("stroke-dashoffset", String(dashOffset));

    const existing = this._root.querySelector(`.${CP_LABEL_CLASS}`);
    if (hideLabel) {
      if (existing) existing.remove();
    } else {
      const labelWrap =
        existing instanceof HTMLDivElement
          ? existing
          : (() => {
              const div = document.createElement("div");
              div.className = CP_LABEL_CLASS;
              this._root!.appendChild(div);
              return div;
            })();
      labelWrap.innerHTML = "";

      const valueSpan = document.createElement("span");
      valueSpan.className = CP_VALUE_CLASS;
      valueSpan.textContent = label ?? `${percent}%`;
      labelWrap.appendChild(valueSpan);

      if (caption) {
        const captionSpan = document.createElement("span");
        captionSpan.className = CP_CAPTION_CLASS;
        captionSpan.textContent = caption;
        labelWrap.appendChild(captionSpan);
      }
    }
  }
}

define(NdsCircularProgress);
