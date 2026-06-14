/**
 * <nds-star-rating> — DS StarRating 의 vanilla Web Component 버전.
 *
 * 사용 예 (표시 전용):
 *   <nds-star-rating value="4" size="24" show-value></nds-star-rating>
 *
 * 사용 예 (입력 — 클릭해서 별점 선택):
 *   <nds-star-rating value="0" interactive></nds-star-rating>
 *   el.addEventListener("star-rating-change", e => save(e.detail.value));
 *
 * 입력 모드: `interactive` 불리언 속성으로 켠다(권장). (레거시: `on-change` 속성도 동일 동작)
 *
 * 이벤트:
 *   star-rating-change (detail: { value }) -> 별 클릭 시 발생
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";
import { createStarSvg, starFillState, type StarPrecision } from "../base/star-icons.js";

const SR_CLASS = "nds-star-rating";
const SR_STAR_CLASS = `${SR_CLASS}__star`;
const SR_VALUE_CLASS = `${SR_CLASS}__value`;

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
    return [...COMPONENT_ATTRS["nds-star-rating"].observedAttributes, "readonly", "interactive"];
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
    // 입력(클릭) 모드 켜기: `interactive` 불리언 속성(권장) 또는 레거시 `on-change` 플래그.
    // 둘 다 없으면 표시 전용(readonly). React 는 onValueChange 핸들러 유무로 같은 동작.
    const editable = this.boolAttr("interactive") || this.hasAttribute("on-change");
    const readonly = this.boolAttr("readonly") || !editable;

    const interactive = !disabled && !readonly;
    // 인터랙티브는 반쪽 별 없음(클릭=정수 선택). hover 시엔 hover 값 미리보기.
    const precision: StarPrecision =
      !interactive && this.attr("precision", "full") === "half" ? "half" : "full";
    const displayValue = this._hovered !== null ? this._hovered : value;

    this._root.dataset.interactive = String(interactive);
    this._root.setAttribute("role", interactive ? "radiogroup" : "img");
    this._root.setAttribute("aria-label", `${value} out of ${max} stars`);

    this._root.innerHTML = "";

    for (let i = 1; i <= max; i++) {
      const starValue = i;
      const fill = starFillState(starValue, displayValue, precision);

      const span = document.createElement("span");
      span.className = SR_STAR_CLASS;
      span.dataset.slot = "star";
      span.dataset.filled = String(fill === "full");
      span.dataset.fill = fill;
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

      span.appendChild(createStarSvg(fill, size));
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
