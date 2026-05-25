import React, { useCallback, useId } from "react";

/* ─── Constants ─── */

const SL_CLASS = "nds-slider";
const SL_ROOT_CLASS = `${SL_CLASS}__root`;
const SL_TRACK_CLASS = `${SL_CLASS}__track`;
const SL_FILL_CLASS = `${SL_CLASS}__fill`;
const SL_INPUT_CLASS = `${SL_CLASS}__input`;
const SL_LABELS_CLASS = `${SL_CLASS}__labels`;
const SL_LABEL_CLASS = `${SL_CLASS}__label`;
const SL_VALUE_CLASS = `${SL_CLASS}__value`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

/* ─── Component ─── */

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> {
  /** 현재 값 */
  value: number;
  /** 변경 콜백 */
  onValueChange: (value: number) => void;
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 단계 */
  step?: number;
  /** 좌측 끝 라벨 (예: "약함") */
  startLabel?: React.ReactNode;
  /** 우측 끝 라벨 (예: "강함") */
  endLabel?: React.ReactNode;
  /** 현재 값 표시 (값/단위 등) */
  showValue?: boolean;
  /** 값 표시 포맷 */
  formatValue?: (value: number) => React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
  /** 루트 className */
  className?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      startLabel,
      endLabel,
      showValue = false,
      formatValue,
      disabled = false,
      className,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(Number(e.target.value));
      },
      [onValueChange],
    );

    const percent = clamp(((value - min) / (max - min)) * 100, 0, 100);
    const showLabels = startLabel !== undefined || endLabel !== undefined;
    const showValueRow = showValue || showLabels;

    return (
      <div
        data-slot="root"
        data-disabled={disabled ? "true" : "false"}
        className={cx(SL_ROOT_CLASS, className)}
      >
        <div data-slot="track" className={SL_TRACK_CLASS}>
          <span aria-hidden="true" className={SL_FILL_CLASS} style={{ width: `${percent}%` }} />
          <input
            ref={ref}
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            className={SL_INPUT_CLASS}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            {...rest}
          />
        </div>
        {showValueRow && (
          <div data-slot="labels" className={SL_LABELS_CLASS}>
            <span data-slot="label-start" className={SL_LABEL_CLASS}>
              {startLabel}
            </span>
            {showValue && (
              <span data-slot="value" className={SL_VALUE_CLASS}>
                {formatValue ? formatValue(value) : value}
              </span>
            )}
            <span data-slot="label-end" className={SL_LABEL_CLASS}>
              {endLabel}
            </span>
          </div>
        )}
      </div>
    );
  },
);

Slider.displayName = "Slider";
