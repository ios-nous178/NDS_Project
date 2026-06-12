/**
 * <nds-signature-pad> — DS SignaturePad 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-signature-pad label="서명" placeholder="여기에 서명해주세요"
 *     height="180" pen-color="#111111" pen-width="2.4"></nds-signature-pad>
 *
 *   const pad = document.querySelector('nds-signature-pad');
 *   pad.toDataURL();    // PNG dataURL 또는 null
 *   pad.clear();
 *   pad.isEmpty();
 *
 * 이벤트:
 *   signature-change (detail: { dataUrl }) — 그릴 때마다 발생. clear() 시 dataUrl=null.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const SP_CLASS = "nds-signature-pad";
const SP_LABEL_CLASS = `${SP_CLASS}__label`;
const SP_CANVAS_WRAP_CLASS = `${SP_CLASS}__canvas-wrap`;
const SP_CANVAS_CLASS = `${SP_CLASS}__canvas`;
const SP_PLACEHOLDER_CLASS = `${SP_CLASS}__placeholder`;
const SP_CONTROLS_CLASS = `${SP_CLASS}__controls`;
const SP_BTN_CLASS = `${SP_CLASS}__btn`;

export class NdsSignaturePad extends NdsElement {
  static elementName = "nds-signature-pad";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-signature-pad"].observedAttributes, "label"];
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _wrap: HTMLDivElement | null = null;
  private _canvas: HTMLCanvasElement | null = null;
  private _placeholder: HTMLSpanElement | null = null;
  private _controls: HTMLDivElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;

  private _drawing = false;
  private _empty = true;

  private _onResize = () => this._resize();

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    window.addEventListener("resize", this._onResize);
  }

  override disconnectedCallback(): void {
    window.removeEventListener("resize", this._onResize);
  }

  clear(): void {
    if (!this._canvas) return;
    const ctx = this._canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._empty = true;
    this._updatePlaceholder();
    this._updateClearBtn();
    this.dispatchEvent(
      new CustomEvent("signature-change", {
        detail: { dataUrl: null },
        bubbles: true,
        composed: true,
      }),
    );
  }

  toDataURL(): string | null {
    if (this._empty) return null;
    return this._canvas?.toDataURL("image/png") ?? null;
  }

  isEmpty(): boolean {
    return this._empty;
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SP_CLASS;

    const labelEl = document.createElement("label");
    labelEl.className = SP_LABEL_CLASS;
    labelEl.style.display = "none";

    const wrap = document.createElement("div");
    wrap.className = SP_CANVAS_WRAP_CLASS;

    const canvas = document.createElement("canvas");
    canvas.className = SP_CANVAS_CLASS;
    canvas.addEventListener("pointerdown", (e) => this._onDown(e));
    canvas.addEventListener("pointermove", (e) => this._onMove(e));
    canvas.addEventListener("pointerup", (e) => this._onUp(e));
    canvas.addEventListener("pointercancel", (e) => this._onUp(e));

    const placeholder = document.createElement("span");
    placeholder.className = SP_PLACEHOLDER_CLASS;

    wrap.append(canvas, placeholder);

    const controls = document.createElement("div");
    controls.className = SP_CONTROLS_CLASS;
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = SP_BTN_CLASS;
    clearBtn.textContent = "지우기";
    clearBtn.addEventListener("click", () => this.clear());
    controls.appendChild(clearBtn);

    root.append(labelEl, wrap, controls);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._wrap = wrap;
    this._canvas = canvas;
    this._placeholder = placeholder;
    this._controls = controls;
    this._clearBtn = clearBtn;

    queueMicrotask(() => this._resize());
  }

  private _resize(): void {
    if (!this._canvas || !this._wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this._wrap.clientWidth;
    const h = parseInt(this.attr("height", "180"), 10) || 180;
    this._canvas.width = w * dpr;
    this._canvas.height = h * dpr;
    this._canvas.style.height = `${h}px`;
    const ctx = this._canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }

  private _onDown(e: PointerEvent): void {
    if (this.boolAttr("disabled")) return;
    const ctx = this._canvas?.getContext("2d");
    if (!ctx || !this._canvas) return;
    this._drawing = true;
    const rect = this._canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = this.attr("pen-color", "#111111");
    ctx.lineWidth = parseFloat(this.attr("pen-width", "2.4")) || 2.4;
    this._canvas.setPointerCapture(e.pointerId);
  }

  private _onMove(e: PointerEvent): void {
    if (!this._drawing) return;
    const ctx = this._canvas?.getContext("2d");
    if (!ctx || !this._canvas) return;
    const rect = this._canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    if (this._empty) {
      this._empty = false;
      this._updatePlaceholder();
      this._updateClearBtn();
    }
  }

  private _onUp(e: PointerEvent): void {
    if (!this._drawing) return;
    this._drawing = false;
    this._canvas?.releasePointerCapture(e.pointerId);
    this.dispatchEvent(
      new CustomEvent("signature-change", {
        detail: { dataUrl: this._canvas?.toDataURL("image/png") ?? null },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _updatePlaceholder(): void {
    if (!this._placeholder) return;
    this._placeholder.style.display = this._empty ? "" : "none";
  }

  private _updateClearBtn(): void {
    if (!this._clearBtn) return;
    this._clearBtn.disabled = this.boolAttr("disabled") || this._empty;
  }

  protected update(): void {
    if (!this._root || !this._labelEl || !this._wrap || !this._placeholder || !this._controls) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const labelText = this.getAttribute("label");
    if (labelText) {
      this._labelEl.textContent = labelText;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.textContent = "";
      this._labelEl.style.display = "none";
    }

    const placeholderText = this.attr("placeholder", "여기에 서명해주세요");
    this._placeholder.textContent = placeholderText;

    const height = parseInt(this.attr("height", "180"), 10) || 180;
    this._wrap.style.height = `${height}px`;
    this._wrap.dataset.disabled = this.boolAttr("disabled") ? "true" : "false";

    this._controls.style.display = this.boolAttr("hide-controls") ? "none" : "";

    this._updatePlaceholder();
    this._updateClearBtn();
    this._resize();
  }
}

define(NdsSignaturePad);
