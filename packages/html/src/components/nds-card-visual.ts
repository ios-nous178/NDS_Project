/**
 * <nds-card-visual> — DS CardVisual 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-card-visual brand="visa" number="1234567890123456" holder="HONG GIL DONG"
 *     expiry="12/29" label="주력카드"></nds-card-visual>
 */

import { NdsElement, define } from "../base/nds-element.js";

const CV_CLASS = "nds-card-visual";
const CV_BRAND_CLASS = `${CV_CLASS}__brand`;
const CV_NUMBER_CLASS = `${CV_CLASS}__number`;
const CV_BOTTOM_CLASS = `${CV_CLASS}__bottom`;
const CV_HOLDER_CLASS = `${CV_CLASS}__holder`;
const CV_EXPIRY_CLASS = `${CV_CLASS}__expiry`;
const CV_CHIP_CLASS = `${CV_CLASS}__chip`;
const CV_LABEL_CLASS = `${CV_CLASS}__label`;

export type CardVisualBrand =
  | "visa"
  | "master"
  | "amex"
  | "kakao"
  | "naver"
  | "samsung"
  | "shinhan"
  | "kb"
  | "generic";

const BRANDS: readonly CardVisualBrand[] = [
  "visa",
  "master",
  "amex",
  "kakao",
  "naver",
  "samsung",
  "shinhan",
  "kb",
  "generic",
];

const BRAND_BG: Record<CardVisualBrand, string> = {
  visa: "linear-gradient(135deg, #1A1F71 0%, #2D3CB1 100%)",
  master: "linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)",
  amex: "linear-gradient(135deg, #006FCF 0%, #00A6E8 100%)",
  kakao: "linear-gradient(135deg, #FFCC00 0%, #FBE54E 100%)",
  naver: "linear-gradient(135deg, #03C75A 0%, #1AD673 100%)",
  samsung: "linear-gradient(135deg, #1428A0 0%, #5158BB 100%)",
  shinhan: "linear-gradient(135deg, #0046FF 0%, #2E6BFF 100%)",
  kb: "linear-gradient(135deg, #FFB300 0%, #FFD54F 100%)",
  generic: "linear-gradient(135deg, #1A1A1A 0%, #444 100%)",
};

const BRAND_FG: Record<CardVisualBrand, string> = {
  visa: "#fff",
  master: "#fff",
  amex: "#fff",
  kakao: "#1A1A1A",
  naver: "#fff",
  samsung: "#fff",
  shinhan: "#fff",
  kb: "#1A1A1A",
  generic: "#fff",
};

const BRAND_LABEL: Record<CardVisualBrand, string> = {
  visa: "VISA",
  master: "Mastercard",
  amex: "AMEX",
  kakao: "카카오뱅크",
  naver: "네이버페이",
  samsung: "삼성카드",
  shinhan: "신한카드",
  kb: "KB국민카드",
  generic: "Card",
};

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

function formatNumber(raw: string): string {
  const last4 = raw.replace(/\D/g, "").slice(-4);
  if (!last4) return "•••• •••• •••• ••••";
  return `•••• •••• •••• ${last4}`;
}

export class NdsCardVisual extends NdsElement {
  static elementName = "nds-card-visual";

  static get observedAttributes(): readonly string[] {
    return [
      "brand",
      "number",
      "holder",
      "expiry",
      "label",
      "no-chip",
      "disabled",
      ...FORWARDED_ATTRS,
    ];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CV_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const brand = this._normalizedBrand();
    const disabled = this.boolAttr("disabled");
    const showChip = !this.boolAttr("no-chip");

    this._root.dataset.brand = brand;
    this._root.dataset.disabled = disabled ? "true" : "false";
    this._root.style.setProperty("--nds-card-bg", BRAND_BG[brand]);
    this._root.style.setProperty("--nds-card-fg", BRAND_FG[brand]);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const top = this._createTop(brand, showChip);
    const number = this._createNumber();
    const bottom = this._createBottom();
    this._root.replaceChildren(top, number, bottom);
  }

  private _createTop(brand: CardVisualBrand, showChip: boolean): HTMLDivElement {
    const wrap = document.createElement("div");

    const brandRow = document.createElement("div");
    brandRow.className = CV_BRAND_CLASS;

    const strong = document.createElement("strong");
    strong.textContent = BRAND_LABEL[brand];
    brandRow.appendChild(strong);

    const label = this.getAttribute("label");
    if (label) {
      const labelEl = document.createElement("span");
      labelEl.className = CV_LABEL_CLASS;
      labelEl.textContent = label;
      brandRow.appendChild(labelEl);
    }
    wrap.appendChild(brandRow);

    if (showChip) {
      const chip = document.createElement("div");
      chip.className = CV_CHIP_CLASS;
      chip.setAttribute("aria-hidden", "true");
      wrap.appendChild(chip);
    }
    return wrap;
  }

  private _createNumber(): HTMLDivElement {
    const div = document.createElement("div");
    div.className = CV_NUMBER_CLASS;
    div.textContent = formatNumber(this.getAttribute("number") ?? "");
    return div;
  }

  private _createBottom(): HTMLDivElement {
    const wrap = document.createElement("div");
    wrap.className = CV_BOTTOM_CLASS;

    const holder = document.createElement("span");
    holder.className = CV_HOLDER_CLASS;
    holder.textContent = this.getAttribute("holder") ?? "Card Holder";
    wrap.appendChild(holder);

    const expiry = this.getAttribute("expiry");
    if (expiry) {
      const expiryEl = document.createElement("span");
      expiryEl.className = CV_EXPIRY_CLASS;
      expiryEl.textContent = expiry;
      wrap.appendChild(expiryEl);
    }
    return wrap;
  }

  private _normalizedBrand(): CardVisualBrand {
    const value = this.attr("brand", "generic");
    return (BRANDS as readonly string[]).includes(value) ? (value as CardVisualBrand) : "generic";
  }
}

define(NdsCardVisual);
