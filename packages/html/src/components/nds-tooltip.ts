/**
 * <nds-tooltip> — DS Tooltip 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";

const TT_CLASS = "nds-tooltip";
const TT_TRIGGER_CLASS = `${TT_CLASS}__trigger`;
const TT_CONTENT_CLASS = `${TT_CLASS}__content`;
const TT_ARROW_CLASS = `${TT_CLASS}__arrow`;

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

const PLACEMENTS: readonly TooltipPlacement[] = ["top", "bottom", "left", "right"];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsTooltip extends NdsElement {
  static elementName = "nds-tooltip";

  static get observedAttributes(): readonly string[] {
    return ["content", "trigger-label", "placement", "open", "disabled", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open") && !this.boolAttr("disabled");
    const trigger = document.createElement("span");
    trigger.dataset.slot = "trigger";
    trigger.className = TT_TRIGGER_CLASS;
    trigger.textContent = this.attr("trigger-label", "");

    const id = this.id ? `${this.id}-tooltip` : "nds-tooltip-content";
    if (open) trigger.setAttribute("aria-describedby", id);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren(trigger, ...this._createContent(open, id));
  }

  private _createContent(open: boolean, id: string): Node[] {
    if (!open) return [];
    const content = document.createElement("div");
    content.dataset.slot = "content";
    content.dataset.placement = this._normalizedPlacement();
    content.id = id;
    content.role = "tooltip";
    content.className = TT_CONTENT_CLASS;
    content.textContent = this.attr("content", "");

    const arrow = document.createElement("span");
    arrow.className = TT_ARROW_CLASS;
    content.appendChild(arrow);
    return [content];
  }

  private _normalizedPlacement(): TooltipPlacement {
    const value = this.attr("placement", "top");
    return (PLACEMENTS as readonly string[]).includes(value) ? (value as TooltipPlacement) : "top";
  }
}

define(NdsTooltip);
