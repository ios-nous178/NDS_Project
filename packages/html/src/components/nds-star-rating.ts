/**
 * <nds-star-rating> — DS StarRating 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-star-rating value="4" size="24" show-value></nds-star-rating>
 *
 * 이벤트:
 *   star-rating-change (detail: { value }) -> 별 클릭 시 발생
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const SR_CLASS = "nds-star-rating";
const SR_STAR_CLASS = `${SR_CLASS}__star`;
const SR_VALUE_CLASS = `${SR_CLASS}__value`;

const STAR_PATH = "M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z";
const FILLED_COLOR = "var(--nds-rating-star, #FFD54F)"; // 슬롯 토큰 — style.fill 로 적용(attr 는 var() 미보장)
const EMPTY_COLOR = "#E0E0E0";
const DEFAULT_STAR_SIZE = 16;
const STAR_SIZE_BY_NAME = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

const resolveStarSize = (rawSize: string | null): number => {
  const raw = (rawSize ?? String(DEFAULT_STAR_SIZE)).trim().toLowerCase();
  if (raw in STAR_SIZE_BY_NAME) return STAR_SIZE_BY_NAME[raw as keyof typeof STAR_SIZE_BY_NAME];

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_STAR_SIZE;

  return Math.min(Math.max(parsed, 8), 48);
};

export class NdsStarRating extends NdsElement {
  static elementName = "nds-star-rating";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-star-rating"].observedAttributes, "readonly"];
  }

  private _root: HTMLDivElement | null = null;
  private _hovered: number | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SR_CLASS;

    root.addEventListener("mouseleave", () => {
      this._hovered = null;
      this.scheduleUpdate();
    });

    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = parseFloat(this.attr("value", "0"));
    const size = resolveStarSize(this.getAttribute("size"));
    const max = parseInt(this.attr("max", "5"), 10);
    const showValue = this.boolAttr("show-value");
    const disabled = this.boolAttr("disabled");
    const readonly = this.boolAttr("readonly") || !this.hasAttribute("on-change"); // or some other flag

    const interactive = !disabled && !readonly;
    const displayValue = this._hovered !== null ? this._hovered : Math.round(value);

    this._root.dataset.interactive = String(interactive);
    this._root.setAttribute("role", interactive ? "radiogroup" : "img");
    this._root.setAttribute("aria-label", `${value} out of ${max} stars`);

    this._root.innerHTML = "";

    for (let i = 1; i <= max; i++) {
      const starValue = i;
      const filled = starValue <= displayValue;

      const span = document.createElement("span");
      span.className = SR_STAR_CLASS;
      span.dataset.slot = "star";
      span.dataset.filled = String(filled);
      if (interactive) {
        span.setAttribute("role", "radio");
        span.setAttribute("aria-checked", String(starValue === Math.round(value)));
        span.setAttribute("aria-label", `${starValue} star${starValue > 1 ? "s" : ""}`);

        span.addEventListener("click", () => {
          this.setAttribute("value", String(starValue));
          this.dispatchEvent(
            new CustomEvent("star-rating-change", {
              detail: { value: starValue },
              bubbles: true,
              composed: true,
            }),
          );
        });

        span.addEventListener("mouseenter", () => {
          this._hovered = starValue;
          this.scheduleUpdate();
        });
      }

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      svg.setAttribute("viewBox", "0 0 16 16");

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", STAR_PATH);
      path.style.fill = filled ? FILLED_COLOR : EMPTY_COLOR;

      svg.appendChild(path);
      span.appendChild(svg);
      this._root.appendChild(span);
    }

    if (showValue) {
      const valSpan = document.createElement("span");
      valSpan.className = SR_VALUE_CLASS;
      valSpan.dataset.slot = "value";
      valSpan.textContent = value.toFixed(1);
      this._root.appendChild(valSpan);
    }
  }
}

define(NdsStarRating);
