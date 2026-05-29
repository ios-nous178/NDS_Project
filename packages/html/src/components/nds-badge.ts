/**
 * <nds-badge> — Web Component version of React Badge.
 *
 * DOM:
 *   <nds-badge variant="fill" color="brand" size="md">NEW</nds-badge>
 *
 *   → <span class="nds-badge" data-slot="root" data-variant="fill" data-color="brand" data-size="md"
 *           style="...전체 시각 속성 인라인...">
 *       <span class="nds-badge__label" data-slot="label">NEW</span>
 *     </span>
 *
 * 주의: React Badge 는 styles.css 에 .nds-badge 룰을 두지 않고, 모든 시각 속성
 * (height/padding/fontSize/border/background/color) 을 인라인 style 로 직접 박는다.
 * WC 도 똑같이 한다 — stylesheet 에 .nds-badge 룰이 없는 게 정상.
 */

import { NdsElement, define } from "../base/nds-element.js";

export type BadgeVariant = "fill" | "ghost" | "line";
export type BadgeColor = "brand" | "neutral" | "success" | "error" | "caution" | "info";
export type BadgeSize = "sm" | "md" | "lg";

const VARIANTS: readonly BadgeVariant[] = ["fill", "ghost", "line"];
const COLORS: readonly BadgeColor[] = ["brand", "neutral", "success", "error", "caution", "info"];
const SIZES: readonly BadgeSize[] = ["sm", "md", "lg"];

interface ColorTokens {
  background: string;
  text: string;
  border: string;
}

const FILL_COLORS: Record<BadgeColor, ColorTokens> = {
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
  info: {
    background: "var(--semantic-bg-status-info)",
    text: "var(--semantic-text-status-info)",
    border: "transparent",
  },
};

const GHOST_COLORS: Record<BadgeColor, ColorTokens> = {
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
  info: {
    background: "var(--semantic-bg-status-info)",
    text: "var(--semantic-text-status-info)",
    border: "transparent",
  },
};

const LINE_COLORS: Record<BadgeColor, ColorTokens> = {
  brand: {
    background: "transparent",
    text: "var(--semantic-text-brand-default)",
    border: "var(--semantic-border-brand-default)",
  },
  neutral: {
    background: "transparent",
    text: "var(--semantic-text-normal-default)",
    border: "var(--semantic-border-normal-default)",
  },
  success: {
    background: "transparent",
    text: "var(--semantic-text-status-success)",
    border: "var(--semantic-text-status-success)",
  },
  error: {
    background: "transparent",
    text: "var(--semantic-text-status-error)",
    border: "var(--semantic-border-status-error)",
  },
  caution: {
    background: "transparent",
    text: "var(--semantic-text-status-caution)",
    border: "var(--semantic-border-status-caution)",
  },
  info: {
    background: "transparent",
    text: "var(--semantic-text-status-info)",
    border: "var(--semantic-text-status-info)",
  },
};

const COLORS_BY_VARIANT: Record<BadgeVariant, Record<BadgeColor, ColorTokens>> = {
  fill: FILL_COLORS,
  ghost: GHOST_COLORS,
  line: LINE_COLORS,
};

interface SizeTokens {
  height: number;
  paddingY: number;
  paddingX: number;
  radius: number;
  fontSize: number;
  lineHeight: number;
}

const SIZE_TOKENS: Record<BadgeSize, SizeTokens> = {
  sm: { height: 22, paddingY: 3, paddingX: 6, radius: 4, fontSize: 11, lineHeight: 14 },
  md: { height: 26, paddingY: 4, paddingX: 8, radius: 4, fontSize: 13, lineHeight: 18 },
  lg: { height: 30, paddingY: 5, paddingX: 10, radius: 6, fontSize: 14, lineHeight: 20 },
};

export class NdsBadge extends NdsElement {
  static elementName = "nds-badge";

  static get observedAttributes(): readonly string[] {
    return ["variant", "color", "size"];
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

    const ct = COLORS_BY_VARIANT[variant][color];
    const st = SIZE_TOKENS[size];

    const root = this._root;
    root.dataset.variant = variant;
    root.dataset.color = color;
    root.dataset.size = size;

    // React Badge 의 rootStyle 객체와 1:1 동일
    Object.assign(root.style, {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--semantic-gap-tight)",
      height: `${st.height}px`,
      padding: `${st.paddingY}px ${st.paddingX}px`,
      borderRadius: `${st.radius}px`,
      background: ct.background,
      color: ct.text,
      border: `1px solid ${ct.border}`,
      fontFamily: "var(--font-family-web, 'Pretendard', -apple-system, sans-serif)",
      fontSize: `${st.fontSize}px`,
      lineHeight: `${st.lineHeight}px`,
      fontWeight: "700",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
    });
  }

  private _norm<T extends string>(attrName: string, allowed: readonly T[], fallback: T): T {
    const v = this.attr(attrName, fallback);
    return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  }
}

define(NdsBadge);
