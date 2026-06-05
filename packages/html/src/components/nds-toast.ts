/**
 * <nds-toast> — DS Toast 의 vanilla Web Component 버전.
 *
 * Astro/vanilla 앱에서 실제로 쓰기 쉽도록 host 는 매니저 역할만 하고,
 * toast viewport 는 document.body 로 portal 렌더링한다.
 */

import { NdsElement, define } from "../base/nds-element.js";

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_ICON_CLASS = `${TOAST_CLASS}__icon`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;
const TOAST_ACTION_CLASS = `${TOAST_CLASS}__action`;
const TOAST_CLOSE_CLASS = `${TOAST_CLASS}__close`;

/**
 * 상태 아이콘 SVG (24×24). 도형은 currentColor 라 CSS 의 variant 별 색이 그대로 칠해진다.
 * 캐포비 흰 카드 토스트에서만 노출(CSS gate) — default 는 아이콘 없음.
 */
const ICON_RECT = '<rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor"/>';
const STATUS_ICON_SVG: Partial<Record<ToastVariant, string>> = {
  success: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${ICON_RECT}<path d="M8 12.3l2.8 2.8 5.4-5.8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${ICON_RECT}<path d="M9 9l6 6M15 9l-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${ICON_RECT}<path d="M12 7.5v5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1.1" fill="#fff"/></svg>`,
  info: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${ICON_RECT}<circle cx="12" cy="8" r="1.1" fill="#fff"/><path d="M12 11v5.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
};

const CLOSE_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";
export type ToastPosition = "top" | "bottom" | "top-right";

export interface ToastShowOptions {
  id?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  actionLabel?: string;
}

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  actionLabel?: string;
}

const VARIANTS: readonly ToastVariant[] = ["default", "success", "error", "warning", "info"];
const POSITIONS: readonly ToastPosition[] = ["top", "bottom", "top-right"];

let toastId = 0;

export class NdsToast extends NdsElement {
  static elementName = "nds-toast";

  static get observedAttributes(): readonly string[] {
    return ["position", "duration", "max-count", "message", "variant", "action-label", "open"];
  }

  private _viewport: HTMLDivElement | null = null;
  private _items: ToastItem[] = [];
  private _timers = new Map<string, ReturnType<typeof setTimeout>>();
  private _initialOpenShown = false;

  private _handleShow = (event: Event): void => {
    const detail = (event as CustomEvent<Partial<ToastShowOptions> | string>).detail;
    if (typeof detail === "string") {
      this.show(detail);
      return;
    }
    if (detail?.message) this.show(detail as ToastShowOptions);
  };

  private _handleDismiss = (event: Event): void => {
    const detail = (event as CustomEvent<{ id?: string }>).detail;
    if (detail?.id) this.dismiss(detail.id);
    else this.clear();
  };

  override connectedCallback(): void {
    this._ensureViewport();
    window.addEventListener("nds-toast-show", this._handleShow);
    window.addEventListener("nds-toast-dismiss", this._handleDismiss);
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    window.removeEventListener("nds-toast-show", this._handleShow);
    window.removeEventListener("nds-toast-dismiss", this._handleDismiss);
    this.clear();
    this._viewport?.remove();
    this._viewport = null;
  }

  show(
    messageOrOptions: string | ToastShowOptions,
    options: Partial<ToastShowOptions> = {},
  ): string {
    const input =
      typeof messageOrOptions === "string"
        ? { ...options, message: messageOrOptions }
        : { ...messageOrOptions };
    const id = input.id ?? `nds-toast-${++toastId}`;
    const item: ToastItem = {
      id,
      message: input.message,
      variant: normalize(input.variant, VARIANTS, "default"),
      duration: input.duration ?? this._numberAttr("duration", 3000),
      actionLabel: input.actionLabel,
    };

    this._items = [...this._items.filter((entry) => entry.id !== id), item].slice(
      -this._maxCount(),
    );
    this._renderViewport();
    this._scheduleDismiss(item);
    this.dispatchEvent(new CustomEvent("nds-toast-open", { detail: { id, item }, bubbles: true }));
    return id;
  }

  dismiss(id: string): void {
    const before = this._items.length;
    this._items = this._items.filter((item) => item.id !== id);
    this._clearTimer(id);
    if (this._items.length !== before) {
      this._renderViewport();
      this.dispatchEvent(new CustomEvent("nds-toast-close", { detail: { id }, bubbles: true }));
    }
  }

  clear(): void {
    for (const id of this._timers.keys()) this._clearTimer(id);
    this._items = [];
    this._renderViewport();
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
    this._ensureViewport();
    this._renderViewport();

    const message = this.getAttribute("message");
    if (this.boolAttr("open") && message && !this._initialOpenShown) {
      this._initialOpenShown = true;
      this.show({
        message,
        variant: normalize(this.getAttribute("variant"), VARIANTS, "default"),
        duration: this._numberAttr("duration", 3000),
        actionLabel: this.getAttribute("action-label") ?? undefined,
      });
    }
    if (!this.boolAttr("open")) this._initialOpenShown = false;
  }

  private _ensureViewport(): void {
    if (this._viewport || typeof document === "undefined") return;
    const viewport = document.createElement("div");
    viewport.dataset.slot = "viewport";
    viewport.className = TOAST_VIEWPORT_CLASS;
    viewport.setAttribute("aria-live", "polite");
    viewport.setAttribute("aria-relevant", "additions");
    document.body.appendChild(viewport);
    this._viewport = viewport;
  }

  private _renderViewport(): void {
    if (!this._viewport) return;
    this._viewport.dataset.position = normalize(this.getAttribute("position"), POSITIONS, "bottom");
    this._viewport.replaceChildren(...this._items.map((item) => this._createItem(item)));
  }

  private _createItem(item: ToastItem): HTMLDivElement {
    const root = document.createElement("div");
    root.dataset.slot = "item";
    root.dataset.variant = item.variant;
    root.dataset.entering = "true";
    root.dataset.exiting = "false";
    root.className = TOAST_ITEM_CLASS;
    root.role = item.variant === "error" ? "alert" : "status";
    if (item.variant === "error") root.setAttribute("aria-live", "assertive");

    // 좌측 status 아이콘 (캐포비 흰 카드 토스트에서만 CSS 로 노출). default 는 아이콘 없음.
    const iconSvg = STATUS_ICON_SVG[item.variant];
    if (iconSvg) {
      const icon = document.createElement("span");
      icon.className = TOAST_ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = iconSvg;
      root.appendChild(icon);
    }

    const message = document.createElement("span");
    message.className = TOAST_MESSAGE_CLASS;
    message.textContent = item.message;
    root.appendChild(message);

    if (item.actionLabel) {
      const action = document.createElement("button");
      action.type = "button";
      action.className = TOAST_ACTION_CLASS;
      action.textContent = item.actionLabel;
      action.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("nds-toast-action", {
            detail: { id: item.id, item },
            bubbles: true,
          }),
        );
        this.dismiss(item.id);
      });
      root.appendChild(action);
    }

    // 우측 닫기 X (캐포비 흰 카드 토스트에서만 CSS 로 노출).
    const close = document.createElement("button");
    close.type = "button";
    close.className = TOAST_CLOSE_CLASS;
    close.setAttribute("aria-label", "닫기");
    close.innerHTML = CLOSE_ICON_SVG;
    close.addEventListener("click", () => this.dismiss(item.id));
    root.appendChild(close);

    return root;
  }

  private _scheduleDismiss(item: ToastItem): void {
    this._clearTimer(item.id);
    if (item.duration <= 0) return;
    this._timers.set(
      item.id,
      setTimeout(() => this.dismiss(item.id), item.duration),
    );
  }

  private _clearTimer(id: string): void {
    const timer = this._timers.get(id);
    if (timer) clearTimeout(timer);
    this._timers.delete(id);
  }

  private _maxCount(): number {
    return Math.max(1, this._numberAttr("max-count", 3));
  }

  private _numberAttr(name: string, defaultValue: number): number {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) ? value : defaultValue;
  }
}

function normalize<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

declare global {
  interface HTMLElementTagNameMap {
    "nds-toast": NdsToast;
  }
}

define(NdsToast);
