/**
 * <nds-selection-button> — DS SelectionButton 의 vanilla Web Component 버전 (단일 버튼).
 *
 * 보통 <nds-selection-button-group> 으로 묶지만, 토글 한 개·커스텀 레이아웃이 필요할 때
 * 단독으로 쓴다. 그룹과 동일한 nds-selection-button-group__item 비주얼을 공유한다.
 * 선택은 외부 제어 — `selected` 속성으로 상태를 받고, 네이티브 click 으로 변경을 처리한다.
 *
 * 사용 예:
 *   <nds-selection-button selected>항상</nds-selection-button>
 *   <nds-selection-button>특정 시간만</nds-selection-button>
 */

import { NdsElement, define } from "../base/nds-element.js";

const SBG_CLASS = "nds-selection-button-group";
const SBG_ITEM_CLASS = `${SBG_CLASS}__item`;
const SBG_LABEL_CLASS = `${SBG_CLASS}__label`;

export class NdsSelectionButton extends NdsElement {
  static elementName = "nds-selection-button";

  static get observedAttributes(): readonly string[] {
    return ["selected", "disabled"];
  }

  private _button: HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._button) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const button = document.createElement("button");
    button.type = "button";
    button.className = SBG_ITEM_CLASS;
    button.dataset.slot = "item";
    button.setAttribute("role", "radio");

    const label = document.createElement("span");
    label.className = SBG_LABEL_CLASS;
    while (this.firstChild) label.appendChild(this.firstChild);
    button.appendChild(label);

    this.appendChild(button);
    this._button = button;
  }

  protected update(): void {
    if (!this._button) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const selected = this.boolAttr("selected");
    const disabled = this.boolAttr("disabled");
    this._button.dataset.selected = selected ? "true" : "false";
    this._button.setAttribute("aria-checked", selected ? "true" : "false");
    this._button.disabled = disabled;
  }
}

define(NdsSelectionButton);
