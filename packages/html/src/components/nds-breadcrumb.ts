/**
 * <nds-breadcrumb> — DS Breadcrumb 의 vanilla Web Component 버전.
 *
 * 자식 anchor / span 을 받거나, items JSON 속성을 받는다.
 *
 * 사용 예 (마크업):
 *   <nds-breadcrumb>
 *     <a href="/">홈</a>
 *     <a href="/care">케어</a>
 *     <span>상담</span>
 *   </nds-breadcrumb>
 *
 * 사용 예 (속성):
 *   <nds-breadcrumb items='[{"label":"홈","href":"/"},{"label":"설정","href":"/settings"}]'>
 *   </nds-breadcrumb>
 *
 * 마지막 item 은 자동으로 data-current="true" + aria-current="page".
 * <nds-breadcrumb-item> 은 호환용 wrapper.
 */

import { NdsElement, define } from "../base/nds-element.js";

const BC_CLASS = "nds-breadcrumb";
const BC_ITEM_CLASS = `${BC_CLASS}__item`;
const BC_SEPARATOR_CLASS = `${BC_CLASS}__separator`;

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

const ChevronSeparator = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "12");
  svg.setAttribute("viewBox", "0 0 12 12");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />`;
  return svg;
};

/* ──────────────── <nds-breadcrumb> ──────────────── */

export class NdsBreadcrumb extends NdsElement {
  static elementName = "nds-breadcrumb";

  static get observedAttributes(): readonly string[] {
    return ["items", "separator"];
  }

  private _nav: HTMLElement | null = null;
  private _ol: HTMLOListElement | null = null;
  private _savedChildren: Node[] | null = null;

  override connectedCallback(): void {
    if (!this._nav) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // Snapshot children before we mutate the DOM, so we can re-derive items
    // on every update (children would otherwise be moved into the list).
    this._savedChildren = Array.from(this.childNodes);
    while (this.firstChild) this.removeChild(this.firstChild);

    const nav = document.createElement("nav");
    nav.dataset.slot = "root";
    nav.setAttribute("aria-label", "경로");
    nav.className = BC_CLASS;

    const ol = document.createElement("ol");
    ol.style.display = "contents";
    ol.style.listStyle = "none";
    ol.style.margin = "0";
    ol.style.padding = "0";

    nav.appendChild(ol);
    this.appendChild(nav);
    this._nav = nav;
    this._ol = ol;
  }

  private _itemsFromAttr(): BreadcrumbItemData[] | null {
    const raw = this.getAttribute("items");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed
        .filter((it) => it && typeof it === "object" && typeof it.label === "string")
        .map((it) => ({ label: String(it.label), href: it.href ? String(it.href) : undefined }));
    } catch {
      return null;
    }
  }

  private _itemsFromChildren(): BreadcrumbItemData[] {
    const nodes = this._savedChildren ?? [];
    const items: BreadcrumbItemData[] = [];
    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) continue;
      const tag = node.tagName.toLowerCase();
      if (tag === "a") {
        const href = (node as HTMLAnchorElement).getAttribute("href") || undefined;
        items.push({ label: node.textContent || "", href });
      } else if (tag === "span" || tag === "nds-breadcrumb-item") {
        const href = node.getAttribute("href") || undefined;
        items.push({ label: node.textContent || "", href });
      }
    }
    return items;
  }

  protected update(): void {
    if (!this._nav || !this._ol) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const items = this._itemsFromAttr() ?? this._itemsFromChildren();
    const separatorText = this.getAttribute("separator");

    this._ol.innerHTML = "";

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.style.display = "contents";

      if (index > 0) {
        const sep = document.createElement("span");
        sep.dataset.slot = "separator";
        sep.className = BC_SEPARATOR_CLASS;
        sep.setAttribute("aria-hidden", "true");
        if (separatorText) {
          sep.textContent = separatorText;
        } else {
          sep.appendChild(ChevronSeparator());
        }
        li.appendChild(sep);
      }

      const isLast = index === items.length - 1;
      const wantAnchor = !!item.href && !isLast;
      const wrapper = document.createElement(wantAnchor ? "a" : "span");
      wrapper.className = BC_ITEM_CLASS;
      wrapper.dataset.slot = "item";
      if (wantAnchor) (wrapper as HTMLAnchorElement).href = item.href!;
      wrapper.textContent = item.label;

      if (isLast) {
        wrapper.dataset.current = "true";
        wrapper.setAttribute("aria-current", "page");
      }

      li.appendChild(wrapper);
      this._ol!.appendChild(li);
    });
  }
}

/* ──────────────── <nds-breadcrumb-item> (호환용) ──────────────── */

export class NdsBreadcrumbItem extends NdsElement {
  static elementName = "nds-breadcrumb-item";

  protected update(): void {
    // No-op: 부모 <nds-breadcrumb> 가 이 element 의 attribute/textContent 를
    // 읽어서 직접 li 를 생성한다. 자체 DOM 은 만들지 않는다.
    if (this.style.display !== "none") this.style.display = "none";
  }
}

define(NdsBreadcrumb);
define(NdsBreadcrumbItem);
