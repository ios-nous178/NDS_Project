import React from "react";
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-eap/tokens";
import { DatePicker } from "./DatePicker";

/* ─── Constants ─── */

const DR_CLASS = "nds-date-range";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_FIELD_CLASS = `${DR_CLASS}__field`;
const DR_LABEL_CLASS = `${DR_CLASS}__label`;
const DR_SEPARATOR_CLASS = `${DR_CLASS}__separator`;
const DR_PRESETS_CLASS = `${DR_CLASS}__presets`;
const DR_PRESET_CLASS = `${DR_CLASS}__preset`;

// eslint-disable-next-line unused-imports/no-unused-vars
const dateRangeStyles = `
  :where(.${DR_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${DR_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    flex-wrap: wrap;
  }

  :where(.${DR_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.subtle};
    flex-shrink: 0;
  }

  :where(.${DR_SEPARATOR_CLASS}) {
    flex-shrink: 0;
    color: ${cv.text.subtle};
    font-size: ${typeScale.body3.fontSize}px;
  }

  :where(.${DR_PRESETS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[6]}px;
  }

  :where(.${DR_PRESET_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    padding: ${spacing[4]}px ${spacing[10]}px;
    background: ${cv.bg.coolGrayLighter};
    color: ${cv.text.normal};
    border-radius: 999px;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
  }

  :where(.${DR_PRESET_CLASS}[data-active="true"]) {
    background: ${cv.primary.bgLighter};
    color: ${cv.primary.main};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
};
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

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
  /** 빠른 선택 프리셋 */
  presets?: DateRangePreset[];
  /** 선택 가능한 최소 날짜 */
  minDate?: Date;
  /** 선택 가능한 최대 날짜 */
  maxDate?: Date;
  /** 비활성화 */
  disabled?: boolean;
  /** 루트 className */
  className?: string;
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
  const target = preset.range();
  if (!target.from || !target.to || !value.from || !value.to) return false;
  return isSameDay(target.from, value.from) && isSameDay(target.to, value.to);
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onValueChange,
  startLabel = "시작",
  endLabel = "종료",
  presets,
  minDate,
  maxDate,
  disabled = false,
  className,
}) => {
  const handleStart = (d: Date) => {
    const from = startOfDay(d);
    const to = value.to && value.to < from ? undefined : value.to;
    onValueChange({ from, to });
  };
  const handleEnd = (d: Date) => {
    onValueChange({ from: value.from, to: startOfDay(d) });
  };

  return (
    <div data-slot="root" className={cx(DR_ROOT_CLASS, className)}>
      <div data-slot="field" className={DR_FIELD_CLASS}>
        <span data-slot="label" className={DR_LABEL_CLASS}>
          {startLabel}
        </span>
        <DatePicker
          value={value.from}
          onChange={handleStart}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
        />
        <span aria-hidden="true" data-slot="separator" className={DR_SEPARATOR_CLASS}>
          ~
        </span>
        <span data-slot="label" className={DR_LABEL_CLASS}>
          {endLabel}
        </span>
        <DatePicker
          value={value.to}
          onChange={handleEnd}
          minDate={value.from ?? minDate}
          maxDate={maxDate}
          disabled={disabled}
        />
      </div>
      {presets && presets.length > 0 && (
        <div data-slot="presets" className={DR_PRESETS_CLASS}>
          {presets.map((p) => {
            const active = isPresetActive(p, value);
            return (
              <button
                key={p.label}
                type="button"
                data-slot="preset"
                data-active={active ? "true" : "false"}
                className={DR_PRESET_CLASS}
                onClick={() => onValueChange(p.range())}
                disabled={disabled}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

DateRangePicker.displayName = "DateRangePicker";
