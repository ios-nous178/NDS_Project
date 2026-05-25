/**
 * <nds-coupon-card> — DS CouponCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-coupon-card
 *     discount="30%"
 *     discount-suffix="할인"
 *     coupon-title="첫 상담 30% 할인"
 *     description="신규 가입자 한정"
 *     expiry="~2026.06.30"
 *     action-label="사용하기"
 *   ></nds-coupon-card>
 *
 * 이벤트:
 *   nds-coupon-action -> 액션 클릭
 *
 * 속성:
 *   discount / discount-suffix (default "할인")
 *   coupon-title / description / expiry
 *   action-label (default "사용하기") / disabled-label (default "사용 완료")
 *   show-action: 액션 버튼 노출
 *   disabled
 */

import { NdsElement, define } from "../base/nds-element.js";

const CC_CLASS = "nds-coupon-card";
const CC_LEFT_CLASS = `${CC_CLASS}__left`;
const CC_DIVIDER_CLASS = `${CC_CLASS}__divider`;
const CC_RIGHT_CLASS = `${CC_CLASS}__right`;
const CC_DISCOUNT_CLASS = `${CC_CLASS}__discount`;
const CC_TITLE_CLASS = `${CC_CLASS}__title`;
const CC_DESC_CLASS = `${CC_CLASS}__desc`;
const CC_EXPIRY_CLASS = `${CC_CLASS}__expiry`;
const CC_ACTION_CLASS = `${CC_CLASS}__action`;

export class NdsCouponCard extends NdsElement {
  static elementName = "nds-coupon-card";

  static get observedAttributes(): readonly string[] {
    return [
      "discount",
      "discount-suffix",
      "coupon-title",
      "description",
      "expiry",
      "action-label",
      "disabled-label",
      "show-action",
      "disabled",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _discountEl: HTMLSpanElement | null = null;
  private _discountSuffix: HTMLElement | null = null;
  private _titleEl: HTMLParagraphElement | null = null;
  private _descEl: HTMLSpanElement | null = null;
  private _expiryEl: HTMLSpanElement | null = null;
  private _actionBtn: HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CC_CLASS;

    const left = document.createElement("div");
    left.className = CC_LEFT_CLASS;

    const discountEl = document.createElement("span");
    discountEl.className = CC_DISCOUNT_CLASS;

    const discountSuffix = document.createElement("small");

    discountEl.appendChild(discountSuffix);
    left.appendChild(discountEl);

    const divider = document.createElement("span");
    divider.className = CC_DIVIDER_CLASS;
    divider.setAttribute("aria-hidden", "true");

    const right = document.createElement("div");
    right.className = CC_RIGHT_CLASS;

    const rightBody = document.createElement("div");

    const titleEl = document.createElement("p");
    titleEl.className = CC_TITLE_CLASS;

    const descEl = document.createElement("span");
    descEl.className = CC_DESC_CLASS;

    const expiryEl = document.createElement("span");
    expiryEl.className = CC_EXPIRY_CLASS;

    rightBody.append(titleEl, descEl, expiryEl);

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = CC_ACTION_CLASS;
    actionBtn.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this.dispatchEvent(new CustomEvent("nds-coupon-action", { bubbles: true, composed: true }));
    });

    right.append(rightBody, actionBtn);

    root.append(left, divider, right);
    this.appendChild(root);

    this._root = root;
    this._discountEl = discountEl;
    this._discountSuffix = discountSuffix;
    this._titleEl = titleEl;
    this._descEl = descEl;
    this._expiryEl = expiryEl;
    this._actionBtn = actionBtn;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._discountEl ||
      !this._discountSuffix ||
      !this._titleEl ||
      !this._descEl ||
      !this._expiryEl ||
      !this._actionBtn
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const discount = this.getAttribute("discount") || "";
    const discountSuffix = this.getAttribute("discount-suffix") ?? "할인";
    const title = this.getAttribute("coupon-title") || "";
    const description = this.getAttribute("description");
    const expiry = this.getAttribute("expiry");
    const actionLabel = this.getAttribute("action-label") || "사용하기";
    const disabledLabel = this.getAttribute("disabled-label") || "사용 완료";
    const showAction = this.boolAttr("show-action");
    const disabled = this.boolAttr("disabled");

    this._root.dataset.disabled = disabled ? "true" : "false";

    // Rebuild discount text content while keeping the <small> suffix.
    this._discountEl.childNodes.forEach((n) => {
      if (n !== this._discountSuffix) n.parentNode?.removeChild(n);
    });
    this._discountEl.insertBefore(document.createTextNode(discount), this._discountSuffix);

    if (discountSuffix) {
      this._discountSuffix.textContent = discountSuffix;
      this._discountSuffix.style.display = "";
    } else {
      this._discountSuffix.style.display = "none";
    }

    this._titleEl.textContent = title;

    if (description) {
      this._descEl.textContent = description;
      this._descEl.style.display = "";
    } else {
      this._descEl.style.display = "none";
    }

    if (expiry) {
      this._expiryEl.textContent = expiry;
      this._expiryEl.style.display = "";
    } else {
      this._expiryEl.style.display = "none";
    }

    if (showAction) {
      this._actionBtn.style.display = "";
      this._actionBtn.disabled = disabled;
      this._actionBtn.textContent = disabled ? disabledLabel : actionLabel;
    } else {
      this._actionBtn.style.display = "none";
    }
  }
}

define(NdsCouponCard);
