/**
 * <nds-number-stepper> — DS NumberStepper 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-number-stepper value="1" min="1" max="10" unit="개"></nds-number-stepper>
 *
 * 이벤트:
 *   number-stepper-change (detail: { value }) -> 값 변경 시 발생
 */

import { NdsElement, define } from "../base/nds-element.js";

const NS_CLASS = "nds-number-stepper";
const NS_BTN_CLASS = `${NS_CLASS}__btn`;
const NS_VALUE_CLASS = `${NS_CLASS}__value`;
const NS_INPUT_CLASS = `${NS_CLASS}__input`;

const sizeConfig = {
  sm: { btn: 28, fontSize: 13, valueW: 36 },
  md: { btn: 36, fontSize: 15, valueW: 48 },
  lg: { btn: 44, fontSize: 17, valueW: 56 },
} as const;

export type NumberStepperSize = keyof typeof sizeConfig;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export class NdsNumberStepper extends NdsElement {
  static elementName = "nds-number-stepper";

  static get observedAttributes(): readonly string[] {
    return ["value", "min", "max", "step", "size", "disabled", "editable", "unit"];
  }

  private _root: HTMLDivElement | null = null;
  private _valueSpan: HTMLSpanElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _decBtn: HTMLButtonElement | null = null;
  private _incBtn: HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = NS_CLASS;
    root.setAttribute("role", "group");

    const decBtn = document.createElement("button");
    decBtn.type = "button";
    decBtn.className = NS_BTN_CLASS;
    decBtn.setAttribute("aria-label", "감소");
    decBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`;
    decBtn.addEventListener("click", () => this._dec());

    const valueSpan = document.createElement("span");
    valueSpan.className = NS_VALUE_CLASS;
    valueSpan.setAttribute("aria-live", "polite");

    const input = document.createElement("input");
    input.type = "number";
    input.className = NS_INPUT_CLASS;
    input.addEventListener("change", (e) => this._onInputChange(e));

    const incBtn = document.createElement("button");
    incBtn.type = "button";
    incBtn.className = NS_BTN_CLASS;
    incBtn.setAttribute("aria-label", "증가");
    incBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`;
    incBtn.addEventListener("click", () => this._inc());

    root.append(decBtn, valueSpan, input, incBtn);
    this.appendChild(root);

    this._root = root;
    this._valueSpan = valueSpan;
    this._input = input;
    this._decBtn = decBtn;
    this._incBtn = incBtn;
  }

  private _dec(): void {
    const value = parseFloat(this.attr("value", "0"));
    const step = parseFloat(this.attr("step", "1"));
    this._setValue(value - step);
  }

  private _inc(): void {
    const value = parseFloat(this.attr("value", "0"));
    const step = parseFloat(this.attr("step", "1"));
    this._setValue(value + step);
  }

  private _onInputChange(e: Event): void {
    const n = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(n)) this._setValue(n);
  }

  private _setValue(next: number): void {
    const min = parseFloat(this.attr("min", "0"));
    const max = parseFloat(this.attr("max", "99"));
    const current = parseFloat(this.attr("value", "0"));
    const clamped = clamp(next, min, max);

    if (clamped !== current) {
      this.setAttribute("value", String(clamped));
      this.dispatchEvent(
        new CustomEvent("number-stepper-change", {
          detail: { value: clamped },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  protected update(): void {
    if (!this._root || !this._valueSpan || !this._input || !this._decBtn || !this._incBtn) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = parseFloat(this.attr("value", "0"));
    const min = parseFloat(this.attr("min", "0"));
    const max = parseFloat(this.attr("max", "99"));
    const size = (this.getAttribute("size") as NumberStepperSize) || "md";
    const disabled = this.boolAttr("disabled");
    const editable = this.boolAttr("editable");
    const unit = this.getAttribute("unit") || "";

    const s = sizeConfig[size];
    this._root.style.setProperty("--nds-stepper-btn", `${s.btn}px`);
    this._root.style.setProperty("--nds-stepper-value-w", `${s.valueW}px`);
    this._root.style.setProperty("--nds-stepper-font", `${s.fontSize}px`);

    this._decBtn.disabled = disabled || value <= min;
    this._incBtn.disabled = disabled || value >= max;

    if (editable) {
      this._valueSpan.style.display = "none";
      this._input.style.display = "";
      this._input.value = String(value);
      this._input.min = String(min);
      this._input.max = String(max);
      this._input.disabled = disabled;
    } else {
      this._input.style.display = "none";
      this._valueSpan.style.display = "";
      this._valueSpan.textContent = unit ? `${value}${unit}` : String(value);
    }
  }
}

define(NdsNumberStepper);
