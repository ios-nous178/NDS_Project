/**
 * <nds-avatar> — DS Avatar 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Avatar.tsx 와 동일):
 *   <nds-avatar src="/profile.png" alt="홍길동" size="md"></nds-avatar>
 *     └─ <div class="nds-avatar" data-slot="root" data-size="md" style="--nds-avatar-*">
 *          └─ <img class="nds-avatar__image" data-slot="image" ...>
 *        </div>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const AV_CLASS = "nds-avatar";
const AV_IMAGE_CLASS = `${AV_CLASS}__image`;
const AV_FALLBACK_CLASS = `${AV_CLASS}__fallback`;

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CONFIG: Record<AvatarSize, { size: number; fontSize: number }> = {
  xs: { size: 24, fontSize: 10 },
  sm: { size: 32, fontSize: 12 },
  md: { size: 40, fontSize: 14 },
  lg: { size: 48, fontSize: 16 },
  xl: { size: 64, fontSize: 20 },
};

const SIZE_NAMES = Object.keys(SIZE_CONFIG) as AvatarSize[];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsAvatar extends NdsElement {
  static elementName = "nds-avatar";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-avatar"].observedAttributes, "fallback", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _imageErrorSrc: string | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.className = AV_CLASS;
    root.dataset.slot = "root";
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const size = this._normalizedSize();
    const cfg = SIZE_CONFIG[size];
    const src = this.getAttribute("src");
    const showImage = !!src && src !== this._imageErrorSrc;

    this._root.dataset.size = size;
    this._root.style.setProperty("--nds-avatar-size", `${cfg.size}px`);
    this._root.style.setProperty("--nds-avatar-font-size", `${cfg.fontSize}px`);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren(showImage ? this._createImage(src) : this._createFallback());
  }

  private _createImage(src: string): HTMLImageElement {
    const img = document.createElement("img");
    img.dataset.slot = "image";
    img.className = AV_IMAGE_CLASS;
    img.src = src;
    img.alt = this.getAttribute("alt") ?? "";
    img.addEventListener("error", () => {
      this._imageErrorSrc = src;
      this.scheduleUpdate();
    });
    return img;
  }

  private _createFallback(): HTMLSpanElement {
    const span = document.createElement("span");
    span.className = AV_FALLBACK_CLASS;
    const fallback = this.getAttribute("fallback");
    const name = this.getAttribute("name");
    if (fallback !== null) {
      span.textContent = fallback;
    } else if (name) {
      span.textContent = getInitials(name);
    } else {
      span.appendChild(createDefaultIcon());
    }
    return span;
  }

  private _normalizedSize(): AvatarSize {
    const value = this.attr("size", "md");
    return (SIZE_NAMES as readonly string[]).includes(value) ? (value as AvatarSize) : "md";
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function createDefaultIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "8");
  circle.setAttribute("r", "4");
  circle.setAttribute("fill", "currentColor");
  svg.appendChild(circle);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  svg.appendChild(path);

  return svg;
}

define(NdsAvatar);
