/**
 * <nds-validation-chip> — Web Component version of React ValidationChip.
 *
 * DOM:
 *   <nds-validation-chip state="complete">6자 이상</nds-validation-chip>
 *
 *   → <span class="nds-validation-chip" data-slot="root" data-state="complete">
 *       <span class="nds-validation-chip__icon" data-slot="icon">…svg…</span>
 *       <span class="nds-validation-chip__label" data-slot="label">6자 이상</span>
 *     </span>
 *
 * 색·레이아웃은 styles/src/ValidationChip.ts 의 .nds-validation-chip / [data-state] 룰에서만
 * 정의한다 — react/html 은 data-state 만 set(JS 색맵 우회 금지).
 * 아이콘·텍스트는 root 의 color(상태색)을 currentColor 로 상속한다.
 */

import { NdsElement, define } from "../base/nds-element.js";

export type ValidationChipState = "incomplete" | "complete" | "error";

const STATES: readonly ValidationChipState[] = ["incomplete", "complete", "error"];

const FORWARDED_ATTRS = ["role", "aria-label", "aria-labelledby", "title"] as const;

const VC_CLASS = "nds-validation-chip";

const CHECK_SVG =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style="display:block" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M3.5 8.25L6.5 11L12.5 4.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';

const ERROR_SVG =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style="display:block" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';

export class NdsValidationChip extends NdsElement {
  static elementName = "nds-validation-chip";

  static get observedAttributes(): readonly string[] {
    return ["state", ...FORWARDED_ATTRS];
  }

  private _root: HTMLSpanElement | null = null;
  private _icon: HTMLSpanElement | null = null;
  private _label: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("span");
    const icon = document.createElement("span");
    const label = document.createElement("span");

    root.className = VC_CLASS;
    root.dataset.slot = "root";
    icon.className = `${VC_CLASS}__icon`;
    icon.dataset.slot = "icon";
    icon.setAttribute("aria-hidden", "true");
    label.className = `${VC_CLASS}__label`;
    label.dataset.slot = "label";

    while (this.firstChild) label.appendChild(this.firstChild);
    root.appendChild(icon);
    root.appendChild(label);
    this.appendChild(root);

    this._root = root;
    this._icon = icon;
    this._label = label;
  }

  protected update(): void {
    if (!this._root || !this._icon) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const state = this._norm("state", STATES, "incomplete");
    const root = this._root;
    // 색·레이아웃은 styles 의 .nds-validation-chip / [data-state] 룰이 담당 — data-state 만 set.
    root.dataset.state = state;

    const glyphKey = state === "error" ? "error" : "check";
    if (this._icon.dataset.glyph !== glyphKey) {
      this._icon.innerHTML = glyphKey === "error" ? ERROR_SVG : CHECK_SVG;
      this._icon.dataset.glyph = glyphKey;
    }
  }

  private _norm<T extends string>(attrName: string, allowed: readonly T[], fallback: T): T {
    const v = this.attr(attrName, fallback);
    return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  }
}

define(NdsValidationChip);
