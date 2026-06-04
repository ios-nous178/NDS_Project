/**
 * <nds-selection-button-group> — DS SelectionButtonGroup 의 vanilla Web Component 버전.
 *
 * 폼 내 상호 배타적 옵션의 단일 선택. SegmentedControl(연결된 회색 트랙)과 달리
 * 브랜드색 아웃라인의 개별 버튼을 gap 으로 나열한다. FormField ContentSlot 에 교체.
 *
 * 사용 패턴 (JSON options):
 *   <nds-selection-button-group value="always"
 *     options='[{"value":"always","label":"항상"},{"value":"time","label":"특정 시간만"}]'>
 *   </nds-selection-button-group>
 *
 * 또는 선언적 children (button[value], disabled):
 *   <nds-selection-button-group value="always">
 *     <button value="always">항상</button>
 *     <button value="time">특정 시간만</button>
 *   </nds-selection-button-group>
 *
 * 이벤트:
 *   사용자 선택 → host 의 `value` attribute 갱신 +
 *   "selection-button-change" CustomEvent (detail: { value }) 디스패치 (bubbles, composed).
 */

import { NdsElement, define } from "../base/nds-element.js";

const SBG_CLASS = "nds-selection-button-group";
const SBG_ROOT_CLASS = `${SBG_CLASS}__root`;
const SBG_ITEM_CLASS = `${SBG_CLASS}__item`;

interface SelectionButtonOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsSelectionButtonGroup extends NdsElement {
  static elementName = "nds-selection-button-group";

  static get observedAttributes(): readonly string[] {
    return ["value", "full-width", "disabled", "options", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _sourceOptions: SelectionButtonOption[] = [];

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._sourceOptions = this._readChildOptions();

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SBG_ROOT_CLASS;
    root.setAttribute("role", "radiogroup");
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const fullWidth = this.boolAttr("full-width");
    const disabled = this.boolAttr("disabled");
    const value = this.getAttribute("value") ?? "";
    const options = this._readOptions();

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

  private _readOptions(): SelectionButtonOption[] {
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

  private _readChildOptions(): SelectionButtonOption[] {
    const options: SelectionButtonOption[] = [];
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
    option: SelectionButtonOption,
    isSelected: boolean,
    groupDisabled: boolean,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = SBG_ITEM_CLASS;
    button.dataset.slot = "item";
    button.dataset.selected = isSelected ? "true" : "false";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", isSelected ? "true" : "false");
    button.textContent = option.label;

    const itemDisabled = groupDisabled || !!option.disabled;
    if (itemDisabled) button.disabled = true;

    button.addEventListener("click", () => {
      if (itemDisabled || isSelected) return;
      this._selectValue(option.value);
    });

    return button;
  }

  private _selectValue(value: string): void {
    if (this.getAttribute("value") === value) return;
    this.setAttribute("value", value);
    this.dispatchEvent(
      new CustomEvent("selection-button-change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

define(NdsSelectionButtonGroup);
