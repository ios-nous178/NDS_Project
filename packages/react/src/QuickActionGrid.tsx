import React from "react";

/* ─── Constants ─── */

const QA_CLASS = "nds-quick-action-grid";
const QA_ITEM_CLASS = `${QA_CLASS}__item`;
const QA_ICON_CLASS = `${QA_CLASS}__icon`;
const QA_LABEL_CLASS = `${QA_CLASS}__label`;
const QA_BADGE_CLASS = `${QA_CLASS}__badge`;

/* ─── Types ─── */

export interface QuickAction {
  /** 고유 키 */
  key: string;
  /** 라벨 */
  label: React.ReactNode;
  /** 아이콘/이모지 */
  icon: React.ReactNode;
  /** 클릭 콜백 */
  onClick?: () => void;
  /** 우상단 배지 텍스트 (예: "NEW", "3") */
  badge?: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
  /** 아이콘 배경 색 (기본 자동 — status-info tint) */
  iconBg?: string;
}

export interface QuickActionGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 액션 목록 */
  actions: QuickAction[];
  /** 한 줄 칸 수 */
  columns?: 2 | 3 | 4;
  /** 칼럼 간격 px */
  gap?: number;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const QuickActionGrid = React.forwardRef<HTMLDivElement, QuickActionGridProps>(
  ({ actions, columns = 4, gap, className, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(QA_CLASS, className)}
        style={
          {
            "--nds-quick-action-cols": columns,
            ...(gap !== undefined && { "--nds-quick-action-gap": `${gap}px` }),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {actions.map((a) => (
          <button
            key={a.key}
            type="button"
            className={QA_ITEM_CLASS}
            disabled={a.disabled}
            onClick={a.onClick}
            style={
              a.iconBg
                ? ({ "--nds-quick-action-icon-bg": a.iconBg } as React.CSSProperties)
                : undefined
            }
          >
            {a.badge !== undefined && <span className={QA_BADGE_CLASS}>{a.badge}</span>}
            <span className={QA_ICON_CLASS} aria-hidden>
              {a.icon}
            </span>
            <span className={QA_LABEL_CLASS}>{a.label}</span>
          </button>
        ))}
      </div>
    );
  },
);

QuickActionGrid.displayName = "QuickActionGrid";
