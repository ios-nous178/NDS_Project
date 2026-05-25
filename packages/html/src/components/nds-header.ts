/**
 * <nds-header> + sub-elements — DS Header 의 vanilla Web Component 버전.
 *
 * 사용 예 (Web):
 *   <nds-header variant="web">
 *     <nds-header-main-bar>
 *       <nds-header-logo src="logo.svg" href="/"></nds-header-logo>
 *       <nds-header-search placeholder="검색"></nds-header-search>
 *       <nds-header-actions>
 *         <nds-header-auth-button auth-state="login"></nds-header-auth-button>
 *       </nds-header-actions>
 *     </nds-header-main-bar>
 *   </nds-header>
 *
 * 사용 예 (Mobile/Compact):
 *   <nds-header variant="compact" header-title="상세보기">
 *     <nds-icon-button slot="left" icon="ArrowBack"></nds-icon-button>
 *     <nds-icon-button slot="right" icon="Share"></nds-icon-button>
 *   </nds-header>
 *
 * children 은 mount 시 한 번 분리 — slot="left" / slot="right" 는 해당 영역으로,
 * 그 외는 inner (web variant) 또는 nesting (sub-element) 로 직접 들어간다.
 * Shadow DOM 없이도 동작하도록 실제 <slot> element 는 사용하지 않는다.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { cv, fontWeight, shadow, sizing, spacing, typeScale, zIndex } from "@nudge-eap/tokens";

const HEADER_CLASS = "nds-header";
const H_LEFT_CLASS = `${HEADER_CLASS}__left`;
const H_TITLE_CLASS = `${HEADER_CLASS}__title`;
const H_RIGHT_CLASS = `${HEADER_CLASS}__right`;
const H_MAIN_CLASS = `${HEADER_CLASS}__main-bar`;
const H_NAV_CLASS = `${HEADER_CLASS}__nav-bar`;
const H_LOGO_CLASS = `${HEADER_CLASS}__logo`;
const H_SEARCH_CLASS = `${HEADER_CLASS}__search`;
const H_MENU_CLASS = `${HEADER_CLASS}__menu`;
const H_MENU_ITEM_CLASS = `${HEADER_CLASS}__menu-item`;
const H_ACTIONS_CLASS = `${HEADER_CLASS}__actions`;
const H_AUTH_BTN_CLASS = `${HEADER_CLASS}__auth-btn`;
const H_INNER_CLASS = `${HEADER_CLASS}__inner`;
const H_SEARCH_ICON_CLASS = `${HEADER_CLASS}__search-icon`;

export type HeaderVariant = "compact" | "webview" | "transparent" | "web";
export type HeaderPosition = "sticky" | "fixed" | "static";

interface FlexVariantStyle {
  background: string;
  borderBottom: string;
  shadow: string;
  titleFontSize: number;
  titleLineHeight: number;
  titleFontWeight: number;
}

const flexVariantConfig: Record<string, FlexVariantStyle> = {
  compact: {
    background: cv.surface.default,
    borderBottom: `1px solid ${cv.borderRole.subtle}`,
    shadow: "none",
    titleFontSize: typeScale.body1.fontSize,
    titleLineHeight: typeScale.body1.lineHeight,
    titleFontWeight: fontWeight.bold,
  },
  webview: {
    background: cv.surface.default,
    borderBottom: "none",
    shadow: "none",
    titleFontSize: typeScale.body1.fontSize,
    titleLineHeight: typeScale.body1.lineHeight,
    titleFontWeight: fontWeight.bold,
  },
  transparent: {
    background: "transparent",
    borderBottom: "none",
    shadow: "none",
    titleFontSize: typeScale.body1.fontSize,
    titleLineHeight: typeScale.body1.lineHeight,
    titleFontWeight: fontWeight.bold,
  },
};

/* ──────────────── <nds-header> ──────────────── */

export class NdsHeader extends NdsElement {
  static elementName = "nds-header";

  static get observedAttributes(): readonly string[] {
    return ["variant", "position", "header-title", "elevated", "max-width"];
  }

  private _header: HTMLElement | null = null;
  private _leftSlot: HTMLDivElement | null = null;
  private _rightSlot: HTMLDivElement | null = null;
  private _innerSlot: HTMLDivElement | null = null;
  private _titleEl: HTMLHeadingElement | null = null;

  override connectedCallback(): void {
    if (!this._header) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const header = document.createElement("header");
    header.dataset.slot = "root";
    header.className = HEADER_CLASS;

    // Partition initial children by slot attribute. We build BOTH the flex
    // skeleton (left/title/right) and the web skeleton (inner) and place
    // children based on slot=*; update() then toggles which skeleton shows
    // based on variant.
    const left = document.createElement("div");
    left.className = H_LEFT_CLASS;
    left.dataset.slot = "left";

    const titleEl = document.createElement("h1");
    titleEl.className = H_TITLE_CLASS;
    titleEl.dataset.slot = "title";

    const right = document.createElement("div");
    right.className = H_RIGHT_CLASS;
    right.dataset.slot = "right";

    const inner = document.createElement("div");
    inner.className = H_INNER_CLASS;
    inner.dataset.slot = "inner";

    Array.from(this.childNodes).forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        node.parentNode?.removeChild(node);
        return;
      }
      const slot = node.getAttribute("slot");
      if (slot === "left") left.appendChild(node);
      else if (slot === "right") right.appendChild(node);
      else inner.appendChild(node);
    });

    header.append(left, titleEl, right, inner);
    this.appendChild(header);

    this._header = header;
    this._leftSlot = left;
    this._rightSlot = right;
    this._innerSlot = inner;
    this._titleEl = titleEl;
  }

  protected update(): void {
    if (!this._header || !this._leftSlot || !this._rightSlot || !this._innerSlot || !this._titleEl)
      return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = (this.getAttribute("variant") as HeaderVariant) || "compact";
    const position = this.getAttribute("position");
    const title = this.getAttribute("header-title");
    const elevated = this.boolAttr("elevated");
    const maxWidth = this.getAttribute("max-width");

    this._header.dataset.variant = variant;
    if (elevated) this._header.dataset.elevated = "true";
    else delete this._header.dataset.elevated;

    const resolvedPosition = position || (variant === "web" ? "static" : "sticky");
    this._header.style.position = resolvedPosition;
    this._header.style.top = resolvedPosition !== "static" ? "0" : "";
    this._header.style.left = resolvedPosition === "fixed" ? "0" : "";
    this._header.style.right = resolvedPosition === "fixed" ? "0" : "";

    const isWeb = variant === "web";
    this._leftSlot.style.display = isWeb ? "none" : "";
    this._rightSlot.style.display = isWeb ? "none" : "";
    this._titleEl.style.display = isWeb || !title ? "none" : "";
    this._innerSlot.style.display = isWeb ? "" : "none";

    if (isWeb) {
      if (maxWidth) this._header.style.setProperty("--nds-header-max-width", `${maxWidth}px`);
    } else {
      const variantStyle = flexVariantConfig[variant] || flexVariantConfig.compact;
      this._header.style.setProperty("--nds-header-height", `${sizing.appBar.height}px`);
      this._header.style.setProperty("--nds-header-padding-x", `${spacing[16]}px`);
      this._header.style.setProperty("--nds-header-background", variantStyle.background);
      this._header.style.setProperty("--nds-header-border-bottom", variantStyle.borderBottom);
      this._header.style.setProperty(
        "--nds-header-shadow",
        elevated ? shadow["1"] : variantStyle.shadow,
      );
      this._header.style.setProperty(
        "--nds-header-title-font-size",
        `${variantStyle.titleFontSize}px`,
      );
      this._header.style.setProperty(
        "--nds-header-title-line-height",
        `${variantStyle.titleLineHeight}px`,
      );
      this._header.style.setProperty(
        "--nds-header-title-font-weight",
        String(variantStyle.titleFontWeight),
      );
      this._header.style.setProperty("--nds-header-z-index", String(zIndex.appBar));

      if (title) this._titleEl.textContent = title;
    }
  }
}

/* ──────────────── <nds-header-main-bar> ──────────────── */

export class NdsHeaderMainBar extends NdsElement {
  static elementName = "nds-header-main-bar";
  static get observedAttributes(): readonly string[] {
    return ["max-width"];
  }

  private _div: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.className = H_MAIN_CLASS;
    div.dataset.slot = "main-bar";
    while (this.firstChild) div.appendChild(this.firstChild);
    this.appendChild(div);
    this._div = div;
  }

  protected update(): void {
    if (!this._div) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    const maxWidth = this.getAttribute("max-width");
    if (maxWidth) this._div.style.setProperty("--nds-header-main-max-width", `${maxWidth}px`);
  }
}

/* ──────────────── <nds-header-nav-bar> ──────────────── */

export class NdsHeaderNavBar extends NdsElement {
  static elementName = "nds-header-nav-bar";
  static get observedAttributes(): readonly string[] {
    return ["max-width", "height"];
  }

  private _nav: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._nav) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const nav = document.createElement("nav");
    nav.className = H_NAV_CLASS;
    nav.dataset.slot = "nav-bar";
    while (this.firstChild) nav.appendChild(this.firstChild);
    this.appendChild(nav);
    this._nav = nav;
  }

  protected update(): void {
    if (!this._nav) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    const maxWidth = this.getAttribute("max-width");
    const height = this.getAttribute("height");
    if (maxWidth) this._nav.style.setProperty("--nds-header-nav-max-width", `${maxWidth}px`);
    if (height) this._nav.style.setProperty("--nds-header-nav-height", `${height}px`);
  }
}

/* ──────────────── <nds-header-logo> ──────────────── */

export class NdsHeaderLogo extends NdsElement {
  static elementName = "nds-header-logo";
  static get observedAttributes(): readonly string[] {
    return ["src", "alt", "href"];
  }

  private _wrap: HTMLDivElement | null = null;
  private _customContent: DocumentFragment | null = null;

  override connectedCallback(): void {
    if (!this._wrap) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // Stash any pre-existing custom logo markup before we overwrite.
    const stash = document.createDocumentFragment();
    while (this.firstChild) stash.appendChild(this.firstChild);
    this._customContent = stash;

    const wrap = document.createElement("div");
    wrap.className = H_LOGO_CLASS;
    wrap.dataset.slot = "logo";
    this.appendChild(wrap);
    this._wrap = wrap;
  }

  protected update(): void {
    if (!this._wrap) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const src = this.getAttribute("src");
    const alt = this.getAttribute("alt") || "";
    const href = this.getAttribute("href");

    this._wrap.innerHTML = "";

    let content: Node;
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      content = img;
    } else if (this._customContent && this._customContent.childNodes.length > 0) {
      // Clone so we can re-render across multiple update() calls.
      content = this._customContent.cloneNode(true);
    } else {
      return;
    }

    if (href) {
      const a = document.createElement("a");
      a.href = href;
      a.appendChild(content);
      this._wrap.appendChild(a);
    } else {
      this._wrap.appendChild(content);
    }
  }
}

/* ──────────────── <nds-header-search> ──────────────── */

export class NdsHeaderSearch extends NdsElement {
  static elementName = "nds-header-search";
  static get observedAttributes(): readonly string[] {
    return ["placeholder", "value"];
  }

  private _div: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.className = H_SEARCH_CLASS;
    div.dataset.slot = "search";

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.dispatchEvent(
          new CustomEvent("nds-header-search", {
            detail: { value: input.value },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });

    const iconSpan = document.createElement("span");
    iconSpan.className = H_SEARCH_ICON_CLASS;
    iconSpan.setAttribute("role", "button");
    iconSpan.setAttribute("aria-label", "검색");
    iconSpan.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="6" stroke="currentColor" stroke-width="1.5" /><path d="M13 13L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>`;
    iconSpan.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("nds-header-search", {
          detail: { value: input.value },
          bubbles: true,
          composed: true,
        }),
      );
    });

    div.append(input, iconSpan);
    this.appendChild(div);
    this._div = div;
    this._input = input;
  }

  protected update(): void {
    if (!this._input) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    this._input.placeholder = this.getAttribute("placeholder") || "";
    const value = this.getAttribute("value");
    if (value !== null && this._input.value !== value) this._input.value = value;
  }
}

/* ──────────────── <nds-header-menu> ──────────────── */

export class NdsHeaderMenu extends NdsElement {
  static elementName = "nds-header-menu";
  private _nav: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._nav) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const nav = document.createElement("nav");
    nav.className = H_MENU_CLASS;
    nav.dataset.slot = "menu";
    while (this.firstChild) nav.appendChild(this.firstChild);
    this.appendChild(nav);
    this._nav = nav;
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
  }
}

/* ──────────────── <nds-header-menu-item> ──────────────── */

export class NdsHeaderMenuItem extends NdsElement {
  static elementName = "nds-header-menu-item";
  static get observedAttributes(): readonly string[] {
    return ["href", "active"];
  }

  private _element: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._element) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const href = this.getAttribute("href");
    const tag = href ? "a" : "button";
    const el = document.createElement(tag);
    el.className = H_MENU_ITEM_CLASS;
    el.dataset.slot = "menu-item";
    if (href) (el as HTMLAnchorElement).href = href;
    else (el as HTMLButtonElement).type = "button";

    while (this.firstChild) el.appendChild(this.firstChild);
    this.appendChild(el);
    this._element = el;
  }

  protected update(): void {
    if (!this._element) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    const active = this.boolAttr("active");
    if (active) this._element.dataset.active = "true";
    else delete this._element.dataset.active;
  }
}

/* ──────────────── <nds-header-actions> ──────────────── */

export class NdsHeaderActions extends NdsElement {
  static elementName = "nds-header-actions";
  private _div: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.className = H_ACTIONS_CLASS;
    div.dataset.slot = "actions";
    while (this.firstChild) div.appendChild(this.firstChild);
    this.appendChild(div);
    this._div = div;
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
  }
}

/* ──────────────── <nds-header-auth-button> ──────────────── */

export class NdsHeaderAuthButton extends NdsElement {
  static elementName = "nds-header-auth-button";
  static get observedAttributes(): readonly string[] {
    return ["auth-state", "label", "href"];
  }

  private _element: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._element) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const href = this.getAttribute("href");
    const tag = href ? "a" : "button";
    const el = document.createElement(tag);
    el.className = H_AUTH_BTN_CLASS;
    el.dataset.slot = "auth";
    if (href) (el as HTMLAnchorElement).href = href;
    else (el as HTMLButtonElement).type = "button";

    this.appendChild(el);
    this._element = el;
  }

  protected update(): void {
    if (!this._element) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const authState = this.getAttribute("auth-state") || "logout";
    const label = this.getAttribute("label") || (authState === "login" ? "로그인" : "로그아웃");

    this._element.dataset.authState = authState;
    this._element.textContent = label;
  }
}

/* ──────────────── Registration ──────────────── */

define(NdsHeader);
define(NdsHeaderMainBar);
define(NdsHeaderNavBar);
define(NdsHeaderLogo);
define(NdsHeaderSearch);
define(NdsHeaderMenu);
define(NdsHeaderMenuItem);
define(NdsHeaderActions);
define(NdsHeaderAuthButton);
