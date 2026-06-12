/**
 * <nds-image-cropper> — DS ImageCropper 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-image-cropper src="/photo.jpg" shape="circle" size="240" label="프로필"></nds-image-cropper>
 *
 *   const c = document.querySelector('nds-image-cropper');
 *   c.toDataURL(); // PNG dataURL 또는 null
 *
 * 이벤트:
 *   zoom-change (detail: { zoom }) — 줌 변경
 *
 * 속성:
 *   src: 이미지 src
 *   shape: "circle" | "square" (기본 "circle")
 *   size: 뷰포트 정사각 px (기본 240)
 *   output-size: toDataURL 의 출력 px
 *   label
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const IC_CLASS = "nds-image-cropper";
const IC_VIEWPORT_CLASS = `${IC_CLASS}__viewport`;
const IC_IMG_CLASS = `${IC_CLASS}__img`;
const IC_OVERLAY_CLASS = `${IC_CLASS}__overlay`;
const IC_CIRCLE_CLASS = `${IC_CLASS}__circle`;
const IC_HINT_CLASS = `${IC_CLASS}__hint`;
const IC_CONTROLS_CLASS = `${IC_CLASS}__controls`;
const IC_LABEL_CLASS = `${IC_CLASS}__label`;
const IC_ZOOM_BTN_CLASS = `${IC_CLASS}__zoom-btn`;
const IC_ZOOM_VALUE_CLASS = `${IC_CLASS}__zoom-value`;
const IC_SLIDER_CLASS = `${IC_CLASS}__slider`;

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.1;
const clampZoom = (z: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

export class NdsImageCropper extends NdsElement {
  static elementName = "nds-image-cropper";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-image-cropper"].observedAttributes, "label"];
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _viewport: HTMLDivElement | null = null;
  private _img: HTMLImageElement | null = null;
  private _overlay: HTMLDivElement | null = null;
  private _hint: HTMLSpanElement | null = null;
  private _controls: HTMLDivElement | null = null;
  private _zoomOutBtn: HTMLButtonElement | null = null;
  private _zoomInBtn: HTMLButtonElement | null = null;
  private _slider: HTMLInputElement | null = null;
  private _zoomValue: HTMLSpanElement | null = null;

  private _zoom = 1;
  private _pos = { x: 0, y: 0 };
  private _grabbing = false;
  private _natural = { w: 0, h: 0 };
  private _drag: { x: number; y: number; sx: number; sy: number } | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  toDataURL(outOverride?: number): string | null {
    const img = this._img;
    if (!img || !this._natural.w) return null;
    const size = parseInt(this.attr("size", "240"), 10) || 240;
    const outSize = outOverride ?? (parseInt(this.attr("output-size", String(size)), 10) || size);
    const canvas = document.createElement("canvas");
    canvas.width = outSize;
    canvas.height = outSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const baseScale = size / Math.min(this._natural.w, this._natural.h);
    const drawW = this._natural.w * baseScale * this._zoom;
    const drawH = this._natural.h * baseScale * this._zoom;
    const ratio = outSize / size;
    const sx = (size / 2 + this._pos.x - drawW / 2) * ratio;
    const sy = (size / 2 + this._pos.y - drawH / 2) * ratio;
    const shape = this.attr("shape", "circle");
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(outSize / 2, outSize / 2, outSize / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(img, sx, sy, drawW * ratio, drawH * ratio);
    return canvas.toDataURL("image/png");
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = IC_CLASS;

    const labelEl = document.createElement("span");
    labelEl.className = IC_LABEL_CLASS;
    labelEl.style.display = "none";

    const viewport = document.createElement("div");
    viewport.className = IC_VIEWPORT_CLASS;

    const img = document.createElement("img");
    img.className = IC_IMG_CLASS;
    img.alt = "";
    img.crossOrigin = "anonymous";
    img.draggable = false;
    img.addEventListener("load", () => {
      this._natural = { w: img.naturalWidth, h: img.naturalHeight };
      this._zoom = 1;
      this._pos = { x: 0, y: 0 };
      this._applyTransform();
      this._renderControls();
    });

    const overlay = document.createElement("div");
    overlay.className = IC_OVERLAY_CLASS;
    const circle = document.createElement("div");
    circle.className = IC_CIRCLE_CLASS;
    overlay.appendChild(circle);

    viewport.append(img, overlay);
    viewport.addEventListener("pointerdown", (e) => this._onDown(e));
    viewport.addEventListener("pointermove", (e) => this._onMove(e));
    viewport.addEventListener("pointerup", (e) => this._onUp(e));
    viewport.addEventListener("pointercancel", (e) => this._onUp(e));

    const hint = document.createElement("span");
    hint.className = IC_HINT_CLASS;
    hint.textContent = "드래그해서 위치를 맞춰주세요";

    const controls = document.createElement("div");
    controls.className = IC_CONTROLS_CLASS;

    const zoomOut = document.createElement("button");
    zoomOut.type = "button";
    zoomOut.className = IC_ZOOM_BTN_CLASS;
    zoomOut.setAttribute("aria-label", "축소");
    zoomOut.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5.25" width="8" height="1.5" rx="0.75" fill="currentColor"/></svg>`;
    zoomOut.addEventListener("click", () => this._setZoom(this._zoom - ZOOM_STEP));

    const slider = document.createElement("input");
    slider.className = IC_SLIDER_CLASS;
    slider.type = "range";
    slider.min = String(ZOOM_MIN);
    slider.max = String(ZOOM_MAX);
    slider.step = "0.05";
    slider.value = String(this._zoom);
    slider.setAttribute("aria-label", "확대/축소");
    slider.addEventListener("input", (e) =>
      this._setZoom(parseFloat((e.target as HTMLInputElement).value)),
    );

    const zoomIn = document.createElement("button");
    zoomIn.type = "button";
    zoomIn.className = IC_ZOOM_BTN_CLASS;
    zoomIn.setAttribute("aria-label", "확대");
    zoomIn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5.25" width="8" height="1.5" rx="0.75" fill="currentColor"/><rect x="5.25" y="2" width="1.5" height="8" rx="0.75" fill="currentColor"/></svg>`;
    zoomIn.addEventListener("click", () => this._setZoom(this._zoom + ZOOM_STEP));

    const zoomValue = document.createElement("span");
    zoomValue.className = IC_ZOOM_VALUE_CLASS;
    zoomValue.setAttribute("aria-live", "polite");

    controls.append(zoomOut, slider, zoomIn, zoomValue);

    root.append(labelEl, viewport, hint, controls);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._viewport = viewport;
    this._img = img;
    this._overlay = overlay;
    this._hint = hint;
    this._controls = controls;
    this._zoomOutBtn = zoomOut;
    this._zoomInBtn = zoomIn;
    this._slider = slider;
    this._zoomValue = zoomValue;
  }

  private _setZoom(z: number): void {
    const next = clampZoom(z);
    if (next === this._zoom) return;
    this._zoom = next;
    this._applyTransform();
    this._renderControls();
    this.dispatchEvent(
      new CustomEvent("zoom-change", {
        detail: { zoom: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onDown(e: PointerEvent): void {
    this._drag = { x: e.clientX, y: e.clientY, sx: this._pos.x, sy: this._pos.y };
    this._grabbing = true;
    if (this._viewport) {
      this._viewport.dataset.grabbing = "true";
      this._viewport.setPointerCapture(e.pointerId);
    }
  }

  private _onMove(e: PointerEvent): void {
    if (!this._drag) return;
    const dx = e.clientX - this._drag.x;
    const dy = e.clientY - this._drag.y;
    this._pos = { x: this._drag.sx + dx, y: this._drag.sy + dy };
    this._applyTransform();
  }

  private _onUp(e: PointerEvent): void {
    this._drag = null;
    this._grabbing = false;
    if (this._viewport) {
      this._viewport.dataset.grabbing = "false";
      this._viewport.releasePointerCapture?.(e.pointerId);
    }
  }

  private _applyTransform(): void {
    if (!this._viewport) return;
    const size = parseInt(this.attr("size", "240"), 10) || 240;
    const baseScale = this._natural.w ? size / Math.min(this._natural.w, this._natural.h) : 1;
    this._viewport.style.setProperty("--nds-cropper-size", `${size}px`);
    this._viewport.style.setProperty("--nds-cropper-zoom", String(baseScale * this._zoom));
    this._viewport.style.setProperty("--nds-cropper-x", `${this._pos.x}px`);
    this._viewport.style.setProperty("--nds-cropper-y", `${this._pos.y}px`);
  }

  private _renderControls(): void {
    if (this._slider) this._slider.value = String(this._zoom);
    if (this._zoomOutBtn) this._zoomOutBtn.disabled = this._zoom <= ZOOM_MIN;
    if (this._zoomInBtn) this._zoomInBtn.disabled = this._zoom >= ZOOM_MAX;
    if (this._zoomValue) this._zoomValue.textContent = `${Math.round(this._zoom * 100)}%`;
  }

  protected update(): void {
    if (!this._root || !this._img || !this._overlay || !this._labelEl) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const src = this.getAttribute("src");
    if (src && this._img.getAttribute("src") !== src) {
      this._img.src = src;
    }

    const shape = this.attr("shape", "circle");
    this._overlay.dataset.shape = shape;

    const label = this.getAttribute("label");
    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.style.display = "none";
    }

    this._applyTransform();
    this._renderControls();
  }
}

define(NdsImageCropper);
