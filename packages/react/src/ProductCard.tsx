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
const PC_BODY_CLASS = `${PC_CLASS}__body`;
const PC_TITLE_CLASS = `${PC_CLASS}__title`;
const PC_DESC_CLASS = `${PC_CLASS}__desc`;
const PC_PRICE_CLASS = `${PC_CLASS}__price`;
const PC_FOOTER_CLASS = `${PC_CLASS}__footer`;

/* ─── Types ─── */

export interface ProductCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 썸네일 이미지 URL */
  thumbnail?: string;
  /** 썸네일 alt */
  thumbnailAlt?: string;
  /** 좌상단 뱃지 (예: "NEW", "BEST") */
  badge?: React.ReactNode;
  /** 상품 제목 */
  title: React.ReactNode;
  /** 보조 설명 (브랜드/카테고리) */
  description?: React.ReactNode;
  /** 가격 슬롯 (PriceTag 권장) */
  price: React.ReactNode;
  /** 푸터 슬롯 (별점/리뷰수 등) */
  footer?: React.ReactNode;
  /** 품절 표시 */
  soldOut?: boolean;
  /** 카드 클릭 (디테일 진입) */
  onClick?: () => void;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const pcStyles = `
  :where(.${PC_CLASS}) {
    display: flex;
    flex-direction: column;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    overflow: hidden;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${PC_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${PC_CLASS}[data-clickable="true"]:hover) { border-color: ${cv.primary.main}; }

  :where(.${PC_THUMB_CLASS}) {
    position: relative;
    aspect-ratio: 1;
    background: ${cv.bg.coolGray};
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
    padding: 2px 8px;
    border-radius: 9999px;
    background: var(--semantic-error-main, #E04D4D);
    color: #fff;
    font-size: ${typeScale.caption2.fontSize}px;
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
    color: ${cv.text.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${PC_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: ${spacing[12]}px ${spacing[16]}px;
  }

  :where(.${PC_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.text.subtle};
  }

  :where(.${PC_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.text.default};
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  :where(.${PC_PRICE_CLASS}) {
    margin-top: ${spacing[4]}px;
  }

  :where(.${PC_FOOTER_CLASS}) {
    margin-top: ${spacing[4]}px;
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.text.subtle};
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      thumbnail,
      thumbnailAlt = "",
      badge,
      title,
      description,
      price,
      footer,
      soldOut = false,
      onClick,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-clickable={onClick ? "true" : "false"}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
        className={cx(PC_CLASS, className)}
        {...rest}
      >
        <div className={PC_THUMB_CLASS}>
          {thumbnail && <img src={thumbnail} alt={thumbnailAlt} />}
          {badge && <span className={PC_BADGE_CLASS}>{badge}</span>}
          {soldOut && <div className={PC_OVERLAY_CLASS}>품절</div>}
        </div>
        <div className={PC_BODY_CLASS}>
          {description && <span className={PC_DESC_CLASS}>{description}</span>}
          <h3 className={PC_TITLE_CLASS}>{title}</h3>
          <div className={PC_PRICE_CLASS}>{price}</div>
          {footer && <div className={PC_FOOTER_CLASS}>{footer}</div>}
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
