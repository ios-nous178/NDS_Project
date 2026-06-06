/**
 * <nds-checkbox> — DS Checkbox 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Checkbox.tsx 와 동일):
 *   <nds-checkbox checked label="동의합니다" name="agree"></nds-checkbox>
 *     └─ <label class="nds-checkbox__root" data-slot="root" data-disabled="false">
 *          ├─ <input class="nds-checkbox__input" type="checkbox" ...>
 *          ├─ <span class="nds-checkbox__indicator" data-slot="indicator" data-state="checked">
 *          │    └─ <svg class="nds-checkbox__check">...</svg>
 *          └─ <span class="nds-checkbox__label" data-slot="label">동의합니다</span>
 *        </label>
 *
 * Light DOM 에 React DS 와 같은 class/data-slot 구조를 만들어 @nudge-design/html/styles.css
 * (= React DS stylesheet copy) 를 그대로 재사용한다.
 */

import { NdsElement, define } from "../base/nds-element.js";

const CB_CLASS = "nds-checkbox";
const CB_ROOT_CLASS = `${CB_CLASS}__root`;
const CB_INPUT_CLASS = `${CB_CLASS}__input`;
const CB_INDICATOR_CLASS = `${CB_CLASS}__indicator`;
const CB_CHECK_ICON_CLASS = `${CB_CLASS}__check`;
const CB_MINUS_ICON_CLASS = `${CB_CLASS}__minus`;
const CB_LABEL_CLASS = `${CB_CLASS}__label`;

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

let nextCheckboxId = 0;

export class NdsCheckbox extends NdsElement {
  static elementName = "nds-checkbox";

  static get observedAttributes(): readonly string[] {
    return ["checked", "indeterminate", "disabled", "label", "input-id", ...FORWARDED_ATTRS];
  }

  private _root: HTMLLabelElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _indicator: HTMLSpanElement | null = null;
  private _label: HTMLSpanElement | null = null;
  private _inputId = "";

  /**
   * 체크 상태 — 네이티브 `<input>.checked` 와 동일하게 host 프로퍼티로 노출.
   * 읽기 = `checked` 속성 반영, 쓰기 = 속성 토글(→ update 가 inner input 동기화).
   * 프로그래매틱 set 은 네이티브와 동일하게 `change` 를 발화하지 않음(사용자 입력 시에만 발화).
   */
  get checked(): boolean {
    return this.boolAttr("checked");
  }

  set checked(value: boolean) {
    if (value) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
  }

  /** 부분 선택 상태 — 트리/그룹에서 "일부 자식만 선택됨"(옐로우 마이너스). */
  get indeterminate(): boolean {
    return this.boolAttr("indeterminate");
  }

  set indeterminate(value: boolean) {
    if (value) this.setAttribute("indeterminate", "");
    else this.removeAttribute("indeterminate");
  }

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._inputId = this.attr("input-id", `nds-checkbox-${++nextCheckboxId}`);

    const root = document.createElement("label");
    const input = document.createElement("input");
    const indicator = document.createElement("span");

    root.className = CB_ROOT_CLASS;
    root.dataset.slot = "root";
    root.htmlFor = this._inputId;

    input.className = CB_INPUT_CLASS;
    input.type = "checkbox";
    input.id = this._inputId;
    input.addEventListener("change", () => {
      if (input.checked) this.setAttribute("checked", "");
      else this.removeAttribute("checked");
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });

    indicator.className = CB_INDICATOR_CLASS;
    indicator.dataset.slot = "indicator";
    indicator.setAttribute("aria-hidden", "true");
    indicator.append(createCheckIcon(), createMinusIcon());

    const label = document.createElement("span");
    label.className = CB_LABEL_CLASS;
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
    const indeterminate = this.boolAttr("indeterminate");
    const disabled = this.boolAttr("disabled");
    const state = indeterminate ? "indeterminate" : checked ? "checked" : "unchecked";
    const inputId = this.attr("input-id", this._inputId);

    if (inputId !== this._inputId) {
      this._inputId = inputId;
      this._input.id = inputId;
      this._root.htmlFor = inputId;
    }

    this._input.checked = checked;
    this._input.indeterminate = indeterminate;
    this._input.disabled = disabled;
    if (indeterminate) this._input.setAttribute("aria-checked", "mixed");
    else this._input.removeAttribute("aria-checked");
    this._indicator.dataset.state = state;
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

function createCheckIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", CB_CHECK_ICON_CLASS);
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M3 7L6 10L11 4");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);

  return svg;
}

function createMinusIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", CB_MINUS_ICON_CLASS);
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M3.5 7H10.5");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  svg.appendChild(path);

  return svg;
}

define(NdsCheckbox);
