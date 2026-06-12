/**
 * <nds-validation-chip> — Web Component version of React ValidationChip.
 *
 * DOM:
 *   <nds-validation-chip state="complete">6자 이상</nds-validation-chip>
 *
 *   → <span class="nds-validation-chip" data-slot="root" data-state="complete" style="...인라인...">
 *       <span class="nds-validation-chip__icon" data-slot="icon">…svg…</span>
 *       <span class="nds-validation-chip__label" data-slot="label">6자 이상</span>
 *     </span>
 *
 * React ValidationChip 과 동일하게 모든 시각 속성을 인라인 style 로 박는다 —
 * stylesheet 에 .nds-validation-chip 룰이 없는 게 정상(Badge 와 같은 방식).
 * 아이콘·텍스트는 root 의 color(상태색)을 currentColor 로 상속한다.
 */

import { NdsElement, define } from "../base/nds-element.js";

export type ValidationChipState = "incomplete" | "complete" | "error";

const STATES: readonly ValidationChipState[] = ["incomplete", "complete", "error"];

const FORWARDED_ATTRS = ["role", "aria-label", "aria-labelledby", "title"] as const;

const VC_CLASS = "nds-validation-chip";

const STATE_COLOR: Record<ValidationChipState, string> = {
  incomplete: "var(--semantic-text-muted-default, #999999)",
  complete: "var(--semantic-text-brand-default, #2b96ed)",
  error: "var(--semantic-text-status-error, #f13f00)",
};

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
    root.dataset.state = state;

    // React ValidationChip 의 rootStyle 과 1:1 동일
    Object.assign(root.style, {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--semantic-gap-tight, 4px)",
      color: STATE_COLOR[state],
      fontFamily: "var(--font-family-web, 'Pretendard', -apple-system, sans-serif)",
      fontSize: "12px",
      lineHeight: "normal",
      fontWeight: "400",
      whiteSpace: "nowrap",
    });

    Object.assign(this._icon.style, {
      display: "inline-flex",
      flexShrink: "0",
      width: "16px",
      height: "16px",
    });

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
