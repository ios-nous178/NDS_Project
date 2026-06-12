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
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

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
    return [...COMPONENT_ATTRS["nds-amount-input"].observedAttributes, "label", "helper-text", "placeholder", "disabled", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _prefixEl: HTMLSpanElement | null = null;
  private _unitEl: HTMLSpanElement | null = null;
  private _presetsEl: HTMLDivElement | null = null;
  private _presetsKey: string | null = null;
  private _helperEl: HTMLParagraphElement | null = null;
  private _inputId = "";
  private _onInput = (e: Event) => this._handleInput(e);

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  /**
   * mount-once: input 을 포함한 골격은 1회만 만든다. update() 가 input 을 재생성하면
   * 키 입력(setAttribute("value") → update)마다 포커스/커서가 유실된다 —
   * AddressPicker/DatePicker 회귀 클래스(scripts/check-input-tests.mjs 게이트).
   */
  private _mount(): void {
    this._inputId = `nds-amount-${++nextAmountId}`;
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AI_CLASS;

    const field = document.createElement("div");
    field.className = AI_FIELD_CLASS;

    const input = document.createElement("input");
    input.id = this._inputId;
    input.type = "text";
    input.inputMode = "numeric";
    input.className = AI_INPUT_CLASS;
    input.addEventListener("input", this._onInput);
    field.appendChild(input);

    root.appendChild(field);
    this.replaceChildren(root);
    this._root = root;
    this._field = field;
    this._input = input;
  }

  protected update(): void {
    if (!this._root || !this._field || !this._input) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const error = this.boolAttr("error");
    this._root.dataset.fullWidth = this.boolAttr("full-width") ? "true" : "false";
    this._field.dataset.error = error ? "true" : "false";

    this._syncLabel();
    this._syncPrefix();
    this._syncInput();
    this._syncUnit();
    this._syncPresets();
    this._syncHelper(error);
  }

  private _syncLabel(): void {
    const text = this.getAttribute("label");
    if (!text) {
      this._labelEl?.remove();
      this._labelEl = null;
      return;
    }
    if (!this._labelEl) {
      const label = document.createElement("label");
      label.htmlFor = this._inputId;
      label.className = AI_LABEL_CLASS;
      this._root!.insertBefore(label, this._field);
      this._labelEl = label;
    }
    this._labelEl.textContent = text;
  }

  private _syncPrefix(): void {
    const prefix = this.getAttribute("prefix");
    if (!prefix) {
      this._prefixEl?.remove();
      this._prefixEl = null;
      return;
    }
    if (!this._prefixEl) {
      const span = document.createElement("span");
      span.className = AI_PREFIX_CLASS;
      this._field!.insertBefore(span, this._input);
      this._prefixEl = span;
    }
    this._prefixEl.textContent = prefix;
  }

  private _syncInput(): void {
    const input = this._input!;
    input.placeholder = this.attr("placeholder", "0");
    input.disabled = this.boolAttr("disabled");
    for (const name of FORWARDED_ATTRS) {
      const attr = this.getAttribute(name);
      if (attr === null) input.removeAttribute(name);
      else input.setAttribute(name, attr);
    }
    // 타이핑 경로의 재포맷/caret 복원은 _handleInput 이 처리 — 같은 값이면 건드리지 않는다.
    const value = this._parsedValue();
    const formatted = value === null ? "" : formatNumber(value);
    if (input.value !== formatted) input.value = formatted;
  }

  private _syncUnit(): void {
    const unit = this.getAttribute("unit") ?? "원";
    if (!unit) {
      this._unitEl?.remove();
      this._unitEl = null;
      return;
    }
    if (!this._unitEl) {
      const span = document.createElement("span");
      span.className = AI_UNIT_CLASS;
      this._field!.appendChild(span);
      this._unitEl = span;
    }
    this._unitEl.textContent = unit;
  }

  private _syncPresets(): void {
    const attr = this.getAttribute("presets");
    const presets = this._readPresets();
    if (presets.length === 0) {
      this._presetsEl?.remove();
      this._presetsEl = null;
      this._presetsKey = null;
      return;
    }
    if (!this._presetsEl) {
      const wrap = document.createElement("div");
      wrap.className = AI_PRESETS_CLASS;
      this._field!.after(wrap); // field 바로 뒤(helper 앞)
      this._presetsEl = wrap;
      this._presetsKey = null;
    }
    // 버튼은 presets attribute 가 실제로 바뀐 경우에만 재구성 (value 변경마다 재생성 금지).
    if (this._presetsKey !== attr) {
      this._presetsKey = attr;
      this._presetsEl.replaceChildren(
        ...presets.map((preset) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = AI_PRESET_CLASS;
          button.textContent = preset.label;
          button.addEventListener("click", () => this._applyPreset(preset));
          return button;
        }),
      );
    }
  }

  private _syncHelper(error: boolean): void {
    const text = this.getAttribute("helper-text");
    if (!text) {
      this._helperEl?.remove();
      this._helperEl = null;
      return;
    }
    if (!this._helperEl) {
      const p = document.createElement("p");
      p.className = AI_HELPER_CLASS;
      this._root!.appendChild(p);
      this._helperEl = p;
    }
    this._helperEl.dataset.error = error ? "true" : "false";
    this._helperEl.textContent = text;
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
