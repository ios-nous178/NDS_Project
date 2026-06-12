/**
 * <nds-spinner> — DS Spinner 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Spinner.tsx 와 동일):
 *   <nds-spinner size="lg" label="불러오는 중"></nds-spinner>
 *     └─ <span class="nds-spinner" data-slot="root" role="status"
 *              aria-live="polite" aria-label="불러오는 중"
 *              style="--nds-spinner-size: 32px">
 *          └─ <svg viewBox="0 0 24 24" ...><circle ... /></svg>
 *        </span>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const SP_CLASS = "nds-spinner";

export type SpinnerSize = "sm" | "md" | "lg";

const SIZE_CONFIG: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

const SIZE_NAMES = Object.keys(SIZE_CONFIG) as SpinnerSize[];
const FORWARDED_ATTRS = ["title"] as const;

export class NdsSpinner extends NdsElement {
  static elementName = "nds-spinner";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-spinner"].observedAttributes, ...FORWARDED_ATTRS];
  }

  private _inner: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._inner) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const inner = document.createElement("span");
    inner.className = SP_CLASS;
    inner.dataset.slot = "root";
    inner.setAttribute("role", "status");
    inner.setAttribute("aria-live", "polite");
    inner.appendChild(createSpinnerSvg());
    this.appendChild(inner);
    this._inner = inner;
  }

  protected update(): void {
    if (!this._inner) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    this._inner.setAttribute("aria-label", this.attr("label", "로딩 중"));
    this._inner.style.setProperty("--nds-spinner-size", `${this._normalizedSize()}px`);

    const color = this.getAttribute("color");
    if (color === null || color.trim() === "") {
      this._inner.style.removeProperty("--nds-spinner-color");
    } else {
      this._inner.style.setProperty("--nds-spinner-color", color);
    }

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._inner.removeAttribute(name);
      else this._inner.setAttribute(name, value);
    }
  }

  private _normalizedSize(): number {
    const value = this.attr("size", "md");
    if ((SIZE_NAMES as readonly string[]).includes(value)) return SIZE_CONFIG[value as SpinnerSize];
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    return SIZE_CONFIG.md;
  }
}

function createSpinnerSvg(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "10");
  svg.appendChild(circle);

  return svg;
}

define(NdsSpinner);
