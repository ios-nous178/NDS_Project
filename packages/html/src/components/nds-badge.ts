/**
 * <nds-badge> — Web Component version of React Badge.
 *
 * DOM:
 *   <nds-badge variant="fill" color="brand" size="md">NEW</nds-badge>
 *
 *   → <span class="nds-badge" data-slot="root" data-variant="fill" data-color="brand"
 *           data-size="md" data-shape="default">
 *       <span class="nds-badge__label" data-slot="label">NEW</span>
 *     </span>
 *
 * 색(variant×color)·치수(size)·shape 라운드는 @nudge-design/styles 의 .nds-badge
 * CSS 룰이 data-variant/data-color/data-size/data-shape 로 합성한다 (react 미러와 동일).
 * WC 는 data-attr 만 set — 인라인 색/치수 스타일은 박지 않는다.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

export type BadgeVariant = "fill" | "ghost" | "line";
export type BadgeColor = "brand" | "neutral" | "success" | "error" | "caution" | "info";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeShape = "default" | "pill";
export type BadgeType = "label" | "dot" | "count";

const VARIANTS: readonly BadgeVariant[] = ["fill", "ghost", "line"];
const COLORS: readonly BadgeColor[] = ["brand", "neutral", "success", "error", "caution", "info"];
const SIZES: readonly BadgeSize[] = ["sm", "md", "lg"];
const SHAPES: readonly BadgeShape[] = ["default", "pill"];
const TYPES: readonly BadgeType[] = ["label", "dot", "count"];

export class NdsBadge extends NdsElement {
  static elementName = "nds-badge";

  // react Props 파생분은 코드젠 SSOT (generated/component-attrs.ts)
  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-badge"].observedAttributes];
  }

  private _root: HTMLSpanElement | null = null;
  private _label: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("span");
    const label = document.createElement("span");
    root.className = "nds-badge";
    root.dataset.slot = "root";
    label.className = "nds-badge__label";
    label.dataset.slot = "label";
    while (this.firstChild) label.appendChild(this.firstChild);
    root.appendChild(label);
    this.appendChild(root);
    this._root = root;
    this._label = label;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = this._norm("variant", VARIANTS, "fill");
    const color = this._norm("color", COLORS, "neutral");
    const size = this._norm("size", SIZES, "md");
    const shape = this._norm("shape", SHAPES, "default");
    const type = this._norm("type", TYPES, "label");

    // 색·치수·shape·type geometry 는 @nudge-design/styles 의 .nds-badge CSS 룰이 data-attr 로 합성.
    // (type=dot 은 CSS 가 라벨을 display:none — react 미러와 동일하게 라벨 DOM 은 유지.)
    // WC 는 data-attr 만 set — 인라인 색/치수는 박지 않는다 (react 미러와 동일).
    const root = this._root;
    root.dataset.variant = variant;
    root.dataset.color = color;
    root.dataset.size = size;
    root.dataset.shape = shape;
    root.dataset.type = type;
  }

  private _norm<T extends string>(attrName: string, allowed: readonly T[], fallback: T): T {
    const v = this.attr(attrName, fallback);
    return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  }
}

define(NdsBadge);
