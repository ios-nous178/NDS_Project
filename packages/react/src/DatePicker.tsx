import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import { CalendarIcon, CashwalkBizCalendarIcon } from "@nudge-design/icons";
import {
  addDays,
  addCalendarMonths,
  addMonths,
  buildMonthGrid,
  clampToBounds,
  DAYS_OF_WEEK,
  findEnabledDate,
  formatYM,
  formatYMD,
  isOutOfBounds,
  isSameDay,
  startOfDay,
  toDateKey,
} from "./internal/dateCore.js";
import { addDismissableLayerListeners, WebPortal } from "./internal/web.js";
import { useBrand } from "./internal/useBrand.js";

/*
 * DatePicker 는 Calendar 컴포넌트를 합성하지 않고 자체 month-grid(buildMonthGrid +
 * DP_GRID/DP_DAY)를 들고 있다 — 의도된 분리다(2026-06 결정, 현행 유지).
 *   · DatePicker  = input 트리거 + dismissable popover + 브랜드 글리프 + min/max·단일선택에
 *                   특화된 경량 그리드. 팝오버 폭/포커스/키보드 흐름이 트리거에 묶여 있다.
 *   · Calendar    = 마커/범위 등 부가기능을 가진 독립 인라인 월 뷰(팝오버 아님).
 * 두 grid 의 셀 렌더·치수 토큰은 거의 같지만 컨테이너/상호작용 모델이 달라 공용 코어로
 * 묶는 건 후속 리팩터(month-grid core 추출)로 남겨둔다. 새 날짜 UI 가 필요하면 이 둘 중
 * 맞는 쪽을 쓰고, Calendar 로 DatePicker 를 흉내내지 말 것(MCP DatePicker 가이드 pitfall).
 */

/* ─── Class names ─── */

const DP_CLASS = "nds-date-picker";
const DP_ROOT_CLASS = `${DP_CLASS}__root`;
const DP_TRIGGER_CLASS = `${DP_CLASS}__trigger`;
const DP_TRIGGER_TEXT_CLASS = `${DP_CLASS}__trigger-text`;
const DP_ICON_CLASS = `${DP_CLASS}__icon`;
const DP_CLEAR_BTN_CLASS = `${DP_CLASS}__clear-btn`;
const DP_PANEL_CLASS = `${DP_CLASS}__panel`;
const DP_HEADER_CLASS = `${DP_CLASS}__header`;
const DP_NAV_BTN_CLASS = `${DP_CLASS}__nav-btn`;
const DP_TITLE_CLASS = `${DP_CLASS}__title`;
const DP_DOW_CLASS = `${DP_CLASS}__dow`;
const DP_DOW_CELL_CLASS = `${DP_CLASS}__dow-cell`;
const DP_GRID_CLASS = `${DP_CLASS}__grid`;
const DP_DAY_CLASS = `${DP_CLASS}__day`;
const DP_FOOTER_CLASS = `${DP_CLASS}__footer`;

/* ─── Types ─── */

export interface DatePickerProps {
  /** 선택된 날짜 */
  value?: Date;
  /** 변경 콜백 */
  onChange: (value: Date) => void;
  /** 선택 가능한 최소 날짜 (포함) */
  minDate?: Date;
  /** 선택 가능한 최대 날짜 (포함) */
  maxDate?: Date;
  /** placeholder 텍스트 (기본 `"YYYY-MM-DD"`) */
  placeholder?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 상태 표시. `error` prop 이 true 면 error 가 우선된다. */
  status?: "default" | "error" | "warning";
  /** 값이 있을 때 clear 버튼 노출 */
  allowClear?: boolean;
  /** clear 버튼 클릭 콜백 */
  onClear?: () => void;
  /** 선택 불가 날짜 판정. minDate/maxDate 이후 추가 제약으로 적용된다. */
  disabledDate?: (date: Date) => boolean;
  /** 선택 불가 날짜 목록. HTML disabled-dates attribute 와 같은 용도. */
  disabledDates?: Date[];
  /** 팝오버 열림 제어 */
  open?: boolean;
  /** 비제어 초기 열림 상태 */
  defaultOpen?: boolean;
  /** 팝오버 열림 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
  /** 트리거 너비 100% */
  fullWidth?: boolean;
  /** 트리거 className */
  className?: string;
  /** 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /** 날짜 포맷 함수 (트리거 표시용, 기본: ISO `"YYYY-MM-DD"` — 캐포비 admin / 일반 ISO 정합) */
  formatValue?: (d: Date) => string;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  error = false,
  status = "default",
  allowClear = false,
  onClear,
  disabledDate,
  disabledDates,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  fullWidth = false,
  className,
  portalContainer,
  formatValue = formatYMD,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const [viewDate, setViewDate] = useState<Date>(() => value ?? new Date());
  const [activeDate, setActiveDate] = useState<Date>(() => value ?? new Date());
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeDayRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  const today = useMemo(() => startOfDay(new Date()), []);
  const minDay = minDate ? startOfDay(minDate) : null;
  const maxDay = maxDate ? startOfDay(maxDate) : null;

  useEffect(() => {
    if (!value) return;
    setViewDate(value);
    setActiveDate(value);
  }, [value]);

  const setOpen = (next: boolean) => {
    if (disabled && next) return;
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
    if (next) {
      const nextActive = findEnabledDate(value ?? new Date(), isDisabledDay);
      setActiveDate(nextActive);
      setViewDate(nextActive);
    }
  };

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left });

    return addDismissableLayerListeners({
      contentEl: panelRef.current,
      triggerEl: triggerRef.current,
      onDismiss: () => setOpen(false),
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const disabledDateKeys = useMemo(
    () => new Set(disabledDates?.map((d) => toDateKey(startOfDay(d))) ?? []),
    [disabledDates],
  );

  const isDisabledDay = (d: Date) =>
    isOutOfBounds(d, minDay ?? undefined, maxDay ?? undefined) ||
    disabledDateKeys.has(toDateKey(d)) ||
    disabledDate?.(startOfDay(d)) === true;

  const canPrevMonth =
    !minDay || addMonths(viewDate, -1).getTime() + 31 * 86400000 >= minDay.getTime();
  const canNextMonth = !maxDay || addMonths(viewDate, 1).getTime() <= maxDay.getTime();

  const grid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  useEffect(() => {
    if (!open) return;
    activeDayRef.current?.focus();
  }, [activeDate, open]);

  const moveActiveDate = (next: Date, direction: 1 | -1 = 1) => {
    const bounded = clampToBounds(next, minDay ?? undefined, maxDay ?? undefined);
    const enabled = findEnabledDate(bounded, isDisabledDay, direction);
    setActiveDate(enabled);
    setViewDate(enabled);
  };

  const selectDate = (d: Date) => {
    if (isDisabledDay(d)) return;
    onChange(startOfDay(d));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keyMap: Partial<Record<string, number>> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const delta = keyMap[e.key];
    if (delta) {
      e.preventDefault();
      moveActiveDate(addDays(activeDate, delta), delta > 0 ? 1 : -1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      moveActiveDate(addDays(activeDate, -activeDate.getDay()), -1);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      moveActiveDate(addDays(activeDate, 6 - activeDate.getDay()), 1);
      return;
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const amount = e.shiftKey ? 12 : 1;
      moveActiveDate(
        addCalendarMonths(activeDate, e.key === "PageUp" ? -amount : amount),
        e.key === "PageUp" ? -1 : 1,
      );
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectDate(activeDate);
    }
  };

  // brand 별 트리거 아이콘 swap — CashwalkBiz 는 자체 캘린더 글리프(filled + dot grid).
  // 다른 브랜드는 공용 CalendarIcon. 향후 brand glyph 추가 시 같은 분기에 더하면 됨.
  const brand = useBrand();
  const TriggerCalendarIcon = brand === "cashwalk-biz" ? CashwalkBizCalendarIcon : CalendarIcon;
  const resolvedStatus = error ? "error" : status;
  const canClear = allowClear && !!value && !disabled;

  return (
    <div
      data-slot="root"
      data-fullwidth={fullWidth ? "true" : "false"}
      className={cx(DP_ROOT_CLASS, className)}
      style={{ "--nds-date-picker-width": fullWidth ? "100%" : "auto" } as React.CSSProperties}
    >
      <button
        ref={triggerRef}
        type="button"
        data-slot="trigger"
        data-open={open ? "true" : "false"}
        data-error={resolvedStatus === "error" ? "true" : "false"}
        data-status={resolvedStatus}
        data-clearable={canClear ? "true" : "false"}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={DP_TRIGGER_CLASS}
        onClick={() => setOpen(!open)}
      >
        <span
          data-slot="trigger-text"
          data-placeholder={value ? "false" : "true"}
          className={DP_TRIGGER_TEXT_CLASS}
        >
          {value ? formatValue(value) : placeholder}
        </span>
        <span aria-hidden="true" className={DP_ICON_CLASS}>
          <TriggerCalendarIcon width={20} height={20} />
        </span>
      </button>
      {canClear && (
        <button
          type="button"
          aria-label="날짜 지우기"
          className={DP_CLEAR_BTN_CLASS}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClear?.();
            setOpen(false);
            triggerRef.current?.focus();
          }}
        >
          ×
        </button>
      )}
      {open && (
        <WebPortal container={portalContainer}>
          <div
            ref={panelRef}
            role="dialog"
            aria-labelledby={titleId}
            data-slot="panel"
            className={DP_PANEL_CLASS}
            style={{ top: position.top, left: position.left }}
          >
            <div data-slot="header" className={DP_HEADER_CLASS}>
              <button
                type="button"
                aria-label="이전 달"
                disabled={!canPrevMonth}
                className={DP_NAV_BTN_CLASS}
                onClick={() => setViewDate((v) => addMonths(v, -1))}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 4L6 8L10 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span id={titleId} data-slot="title" className={DP_TITLE_CLASS}>
                {formatYM(viewDate)}
              </span>
              <button
                type="button"
                aria-label="다음 달"
                disabled={!canNextMonth}
                className={DP_NAV_BTN_CLASS}
                onClick={() => setViewDate((v) => addMonths(v, 1))}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div data-slot="dow" className={DP_DOW_CLASS}>
              {DAYS_OF_WEEK.map((d, idx) => (
                <span
                  key={d}
                  data-slot="dow-cell"
                  data-day={String(idx)}
                  className={DP_DOW_CELL_CLASS}
                >
                  {d}
                </span>
              ))}
            </div>
            <div
              data-slot="grid"
              role="grid"
              aria-activedescendant={`${titleId}-${toDateKey(activeDate)}`}
              className={DP_GRID_CLASS}
              onKeyDown={handleGridKeyDown}
            >
              {grid.map((d) => {
                const inMonth = d.getMonth() === viewDate.getMonth();
                const disabledDay = isDisabledDay(d);
                const selected = value ? isSameDay(d, value) : false;
                const isToday = isSameDay(d, today);
                const active = isSameDay(d, activeDate);
                return (
                  <button
                    key={d.toISOString()}
                    id={`${titleId}-${toDateKey(d)}`}
                    ref={active ? activeDayRef : undefined}
                    type="button"
                    role="gridcell"
                    aria-selected={selected}
                    data-slot="day"
                    data-outside={!inMonth ? "true" : "false"}
                    data-selected={selected ? "true" : "false"}
                    data-today={isToday ? "true" : "false"}
                    data-active={active ? "true" : "false"}
                    data-disabled={disabledDay ? "true" : "false"}
                    data-day={String(d.getDay())}
                    tabIndex={active && !disabledDay ? 0 : -1}
                    disabled={disabledDay}
                    className={DP_DAY_CLASS}
                    onFocus={() => setActiveDate(d)}
                    onClick={() => selectDate(d)}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </WebPortal>
      )}
    </div>
  );
};

DatePicker.displayName = "DatePicker";
