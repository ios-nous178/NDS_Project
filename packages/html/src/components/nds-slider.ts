/**
 * <nds-slider> — DS Slider 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-slider value="50" min="0" max="100" start-label="약함" end-label="강함" show-value></nds-slider>
 *
 * 이벤트:
 *   slider-change (detail: { value }) -> 값 변경 시 발생
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const SL_CLASS = "nds-slider";
const SL_ROOT_CLASS = `${SL_CLASS}__root`;
const SL_TRACK_CLASS = `${SL_CLASS}__track`;
const SL_FILL_CLASS = `${SL_CLASS}__fill`;
const SL_INPUT_CLASS = `${SL_CLASS}__input`;
const SL_LABELS_CLASS = `${SL_CLASS}__labels`;
const SL_LABEL_CLASS = `${SL_CLASS}__label`;
const SL_VALUE_CLASS = `${SL_CLASS}__value`;

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export class NdsSlider extends NdsElement {
  static elementName = "nds-slider";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-slider"].observedAttributes, "start-label", "end-label"];
  }

  private _root: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _fill: HTMLSpanElement | null = null;
  private _labels: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SL_ROOT_CLASS;

    const track = document.createElement("div");
    track.dataset.slot = "track";
    track.className = SL_TRACK_CLASS;

    const fill = document.createElement("span");
    fill.setAttribute("aria-hidden", "true");
    fill.className = SL_FILL_CLASS;

    const input = document.createElement("input");
    input.type = "range";
    input.className = SL_INPUT_CLASS;
    input.addEventListener("input", (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      this.setAttribute("value", String(val));
      this.dispatchEvent(
        new CustomEvent("slider-change", { detail: { value: val }, bubbles: true, composed: true }),
      );
      this.scheduleUpdate();
    });

    track.append(fill, input);
    root.appendChild(track);

    const labels = document.createElement("div");
    labels.dataset.slot = "labels";
    labels.className = SL_LABELS_CLASS;
    root.appendChild(labels);

    this.appendChild(root);
    this._root = root;
    this._input = input;
    this._fill = fill;
    this._labels = labels;
  }

  protected update(): void {
    if (!this._root || !this._input || !this._fill || !this._labels) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = parseFloat(this.attr("value", "0"));
    const min = parseFloat(this.attr("min", "0"));
    const max = parseFloat(this.attr("max", "100"));
    const step = parseFloat(this.attr("step", "1"));
    const disabled = this.boolAttr("disabled");
    const startLabel = this.getAttribute("start-label");
    const endLabel = this.getAttribute("end-label");
    const showValue = this.boolAttr("show-value");

    this._root.dataset.disabled = String(disabled);
    this._input.disabled = disabled;
    this._input.min = String(min);
    this._input.max = String(max);
    this._input.step = String(step);
    this._input.value = String(value);

    const percent = clamp(((value - min) / (max - min)) * 100, 0, 100);
    this._fill.style.width = `${percent}%`;

    const showValueRow = showValue || startLabel !== null || endLabel !== null;
    if (showValueRow) {
      this._labels.style.display = "";
      this._labels.innerHTML = `
        <span data-slot="label-start" class="${SL_LABEL_CLASS}">${startLabel || ""}</span>
        ${showValue ? `<span data-slot="value" class="${SL_VALUE_CLASS}">${value}</span>` : ""}
        <span data-slot="label-end" class="${SL_LABEL_CLASS}">${endLabel || ""}</span>
      `;
    } else {
      this._labels.style.display = "none";
    }
  }
}

define(NdsSlider);
