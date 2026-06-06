/**
 * <nds-notification-item> — DS NotificationItem 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-notification-item
 *     kind="success"
 *     item-title="상담이 확정되었습니다"
 *     description="3월 5일 오후 3시 박상담 선생님"
 *     time="방금 전"
 *     unread
 *     clickable
 *   ></nds-notification-item>
 *
 * 이벤트:
 *   nds-notification-click -> 클릭 (clickable 일 때)
 *
 * kind 별 기본 아이콘은 내장 inline SVG 로 제공.
 * 커스텀 아이콘이 필요하면 slot="icon" 으로 직접 주입 가능.
 */

import { NdsElement, define } from "../base/nds-element.js";

const NI_CLASS = "nds-notification-item";
const NI_ICON_CLASS = `${NI_CLASS}__icon`;
const NI_BODY_CLASS = `${NI_CLASS}__body`;
const NI_TITLE_CLASS = `${NI_CLASS}__title`;
const NI_DESC_CLASS = `${NI_CLASS}__desc`;
const NI_TIME_CLASS = `${NI_CLASS}__time`;
const NI_DOT_CLASS = `${NI_CLASS}__dot`;

export type NotificationKind = "info" | "success" | "warning" | "error" | "system";

const KIND_BG: Record<NotificationKind, string> = {
  info: "var(--semantic-bg-status-info)",
  success: "var(--semantic-bg-status-success)",
  warning: "var(--semantic-bg-status-caution)",
  error: "var(--semantic-bg-status-error)",
  system: "var(--semantic-bg-section-default)",
};

const KIND_FG: Record<NotificationKind, string> = {
  info: "var(--semantic-fill-brand-default)",
  success: "var(--semantic-icon-status-success)",
  warning: "var(--semantic-icon-status-caution)",
  error: "var(--semantic-icon-status-error)",
  system: "var(--semantic-text-subtle-default)",
};

const ICON_PATHS: Record<NotificationKind, string> = {
  info: `<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M10 6v5M10 14h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  success: `<path d="M4 10l4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  warning: `<path d="M10 2L19 17H1L10 2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 8v4M10 15h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  error: `<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  system: `<rect x="5" y="3" width="10" height="14" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="10" cy="14" r="1" fill="currentColor"/>`,
};

const kindIcon = (kind: NotificationKind) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = ICON_PATHS[kind];
  return svg;
};

export class NdsNotificationItem extends NdsElement {
  static elementName = "nds-notification-item";

  static get observedAttributes(): readonly string[] {
    return ["kind", "item-title", "description", "time", "unread", "clickable"];
  }

  private _root: HTMLDivElement | null = null;
  private _iconStash: HTMLElement | null = null;
  private _onClick = (_e: MouseEvent) => {
    if (!this.boolAttr("clickable")) return;
    this.dispatchEvent(
      new CustomEvent("nds-notification-click", { bubbles: true, composed: true }),
    );
  };
  private _onKey = (e: KeyboardEvent) => {
    if (!this.boolAttr("clickable")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("nds-notification-click", { bubbles: true, composed: true }),
      );
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    if (this._root) {
      this._root.removeEventListener("click", this._onClick);
      this._root.removeEventListener("keydown", this._onKey);
    }
  }

  private _mount(): void {
    // Stash any slot="icon" child once.
    let stash: HTMLElement | null = null;
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "icon") {
        stash = node;
      }
      node.parentNode?.removeChild(node);
    });
    this._iconStash = stash;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = NI_CLASS;
    root.addEventListener("click", this._onClick);
    root.addEventListener("keydown", this._onKey);
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const kind = (this.getAttribute("kind") as NotificationKind) || "info";
    const title = this.getAttribute("item-title") || "";
    const description = this.getAttribute("description");
    const time = this.getAttribute("time");
    const unread = this.boolAttr("unread");
    const clickable = this.boolAttr("clickable");

    this._root.dataset.clickable = clickable ? "true" : "false";
    this._root.dataset.unread = unread ? "true" : "false";

    if (clickable) {
      this._root.setAttribute("role", "button");
      this._root.setAttribute("tabindex", "0");
    } else {
      this._root.removeAttribute("role");
      this._root.removeAttribute("tabindex");
    }

    this._root.style.setProperty("--nds-noti-icon-bg", KIND_BG[kind]);
    this._root.style.setProperty("--nds-noti-icon-fg", KIND_FG[kind]);

    this._root.innerHTML = "";

    const iconWrap = document.createElement("span");
    iconWrap.className = NI_ICON_CLASS;
    iconWrap.setAttribute("aria-hidden", "true");
    if (this._iconStash) iconWrap.appendChild(this._iconStash);
    else iconWrap.appendChild(kindIcon(kind));
    if (unread) {
      const dot = document.createElement("span");
      dot.className = NI_DOT_CLASS;
      dot.setAttribute("aria-label", "새 알림");
      iconWrap.appendChild(dot);
    }
    this._root.appendChild(iconWrap);

    const body = document.createElement("div");
    body.className = NI_BODY_CLASS;

    const titleP = document.createElement("p");
    titleP.className = NI_TITLE_CLASS;
    titleP.textContent = title;
    body.appendChild(titleP);

    if (description) {
      const descP = document.createElement("p");
      descP.className = NI_DESC_CLASS;
      descP.textContent = description;
      body.appendChild(descP);
    }

    if (time) {
      const timeSpan = document.createElement("span");
      timeSpan.className = NI_TIME_CLASS;
      timeSpan.textContent = time;
      body.appendChild(timeSpan);
    }

    this._root.appendChild(body);
  }
}

define(NdsNotificationItem);
