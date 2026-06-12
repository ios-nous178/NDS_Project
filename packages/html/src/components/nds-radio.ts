/**
 * <nds-radio> — DS Radio 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Radio.tsx 와 동일):
 *   <nds-radio checked label="선택 A" name="plan" value="a"></nds-radio>
 *     └─ <label class="nds-radio__root" data-slot="root" data-disabled="false">
 *          ├─ <input class="nds-radio__input" type="radio" ...>
 *          ├─ <span class="nds-radio__indicator" data-slot="indicator" data-checked="true">
 *          │    └─ <span class="nds-radio__dot"></span>
 *          └─ <span class="nds-radio__label" data-slot="label">선택 A</span>
 *        </label>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const RADIO_CLASS = "nds-radio";
const RADIO_ROOT_CLASS = `${RADIO_CLASS}__root`;
const RADIO_INPUT_CLASS = `${RADIO_CLASS}__input`;
const RADIO_INDICATOR_CLASS = `${RADIO_CLASS}__indicator`;
const RADIO_DOT_CLASS = `${RADIO_CLASS}__dot`;
const RADIO_LABEL_CLASS = `${RADIO_CLASS}__label`;

const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-invalid",
  "name",
  "value",
  "form",
  "required",
  "autofocus",
  "tabindex",
] as const;

let nextRadioId = 0;

export class NdsRadio extends NdsElement {
  static elementName = "nds-radio";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-radio"].observedAttributes, "label", "input-id", ...FORWARDED_ATTRS];
  }

  private _root: HTMLLabelElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _indicator: HTMLSpanElement | null = null;
  private _label: HTMLSpanElement | null = null;
  private _inputId = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._inputId = this.attr("input-id", `nds-radio-${++nextRadioId}`);

    const root = document.createElement("label");
    const input = document.createElement("input");
    const indicator = document.createElement("span");
    const dot = document.createElement("span");
    const label = document.createElement("span");

    root.className = RADIO_ROOT_CLASS;
    root.dataset.slot = "root";
    root.htmlFor = this._inputId;

    input.className = RADIO_INPUT_CLASS;
    input.type = "radio";
    input.id = this._inputId;
    input.addEventListener("change", () => {
      if (input.checked) this.setAttribute("checked", "");
      else this.removeAttribute("checked");
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });

    indicator.className = RADIO_INDICATOR_CLASS;
    indicator.dataset.slot = "indicator";
    indicator.setAttribute("aria-hidden", "true");

    dot.className = RADIO_DOT_CLASS;
    indicator.appendChild(dot);

    label.className = RADIO_LABEL_CLASS;
    label.dataset.slot = "label";
    while (this.firstChild) {
      label.appendChild(this.firstChild);
    }

    root.append(input, indicator);
    if (label.childNodes.length > 0 || this.hasAttribute("label")) root.appendChild(label);
    this.appendChild(root);

    this._root = root;
    this._input = input;
    this._indicator = indicator;
    this._label = label;
  }

  protected update(): void {
    if (!this._root || !this._input || !this._indicator) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const checked = this.boolAttr("checked");
    const disabled = this.boolAttr("disabled");
    const inputId = this.attr("input-id", this._inputId);

    if (inputId !== this._inputId) {
      this._inputId = inputId;
      this._input.id = inputId;
      this._root.htmlFor = inputId;
    }

    this._input.checked = checked;
    this._input.disabled = disabled;
    this._indicator.dataset.checked = checked ? "true" : "false";
    this._root.dataset.disabled = disabled ? "true" : "false";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._input.removeAttribute(name);
      else this._input.setAttribute(name, value);
    }

    this._syncLabel();
  }

  private _syncLabel(): void {
    if (!this._root || !this._label) return;
    const labelText = this.getAttribute("label");
    if (labelText !== null) {
      this._label.textContent = labelText;
    }
    if (this._label.childNodes.length > 0 && !this._label.isConnected) {
      this._root.appendChild(this._label);
    }
    if (this._label.childNodes.length === 0 && this._label.isConnected) {
      this._label.remove();
    }
  }
}

define(NdsRadio);
