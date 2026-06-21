/**
 * <nds-divider> — DS Divider 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Divider.tsx 와 동일):
 *   <nds-divider orientation="vertical" type="line" tone="normal" thickness="2" spacing="12"></nds-divider>
 *     └─ <hr class="nds-divider" data-slot="root" data-orientation="vertical"
 *            data-type="line" data-tone="normal"
 *            role="separator" aria-orientation="vertical" style="--nds-divider-*: ...">
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const DIV_CLASS = "nds-divider";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerType = "line" | "block";
export type DividerTone = "subtle" | "normal" | "strong";

const ORIENTATIONS: readonly DividerOrientation[] = ["horizontal", "vertical"];
const TYPES: readonly DividerType[] = ["line", "block"];
const TONES: readonly DividerTone[] = ["subtle", "normal", "strong"];

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsDivider extends NdsElement {
  static elementName = "nds-divider";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-divider"].observedAttributes, ...FORWARDED_ATTRS];
  }

  private _inner: HTMLHRElement | null = null;

  override connectedCallback(): void {
    if (!this._inner) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const inner = document.createElement("hr");
    inner.className = DIV_CLASS;
    inner.dataset.slot = "root";
    inner.setAttribute("role", "separator");
    this.appendChild(inner);
    this._inner = inner;
  }

  protected update(): void {
    if (!this._inner) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const orientation = this._normalizedOrientation();
    this._inner.dataset.orientation = orientation;
    this._inner.setAttribute("aria-orientation", orientation);

    this._inner.dataset.type = this._normalizedType();
    this._inner.dataset.tone = this._normalizedTone();

    this._setPxVar("thickness", "--nds-divider-thickness");
    this._setPxVar("spacing", "--nds-divider-spacing");
    this._setStringVar("color", "--nds-divider-color");

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._inner.removeAttribute(name);
      else this._inner.setAttribute(name, value);
    }
  }

  private _normalizedOrientation(): DividerOrientation {
    const value = this.attr("orientation", "horizontal");
    return (ORIENTATIONS as readonly string[]).includes(value)
      ? (value as DividerOrientation)
      : "horizontal";
  }

  private _normalizedType(): DividerType {
    const value = this.attr("type", "line");
    return (TYPES as readonly string[]).includes(value) ? (value as DividerType) : "line";
  }

  private _normalizedTone(): DividerTone {
    const value = this.attr("tone", "normal");
    return (TONES as readonly string[]).includes(value) ? (value as DividerTone) : "normal";
  }

  private _setPxVar(attrName: string, varName: string): void {
    if (!this._inner) return;
    const value = this.getAttribute(attrName);
    if (value === null || value.trim() === "") {
      this._inner.style.removeProperty(varName);
      return;
    }
    const parsed = Number(value);
    if (Number.isFinite(parsed)) this._inner.style.setProperty(varName, `${parsed}px`);
    else this._inner.style.removeProperty(varName);
  }

  private _setStringVar(attrName: string, varName: string): void {
    if (!this._inner) return;
    const value = this.getAttribute(attrName);
    if (value === null || value.trim() === "") this._inner.style.removeProperty(varName);
    else this._inner.style.setProperty(varName, value);
  }
}

define(NdsDivider);
