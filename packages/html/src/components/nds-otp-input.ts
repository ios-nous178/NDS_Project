/**
 * <nds-otp-input> — DS OtpInput 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-otp-input length="6" value=""></nds-otp-input>
 *
 * 자동 포커스 이동, Backspace/ArrowLeft/ArrowRight 네비, paste 일괄 입력 지원.
 *
 * 이벤트:
 *   otp-change   (detail: { value })  — 입력 변경
 *   otp-complete (detail: { value })  — length 만큼 채워졌을 때 1회
 */

import { NdsElement, define } from "../base/nds-element.js";

const OTP_CLASS = "nds-otp";
const OTP_ROOT_CLASS = `${OTP_CLASS}__root`;
const OTP_CELL_CLASS = `${OTP_CLASS}__cell`;
const OTP_INPUT_CLASS = `${OTP_CLASS}__input`;

let nextOtpId = 0;

function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

export class NdsOtpInput extends NdsElement {
  static elementName = "nds-otp-input";

  static get observedAttributes(): readonly string[] {
    return ["length", "value", "disabled", "error", "auto-focus"];
  }

  private _root: HTMLDivElement | null = null;
  private _inputs: HTMLInputElement[] = [];
  private _baseId = "";
  private _lastEmittedComplete = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._baseId = `nds-otp-${++nextOtpId}`;
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = OTP_ROOT_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const length = this._lengthAttr();
    const value = this._valueAttr();
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");

    this._root.dataset.disabled = disabled ? "true" : "false";
    this._root.dataset.error = error ? "true" : "false";

    this._rebuildCells(length);
    for (let i = 0; i < length; i++) {
      const input = this._inputs[i];
      const ch = value[i] ?? "";
      if (input.value !== ch) input.value = ch;
      input.disabled = disabled;
    }

    if (value.length === length && length > 0 && this._lastEmittedComplete !== value) {
      this._lastEmittedComplete = value;
      this.dispatchEvent(
        new CustomEvent("otp-complete", {
          detail: { value },
          bubbles: true,
          composed: true,
        }),
      );
    } else if (value.length < length) {
      this._lastEmittedComplete = "";
    }
  }

  private _rebuildCells(length: number): void {
    if (!this._root) return;
    if (this._inputs.length === length) return;
    this._root.replaceChildren();
    this._inputs = [];

    for (let i = 0; i < length; i++) {
      const cell = document.createElement("div");
      cell.dataset.slot = "cell";
      cell.className = OTP_CELL_CLASS;

      const input = document.createElement("input");
      input.id = `${this._baseId}-${i}`;
      input.type = "text";
      input.inputMode = "numeric";
      input.pattern = "[0-9]*";
      input.maxLength = 1;
      input.autocomplete = i === 0 ? "one-time-code" : "off";
      input.className = OTP_INPUT_CLASS;
      input.setAttribute("aria-label", `인증번호 ${i + 1}자리`);

      input.addEventListener("input", (e) => this._handleInput(i, e));
      input.addEventListener("keydown", (e) => this._handleKey(i, e));
      input.addEventListener("paste", (e) => this._handlePaste(e));

      cell.appendChild(input);
      this._root.appendChild(cell);
      this._inputs.push(input);
    }

    if (this.boolAttr("auto-focus") && this._inputs[0]) {
      queueMicrotask(() => this._inputs[0]?.focus());
    }
  }

  private _handleInput(idx: number, e: Event): void {
    const input = e.target as HTMLInputElement;
    const ch = onlyDigits(input.value).slice(-1);
    const length = this._lengthAttr();
    const current = this._valueAttr();
    const arr = current.split("");
    while (arr.length < length) arr.push("");
    arr[idx] = ch;
    this._commit(arr.join("").slice(0, length));
    if (ch && idx < length - 1) this._inputs[idx + 1]?.focus();
  }

  private _handleKey(idx: number, e: KeyboardEvent): void {
    const length = this._lengthAttr();
    if (e.key === "Backspace") {
      const arr = this._valueAttr().split("");
      while (arr.length < length) arr.push("");
      if (arr[idx]) {
        arr[idx] = "";
      } else if (idx > 0) {
        this._inputs[idx - 1]?.focus();
        arr[idx - 1] = "";
      }
      this._commit(arr.join("").slice(0, length));
    } else if (e.key === "ArrowLeft" && idx > 0) {
      this._inputs[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      this._inputs[idx + 1]?.focus();
    }
  }

  private _handlePaste(e: ClipboardEvent): void {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    const digits = onlyDigits(text);
    if (!digits) return;
    const length = this._lengthAttr();
    this._commit(digits.slice(0, length));
    const focusIdx = Math.min(digits.length, length - 1);
    queueMicrotask(() => this._inputs[focusIdx]?.focus());
  }

  private _commit(value: string): void {
    this.setAttribute("value", value);
    this.dispatchEvent(
      new CustomEvent("otp-change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _lengthAttr(): number {
    const value = Number(this.getAttribute("length"));
    return Number.isFinite(value) && value > 0 ? Math.trunc(value) : 6;
  }

  private _valueAttr(): string {
    return onlyDigits(this.getAttribute("value") ?? "");
  }
}

define(NdsOtpInput);
