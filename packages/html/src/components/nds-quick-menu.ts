/**
 * <nds-quick-menu> — DS QuickMenu 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-quick-menu fixed
 *     items='[{"key":"counsel","label":"바로 상담하기","icon":"<svg ...>...</svg>"},
 *             {"key":"search","label":"상담사 찾기","icon":"<svg ...>...</svg>"},
 *             {"key":"room","label":"내 상담방","icon":"<svg ...>...</svg>"}]'>
 *   </nds-quick-menu>
 *
 * icon = find_icon({name}) 가 준 inline SVG 마크업 문자열 (이름/이모지 아님 — innerHTML 주입).
 * items 는 JSON 속성이라 SVG 안 " 는 \" 로 이스케이프.
 * 아이템 클릭 → "quick-menu-item" CustomEvent (detail: { key }) · TOP 클릭 → "quick-menu-top".
 *
 * PC 우측 고정 컴포넌트. `fixed` 속성으로 position:fixed(top 172 · right 40 · z 900 · <1024 숨김) 적용.
 */

import { NdsElement, define } from "../base/nds-element.js";

const QM_CLASS = "nds-quickmenu";
const QM_HEADER_CLASS = `${QM_CLASS}__header`;
const QM_HEADING_CLASS = `${QM_CLASS}__heading`;
const QM_DIVIDER_CLASS = `${QM_CLASS}__divider`;
const QM_ITEMS_CLASS = `${QM_CLASS}__items`;
const QM_ITEM_CLASS = `${QM_CLASS}__item`;
const QM_CIRCLE_CLASS = `${QM_CLASS}__circle`;
const QM_ICON_CLASS = `${QM_CLASS}__icon`;
const QM_LABEL_CLASS = `${QM_CLASS}__label`;
const QM_TOP_CLASS = `${QM_CLASS}__top`;
const QM_TOP_ICON_CLASS = `${QM_CLASS}__top-icon`;
const QM_TOP_LABEL_CLASS = `${QM_CLASS}__top-label`;

const DEFAULT_HEADING = "QUICK\nMENU";
const CHEVRON_UP_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

interface QuickMenuItem {
  key: string;
  label: string;
  /** inline SVG 마크업 문자열 (find_icon 결과). 이름/이모지가 아니라 innerHTML 로 주입된다. */
  icon: string;
  showLabel?: boolean;
}

// aria-label 은 update() 에서 기본값("퀵메뉴")과 함께 별도 처리 — 여기엔 넣지 않는다.
const FORWARDED_ATTRS = ["aria-labelledby"] as const;

export class NdsQuickMenu extends NdsElement {
  static elementName = "nds-quick-menu";

  static get observedAttributes(): readonly string[] {
    return ["items", "heading", "show-top", "top-label", "fixed", ...FORWARDED_ATTRS];
  }

  private _root: HTMLElement | null = null;

  // mount() = DOM 골격 1회 구성 (베이스가 1회 보장). update() 는 반영만.
  protected override mount(): void {
    const root = document.createElement("nav");
    root.dataset.slot = "root";
    root.className = QM_CLASS;
    this.style.display = "contents";
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    const root = this._root;
    if (!root) return;

    root.setAttribute("aria-label", this.getAttribute("aria-label") ?? "퀵메뉴");
    if (this.hasAttribute("fixed")) root.dataset.fixed = "";
    else delete root.dataset.fixed;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) root.removeAttribute(name);
      else root.setAttribute(name, value);
    }

    root.replaceChildren(
      this._createHeader(),
      this._createItems(),
      ...(this.hasAttribute("show-top") && this.getAttribute("show-top") === "false"
        ? []
        : [this._createTop()]),
    );
  }

  private _createHeader(): HTMLDivElement {
    const header = document.createElement("div");
    header.className = QM_HEADER_CLASS;

    const heading = document.createElement("span");
    heading.className = QM_HEADING_CLASS;
    heading.textContent = this.getAttribute("heading") ?? DEFAULT_HEADING;
    header.appendChild(heading);

    const divider = document.createElement("span");
    divider.className = QM_DIVIDER_CLASS;
    divider.setAttribute("aria-hidden", "true");
    header.appendChild(divider);

    return header;
  }

  private _createItems(): HTMLUListElement {
    const list = document.createElement("ul");
    list.className = QM_ITEMS_CLASS;

    for (const item of this._readItems()) {
      const li = document.createElement("li");
      const showLabel = item.showLabel !== false;

      const button = document.createElement("button");
      button.type = "button";
      button.className = QM_ITEM_CLASS;
      button.dataset.key = item.key;
      if (!showLabel && item.label) button.setAttribute("aria-label", item.label);

      const circle = document.createElement("span");
      circle.className = QM_CIRCLE_CLASS;
      const icon = document.createElement("span");
      icon.className = QM_ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      // icon = inline SVG 마크업 (find_icon 결과). React 의 icon?:ReactNode 와 대칭.
      icon.innerHTML = item.icon;
      circle.appendChild(icon);
      button.appendChild(circle);

      if (showLabel) {
        const label = document.createElement("span");
        label.className = QM_LABEL_CLASS;
        label.textContent = item.label;
        button.appendChild(label);
      }

      button.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("quick-menu-item", {
            detail: { key: item.key },
            bubbles: true,
            composed: true,
          }),
        );
      });

      li.appendChild(button);
      list.appendChild(li);
    }

    return list;
  }

  private _createTop(): HTMLButtonElement {
    const top = document.createElement("button");
    top.type = "button";
    top.className = QM_TOP_CLASS;

    const icon = document.createElement("span");
    icon.className = QM_TOP_ICON_CLASS;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = CHEVRON_UP_SVG;
    top.appendChild(icon);

    const label = document.createElement("span");
    label.className = QM_TOP_LABEL_CLASS;
    label.textContent = this.getAttribute("top-label") ?? "TOP";
    top.appendChild(label);

    top.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("quick-menu-top", { bubbles: true, composed: true }));
    });

    return top;
  }

  private _readItems(): QuickMenuItem[] {
    const attr = this.getAttribute("items");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => ({
          key: typeof raw.key === "string" ? raw.key : "",
          label: typeof raw.label === "string" ? raw.label : "",
          icon: typeof raw.icon === "string" ? raw.icon : "",
          showLabel: raw.showLabel !== false,
        }))
        .filter((item) => item.key);
    } catch {
      return [];
    }
  }
}

define(NdsQuickMenu);
