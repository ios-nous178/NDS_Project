/**
 * <nds-verification-code-input> — DS VerificationCodeInput 의 vanilla Web Component (웹용 단일 필드).
 *
 * 자리별 세그먼트가 아니라 한 줄 박스 한 칸. 숫자만 입력되며 붙여넣기·자동완성(one-time-code) 지원.
 * 높이/둥근모서리는 base Input 토큰 상속. (자리별 PIN 은 <nds-pin-pad>.)
 *
 * 이 컴포넌트는 코드 입력 필드만 책임진다. 타이머·재전송·확인 버튼이 함께 있는 인증 폼은
 * 이 필드를 <nds-field-action-row> 로 합성한다(타이머는 field-action-row 가 필드 안에 렌더).
 *
 * 사용:
 *   <nds-verification-code-input length="6" auto-focus></nds-verification-code-input>
 *
 * 속성:
 *   length      — 자릿수 (기본 6, maxLength)
 *   value       — 현재 값 (숫자만)
 *   placeholder — 미지정 시 "인증번호 입력"
 *   error / disabled / auto-focus / full-width
 *
 * 이벤트:
 *   code-change   (detail: { value })  — 입력 변경
 *   code-complete (detail: { value })  — length 만큼 채워졌을 때 1회
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const VC_CLASS = "nds-verification-code";
const VC_ROOT_CLASS = `${VC_CLASS}__root`;
const VC_INPUT_CLASS = `${VC_CLASS}__input`;

let nextVcId = 0;

const onlyDigits = (s: string): string => s.replace(/\D/g, "");

export class NdsVerificationCodeInput extends NdsElement {
  static elementName = "nds-verification-code-input";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-verification-code-input"].observedAttributes, "auto-focus", "placeholder"];
  }

  private _root: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _baseId = "";
  private _lastEmittedComplete = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._baseId = `nds-verification-code-${++nextVcId}`;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = VC_ROOT_CLASS;

    const input = document.createElement("input");
    input.id = this._baseId;
    input.type = "text";
    input.inputMode = "numeric";
    input.pattern = "[0-9]*";
    input.autocomplete = "one-time-code";
    input.className = VC_INPUT_CLASS;
    input.setAttribute("aria-label", "인증번호");
    input.addEventListener("input", () => this._handleInput());
    input.addEventListener("paste", (e) => this._handlePaste(e));

    root.append(input);
    this.replaceChildren(root);

    this._root = root;
    this._input = input;

    if (this.boolAttr("auto-focus")) queueMicrotask(() => input.focus());
  }

  protected update(): void {
    if (!this._root || !this._input) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const length = this._lengthAttr();
    const value = this._valueAttr().slice(0, length);
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    const fullWidth = this.getAttribute("full-width") !== "false";
    const placeholder = this.getAttribute("placeholder") || "인증번호 입력";

    this._root.dataset.disabled = disabled ? "true" : "false";
    this._root.dataset.error = error ? "true" : "false";
    this._root.dataset.fullWidth = fullWidth ? "true" : "false";

    this._input.maxLength = length;
    this._input.placeholder = placeholder;
    this._input.disabled = disabled;
    if (this._input.value !== value) this._input.value = value;

    if (value.length === length && length > 0 && this._lastEmittedComplete !== value) {
      this._lastEmittedComplete = value;
      this.dispatchEvent(
        new CustomEvent("code-complete", { detail: { value }, bubbles: true, composed: true }),
      );
    } else if (value.length < length) {
      this._lastEmittedComplete = "";
    }
  }

  private _handleInput(): void {
    if (!this._input) return;
    const value = onlyDigits(this._input.value).slice(0, this._lengthAttr());
    if (this._input.value !== value) this._input.value = value;
    this._commit(value);
  }

  private _handlePaste(e: ClipboardEvent): void {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    const value = onlyDigits(text).slice(0, this._lengthAttr());
    if (!value) return;
    this._commit(value);
  }

  private _commit(value: string): void {
    this.setAttribute("value", value);
    this.dispatchEvent(
      new CustomEvent("code-change", { detail: { value }, bubbles: true, composed: true }),
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

define(NdsVerificationCodeInput);
