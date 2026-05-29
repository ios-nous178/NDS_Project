/**
 * <nds-chip> — Web Component version of React Chip.
 *
 * DOM (React Chip.tsx 와 동일):
 *   <nds-chip variant="outlined" color="brand" size="md" interactive selected>
 *     라벨
 *   </nds-chip>
 *
 *   → <div class="nds-chip__root" data-slot="root" data-variant=... data-color=... data-size=...
 *          data-selected="false|true" data-interactive="true" data-disabled="false"
 *          role="button" tabindex="0" aria-pressed="false"
 *          style="inline-flex; ...all visual...">
 *       <span class="nds-chip__label" data-slot="label">라벨</span>
 *       <button class="nds-chip__remove" data-slot="remove" aria-label="라벨 삭제" hidden>
 *         <svg>×</svg>
 *       </button>
 *     </div>
 *
 * 이벤트:
 *   · interactive 면 inner div 클릭/Enter/Space → "chip-click" CustomEvent (bubbles)
 *   · removable 이면 inner button 클릭 → "chip-remove" CustomEvent (bubbles, stopProp)
 *
 * 사용자가 attribute 만 박으면 됨:
 *   <nds-chip interactive>...</nds-chip>           ← 클릭 가능
 *   <nds-chip interactive removable>...</nds-chip> ← 클릭 가능 + × 버튼
 *
 * React 의 onClick / onRemove 콜백은 WC 에서 attribute 로 표현 불가능 (함수 X) →
 * boolean attribute (`interactive`, `removable`) + CustomEvent 패턴.
 */

import { NdsElement, define } from "../base/nds-element.js";

export type ChipVariant = "fill" | "outlined" | "ghost";
export type ChipColor = "brand" | "neutral" | "success" | "error" | "caution";
export type ChipSize = "sm" | "md";

const VARIANTS: readonly ChipVariant[] = ["fill", "outlined", "ghost"];
const COLORS: readonly ChipColor[] = ["brand", "neutral", "success", "error", "caution"];
const SIZES: readonly ChipSize[] = ["sm", "md"];

interface ColorTokens {
  background: string;
  text: string;
  border: string;
}

const FILL_COLORS: Record<ChipColor, ColorTokens> = {
  brand: {
    background: "var(--semantic-fill-brand-default)",
    text: "var(--semantic-text-inverse-default, #ffffff)",
    border: "transparent",
  },
  neutral: {
    background: "var(--semantic-fill-neutral-default)",
    text: "var(--semantic-text-inverse-default, #ffffff)",
    border: "transparent",
  },
  success: {
    background: "var(--semantic-bg-status-success)",
    text: "var(--semantic-text-status-success)",
    border: "transparent",
  },
  error: {
    background: "var(--semantic-fill-status-error)",
    text: "var(--semantic-text-inverse-default, #ffffff)",
    border: "transparent",
  },
  caution: {
    background: "var(--semantic-fill-status-caution)",
    text: "var(--semantic-text-strong-default)",
    border: "transparent",
  },
};

const OUTLINED_COLORS: Record<ChipColor, ColorTokens> = {
  brand: {
    background: "var(--semantic-bg-surface-default, #ffffff)",
    text: "var(--semantic-text-brand-default)",
    border: "var(--semantic-border-brand-default)",
  },
  neutral: {
    background: "var(--semantic-bg-surface-default, #ffffff)",
    text: "var(--semantic-text-normal-default)",
    border: "var(--semantic-border-normal-default)",
  },
  success: {
    background: "var(--semantic-bg-surface-default, #ffffff)",
    text: "var(--semantic-text-status-success)",
    border: "var(--semantic-text-status-success)",
  },
  error: {
    background: "var(--semantic-bg-surface-default, #ffffff)",
    text: "var(--semantic-text-status-error)",
    border: "var(--semantic-border-status-error)",
  },
  caution: {
    background: "var(--semantic-bg-surface-default, #ffffff)",
    text: "var(--semantic-text-status-caution)",
    border: "var(--semantic-border-status-caution)",
  },
};

const GHOST_COLORS: Record<ChipColor, ColorTokens> = {
  brand: {
    background: "var(--semantic-bg-brand-subtle)",
    text: "var(--semantic-text-brand-default)",
    border: "transparent",
  },
  neutral: {
    background: "var(--semantic-bg-surface-subtle)",
    text: "var(--semantic-text-normal-default)",
    border: "transparent",
  },
  success: {
    background: "var(--semantic-bg-status-success)",
    text: "var(--semantic-text-status-success)",
    border: "transparent",
  },
  error: {
    background: "var(--semantic-bg-status-error)",
    text: "var(--semantic-text-status-error)",
    border: "transparent",
  },
  caution: {
    background: "var(--semantic-bg-status-caution)",
    text: "var(--semantic-text-status-caution)",
    border: "transparent",
  },
};

const COLORS_BY_VARIANT: Record<ChipVariant, Record<ChipColor, ColorTokens>> = {
  fill: FILL_COLORS,
  outlined: OUTLINED_COLORS,
  ghost: GHOST_COLORS,
};

interface SizeTokens {
  height: number;
  paddingY: number;
  paddingX: number;
  fontSize: number;
  lineHeight: number;
}

const SIZE_TOKENS: Record<ChipSize, SizeTokens> = {
  sm: { height: 24, paddingY: 3, paddingX: 10, fontSize: 12, lineHeight: 16 },
  md: { height: 28, paddingY: 4, paddingX: 12, fontSize: 14, lineHeight: 20 },
};

export class NdsChip extends NdsElement {
  static elementName = "nds-chip";

  static get observedAttributes(): readonly string[] {
    return ["variant", "color", "size", "selected", "disabled", "interactive", "removable"];
  }

  private _root: HTMLDivElement | null = null;
  private _label: HTMLSpanElement | null = null;
  private _remove: HTMLButtonElement | null = null;
  private _onRootClick = (e: MouseEvent) => this._handleClick(e);
  private _onRootKey = (e: KeyboardEvent) => this._handleKey(e);
  private _onRemoveClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("chip-remove", { bubbles: true, composed: true }));
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    if (this._root) {
      this._root.removeEventListener("click", this._onRootClick);
      this._root.removeEventListener("keydown", this._onRootKey);
    }
    if (this._remove) this._remove.removeEventListener("click", this._onRemoveClick);
  }

  private _mount(): void {
    const root = document.createElement("div");
    const label = document.createElement("span");

    root.className = "nds-chip__root";
    root.dataset.slot = "root";

    label.className = "nds-chip__label";
    label.dataset.slot = "label";
    while (this.firstChild) label.appendChild(this.firstChild);

    root.appendChild(label);
    root.addEventListener("click", this._onRootClick);
    root.addEventListener("keydown", this._onRootKey);

    this.appendChild(root);
    this._root = root;
    this._label = label;
  }

  protected update(): void {
    if (!this._root || !this._label) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = this._norm("variant", VARIANTS, "outlined");
    const color = this._norm("color", COLORS, "brand");
    const size = this._norm("size", SIZES, "md");
    const selected = this.boolAttr("selected");
    const disabled = this.boolAttr("disabled");
    const interactive = this.boolAttr("interactive");
    const removable = this.boolAttr("removable") && !disabled;

    const ct = selected ? FILL_COLORS[color] : COLORS_BY_VARIANT[variant][color];
    const st = SIZE_TOKENS[size];
    const paddingRight = removable ? Math.max(st.paddingX - 4, 6) : st.paddingX;

    const root = this._root;
    root.dataset.variant = variant;
    root.dataset.color = color;
    root.dataset.size = size;
    root.dataset.selected = String(selected);
    root.dataset.interactive = String(interactive);
    root.dataset.disabled = String(disabled);

    if (interactive) {
      root.setAttribute("role", "button");
      root.setAttribute("aria-pressed", String(selected));
      if (!disabled) root.setAttribute("tabindex", "0");
      else root.removeAttribute("tabindex");
    } else {
      root.removeAttribute("role");
      root.removeAttribute("aria-pressed");
      root.removeAttribute("tabindex");
    }
    if (disabled) root.setAttribute("aria-disabled", "true");
    else root.removeAttribute("aria-disabled");

    Object.assign(root.style, {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--semantic-gap-tight)",
      height: `${st.height}px`,
      padding: `${st.paddingY}px ${paddingRight}px ${st.paddingY}px ${st.paddingX}px`,
      borderRadius: "9999px",
      background: ct.background,
      color: ct.text,
      border: `1px solid ${ct.border}`,
      fontFamily: "var(--font-family-web, 'Pretendard', -apple-system, sans-serif)",
      fontSize: `${st.fontSize}px`,
      lineHeight: `${st.lineHeight}px`,
      fontWeight: "700",
      boxSizing: "border-box",
      userSelect: "none",
      whiteSpace: "nowrap",
    });

    this._syncRemove(removable);
  }

  private _syncRemove(present: boolean): void {
    if (!this._root) return;
    if (present && !this._remove) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nds-chip__remove";
      btn.dataset.slot = "remove";
      btn.setAttribute("aria-label", `${this._label?.textContent ?? ""} 삭제`.trim());
      btn.innerHTML =
        '<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        "</svg>";
      btn.addEventListener("click", this._onRemoveClick);
      this._root.appendChild(btn);
      this._remove = btn;
    } else if (!present && this._remove) {
      this._remove.removeEventListener("click", this._onRemoveClick);
      this._remove.remove();
      this._remove = null;
    }
  }

  private _handleClick(_e: MouseEvent): void {
    if (this.boolAttr("disabled")) return;
    if (!this.boolAttr("interactive")) return;
    this.dispatchEvent(new CustomEvent("chip-click", { bubbles: true, composed: true }));
  }

  private _handleKey(e: KeyboardEvent): void {
    if (!this.boolAttr("interactive") || this.boolAttr("disabled")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("chip-click", { bubbles: true, composed: true }));
    }
  }

  private _norm<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
    const v = this.attr(name, fallback);
    return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  }
}

define(NdsChip);
