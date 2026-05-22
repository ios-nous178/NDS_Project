import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const PC_CLASS = "nds-product-card";
const PC_THUMB_CLASS = `${PC_CLASS}__thumb`;
const PC_BADGE_CLASS = `${PC_CLASS}__badge`;
const PC_OVERLAY_CLASS = `${PC_CLASS}__overlay`;
const PC_META_CLASS = `${PC_CLASS}__meta`;
const PC_TITLE_CLASS = `${PC_CLASS}__title`;
const PC_PRICE_ROW_CLASS = `${PC_CLASS}__price-row`;
const PC_DISCOUNT_CLASS = `${PC_CLASS}__discount`;
const PC_PRICE_CLASS = `${PC_CLASS}__price`;
const PC_CURRENCY_CLASS = `${PC_CLASS}__currency`;

/* ─── Types ─── */

export interface ProductCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 썸네일 이미지 URL */
  thumbnail?: string;
  /** 썸네일 alt */
  thumbnailAlt?: string;
  /** 좌상단 뱃지 (예: "NEW", "BEST"). `soldOut` 과 동시 노출 금지(가이드) */
  badge?: React.ReactNode;
  /** 상품 제목 — 2줄 ellipsis */
  title: React.ReactNode;
  /** 할인율 (예: 31 → "31%"). 0/undefined 면 숨김 */
  discountPercent?: number;
  /** 가격 (KRW 단위 숫자). 자동으로 천단위 콤마 포맷 */
  price: number;
  /** 가격 단위 (기본: "원") */
  currency?: React.ReactNode;
  /** 품절 표시 (썸네일 위 오버레이) */
  soldOut?: boolean;
  /** 카드 클릭 */
  onClick?: () => void;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const pcStyles = `
  :where(.${PC_CLASS}) {
    display: flex;
    flex-direction: column;
    width: 140px;
    background: transparent;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    border: none;
    padding: 0;
    text-align: left;
  }

  :where(.${PC_CLASS}[data-clickable="true"]) {
    cursor: pointer;
    transition: opacity ${transition.default};
  }

  @media (hover: hover) {
    :where(.${PC_CLASS}[data-clickable="true"]:hover) {
      opacity: 0.85;
    }
  }

  /* ─── Thumbnail ─── */

  :where(.${PC_THUMB_CLASS}) {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: ${cv.surface.section};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    overflow: hidden;
  }

  :where(.${PC_THUMB_CLASS}) > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  :where(.${PC_BADGE_CLASS}) {
    position: absolute;
    top: ${spacing[8]}px;
    left: ${spacing[8]}px;
    padding: 2px 6px;
    border-radius: ${radius.sm}px;
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    font-weight: ${fontWeight.bold};
    z-index: 1;
  }

  :where(.${PC_OVERLAY_CLASS}) {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
  }

  /* ─── Meta ─── */

  :where(.${PC_META_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
    margin-top: ${spacing[8]}px;
  }

  :where(.${PC_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.strong};
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }

  :where(.${PC_PRICE_ROW_CLASS}) {
    display: inline-flex;
    align-items: baseline;
    gap: ${spacing[2]}px;
    white-space: nowrap;
  }

  :where(.${PC_DISCOUNT_CLASS}) {
    font-family: 'Lato', ${fontFamily.web};
    font-size: 18px;
    line-height: 24px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.statusError};
    letter-spacing: -0.3px;
  }

  :where(.${PC_PRICE_CLASS}) {
    font-family: 'Lato', ${fontFamily.web};
    font-size: 18px;
    line-height: 24px;
    /* Lato Black = 900 — Lato 미로드 시 Pretendard Bold(700) 로 graceful fallback */
    font-weight: 900;
    color: ${cv.textRole.strong};
    letter-spacing: -0.3px;
  }

  :where(.${PC_CURRENCY_CLASS}) {
    font-family: ${fontFamily.web};
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.strong};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatPrice = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

/* ─── Component ─── */

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      thumbnail,
      thumbnailAlt = "",
      badge,
      title,
      discountPercent,
      price,
      currency = "원",
      soldOut = false,
      onClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const clickable = !!onClick;
    return (
      <div
        ref={ref}
        data-slot="root"
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
          {!soldOut && badge && <span className={PC_BADGE_CLASS}>{badge}</span>}
          {soldOut && <div className={PC_OVERLAY_CLASS}>품절</div>}
        </div>
        <div className={PC_META_CLASS}>
          <h3 className={PC_TITLE_CLASS}>{title}</h3>
          <div className={PC_PRICE_ROW_CLASS}>
            {typeof discountPercent === "number" && discountPercent > 0 && (
              <span className={PC_DISCOUNT_CLASS}>{discountPercent}%</span>
            )}
            <span className={PC_PRICE_CLASS}>{formatPrice(price)}</span>
            {currency && <span className={PC_CURRENCY_CLASS}>{currency}</span>}
          </div>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
