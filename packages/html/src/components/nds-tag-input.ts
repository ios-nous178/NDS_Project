/**
 * <nds-tag-input> — DS TagInput 의 vanilla Web Component 버전.
 *
 * variant:
 *   stacked (기본) — 입력칸 + 우측 추가 버튼, 칩은 아래 wrap (이메일 초대/수신자)
 *   inline         — 칩이 입력칸 안쪽(tokenfield, 해시태그식)
 *
 * 사용 예:
 *   <nds-tag-input label="멤버 초대하기" placeholder="이메일 주소를 입력해 주세요"
 *     pattern="^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" max-tags="50"></nds-tag-input>
 *   <nds-tag-input variant="inline" prefix="#" placeholder="태그 입력 후 Enter"></nds-tag-input>
 *
 * 이벤트:
 *   nds-tag-change (detail: { value: string[] })
 *   nds-tag-max-reached
 *   nds-tag-invalid (detail: { value: string })
 */

import { NdsElement, define } from "../base/nds-element.js";
import { REMOVE_ICON_SVG } from "../base/remove-icon.js";

const TI_CLASS = "nds-tag-input";
const TI_ROOT_CLASS = `${TI_CLASS}__root`;
const TI_LABEL_CLASS = `${TI_CLASS}__label`;
const TI_FIELD_CLASS = `${TI_CLASS}__field`;
const TI_ROW_CLASS = `${TI_CLASS}__row`;
const TI_ADD_CLASS = `${TI_CLASS}__add`;
const TI_CHIPS_CLASS = `${TI_CLASS}__chips`;
const TI_TAG_CLASS = `${TI_CLASS}__tag`;
const TI_REMOVE_CLASS = `${TI_CLASS}__remove`;
const TI_INPUT_CLASS = `${TI_CLASS}__input`;
const TI_HELPER_CLASS = `${TI_CLASS}__helper`;

export type TagInputVariant = "stacked" | "inline";

const VARIANTS: readonly TagInputVariant[] = ["stacked", "inline"];

let nextId = 0;

const makeSvg = (size: string, inner: string) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = inner;
  return svg;
};

const AddIcon = () =>
  makeSvg(
    "20",
    `<path d="M10 4.5v11M4.5 10h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  );

export class NdsTagInput extends NdsElement {
  static elementName = "nds-tag-input";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "variant",
      "label",
      "placeholder",
      "helper-text",
      "error",
      "max-tags",
      "allow-duplicates",
      "prefix",
      "pattern",
      "add-button-label",
      "full-width",
      "disabled",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _addBtn: HTMLButtonElement | null = null;
  private _fieldEl: HTMLDivElement | null = null;
  private _rowEl: HTMLDivElement | null = null;
  private _chipsEl: HTMLDivElement | null = null;
  private _mountedVariant: TagInputVariant | null = null;
  private _helperEl: HTMLParagraphElement | null = null;
  private _inputId = `nds-tag-input-${++nextId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  /* ─── value / 동작 ─── */

  private _parseValue(): string[] {
    const raw = this.getAttribute("value");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  private _commitValue(next: string[]): void {
    this.setAttribute("value", JSON.stringify(next));
    this.dispatchEvent(
      new CustomEvent("nds-tag-change", { detail: { value: next }, bubbles: true, composed: true }),
    );
  }

  private _maxTags(): number | undefined {
    const raw = this.getAttribute("max-tags");
    if (!raw) return undefined;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? undefined : n;
  }

  private _isValid(val: string): boolean {
    const pattern = this.getAttribute("pattern");
    if (!pattern) return true;
    try {
      return new RegExp(pattern).test(val);
    } catch {
      return true;
    }
  }

  private _addTag(raw: string): void {
    const prefix = this.getAttribute("prefix") ?? "";
    let tag = raw.trim();
    if (prefix && tag.startsWith(prefix)) tag = tag.slice(prefix.length);
    if (!tag) return;
    if (!this._isValid(tag)) {
      this.dispatchEvent(
        new CustomEvent("nds-tag-invalid", {
          detail: { value: tag },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    const value = this._parseValue();
    if (!this.boolAttr("allow-duplicates") && value.includes(tag)) {
      if (this._input) this._input.value = "";
      this._syncAddBtn();
      return;
    }
    const max = this._maxTags();
    if (max !== undefined && value.length >= max) {
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

  private _syncAddBtn(): void {
    if (!this._addBtn || !this._input) return;
    const max = this._maxTags();
    const atMax = max !== undefined && this._parseValue().length >= max;
    this._addBtn.disabled = this._input.value.trim() === "" || this.boolAttr("disabled") || atMax;
  }

  /* ─── mount / update ─── */

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TI_ROOT_CLASS;

    const labelEl = document.createElement("label");
    labelEl.className = TI_LABEL_CLASS;
    labelEl.setAttribute("for", this._inputId);

    const input = document.createElement("input");
    input.id = this._inputId;
    input.type = "text";
    input.className = TI_INPUT_CLASS;
    input.addEventListener("keydown", (e) => {
      if (this.boolAttr("disabled")) return;
      // 한글 IME 조합 중 Enter 무시 (마지막 글자 중복 방지). keyCode 229 = 조합 중.
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        this._addTag(input.value);
      } else if (e.key === "Backspace" && input.value === "") {
        const value = this._parseValue();
        if (value.length > 0) this._removeAt(value.length - 1);
      }
    });
    input.addEventListener("input", () => this._syncAddBtn());
    input.addEventListener("blur", () => {
      // inline tokenfield 만 blur-add (stacked 는 버튼/Enter 로만)
      if (this.boolAttr("disabled")) return;
      if (this._normalizedVariant() === "inline") this._addTag(input.value);
    });

    const helperEl = document.createElement("p");
    helperEl.className = TI_HELPER_CLASS;

    root.append(labelEl, helperEl);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._input = input;
    this._helperEl = helperEl;
  }

  private _normalizedVariant(): TagInputVariant {
    const v = this.getAttribute("variant");
    return v && (VARIANTS as readonly string[]).includes(v) ? (v as TagInputVariant) : "stacked";
  }

  /** variant 전환(또는 첫 update) 시에만 컨테이너 골격을 구성 — input 노드는 재사용. */
  private _mountVariant(variant: TagInputVariant): void {
    if (!this._labelEl || !this._input) return;
    this._fieldEl?.remove();
    this._rowEl?.remove();
    this._chipsEl?.remove();
    this._fieldEl = null;
    this._rowEl = null;
    this._chipsEl = null;
    this._addBtn = null;

    if (variant === "inline") {
      const field = document.createElement("div");
      field.className = TI_FIELD_CLASS;
      field.addEventListener("click", () => this._input?.focus());
      field.appendChild(this._input);
      this._labelEl.after(field);
      this._fieldEl = field;
    } else {
      const row = document.createElement("div");
      row.className = TI_ROW_CLASS;
      row.appendChild(this._input);

      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = TI_ADD_CLASS;
      addBtn.appendChild(AddIcon());
      addBtn.addEventListener("click", () => this._addTag(this._input!.value));
      row.appendChild(addBtn);
      this._addBtn = addBtn;

      this._labelEl.after(row);
      this._rowEl = row;
    }
    this._mountedVariant = variant;
  }

  private _buildTag(tag: string, idx: number, disabled: boolean): HTMLSpanElement {
    const prefix = this.getAttribute("prefix") ?? "";
    const span = document.createElement("span");
    span.className = TI_TAG_CLASS;
    span.textContent = `${prefix}${tag}`;
    if (!disabled) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = TI_REMOVE_CLASS;
      removeBtn.setAttribute("aria-label", `${tag} 제거`);
      removeBtn.innerHTML = REMOVE_ICON_SVG;
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._removeAt(idx);
      });
      span.appendChild(removeBtn);
    }
    return span;
  }

  protected update(): void {
    if (!this._root || !this._labelEl || !this._input || !this._helperEl) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this._parseValue();
    const variant = this._normalizedVariant();
    const label = this.getAttribute("label");
    const placeholder = this.getAttribute("placeholder") || "입력 후 Enter";
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const disabled = this.boolAttr("disabled");

    this._root.dataset.variant = variant;
    this._root.dataset.fullWidth = this.boolAttr("full-width") ? "true" : "false";

    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.style.display = "none";
    }

    // variant 컨테이너는 variant 가 실제로 바뀔 때만 재구성. 매 update 마다 input 을
    // remove/append 하면 노드는 같아도 detach 순간 포커스가 떨어진다 — Enter 로 태그를
    // 추가할 때마다(setAttribute("value") → update) 입력이 끊기는 회귀 클래스
    // (scripts/check-input-tests.mjs 게이트).
    if (variant !== this._mountedVariant) this._mountVariant(variant);

    this._input.placeholder = variant === "inline" && value.length > 0 ? "" : placeholder;
    this._input.disabled = disabled;
    if (error) this._input.dataset.error = "true";
    else delete this._input.dataset.error;

    if (variant === "inline") {
      const field = this._fieldEl!;
      field.dataset.error = error ? "true" : "false";
      field.dataset.disabled = disabled ? "true" : "false";
      // 칩만 갈아끼우고 input 은 그대로 둔다.
      field.querySelectorAll(`.${TI_TAG_CLASS}`).forEach((el) => el.remove());
      value.forEach((tag, idx) =>
        field.insertBefore(this._buildTag(tag, idx, disabled), this._input),
      );
    } else {
      this._addBtn!.setAttribute("aria-label", this.getAttribute("add-button-label") || "추가");
      if (value.length > 0) {
        if (!this._chipsEl) {
          const chips = document.createElement("div");
          chips.dataset.slot = "chips";
          chips.className = TI_CHIPS_CLASS;
          this._rowEl!.after(chips);
          this._chipsEl = chips;
        }
        this._chipsEl.replaceChildren(...value.map((tag, idx) => this._buildTag(tag, idx, disabled)));
      } else {
        this._chipsEl?.remove();
        this._chipsEl = null;
      }
      this._syncAddBtn();
    }

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
