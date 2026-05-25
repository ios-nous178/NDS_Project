/**
 * <nds-carousel> — DS Carousel 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-carousel autoplay="3000" indicator="dots" loop>
 *     <img src="banner1.jpg" />
 *     <img src="banner2.jpg" />
 *     <img src="banner3.jpg" />
 *   </nds-carousel>
 *
 * 이벤트:
 *   carousel-change (detail: { index }) -> 활성 슬라이드 변경 시
 */

import { NdsElement, define } from "../base/nds-element.js";

const CR_CLASS = "nds-carousel";
const CR_VIEWPORT_CLASS = `${CR_CLASS}__viewport`;
const CR_TRACK_CLASS = `${CR_CLASS}__track`;
const CR_SLIDE_CLASS = `${CR_CLASS}__slide`;
const CR_INDICATORS_CLASS = `${CR_CLASS}__indicators`;
const CR_DOT_CLASS = `${CR_CLASS}__dot`;
const CR_NAV_CLASS = `${CR_CLASS}__nav`;
const CR_COUNTER_CLASS = `${CR_CLASS}__counter`;

export class NdsCarousel extends NdsElement {
  static elementName = "nds-carousel";

  static get observedAttributes(): readonly string[] {
    return ["active-index", "autoplay", "indicator", "loop", "gap", "show-arrows"];
  }

  private _viewport: HTMLDivElement | null = null;
  private _track: HTMLDivElement | null = null;
  private _indicatorWrap: HTMLDivElement | null = null;
  private _counter: HTMLDivElement | null = null;

  private _currentIndex = 0;
  private _total = 0;
  private _timer: ReturnType<typeof setInterval> | null = null;

  private _isDragging = false;
  private _startX = 0;
  private _dragOffset = 0;

  override connectedCallback(): void {
    if (!this._viewport) this._mount();
    super.connectedCallback();
    this._startAutoplay();
  }

  override disconnectedCallback(): void {
    this._stopAutoplay();
  }

  private _mount(): void {
    const viewport = document.createElement("div");
    viewport.className = CR_VIEWPORT_CLASS;

    const track = document.createElement("div");
    track.className = CR_TRACK_CLASS;

    // Capture original children as slides
    const slides = Array.from(this.children);
    this._total = slides.length;

    slides.forEach((slide, i) => {
      const slideWrapper = document.createElement("div");
      slideWrapper.className = CR_SLIDE_CLASS;
      slideWrapper.dataset.slot = "slide";
      slideWrapper.setAttribute("role", "group");
      slideWrapper.setAttribute("aria-roledescription", "slide");
      slideWrapper.setAttribute("aria-label", `${i + 1} / ${this._total}`);
      slideWrapper.appendChild(slide);
      track.appendChild(slideWrapper);
    });

    viewport.appendChild(track);
    this.appendChild(viewport);

    this._viewport = viewport;
    this._track = track;

    // Events
    viewport.addEventListener("pointerdown", this._onPointerDown);
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp);

    // Arrows
    this._createArrows();
  }

  private _createArrows(): void {
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = CR_NAV_CLASS;
    prev.dataset.side = "prev";
    prev.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    prev.addEventListener("click", () => this.goPrev());

    const next = document.createElement("button");
    next.type = "button";
    next.className = CR_NAV_CLASS;
    next.dataset.side = "next";
    next.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    next.addEventListener("click", () => this.goNext());

    this.appendChild(prev);
    this.appendChild(next);
  }

  private _onPointerDown = (e: PointerEvent) => {
    if (this._total <= 1) return;
    this._isDragging = true;
    this._startX = e.clientX;
    this._stopAutoplay();
    this._track!.dataset.grabbing = "true";
  };

  private _onPointerMove = (e: PointerEvent) => {
    if (!this._isDragging) return;
    this._dragOffset = e.clientX - this._startX;
    this._updateTrackPosition();
  };

  private _onPointerUp = () => {
    if (!this._isDragging) return;
    this._isDragging = false;
    this._track!.dataset.grabbing = "false";

    const threshold = this.offsetWidth * 0.15;
    if (this._dragOffset > threshold) this.goPrev();
    else if (this._dragOffset < -threshold) this.goNext();
    else this._updateTrackPosition(); // Snap back

    this._dragOffset = 0;
    this._startAutoplay();
  };

  private _updateTrackPosition(): void {
    if (!this._track) return;
    const x = `calc(${-this._currentIndex * 100}% + ${this._dragOffset}px)`;
    this._track.style.transform = `translateX(${x})`;
  }

  goTo(index: number): void {
    const loop = this.boolAttr("loop");
    let next = index;
    if (loop) next = (index + this._total) % this._total;
    else next = Math.max(0, Math.min(this._total - 1, index));

    if (this._currentIndex !== next) {
      this._currentIndex = next;
      this.dispatchEvent(
        new CustomEvent("carousel-change", {
          detail: { index: next },
          bubbles: true,
          composed: true,
        }),
      );
      this.scheduleUpdate();
    } else {
      this._updateTrackPosition();
    }
  }

  goPrev(): void {
    this.goTo(this._currentIndex - 1);
  }
  goNext(): void {
    this.goTo(this._currentIndex + 1);
  }

  private _startAutoplay(): void {
    this._stopAutoplay();
    const ms = parseInt(this.getAttribute("autoplay") || "0", 10);
    if (ms > 0 && this._total > 1) {
      this._timer = setInterval(() => this.goNext(), ms);
    }
  }

  private _stopAutoplay(): void {
    if (this._timer) clearInterval(this._timer);
  }

  protected update(): void {
    if (!this._track) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const indicator = this.getAttribute("indicator") || "dots";
    const gap = this.getAttribute("gap");
    const showArrows = this.attr("show-arrows", "true") !== "false";
    const activeIndexAttr = this.getAttribute("active-index");

    if (activeIndexAttr !== null) {
      const val = parseInt(activeIndexAttr, 10);
      if (val !== this._currentIndex) this._currentIndex = val;
    }

    if (gap) this._track.style.gap = `${gap}px`;
    this._updateTrackPosition();

    // Arrows visibility
    this.querySelectorAll(`.${CR_NAV_CLASS}`).forEach((el) => {
      (el as HTMLElement).style.display = showArrows && this._total > 1 ? "" : "none";
    });

    // Indicators
    this._renderIndicators(indicator);

    // Update slides aria-hidden
    Array.from(this._track.children).forEach((slide, i) => {
      (slide as HTMLElement).setAttribute("aria-hidden", String(i !== this._currentIndex));
    });
  }

  private _renderIndicators(type: string): void {
    if (type === "none" || this._total <= 1) {
      if (this._indicatorWrap) this._indicatorWrap.remove();
      if (this._counter) this._counter.remove();
      return;
    }

    if (type === "counter") {
      if (this._indicatorWrap) this._indicatorWrap.remove();
      if (!this._counter) {
        this._counter = document.createElement("div");
        this._counter.className = CR_COUNTER_CLASS;
        this.appendChild(this._counter);
      }
      this._counter.textContent = `${this._currentIndex + 1} / ${this._total}`;
    } else {
      if (this._counter) this._counter.remove();
      if (!this._indicatorWrap) {
        this._indicatorWrap = document.createElement("div");
        this._indicatorWrap.className = CR_INDICATORS_CLASS;
        this._indicatorWrap.setAttribute("role", "tablist");
        this.appendChild(this._indicatorWrap);
      }
      this._indicatorWrap.innerHTML = "";
      for (let i = 0; i < this._total; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = CR_DOT_CLASS;
        dot.dataset.active = String(i === this._currentIndex);
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-selected", String(i === this._currentIndex));
        dot.setAttribute("aria-label", `${i + 1}번 슬라이드`);
        dot.addEventListener("click", () => this.goTo(i));
        this._indicatorWrap.appendChild(dot);
      }
    }
  }
}

define(NdsCarousel);
