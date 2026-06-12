/**
 * <nds-text-button> — DS TextButton 의 vanilla Web Component 버전.
 */

import { createIconSvg, type VanillaIconName } from "@nudge-design/icons/vanilla";

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const TB_CLASS = "nds-text-button";
const TB_LABEL_CLASS = `${TB_CLASS}__label`;
const TB_ICON_CLASS = `${TB_CLASS}__icon`;

export type TextButtonSize = "large" | "medium";

const SIZE_CONFIG: Record<
  TextButtonSize,
  { fontSize: number; lineHeight: number; iconSize: number }
> = {
  large: { fontSize: 16, lineHeight: 24, iconSize: 16 },
  medium: { fontSize: 14, lineHeight: 20, iconSize: 16 },
};
const SIZES = Object.keys(SIZE_CONFIG) as TextButtonSize[];
const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "form",
  "name",
  "title",
  "type",
  "value",
] as const;

export class NdsTextButton extends NdsElement {
  static elementName = "nds-text-button";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-text-button"].observedAttributes, "label", "left-icon", "right-icon", "disabled", ...FORWARDED_ATTRS];
  }

  private _button: HTMLButtonElement | null = null;
  private _slotLabel = "";

  override connectedCallback(): void {
    if (!this._button) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // 슬롯 텍스트는 mount 시 1회만 캡처하고 host 에서 비운다.
    // (이후 update 가 host.textContent 를 다시 읽으면 렌더된 라벨까지 합산돼
    //  "라벨라벨" 로 중복되던 함정 — react 미러처럼 label attr | 슬롯 텍스트 1회만.)
    this._slotLabel = this.textContent?.trim() ?? "";
    this.textContent = "";
    const button = document.createElement("button");
    button.dataset.slot = "root";
    button.className = TB_CLASS;
    this.appendChild(button);
    this._button = button;
  }

  protected update(): void {
    if (!this._button) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const size = this._normalizedSize();
    const cfg = SIZE_CONFIG[size];
    this._button.dataset.size = size;
    this._button.disabled = this.boolAttr("disabled");
    this._button.style.setProperty("--nds-text-button-font-size", `${cfg.fontSize}px`);
    this._button.style.setProperty("--nds-text-button-line-height", `${cfg.lineHeight}px`);
    this._button.style.setProperty("--nds-text-button-icon-size", `${cfg.iconSize}px`);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._button.removeAttribute(name);
      else this._button.setAttribute(name, value);
    }
    if (!this._button.hasAttribute("type")) this._button.type = "button";

    this._button.replaceChildren(
      ...this._createIconSlot("left-icon"),
      this._createLabel(),
      ...this._createIconSlot("right-icon"),
    );
  }

  private _createLabel(): HTMLSpanElement {
    const label = document.createElement("span");
    label.dataset.slot = "label";
    label.className = TB_LABEL_CLASS;
    label.textContent = this.getAttribute("label") ?? this._slotLabel;
    return label;
  }

  private _createIconSlot(name: "left-icon" | "right-icon"): Node[] {
    const iconName = this.getAttribute(name);
    if (!iconName) return [];
    const slot = document.createElement("span");
    slot.dataset.slot = name;
    slot.className = TB_ICON_CLASS;
    slot.setAttribute("aria-hidden", "true");
    slot.appendChild(createSafeIcon(iconName, 16));
    return [slot];
  }

  private _normalizedSize(): TextButtonSize {
    const value = this.attr("size", "medium");
    return (SIZES as readonly string[]).includes(value) ? (value as TextButtonSize) : "medium";
  }
}

function createSafeIcon(name: string, size: number): SVGSVGElement {
  try {
    return createIconSvg(name as VanillaIconName, { size });
  } catch {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 24 24");
    return svg;
  }
}

define(NdsTextButton);
