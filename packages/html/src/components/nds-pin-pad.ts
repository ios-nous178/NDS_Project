/**
 * <nds-pin-pad> — DS PinPad 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-pin-pad pin-length="6" label="PIN 입력"></nds-pin-pad>
 *
 * 이벤트:
 *   nds-pin-change (detail: { value })
 *   nds-pin-complete (detail: { value }) -> length 도달 시
 *
 * 속성:
 *   value: 입력값
 *   pin-length: PIN 길이 (default 6)
 *   label
 *   shuffle: 키 배치 셔플
 *   shuffle-seed: 시드 (정수)
 *   error: 에러 상태
 */

import { NdsElement, define } from "../base/nds-element.js";

const PP_CLASS = "nds-pin-pad";
const PP_DOTS_CLASS = `${PP_CLASS}__dots`;
const PP_DOT_CLASS = `${PP_CLASS}__dot`;
const PP_GRID_CLASS = `${PP_CLASS}__grid`;
const PP_KEY_CLASS = `${PP_CLASS}__key`;
const PP_LABEL_CLASS = `${PP_CLASS}__label`;

const seededShuffle = (arr: number[], seed: number): number[] => {
  let s = seed;
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const BackspaceIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "28");
  svg.setAttribute("height", "28");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path d="M8 5h12a2 2 0 012 2v10a2 2 0 01-2 2H8l-6-7 6-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M13 9l4 6M17 9l-4 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`;
  return svg;
};

export class NdsPinPad extends NdsElement {
  static elementName = "nds-pin-pad";

  static get observedAttributes(): readonly string[] {
    return ["value", "pin-length", "label", "shuffle", "shuffle-seed", "error"];
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _dotsWrap: HTMLDivElement | null = null;
  private _grid: HTMLDivElement | null = null;
  private _cachedKeys: number[] | null = null;
  private _cachedSeed: { shuffle: boolean; seed: number } | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = PP_CLASS;

    const labelEl = document.createElement("span");
    labelEl.className = PP_LABEL_CLASS;

    const dotsWrap = document.createElement("div");
    dotsWrap.className = PP_DOTS_CLASS;

    const grid = document.createElement("div");
    grid.className = PP_GRID_CLASS;

    root.append(labelEl, dotsWrap, grid);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._dotsWrap = dotsWrap;
    this._grid = grid;
  }

  private _getKeys(): number[] {
    const shuffle = this.boolAttr("shuffle");
    const seed = parseInt(this.attr("shuffle-seed", "1"), 10) || 1;
    if (
      this._cachedKeys &&
      this._cachedSeed &&
      this._cachedSeed.shuffle === shuffle &&
      this._cachedSeed.seed === seed
    ) {
      return this._cachedKeys;
    }
    const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const keys = shuffle ? seededShuffle(base, seed) : base;
    this._cachedKeys = keys;
    this._cachedSeed = { shuffle, seed };
    return keys;
  }

  private _press(digit: number): void {
    const value = this.getAttribute("value") || "";
    const length = parseInt(this.attr("pin-length", "6"), 10) || 6;
    if (value.length >= length) return;
    const next = value + String(digit);
    this.setAttribute("value", next);
    this.dispatchEvent(
      new CustomEvent("nds-pin-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
    if (next.length === length) {
      this.dispatchEvent(
        new CustomEvent("nds-pin-complete", {
          detail: { value: next },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _back(): void {
    const value = this.getAttribute("value") || "";
    if (value.length === 0) return;
    const next = value.slice(0, -1);
    this.setAttribute("value", next);
    this.dispatchEvent(
      new CustomEvent("nds-pin-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected update(): void {
    if (!this._root || !this._labelEl || !this._dotsWrap || !this._grid) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const length = parseInt(this.attr("pin-length", "6"), 10) || 6;
    const label = this.getAttribute("label");
    const error = this.boolAttr("error");

    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.style.display = "none";
    }

    this._dotsWrap.dataset.error = error ? "true" : "false";
    this._dotsWrap.innerHTML = "";
    for (let i = 0; i < length; i++) {
      const dot = document.createElement("span");
      dot.className = PP_DOT_CLASS;
      dot.dataset.filled = i < value.length ? "true" : "false";
      this._dotsWrap.appendChild(dot);
    }

    const keys = this._getKeys();
    this._grid.innerHTML = "";
    keys.slice(0, 9).forEach((d) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = PP_KEY_CLASS;
      btn.textContent = String(d);
      btn.addEventListener("click", () => this._press(d));
      this._grid!.appendChild(btn);
    });

    const filler = document.createElement("span");
    filler.setAttribute("aria-hidden", "true");
    this._grid.appendChild(filler);

    const zeroBtn = document.createElement("button");
    zeroBtn.type = "button";
    zeroBtn.className = PP_KEY_CLASS;
    zeroBtn.textContent = String(keys[9]);
    zeroBtn.addEventListener("click", () => this._press(keys[9]));
    this._grid.appendChild(zeroBtn);

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = PP_KEY_CLASS;
    backBtn.dataset.action = "true";
    backBtn.setAttribute("aria-label", "지우기");
    backBtn.appendChild(BackspaceIcon());
    backBtn.disabled = value.length === 0;
    backBtn.addEventListener("click", () => this._back());
    this._grid.appendChild(backBtn);
  }
}

define(NdsPinPad);
