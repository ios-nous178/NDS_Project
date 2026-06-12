/**
 * <nds-like-button> — DS LikeButton 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-like-button liked count="12" size="md"></nds-like-button>
 *
 * 이벤트:
 *   nds-like-change (detail: { liked: boolean }) -> 토글
 *
 * 속성:
 *   liked: 좋아요 상태
 *   count: 정수 (없으면 미표시)
 *   size: "sm" | "md" | "lg" (default md)
 *   hide-count: 카운트 숨김
 *   active-color: 활성 색 (CSS color)
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const LB_CLASS = "nds-like-button";
const LB_ICON_CLASS = `${LB_CLASS}__icon`;
const LB_COUNT_CLASS = `${LB_CLASS}__count`;

export type LikeButtonSize = "sm" | "md" | "lg";

const sizeConfig: Record<LikeButtonSize, { icon: number; count: number; gap: number }> = {
  sm: { icon: 16, count: 13, gap: 6 },
  md: { icon: 22, count: 14, gap: 6 },
  lg: { icon: 28, count: 15, gap: 6 },
};

const formatCount = (n: number): string => {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

const HeartPath =
  "M12 20.85l-1.36-1.24C5.4 14.86 2 11.78 2 8c0-3.08 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09C13.09 3.31 14.76 2.5 16.5 2.5 19.58 2.5 22 4.92 22 8c0 3.78-3.4 6.86-8.64 11.61L12 20.85z";

const heartIcon = (size: number, liked: boolean) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.style.display = "block";
  if (liked) {
    svg.setAttribute("fill", "currentColor");
    svg.innerHTML = `<path d="${HeartPath}"/>`;
  } else {
    svg.setAttribute("fill", "none");
    svg.innerHTML = `<path d="${HeartPath}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
  }
  return svg;
};

export class NdsLikeButton extends NdsElement {
  static elementName = "nds-like-button";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-like-button"].observedAttributes];
  }

  private _btn: HTMLButtonElement | null = null;
  private _iconWrap: HTMLSpanElement | null = null;
  private _countEl: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._btn) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.slot = "root";
    btn.className = LB_CLASS;
    btn.addEventListener("click", () => {
      const next = !this.boolAttr("liked");
      if (next) this.setAttribute("liked", "");
      else this.removeAttribute("liked");
      this.dispatchEvent(
        new CustomEvent("nds-like-change", {
          detail: { liked: next },
          bubbles: true,
          composed: true,
        }),
      );
    });

    const iconWrap = document.createElement("span");
    iconWrap.className = LB_ICON_CLASS;
    iconWrap.setAttribute("aria-hidden", "true");

    const countEl = document.createElement("span");
    countEl.className = LB_COUNT_CLASS;

    btn.append(iconWrap, countEl);
    this.appendChild(btn);

    this._btn = btn;
    this._iconWrap = iconWrap;
    this._countEl = countEl;
  }

  protected update(): void {
    if (!this._btn || !this._iconWrap || !this._countEl) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const liked = this.boolAttr("liked");
    const countAttr = this.getAttribute("count");
    const size = (this.getAttribute("size") as LikeButtonSize) || "md";
    const hideCount = this.boolAttr("hide-count");
    const activeColor = this.getAttribute("active-color");
    const s = sizeConfig[size];

    this._btn.dataset.liked = liked ? "true" : "false";
    this._btn.setAttribute("aria-pressed", String(liked));
    this._btn.setAttribute("aria-label", liked ? "좋아요 취소" : "좋아요");

    this._btn.style.setProperty("--nds-like-icon", `${s.icon}px`);
    this._btn.style.setProperty("--nds-like-count-size", `${s.count}px`);
    this._btn.style.setProperty("--nds-like-gap", `${s.gap}px`);
    if (activeColor) this._btn.style.setProperty("--nds-like-color", activeColor);
    else this._btn.style.removeProperty("--nds-like-color");

    this._iconWrap.innerHTML = "";
    this._iconWrap.appendChild(heartIcon(s.icon, liked));

    if (!hideCount && countAttr !== null) {
      const count = parseInt(countAttr, 10);
      if (!Number.isNaN(count)) {
        this._countEl.textContent = formatCount(count);
        this._countEl.style.display = "";
      } else {
        this._countEl.style.display = "none";
      }
    } else {
      this._countEl.style.display = "none";
    }
  }
}

define(NdsLikeButton);
