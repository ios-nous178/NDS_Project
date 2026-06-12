/**
 * <nds-snackbar> — DS Snackbar 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const SB_CLASS = "nds-snackbar";
const SB_ICON_CLASS = `${SB_CLASS}__icon`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_DESC_CLASS = `${SB_CLASS}__desc`;
const SB_ACTION_CLASS = `${SB_CLASS}__action`;
const SB_CLOSE_CLASS = `${SB_CLASS}__close`;

export type SnackbarVariant = "info" | "success" | "warning" | "error";

const VARIANTS: readonly SnackbarVariant[] = ["info", "success", "warning", "error"];
const VARIANT_CONFIG: Record<SnackbarVariant, { bg: string; fg: string; icon: string }> = {
  info: {
    bg: "var(--semantic-bg-status-info)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-icon-brand-default)",
  },
  success: {
    bg: "var(--semantic-bg-status-success)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-icon-status-success)",
  },
  warning: {
    bg: "var(--semantic-bg-status-caution)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-text-status-caution)",
  },
  error: {
    bg: "var(--semantic-bg-status-error)",
    fg: "var(--semantic-text-normal-default)",
    icon: "var(--semantic-icon-status-error)",
  },
};
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsSnackbar extends NdsElement {
  static elementName = "nds-snackbar";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-snackbar"].observedAttributes, "snackbar-title", "description", "hide-icon", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SB_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = normalize(this.getAttribute("variant"), VARIANTS, "info");
    const cfg = VARIANT_CONFIG[variant];
    const hasDesc = Boolean(this.getAttribute("description"));
    this._root.dataset.variant = variant;
    this._root.dataset.hasDesc = hasDesc ? "true" : "false";
    this._root.style.setProperty("--nds-snackbar-bg", cfg.bg);
    this._root.style.setProperty("--nds-snackbar-fg", cfg.fg);
    this._root.style.setProperty("--nds-snackbar-icon", cfg.icon);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren(
      ...this._createIcon(variant),
      this._createBody(),
      ...this._createAction(),
      ...this._createClose(),
    );
  }

  private _createIcon(variant: SnackbarVariant): Node[] {
    if (this.boolAttr("hide-icon")) return [];
    const span = document.createElement("span");
    span.className = SB_ICON_CLASS;
    span.setAttribute("aria-hidden", "true");
    span.appendChild(createStatusIcon(variant));
    return [span];
  }

  private _createBody(): HTMLDivElement {
    const body = document.createElement("div");
    body.className = SB_BODY_CLASS;
    const title = this.getAttribute("snackbar-title");
    const description = this.getAttribute("description");
    if (title) body.appendChild(createText("p", SB_TITLE_CLASS, title));
    if (description) body.appendChild(createText("p", SB_DESC_CLASS, description));
    return body;
  }

  private _createAction(): Node[] {
    const label = this.getAttribute("action-label");
    if (!label) return [];
    const button = document.createElement("button");
    button.type = "button";
    button.className = SB_ACTION_CLASS;
    button.textContent = label;
    button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("nds-snackbar-action", { bubbles: true }));
    });
    return [button];
  }

  private _createClose(): Node[] {
    if (!this.boolAttr("closable")) return [];
    const button = document.createElement("button");
    button.type = "button";
    button.className = SB_CLOSE_CLASS;
    button.setAttribute("aria-label", "닫기");
    button.appendChild(createCloseIcon());
    button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("nds-snackbar-close", { bubbles: true }));
      this.remove();
    });
    return [button];
  }
}

function createText<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}

function createStatusIcon(variant: SnackbarVariant): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "10");
  circle.setAttribute("cy", "10");
  circle.setAttribute("r", "9");
  circle.setAttribute("fill", "currentColor");
  circle.setAttribute("opacity", "0.15");
  svg.appendChild(circle);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute(
    "d",
    variant === "success"
      ? "M6 10l3 3 5-6"
      : variant === "error"
        ? "M7 7l6 6M13 7l-6 6"
        : variant === "warning"
          ? "M10 6v5M10 13.5v.5"
          : "M10 6v5M10 13.5v.5",
  );
  svg.appendChild(path);
  return svg;
}

function createCloseIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 4L12 12M12 4L4 12");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  svg.appendChild(path);
  return svg;
}

function normalize<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

define(NdsSnackbar);
