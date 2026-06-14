/**
 * <nds-input> — DS Input 의 vanilla Web Component 버전.
 *
 * DOM (React Input.tsx 와 동일):
 *   <nds-input label="이름" helper-text="공백 없이" size="default"></nds-input>
 *     └─ <div class="nds-input__root" data-slot="root" data-size="default" ...>
 *          ├─ <label class="nds-input__label" data-slot="label">이름</label>
 *          ├─ <div class="nds-input__wrapper" data-slot="wrapper" data-focused="false" ...>
 *          │    └─ <input class="nds-input__field" data-slot="field" id="...">
 *          │    (clearable 이면 <button class="nds-input__clear">×</button>)
 *          └─ <span class="nds-input__helper" data-slot="helper">공백 없이</span>
 *        </div>
 *
 * value 패턴 (nds-textarea 와 동일):
 *   · `value` attribute = controlled (외부에서 attribute 설정 시 inner field 동기)
 *   · `default-value` = uncontrolled 초기값. 사용자 입력 후로는 무시
 *   · 'input' / 'change' Event 를 host 에서 재디스패치 (bubbles: true)
 */

import { NdsElement, define } from "../base/nds-element.js";

export type InputSize = "default" | "field";

const SIZES: readonly InputSize[] = ["default", "field"];

// 입력 필드 가로 너비 6단계 — sizing.fieldWidth SSOT 미러 (Figma InputGuide Field Width 3897:1578).
// react resolveFieldWidth(internal/fieldWidth.ts) 와 동일 값. full = 컨테이너 100%.
const FIELD_WIDTHS: Record<string, string> = {
  xs: "120px",
  sm: "200px",
  md: "304px",
  lg: "400px",
  xl: "488px",
  full: "100%",
};

// sizing.input.{default,field} = {48, 48}px (react inputSizeConfig 미러). 둘 다 48 — field 는 labelGap 8 의 폼-행 변형.
const SIZE_CONFIG: Record<
  InputSize,
  { height: number; paddingX: number | null; labelGap: number; helperGap: number }
> = {
  default: { height: 48, paddingX: null, labelGap: 12, helperGap: 8 },
  field: { height: 48, paddingX: null, labelGap: 8, helperGap: 8 },
};

const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "name",
  "placeholder",
  "form",
  "required",
  "autofocus",
  "autocomplete",
  "inputmode",
  "pattern",
  "minlength",
  "maxlength",
  "min",
  "max",
  "step",
  "type",
  "list",
  "spellcheck",
  "tabindex",
] as const;

// DS eye / eye-off path (react Input.tsx 의 InputPasswordToggle 와 동일). currentColor 로 muted/strong cascade.
const EYE_SVG =
  '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<g transform="translate(0 4)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C17.4219 0 21.887 4.62766 23.6412 6.54255C24.1196 7.18085 24.1196 7.81915 23.6412 8.45745C21.887 10.3723 17.2625 15 12 15C6.57807 15 1.95349 10.5319 0.358804 8.45745C-0.119601 7.97872 -0.119601 7.18085 0.358804 6.70213C1.95349 4.62766 6.57807 0 12 0ZM6.7377 7.49999C6.7377 10.3723 9.12972 12.7659 12.0002 12.7659C14.8706 12.7659 17.2626 10.3723 17.2626 7.49999C17.2626 4.62765 14.8706 2.23403 12.0002 2.23403C9.12972 2.23403 6.7377 4.62765 6.7377 7.49999Z" fill="currentColor"/>' +
  '<ellipse cx="11.9997" cy="7.49997" rx="2.5515" ry="2.55319" fill="currentColor"/></g></svg>';
const EYE_OFF_SVG =
  '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<g transform="translate(0 3)"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.156796 8.93661C-0.0522653 9.29924 -0.0522653 9.74743 0.156796 10.1101C1.13231 11.8068 2.42448 13.2384 3.94195 14.3485L2.30912 15.9984C2.08973 16.2174 1.96625 16.516 1.96625 16.8276C1.96625 17.1392 2.08973 17.4378 2.30912 17.6568C2.76253 18.1144 3.49706 18.1144 3.95046 17.6568L19.4557 1.98908C20.48 0.900126 18.8557 -0.72313 17.7912 0.354086L15.6388 2.53121C9.77336 0.79921 3.16154 3.5654 0.156022 8.9374L0.156796 8.93661ZM20.0661 4.69033L16.4513 8.34286C16.5798 8.82005 16.6347 9.35201 16.5906 9.8605C16.4381 12.7057 13.5402 14.7944 10.8312 14.0207L8.35371 16.5241C14.2385 18.2271 20.8279 15.4977 23.8435 10.1101C24.0525 9.7502 24.0525 9.29647 23.8435 8.93661C22.8804 7.23356 21.5843 5.8403 20.0661 4.68955V4.69033ZM7.5485 10.7046L13.1693 5.02518C10.3187 4.21551 7.3503 6.52718 7.39443 9.52336C7.39443 9.93015 7.44863 10.3291 7.5485 10.7046Z" fill="currentColor"/></g></svg>';

let nextInputId = 0;

export class NdsInput extends NdsElement {
  static elementName = "nds-input";

  static get observedAttributes(): readonly string[] {
    return [
      "label",
      "helper-text",
      "size",
      "error",
      "error-message",
      "disabled",
      "readonly",
      "full-width",
      "field-width",
      "clearable",
      "show-count",
      "password-toggle",
      "value",
      "default-value",
      "input-id",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _wrapper: HTMLDivElement | null = null;
  private _field: HTMLInputElement | null = null;
  private _clear: HTMLButtonElement | null = null;
  private _passwordToggle: HTMLButtonElement | null = null;
  private _passwordRevealed = false;
  private _count: HTMLSpanElement | null = null;
  private _helper: HTMLSpanElement | null = null;
  private _inputId = "";
  private _focused = false;
  private _dirty = false;

  /**
   * 네이티브 <input> 처럼 host 의 `.value` 로 현재 값을 읽고/쓴다.
   * (이전엔 host 에 value 접근자가 없어 `el.value` 가 undefined → 내부 field 를
   *  직접 들춰야 했다. 입력 기반 폼 검증이 전부 빈값으로 동작하던 함정.)
   * native 시맨틱과 동일하게 property 설정은 value attribute 를 바꾸지 않는다.
   */
  get value(): string {
    return this._field?.value ?? this.getAttribute("value") ?? "";
  }
  set value(v: string) {
    const next = v == null ? "" : String(v);
    if (this._field) {
      this._field.value = next;
      this._dirty = true;
      this._syncClearVisibility();
      this._syncCount();
    } else {
      // mount 전 설정은 attribute 로 보관 → 첫 update() 가 field 에 반영
      this.setAttribute("value", next);
    }
  }

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._inputId = this.attr("input-id", `nds-input-${++nextInputId}`);

    const root = document.createElement("div");
    const wrapper = document.createElement("div");
    const field = document.createElement("input");

    root.className = "nds-input__root";
    root.dataset.slot = "root";

    wrapper.className = "nds-input__wrapper";
    wrapper.dataset.slot = "wrapper";

    field.className = "nds-input__field";
    field.dataset.slot = "field";
    field.id = this._inputId;
    field.addEventListener("focus", () => {
      this._focused = true;
      this.scheduleUpdate();
    });
    field.addEventListener("blur", () => {
      this._focused = false;
      this.scheduleUpdate();
    });
    field.addEventListener("input", () => {
      this._dirty = true;
      this._syncClearVisibility();
      this._syncCount();
      this.dispatchEvent(new Event("input", { bubbles: true }));
    });
    field.addEventListener("change", () => {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });

    wrapper.appendChild(field);
    root.appendChild(wrapper);
    this.appendChild(root);

    this._root = root;
    this._wrapper = wrapper;
    this._field = field;
  }

  protected update(): void {
    if (!this._root || !this._wrapper || !this._field) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const inputId = this.attr("input-id", this._inputId);
    const size = this._normalizedSize();
    // error-message 가 있으면 error 상태로 간주(빨간 보더+aria-invalid) — React errorMessage prop 미러.
    const error = this.boolAttr("error") || this.getAttribute("error-message") !== null;
    const disabled = this.boolAttr("disabled");
    const readOnly = this.boolAttr("readonly");
    const fullWidth = this.boolAttr("full-width");
    const fieldWidthAttr = this.getAttribute("field-width");
    const resolvedFieldWidth = fieldWidthAttr ? FIELD_WIDTHS[fieldWidthAttr] : undefined;
    const cfg = SIZE_CONFIG[size];

    if (inputId !== this._inputId) {
      this._inputId = inputId;
      this._field.id = inputId;
      if (this._label) this._label.htmlFor = inputId;
    }

    const root = this._root;
    root.dataset.size = size;
    root.dataset.disabled = String(disabled);
    root.dataset.error = String(error);
    root.style.setProperty(
      "--nds-input-width",
      resolvedFieldWidth ?? (fullWidth ? "100%" : "auto"),
    );
    // size="default" 는 inline 높이를 박지 않는다 — 그래야 브랜드 :root override
    // (예: 캐포비 admin --nds-input-height:48)가 cascade 로 이긴다. inline 으로 박으면
    // :root 를 눌러 같은 행 nds-select(inline 안 박음) 와 높이가 어긋날 수 있다.
    // field 는 작성자가 명시한 의도이므로 inline 유지(값은 default 와 동일 48).
    // CSS fallback: min-height: var(--nds-input-height, sizing.input.default=48px).
    if (size === "default") {
      root.style.removeProperty("--nds-input-height");
    } else {
      root.style.setProperty("--nds-input-height", `${cfg.height}px`);
    }
    root.style.setProperty("--nds-input-label-gap", `${cfg.labelGap}px`);
    root.style.setProperty("--nds-input-helper-gap", `${cfg.helperGap}px`);
    if (cfg.paddingX !== null) {
      root.style.setProperty("--nds-input-padding-x", `${cfg.paddingX}px`);
    } else {
      root.style.removeProperty("--nds-input-padding-x");
    }

    this._wrapper.dataset.focused = String(this._focused);
    this._wrapper.dataset.error = String(error);
    this._wrapper.dataset.disabled = String(disabled);
    this._wrapper.dataset.readonly = String(readOnly);

    this._field.disabled = disabled;
    this._field.readOnly = readOnly;
    if (error) this._field.setAttribute("aria-invalid", "true");
    else this._field.removeAttribute("aria-invalid");

    for (const name of FORWARDED_ATTRS) {
      const v = this.getAttribute(name);
      if (v === null) this._field.removeAttribute(name);
      else this._field.setAttribute(name, v);
    }

    // value 동기 (controlled). 사용자 입력 전이고 default-value 만 있으면 그걸로.
    if (this.hasAttribute("value")) {
      const next = this.getAttribute("value") ?? "";
      if (this._field.value !== next) this._field.value = next;
    } else if (!this._dirty && this.hasAttribute("default-value")) {
      this._field.defaultValue = this.getAttribute("default-value") ?? "";
      this._field.value = this._field.defaultValue;
    }

    this._syncLabel();
    this._syncHelper();
    this._syncClearVisibility();
    this._syncCount();
    this._syncPasswordToggle();
  }

  // type="password" + (password-toggle != "false") 면 우측 눈 버튼으로 표시/숨김 토글.
  // FORWARDED_ATTRS 가 field.type 을 password 로 박은 뒤라, 여기서 revealed 상태로 최종 결정한다.
  private _syncPasswordToggle(): void {
    if (!this._wrapper || !this._field) return;
    const isPassword = this.getAttribute("type") === "password";
    const enabled = isPassword && this.attr("password-toggle", "true") !== "false";

    if (!enabled) {
      this._passwordToggle?.remove();
      this._passwordToggle = null;
      this._passwordRevealed = false;
      return;
    }

    this._field.type = this._passwordRevealed ? "text" : "password";

    if (!this._passwordToggle) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nds-input__password-toggle";
      btn.dataset.slot = "password-toggle";
      btn.addEventListener("mousedown", (e) => e.preventDefault()); // input focus 유지
      btn.addEventListener("click", () => {
        this._passwordRevealed = !this._passwordRevealed;
        this._syncPasswordToggle();
        this._field?.focus();
      });
      this._wrapper.appendChild(btn);
      this._passwordToggle = btn;
    }

    const btn = this._passwordToggle;
    btn.disabled = this.boolAttr("disabled");
    btn.setAttribute("aria-pressed", String(this._passwordRevealed));
    btn.setAttribute("aria-label", this._passwordRevealed ? "비밀번호 숨기기" : "비밀번호 표시");
    btn.innerHTML = this._passwordRevealed ? EYE_OFF_SVG : EYE_SVG;
  }

  private _syncLabel(): void {
    if (!this._root || !this._wrapper) return;
    const text = this.getAttribute("label");
    if (text === null) {
      this._label?.remove();
      this._label = null;
      return;
    }
    if (!this._label) {
      this._label = document.createElement("label");
      this._label.className = "nds-input__label";
      this._label.dataset.slot = "label";
      this._root.insertBefore(this._label, this._wrapper);
    }
    this._label.htmlFor = this._inputId;
    this._label.textContent = text;
  }

  private _syncHelper(): void {
    if (!this._root || !this._field) return;
    // error-message 가 있으면 그걸 헬퍼로(빨간색) — helper-text 보다 우선. (React errorMessage 미러)
    const errorMessage = this.getAttribute("error-message");
    const text = errorMessage ?? this.getAttribute("helper-text");
    const error = this.boolAttr("error") || errorMessage !== null;
    const helperId = `${this._inputId}-helper`;
    if (text === null) {
      this._helper?.remove();
      this._helper = null;
      this._field.removeAttribute("aria-describedby");
      return;
    }
    if (!this._helper) {
      this._helper = document.createElement("span");
      this._helper.className = "nds-input__helper nds-helper-text";
      this._helper.dataset.slot = "helper";
      this._root.appendChild(this._helper);
    }
    this._helper.id = helperId;
    this._helper.dataset.error = String(error);
    this._helper.textContent = text;
    this._field.setAttribute("aria-describedby", helperId);
  }

  private _syncClearVisibility(): void {
    if (!this._wrapper || !this._field) return;
    const clearable = this.boolAttr("clearable");
    const hasValue = this._field.value !== "";
    const disabled = this.boolAttr("disabled");
    const visible = clearable && hasValue && !disabled;

    if (visible && !this._clear) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nds-input__clear";
      btn.dataset.slot = "clear";
      btn.setAttribute("aria-label", "지우기");
      btn.tabIndex = -1;
      btn.innerHTML =
        '<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        "</svg>";
      btn.addEventListener("mousedown", (e) => e.preventDefault()); // input focus 유지
      btn.addEventListener("click", () => {
        if (!this._field) return;
        this._field.value = "";
        this._dirty = true;
        // controlled: attribute 도 같이 비움 (외부 코드가 다시 set 하지 않는 한)
        if (this.hasAttribute("value")) this.setAttribute("value", "");
        this._syncClearVisibility();
        this.dispatchEvent(new Event("input", { bubbles: true }));
        this.dispatchEvent(new Event("change", { bubbles: true }));
        this._field.focus();
      });
      this._wrapper.appendChild(btn);
      this._clear = btn;
    } else if (!visible && this._clear) {
      this._clear.remove();
      this._clear = null;
    }
  }

  private _syncCount(): void {
    if (!this._wrapper || !this._field) return;
    const maxRaw = this.getAttribute("maxlength");
    const max = maxRaw === null ? NaN : Number(maxRaw);
    const visible = this.boolAttr("show-count") && Number.isFinite(max);

    if (!visible) {
      if (this._count) {
        this._count.remove();
        this._count = null;
      }
      return;
    }

    if (!this._count) {
      const span = document.createElement("span");
      span.className = "nds-input__count";
      span.dataset.slot = "count";
      // field 바로 뒤(= clear/suffix 앞)에 위치
      this._wrapper.insertBefore(span, this._field.nextSibling);
      this._count = span;
    }

    const len = this._field.value.length;
    this._count.dataset.over = len > max ? "true" : "false";
    this._count.textContent = `${len}/${max}`;
  }

  private _normalizedSize(): InputSize {
    const v = this.attr("size", "default");
    return (SIZES as readonly string[]).includes(v) ? (v as InputSize) : "default";
  }
}

define(NdsInput);
