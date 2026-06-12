/**
 * <nds-floating-cta-banner> — DS FloatingCtaBanner 의 vanilla Web Component 버전.
 *
 * 사용 예 (floating):
 *   <nds-floating-cta-banner
 *     caption="아직 상담을 받지 않으셨나요?"
 *     cta-text="첫 상담 무료 시작하기"
 *     size="mobile"
 *   ></nds-floating-cta-banner>
 *
 * 사용 예 (inline):
 *   <nds-floating-cta-banner floating="false" caption="..." cta-text="..."></nds-floating-cta-banner>
 *
 * 이벤트:
 *   nds-floating-cta-click -> 배너 클릭
 *
 * children:
 *   slot="leading-icon" — 좌측 아이콘 (선택)
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const FCB_ROOT_CLASS = "nds-floating-cta-banner";
const FCB_ICON_CLASS = `${FCB_ROOT_CLASS}__icon`;
const FCB_TEXT_CLASS = `${FCB_ROOT_CLASS}__text`;
const FCB_CAPTION_CLASS = `${FCB_ROOT_CLASS}__caption`;
const FCB_CTA_ROW_CLASS = `${FCB_ROOT_CLASS}__cta-row`;
const FCB_CTA_TEXT_CLASS = `${FCB_ROOT_CLASS}__cta-text`;
const FCB_ARROW_CLASS = `${FCB_ROOT_CLASS}__arrow`;

export type FloatingCtaBannerSize = "pc" | "mobile";

const ChevronRight = (size: number) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsFloatingCtaBanner extends NdsElement {
  static elementName = "nds-floating-cta-banner";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-floating-cta-banner"].observedAttributes, "caption", "cta-text"];
  }

  private _btn: HTMLButtonElement | null = null;
  private _iconWrap: HTMLSpanElement | null = null;
  private _captionEl: HTMLParagraphElement | null = null;
  private _ctaTextEl: HTMLParagraphElement | null = null;
  private _arrowWrap: HTMLSpanElement | null = null;
  private _hasLeadingIcon = false;

  override connectedCallback(): void {
    if (!this._btn) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const leadingStash: Node[] = [];
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "leading-icon") {
        leadingStash.push(node);
      }
      node.parentNode?.removeChild(node);
    });
    this._hasLeadingIcon = leadingStash.length > 0;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.slot = "root";
    btn.className = FCB_ROOT_CLASS;
    btn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("nds-floating-cta-click", { bubbles: true, composed: true }),
      );
    });

    const iconWrap = document.createElement("span");
    iconWrap.dataset.slot = "icon";
    iconWrap.className = FCB_ICON_CLASS;
    iconWrap.setAttribute("aria-hidden", "true");
    leadingStash.forEach((n) => iconWrap.appendChild(n));

    const textWrap = document.createElement("span");
    textWrap.dataset.slot = "text";
    textWrap.className = FCB_TEXT_CLASS;

    const captionEl = document.createElement("p");
    captionEl.className = FCB_CAPTION_CLASS;

    const ctaRow = document.createElement("span");
    ctaRow.className = FCB_CTA_ROW_CLASS;

    const ctaTextEl = document.createElement("p");
    ctaTextEl.className = FCB_CTA_TEXT_CLASS;

    const arrowWrap = document.createElement("span");
    arrowWrap.dataset.slot = "arrow";
    arrowWrap.className = FCB_ARROW_CLASS;
    arrowWrap.setAttribute("aria-hidden", "true");

    ctaRow.append(ctaTextEl, arrowWrap);
    textWrap.append(captionEl, ctaRow);

    if (this._hasLeadingIcon) btn.appendChild(iconWrap);
    btn.appendChild(textWrap);

    this.appendChild(btn);

    this._btn = btn;
    this._iconWrap = iconWrap;
    this._captionEl = captionEl;
    this._ctaTextEl = ctaTextEl;
    this._arrowWrap = arrowWrap;
  }

  protected update(): void {
    if (!this._btn || !this._captionEl || !this._ctaTextEl || !this._arrowWrap) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const caption = this.getAttribute("caption") || "";
    const ctaText = this.getAttribute("cta-text") || "";
    const size = (this.getAttribute("size") as FloatingCtaBannerSize) || "pc";
    const floating = this.attr("floating", "true") !== "false";
    const showArrow = this.attr("show-arrow", "true") !== "false";
    const bottomOffsetAttr = this.getAttribute("bottom-offset");
    const ariaLabel = this.getAttribute("aria-label") || ctaText;

    this._btn.dataset.size = size;
    this._btn.dataset.floating = floating ? "true" : "false";
    this._btn.setAttribute("aria-label", ariaLabel);

    this._captionEl.textContent = caption;
    this._ctaTextEl.textContent = ctaText;

    if (showArrow) {
      const arrowSize = size === "pc" ? 20 : 16;
      this._arrowWrap.innerHTML = "";
      this._arrowWrap.appendChild(ChevronRight(arrowSize));
      this._arrowWrap.style.display = "";
    } else {
      this._arrowWrap.style.display = "none";
    }

    if (floating) {
      const bottomOffset = bottomOffsetAttr
        ? parseInt(bottomOffsetAttr, 10)
        : size === "pc"
          ? 32
          : 16;
      this._btn.style.bottom = `${bottomOffset}px`;
    } else {
      this._btn.style.bottom = "";
    }
  }
}

define(NdsFloatingCtaBanner);
