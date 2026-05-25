/**
 * <nds-price-tag> — DS PriceTag 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";

const PT_CLASS = "nds-price-tag";
const PT_DISCOUNT_CLASS = `${PT_CLASS}__discount`;
const PT_AMOUNT_CLASS = `${PT_CLASS}__amount`;
const PT_ORIGINAL_CLASS = `${PT_CLASS}__original`;
const PT_UNIT_CLASS = `${PT_CLASS}__unit`;

export type PriceTagSize = "sm" | "md" | "lg";

const SIZE_CONFIG: Record<PriceTagSize, { amount: number; original: number; gap: string }> = {
  sm: { amount: 14, original: 12, gap: "var(--gap-tight)" },
  md: { amount: 18, original: 13, gap: "6px" },
  lg: { amount: 24, original: 14, gap: "var(--gap-default)" },
};

const SIZE_NAMES = Object.keys(SIZE_CONFIG) as PriceTagSize[];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsPriceTag extends NdsElement {
  static elementName = "nds-price-tag";

  static get observedAttributes(): readonly string[] {
    return [
      "amount",
      "original-amount",
      "unit",
      "prefix",
      "size",
      "discount-position",
      "format-thousands",
      "free-label",
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
    root.className = PT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const amountRaw = this.getAttribute("amount") ?? "0";
    const amountNumber = Number(String(amountRaw).replace(/[^0-9.-]/g, ""));
    const isNumericAmount = amountRaw.trim() !== "" && Number.isFinite(amountNumber);
    const originalAmount = this._numberAttr("original-amount");
    const unit = this.attr("unit", "원");
    const prefix = this.getAttribute("prefix") ?? "";
    const size = this._normalizedSize();
    const cfg = SIZE_CONFIG[size];
    const shouldFormat = this._boolAttrDefaultTrue("format-thousands");
    const freeLabel = this.attr("free-label", "무료");
    const isFree = isNumericAmount && amountNumber === 0;
    const formattedAmount = isNumericAmount
      ? shouldFormat
        ? formatNumber(amountNumber)
        : String(amountNumber)
      : amountRaw;
    const discountPct =
      originalAmount !== undefined && originalAmount > 0 && isNumericAmount
        ? Math.round((1 - amountNumber / originalAmount) * 100)
        : 0;

    this._root.style.setProperty("--nds-price-amount-size", `${cfg.amount}px`);
    this._root.style.setProperty("--nds-price-original-size", `${cfg.original}px`);
    this._root.style.setProperty("--nds-price-gap", cfg.gap);

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren();
    if (discountPct > 0 && this.attr("discount-position", "before") === "before") {
      this._root.appendChild(createSpan(PT_DISCOUNT_CLASS, `${discountPct}%`));
    }

    const amount = createSpan(PT_AMOUNT_CLASS, isFree ? freeLabel : `${prefix}${formattedAmount}`);
    amount.dataset.free = isFree ? "true" : "false";
    this._root.appendChild(amount);

    if (!isFree && unit) this._root.appendChild(createSpan(PT_UNIT_CLASS, unit));

    if (originalAmount !== undefined && isNumericAmount && originalAmount > amountNumber) {
      const original = shouldFormat ? formatNumber(originalAmount) : String(originalAmount);
      this._root.appendChild(createSpan(PT_ORIGINAL_CLASS, `${prefix}${original}${unit}`));
    }
  }

  private _normalizedSize(): PriceTagSize {
    const value = this.attr("size", "md");
    return (SIZE_NAMES as readonly string[]).includes(value) ? (value as PriceTagSize) : "md";
  }

  private _numberAttr(name: string): number | undefined {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private _boolAttrDefaultTrue(name: string): boolean {
    const value = this.getAttribute(name);
    if (value === null) return true;
    return value !== "false";
  }
}

function createSpan(className: string, text: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

define(NdsPriceTag);
