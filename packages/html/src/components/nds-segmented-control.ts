/**
 * <nds-segmented-control> — DS SegmentedControl 의 vanilla Web Component 버전.
 *
 * 기존 <nds-segmented> 와 별개의 컴포넌트. React 의 SegmentedControl.tsx 와 1:1 매핑.
 *
 * 사용 패턴 (JSON options):
 *   <nds-segmented-control value="week" size="md"
 *     options='[{"value":"day","label":"일"},{"value":"week","label":"주"}]'>
 *   </nds-segmented-control>
 *
 * 또는 선언적 children (button[value], data-disabled):
 *   <nds-segmented-control value="week">
 *     <button value="day">일</button>
 *     <button value="week">주</button>
 *   </nds-segmented-control>
 *
 * 이벤트:
 *   사용자 선택 → host 의 `value` 갱신 + "segmented-change" CustomEvent (detail: { value }).
 */

import { NdsElement, define } from "../base/nds-element.js";

const SC_CLASS = "nds-segmented";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;

export type SegmentedControlSize = "sm" | "md";

const SIZES: readonly SegmentedControlSize[] = ["sm", "md"];

interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export class NdsSegmentedControl extends NdsElement {
  static elementName = "nds-segmented-control";

  static get observedAttributes(): readonly string[] {
    return ["value", "size", "full-width", "disabled", "options"];
  }

  private _root: HTMLDivElement | null = null;
  private _sourceOptions: SegmentedOption[] = [];

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._sourceOptions = this._collectChildOptions();

    const root = document.createElement("div");
    root.className = SC_ROOT_CLASS;
    root.dataset.slot = "root";
    root.setAttribute("role", "radiogroup");
    this.appendChild(root);
    this._root = root;
  }

  private _collectChildOptions(): SegmentedOption[] {
    const out: SegmentedOption[] = [];
    const buttons = Array.from(this.querySelectorAll<HTMLElement>("button[value]"));
    buttons.forEach((btn) => {
      const value = btn.getAttribute("value") || "";
      if (!value) return;
      out.push({
        value,
        label: btn.textContent ?? "",
        disabled: btn.hasAttribute("disabled"),
      });
    });
    buttons.forEach((b) => b.remove());
    return out;
  }

  private _resolveOptions(): SegmentedOption[] {
    const raw = this.getAttribute("options");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SegmentedOption[];
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* ignore */
      }
    }
    return this._sourceOptions;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const options = this._resolveOptions();
    const currentValue = this.getAttribute("value") ?? "";
    const sizeAttr = this.getAttribute("size") as SegmentedControlSize | null;
    const size: SegmentedControlSize = SIZES.includes(sizeAttr as SegmentedControlSize)
      ? (sizeAttr as SegmentedControlSize)
      : "sm";
    const fullWidth = this.boolAttr("full-width");
    const groupDisabled = this.boolAttr("disabled");

    this._root.dataset.size = size;
    this._root.dataset.fullwidth = fullWidth ? "true" : "false";

    const buttons: HTMLButtonElement[] = options.map((opt) => {
      const active = opt.value === currentValue;
      const disabled = groupDisabled || !!opt.disabled;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", String(active));
      btn.dataset.slot = "item";
      btn.dataset.active = active ? "true" : "false";
      btn.className = SC_ITEM_CLASS;
      if (disabled) btn.disabled = true;
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        if (disabled || active) return;
        this.setAttribute("value", opt.value);
        this.dispatchEvent(
          new CustomEvent("segmented-change", {
            detail: { value: opt.value },
            bubbles: true,
            composed: true,
          }),
        );
      });
      return btn;
    });

    this._root.replaceChildren(...buttons);
  }
}

define(NdsSegmentedControl);
