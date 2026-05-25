/**
 * <nds-pagination> — DS Pagination 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";

const PG_CLASS = "nds-pagination";
const PG_ITEM_CLASS = `${PG_CLASS}__item`;
const PG_ELLIPSIS_CLASS = `${PG_CLASS}__ellipsis`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsPagination extends NdsElement {
  static elementName = "nds-pagination";

  static get observedAttributes(): readonly string[] {
    return ["page", "total-pages", "siblings", "show-arrows", ...FORWARDED_ATTRS];
  }

  private _root: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("nav");
    root.dataset.slot = "root";
    root.className = PG_CLASS;
    root.setAttribute("aria-label", "페이지 네비게이션");
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const page = this._clampedPage();
    const totalPages = this._positiveIntAttr("total-pages", 0);
    const siblings = this._positiveIntAttr("siblings", 1);
    const showArrows = this._boolAttrDefaultTrue("show-arrows");

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }
    if (!this._root.hasAttribute("aria-label") && !this._root.hasAttribute("aria-labelledby")) {
      this._root.setAttribute("aria-label", "페이지 네비게이션");
    }

    if (totalPages <= 0) {
      this._root.replaceChildren();
      return;
    }

    const children: Node[] = [];
    if (showArrows) {
      children.push(this._createArrow("prev", page <= 1, page - 1));
    }
    for (const item of getPageRange(page, totalPages, siblings)) {
      children.push(
        item === "ellipsis" ? createEllipsis() : this._createPageButton(item, item === page),
      );
    }
    if (showArrows) {
      children.push(this._createArrow("next", page >= totalPages, page + 1));
    }
    this._root.replaceChildren(...children);
  }

  private _createPageButton(page: number, active: boolean): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = PG_ITEM_CLASS;
    button.textContent = String(page);
    button.setAttribute("aria-label", `${page} 페이지`);
    if (active) {
      button.dataset.active = "true";
      button.setAttribute("aria-current", "page");
    }
    button.addEventListener("click", () => this._emitPageChange(page));
    return button;
  }

  private _createArrow(type: "prev" | "next", disabled: boolean, page: number): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = PG_ITEM_CLASS;
    button.dataset.type = "arrow";
    button.disabled = disabled;
    button.setAttribute("aria-label", type === "prev" ? "이전 페이지" : "다음 페이지");
    button.appendChild(type === "prev" ? createChevronLeft() : createChevronRight());
    button.addEventListener("click", () => this._emitPageChange(page));
    return button;
  }

  private _emitPageChange(page: number): void {
    const totalPages = this._positiveIntAttr("total-pages", 0);
    const current = this._clampedPage();
    if (page < 1 || page > totalPages || page === current) return;
    this.setAttribute("page", String(page));
    this.dispatchEvent(new CustomEvent("nds-page-change", { detail: { page }, bubbles: true }));
  }

  private _clampedPage(): number {
    const totalPages = this._positiveIntAttr("total-pages", 0);
    const page = this._positiveIntAttr("page", 1);
    if (totalPages <= 0) return page;
    return Math.min(Math.max(page, 1), totalPages);
  }

  private _positiveIntAttr(name: string, defaultValue: number): number {
    const value = Number(this.getAttribute(name));
    if (!Number.isFinite(value)) return defaultValue;
    return Math.max(0, Math.floor(value));
  }

  private _boolAttrDefaultTrue(name: string): boolean {
    const value = this.getAttribute(name);
    if (value === null) return true;
    return value !== "false";
  }
}

function getPageRange(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  const totalNumbers = siblings * 2 + 5;
  if (total <= totalNumbers) return Array.from({ length: total }, (_, i) => i + 1);

  const leftSibIdx = Math.max(current - siblings, 1);
  const rightSibIdx = Math.min(current + siblings, total);
  const showLeftEllipsis = leftSibIdx > 2;
  const showRightEllipsis = rightSibIdx < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = siblings * 2 + 3;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, "ellipsis", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = siblings * 2 + 3;
    const rightRange = Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1);
    return [1, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibIdx - leftSibIdx + 1 },
    (_, i) => leftSibIdx + i,
  );
  return [1, "ellipsis", ...middleRange, "ellipsis", total];
}

function createEllipsis(): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = PG_ELLIPSIS_CLASS;
  span.setAttribute("aria-hidden", "true");
  span.textContent = "···";
  return span;
}

function createChevronLeft(): SVGSVGElement {
  return createChevron("M10 12L6 8L10 4");
}

function createChevronRight(): SVGSVGElement {
  return createChevron("M6 4L10 8L6 12");
}

function createChevron(d: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

define(NdsPagination);
