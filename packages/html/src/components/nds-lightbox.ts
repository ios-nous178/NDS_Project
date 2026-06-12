/**
 * <nds-lightbox> — DS Lightbox 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-lightbox open index="0"
 *     images='[
 *       {"src":"/a.jpg","alt":"첫번째","caption":"설명"},
 *       {"src":"/b.jpg","alt":"두번째"}
 *     ]'></nds-lightbox>
 *
 * 이벤트:
 *   lightbox-close — 닫기 (ESC, X 버튼, 배경 클릭)
 *   lightbox-index-change (detail: { index }) — 이미지 전환
 *
 * 속성:
 *   open: 표시 여부
 *   index: 현재 인덱스
 *   images: JSON 배열 [{ src, alt?, caption? }]
 *
 * 참고: React 버전은 createPortal 로 body 에 그리지만, vanilla 는
 *   host 자체를 fixed-position overlay 로 사용 (light DOM 그대로).
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const LB_CLASS = "nds-lightbox";
const LB_BACKDROP_CLASS = `${LB_CLASS}__backdrop`;
const LB_IMG_CLASS = `${LB_CLASS}__img`;
const LB_CLOSE_CLASS = `${LB_CLASS}__close`;
const LB_NAV_CLASS = `${LB_CLASS}__nav`;
const LB_COUNTER_CLASS = `${LB_CLASS}__counter`;
const LB_CAPTION_CLASS = `${LB_CLASS}__caption`;

interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

const CloseSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", "0 0 18 18");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M4 4l10 10M14 4l-10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
  return svg;
};

const PrevSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", "0 0 18 18");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M11 4L5 9l6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

const NextSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", "0 0 18 18");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M7 4l6 5-6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsLightbox extends NdsElement {
  static elementName = "nds-lightbox";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-lightbox"].observedAttributes];
  }

  private _root: HTMLDivElement | null = null;
  private _prevOverflow = "";

  private _onKey = (e: KeyboardEvent) => {
    if (!this.boolAttr("open")) return;
    if (e.key === "Escape") this._emitClose();
    else if (e.key === "ArrowLeft") this._go(-1);
    else if (e.key === "ArrowRight") this._go(1);
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("keydown", this._onKey);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("keydown", this._onKey);
    document.body.style.overflow = this._prevOverflow;
  }

  private _mount(): void {
    const backdrop = document.createElement("div");
    backdrop.className = LB_BACKDROP_CLASS;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "이미지 확대 보기");
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) this._emitClose();
    });
    this.appendChild(backdrop);
    this._root = backdrop;
  }

  private _parseImages(): LightboxImage[] {
    const raw = this.getAttribute("images");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as LightboxImage[];
    } catch {
      /* ignore */
    }
    return [];
  }

  private _emitClose(): void {
    this.dispatchEvent(new CustomEvent("lightbox-close", { bubbles: true, composed: true }));
  }

  private _setIndex(next: number): void {
    const images = this._parseImages();
    const clamped = Math.max(0, Math.min(images.length - 1, next));
    this.setAttribute("index", String(clamped));
    this.dispatchEvent(
      new CustomEvent("lightbox-index-change", {
        detail: { index: clamped },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _go(delta: number): void {
    const cur = parseInt(this.attr("index", "0"), 10) || 0;
    this._setIndex(cur + delta);
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open");
    if (open) {
      this._root.style.display = "";
      if (document.body.style.overflow !== "hidden") {
        this._prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
    } else {
      this._root.style.display = "none";
      document.body.style.overflow = this._prevOverflow;
      this._root.replaceChildren();
      return;
    }

    const images = this._parseImages();
    const idx = parseInt(this.attr("index", "0"), 10) || 0;
    const current = images[idx];
    if (!current) {
      this._root.replaceChildren();
      return;
    }
    const total = images.length;
    const hasMany = total > 1;

    const children: Node[] = [];

    if (hasMany) {
      const counter = document.createElement("span");
      counter.className = LB_COUNTER_CLASS;
      counter.textContent = `${idx + 1} / ${total}`;
      children.push(counter);
    }

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = LB_CLOSE_CLASS;
    closeBtn.setAttribute("aria-label", "닫기");
    closeBtn.appendChild(CloseSvg());
    closeBtn.addEventListener("click", () => this._emitClose());
    children.push(closeBtn);

    if (hasMany) {
      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = LB_NAV_CLASS;
      prevBtn.dataset.side = "prev";
      prevBtn.setAttribute("aria-label", "이전 이미지");
      prevBtn.disabled = idx === 0;
      prevBtn.appendChild(PrevSvg());
      prevBtn.addEventListener("click", () => this._go(-1));

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = LB_NAV_CLASS;
      nextBtn.dataset.side = "next";
      nextBtn.setAttribute("aria-label", "다음 이미지");
      nextBtn.disabled = idx === total - 1;
      nextBtn.appendChild(NextSvg());
      nextBtn.addEventListener("click", () => this._go(1));

      children.push(prevBtn, nextBtn);
    }

    const img = document.createElement("img");
    img.className = LB_IMG_CLASS;
    img.src = current.src;
    img.alt = current.alt ?? "";
    children.push(img);

    if (current.caption) {
      const caption = document.createElement("p");
      caption.className = LB_CAPTION_CLASS;
      caption.textContent = current.caption;
      children.push(caption);
    }

    this._root.replaceChildren(...children);
  }
}

define(NdsLightbox);
