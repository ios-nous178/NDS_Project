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
  /** 아이콘 배경 색 (기본 자동 — primary tint) */
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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const qaStyles = `
  :where(.${QA_CLASS}) {
    display: grid;
    gap: var(--nds-quick-action-gap, ${spacing[12]}px);
    grid-template-columns: repeat(var(--nds-quick-action-cols, 4), 1fr);
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${QA_ITEM_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[8]}px;
    padding: ${spacing[12]}px ${spacing[4]}px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: ${radius.md}px;
    transition: background-color ${transition.default};
    font-family: inherit;
  }

  :where(.${QA_ITEM_CLASS}:hover:not([disabled])) {
    background: ${cv.bg.coolGray};
  }

  :where(.${QA_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: 2px;
  }

  :where(.${QA_ITEM_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${QA_ICON_CLASS}) {
    width: 48px;
    height: 48px;
    border-radius: ${radius.md}px;
    background: var(--nds-quick-action-icon-bg, var(--semantic-primary-bg, #EBF1FF));
    color: ${cv.primary.main};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  :where(.${QA_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.default};
    font-weight: ${fontWeight.medium};
    text-align: center;
    word-break: keep-all;
  }

  :where(.${QA_BADGE_CLASS}) {
    position: absolute;
    top: 4px;
    right: 8px;
    padding: 2px 6px;
    min-width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: var(--semantic-error-main, #E04D4D);
    color: #fff;
    font-size: 10px;
    line-height: 14px;
    font-weight: ${fontWeight.bold};
    text-align: center;
    box-sizing: border-box;
  }
`;

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
