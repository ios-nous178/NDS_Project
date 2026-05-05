import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-eap/tokens";
import { addDismissableLayerListeners, WebPortal } from "./internal/web";

/* ─── Class names ─── */

const DP_CLASS = "nds-date-picker";
const DP_ROOT_CLASS = `${DP_CLASS}__root`;
const DP_TRIGGER_CLASS = `${DP_CLASS}__trigger`;
const DP_TRIGGER_TEXT_CLASS = `${DP_CLASS}__trigger-text`;
const DP_ICON_CLASS = `${DP_CLASS}__icon`;
const DP_PANEL_CLASS = `${DP_CLASS}__panel`;
const DP_HEADER_CLASS = `${DP_CLASS}__header`;
const DP_NAV_BTN_CLASS = `${DP_CLASS}__nav-btn`;
const DP_TITLE_CLASS = `${DP_CLASS}__title`;
const DP_DOW_CLASS = `${DP_CLASS}__dow`;
const DP_DOW_CELL_CLASS = `${DP_CLASS}__dow-cell`;
const DP_GRID_CLASS = `${DP_CLASS}__grid`;
const DP_DAY_CLASS = `${DP_CLASS}__day`;
const DP_FOOTER_CLASS = `${DP_CLASS}__footer`;

/* ─── Date utils ─── */

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"] as const;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const formatYM = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
const formatYMD = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

function buildMonthGrid(viewDate: Date): Date[] {
  const first = startOfMonth(viewDate);
  const startWeekday = first.getDay();
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startWeekday);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

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
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 트리거 너비 100% */
  fullWidth?: boolean;
  /** 트리거 className */
  className?: string;
  /** 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /** 날짜 포맷 함수 (트리거 표시용, 기본: "YYYY.MM.DD") */
  formatValue?: (d: Date) => string;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const datePickerStyles = `
  :where(.${DP_ROOT_CLASS}) {
    display: inline-flex;
    width: var(--nds-date-picker-width, auto);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${DP_ROOT_CLASS}[data-fullwidth="true"]) {
    width: 100%;
  }

  :where(.${DP_TRIGGER_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[8]}px;
    width: 100%;
    min-height: ${sizing.input.default}px;
    padding: 0 ${spacing[16]}px;
    border: 1px solid ${cv.border.default};
    border-radius: ${radius.md}px;
    background: ${cv.bg.white};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.default};
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${DP_TRIGGER_CLASS}[data-open="true"]) {
    border-color: ${cv.border.focus};
  }

  :where(.${DP_TRIGGER_CLASS}[data-error="true"]) {
    border-color: ${cv.error.main};
  }

  :where(.${DP_TRIGGER_CLASS}:disabled) {
    background: ${cv.bg.disabled};
    color: ${cv.text.disabled};
    cursor: not-allowed;
  }

  :where(.${DP_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${DP_TRIGGER_TEXT_CLASS}[data-placeholder="true"]) {
    color: ${cv.text.placeholder};
  }

  :where(.${DP_ICON_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    color: ${cv.icon.subtle};
  }

  :where(.${DP_PANEL_CLASS}) {
    position: fixed;
    width: 296px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow.md};
    z-index: ${zIndex.dropdown};
    padding: ${spacing[12]}px;
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    animation: nds-date-picker-fade-in ${transition.default};
  }

  :where(.${DP_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${spacing[8]}px;
  }

  :where(.${DP_NAV_BTN_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: ${radius.sm}px;
    background: transparent;
    cursor: pointer;
    color: ${cv.icon.default};
    transition: background-color ${transition.default};
  }

  :where(.${DP_NAV_BTN_CLASS}:hover) {
    background: ${cv.bg.light};
  }

  :where(.${DP_NAV_BTN_CLASS}:disabled) {
    color: ${cv.icon.subtle};
    cursor: not-allowed;
    opacity: 0.4;
  }

  :where(.${DP_NAV_BTN_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${DP_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.default};
  }

  :where(.${DP_DOW_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: ${spacing[4]}px;
  }

  :where(.${DP_DOW_CELL_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.subtle};
  }

  :where(.${DP_DOW_CELL_CLASS}[data-day="0"]) {
    color: ${cv.error.main};
  }

  :where(.${DP_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  :where(.${DP_DAY_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: ${radius.sm}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1;
    color: ${cv.text.default};
    transition: background-color ${transition.default}, color ${transition.default};
  }

  :where(.${DP_DAY_CLASS}[data-outside="true"]) {
    color: ${cv.text.disabled};
  }

  :where(.${DP_DAY_CLASS}[data-day="0"]:not([data-disabled="true"])) {
    color: ${cv.error.main};
  }

  :where(.${DP_DAY_CLASS}:hover:not(:disabled):not([data-selected="true"])) {
    background: ${cv.bg.light};
  }

  :where(.${DP_DAY_CLASS}[data-today="true"]:not([data-selected="true"])) {
    font-weight: ${fontWeight.bold};
    outline: 1px solid ${cv.border.default};
    outline-offset: -1px;
  }

  :where(.${DP_DAY_CLASS}[data-selected="true"]) {
    background: ${cv.primary.main};
    color: ${cv.primary.fg};
    font-weight: ${fontWeight.medium};
  }

  :where(.${DP_DAY_CLASS}:disabled),
  :where(.${DP_DAY_CLASS}[data-disabled="true"]) {
    color: ${cv.text.disabled};
    cursor: not-allowed;
    background: transparent;
  }

  :where(.${DP_FOOTER_CLASS}) {
    display: flex;
    justify-content: flex-end;
    margin-top: ${spacing[8]}px;
    padding-top: ${spacing[8]}px;
    border-top: 1px solid ${cv.border.light};
  }

  @keyframes nds-date-picker-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "날짜 선택",
  disabled = false,
  error = false,
  fullWidth = false,
  className,
  portalContainer,
  formatValue = formatYMD,
}) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => value ?? new Date());
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const today = useMemo(() => startOfDay(new Date()), []);
  const minDay = minDate ? startOfDay(minDate) : null;
  const maxDay = maxDate ? startOfDay(maxDate) : null;

  useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

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

  const isDisabledDay = (d: Date) => {
    if (minDay && d < minDay) return true;
    if (maxDay && d > maxDay) return true;
    return false;
  };

  const canPrevMonth =
    !minDay || addMonths(viewDate, -1).getTime() + 31 * 86400000 >= minDay.getTime();
  const canNextMonth = !maxDay || addMonths(viewDate, 1).getTime() <= maxDay.getTime();

  const grid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

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
        data-error={error ? "true" : "false"}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={DP_TRIGGER_CLASS}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span
          data-slot="trigger-text"
          data-placeholder={value ? "false" : "true"}
          className={DP_TRIGGER_TEXT_CLASS}
        >
          {value ? formatValue(value) : placeholder}
        </span>
        <span aria-hidden="true" className={DP_ICON_CLASS}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect
              x="2"
              y="3"
              width="12"
              height="11"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
            <path
              d="M5.5 1.5v3M10.5 1.5v3"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
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
            <div data-slot="grid" role="grid" className={DP_GRID_CLASS}>
              {grid.map((d) => {
                const inMonth = d.getMonth() === viewDate.getMonth();
                const disabledDay = isDisabledDay(d);
                const selected = value ? isSameDay(d, value) : false;
                const isToday = isSameDay(d, today);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    role="gridcell"
                    aria-selected={selected}
                    data-slot="day"
                    data-outside={!inMonth ? "true" : "false"}
                    data-selected={selected ? "true" : "false"}
                    data-today={isToday ? "true" : "false"}
                    data-disabled={disabledDay ? "true" : "false"}
                    data-day={String(d.getDay())}
                    disabled={disabledDay}
                    className={DP_DAY_CLASS}
                    onClick={() => {
                      if (disabledDay) return;
                      onChange(startOfDay(d));
                      setOpen(false);
                    }}
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
