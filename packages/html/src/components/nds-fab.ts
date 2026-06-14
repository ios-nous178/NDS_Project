/**
 * <nds-fab> — DS FAB 의 vanilla Web Component 버전.
 */

import { createIconSvg, type VanillaIconName } from "@nudge-design/icons/vanilla";

import { NdsElement, define } from "../base/nds-element.js";

const FB_CLASS = "nds-fab";
const FB_LABEL_CLASS = `${FB_CLASS}__label`;
const FB_ICON_CLASS = `${FB_CLASS}__icon`;

export type FABSize = "md" | "lg";
export type FABColor = "primary" | "neutral" | "secondary";
export type FABPosition = "bottom-right" | "bottom-left" | "bottom-center" | "static";

const SIZE_CONFIG: Record<FABSize, number> = { md: 48, lg: 56 };
// color → bg/fg 색은 styles 의 [data-color] 룰이 결정한다(JS 색맵 우회 금지). 여기선 data-color 만 set.
const POSITIONS: readonly FABPosition[] = [
  "bottom-right",
  "bottom-left",
  "bottom-center",
  "static",
];
const COLORS: readonly FABColor[] = ["primary", "neutral", "secondary"];
const SIZES = Object.keys(SIZE_CONFIG) as FABSize[];
const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "form",
  "name",
  "title",
  "value",
] as const;

export class NdsFab extends NdsElement {
  static elementName = "nds-fab";

  static get observedAttributes(): readonly string[] {
    return ["icon", "label", "color", "size", "position", "offset", "disabled", ...FORWARDED_ATTRS];
  }

  private _button: HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._button) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.slot = "root";
    button.className = FB_CLASS;
    this.appendChild(button);
    this._button = button;
  }

  protected update(): void {
    if (!this._button) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const size = this._normalizedSize();
    const color = this._normalizedColor();
    const position = this._normalizedPosition();
    const labelText = this.getAttribute("label") ?? this.textContent?.trim() ?? "";

    this._button.disabled = this.boolAttr("disabled");
    this._button.dataset.size = size;
    this._button.dataset.color = color;
    this._button.dataset.position = position;
    this._button.style.setProperty("--nds-fab-size", `${SIZE_CONFIG[size]}px`);
    this._button.style.setProperty("--nds-fab-padding", labelText ? "16px" : "0");
    setOptionalPxVar(this._button, "--nds-fab-offset", this.getAttribute("offset"));

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._button.removeAttribute(name);
      else this._button.setAttribute(name, value);
    }
    if (!labelText && !this._button.hasAttribute("aria-label")) {
      this._button.setAttribute("aria-label", this.attr("icon", "PlusIcon"));
    }

    this._button.replaceChildren(this._createIcon(), ...this._createLabel(labelText));
  }

  private _createIcon(): HTMLSpanElement {
    const slot = document.createElement("span");
    slot.className = FB_ICON_CLASS;
    slot.setAttribute("aria-hidden", "true");
    slot.appendChild(createSafeIcon(this.attr("icon", "PlusIcon"), 24));
    return slot;
  }

  private _createLabel(labelText: string): Node[] {
    if (!labelText) return [];
    const label = document.createElement("span");
    label.className = FB_LABEL_CLASS;
    label.textContent = labelText;
    return [label];
  }

  private _normalizedSize(): FABSize {
    const value = this.attr("size", "md");
    return (SIZES as readonly string[]).includes(value) ? (value as FABSize) : "md";
  }

  private _normalizedColor(): FABColor {
    const value = this.attr("color", "primary");
    return (COLORS as readonly string[]).includes(value) ? (value as FABColor) : "primary";
  }

  private _normalizedPosition(): FABPosition {
    const value = this.attr("position", "bottom-right");
    return (POSITIONS as readonly string[]).includes(value)
      ? (value as FABPosition)
      : "bottom-right";
  }
}

function setOptionalPxVar(el: HTMLElement, name: string, value: string | null): void {
  if (value === null || value.trim() === "") {
    el.style.removeProperty(name);
    return;
  }
  const num = Number(value);
  el.style.setProperty(name, Number.isFinite(num) ? `${num}px` : value);
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

define(NdsFab);
