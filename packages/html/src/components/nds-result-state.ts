/**
 * <nds-result-state> — DS ResultState 의 vanilla Web Component 버전.
 *
 * Flat API:
 *   <nds-result-state title="내역이 없어요" description="조건을 바꿔 다시 확인해 주세요"></nds-result-state>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const EMPTY_CLASS = "nds-result-state";
const EMPTY_ROOT_CLASS = `${EMPTY_CLASS}__root`;
const EMPTY_ICON_CLASS = `${EMPTY_CLASS}__icon`;
const EMPTY_TITLE_CLASS = `${EMPTY_CLASS}__title`;
const EMPTY_DESC_CLASS = `${EMPTY_CLASS}__description`;
const EMPTY_ACTION_CLASS = `${EMPTY_CLASS}__action`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsResultState extends NdsElement {
  static elementName = "nds-result-state";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-result-state"].observedAttributes, "action", "hide-icon", ...FORWARDED_ATTRS];
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

    this._root.dataset.status = this._status();

    const minHeight = this._dimensionAttr("min-height");
    if (minHeight === undefined) this._root.style.removeProperty("--nds-result-state-min-height");
    else this._root.style.setProperty("--nds-result-state-min-height", minHeight);

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

  private _status(): ResultStateStatus {
    const raw = this.getAttribute("status");
    return raw && (STATUS_PATHS as Record<string, unknown>)[raw]
      ? (raw as ResultStateStatus)
      : "empty";
  }

  private _createIcon(): HTMLDivElement {
    const icon = document.createElement("div");
    icon.dataset.slot = "icon";
    icon.className = EMPTY_ICON_CLASS;
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(createStatusIcon(this._status()));
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

/* ─── status 글리프 (react STATUS_ICONS 미러 · currentColor) ─── */

type ResultStateStatus = "empty" | "success" | "error" | "info";

const SVG_NS = "http://www.w3.org/2000/svg";

/** path 의 d, fill 여부, stroke-width, dasharray 를 선언적으로 표현 */
type Shape = { tag: "circle" | "path"; attrs: Record<string, string> };

const STATUS_PATHS: Record<ResultStateStatus, Shape[]> = {
  empty: [
    { tag: "circle", attrs: { cx: "32", cy: "32", r: "30", "stroke-width": "2", "stroke-dasharray": "4 4" } },
    { tag: "path", attrs: { d: "M22 32H42", "stroke-width": "2", "stroke-linecap": "round" } },
    { tag: "path", attrs: { d: "M32 22V42", "stroke-width": "2", "stroke-linecap": "round" } },
  ],
  success: [
    { tag: "circle", attrs: { cx: "32", cy: "32", r: "30", "stroke-width": "2" } },
    { tag: "path", attrs: { d: "M21 33l8 8 14-16", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round" } },
  ],
  error: [
    { tag: "circle", attrs: { cx: "32", cy: "32", r: "30", "stroke-width": "2" } },
    { tag: "path", attrs: { d: "M24 24l16 16M40 24L24 40", "stroke-width": "2.5", "stroke-linecap": "round" } },
  ],
  info: [
    { tag: "circle", attrs: { cx: "32", cy: "32", r: "30", "stroke-width": "2" } },
    { tag: "circle", attrs: { cx: "32", cy: "21", r: "2.4", fill: "currentColor" } },
    { tag: "path", attrs: { d: "M32 29v16", "stroke-width": "2.5", "stroke-linecap": "round" } },
  ],
};

function createStatusIcon(status: ResultStateStatus): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", SVG_NS);
  for (const { tag, attrs } of STATUS_PATHS[status]) {
    const el = document.createElementNS(SVG_NS, tag);
    if (!("fill" in attrs)) el.setAttribute("stroke", "currentColor");
    for (const [k, val] of Object.entries(attrs)) el.setAttribute(k, val);
    svg.appendChild(el);
  }
  return svg;
}

define(NdsResultState);
