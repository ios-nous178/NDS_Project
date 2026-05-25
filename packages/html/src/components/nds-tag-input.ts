/**
 * <nds-tag-input> — DS TagInput 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-tag-input
 *     label="관심 주제"
 *     placeholder="태그 입력 후 Enter"
 *     value='["우울","불안"]'
 *     max-tags="5"
 *     helper-text="최대 5개"
 *   ></nds-tag-input>
 *
 * 이벤트:
 *   nds-tag-change (detail: { value: string[] }) -> 태그 목록 변경
 *   nds-tag-max-reached -> max-tags 도달 시
 *
 * 속성:
 *   value: JSON 배열 (controlled)
 *   label / placeholder / helper-text
 *   error: 에러 상태
 *   max-tags: 정수
 *   allow-duplicates: 중복 허용
 *   full-width
 *   disabled
 */

import { NdsElement, define } from "../base/nds-element.js";

const TI_CLASS = "nds-tag-input";
const TI_ROOT_CLASS = `${TI_CLASS}__root`;
const TI_LABEL_CLASS = `${TI_CLASS}__label`;
const TI_FIELD_CLASS = `${TI_CLASS}__field`;
const TI_TAG_CLASS = `${TI_CLASS}__tag`;
const TI_REMOVE_CLASS = `${TI_CLASS}__remove`;
const TI_INPUT_CLASS = `${TI_CLASS}__input`;
const TI_HELPER_CLASS = `${TI_CLASS}__helper`;

let nextId = 0;

const RemoveIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "10");
  svg.setAttribute("height", "10");
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
  return svg;
};

export class NdsTagInput extends NdsElement {
  static elementName = "nds-tag-input";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "label",
      "placeholder",
      "helper-text",
      "error",
      "max-tags",
      "allow-duplicates",
      "full-width",
      "disabled",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _helperEl: HTMLParagraphElement | null = null;
  private _inputId = `nds-tag-input-${++nextId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _parseValue(): string[] {
    const raw = this.getAttribute("value");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(String);
    } catch {
      return [];
    }
  }

  private _commitValue(next: string[]): void {
    this.setAttribute("value", JSON.stringify(next));
    this.dispatchEvent(
      new CustomEvent("nds-tag-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _addTag(raw: string): void {
    const tag = raw.trim().replace(/^#/, "");
    if (!tag) return;
    const value = this._parseValue();
    const allowDuplicates = this.boolAttr("allow-duplicates");
    if (!allowDuplicates && value.includes(tag)) {
      if (this._input) this._input.value = "";
      return;
    }
    const maxTagsAttr = this.getAttribute("max-tags");
    const maxTags = maxTagsAttr ? parseInt(maxTagsAttr, 10) : undefined;
    if (maxTags !== undefined && !Number.isNaN(maxTags) && value.length >= maxTags) {
      this.dispatchEvent(new CustomEvent("nds-tag-max-reached", { bubbles: true, composed: true }));
      return;
    }
    this._commitValue([...value, tag]);
    if (this._input) this._input.value = "";
  }

  private _removeAt(idx: number): void {
    const value = this._parseValue();
    this._commitValue(value.filter((_, i) => i !== idx));
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TI_ROOT_CLASS;

    const labelEl = document.createElement("label");
    labelEl.className = TI_LABEL_CLASS;
    labelEl.setAttribute("for", this._inputId);

    const field = document.createElement("div");
    field.className = TI_FIELD_CLASS;
    field.addEventListener("click", () => this._input?.focus());

    const input = document.createElement("input");
    input.id = this._inputId;
    input.type = "text";
    input.className = TI_INPUT_CLASS;
    input.addEventListener("keydown", (e) => {
      if (this.boolAttr("disabled")) return;
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        this._addTag(input.value);
      } else if (e.key === "Backspace" && input.value === "") {
        const value = this._parseValue();
        if (value.length > 0) this._removeAt(value.length - 1);
      }
    });
    input.addEventListener("blur", () => {
      if (this.boolAttr("disabled")) return;
      this._addTag(input.value);
    });

    field.appendChild(input);

    const helperEl = document.createElement("p");
    helperEl.className = TI_HELPER_CLASS;

    root.append(labelEl, field, helperEl);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._field = field;
    this._input = input;
    this._helperEl = helperEl;
  }

  protected update(): void {
    if (!this._root || !this._labelEl || !this._field || !this._input || !this._helperEl) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this._parseValue();
    const label = this.getAttribute("label");
    const placeholder = this.getAttribute("placeholder") || "태그 입력 후 Enter";
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");
    const disabled = this.boolAttr("disabled");

    this._root.dataset.fullWidth = fullWidth ? "true" : "false";

    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.style.display = "none";
    }

    this._field.dataset.error = error ? "true" : "false";
    this._field.dataset.disabled = disabled ? "true" : "false";

    // Re-render tags before the input element.
    Array.from(this._field.children).forEach((child) => {
      if (child !== this._input) child.remove();
    });
    value.forEach((tag, idx) => {
      const span = document.createElement("span");
      span.className = TI_TAG_CLASS;
      span.textContent = `#${tag}`;
      if (!disabled) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = TI_REMOVE_CLASS;
        removeBtn.setAttribute("aria-label", `${tag} 제거`);
        removeBtn.appendChild(RemoveIcon());
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this._removeAt(idx);
        });
        span.appendChild(removeBtn);
      }
      this._field!.insertBefore(span, this._input);
    });

    this._input.placeholder = value.length === 0 ? placeholder : "";
    this._input.disabled = disabled;

    if (helperText) {
      this._helperEl.textContent = helperText;
      this._helperEl.dataset.error = error ? "true" : "false";
      this._helperEl.style.display = "";
    } else {
      this._helperEl.style.display = "none";
    }
  }
}

define(NdsTagInput);
