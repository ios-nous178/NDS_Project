/**
 * <nds-dim> — DS Dim(백드롭) 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Dim.tsx 와 동일):
 *   <nds-dim type="strong" animated></nds-dim>
 *     └─ <div class="nds-dim" data-slot="root" data-type="strong"
 *            data-animated="true" aria-hidden="true">
 *
 * 백드롭 클릭 시 `nds-dim-close` CustomEvent(bubbles·composed)를 디스패치한다 — 오버레이
 * 닫기 배선용(React `onClose` 미러). nds-modal/nds-bottom-sheet 의 `*-close` 컨벤션과 동일.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const DIM_CLASS = "nds-dim";

export type DimType = "subtle" | "default" | "strong";

const TYPES: readonly DimType[] = ["subtle", "default", "strong"];

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsDim extends NdsElement {
  static elementName = "nds-dim";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-dim"].observedAttributes, ...FORWARDED_ATTRS];
  }

  private _inner: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._inner) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const inner = document.createElement("div");
    inner.className = DIM_CLASS;
    inner.dataset.slot = "root";
    inner.setAttribute("aria-hidden", "true");
    inner.addEventListener("click", this._onClick);
    this.appendChild(inner);
    this._inner = inner;
  }

  private _onClick = (): void => {
    this.dispatchEvent(new CustomEvent("nds-dim-close", { bubbles: true, composed: true }));
  };

  protected update(): void {
    if (!this._inner) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    this._inner.dataset.type = this._normalizedType();

    // animated: attr 없음 = true(React 기본값 미러), "false" = 비활성, 그 외 present = true.
    const animatedAttr = this.getAttribute("animated");
    if (animatedAttr === null ? true : animatedAttr !== "false") {
      this._inner.dataset.animated = "true";
    } else {
      delete this._inner.dataset.animated;
    }

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._inner.removeAttribute(name);
      else this._inner.setAttribute(name, value);
    }
  }

  private _normalizedType(): DimType {
    const value = this.attr("type", "default");
    return (TYPES as readonly string[]).includes(value) ? (value as DimType) : "default";
  }
}

define(NdsDim);
