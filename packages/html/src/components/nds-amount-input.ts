/**
 * <nds-amount-input> — DS AmountInput 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-amount-input value="50000" prefix="₩" unit="원" label="결제 금액"
 *     presets='[{"label":"+1만","amount":10000},{"label":"전액","amount":100000,"set":true}]'>
 *   </nds-amount-input>
 *
 * 변경 시 host 의 `value` attribute 갱신 + "amount-change" CustomEvent (detail: { value }).
 */

import { NdsElement, define } from "../base/nds-element.js";

const AI_CLASS = "nds-amount-input";
const AI_LABEL_CLASS = `${AI_CLASS}__label`;
const AI_FIELD_CLASS = `${AI_CLASS}__field`;
const AI_PREFIX_CLASS = `${AI_CLASS}__prefix`;
const AI_INPUT_CLASS = `${AI_CLASS}__input`;
const AI_UNIT_CLASS = `${AI_CLASS}__unit`;
const AI_PRESETS_CLASS = `${AI_CLASS}__presets`;
const AI_PRESET_CLASS = `${AI_CLASS}__preset`;
const AI_HELPER_CLASS = `${AI_CLASS}__helper`;

interface AmountPreset {
  label: string;
  amount: number;
  set?: boolean;
}

let nextAmountId = 0;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "name", "form"] as const;

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

/** caret 앞쪽의 숫자(0-9) 개수 — 천단위 콤마 재포맷 후 같은 자릿수 위치로 복원하기 위한 기준. */
function countDigitsBefore(text: string, caret: number): number {
  let count = 0;
  for (let i = 0; i < caret && i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 48 && c <= 57) count++;
  }
  return count;
}

/** 포맷 문자열에서 "앞에서 n번째 숫자 바로 뒤" 인덱스 — countDigitsBefore 의 역연산. */
function caretAfterDigits(formatted: string, digits: number): number {
  if (digits <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    const c = formatted.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      count++;
      if (count === digits) return i + 1;
    }
  }
  return formatted.length;
}

export class NdsAmountInput extends NdsElement {
  static elementName = "nds-amount-input";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "prefix",
      "unit",
      "label",
      "helper-text",
      "error",
      "full-width",
      "presets",
      "max",
      "min",
      "placeholder",
      "disabled",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _inputId = "";
  private _onInput = (e: Event) => this._handleInput(e);

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._inputId = `nds-amount-${++nextAmountId}`;
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AI_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const fullWidth = this.boolAttr("full-width");
    const error = this.boolAttr("error");
    this._root.dataset.fullWidth = fullWidth ? "true" : "false";

    const children: Node[] = [];
    const label = this.getAttribute("label");
    if (label) children.push(this._createLabel(label));
    children.push(this._createField(error));
    const presets = this._readPresets();
    if (presets.length > 0) children.push(this._createPresets(presets));
    const helper = this.getAttribute("helper-text");
    if (helper) children.push(this._createHelper(helper, error));

    this._root.replaceChildren(...children);
  }

  private _createLabel(text: string): HTMLLabelElement {
    const label = document.createElement("label");
    label.htmlFor = this._inputId;
    label.className = AI_LABEL_CLASS;
    label.textContent = text;
    return label;
  }

  private _createField(error: boolean): HTMLDivElement {
    const field = document.createElement("div");
    field.className = AI_FIELD_CLASS;
    field.dataset.error = error ? "true" : "false";

    const prefix = this.getAttribute("prefix");
    if (prefix) {
      const span = document.createElement("span");
      span.className = AI_PREFIX_CLASS;
      span.textContent = prefix;
      field.appendChild(span);
    }

    const input = document.createElement("input");
    input.id = this._inputId;
    input.type = "text";
    input.inputMode = "numeric";
    input.className = AI_INPUT_CLASS;
    input.placeholder = this.attr("placeholder", "0");
    const value = this._parsedValue();
    input.value = value === null ? "" : formatNumber(value);
    if (this.boolAttr("disabled")) input.disabled = true;
    for (const name of FORWARDED_ATTRS) {
      const attr = this.getAttribute(name);
      if (attr !== null) input.setAttribute(name, attr);
    }
    input.addEventListener("input", this._onInput);
    field.appendChild(input);

    const unit = this.getAttribute("unit") ?? "원";
    if (unit) {
      const span = document.createElement("span");
      span.className = AI_UNIT_CLASS;
      span.textContent = unit;
      field.appendChild(span);
    }
    return field;
  }

  private _createPresets(presets: AmountPreset[]): HTMLDivElement {
    const wrap = document.createElement("div");
    wrap.className = AI_PRESETS_CLASS;
    for (const preset of presets) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = AI_PRESET_CLASS;
      button.textContent = preset.label;
      button.addEventListener("click", () => this._applyPreset(preset));
      wrap.appendChild(button);
    }
    return wrap;
  }

  private _createHelper(text: string, error: boolean): HTMLParagraphElement {
    const p = document.createElement("p");
    p.className = AI_HELPER_CLASS;
    p.dataset.error = error ? "true" : "false";
    p.textContent = text;
    return p;
  }

  private _handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const caret = target.selectionStart ?? target.value.length;
    const caretDigits = countDigitsBefore(target.value, caret);
    const raw = target.value.replace(/[^0-9]/g, "");
    const next = raw ? this._clamp(Number(raw)) : null;
    this._writeValue(next, target, caretDigits);
  }

  private _applyPreset(preset: AmountPreset): void {
    const current = this._parsedValue() ?? 0;
    const next = preset.set ? preset.amount : current + preset.amount;
    this._writeValue(this._clamp(next));
  }

  private _writeValue(
    value: number | null,
    sourceInput?: HTMLInputElement,
    caretDigits?: number,
  ): void {
    if (value === null) this.removeAttribute("value");
    else this.setAttribute("value", String(value));
    if (sourceInput) {
      sourceInput.value = value === null ? "" : formatNumber(value);
      // 재포맷으로 콤마 위치가 바뀐 만큼 caret 을 같은 자릿수 위치로 되돌린다 —
      // 안 하면 매 입력마다 caret 이 끝으로 튀어 중간 수정이 불가능(돈입력 "동작이상함" 핵심).
      if (caretDigits !== undefined) {
        const pos = value === null ? 0 : caretAfterDigits(sourceInput.value, caretDigits);
        sourceInput.setSelectionRange(pos, pos);
      }
    }
    this.dispatchEvent(
      new CustomEvent("amount-change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _parsedValue(): number | null {
    const attr = this.getAttribute("value");
    if (attr === null || attr === "") return null;
    const parsed = Number(attr);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private _clamp(n: number): number {
    let next = n;
    const maxAttr = this.getAttribute("max");
    if (maxAttr !== null && maxAttr.trim() !== "") {
      const max = Number(maxAttr);
      if (Number.isFinite(max) && next > max) next = max;
    }
    const minAttr = this.getAttribute("min");
    if (minAttr !== null && minAttr.trim() !== "") {
      const min = Number(minAttr);
      if (Number.isFinite(min) && next < min) next = min;
    }
    return next;
  }

  private _readPresets(): AmountPreset[] {
    const attr = this.getAttribute("presets");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => ({
          label: typeof raw.label === "string" ? raw.label : "",
          amount: Number(raw.amount),
          set: raw.set === true,
        }))
        .filter((p) => p.label && Number.isFinite(p.amount));
    } catch {
      return [];
    }
  }
}

define(NdsAmountInput);
