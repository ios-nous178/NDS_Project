/**
 * <nds-banner> — DS Banner 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";

const BN_CLASS = "nds-banner";
const BN_CONTENT_CLASS = `${BN_CLASS}__content`;
const BN_TITLE_CLASS = `${BN_CLASS}__title`;
const BN_DESC_CLASS = `${BN_CLASS}__description`;
const BN_ACTION_CLASS = `${BN_CLASS}__action`;
const BN_IMAGE_CLASS = `${BN_CLASS}__image`;
const BN_CLOSE_CLASS = `${BN_CLASS}__close`;

export type BannerVariant = "filled" | "outlined" | "image";

const VARIANTS: readonly BannerVariant[] = ["filled", "outlined", "image"];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsBanner extends NdsElement {
  static elementName = "nds-banner";

  static get observedAttributes(): readonly string[] {
    return [
      "variant",
      "banner-title",
      "description",
      "action-label",
      "action-href",
      "href",
      "image-src",
      "image-alt",
      "image-width",
      "image-height",
      "full-image-src",
      "full-image-srcset",
      "closable",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = BN_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = this._normalizedVariant();
    const clickable = Boolean(this.getAttribute("href"));
    this._root.dataset.variant = variant;
    this._root.dataset.clickable = clickable ? "true" : "false";
    if (clickable) this._root.setAttribute("role", "link");
    else this._root.removeAttribute("role");

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.onclick = clickable ? () => this._emitNavigate(this.getAttribute("href")!) : null;
    this._root.replaceChildren(
      ...(variant === "image" ? this._createImageVariant() : this._createContentVariant()),
      ...this._createCloseButton(),
    );
  }

  private _createImageVariant(): Node[] {
    const src = this.getAttribute("full-image-src") ?? this.getAttribute("image-src");
    if (!src) return [];
    const img = document.createElement("img");
    img.className = BN_IMAGE_CLASS;
    img.src = src;
    img.alt = this.attr("image-alt", "");
    const srcset = this.getAttribute("full-image-srcset");
    if (srcset) img.srcset = srcset;
    return [img];
  }

  private _createContentVariant(): Node[] {
    const content = document.createElement("div");
    content.className = BN_CONTENT_CLASS;

    const title = this.getAttribute("banner-title");
    if (title) content.appendChild(createText("div", BN_TITLE_CLASS, title));

    const description = this.getAttribute("description");
    if (description) content.appendChild(createText("div", BN_DESC_CLASS, description));

    const actionLabel = this.getAttribute("action-label");
    if (actionLabel) content.appendChild(this._createAction(actionLabel));

    const nodes: Node[] = [content];
    const imageSrc = this.getAttribute("image-src");
    if (imageSrc) {
      const img = document.createElement("img");
      img.className = BN_IMAGE_CLASS;
      img.src = imageSrc;
      img.alt = this.attr("image-alt", "");
      setOptionalNumberAttr(img, "width", this.getAttribute("image-width"));
      setOptionalNumberAttr(img, "height", this.getAttribute("image-height"));
      nodes.push(img);
    }
    return nodes;
  }

  private _createAction(label: string): HTMLElement {
    const href = this.getAttribute("action-href");
    const action = href ? document.createElement("a") : document.createElement("button");
    action.className = BN_ACTION_CLASS;
    action.textContent = label;
    if (href) {
      (action as HTMLAnchorElement).href = href;
    } else {
      (action as HTMLButtonElement).type = "button";
    }
    action.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent("nds-banner-action", { detail: { href }, bubbles: true }));
    });
    return action;
  }

  private _createCloseButton(): Node[] {
    if (!this.boolAttr("closable")) return [];
    const button = document.createElement("button");
    button.type = "button";
    button.className = BN_CLOSE_CLASS;
    button.setAttribute("aria-label", "닫기");
    button.appendChild(createCloseIcon());
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent("nds-banner-close", { bubbles: true }));
      this.remove();
    });
    return [button];
  }

  private _emitNavigate(href: string): void {
    this.dispatchEvent(new CustomEvent("nds-banner-navigate", { detail: { href }, bubbles: true }));
  }

  private _normalizedVariant(): BannerVariant {
    return normalize(this.getAttribute("variant"), VARIANTS, "filled");
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

function setOptionalNumberAttr(el: HTMLElement, name: string, value: string | null): void {
  if (value !== null && value.trim() !== "") el.setAttribute(name, value);
}

function createCloseIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
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

define(NdsBanner);
