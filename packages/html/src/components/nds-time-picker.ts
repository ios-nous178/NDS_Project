/**
 * <nds-time-picker> — DS TimePicker 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-time-picker
 *     label="알람 시간"
 *     value="09:30"
 *     min="06:00"
 *     max="22:00"
 *     step="300"
 *     helper-text="5분 단위로 선택할 수 있습니다"
 *   ></nds-time-picker>
 *
 * 이벤트:
 *   nds-time-change (detail: { value })
 *
 * 속성:
 *   value: "HH:mm"
 *   step: 초 단위 (default 300 = 5분)
 *   label / placeholder / helper-text
 *   error / full-width / disabled
 *   min / max
 */

import { NdsElement, define } from "../base/nds-element.js";

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_INPUT_CLASS = `${TP_CLASS}__input`;
const TP_HELPER_CLASS = `${TP_CLASS}__helper`;

let nextId = 0;

export class NdsTimePicker extends NdsElement {
  static elementName = "nds-time-picker";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "step",
      "label",
      "helper-text",
      "error",
      "full-width",
      "disabled",
      "min",
      "max",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _helper: HTMLParagraphElement | null = null;
  private _inputId = `nds-time-picker-${++nextId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TP_ROOT_CLASS;

    const labelEl = document.createElement("label");
    labelEl.className = TP_LABEL_CLASS;
    labelEl.setAttribute("for", this._inputId);

    const field = document.createElement("div");
    field.className = TP_FIELD_CLASS;

    const input = document.createElement("input");
    input.id = this._inputId;
    input.type = "time";
    input.className = TP_INPUT_CLASS;
    input.addEventListener("input", () => {
      this.setAttribute("value", input.value);
      this.dispatchEvent(
        new CustomEvent("nds-time-change", {
          detail: { value: input.value },
          bubbles: true,
          composed: true,
        }),
      );
    });
    field.appendChild(input);

    const helper = document.createElement("p");
    helper.className = TP_HELPER_CLASS;

    root.append(labelEl, field, helper);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._field = field;
    this._input = input;
    this._helper = helper;
  }

  protected update(): void {
    if (!this._root || !this._labelEl || !this._field || !this._input || !this._helper) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const step = parseInt(this.attr("step", "300"), 10) || 300;
    const label = this.getAttribute("label");
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");
    const disabled = this.boolAttr("disabled");
    const min = this.getAttribute("min");
    const max = this.getAttribute("max");

    this._root.dataset.fullWidth = fullWidth ? "true" : "false";

    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.style.display = "none";
    }

    this._field.dataset.error = error ? "true" : "false";
    this._field.dataset.disabled = disabled ? "true" : "false";

    if (this._input.value !== value) this._input.value = value;
    this._input.disabled = disabled;
    this._input.step = String(step);
    if (min) this._input.min = min;
    else this._input.removeAttribute("min");
    if (max) this._input.max = max;
    else this._input.removeAttribute("max");

    if (helperText) {
      this._helper.textContent = helperText;
      this._helper.dataset.error = error ? "true" : "false";
      this._helper.style.display = "";
    } else {
      this._helper.style.display = "none";
    }
  }
}

define(NdsTimePicker);
