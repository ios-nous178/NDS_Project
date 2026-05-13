import React from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const stStyles = `
  :where(.${ST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[12]}px;
    padding: ${spacing[16]}px ${spacing[20]}px;
    background: var(--nds-stat-card-bg, ${cv.bg.white});
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: border-color 200ms ease;
  }

  :where(.${ST_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${ST_CLASS}[data-clickable="true"]:hover) { border-color: ${cv.primary.main}; }

  :where(.${ST_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    color: ${cv.text.subtle};
  }

  :where(.${ST_ICON_CLASS}) {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${ST_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${ST_VALUE_ROW_CLASS}) {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${spacing[16]}px;
  }

  :where(.${ST_VALUE_CLASS}) {
    display: inline-flex;
    align-items: baseline;
    gap: ${spacing[4]}px;
  }

  :where(.${ST_VALUE_CLASS}) > strong {
    font-size: 28px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
    font-variant-numeric: tabular-nums;
  }

  :where(.${ST_UNIT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.text.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${ST_DELTA_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    background: var(--nds-stat-delta-bg, transparent);
    color: var(--nds-stat-delta-fg, ${cv.text.subtle});
  }

  :where(.${ST_DELTA_CLASS}[data-trend="up"]) {
    background: var(--semantic-success-bg, #E5F8E9);
    color: var(--semantic-success-text, #1A6D2C);
  }

  :where(.${ST_DELTA_CLASS}[data-trend="down"]) {
    background: var(--semantic-error-bg, #FFE9E9);
    color: var(--semantic-error-text, #B83333);
  }

  :where(.${ST_FOOTER_CLASS}) {
    color: ${cv.text.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
  }

  :where(.${ST_DESC_CLASS}) {
    margin: 0;
  }
`;

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
