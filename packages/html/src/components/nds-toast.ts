/**
 * <nds-toast> — DS Toast 의 vanilla Web Component 버전.
 *
 * Astro/vanilla 앱에서 실제로 쓰기 쉽도록 host 는 매니저 역할만 하고,
 * toast viewport 는 document.body 로 portal 렌더링한다.
 *
 * Toast 는 **인터랙션 없는 단일 다크 일시 메시지** 전용 — 자동으로 사라지므로 액션/닫기 버튼이나
 * 색 변형(success/error…)·프로젝트 카드(캐포비 흰 카드)는 두지 않는다. 그런 알림은 <nds-snackbar>,
 * 심각한 오류·결정 요청은 Modal/Alert 를 사용한다. 동시에 1개만 노출이 기본이다.
 */

import { NdsElement, define } from "../base/nds-element.js";

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;

/** 노출 위치 — `top`(PC·상단·pill) / `bottom`(모바일·하단·rounded 24). 위치가 곧 형태다(Figma 1330:2). */
export type ToastPosition = "top" | "bottom";

export interface ToastShowOptions {
  id?: string;
  message: string;
  duration?: number;
}

interface ToastItem {
  id: string;
  message: string;
  duration: number;
}

const POSITIONS: readonly ToastPosition[] = ["top", "bottom"];

let toastId = 0;

export class NdsToast extends NdsElement {
  static elementName = "nds-toast";

  static get observedAttributes(): readonly string[] {
    return ["position", "duration", "max-count", "message", "open"];
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
      duration: input.duration ?? this._numberAttr("duration", 3000),
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
        duration: this._numberAttr("duration", 3000),
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
    root.dataset.entering = "true";
    root.dataset.exiting = "false";
    root.className = TOAST_ITEM_CLASS;
    root.role = "status";

    const message = document.createElement("span");
    message.className = TOAST_MESSAGE_CLASS;
    message.textContent = item.message;
    root.appendChild(message);

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
    return Math.max(1, this._numberAttr("max-count", 1));
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
