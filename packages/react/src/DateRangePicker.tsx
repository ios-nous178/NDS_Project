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
  isAfterDay,
  isBetweenDays,
  isOutOfBounds,
  isSameDay,
  startOfDay,
  toDateKey,
} from "./internal/dateCore.js";
import { useBrand } from "./internal/useBrand.js";
import { addDismissableLayerListeners, WebPortal } from "./internal/web.js";

/* ─── Constants ─── */

const DR_CLASS = "nds-date-range";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_TRIGGER_CLASS = `${DR_CLASS}__trigger`;
const DR_TRIGGER_TEXT_CLASS = `${DR_CLASS}__trigger-text`;
const DR_ICON_CLASS = `${DR_CLASS}__icon`;
const DR_CLEAR_BTN_CLASS = `${DR_CLASS}__clear-btn`;
const DR_PANEL_CLASS = `${DR_CLASS}__panel`;
const DR_HEADER_CLASS = `${DR_CLASS}__header`;
const DR_TITLE_CLASS = `${DR_CLASS}__title`;
const DR_NAV_BTN_CLASS = `${DR_CLASS}__nav-btn`;
const DR_BODY_CLASS = `${DR_CLASS}__body`;
const DR_MONTH_CLASS = `${DR_CLASS}__month`;
const DR_DOW_CLASS = `${DR_CLASS}__dow`;
const DR_DOW_CELL_CLASS = `${DR_CLASS}__dow-cell`;
const DR_GRID_CLASS = `${DR_CLASS}__grid`;
const DR_DAY_CLASS = `${DR_CLASS}__day`;
const DR_HINT_CLASS = `${DR_CLASS}__hint`;
const DR_PRESETS_CLASS = `${DR_CLASS}__presets`;
const DR_PRESET_CLASS = `${DR_CLASS}__preset`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const normalizeRange = (from?: Date, to?: Date): DateRange => {
  if (from && to && isAfterDay(from, to)) return { from: startOfDay(to), to: startOfDay(from) };
  return { from: from ? startOfDay(from) : undefined, to: to ? startOfDay(to) : undefined };
};

/* ─── Types ─── */

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface DateRangePreset {
  /** 라벨 (예: "최근 7일") */
  label: string;
  /** 클릭 시 적용할 range */
  range: () => DateRange;
}

export interface DateRangePickerProps {
  /** 현재 범위 */
  value: DateRange;
  /** 변경 콜백 */
  onValueChange: (range: DateRange) => void;
  /** 좌측 라벨 (기본 "시작") */
  startLabel?: React.ReactNode;
  /** 우측 라벨 (기본 "종료") */
  endLabel?: React.ReactNode;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 빠른 선택 프리셋 */
  presets?: DateRangePreset[];
  /** 선택 가능한 최소 날짜 */
  minDate?: Date;
  /** 선택 가능한 최대 날짜 */
  maxDate?: Date;
  /** 선택 불가 날짜 판정. minDate/maxDate 이후 추가 제약으로 적용된다. */
  disabledDate?: (date: Date) => boolean;
  /** 선택 불가 날짜 목록. HTML disabled-dates attribute 와 같은 용도. */
  disabledDates?: Date[];
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
  /** 트리거 너비 100% */
  fullWidth?: boolean;
  /** 팝오버 열림 제어 */
  open?: boolean;
  /** 비제어 초기 열림 상태 */
  defaultOpen?: boolean;
  /** 팝오버 열림 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
  /** 루트 className */
  className?: string;
  /** 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /** 날짜 포맷 함수 (트리거 표시용, 기본: ISO `"YYYY-MM-DD"`) */
  formatValue?: (d: Date) => string;
}

/* ─── Default presets ─── */

export const defaultRangePresets: DateRangePreset[] = [
  {
    label: "최근 7일",
    range: () => {
      const today = startOfDay(new Date());
      return { from: addDays(today, -6), to: today };
    },
  },
  {
    label: "최근 30일",
    range: () => {
      const today = startOfDay(new Date());
      return { from: addDays(today, -29), to: today };
    },
  },
  {
    label: "이번 달",
    range: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from, to: startOfDay(now) };
    },
  },
];

/* ─── Component ─── */

const isPresetActive = (preset: DateRangePreset, value: DateRange): boolean => {
  const presetRange = preset.range();
  const target = normalizeRange(presetRange.from, presetRange.to);
  if (!target.from || !target.to || !value.from || !value.to) return false;
  return isSameDay(target.from, value.from) && isSameDay(target.to, value.to);
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onValueChange,
  startLabel = "시작",
  endLabel = "종료",
  placeholder,
  presets,
  minDate,
  maxDate,
  disabledDate,
  disabledDates,
  disabled = false,
  error = false,
  status = "default",
  allowClear = false,
  onClear,
  fullWidth = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  portalContainer,
  formatValue = formatYMD,
}) => {
  const normalizedValue = normalizeRange(value.from, value.to);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const [viewDate, setViewDate] = useState<Date>(() => normalizedValue.from ?? new Date());
  const [activeDate, setActiveDate] = useState<Date>(() => normalizedValue.from ?? new Date());
  const [selecting, setSelecting] = useState<"from" | "to">(
    normalizedValue.from && !normalizedValue.to ? "to" : "from",
  );
  const [hoverDate, setHoverDate] = useState<Date | undefined>();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeDayRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  const minDay = minDate ? startOfDay(minDate) : undefined;
  const maxDay = maxDate ? startOfDay(maxDate) : undefined;
  const today = useMemo(() => startOfDay(new Date()), []);
  const brand = useBrand();
  const TriggerCalendarIcon = brand === "cashwalk-biz" ? CashwalkBizCalendarIcon : CalendarIcon;
  const resolvedStatus = error ? "error" : status;
  const disabledDateKeys = useMemo(
    () => new Set(disabledDates?.map((d) => toDateKey(startOfDay(d))) ?? []),
    [disabledDates],
  );

  const isDisabledDay = (d: Date) =>
    isOutOfBounds(d, minDay, maxDay) ||
    disabledDateKeys.has(toDateKey(d)) ||
    disabledDate?.(startOfDay(d)) === true;

  const setOpen = (next: boolean) => {
    if (disabled && next) return;
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
    if (next) {
      const anchor = normalizedValue.from ?? new Date();
      const nextActive = findEnabledDate(anchor, isDisabledDay);
      setActiveDate(nextActive);
      setViewDate(nextActive);
      setSelecting(normalizedValue.from && !normalizedValue.to ? "to" : "from");
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

  useEffect(() => {
    if (!open) return;
    activeDayRef.current?.focus();
  }, [activeDate, open]);

  const moveActiveDate = (next: Date, direction: 1 | -1 = 1) => {
    const bounded = clampToBounds(next, minDay, maxDay);
    const enabled = findEnabledDate(bounded, isDisabledDay, direction);
    setActiveDate(enabled);
    setViewDate(enabled);
  };

  const applyRange = (range: DateRange, close = true) => {
    onValueChange(normalizeRange(range.from, range.to));
    if (close) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const selectDate = (d: Date) => {
    if (isDisabledDay(d)) return;
    const day = startOfDay(d);
    if (selecting === "from" || !normalizedValue.from || normalizedValue.to) {
      onValueChange({ from: day, to: undefined });
      setSelecting("to");
      setActiveDate(day);
      return;
    }
    applyRange({ from: normalizedValue.from, to: day });
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

  const canPrevMonth =
    !minDay || addMonths(viewDate, -1).getTime() + 31 * 86400000 >= minDay.getTime();
  const canNextMonth = !maxDay || addMonths(viewDate, 1).getTime() <= maxDay.getTime();
  const grids = [viewDate, addMonths(viewDate, 1)].map((month) => ({
    month,
    days: buildMonthGrid(month),
  }));
  const hasValue = !!normalizedValue.from || !!normalizedValue.to;
  const canClear = allowClear && hasValue && !disabled;
  const rangeLabel =
    normalizedValue.from && normalizedValue.to
      ? `${formatValue(normalizedValue.from)} ~ ${formatValue(normalizedValue.to)}`
      : normalizedValue.from
        ? `${formatValue(normalizedValue.from)} ~`
        : placeholder || `${startLabel} ~ ${endLabel}`;
  const previewRange =
    selecting === "to" && normalizedValue.from && hoverDate
      ? normalizeRange(normalizedValue.from, hoverDate)
      : undefined;

  return (
    <div
      data-slot="root"
      data-fullwidth={fullWidth ? "true" : "false"}
      className={cx(DR_ROOT_CLASS, className)}
      style={{ "--nds-date-range-width": fullWidth ? "100%" : "auto" } as React.CSSProperties}
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
        className={DR_TRIGGER_CLASS}
        onClick={() => setOpen(!open)}
      >
        <span
          data-slot="trigger-text"
          data-placeholder={hasValue ? "false" : "true"}
          className={DR_TRIGGER_TEXT_CLASS}
        >
          {rangeLabel}
        </span>
        <span aria-hidden="true" className={DR_ICON_CLASS}>
          <TriggerCalendarIcon width={20} height={20} />
        </span>
      </button>
      {canClear && (
        <button
          type="button"
          aria-label="기간 지우기"
          className={DR_CLEAR_BTN_CLASS}
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
            className={DR_PANEL_CLASS}
            style={{ top: position.top, left: position.left }}
          >
            <div data-slot="header" className={DR_HEADER_CLASS}>
              <button
                type="button"
                aria-label="이전 달"
                disabled={!canPrevMonth}
                className={DR_NAV_BTN_CLASS}
                onClick={() => setViewDate((v) => addMonths(v, -1))}
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M10 4L6 8L10 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span id={titleId} data-slot="title" className={DR_TITLE_CLASS}>
                {selecting === "from" ? startLabel : endLabel} 날짜 선택
              </span>
              <button
                type="button"
                aria-label="다음 달"
                disabled={!canNextMonth}
                className={DR_NAV_BTN_CLASS}
                onClick={() => setViewDate((v) => addMonths(v, 1))}
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
            <div
              data-slot="body"
              data-has-presets={presets && presets.length > 0 ? "true" : "false"}
              className={DR_BODY_CLASS}
            >
              {presets && presets.length > 0 && (
                <div data-slot="presets" className={DR_PRESETS_CLASS}>
                  {presets.map((p) => {
                    const active = isPresetActive(p, normalizedValue);
                    return (
                      <button
                        key={p.label}
                        type="button"
                        data-slot="preset"
                        data-active={active ? "true" : "false"}
                        className={DR_PRESET_CLASS}
                        onClick={() => applyRange(p.range())}
                        disabled={disabled}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {grids.map(({ month, days }) => (
                <div key={formatYM(month)} data-slot="month" className={DR_MONTH_CLASS}>
                  <div className={DR_TITLE_CLASS}>{formatYM(month)}</div>
                  <div data-slot="dow" className={DR_DOW_CLASS}>
                    {DAYS_OF_WEEK.map((d, idx) => (
                      <span
                        key={d}
                        data-slot="dow-cell"
                        data-day={String(idx)}
                        className={DR_DOW_CELL_CLASS}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <div
                    data-slot="grid"
                    role="grid"
                    aria-activedescendant={`${titleId}-${toDateKey(activeDate)}`}
                    className={DR_GRID_CLASS}
                    onKeyDown={handleGridKeyDown}
                    onMouseLeave={() => setHoverDate(undefined)}
                  >
                    {days.map((d) => {
                      const inMonth = d.getMonth() === month.getMonth();
                      const disabledDay = isDisabledDay(d);
                      const selectedStart = normalizedValue.from
                        ? isSameDay(d, normalizedValue.from)
                        : false;
                      const selectedEnd = normalizedValue.to
                        ? isSameDay(d, normalizedValue.to)
                        : false;
                      const inRange = isBetweenDays(d, normalizedValue.from, normalizedValue.to);
                      const inPreview = previewRange
                        ? isBetweenDays(d, previewRange.from, previewRange.to) ||
                          (previewRange.to ? isSameDay(d, previewRange.to) : false)
                        : false;
                      const active = isSameDay(d, activeDate);
                      return (
                        <button
                          key={d.toISOString()}
                          id={`${titleId}-${toDateKey(d)}`}
                          ref={active ? activeDayRef : undefined}
                          type="button"
                          role="gridcell"
                          aria-selected={selectedStart || selectedEnd}
                          data-slot="day"
                          data-outside={!inMonth ? "true" : "false"}
                          data-range-start={selectedStart ? "true" : "false"}
                          data-range-end={selectedEnd ? "true" : "false"}
                          data-in-range={inRange ? "true" : "false"}
                          data-preview={inPreview ? "true" : "false"}
                          data-today={isSameDay(d, today) ? "true" : "false"}
                          data-active={active ? "true" : "false"}
                          data-disabled={disabledDay ? "true" : "false"}
                          data-day={String(d.getDay())}
                          tabIndex={active && !disabledDay ? 0 : -1}
                          disabled={disabledDay}
                          className={DR_DAY_CLASS}
                          onFocus={() => setActiveDate(d)}
                          onMouseEnter={() => setHoverDate(d)}
                          onClick={() => selectDate(d)}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div data-slot="hint" className={DR_HINT_CLASS}>
              {normalizedValue.from && !normalizedValue.to
                ? `${formatValue(normalizedValue.from)}부터 종료 날짜를 선택`
                : "시작 날짜와 종료 날짜를 차례로 선택"}
            </div>
          </div>
        </WebPortal>
      )}
    </div>
  );
};

DateRangePicker.displayName = "DateRangePicker";
