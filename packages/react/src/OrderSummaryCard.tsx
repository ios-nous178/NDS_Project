import React from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const OS_CLASS = "nds-order-summary-card";
const OS_HEADER_CLASS = `${OS_CLASS}__header`;
const OS_TITLE_CLASS = `${OS_CLASS}__title`;
const OS_LIST_CLASS = `${OS_CLASS}__list`;
const OS_ROW_CLASS = `${OS_CLASS}__row`;
const OS_LABEL_CLASS = `${OS_CLASS}__label`;
const OS_VALUE_CLASS = `${OS_CLASS}__value`;
const OS_DIVIDER_CLASS = `${OS_CLASS}__divider`;
const OS_TOTAL_CLASS = `${OS_CLASS}__total`;
const OS_TOTAL_VALUE_CLASS = `${OS_CLASS}__total-value`;

/* ─── Types ─── */

export interface OrderSummaryRow {
  /** 라벨 */
  label: React.ReactNode;
  /** 값 (텍스트 or 숫자) */
  value: React.ReactNode;
  /** 강조 (할인 등 빨간색) */
  emphasis?: "discount" | "info";
}

export interface OrderSummaryCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 카드 제목 */
  title?: React.ReactNode;
  /** 항목 목록 (라벨:값) */
  rows: OrderSummaryRow[];
  /** 합계 라벨 */
  totalLabel?: React.ReactNode;
  /** 합계 값 (PriceTag 권장) */
  total: React.ReactNode;
  /** 푸터 슬롯 (CTA 버튼 등) */
  footer?: React.ReactNode;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const osStyles = `
  :where(.${OS_CLASS}) {
    display: flex;
    flex-direction: column;
    padding: ${spacing[20]}px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${OS_HEADER_CLASS}) {
    margin-bottom: ${spacing[16]}px;
  }

  :where(.${OS_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
    margin: 0;
  }

  :where(.${OS_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${OS_ROW_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: ${spacing[12]}px;
  }

  :where(.${OS_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.text.subtle};
  }

  :where(.${OS_VALUE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.text.default};
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  :where(.${OS_VALUE_CLASS}[data-emphasis="discount"]) {
    color: var(--semantic-error-main, #E04D4D);
    font-weight: ${fontWeight.semibold};
  }

  :where(.${OS_VALUE_CLASS}[data-emphasis="info"]) {
    color: ${cv.primary.main};
  }

  :where(.${OS_DIVIDER_CLASS}) {
    height: 1px;
    background: ${cv.border.light};
    margin: ${spacing[16]}px 0;
  }

  :where(.${OS_TOTAL_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: ${spacing[12]}px;
  }

  :where(.${OS_TOTAL_CLASS}) > span:first-child {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.text.default};
  }

  :where(.${OS_TOTAL_VALUE_CLASS}) {
    font-size: 22px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
    font-variant-numeric: tabular-nums;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const OrderSummaryCard = React.forwardRef<HTMLDivElement, OrderSummaryCardProps>(
  (
    { title = "결제 정보", rows, totalLabel = "총 결제금액", total, footer, className, ...rest },
    ref,
  ) => {
    return (
      <div ref={ref} data-slot="root" className={cx(OS_CLASS, className)} {...rest}>
        {title && (
          <div className={OS_HEADER_CLASS}>
            <h3 className={OS_TITLE_CLASS}>{title}</h3>
          </div>
        )}
        <div className={OS_LIST_CLASS}>
          {rows.map((row, i) => (
            <div key={i} className={OS_ROW_CLASS}>
              <span className={OS_LABEL_CLASS}>{row.label}</span>
              <span className={OS_VALUE_CLASS} data-emphasis={row.emphasis ?? "default"}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <div className={OS_DIVIDER_CLASS} aria-hidden />
        <div className={OS_TOTAL_CLASS}>
          <span>{totalLabel}</span>
          <span className={OS_TOTAL_VALUE_CLASS}>{total}</span>
        </div>
        {footer && <div style={{ marginTop: spacing[16] }}>{footer}</div>}
      </div>
    );
  },
);

OrderSummaryCard.displayName = "OrderSummaryCard";
