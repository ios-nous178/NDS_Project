/**
 * <nds-breadcrumb> — DS Breadcrumb 의 vanilla Web Component 버전.
 *
 * 권장 HTML:
 *   <nds-breadcrumb>
 *     <a href="/">홈</a>
 *     <a href="/health">건강</a>
 *     <span>상담</span>
 *   </nds-breadcrumb>
 */

import { NdsElement, define } from "../base/nds-element.js";

const BC_CLASS = "nds-breadcrumb";
const BC_ITEM_CLASS = `${BC_CLASS}__item`;
const BC_SEPARATOR_CLASS = `${BC_CLASS}__separator`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsBreadcrumb extends NdsElement {
  static elementName = "nds-breadcrumb";

  static get observedAttributes(): readonly string[] {
    return ["items", "separator", ...FORWARDED_ATTRS];
  }

  private _nav: HTMLElement | null = null;
  private _sourceNodes: Node[] = [];

  override connectedCallback(): void {
    if (!this._nav) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._sourceNodes = Array.from(this.childNodes);
    const nav = document.createElement("nav");
    nav.dataset.slot = "root";
    nav.className = BC_CLASS;
    this.replaceChildren(nav);
    this._nav = nav;
  }

  protected update(): void {
    if (!this._nav) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    this._nav.setAttribute("aria-label", this.getAttribute("aria-label") ?? "경로");
    for (const name of FORWARDED_ATTRS) {
      if (name === "aria-label") continue;
      const value = this.getAttribute(name);
      if (value === null) this._nav.removeAttribute(name);
      else this._nav.setAttribute(name, value);
    }

    const items = this._readItems();
    this._nav.replaceChildren(this._renderList(items));
  }

  private _readItems(): BreadcrumbItem[] {
    const attr = this.getAttribute("items");
    if (attr && attr.trim()) {
      try {
        const parsed = JSON.parse(attr) as Array<{ label?: unknown; href?: unknown }>;
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => ({
              label: typeof item.label === "string" ? item.label : "",
              href: typeof item.href === "string" ? item.href : undefined,
            }))
            .filter((item) => item.label);
        }
      } catch {
        return attr
          .split("/")
          .map((label) => ({ label: label.trim() }))
          .filter((item) => item.label);
      }
    }

    const items: BreadcrumbItem[] = [];
    for (const node of this._sourceNodes) {
      const text = node.textContent?.trim() ?? "";
      if (!text) continue;
      const href =
        node instanceof HTMLAnchorElement ? (node.getAttribute("href") ?? undefined) : undefined;
      items.push({ label: text, href });
    }
    return items;
  }

  private _renderList(items: BreadcrumbItem[]): HTMLOListElement {
    const ol = document.createElement("ol");
    ol.style.display = "contents";
    ol.style.listStyle = "none";
    ol.style.margin = "0";
    ol.style.padding = "0";

    items.forEach((item, index) => {
      const isCurrent = index === items.length - 1;
      const li = document.createElement("li");
      li.style.display = "contents";

      if (index > 0) li.appendChild(this._createSeparator());
      li.appendChild(this._createItem(item, isCurrent));
      ol.appendChild(li);
    });

    return ol;
  }

  private _createItem(item: BreadcrumbItem, isCurrent: boolean): HTMLElement {
    const el =
      item.href && !isCurrent ? document.createElement("a") : document.createElement("span");
    el.dataset.slot = "item";
    el.className = BC_ITEM_CLASS;
    el.textContent = item.label;
    if (item.href && !isCurrent && el instanceof HTMLAnchorElement) {
      el.href = item.href;
    }
    if (isCurrent) {
      el.dataset.current = "true";
      el.setAttribute("aria-current", "page");
    }
    return el;
  }

  private _createSeparator(): HTMLSpanElement {
    const sep = document.createElement("span");
    sep.dataset.slot = "separator";
    sep.className = BC_SEPARATOR_CLASS;
    sep.setAttribute("aria-hidden", "true");
    const text = this.getAttribute("separator");
    if (text) sep.textContent = text;
    else sep.appendChild(createChevronSeparator());
    return sep;
  }
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function createChevronSeparator(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "12");
  svg.setAttribute("viewBox", "0 0 12 12");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4.5 2.5L7.5 6L4.5 9.5");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

define(NdsBreadcrumb);
