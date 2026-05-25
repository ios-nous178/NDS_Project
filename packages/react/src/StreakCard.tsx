import React from "react";

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
