/**
 * <nds-skeleton> — DS Skeleton 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Skeleton.tsx 와 동일):
 *   <nds-skeleton variant="text" width="120" height="20"></nds-skeleton>
 *     └─ <div class="nds-skeleton" data-slot="root" data-variant="text"
 *             style="width: 120px; height: 20px"></div>
 */

import { NdsElement, define } from "../base/nds-element.js";

const SK_CLASS = "nds-skeleton";

export type SkeletonVariant = "rectangular" | "circular" | "text";

const VARIANTS: readonly SkeletonVariant[] = ["rectangular", "circular", "text"];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsSkeleton extends NdsElement {
  static elementName = "nds-skeleton";

  static get observedAttributes(): readonly string[] {
    return ["variant", "width", "height", "radius", ...FORWARDED_ATTRS];
  }

  private _inner: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._inner) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const inner = document.createElement("div");
    inner.className = SK_CLASS;
    inner.dataset.slot = "root";
    inner.setAttribute("aria-hidden", "true");
    this.appendChild(inner);
    this._inner = inner;
  }

  protected update(): void {
    if (!this._inner) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const variant = this._normalizedVariant();
    const width = this._dimensionAttr("width");
    const height = this._dimensionAttr("height");
    const radius = this._numberAttr("radius");

    this._inner.dataset.variant = variant;
    this._inner.style.width = width ?? "100%";
    this._inner.style.height = height ?? (variant === "circular" ? (width ?? "") : "");

    if (radius === undefined) this._inner.style.removeProperty("--nds-skeleton-radius");
    else this._inner.style.setProperty("--nds-skeleton-radius", `${radius}px`);

    const hasA11yLabel = this.hasAttribute("aria-label") || this.hasAttribute("aria-labelledby");
    if (hasA11yLabel) {
      this._inner.removeAttribute("aria-hidden");
    } else {
      this._inner.setAttribute("aria-hidden", "true");
    }

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._inner.removeAttribute(name);
      else this._inner.setAttribute(name, value);
    }
  }

  private _normalizedVariant(): SkeletonVariant {
    const value = this.attr("variant", "rectangular");
    return (VARIANTS as readonly string[]).includes(value)
      ? (value as SkeletonVariant)
      : "rectangular";
  }

  private _dimensionAttr(name: string): string | undefined {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return undefined;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return `${parsed}px`;
    return value;
  }

  private _numberAttr(name: string): number | undefined {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}

define(NdsSkeleton);
