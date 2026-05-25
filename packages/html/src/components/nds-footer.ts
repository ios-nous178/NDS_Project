/**
 * <nds-footer> + sub-elements — DS Footer 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { cv, sizing, spacing } from "@nudge-eap/tokens";

const FOOTER_CLASS = "nds-footer";
const FOOTER_NAV_CLASS = `${FOOTER_CLASS}__nav`;
const FOOTER_NAV_ITEM_CLASS = `${FOOTER_NAV_CLASS}-item`;
const FOOTER_COMPANY_CLASS = `${FOOTER_CLASS}__company`;

export type FooterVariant = "info" | "tab-bar" | "web";
export type FooterWebTone = "light" | "dark";

/* ──────────────── <nds-footer-info> ──────────────── */

export class NdsFooterInfo extends NdsElement {
  static elementName = "nds-footer-info";

  private _footer: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._footer) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const footer = document.createElement("footer");
    footer.dataset.slot = "root";
    footer.dataset.variant = "info";
    footer.className = FOOTER_CLASS;

    footer.style.setProperty("--nds-footer-padding", `${spacing[16]}px`);
    footer.style.setProperty("--nds-footer-background", cv.surface.subtle);

    while (this.firstChild) footer.appendChild(this.firstChild);
    this.appendChild(footer);
    this._footer = footer;
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
  }
}

/* ──────────────── <nds-footer-tab-bar> ──────────────── */

export class NdsFooterTabBar extends NdsElement {
  static elementName = "nds-footer-tab-bar";
  static get observedAttributes(): readonly string[] {
    return ["active-tab"];
  }

  private _nav: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._nav) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const nav = document.createElement("nav");
    nav.dataset.slot = "root";
    nav.dataset.variant = "tab-bar";
    nav.setAttribute("role", "tablist");
    nav.className = FOOTER_CLASS;

    nav.style.setProperty("--nds-footer-height", `${sizing.bottomBar.height}px`);
    nav.style.setProperty("--nds-footer-background", cv.surface.default);
    nav.style.setProperty("--nds-footer-border-color", cv.borderRole.subtle);

    while (this.firstChild) nav.appendChild(this.firstChild);
    this.appendChild(nav);
    this._nav = nav;
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
    const activeTab = this.getAttribute("active-tab");
    const items = this.querySelectorAll<NdsFooterTabItem>("nds-footer-tab-item");
    items.forEach((item) => {
      item.setActive(item.getAttribute("key") === activeTab);
    });
  }
}

/* ──────────────── <nds-footer-tab-item> ──────────────── */

export class NdsFooterTabItem extends NdsElement {
  static elementName = "nds-footer-tab-item";
  static get observedAttributes(): readonly string[] {
    return ["key", "label", "href"];
  }

  private _a: HTMLAnchorElement | null = null;
  private _iconSpan: HTMLSpanElement | null = null;
  private _activeIconSpan: HTMLSpanElement | null = null;
  private _labelSpan: HTMLSpanElement | null = null;
  private _isActive = false;

  override connectedCallback(): void {
    if (!this._a) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const a = document.createElement("a");
    a.className = FOOTER_NAV_ITEM_CLASS;
    a.setAttribute("role", "tab");

    const iconSpan = document.createElement("span");
    iconSpan.className = `${FOOTER_CLASS}__nav-icon`;

    const activeIconSpan = document.createElement("span");
    activeIconSpan.className = `${FOOTER_CLASS}__nav-icon`;
    activeIconSpan.style.display = "none";

    // Partition children by slot=icon / slot=active-icon. Other children ignored.
    Array.from(this.childNodes).forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        node.parentNode?.removeChild(node);
        return;
      }
      const slot = node.getAttribute("slot");
      if (slot === "icon") iconSpan.appendChild(node);
      else if (slot === "active-icon") activeIconSpan.appendChild(node);
      else node.parentNode?.removeChild(node);
    });

    const labelSpan = document.createElement("span");
    labelSpan.className = `${FOOTER_CLASS}__nav-label`;

    a.append(iconSpan, activeIconSpan, labelSpan);
    this.appendChild(a);
    this._a = a;
    this._iconSpan = iconSpan;
    this._activeIconSpan = activeIconSpan;
    this._labelSpan = labelSpan;
  }

  setActive(active: boolean): void {
    this._isActive = active;
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._a || !this._iconSpan || !this._activeIconSpan || !this._labelSpan) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const label = this.getAttribute("label") || "";
    const href = this.getAttribute("href") || "#";

    this._a.href = href;
    if (this._isActive) this._a.dataset.active = "true";
    else delete this._a.dataset.active;
    this._a.setAttribute("aria-selected", String(this._isActive));

    this._labelSpan.textContent = label;

    this._iconSpan.style.display = this._isActive ? "none" : "";
    this._activeIconSpan.style.display = this._isActive ? "" : "none";
  }
}

/* ──────────────── <nds-footer-company-info> ──────────────── */

export class NdsFooterCompanyInfo extends NdsElement {
  static elementName = "nds-footer-company-info";
  static get observedAttributes(): readonly string[] {
    return ["data", "logo-src"];
  }

  private _div: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.dataset.slot = "company";
    div.className = FOOTER_COMPANY_CLASS;
    this.appendChild(div);
    this._div = div;
  }

  protected update(): void {
    if (!this._div) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const dataAttr = this.getAttribute("data");
    const logoSrc = this.getAttribute("logo-src");

    interface CompanyData {
      name?: string;
      ceo?: string;
      bizNumber?: string;
      address?: string;
      phone?: string;
      email?: string;
      copyright?: string;
    }
    let data: CompanyData = {};
    if (dataAttr) {
      try {
        data = JSON.parse(dataAttr);
      } catch {
        /* ignore */
      }
    }

    this._div.innerHTML = `
      <div style="min-width: 0">
        <p class="${FOOTER_CLASS}__company-name">${data.name || ""}</p>
        <p>
          ${data.ceo ? `<span>대표이사: ${data.ceo}</span><span class="${FOOTER_CLASS}__company-sep"></span>` : ""}
          <span>사업자등록번호: ${data.bizNumber || ""}</span>
        </p>
        <p>${data.address || ""}</p>
        <p>
          ${data.phone ? `<span>전화: ${data.phone}</span><span class="${FOOTER_CLASS}__company-sep"></span>` : ""}
          ${data.email ? `<span>이메일: ${data.email}</span>` : ""}
        </p>
        <p class="${FOOTER_CLASS}__company-copyright">${data.copyright || ""}</p>
      </div>
      ${logoSrc ? `<img class="${FOOTER_CLASS}__company-logo" src="${logoSrc}" alt="Logo" />` : ""}
    `;
  }
}

/* ──────────────── <nds-footer-web> ──────────────── */

export class NdsFooterWeb extends NdsElement {
  static elementName = "nds-footer-web";
  static get observedAttributes(): readonly string[] {
    return ["max-width", "tone"];
  }

  private _footer: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._footer) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const footer = document.createElement("footer");
    footer.dataset.slot = "root";
    footer.dataset.variant = "web";
    footer.className = FOOTER_CLASS;

    const inner = document.createElement("div");
    inner.className = `${FOOTER_CLASS}__web-inner`;

    while (this.firstChild) inner.appendChild(this.firstChild);

    footer.appendChild(inner);
    this.appendChild(footer);
    this._footer = footer;
  }

  protected update(): void {
    if (!this._footer) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const maxWidth = this.getAttribute("max-width");
    const tone = this.getAttribute("tone") || "light";

    this._footer.dataset.tone = tone;
    if (maxWidth) this._footer.style.setProperty("--nds-footer-web-max-width", `${maxWidth}px`);
  }
}

/* ──────────────── <nds-footer-web-row> ──────────────── */

export class NdsFooterWebRow extends NdsElement {
  static elementName = "nds-footer-web-row";
  static get observedAttributes(): readonly string[] {
    return ["align"];
  }

  private _div: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.dataset.slot = "web-row";
    div.className = `${FOOTER_CLASS}__web-row`;
    while (this.firstChild) div.appendChild(this.firstChild);
    this.appendChild(div);
    this._div = div;
  }

  protected update(): void {
    if (!this._div) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    this._div.dataset.align = this.getAttribute("align") || "between";
  }
}

/* ──────────────── <nds-footer-web-section> ──────────────── */

export class NdsFooterWebSection extends NdsElement {
  static elementName = "nds-footer-web-section";
  private _section: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._section) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const section = document.createElement("section");
    section.dataset.slot = "web-section";
    section.className = `${FOOTER_CLASS}__web-section`;
    while (this.firstChild) section.appendChild(this.firstChild);
    this.appendChild(section);
    this._section = section;
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
  }
}

/* ──────────────── Registration ──────────────── */

define(NdsFooterInfo);
define(NdsFooterTabBar);
define(NdsFooterTabItem);
define(NdsFooterCompanyInfo);
define(NdsFooterWeb);
define(NdsFooterWebRow);
define(NdsFooterWebSection);
