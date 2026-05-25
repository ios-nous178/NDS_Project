import React from "react";

/* ─── Constants ─── */

const CC_CLASS = "nds-coupon-card";
const CC_LEFT_CLASS = `${CC_CLASS}__left`;
const CC_DIVIDER_CLASS = `${CC_CLASS}__divider`;
const CC_RIGHT_CLASS = `${CC_CLASS}__right`;
const CC_DISCOUNT_CLASS = `${CC_CLASS}__discount`;
const CC_TITLE_CLASS = `${CC_CLASS}__title`;
const CC_DESC_CLASS = `${CC_CLASS}__desc`;
const CC_EXPIRY_CLASS = `${CC_CLASS}__expiry`;
const CC_ACTION_CLASS = `${CC_CLASS}__action`;

/* ─── Types ─── */

export interface CouponCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 할인 금액/율 표시 (예: "30%", "5,000원") */
  discount: React.ReactNode;
  /** 보조 단위 (예: "할인", "OFF") */
  discountSuffix?: React.ReactNode;
  /** 쿠폰 제목 */
  title: React.ReactNode;
  /** 조건/설명 */
  description?: React.ReactNode;
  /** 만료일 라벨 */
  expiry?: React.ReactNode;
  /** 사용 버튼 라벨 */
  actionLabel?: string;
  /** 사용/받기 콜백 */
  onAction?: () => void;
  /** 비활성/만료 */
  disabled?: boolean;
  /** 비활성 라벨 (사용 완료/만료) */
  disabledLabel?: string;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const CouponCard = React.forwardRef<HTMLDivElement, CouponCardProps>(
  (
    {
      discount,
      discountSuffix = "할인",
      title,
      description,
      expiry,
      actionLabel = "사용하기",
      onAction,
      disabled = false,
      disabledLabel = "사용 완료",
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-disabled={disabled ? "true" : "false"}
        className={cx(CC_CLASS, className)}
        {...rest}
      >
        <div className={CC_LEFT_CLASS}>
          <span className={CC_DISCOUNT_CLASS}>
            {discount}
            {discountSuffix && <small>{discountSuffix}</small>}
          </span>
        </div>
        <span className={CC_DIVIDER_CLASS} aria-hidden />
        <div className={CC_RIGHT_CLASS}>
          <div>
            <p className={CC_TITLE_CLASS}>{title}</p>
            {description && <span className={CC_DESC_CLASS}>{description}</span>}
            {expiry && <span className={CC_EXPIRY_CLASS}>{expiry}</span>}
          </div>
          {onAction && (
            <button
              type="button"
              className={CC_ACTION_CLASS}
              disabled={disabled}
              onClick={onAction}
            >
              {disabled ? disabledLabel : actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  },
);

CouponCard.displayName = "CouponCard";
