/**
 * <nds-add-button> — DS AddButton 의 vanilla Web Component 버전.
 *
 * 폼 안에서 "항목 추가"(지역/옵션/행)를 유도하는 점선 affordance 버튼.
 *
 * 사용 패턴:
 *   <nds-add-button label="지역 추가"></nds-add-button>
 *   <nds-add-button label="지역 추가" error></nds-add-button>   <!-- 빨간 실선 강조 -->
 *
 * 이벤트: 네이티브 button 이므로 click 이 그대로 버블링된다.
 */

import { NdsElement, define } from "../base/nds-element.js";

const AB_CLASS = "nds-add-button";
const AB_ICON_CLASS = `${AB_CLASS}__icon`;
const AB_LABEL_CLASS = `${AB_CLASS}__label`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "form", "name", "type"] as const;

const PLUS_SVG =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
  '<path d="M9 3.75v10.5M3.75 9h10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
  "</svg>";

export class NdsAddButton extends NdsElement {
  static elementName = "nds-add-button";

  static get observedAttributes(): readonly string[] {
    return ["label", "error", "full-width", "disabled", ...FORWARDED_ATTRS];
  }

  private _button: HTMLButtonElement | null = null;
  private _icon: HTMLSpanElement | null = null;
  private _label: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._button) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const button = document.createElement("button");
    button.dataset.slot = "root";
    button.className = AB_CLASS;

    const icon = document.createElement("span");
    icon.className = AB_ICON_CLASS;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = PLUS_SVG;

    const label = document.createElement("span");
    label.className = AB_LABEL_CLASS;

    button.append(icon, label);
    this.appendChild(button);

    this._button = button;
    this._icon = icon;
    this._label = label;
  }

  protected update(): void {
    if (!this._button || !this._label) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const error = this.boolAttr("error");
    const fullWidth = this.attr("full-width", "true") !== "false";

    this._button.disabled = this.boolAttr("disabled");
    this._button.dataset.error = error ? "true" : "false";
    this._button.dataset.fullwidth = fullWidth ? "true" : "false";
    if (error) this._button.setAttribute("aria-invalid", "true");
    else this._button.removeAttribute("aria-invalid");

    this._label.textContent = this.getAttribute("label") ?? this.textContent?.trim() ?? "";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._button.removeAttribute(name);
      else this._button.setAttribute(name, value);
    }
    if (!this._button.hasAttribute("type")) this._button.type = "button";
  }
}

define(NdsAddButton);
