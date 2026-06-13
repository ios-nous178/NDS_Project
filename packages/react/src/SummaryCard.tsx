import React from "react";
import { spacing } from "@nudge-design/tokens";

/* ─── Constants ─── */

const OS_CLASS = "nds-summary-card";
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

export interface SummaryRow {
  /** 라벨 */
  label: React.ReactNode;
  /** 값 (텍스트 or 숫자) */
  value: React.ReactNode;
  /** 강조 (할인 등 빨간색) */
  emphasis?: "discount" | "info";
}

export interface SummaryCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 카드 제목 */
  title?: React.ReactNode;
  /** 항목 목록 (라벨:값) */
  rows: SummaryRow[];
  /** 합계 라벨 */
  totalLabel?: React.ReactNode;
  /** 합계 값 (PriceTag 권장) */
  total: React.ReactNode;
  /** 푸터 슬롯 (CTA 버튼 등) */
  footer?: React.ReactNode;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
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

SummaryCard.displayName = "SummaryCard";
