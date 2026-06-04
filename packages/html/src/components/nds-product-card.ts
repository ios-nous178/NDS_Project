/**
 * <nds-product-card> — DS ProductCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-product-card
 *     size="sm"
 *     thumbnail="/img/p.jpg"
 *     thumbnail-alt="상품 이미지"
 *     product-title="브랜드 텀블러 500ml"
 *     original-price="20000"
 *     discount-percent="30"
 *     price="14000"
 *     free-shipping
 *     buyers-count="1208"
 *     rating="4.7"
 *     review-count="42"
 *     clickable
 *   ></nds-product-card>
 *
 * 이벤트:
 *   nds-product-click -> 클릭
 *
 * 속성:
 *   size: "sm" | "md"
 *   thumbnail / thumbnail-alt
 *   badge / ranking-number / sold-out
 *   product-title
 *   original-price / discount-percent / price / currency (default "원")
 *   reward: JSON ({ amount, label? })
 *   free-shipping / point-discount
 *   buyers-count / rating / review-count
 *   clickable
 */

import { NdsElement, define } from "../base/nds-element.js";

const PC_CLASS = "nds-product-card";
const PC_THUMB_CLASS = `${PC_CLASS}__thumb`;
const PC_BADGE_CLASS = `${PC_CLASS}__badge`;
const PC_RANK_CLASS = `${PC_CLASS}__rank`;
const PC_OVERLAY_CLASS = `${PC_CLASS}__overlay`;
const PC_META_CLASS = `${PC_CLASS}__meta`;
const PC_TITLE_CLASS = `${PC_CLASS}__title`;
const PC_PRICE_ROW_CLASS = `${PC_CLASS}__price-row`;
const PC_DISCOUNT_CLASS = `${PC_CLASS}__discount`;
const PC_PRICE_CLASS = `${PC_CLASS}__price`;
const PC_CURRENCY_CLASS = `${PC_CLASS}__currency`;
const PC_ORIG_PRICE_CLASS = `${PC_CLASS}__orig-price`;
const PC_CHIP_ROW_CLASS = `${PC_CLASS}__chip-row`;
const PC_CHIP_CLASS = `${PC_CLASS}__chip`;
const PC_REWARD_CHIP_CLASS = `${PC_CLASS}__chip--reward`;
const PC_SHIPPING_CHIP_CLASS = `${PC_CLASS}__chip--shipping`;
const PC_POINT_CHIP_CLASS = `${PC_CLASS}__chip--point`;
const PC_FOOTER_CLASS = `${PC_CLASS}__footer`;
const PC_BUYERS_CLASS = `${PC_CLASS}__buyers`;
const PC_RATING_CLASS = `${PC_CLASS}__rating`;

export type ProductCardSize = "sm" | "md";

const formatNumber = (n: number) => new Intl.NumberFormat("ko-KR").format(n);
const formatBuyers = (n: number) => (n >= 10000 ? "9,999+" : formatNumber(n));
const formatRating = (n: number) => (Number.isInteger(n) ? `${n}.0` : n.toFixed(1));

const StarFilled = (size = 14) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M7 1L8.85 4.75L13 5.35L10 8.27L10.71 12.4L7 10.45L3.29 12.4L4 8.27L1 5.35L5.15 4.75L7 1Z" fill="#FFB800"/>`;
  return svg;
};

const PointIcon = (size = 16) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<circle cx="8" cy="8" r="7" fill="#FFD15B"/><text x="8" y="11" text-anchor="middle" font-size="9" font-weight="700" fill="#7A4A00">P</text>`;
  return svg;
};

export class NdsProductCard extends NdsElement {
  static elementName = "nds-product-card";

  static get observedAttributes(): readonly string[] {
    return [
      "size",
      "thumbnail",
      "thumbnail-alt",
      "badge",
      "ranking-number",
      "sold-out",
      "product-title",
      "original-price",
      "discount-percent",
      "price",
      "currency",
      "reward",
      "free-shipping",
      "point-discount",
      "buyers-count",
      "rating",
      "review-count",
      "clickable",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _onClick = () => {
    if (!this.boolAttr("clickable")) return;
    this.dispatchEvent(new CustomEvent("nds-product-click", { bubbles: true, composed: true }));
  };
  private _onKey = (e: KeyboardEvent) => {
    if (!this.boolAttr("clickable")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("nds-product-click", { bubbles: true, composed: true }));
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    if (this._root) {
      this._root.removeEventListener("click", this._onClick);
      this._root.removeEventListener("keydown", this._onKey);
    }
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = PC_CLASS;
    root.addEventListener("click", this._onClick);
    root.addEventListener("keydown", this._onKey);
    this.appendChild(root);
    this._root = root;
  }

  private _parseReward(): { amount: number; label?: string } | null {
    const raw = this.getAttribute("reward");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      const amount = typeof parsed.amount === "number" ? parsed.amount : NaN;
      if (Number.isNaN(amount) || amount <= 0) return null;
      return { amount, label: typeof parsed.label === "string" ? parsed.label : undefined };
    } catch (err) {
      // 조용히 삼키지 않는다 — JSON 속성 과이스케이프 시 디버깅 불가. (cf. nds-sidebar)
      console.warn("[nds-product-card] reward 가 유효한 JSON 이 아닙니다.", {
        error: err,
        rawHead: raw.slice(0, 80),
      });
      return null;
    }
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const size = (this.getAttribute("size") as ProductCardSize) || "sm";
    const thumbnail = this.getAttribute("thumbnail");
    const thumbAlt = this.getAttribute("thumbnail-alt") || "";
    const badge = this.getAttribute("badge");
    const rankingAttr = this.getAttribute("ranking-number");
    const soldOut = this.boolAttr("sold-out");
    const title = this.getAttribute("product-title") || "";
    const originalPriceAttr = this.getAttribute("original-price");
    const discountAttr = this.getAttribute("discount-percent");
    const priceAttr = this.getAttribute("price");
    const currency = this.getAttribute("currency") ?? "원";
    const reward = this._parseReward();
    const freeShipping = this.boolAttr("free-shipping");
    const pointDiscount = this.boolAttr("point-discount");
    const buyersAttr = this.getAttribute("buyers-count");
    const ratingAttr = this.getAttribute("rating");
    const reviewAttr = this.getAttribute("review-count");
    const clickable = this.boolAttr("clickable");

    const originalPrice = originalPriceAttr ? parseInt(originalPriceAttr, 10) : NaN;
    const discountPercent = discountAttr ? parseInt(discountAttr, 10) : NaN;
    const price = priceAttr ? parseInt(priceAttr, 10) : 0;
    const ranking = rankingAttr ? parseInt(rankingAttr, 10) : NaN;
    const buyers = buyersAttr ? parseInt(buyersAttr, 10) : NaN;
    const rating = ratingAttr ? parseFloat(ratingAttr) : NaN;
    const reviewCount = reviewAttr ? parseInt(reviewAttr, 10) : NaN;

    this._root.dataset.size = size;
    this._root.dataset.clickable = clickable ? "true" : "false";
    if (clickable) {
      this._root.setAttribute("role", "button");
      this._root.setAttribute("tabindex", "0");
    } else {
      this._root.removeAttribute("role");
      this._root.removeAttribute("tabindex");
    }

    this._root.innerHTML = "";

    const thumb = document.createElement("div");
    thumb.className = PC_THUMB_CLASS;
    if (thumbnail) {
      const img = document.createElement("img");
      img.src = thumbnail;
      img.alt = thumbAlt;
      thumb.appendChild(img);
    }
    if (!soldOut && !Number.isNaN(ranking)) {
      const rank = document.createElement("span");
      rank.className = PC_RANK_CLASS;
      rank.setAttribute("aria-label", `랭킹 ${ranking}위`);
      rank.textContent = String(ranking);
      thumb.appendChild(rank);
    } else if (!soldOut && badge) {
      const badgeEl = document.createElement("span");
      badgeEl.className = PC_BADGE_CLASS;
      badgeEl.textContent = badge;
      thumb.appendChild(badgeEl);
    }
    if (soldOut) {
      const overlay = document.createElement("div");
      overlay.className = PC_OVERLAY_CLASS;
      overlay.textContent = "품절";
      thumb.appendChild(overlay);
    }
    this._root.appendChild(thumb);

    const meta = document.createElement("div");
    meta.className = PC_META_CLASS;

    const titleEl = document.createElement("h3");
    titleEl.className = PC_TITLE_CLASS;
    titleEl.textContent = title;
    meta.appendChild(titleEl);

    if (pointDiscount) {
      const chip = document.createElement("span");
      chip.className = `${PC_CHIP_CLASS} ${PC_POINT_CHIP_CLASS}`;
      chip.appendChild(PointIcon(16));
      chip.appendChild(document.createTextNode("포인트할인"));
      meta.appendChild(chip);
    }

    if (!Number.isNaN(originalPrice) && originalPrice > 0) {
      const orig = document.createElement("p");
      orig.className = PC_ORIG_PRICE_CLASS;
      orig.textContent = `${formatNumber(originalPrice)}원`;
      meta.appendChild(orig);
    }

    const priceRow = document.createElement("div");
    priceRow.className = PC_PRICE_ROW_CLASS;
    if (!Number.isNaN(discountPercent) && discountPercent > 0) {
      const d = document.createElement("span");
      d.className = PC_DISCOUNT_CLASS;
      d.textContent = `${discountPercent}%`;
      priceRow.appendChild(d);
    }
    const priceEl = document.createElement("span");
    priceEl.className = PC_PRICE_CLASS;
    priceEl.textContent = formatNumber(price);
    priceRow.appendChild(priceEl);
    if (currency) {
      const cur = document.createElement("span");
      cur.className = PC_CURRENCY_CLASS;
      cur.textContent = currency;
      priceRow.appendChild(cur);
    }
    meta.appendChild(priceRow);

    const hasChipRow = !!reward || freeShipping;
    if (hasChipRow) {
      const chipRow = document.createElement("div");
      chipRow.className = PC_CHIP_ROW_CLASS;
      if (reward) {
        const rewardChip = document.createElement("span");
        rewardChip.className = `${PC_CHIP_CLASS} ${PC_REWARD_CHIP_CLASS}`;
        rewardChip.appendChild(PointIcon(16));
        const txt = document.createElement("span");
        const strong = document.createElement("strong");
        strong.textContent = formatNumber(reward.amount);
        txt.appendChild(strong);
        txt.appendChild(document.createTextNode(reward.label ?? "적립"));
        rewardChip.appendChild(txt);
        chipRow.appendChild(rewardChip);
      }
      if (freeShipping) {
        const ship = document.createElement("span");
        ship.className = `${PC_CHIP_CLASS} ${PC_SHIPPING_CHIP_CLASS}`;
        ship.textContent = "무료배송";
        chipRow.appendChild(ship);
      }
      meta.appendChild(chipRow);
    }

    const hasBuyers = !Number.isNaN(buyers);
    const hasRating = !Number.isNaN(rating);
    if (hasBuyers || hasRating) {
      const footer = document.createElement("div");
      footer.className = PC_FOOTER_CLASS;
      if (hasBuyers) {
        const buyersEl = document.createElement("p");
        buyersEl.className = PC_BUYERS_CLASS;
        const strong = document.createElement("strong");
        strong.textContent = `${formatBuyers(buyers)}명`;
        buyersEl.appendChild(strong);
        buyersEl.appendChild(document.createTextNode(" 구매중"));
        footer.appendChild(buyersEl);
      } else {
        footer.appendChild(document.createElement("span"));
      }
      if (hasRating) {
        const ratingEl = document.createElement("span");
        ratingEl.className = PC_RATING_CLASS;
        ratingEl.setAttribute("aria-label", `별점 ${formatRating(rating)}점`);
        ratingEl.appendChild(StarFilled(14));
        ratingEl.appendChild(document.createTextNode(formatRating(rating)));
        if (!Number.isNaN(reviewCount)) {
          const review = document.createElement("span");
          review.dataset.slot = "review-count";
          review.textContent = `(${formatNumber(reviewCount)})`;
          ratingEl.appendChild(review);
        }
        footer.appendChild(ratingEl);
      }
      meta.appendChild(footer);
    }

    this._root.appendChild(meta);
  }
}

define(NdsProductCard);
