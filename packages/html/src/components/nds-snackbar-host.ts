/**
 * <nds-snackbar-host> — Snackbar 의 Provider 인프라(포지셔닝·자동닫힘·단일교체·스택)의 vanilla 버전.
 *
 * <nds-snackbar> 는 부모가 표시를 통제하는 선언형 인라인 카드이고, 이 host 는 매니저 역할만 하며
 * snackbar viewport 를 document.body 로 portal 렌더링한다. (nds-toast 매니저의 Snackbar 판)
 *
 * 캐포비 admin 흰 카드 알림(자동 사라짐·우측 상단·단일 교체)이 이 host 의 주 사용처다 —
 * project="cashwalk-biz" + data-project cascade 로 흰 카드 외형이 적용된다.
 */

import { NdsElement, define } from "../base/nds-element.js";

const SB_CLASS = "nds-snackbar";
const SB_VIEWPORT_CLASS = `${SB_CLASS}__viewport`;
const SB_ICON_CLASS = `${SB_CLASS}__icon`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_DESC_CLASS = `${SB_CLASS}__desc`;
const SB_ACTION_CLASS = `${SB_CLASS}__action`;
const SB_CLOSE_CLASS = `${SB_CLASS}__close`;

export type SnackbarVariant = "info" | "success" | "warning" | "error";
export type SnackbarPosition = "top" | "bottom" | "top-right";
export type SnackbarProject = "default" | "cashwalk-biz";

export interface SnackbarShowOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: SnackbarVariant;
  duration?: number;
  actionLabel?: string;
  closable?: boolean;
}

interface SnackbarHostItem {
  id: string;
  title: string;
  description?: string;
  variant?: SnackbarVariant;
  duration: number;
  actionLabel?: string;
  closable: boolean;
}

const VARIANTS: readonly SnackbarVariant[] = ["info", "success", "warning", "error"];
const POSITIONS: readonly SnackbarPosition[] = ["top", "bottom", "top-right"];

const CLOSE_ICON_SVG =
  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/** 인라인 카드용 라인 글리프(20×20). variant 별. */
const CIRCLE_ICON_SVG: Record<SnackbarVariant, string> = {
  info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/><path d="M10 6v5M10 13.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2l9 16H1L10 2z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 8v4M10 14.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

/** 프로젝트 카드용 status 칩(24×24) — 둥근 사각형 칩 + 흰 글리프. */
const CHIP_RECT = '<rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor"/>';
const CHIP_ICON_SVG: Record<SnackbarVariant, string> = {
  info: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${CHIP_RECT}<circle cx="12" cy="8" r="1.1" fill="#fff"/><path d="M12 11v5.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  success: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${CHIP_RECT}<path d="M8 12.3l2.8 2.8 5.4-5.8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${CHIP_RECT}<path d="M12 7.5v5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1.1" fill="#fff"/></svg>`,
  error: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${CHIP_RECT}<path d="M9 9l6 6M15 9l-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
};

let snackbarId = 0;

export class NdsSnackbarHost extends NdsElement {
  static elementName = "nds-snackbar-host";

  static get observedAttributes(): readonly string[] {
    return ["position", "duration", "max-count", "project"];
  }

  private _viewport: HTMLDivElement | null = null;
  private _items: SnackbarHostItem[] = [];
  private _timers = new Map<string, ReturnType<typeof setTimeout>>();

  private _handleShow = (event: Event): void => {
    const detail = (event as CustomEvent<Partial<SnackbarShowOptions> | string>).detail;
    if (typeof detail === "string") {
      this.show(detail);
      return;
    }
    if (detail?.title) this.show(detail as SnackbarShowOptions);
  };

  private _handleDismiss = (event: Event): void => {
    const detail = (event as CustomEvent<{ id?: string }>).detail;
    if (detail?.id) this.dismiss(detail.id);
    else this.clear();
  };

  override connectedCallback(): void {
    this._ensureViewport();
    window.addEventListener("nds-snackbar-show", this._handleShow);
    window.addEventListener("nds-snackbar-dismiss", this._handleDismiss);
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    window.removeEventListener("nds-snackbar-show", this._handleShow);
    window.removeEventListener("nds-snackbar-dismiss", this._handleDismiss);
    this.clear();
    this._viewport?.remove();
    this._viewport = null;
  }

  show(
    titleOrOptions: string | SnackbarShowOptions,
    options: Partial<SnackbarShowOptions> = {},
  ): string {
    const input =
      typeof titleOrOptions === "string"
        ? { ...options, title: titleOrOptions }
        : { ...titleOrOptions };
    const id = input.id ?? `nds-snackbar-${++snackbarId}`;
    const item: SnackbarHostItem = {
      id,
      title: input.title,
      description: input.description,
      variant: input.variant && VARIANTS.includes(input.variant) ? input.variant : undefined,
      duration: input.duration ?? this._numberAttr("duration", 4000),
      actionLabel: input.actionLabel,
      closable: input.closable ?? true,
    };

    this._items = [...this._items.filter((entry) => entry.id !== id), item].slice(
      -this._maxCount(),
    );
    this._renderViewport();
    this._scheduleDismiss(item);
    this.dispatchEvent(
      new CustomEvent("nds-snackbar-open", { detail: { id, item }, bubbles: true }),
    );
    return id;
  }

  dismiss(id: string): void {
    const before = this._items.length;
    this._items = this._items.filter((item) => item.id !== id);
    this._clearTimer(id);
    if (this._items.length !== before) {
      this._renderViewport();
      this.dispatchEvent(new CustomEvent("nds-snackbar-close", { detail: { id }, bubbles: true }));
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
  }

  private _ensureViewport(): void {
    if (this._viewport || typeof document === "undefined") return;
    const viewport = document.createElement("div");
    viewport.dataset.slot = "viewport";
    viewport.className = SB_VIEWPORT_CLASS;
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

  private _project(): SnackbarProject {
    return this.getAttribute("project") === "cashwalk-biz" ? "cashwalk-biz" : "default";
  }

  private _createItem(item: SnackbarHostItem): HTMLDivElement {
    const root = document.createElement("div");
    root.dataset.slot = "item";
    if (item.variant) root.dataset.variant = item.variant;
    root.dataset.hasDesc = item.description ? "true" : "false";
    root.dataset.entering = "true";
    root.dataset.exiting = "false";
    root.className = SB_CLASS;
    root.role = item.variant === "error" ? "alert" : "status";
    root.setAttribute("aria-live", item.variant === "error" ? "assertive" : "polite");

    if (item.variant) {
      const icon = document.createElement("span");
      icon.className = SB_ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML =
        this._project() === "cashwalk-biz"
          ? CHIP_ICON_SVG[item.variant]
          : CIRCLE_ICON_SVG[item.variant];
      root.appendChild(icon);
    }

    const body = document.createElement("div");
    body.className = SB_BODY_CLASS;
    const title = document.createElement("p");
    title.className = SB_TITLE_CLASS;
    title.textContent = item.title;
    body.appendChild(title);
    if (item.description) {
      const desc = document.createElement("p");
      desc.className = SB_DESC_CLASS;
      desc.textContent = item.description;
      body.appendChild(desc);
    }
    root.appendChild(body);

    if (item.actionLabel) {
      const action = document.createElement("button");
      action.type = "button";
      action.className = SB_ACTION_CLASS;
      action.textContent = item.actionLabel;
      action.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("nds-snackbar-action", { detail: { id: item.id, item }, bubbles: true }),
        );
        this.dismiss(item.id);
      });
      root.appendChild(action);
    }

    if (item.closable) {
      const close = document.createElement("button");
      close.type = "button";
      close.className = SB_CLOSE_CLASS;
      close.setAttribute("aria-label", "닫기");
      close.innerHTML = CLOSE_ICON_SVG;
      close.addEventListener("click", () => this.dismiss(item.id));
      root.appendChild(close);
    }

    return root;
  }

  private _scheduleDismiss(item: SnackbarHostItem): void {
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
    return Number.isFinite(value) && this.getAttribute(name) !== null ? value : defaultValue;
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
    "nds-snackbar-host": NdsSnackbarHost;
  }
}

define(NdsSnackbarHost);
