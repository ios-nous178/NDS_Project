import React from "react";

/* ─── Constants ─── */

const ST_CLASS = "nds-stat-card";
const ST_HEADER_CLASS = `${ST_CLASS}__header`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_ICON_CLASS = `${ST_CLASS}__icon`;
const ST_VALUE_ROW_CLASS = `${ST_CLASS}__value-row`;
const ST_VALUE_CLASS = `${ST_CLASS}__value`;
const ST_UNIT_CLASS = `${ST_CLASS}__unit`;
const ST_DELTA_CLASS = `${ST_CLASS}__delta`;
const ST_FOOTER_CLASS = `${ST_CLASS}__footer`;
const ST_DESC_CLASS = `${ST_CLASS}__desc`;

/* ─── Types ─── */

export type StatCardTrend = "up" | "down" | "flat";

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 라벨 (위) */
  label: React.ReactNode;
  /** 값 */
  value: React.ReactNode;
  /** 단위 (값 옆) */
  unit?: React.ReactNode;
  /** 좌측 상단 아이콘 */
  icon?: React.ReactNode;
  /** 변화량 (예: "+12%", "-5분") */
  delta?: React.ReactNode;
  /** 변화 방향 (delta 색상 결정) */
  trend?: StatCardTrend;
  /** 카드 우측에 들어가는 슬롯 (Sparkline 등) */
  trailing?: React.ReactNode;
  /** 카드 하단 보조 설명 */
  description?: React.ReactNode;
  /** 카드 클릭 (디테일 진입) */
  onClick?: () => void;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const TrendArrow: React.FC<{ trend: StatCardTrend }> = ({ trend }) => {
  if (trend === "flat") return <span aria-hidden>—</span>;
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d={trend === "up" ? "M5 2L9 7H1L5 2z" : "M5 8L1 3H9L5 8z"} fill="currentColor" />
    </svg>
  );
};

/* ─── Component ─── */

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { label, value, unit, icon, delta, trend, trailing, description, onClick, className, ...rest },
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
        className={cx(ST_CLASS, className)}
        {...rest}
      >
        <div className={ST_HEADER_CLASS}>
          {icon && (
            <span className={ST_ICON_CLASS} aria-hidden>
              {icon}
            </span>
          )}
          <span className={ST_LABEL_CLASS}>{label}</span>
        </div>
        <div className={ST_VALUE_ROW_CLASS}>
          <div className={ST_VALUE_CLASS}>
            <strong>{value}</strong>
            {unit && <span className={ST_UNIT_CLASS}>{unit}</span>}
          </div>
          {trailing && <div data-slot="trailing">{trailing}</div>}
        </div>
        {(delta !== undefined || description) && (
          <div className={ST_FOOTER_CLASS}>
            {delta !== undefined && (
              <span className={ST_DELTA_CLASS} data-trend={trend ?? "flat"}>
                {trend && <TrendArrow trend={trend} />}
                {delta}
              </span>
            )}
            {description && (
              <p
                className={ST_DESC_CLASS}
                style={delta !== undefined ? { marginTop: 4 } : undefined}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

StatCard.displayName = "StatCard";
