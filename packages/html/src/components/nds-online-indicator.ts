/**
 * <nds-online-indicator> — DS OnlineIndicator 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React OnlineIndicator.tsx 와 동일):
 *   <nds-online-indicator status="online" show-label></nds-online-indicator>
 *     └─ <span class="nds-online-indicator" data-slot="root" aria-label="온라인" style="...">
 *          ├─ <span class="nds-online-indicator__dot" data-status="online" aria-hidden="true"></span>
 *          └─ <span class="nds-online-indicator__label">온라인</span>
 *        </span>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const OI_CLASS = "nds-online-indicator";
const OI_DOT_CLASS = `${OI_CLASS}__dot`;
const OI_LABEL_CLASS = `${OI_CLASS}__label`;

export type PresenceStatus = "online" | "away" | "busy" | "offline";

const STATUSES: readonly PresenceStatus[] = ["online", "away", "busy", "offline"];

const STATUS_COLOR: Record<PresenceStatus, string> = {
  online: "var(--semantic-icon-status-success)",
  away: "var(--semantic-icon-status-caution)",
  busy: "var(--semantic-icon-status-error)",
  offline: "var(--semantic-icon-disabled-default)",
};

const STATUS_LABEL: Record<PresenceStatus, string> = {
  online: "온라인",
  away: "자리비움",
  busy: "상담 중",
  offline: "오프라인",
};

const FORWARDED_ATTRS = ["aria-labelledby", "title"] as const;

export class NdsOnlineIndicator extends NdsElement {
  static elementName = "nds-online-indicator";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-online-indicator"].observedAttributes, "aria-label", ...FORWARDED_ATTRS];
  }

  private _root: HTMLSpanElement | null = null;
  private _dot: HTMLSpanElement | null = null;
  private _label: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("span");
    const dot = document.createElement("span");

    root.className = OI_CLASS;
    root.dataset.slot = "root";

    dot.className = OI_DOT_CLASS;
    dot.setAttribute("aria-hidden", "true");
    root.appendChild(dot);
    this.appendChild(root);

    this._root = root;
    this._dot = dot;
  }

  protected update(): void {
    if (!this._root || !this._dot) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const status = this._normalizedStatus();
    const text = this.getAttribute("label") ?? STATUS_LABEL[status];
    const size = this._numberAttr("size", 8);
    const ariaLabel = this.getAttribute("aria-label") ?? text;

    this._root.style.setProperty("--nds-presence-color", STATUS_COLOR[status]);
    this._root.style.setProperty("--nds-presence-size", `${size}px`);
    this._root.setAttribute("aria-label", ariaLabel);
    this._dot.dataset.status = status;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._syncLabel(text);
  }

  private _syncLabel(text: string): void {
    if (!this._root) return;
    if (!this.boolAttr("show-label")) {
      this._label?.remove();
      this._label = null;
      return;
    }
    if (!this._label) {
      this._label = document.createElement("span");
      this._label.className = OI_LABEL_CLASS;
      this._root.appendChild(this._label);
    }
    this._label.textContent = text;
  }

  private _normalizedStatus(): PresenceStatus {
    const value = this.attr("status", "offline");
    return (STATUSES as readonly string[]).includes(value) ? (value as PresenceStatus) : "offline";
  }

  private _numberAttr(name: string, fallback: number): number {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }
}

define(NdsOnlineIndicator);
