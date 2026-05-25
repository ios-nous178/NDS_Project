/**
 * <nds-media-thumbnail> — DS MediaThumbnail 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-media-thumbnail
 *     src="/img/p.jpg"
 *     alt="상품 이미지"
 *     aspect-ratio="16/9"
 *     rounded="md"
 *     fit="cover"
 *     fallback-src="/img/fallback.jpg"
 *   ></nds-media-thumbnail>
 *
 * 속성:
 *   src / alt
 *   aspect-ratio (CSS aspect-ratio 문법 또는 숫자)
 *   width (CSS 길이)
 *   fit: "cover" | "contain"
 *   rounded: "none" | "sm" | "md" | "lg" | "pill"
 *   fallback-src
 *   eager: lazy 비활성화
 */

import { NdsElement, define } from "../base/nds-element.js";
import { radius } from "@nudge-eap/tokens";

const MT_CLASS = "nds-media-thumbnail";
const MT_IMG_CLASS = `${MT_CLASS}__img`;
const MT_PLACEHOLDER_CLASS = `${MT_CLASS}__placeholder`;

export type MediaRounded = "none" | "sm" | "md" | "lg" | "pill";
export type MediaFit = "cover" | "contain";

const ROUND_PX: Record<MediaRounded, number | string> = {
  none: 0,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  pill: radius.pill,
};

const PlaceholderIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "32");
  svg.setAttribute("height", "32");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="11" cy="13" r="2" fill="currentColor"/>
    <path d="M5 22L11 17L17 22L27 14" stroke="currentColor" stroke-width="1.5" fill="none"/>`;
  return svg;
};

export class NdsMediaThumbnail extends NdsElement {
  static elementName = "nds-media-thumbnail";

  static get observedAttributes(): readonly string[] {
    return ["src", "alt", "aspect-ratio", "width", "fit", "rounded", "fallback-src", "eager"];
  }

  private _root: HTMLSpanElement | null = null;
  private _img: HTMLImageElement | null = null;
  private _placeholder: HTMLSpanElement | null = null;
  private _loaded = false;
  private _errored = false;
  private _currentSrc = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("span");
    root.dataset.slot = "root";
    root.className = MT_CLASS;

    const img = document.createElement("img");
    img.dataset.slot = "img";
    img.className = MT_IMG_CLASS;
    img.decoding = "async";
    img.addEventListener("load", () => {
      this._loaded = true;
      this.scheduleUpdate();
    });
    img.addEventListener("error", () => {
      const fallback = this.getAttribute("fallback-src");
      if (fallback && this._currentSrc !== fallback) {
        this._currentSrc = fallback;
        img.src = fallback;
        return;
      }
      this._errored = true;
      this.scheduleUpdate();
    });

    const placeholder = document.createElement("span");
    placeholder.dataset.slot = "placeholder";
    placeholder.className = MT_PLACEHOLDER_CLASS;
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.appendChild(PlaceholderIcon());

    root.append(img, placeholder);
    this.appendChild(root);

    this._root = root;
    this._img = img;
    this._placeholder = placeholder;
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name === "src" && oldValue !== newValue) {
      this._loaded = false;
      this._errored = false;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  protected update(): void {
    if (!this._root || !this._img || !this._placeholder) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const src = this.getAttribute("src") || "";
    const alt = this.getAttribute("alt") || "";
    const aspectRatioAttr = this.getAttribute("aspect-ratio");
    const width = this.getAttribute("width");
    const fit = (this.getAttribute("fit") as MediaFit) || "cover";
    const rounded = (this.getAttribute("rounded") as MediaRounded) || "md";
    const eager = this.boolAttr("eager");

    const aspectRatio = aspectRatioAttr
      ? /^\d+(\.\d+)?$/.test(aspectRatioAttr)
        ? `${aspectRatioAttr} / 1`
        : aspectRatioAttr
      : "";

    if (width) this._root.style.width = width;
    else this._root.style.removeProperty("width");
    if (aspectRatio) this._root.style.aspectRatio = aspectRatio;
    else this._root.style.removeProperty("aspect-ratio");
    this._root.style.borderRadius = String(ROUND_PX[rounded]);

    if (this._currentSrc !== src) {
      this._currentSrc = src;
    }

    if (!this._errored) {
      if (this._img.src !== src) this._img.src = src;
      this._img.alt = alt;
      this._img.loading = eager ? "eager" : "lazy";
      this._img.style.objectFit = fit;
      this._img.dataset.loaded = this._loaded ? "true" : "false";
      this._img.style.display = "";
    } else {
      this._img.style.display = "none";
    }

    this._placeholder.style.display = !this._loaded || this._errored ? "" : "none";
  }
}

define(NdsMediaThumbnail);
