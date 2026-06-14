/**
 * <nds-bottom-nav> + <nds-bottom-nav-item> — DS BottomNav 의 vanilla Web Component 버전.
 *
 * react(BottomNav.tsx) 미러: 같은 class/`data-slot`/active 동작/치수를 공유한다.
 * 브랜드 색은 `--nds-bottomnav-*` 슬롯으로만 흘러든다 (컴포넌트는 브랜드 모름).
 *
 *   <nds-bottom-nav active-key="home">
 *     <nds-bottom-nav-item item-key="home" label="홈" href="/">
 *       <svg slot="icon">…</svg>
 *       <svg slot="active-icon">…</svg>
 *     </nds-bottom-nav-item>
 *   </nds-bottom-nav>
 */

import { NdsElement, define } from "../base/nds-element.js";

const BN_CLASS = "nds-bottom-nav";
const BN_ITEM_CLASS = `${BN_CLASS}__item`;
const BN_ICON_CLASS = `${BN_CLASS}__icon`;
const BN_LABEL_CLASS = `${BN_CLASS}__label`;
const BN_BADGE_CLASS = `${BN_CLASS}__badge`;

/* ──────────────── <nds-bottom-nav> ──────────────── */

export class NdsBottomNav extends NdsElement {
  static elementName = "nds-bottom-nav";
  static get observedAttributes(): readonly string[] {
    return ["active-key", "position", "shadow"];
  }

  private _nav: HTMLElement | null = null;

  protected override mount(): void {
    const nav = document.createElement("nav");
    nav.dataset.slot = "root";
    nav.setAttribute("role", "tablist");
    nav.className = BN_CLASS;

    while (this.firstChild) nav.appendChild(this.firstChild);
    this.appendChild(nav);
    this._nav = nav;
  }

  protected update(): void {
    if (!this._nav) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._nav.dataset.position = this.getAttribute("position") || "fixed";
    if (this.hasAttribute("shadow")) this._nav.dataset.shadow = "true";
    else delete this._nav.dataset.shadow;

    const activeKey = this.getAttribute("active-key");
    const items = this.querySelectorAll<NdsBottomNavItem>("nds-bottom-nav-item");
    items.forEach((item) => {
      item.setActive(item.getAttribute("item-key") === activeKey);
    });
  }
}

/* ──────────────── <nds-bottom-nav-item> ──────────────── */

export class NdsBottomNavItem extends NdsElement {
  static elementName = "nds-bottom-nav-item";
  static get observedAttributes(): readonly string[] {
    return ["item-key", "label", "href", "badge"];
  }

  private _a: HTMLAnchorElement | null = null;
  private _iconSpan: HTMLSpanElement | null = null;
  private _activeIconSpan: HTMLSpanElement | null = null;
  private _badgeSpan: HTMLSpanElement | null = null;
  private _labelSpan: HTMLSpanElement | null = null;
  private _isActive = false;

  protected override mount(): void {
    const a = document.createElement("a");
    a.className = BN_ITEM_CLASS;
    a.dataset.slot = "item";
    a.setAttribute("role", "tab");

    const iconWrap = document.createElement("span");
    iconWrap.className = BN_ICON_CLASS;

    const iconSpan = document.createElement("span");
    const activeIconSpan = document.createElement("span");
    activeIconSpan.style.display = "none";

    // children 을 slot=icon / slot=active-icon 으로 분배. 그 외는 무시.
    // SVG 아이콘은 SVGElement(≠ HTMLElement)이므로 Element 로 받는다.
    Array.from(this.childNodes).forEach((node) => {
      if (!(node instanceof Element)) {
        node.parentNode?.removeChild(node);
        return;
      }
      const slot = node.getAttribute("slot");
      if (slot === "icon") iconSpan.appendChild(node);
      else if (slot === "active-icon") activeIconSpan.appendChild(node);
      else node.parentNode?.removeChild(node);
    });

    const badgeSpan = document.createElement("span");
    badgeSpan.className = BN_BADGE_CLASS;
    badgeSpan.setAttribute("aria-hidden", "true");
    badgeSpan.style.display = "none";

    iconWrap.append(iconSpan, activeIconSpan, badgeSpan);

    const labelSpan = document.createElement("span");
    labelSpan.className = BN_LABEL_CLASS;

    a.append(iconWrap, labelSpan);
    this.appendChild(a);

    this._a = a;
    this._iconSpan = iconSpan;
    this._activeIconSpan = activeIconSpan;
    this._badgeSpan = badgeSpan;
    this._labelSpan = labelSpan;
  }

  setActive(active: boolean): void {
    this._isActive = active;
    this.scheduleUpdate();
  }

  protected update(): void {
    if (
      !this._a ||
      !this._iconSpan ||
      !this._activeIconSpan ||
      !this._badgeSpan ||
      !this._labelSpan
    )
      return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const label = this.getAttribute("label") || "";
    const href = this.getAttribute("href") || "#";
    const badge = this.getAttribute("badge");
    // active-icon 미제공 시 비활성 아이콘을 그대로 쓰고 색만 cascade.
    const hasActiveIcon = this._activeIconSpan.childNodes.length > 0;

    this._a.href = href;
    if (this._isActive) this._a.dataset.active = "true";
    else delete this._a.dataset.active;
    this._a.setAttribute("aria-selected", String(this._isActive));
    if (this._isActive) this._a.setAttribute("aria-current", "page");
    else this._a.removeAttribute("aria-current");

    this._labelSpan.textContent = label;

    const showActive = this._isActive && hasActiveIcon;
    this._iconSpan.style.display = showActive ? "none" : "";
    this._activeIconSpan.style.display = showActive ? "" : "none";

    if (badge != null && badge !== "") {
      this._badgeSpan.textContent = badge;
      this._badgeSpan.style.display = "";
    } else {
      this._badgeSpan.textContent = "";
      this._badgeSpan.style.display = "none";
    }
  }
}

/* ──────────────── Registration ──────────────── */

define(NdsBottomNav);
define(NdsBottomNavItem);
