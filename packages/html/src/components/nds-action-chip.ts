/**
 * <nds-action-chip> — DS ActionChip 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-action-chip label="필터 추가"></nds-action-chip>
 *
 *   아이콘과 함께:
 *     <nds-action-chip label="필터 추가">
 *       <svg slot="icon" ...></svg>
 *     </nds-action-chip>
 *
 *   라벨도 자식으로 전달 가능:
 *     <nds-action-chip>필터 추가</nds-action-chip>
 *
 * 클릭 이벤트는 내부 <button> 의 기본 동작을 따른다 (host 의 click 으로 bubbling).
 */

import { NdsElement, define } from "../base/nds-element.js";

const AC_ROOT_CLASS = "nds-action-chip";
const AC_ICON_CLASS = `${AC_ROOT_CLASS}__icon`;
const AC_LABEL_CLASS = `${AC_ROOT_CLASS}__label`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title", "name", "value"] as const;

export class NdsActionChip extends NdsElement {
  static elementName = "nds-action-chip";

  static get observedAttributes(): readonly string[] {
    return ["label", "disabled", ...FORWARDED_ATTRS];
  }

  private _button: HTMLButtonElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _iconEl: HTMLSpanElement | null = null;
  private _iconSource: Node | null = null;
  private _slotLabelText = "";

  override connectedCallback(): void {
    if (!this._button) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // 자식에서 icon slot 노드 1개 + 라벨 텍스트 추출. SVG 도 지원 (Element 검사).
    for (const node of Array.from(this.childNodes)) {
      if (node instanceof Element && node.getAttribute("slot") === "icon") {
        this._iconSource = node;
        continue;
      }
      const text = node.textContent?.trim() ?? "";
      if (text && !this._slotLabelText) this._slotLabelText = text;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = AC_ROOT_CLASS;
    button.dataset.slot = "root";

    const label = document.createElement("span");
    label.className = AC_LABEL_CLASS;
    label.dataset.slot = "label";
    button.appendChild(label);

    this.replaceChildren(button);
    this._button = button;
    this._labelEl = label;

    if (this._iconSource) this._ensureIcon();
  }

  protected update(): void {
    if (!this._button || !this._labelEl) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const disabled = this.boolAttr("disabled");
    this._button.disabled = disabled;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._button.removeAttribute(name);
      else this._button.setAttribute(name, value);
    }

    const labelText = this.getAttribute("label") ?? this._slotLabelText;
    this._labelEl.textContent = labelText;
  }

  private _ensureIcon(): void {
    if (!this._button || !this._iconSource || this._iconEl) return;
    const icon = document.createElement("span");
    icon.className = AC_ICON_CLASS;
    icon.dataset.slot = "icon";
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(this._iconSource);
    this._button.prepend(icon);
    this._iconEl = icon;
  }
}

define(NdsActionChip);
