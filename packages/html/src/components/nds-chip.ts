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
 *       <span class="nds-chip__icon" data-slot="icon" aria-hidden="true">…</span>  ← optional, slot="icon"
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
 *   <nds-chip selected><svg slot="icon">…</svg>30대</nds-chip> ← 좌측 아이콘(React icon prop 미러)
 *
 * React 의 onClick / onRemove 콜백은 WC 에서 attribute 로 표현 불가능 (함수 X) →
 * boolean attribute (`interactive`, `removable`) + CustomEvent 패턴.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { REMOVE_ICON_SVG } from "../base/remove-icon.js";

export type ChipVariant = "fill" | "outlined" | "ghost";
export type ChipColor = "brand" | "neutral" | "success" | "error" | "caution";
export type ChipSize = "sm" | "md";

const VARIANTS: readonly ChipVariant[] = ["fill", "outlined", "ghost"];
const COLORS: readonly ChipColor[] = ["brand", "neutral", "success", "error", "caution"];
const SIZES: readonly ChipSize[] = ["sm", "md"];

// variant×color / selected 별 색은 styles/src/Chip.ts 의 [data-variant][data-color] /
// [data-selected="true"][data-color] CSS 룰이 --nds-chip-bg/fg/border 슬롯에 주입한다.
// 여기(WC)에서는 색을 더 이상 박지 않는다 — data-variant/data-color/data-selected 만 set.

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
  private _icon: HTMLSpanElement | null = null;
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

    // 좌측 아이콘 슬롯 — 자식 중 slot="icon"(또는 data-slot="icon") 을 분리해 label 앞에 둔다.
    // React Chip 의 icon prop 미러. 못 찾으면(텍스트만) 기존 동작 그대로.
    const iconEl = Array.from(this.children).find(
      (c) => c.getAttribute("slot") === "icon" || (c as HTMLElement).dataset?.slot === "icon",
    );
    if (iconEl) {
      const iconSpan = document.createElement("span");
      iconSpan.className = "nds-chip__icon";
      iconSpan.dataset.slot = "icon";
      iconSpan.setAttribute("aria-hidden", "true");
      iconEl.removeAttribute("slot");
      iconSpan.appendChild(iconEl);
      root.appendChild(iconSpan);
      this._icon = iconSpan;
    }

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

    // selected 는 React Chip.tsx 와 동일하게 brand 채움(FILL)이 기본 선택표시이며,
    // 브랜드가 brand-subtle 등 다른 선택 톤을 원하면 `--nds-chip-selected-*` 로 override.
    // 색은 styles/src/Chip.ts 의 [data-variant][data-color] / [data-selected] CSS 룰이 슬롯에 주입 —
    // 여기서는 data-* attr 만 set, 인라인 색은 박지 않는다.
    const st = SIZE_TOKENS[size];
    const paddingRight = removable ? Math.max(st.paddingX - 4, 6) : st.paddingX;
    // 치수는 --nds-chip-* 슬롯로 합성 (react Chip.tsx 미러) — 브랜드가 토큰 맵에서 override.
    const chipPadY = `var(--nds-chip-padding-y, ${st.paddingY}px)`;
    const chipPadX = `var(--nds-chip-padding-x, ${st.paddingX}px)`;
    const chipPadRight = removable ? `${paddingRight}px` : chipPadX;

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
      height: `var(--nds-chip-height, ${st.height}px)`,
      padding: `${chipPadY} ${chipPadRight} ${chipPadY} ${chipPadX}`,
      borderRadius: "9999px",
      // 색(background/color/border)은 styles/src/Chip.ts 의 [data-variant][data-color] /
      // [data-selected] CSS 룰이 슬롯에 주입 — 여기서 인라인으로 박지 않는다.
      fontFamily: "var(--font-family-web, 'Pretendard', -apple-system, sans-serif)",
      fontSize: `var(--nds-chip-font-size, ${st.fontSize}px)`,
      lineHeight: `var(--nds-chip-line-height, ${st.lineHeight}px)`,
      fontWeight: `var(--nds-chip-font-weight, 700)`,
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
      btn.innerHTML = REMOVE_ICON_SVG;
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
