/**
 * <nds-stat-card> — DS StatCard 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";

const ST_CLASS = "nds-stat-card";
const ST_HEADER_CLASS = `${ST_CLASS}__header`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_ICON_CLASS = `${ST_CLASS}__icon`;
const ST_VALUE_ROW_CLASS = `${ST_CLASS}__value-row`;
const ST_VALUE_CLASS = `${ST_CLASS}__value`;
const ST_UNIT_CLASS = `${ST_CLASS}__unit`;
const ST_DELTA_CLASS = `${ST_CLASS}__delta`;
const ST_FOOTER_CLASS = `${ST_CLASS}__footer`;
const ST_DESC_CLASS = `${ST_CLASS}__desc`;

export type StatCardTrend = "up" | "down" | "flat";

const TRENDS: readonly StatCardTrend[] = ["up", "down", "flat"];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsStatCard extends NdsElement {
  static elementName = "nds-stat-card";

  static get observedAttributes(): readonly string[] {
    return [
      "label",
      "value",
      "unit",
      "icon",
      "delta",
      "trend",
      "description",
      "clickable",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = ST_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const clickable = this.boolAttr("clickable");
    const trend = this._normalizedTrend();
    this._root.dataset.clickable = clickable ? "true" : "false";
    if (clickable) {
      this._root.setAttribute("role", "button");
      this._root.tabIndex = 0;
    } else {
      this._root.removeAttribute("role");
      this._root.removeAttribute("tabindex");
    }

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren(
      this._createHeader(),
      this._createValueRow(),
      ...this._createFooter(trend),
    );
  }

  private _createHeader(): HTMLDivElement {
    const header = document.createElement("div");
    header.className = ST_HEADER_CLASS;
    // icon 속성 = inline SVG 마크업 (find_icon 결과). React StatCard 의 icon?:ReactNode 와 대칭.
    // 이름/이모지를 넣으면 그대로 텍스트로 흘러나오므로 innerHTML 로 SVG 를 주입한다. (nds-sidebar 와 동일 규약)
    const iconSvg = this.getAttribute("icon");
    if (iconSvg) {
      const icon = document.createElement("span");
      icon.className = ST_ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = iconSvg;
      header.appendChild(icon);
    }
    header.appendChild(createSpan(ST_LABEL_CLASS, this.attr("label", "")));
    return header;
  }

  private _createValueRow(): HTMLDivElement {
    const row = document.createElement("div");
    row.className = ST_VALUE_ROW_CLASS;
    const valueWrap = document.createElement("div");
    valueWrap.className = ST_VALUE_CLASS;
    const strong = document.createElement("strong");
    strong.textContent = this.attr("value", "");
    valueWrap.appendChild(strong);
    const unit = this.getAttribute("unit");
    if (unit) valueWrap.appendChild(createSpan(ST_UNIT_CLASS, unit));
    row.appendChild(valueWrap);
    return row;
  }

  private _createFooter(trend: StatCardTrend): Node[] {
    const delta = this.getAttribute("delta");
    const description = this.getAttribute("description");
    if (delta === null && !description) return [];
    const footer = document.createElement("div");
    footer.className = ST_FOOTER_CLASS;
    if (delta !== null) {
      const deltaEl = createSpan(ST_DELTA_CLASS, delta);
      deltaEl.dataset.trend = trend;
      if (trend !== "flat") deltaEl.prepend(createTrendArrow(trend));
      footer.appendChild(deltaEl);
    }
    if (description) {
      const desc = document.createElement("p");
      desc.className = ST_DESC_CLASS;
      desc.textContent = description;
      if (delta !== null) desc.style.marginTop = "4px";
      footer.appendChild(desc);
    }
    return [footer];
  }

  private _normalizedTrend(): StatCardTrend {
    const value = this.attr("trend", "flat");
    return (TRENDS as readonly string[]).includes(value) ? (value as StatCardTrend) : "flat";
  }
}

function createSpan(className: string, text: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function createTrendArrow(trend: "up" | "down"): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "10");
  svg.setAttribute("height", "10");
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", trend === "up" ? "M5 2L9 7H1L5 2z" : "M5 8L1 3H9L5 8z");
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  return svg;
}

define(NdsStatCard);
