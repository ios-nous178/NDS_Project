import React from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const SK_CLASS = "nds-streak-card";
const SK_HEADER_CLASS = `${SK_CLASS}__header`;
const SK_TITLE_CLASS = `${SK_CLASS}__title`;
const SK_VALUE_CLASS = `${SK_CLASS}__value`;
const SK_NUMBER_CLASS = `${SK_CLASS}__number`;
const SK_UNIT_CLASS = `${SK_CLASS}__unit`;
const SK_GRID_CLASS = `${SK_CLASS}__grid`;
const SK_DAY_CLASS = `${SK_CLASS}__day`;
const SK_DAY_LABEL_CLASS = `${SK_CLASS}__day-label`;
const SK_DAY_DOT_CLASS = `${SK_CLASS}__day-dot`;
const SK_FOOTER_CLASS = `${SK_CLASS}__footer`;

/* ─── Types ─── */

export interface StreakDay {
  /** YYYY-MM-DD */
  date: string;
  /** 완료 여부 */
  done: boolean;
  /** 라벨 (요일 등) */
  label?: string;
}

export interface StreakCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 카드 제목 */
  title?: React.ReactNode;
  /** 현재 연속 일수 */
  streak: number;
  /** 단위 라벨 (기본 "일") */
  unit?: string;
  /** 보여줄 일자 도트 (보통 최근 7~14일) */
  days?: StreakDay[];
  /** 좌측 아이콘 (기본 🔥) */
  icon?: React.ReactNode;
  /** 푸터 텍스트 */
  footer?: React.ReactNode;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const streakStyles = `
  :where(.${SK_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]}px;
    padding: ${spacing[20]}px;
    background: var(--nds-streak-bg, ${cv.surface.default});
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SK_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
  }

  :where(.${SK_HEADER_CLASS}) .${SK_CLASS}__icon {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: var(--semantic-bg-status-caution);
    color: var(--semantic-text-status-caution);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  :where(.${SK_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${SK_VALUE_CLASS}) {
    display: flex;
    align-items: baseline;
    gap: ${spacing[4]}px;
  }

  :where(.${SK_NUMBER_CLASS}) {
    font-size: 32px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${SK_UNIT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${SK_GRID_CLASS}) {
    display: flex;
    gap: ${spacing[4]}px;
    width: 100%;
  }

  :where(.${SK_DAY_CLASS}) {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[4]}px;
  }

  :where(.${SK_DAY_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${SK_DAY_DOT_CLASS}) {
    width: 100%;
    aspect-ratio: 1;
    max-width: 32px;
    border-radius: ${radius.sm}px;
    background: ${cv.surface.section};
    border: 1px solid transparent;
  }

  :where(.${SK_DAY_DOT_CLASS}[data-done="true"]) {
    background: var(--semantic-fill-status-caution);
    border-color: var(--semantic-border-status-caution);
  }

  :where(.${SK_DAY_DOT_CLASS}[data-today="true"]:not([data-done="true"])) {
    border: 2px dashed var(--semantic-border-status-caution);
    background: ${cv.surface.default};
  }

  :where(.${SK_FOOTER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const todayIso = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

/* ─── Component ─── */

export const StreakCard = React.forwardRef<HTMLDivElement, StreakCardProps>(
  (
    { title = "연속 기록", streak, unit = "일", days, icon = "🔥", footer, className, ...rest },
    ref,
  ) => {
    const today = todayIso();

    return (
      <div ref={ref} data-slot="root" className={cx(SK_CLASS, className)} {...rest}>
        <div className={SK_HEADER_CLASS}>
          <span className={`${SK_CLASS}__icon`} aria-hidden>
            {icon}
          </span>
          <div style={{ flex: 1 }}>
            <p className={SK_TITLE_CLASS}>{title}</p>
            <div className={SK_VALUE_CLASS}>
              <span className={SK_NUMBER_CLASS}>{streak}</span>
              <span className={SK_UNIT_CLASS}>{unit}째</span>
            </div>
          </div>
        </div>

        {days && days.length > 0 && (
          <div className={SK_GRID_CLASS} role="list" aria-label="최근 기록">
            {days.map((d) => (
              <div key={d.date} className={SK_DAY_CLASS} role="listitem">
                <span className={SK_DAY_LABEL_CLASS}>{d.label ?? d.date.slice(-2)}</span>
                <span
                  className={SK_DAY_DOT_CLASS}
                  data-done={d.done ? "true" : "false"}
                  data-today={d.date === today ? "true" : "false"}
                  aria-label={`${d.date} ${d.done ? "완료" : "미완료"}`}
                />
              </div>
            ))}
          </div>
        )}

        {footer && <p className={SK_FOOTER_CLASS}>{footer}</p>}
      </div>
    );
  },
);

StreakCard.displayName = "StreakCard";
