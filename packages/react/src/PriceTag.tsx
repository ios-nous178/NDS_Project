import React from "react";
import { cv, fontFamily, fontWeight } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const PT_CLASS = "nds-price-tag";
const PT_DISCOUNT_CLASS = `${PT_CLASS}__discount`;
const PT_AMOUNT_CLASS = `${PT_CLASS}__amount`;
const PT_ORIGINAL_CLASS = `${PT_CLASS}__original`;
const PT_UNIT_CLASS = `${PT_CLASS}__unit`;

const sizeConfig = {
  sm: { amount: 14, original: 12, gap: "var(--gap-tight)" },
  md: { amount: 18, original: 13, gap: 6 },
  lg: { amount: 24, original: 14, gap: "var(--gap-default)" },
} as const;

export type PriceTagSize = keyof typeof sizeConfig;

/* ─── Types ─── */

export interface PriceTagProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 가격 (숫자 또는 이미 포맷된 문자열) */
  amount: number | string;
  /** 원가 (할인 전 가격). 지정 시 취소선 + 할인율 자동 */
  originalAmount?: number;
  /** 통화 단위 (기본 "원") */
  unit?: string;
  /** 통화 prefix (예: "$"). suffix(`unit`)와 함께 쓰면 "$1,000원"이 됨 */
  prefix?: string;
  /** 크기 */
  size?: PriceTagSize;
  /** 할인율 표시 위치 (기본 amount 앞) */
  discountPosition?: "before" | "none";
  /** 천 단위 콤마 자동 (기본 true) */
  formatThousands?: boolean;
  /** 무료 (0원) 라벨 */
  freeLabel?: string;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const ptStyles = `
  :where(.${PT_CLASS}) {
    display: inline-flex;
    align-items: baseline;
    gap: var(--nds-price-gap, 6px);
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
  }

  :where(.${PT_DISCOUNT_CLASS}) {
    color: var(--semantic-text-status-error);
    font-size: var(--nds-price-amount-size, 18px);
    font-weight: ${fontWeight.bold};
  }

  :where(.${PT_AMOUNT_CLASS}) {
    font-size: var(--nds-price-amount-size, 18px);
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${PT_AMOUNT_CLASS}[data-free="true"]) {
    color: var(--semantic-text-status-success);
  }

  :where(.${PT_UNIT_CLASS}) {
    font-size: var(--nds-price-amount-size, 18px);
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${PT_ORIGINAL_CLASS}) {
    font-size: var(--nds-price-original-size, 13px);
    color: ${cv.textRole.subtle};
    text-decoration: line-through;
    font-weight: ${fontWeight.medium};
    font-variant-numeric: tabular-nums;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatNumber = (n: number) => n.toLocaleString("ko-KR");

/* ─── Component ─── */

export const PriceTag = React.forwardRef<HTMLDivElement, PriceTagProps>(
  (
    {
      amount,
      originalAmount,
      unit = "원",
      prefix,
      size = "md",
      discountPosition = "before",
      formatThousands = true,
      freeLabel = "무료",
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const s = sizeConfig[size];
    const numericAmount =
      typeof amount === "number" ? amount : Number(String(amount).replace(/[^0-9.-]/g, ""));
    const isFree = numericAmount === 0;

    const formattedAmount =
      typeof amount === "string" ? amount : formatThousands ? formatNumber(amount) : String(amount);

    const discountPct =
      typeof originalAmount === "number" && originalAmount > 0 && typeof amount === "number"
        ? Math.round((1 - amount / originalAmount) * 100)
        : 0;

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(PT_CLASS, className)}
        style={
          {
            "--nds-price-amount-size": `${s.amount}px`,
            "--nds-price-original-size": `${s.original}px`,
            "--nds-price-gap": `${s.gap}px`,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {discountPct > 0 && discountPosition === "before" && (
          <span className={PT_DISCOUNT_CLASS}>{discountPct}%</span>
        )}
        <span className={PT_AMOUNT_CLASS} data-free={isFree ? "true" : "false"}>
          {isFree ? freeLabel : `${prefix ?? ""}${formattedAmount}`}
        </span>
        {!isFree && unit && <span className={PT_UNIT_CLASS}>{unit}</span>}
        {originalAmount !== undefined &&
          originalAmount > (typeof amount === "number" ? amount : 0) && (
            <span className={PT_ORIGINAL_CLASS}>
              {prefix ?? ""}
              {formatThousands ? formatNumber(originalAmount) : originalAmount}
              {unit}
            </span>
          )}
      </div>
    );
  },
);

PriceTag.displayName = "PriceTag";
