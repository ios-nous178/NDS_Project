import React, { useCallback, useId } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const SL_CLASS = "nds-slider";
const SL_ROOT_CLASS = `${SL_CLASS}__root`;
const SL_TRACK_CLASS = `${SL_CLASS}__track`;
const SL_FILL_CLASS = `${SL_CLASS}__fill`;
const SL_INPUT_CLASS = `${SL_CLASS}__input`;
const SL_LABELS_CLASS = `${SL_CLASS}__labels`;
const SL_LABEL_CLASS = `${SL_CLASS}__label`;
const SL_VALUE_CLASS = `${SL_CLASS}__value`;

// eslint-disable-next-line unused-imports/no-unused-vars
const sliderStyles = `
  :where(.${SL_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SL_ROOT_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    pointer-events: none;
  }

  :where(.${SL_TRACK_CLASS}) {
    position: relative;
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
  }

  :where(.${SL_TRACK_CLASS})::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.disabled};
  }

  :where(.${SL_FILL_CLASS}) {
    position: absolute;
    left: 0;
    height: 4px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.brand};
    pointer-events: none;
    transition: width ${transition.default};
  }

  :where(.${SL_INPUT_CLASS}) {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: 24px;
    background: transparent;
    margin: 0;
    padding: 0;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  :where(.${SL_INPUT_CLASS})::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    border: 2px solid ${cv.borderRole.brand};
    box-shadow: ${shadow["1"]};
    cursor: pointer;
    transition: transform ${transition.default};
  }

  :where(.${SL_INPUT_CLASS})::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.default};
    border: 2px solid ${cv.borderRole.brand};
    box-shadow: ${shadow["1"]};
    cursor: pointer;
  }

  :where(.${SL_INPUT_CLASS}:active)::-webkit-slider-thumb {
    transform: scale(1.1);
  }

  :where(.${SL_INPUT_CLASS}:focus-visible)::-webkit-slider-thumb {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${SL_LABELS_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :where(.${SL_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    user-select: none;
  }

  :where(.${SL_VALUE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
    user-select: none;
  }
`;

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
