import React, { useCallback, useMemo, useState } from "react";

import { buildMonthGrid, formatYMD } from "./internal/dateCore.js";

/*
 * Calendar 는 마커/도트를 가진 독립 인라인 월 뷰다. DatePicker 와 grid 가 비슷하지만
 * 별개 컴포넌트로 유지한다(의도된 분리 — DatePicker.tsx 상단 주석 참고). 날짜를 폼에서
 * 고르는 용도는 Calendar 가 아니라 DatePicker 를 쓴다.
 *
 * 월-그리드·ISO 포맷은 자체 구현하지 않고 공유 엔진(internal/dateCore)을 쓴다 —
 * DatePicker/DateRangePicker 와 동일한 buildMonthGrid 를 공유해 그리드/요일 규칙이 한 곳에 모인다.
 */

/* ─── Constants ─── */

const CL_CLASS = "nds-calendar";
const CL_HEADER_CLASS = `${CL_CLASS}__header`;
const CL_TITLE_CLASS = `${CL_CLASS}__title`;
const CL_NAV_CLASS = `${CL_CLASS}__nav`;
const CL_NAV_BTN_CLASS = `${CL_CLASS}__nav-btn`;
const CL_GRID_CLASS = `${CL_CLASS}__grid`;
const CL_WEEKDAYS_CLASS = `${CL_CLASS}__weekdays`;
const CL_WEEKDAY_CLASS = `${CL_CLASS}__weekday`;
const CL_DAYS_CLASS = `${CL_CLASS}__days`;
const CL_DAY_CLASS = `${CL_CLASS}__day`;
const CL_DAY_LABEL_CLASS = `${CL_CLASS}__day-label`;
const CL_DAY_DOT_CLASS = `${CL_CLASS}__day-dot`;

const WEEKDAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

/* ─── Types ─── */

export interface CalendarMarker {
  /** 마커가 있는 날짜 (YYYY-MM-DD) */
  date: string;
  /** 마커 색상 (CSS color, 토큰 var() 권장) */
  color?: string;
}

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 현재 표시 중인 월 (YYYY-MM 또는 Date). 미지정 시 today */
  month?: string | Date;
  /** 월 변경 콜백 */
  onMonthChange?: (yearMonth: string) => void;
  /** 선택된 날짜 (YYYY-MM-DD). controlled */
  value?: string;
  /** 날짜 선택 콜백 */
  onChange?: (date: string) => void;
  /** 비활성 날짜 판별 함수 */
  isDateDisabled?: (date: string) => boolean;
  /** 날짜별 마커 (예: 일정/감정 기록) */
  markers?: CalendarMarker[];
  /** 헤더 숨김 (외부 헤더로 제어할 때) */
  hideHeader?: boolean;
  /** 주 시작 요일. 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const parseMonth = (input: string | Date | undefined): { year: number; month: number } => {
  if (input instanceof Date) {
    return { year: input.getFullYear(), month: input.getMonth() };
  }
  if (typeof input === "string") {
    const [y, m] = input.split("-").map(Number);
    if (!Number.isNaN(y) && !Number.isNaN(m)) return { year: y, month: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
};

/* ─── Component ─── */

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      month,
      onMonthChange,
      value,
      onChange,
      isDateDisabled,
      markers,
      hideHeader = false,
      weekStartsOn = 0,
      className,
      ...rest
    },
    ref,
  ) => {
    const initial = useMemo(() => parseMonth(month), [month]);
    const [internal, setInternal] = useState(initial);
    const isControlled = month !== undefined;
    const { year, month: m } = isControlled ? initial : internal;

    const todayIso = useMemo(() => formatYMD(new Date()), []);

    const cells = useMemo(
      () => buildMonthGrid(new Date(year, m, 1), weekStartsOn),
      [year, m, weekStartsOn],
    );

    const markerMap = useMemo(() => {
      const map = new Map<string, string | undefined>();
      markers?.forEach((mk) => map.set(mk.date, mk.color));
      return map;
    }, [markers]);

    const setMonth = useCallback(
      (delta: number) => {
        const next = new Date(year, m + delta, 1);
        const ym = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
        if (!isControlled) {
          setInternal({ year: next.getFullYear(), month: next.getMonth() });
        }
        onMonthChange?.(ym);
      },
      [year, m, isControlled, onMonthChange],
    );

    const weekdayLabels =
      weekStartsOn === 1
        ? [...WEEKDAY_LABELS_KO.slice(1), WEEKDAY_LABELS_KO[0]]
        : WEEKDAY_LABELS_KO;

    return (
      <div
        ref={ref}
        data-slot="root"
        role="grid"
        aria-label={`${year}년 ${m + 1}월 캘린더`}
        className={cx(CL_CLASS, className)}
        {...rest}
      >
        {!hideHeader && (
          <div data-slot="header" className={CL_HEADER_CLASS}>
            <h2 className={CL_TITLE_CLASS}>
              {year}년 {m + 1}월
            </h2>
            <div className={CL_NAV_CLASS}>
              <button
                type="button"
                className={CL_NAV_BTN_CLASS}
                aria-label="이전 달"
                onClick={() => setMonth(-1)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M10 4L6 8l4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={CL_NAV_BTN_CLASS}
                aria-label="다음 달"
                onClick={() => setMonth(1)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className={CL_GRID_CLASS}>
          <div role="row" className={CL_WEEKDAYS_CLASS}>
            {weekdayLabels.map((w) => (
              <div key={w} role="columnheader" className={CL_WEEKDAY_CLASS}>
                {w}
              </div>
            ))}
          </div>
          <div role="rowgroup" className={CL_DAYS_CLASS}>
            {cells.map((cellDate) => {
              const iso = formatYMD(cellDate);
              const outside = cellDate.getMonth() !== m;
              const disabled = isDateDisabled?.(iso) ?? false;
              const selected = value === iso;
              const isToday = iso === todayIso;
              const markerColor = markerMap.get(iso);
              const hasMarker = markerMap.has(iso);
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  data-slot="day"
                  data-outside={outside ? "true" : "false"}
                  data-today={isToday ? "true" : "false"}
                  data-selected={selected ? "true" : "false"}
                  className={CL_DAY_CLASS}
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-label={iso}
                  onClick={() => onChange?.(iso)}
                >
                  <span className={CL_DAY_LABEL_CLASS}>{cellDate.getDate()}</span>
                  {hasMarker && (
                    <span
                      className={CL_DAY_DOT_CLASS}
                      style={
                        markerColor
                          ? ({ "--nds-calendar-marker": markerColor } as React.CSSProperties)
                          : undefined
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

Calendar.displayName = "Calendar";
