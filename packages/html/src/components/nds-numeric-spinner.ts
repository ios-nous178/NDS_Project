/**
 * <nds-numeric-spinner> — DS NumericSpinner 의 vanilla Web Component 버전.
 *
 * `−` / 값 / `+` 로 정수를 증감하는 입력. 키보드 없이 수량·회차·세트 수 같은
 * 작은 정수를 조정할 때. 가운데 값은 직접 입력도 가능(입력 중 자유 타이핑, blur 시 clamp).
 *
 * 사용:
 *   <nds-numeric-spinner value="1" min="1" max="10"></nds-numeric-spinner>
 *   <nds-numeric-spinner value="0" step="5" size="small"></nds-numeric-spinner>
 *
 * 변경 시 host 의 `value` attribute 갱신 + "numeric-spinner-change" CustomEvent (detail: { value }).
 *
 * 혼동 주의: <nds-stepper> 는 단계 진행 표시기, <nds-amount-input> 은 금액 입력.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const NS_CLASS = "nds-numeric-spinner";
const NS_BUTTON_CLASS = `${NS_CLASS}__button`;
const NS_INPUT_CLASS = `${NS_CLASS}__input`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "name", "form"] as const;

const MINUS_SVG =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
  '<path d="M3.75 9h10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
  "</svg>";

const PLUS_SVG =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
  '<path d="M9 3.75v10.5M3.75 9h10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
  "</svg>";

export class NdsNumericSpinner extends NdsElement {
  static elementName = "nds-numeric-spinner";

  static get observedAttributes(): readonly string[] {
    return [
      ...COMPONENT_ATTRS["nds-numeric-spinner"].observedAttributes,
      "disabled",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _minusBtn: HTMLButtonElement | null = null;
  private _plusBtn: HTMLButtonElement | null = null;
  private _onInput = (e: Event) => this._handleInput(e);
  private _onKeyDown = (e: Event) => this._handleKeyDown(e as KeyboardEvent);
  private _onBlur = () => this._handleBlur();

  /**
   * mount-once: input 을 포함한 골격은 1회만 만든다. update() 가 input 을 재생성하면
   * 키 입력마다 포커스/커서가 유실된다 — AddressPicker/DatePicker 회귀 클래스
   * (scripts/check-input-tests.mjs 게이트).
   */
  protected override mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = NS_CLASS;

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = NS_BUTTON_CLASS;
    minus.dataset.action = "decrement";
    minus.tabIndex = -1;
    minus.setAttribute("aria-label", "값 감소");
    minus.innerHTML = MINUS_SVG;
    minus.addEventListener("click", () => this._stepBy(-1));

    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.className = NS_INPUT_CLASS;
    input.setAttribute("role", "spinbutton");
    input.addEventListener("input", this._onInput);
    input.addEventListener("keydown", this._onKeyDown);
    input.addEventListener("blur", this._onBlur);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = NS_BUTTON_CLASS;
    plus.dataset.action = "increment";
    plus.tabIndex = -1;
    plus.setAttribute("aria-label", "값 증가");
    plus.innerHTML = PLUS_SVG;
    plus.addEventListener("click", () => this._stepBy(1));

    root.append(minus, input, plus);
    this.replaceChildren(root);
    this._root = root;
    this._input = input;
    this._minusBtn = minus;
    this._plusBtn = plus;
  }

  protected update(): void {
    if (!this._root || !this._input || !this._minusBtn || !this._plusBtn) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const disabled = this.boolAttr("disabled");
    const value = this._parsedValue();
    const min = this._numAttr("min");
    const max = this._numAttr("max");

    this._root.dataset.size = this.attr("size", "medium");
    this._root.dataset.disabled = disabled ? "true" : "false";

    this._minusBtn.disabled = disabled || (min !== null && value <= min);
    this._plusBtn.disabled = disabled || (max !== null && value >= max);

    this._syncInput(value, min, max, disabled);
  }

  private _syncInput(
    value: number,
    min: number | null,
    max: number | null,
    disabled: boolean,
  ): void {
    const input = this._input!;
    input.disabled = disabled;
    input.setAttribute("aria-valuenow", String(value));
    if (min !== null) input.setAttribute("aria-valuemin", String(min));
    else input.removeAttribute("aria-valuemin");
    if (max !== null) input.setAttribute("aria-valuemax", String(max));
    else input.removeAttribute("aria-valuemax");

    for (const name of FORWARDED_ATTRS) {
      const attr = this.getAttribute(name);
      if (attr === null) input.removeAttribute(name);
      else input.setAttribute(name, attr);
    }

    // 입력 중(포커스)에는 input.value 를 건드리지 않는다 — 타이핑/커서 보존.
    // blur 시 _handleBlur 가 clamp 된 값으로 되돌린다.
    const formatted = String(value);
    if (document.activeElement !== input && input.value !== formatted) {
      input.value = formatted;
    }
  }

  private _handleInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^\d-]/g, "").replace(/(?!^)-/g, "");
    if (cleaned !== input.value) input.value = cleaned; // 정수 외 문자 제거
    if (cleaned === "" || cleaned === "-") return; // 중간 상태 — 아직 commit 안 함
    this._commit(Number(cleaned), /* fromTyping */ true);
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (this.boolAttr("disabled")) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      this._stepBy(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      this._stepBy(-1);
    }
  }

  private _handleBlur(): void {
    // 표시를 clamp 된 현재 값으로 되돌린다(입력 중 미동기화분 정리).
    if (this._input) this._input.value = String(this._parsedValue());
  }

  private _stepBy(dir: 1 | -1): void {
    const step = this._numAttr("step") ?? 1;
    this._commit(this._parsedValue() + dir * step, false);
  }

  private _commit(n: number, fromTyping: boolean): void {
    const next = this._clamp(Math.round(n));
    if (String(next) !== this.getAttribute("value")) {
      this.setAttribute("value", String(next));
      this.dispatchEvent(
        new CustomEvent("numeric-spinner-change", {
          detail: { value: next },
          bubbles: true,
          composed: true,
        }),
      );
    }
    // 타이핑 경로는 input.value 를 사용자가 친 그대로 두고(포커스 보존),
    // blur 시 정리한다. 버튼/키 경로는 update→_syncInput 이 비포커스로 동기화.
    if (!fromTyping && this._input && document.activeElement !== this._input) {
      this._input.value = String(next);
    }
  }

  private _parsedValue(): number {
    const attr = this.getAttribute("value");
    if (attr !== null && attr.trim() !== "") {
      const parsed = Number(attr);
      if (Number.isFinite(parsed)) return Math.round(parsed);
    }
    return this._numAttr("min") ?? 0;
  }

  private _clamp(n: number): number {
    let next = n;
    const min = this._numAttr("min");
    const max = this._numAttr("max");
    if (min !== null && next < min) next = min;
    if (max !== null && next > max) next = max;
    return next;
  }

  private _numAttr(name: string): number | null {
    const attr = this.getAttribute(name);
    if (attr === null || attr.trim() === "") return null;
    const parsed = Number(attr);
    return Number.isFinite(parsed) ? parsed : null;
  }
}

define(NdsNumericSpinner);
