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

export type InputSize = "default" | "field" | "compact";

const SIZES: readonly InputSize[] = ["default", "field", "compact"];

// sizing.input.{default,field,compact} = {48, 44, 40}px. compact 는 캐포비 admin TextField (Figma 3082:846).
const SIZE_CONFIG: Record<
  InputSize,
  { height: number; paddingX: number | null; labelGap: number; helperGap: number }
> = {
  default: { height: 48, paddingX: null, labelGap: 12, helperGap: 8 },
  field: { height: 44, paddingX: null, labelGap: 8, helperGap: 8 },
  compact: { height: 40, paddingX: 12, labelGap: 6, helperGap: 6 },
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

let nextInputId = 0;

export class NdsInput extends NdsElement {
  static elementName = "nds-input";

  static get observedAttributes(): readonly string[] {
    return [
      "label",
      "helper-text",
      "size",
      "error",
      "disabled",
      "readonly",
      "full-width",
      "clearable",
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
  private _helper: HTMLSpanElement | null = null;
  private _inputId = "";
  private _focused = false;
  private _dirty = false;

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
    const error = this.boolAttr("error");
    const disabled = this.boolAttr("disabled");
    const readOnly = this.boolAttr("readonly");
    const fullWidth = this.boolAttr("full-width");
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
    root.style.setProperty("--nds-input-width", fullWidth ? "100%" : "auto");
    // size="default" 는 inline 높이를 박지 않는다 — 그래야 브랜드 :root override
    // (예: 캐포비 admin --nds-input-height:40)가 cascade 로 이긴다. inline 으로 박으면
    // :root 를 눌러 nds-select(40, inline 안 박음) 와 높이가 어긋난다(48 vs 40).
    // field/compact 는 작성자가 명시한 의도이므로 inline 유지.
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
    const text = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const helperId = `${this._inputId}-helper`;
    if (text === null) {
      this._helper?.remove();
      this._helper = null;
      this._field.removeAttribute("aria-describedby");
      return;
    }
    if (!this._helper) {
      this._helper = document.createElement("span");
      this._helper.className = "nds-input__helper";
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

  private _normalizedSize(): InputSize {
    const v = this.attr("size", "default");
    return (SIZES as readonly string[]).includes(v) ? (v as InputSize) : "default";
  }
}

define(NdsInput);
