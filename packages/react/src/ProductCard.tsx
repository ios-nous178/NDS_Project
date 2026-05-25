import React from "react";

import { CashdealPointIcon, StarFilledIcon } from "@nudge-eap/icons";

/* ─── Constants ─── */

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

/* ─── Types ─── */

export type ProductCardSize = "sm" | "md";

export interface ProductCardReward {
  /** 적립 금액/포인트 */
  amount: number;
  /** 단위 라벨 — 기본 "적립" */
  label?: string;
}

export interface ProductCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 사이즈 — `sm`: 140w(모바일), `md`: 236w(데스크탑). 기본 `sm` */
  size?: ProductCardSize;
  /** 썸네일 이미지 URL */
  thumbnail?: string;
  /** 썸네일 alt */
  thumbnailAlt?: string;
  /** 좌상단 텍스트 뱃지 (예: "NEW", "BEST"). `soldOut`/`rankingNumber` 와 동시 노출 금지 */
  badge?: React.ReactNode;
  /** 좌상단 랭킹 배지 (1~N). 캐시딜 랭킹용. `badge` 보다 우선 — 동시 지정 시 ranking 만 노출 */
  rankingNumber?: number;
  /** 상품 제목 — 2줄 ellipsis */
  title: React.ReactNode;
  /** 원가 (취소선) — 할인 전 가격. `price` 보다 위에 노출 */
  originalPrice?: number;
  /** 할인율 (예: 31 → "31%"). 0/undefined 면 숨김 */
  discountPercent?: number;
  /** 가격 (KRW 단위 숫자). 자동으로 천단위 콤마 포맷 */
  price: number;
  /** 가격 단위 (기본: "원") */
  currency?: React.ReactNode;
  /** 적립 칩 — 캐시딜 포인트 아이콘 + 금액 + "적립" */
  reward?: ProductCardReward;
  /** 무료배송 칩 */
  freeShipping?: boolean;
  /** "포인트할인" 외곽선 칩 (모바일 캐시딜 패턴) */
  pointDiscount?: boolean;
  /** 구매자 수 — 자동 포맷. 10,000 이상은 "9,999+명" 으로 truncate */
  buyersCount?: number;
  /** 별점 (0~5) */
  rating?: number;
  /** 리뷰 수 — rating 우측 "(1,208)" 노출. rating 없으면 무시 */
  reviewCount?: number;
  /** 품절 표시 (썸네일 위 오버레이) */
  soldOut?: boolean;
  /** 카드 클릭 */
  onClick?: () => void;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatNumber = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

const formatBuyers = (n: number) => (n >= 10000 ? "9,999+" : formatNumber(n));

const formatRating = (n: number) => (Number.isInteger(n) ? `${n}.0` : n.toFixed(1));

/* ─── Component ─── */

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      size = "sm",
      thumbnail,
      thumbnailAlt = "",
      badge,
      rankingNumber,
      title,
      originalPrice,
      discountPercent,
      price,
      currency = "원",
      reward,
      freeShipping,
      pointDiscount,
      buyersCount,
      rating,
      reviewCount,
      soldOut = false,
      onClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const clickable = !!onClick;
    const hasOriginalPrice = typeof originalPrice === "number" && originalPrice > 0;
    const hasDiscount = typeof discountPercent === "number" && discountPercent > 0;
    const hasReward = reward && reward.amount > 0;
    const hasChipRow = hasReward || freeShipping;
    const hasFooter = typeof buyersCount === "number" || typeof rating === "number";

    return (
      <div
        ref={ref}
        data-slot="root"
        data-size={size}
        data-clickable={clickable ? "true" : "false"}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (clickable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={cx(PC_CLASS, className)}
        {...rest}
      >
        <div className={PC_THUMB_CLASS}>
          {thumbnail && <img src={thumbnail} alt={thumbnailAlt} />}
          {!soldOut && typeof rankingNumber === "number" ? (
            <span className={PC_RANK_CLASS} aria-label={`랭킹 ${rankingNumber}위`}>
              {rankingNumber}
            </span>
          ) : (
            !soldOut && badge && <span className={PC_BADGE_CLASS}>{badge}</span>
          )}
          {soldOut && <div className={PC_OVERLAY_CLASS}>품절</div>}
        </div>
        <div className={PC_META_CLASS}>
          <h3 className={PC_TITLE_CLASS}>{title}</h3>

          {pointDiscount && (
            <span className={cx(PC_CHIP_CLASS, PC_POINT_CHIP_CLASS)}>
              <CashdealPointIcon size={16} aria-hidden="true" />
              포인트할인
            </span>
          )}

          {hasOriginalPrice && (
            <p className={PC_ORIG_PRICE_CLASS}>{formatNumber(originalPrice)}원</p>
          )}

          <div className={PC_PRICE_ROW_CLASS}>
            {hasDiscount && <span className={PC_DISCOUNT_CLASS}>{discountPercent}%</span>}
            <span className={PC_PRICE_CLASS}>{formatNumber(price)}</span>
            {currency && <span className={PC_CURRENCY_CLASS}>{currency}</span>}
          </div>

          {hasChipRow && (
            <div className={PC_CHIP_ROW_CLASS}>
              {hasReward && (
                <span className={cx(PC_CHIP_CLASS, PC_REWARD_CHIP_CLASS)}>
                  <CashdealPointIcon size={16} aria-hidden="true" />
                  <span>
                    <strong>{formatNumber(reward.amount)}</strong>
                    {reward.label ?? "적립"}
                  </span>
                </span>
              )}
              {freeShipping && (
                <span className={cx(PC_CHIP_CLASS, PC_SHIPPING_CHIP_CLASS)}>무료배송</span>
              )}
            </div>
          )}

          {hasFooter && (
            <div className={PC_FOOTER_CLASS}>
              {typeof buyersCount === "number" ? (
                <p className={PC_BUYERS_CLASS}>
                  <strong>{formatBuyers(buyersCount)}명</strong> 구매중
                </p>
              ) : (
                <span />
              )}
              {typeof rating === "number" && (
                <span className={PC_RATING_CLASS} aria-label={`별점 ${formatRating(rating)}점`}>
                  <StarFilledIcon size={14} aria-hidden="true" />
                  {formatRating(rating)}
                  {typeof reviewCount === "number" && (
                    <span data-slot="review-count">({formatNumber(reviewCount)})</span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
