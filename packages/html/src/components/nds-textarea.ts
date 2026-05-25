/**
 * <nds-textarea> — DS Textarea 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Textarea.tsx 와 동일):
 *   <nds-textarea label="메모" helper-text="최대 200자" max-length="200"></nds-textarea>
 *     └─ <div class="nds-textarea__root" data-slot="root">
 *          ├─ <label class="nds-textarea__label" data-slot="label">메모</label>
 *          ├─ <div class="nds-textarea__wrapper" data-slot="wrapper" ...>
 *          │    ├─ <textarea class="nds-textarea__field" data-slot="field"></textarea>
 *          │    └─ <div class="nds-textarea__count" data-slot="count">0/200</div>
 *          └─ <span class="nds-textarea__helper" data-slot="helper">최대 200자</span>
 *        </div>
 */

import { NdsElement, define } from "../base/nds-element.js";

const TA_CLASS = "nds-textarea";
const TA_ROOT_CLASS = `${TA_CLASS}__root`;
const TA_LABEL_CLASS = `${TA_CLASS}__label`;
const TA_WRAPPER_CLASS = `${TA_CLASS}__wrapper`;
const TA_FIELD_CLASS = `${TA_CLASS}__field`;
const TA_HELPER_CLASS = `${TA_CLASS}__helper`;
const TA_COUNT_CLASS = `${TA_CLASS}__count`;

type TextareaResize = "none" | "vertical" | "horizontal" | "both";

const RESIZE_VALUES: readonly TextareaResize[] = ["none", "vertical", "horizontal", "both"];

const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "name",
  "placeholder",
  "form",
  "required",
  "autofocus",
  "autocomplete",
  "dirname",
  "wrap",
  "rows",
  "cols",
  "minlength",
  "spellcheck",
  "tabindex",
] as const;

let nextTextareaId = 0;

export class NdsTextarea extends NdsElement {
  static elementName = "nds-textarea";

  static get observedAttributes(): readonly string[] {
    return [
      "label",
      "helper-text",
      "error",
      "disabled",
      "readonly",
      "max-length",
      "min-height",
      "resize",
      "input-id",
      "value",
      "default-value",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _wrapper: HTMLDivElement | null = null;
  private _field: HTMLTextAreaElement | null = null;
  private _count: HTMLDivElement | null = null;
  private _helper: HTMLSpanElement | null = null;
  private _inputId = "";
  private _focused = false;
  private _dirty = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._inputId = this.attr("input-id", `nds-textarea-${++nextTextareaId}`);

    const root = document.createElement("div");
    const wrapper = document.createElement("div");
    const field = document.createElement("textarea");

    root.className = TA_ROOT_CLASS;
    root.dataset.slot = "root";

    wrapper.className = TA_WRAPPER_CLASS;
    wrapper.dataset.slot = "wrapper";

    field.className = TA_FIELD_CLASS;
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

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const inputId = this.attr("input-id", this._inputId);
    const error = this.boolAttr("error");
    const disabled = this.boolAttr("disabled");
    const readOnly = this.boolAttr("readonly");
    const maxLength = this._numberAttr("max-length");
    const minHeight = this._numberAttr("min-height");
    const resize = this._normalizedResize();

    if (inputId !== this._inputId) {
      this._inputId = inputId;
      this._field.id = inputId;
    }

    this._wrapper.dataset.focused = this._focused ? "true" : "false";
    this._wrapper.dataset.error = error ? "true" : "false";
    this._wrapper.dataset.disabled = disabled ? "true" : "false";
    this._wrapper.dataset.readonly = readOnly ? "true" : "false";

    this._field.disabled = disabled;
    this._field.readOnly = readOnly;
    if (error) this._field.setAttribute("aria-invalid", "true");
    else this._field.removeAttribute("aria-invalid");
    if (maxLength === undefined) this._field.removeAttribute("maxLength");
    else this._field.maxLength = maxLength;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._field.removeAttribute(name);
      else this._field.setAttribute(name, value);
    }

    if (this.hasAttribute("value")) {
      const next = this.getAttribute("value") ?? "";
      if (this._field.value !== next) this._field.value = next;
    } else if (!this._dirty && this.hasAttribute("default-value")) {
      this._field.defaultValue = this.getAttribute("default-value") ?? "";
      this._field.value = this._field.defaultValue;
    }

    if (minHeight === undefined) this._root.style.removeProperty("--nds-textarea-min-height");
    else this._root.style.setProperty("--nds-textarea-min-height", `${minHeight}px`);

    if (resize === undefined) this._root.style.removeProperty("--nds-textarea-resize");
    else this._root.style.setProperty("--nds-textarea-resize", resize);

    this._syncLabel();
    this._syncHelper();
    this._syncCount();
  }

  private _syncLabel(): void {
    if (!this._root || !this._field) return;
    const text = this.getAttribute("label");
    if (text === null) {
      this._label?.remove();
      this._label = null;
      return;
    }
    if (!this._label) {
      this._label = document.createElement("label");
      this._label.className = TA_LABEL_CLASS;
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
      this._helper.className = TA_HELPER_CLASS;
      this._helper.dataset.slot = "helper";
      this._root.appendChild(this._helper);
    }
    this._helper.id = helperId;
    this._helper.dataset.error = error ? "true" : "false";
    this._helper.textContent = text;
    this._field.setAttribute("aria-describedby", helperId);
  }

  private _syncCount(): void {
    if (!this._wrapper || !this._field) return;
    const maxLength = this._numberAttr("max-length");
    if (maxLength === undefined) {
      this._count?.remove();
      this._count = null;
      return;
    }
    if (!this._count) {
      this._count = document.createElement("div");
      this._count.className = TA_COUNT_CLASS;
      this._count.dataset.slot = "count";
      this._wrapper.appendChild(this._count);
    }
    const count = this._field.value.length;
    this._count.dataset.over = count > maxLength ? "true" : "false";
    this._count.textContent = `${count}/${maxLength}`;
  }

  private _numberAttr(name: string): number | undefined {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private _normalizedResize(): TextareaResize | undefined {
    const value = this.getAttribute("resize");
    if (value === null) return undefined;
    return (RESIZE_VALUES as readonly string[]).includes(value)
      ? (value as TextareaResize)
      : undefined;
  }
}

define(NdsTextarea);
