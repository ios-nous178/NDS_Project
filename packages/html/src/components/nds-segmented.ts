/**
 * <nds-segmented> — DS SegmentedControl 의 vanilla Web Component 버전.
 *
 * 사용 패턴 (JSON options):
 *   <nds-segmented value="week" size="md"
 *     options='[{"value":"day","label":"일"},{"value":"week","label":"주"},{"value":"month","label":"월"}]'>
 *   </nds-segmented>
 *
 * 또는 선언적 children (button[value], data-disabled):
 *   <nds-segmented value="week">
 *     <button value="day">일</button>
 *     <button value="week">주</button>
 *     <button value="month" disabled>월</button>
 *   </nds-segmented>
 *
 * 이벤트:
 *   사용자 선택 → host 의 `value` attribute 갱신 +
 *   "segmented-change" CustomEvent (detail: { value }) 디스패치 (bubbles, composed).
 */

import { NdsElement, define } from "../base/nds-element.js";

const SC_CLASS = "nds-segmented";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;

export type SegmentedSize = "sm" | "md";

const SIZES: readonly SegmentedSize[] = ["sm", "md"];

interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsSegmented extends NdsElement {
  static elementName = "nds-segmented";

  static get observedAttributes(): readonly string[] {
    return ["value", "size", "variant", "full-width", "disabled", "options", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _sourceOptions: SegmentedOption[] = [];

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._sourceOptions = this._readChildOptions();

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SC_ROOT_CLASS;
    root.setAttribute("role", "radiogroup");
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const size = this._normalizedSize();
    const variant = this.attr("variant", "default") === "solid" ? "solid" : "default";
    const fullWidth = this.boolAttr("full-width");
    const disabled = this.boolAttr("disabled");
    const value = this.getAttribute("value") ?? "";
    const options = this._readOptions();

    this._root.dataset.size = size;
    this._root.dataset.variant = variant;
    this._root.dataset.fullwidth = fullWidth ? "true" : "false";

    for (const name of FORWARDED_ATTRS) {
      const attr = this.getAttribute(name);
      if (attr === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, attr);
    }

    this._root.replaceChildren(
      ...options.map((opt) => this._createItem(opt, opt.value === value, disabled)),
    );
  }

  private _readOptions(): SegmentedOption[] {
    const attr = this.getAttribute("options");
    if (attr && attr.trim()) {
      try {
        const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
        if (Array.isArray(parsed)) {
          return parsed
            .map((raw) => ({
              value: typeof raw.value === "string" ? raw.value : "",
              label: typeof raw.label === "string" ? raw.label : "",
              disabled: raw.disabled === true,
            }))
            .filter((opt) => opt.value);
        }
      } catch {
        /* fall through */
      }
    }
    return this._sourceOptions;
  }

  private _readChildOptions(): SegmentedOption[] {
    const options: SegmentedOption[] = [];
    for (const node of Array.from(this.children)) {
      if (!(node instanceof HTMLElement)) continue;
      const value = node.getAttribute("value") ?? node.dataset.value ?? "";
      if (!value) continue;
      options.push({
        value,
        label: node.textContent?.trim() ?? "",
        disabled: node.hasAttribute("disabled") || node.getAttribute("data-disabled") === "true",
      });
    }
    return options;
  }

  private _createItem(
    option: SegmentedOption,
    isActive: boolean,
    groupDisabled: boolean,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = SC_ITEM_CLASS;
    button.dataset.slot = "item";
    button.dataset.active = isActive ? "true" : "false";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", isActive ? "true" : "false");
    button.textContent = option.label;

    const itemDisabled = groupDisabled || !!option.disabled;
    if (itemDisabled) button.disabled = true;

    button.addEventListener("click", () => {
      if (itemDisabled || isActive) return;
      this._selectValue(option.value);
    });

    return button;
  }

  private _selectValue(value: string): void {
    if (this.getAttribute("value") === value) return;
    this.setAttribute("value", value);
    this.dispatchEvent(
      new CustomEvent("segmented-change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _normalizedSize(): SegmentedSize {
    const value = this.attr("size", "sm");
    return (SIZES as readonly string[]).includes(value) ? (value as SegmentedSize) : "sm";
  }
}

define(NdsSegmented);
