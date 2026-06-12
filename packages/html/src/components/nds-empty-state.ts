/**
 * <nds-empty-state> — DS EmptyState 의 vanilla Web Component 버전.
 *
 * Flat API:
 *   <nds-empty-state title="내역이 없어요" description="조건을 바꿔 다시 확인해 주세요"></nds-empty-state>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const EMPTY_CLASS = "nds-empty-state";
const EMPTY_ROOT_CLASS = `${EMPTY_CLASS}__root`;
const EMPTY_ICON_CLASS = `${EMPTY_CLASS}__icon`;
const EMPTY_TITLE_CLASS = `${EMPTY_CLASS}__title`;
const EMPTY_DESC_CLASS = `${EMPTY_CLASS}__description`;
const EMPTY_ACTION_CLASS = `${EMPTY_CLASS}__action`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsEmptyState extends NdsElement {
  static elementName = "nds-empty-state";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-empty-state"].observedAttributes, "action", "hide-icon", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _actionNodes: Node[] = [];

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._actionNodes = Array.from(this.childNodes);
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = EMPTY_ROOT_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    this._root.replaceChildren();

    const minHeight = this._dimensionAttr("min-height");
    if (minHeight === undefined) this._root.style.removeProperty("--nds-empty-state-min-height");
    else this._root.style.setProperty("--nds-empty-state-min-height", minHeight);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    if (!this.boolAttr("hide-icon")) this._root.appendChild(this._createIcon());

    const title = this.getAttribute("title");
    if (title) this._root.appendChild(this._createTitle(title));

    const description = this.getAttribute("description");
    if (description) this._root.appendChild(this._createDescription(description));

    const actionText = this.getAttribute("action");
    if (actionText || this._actionNodes.length > 0) {
      this._root.appendChild(this._createAction(actionText));
    }
  }

  private _createIcon(): HTMLDivElement {
    const icon = document.createElement("div");
    icon.dataset.slot = "icon";
    icon.className = EMPTY_ICON_CLASS;
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(createDefaultEmptyIcon());
    return icon;
  }

  private _createTitle(text: string): HTMLHeadingElement {
    const title = document.createElement("h3");
    title.dataset.slot = "title";
    title.className = EMPTY_TITLE_CLASS;
    title.textContent = text;
    return title;
  }

  private _createDescription(text: string): HTMLParagraphElement {
    const desc = document.createElement("p");
    desc.dataset.slot = "description";
    desc.className = EMPTY_DESC_CLASS;
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      if (index > 0) desc.appendChild(document.createElement("br"));
      desc.append(line);
    });
    return desc;
  }

  private _createAction(actionText: string | null): HTMLDivElement {
    const action = document.createElement("div");
    action.dataset.slot = "action";
    action.className = EMPTY_ACTION_CLASS;
    if (actionText) action.textContent = actionText;
    else action.append(...this._actionNodes.map((node) => node.cloneNode(true)));
    return action;
  }

  private _dimensionAttr(name: string): string | undefined {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return undefined;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return `${parsed}px`;
    return value;
  }
}

function createDefaultEmptyIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "32");
  circle.setAttribute("cy", "32");
  circle.setAttribute("r", "30");
  circle.setAttribute("stroke", "currentColor");
  circle.setAttribute("stroke-width", "2");
  circle.setAttribute("stroke-dasharray", "4 4");
  svg.appendChild(circle);

  const horizontal = document.createElementNS("http://www.w3.org/2000/svg", "path");
  horizontal.setAttribute("d", "M22 32H42");
  horizontal.setAttribute("stroke", "currentColor");
  horizontal.setAttribute("stroke-width", "2");
  horizontal.setAttribute("stroke-linecap", "round");
  svg.appendChild(horizontal);

  const vertical = document.createElementNS("http://www.w3.org/2000/svg", "path");
  vertical.setAttribute("d", "M32 22V42");
  vertical.setAttribute("stroke", "currentColor");
  vertical.setAttribute("stroke-width", "2");
  vertical.setAttribute("stroke-linecap", "round");
  svg.appendChild(vertical);

  return svg;
}

define(NdsEmptyState);
