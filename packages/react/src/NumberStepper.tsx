import React, { useCallback } from "react";
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const NS_CLASS = "nds-number-stepper";
const NS_BTN_CLASS = `${NS_CLASS}__btn`;
const NS_VALUE_CLASS = `${NS_CLASS}__value`;
const NS_INPUT_CLASS = `${NS_CLASS}__input`;

const sizeConfig = {
  sm: { btn: 28, fontSize: 13, valueW: 36 },
  md: { btn: 36, fontSize: 15, valueW: 48 },
  lg: { btn: 44, fontSize: 17, valueW: 56 },
} as const;

export type NumberStepperSize = keyof typeof sizeConfig;

/* ─── Types ─── */

export interface NumberStepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 현재 값 (controlled) */
  value: number;
  /** 변경 콜백 */
  onValueChange: (value: number) => void;
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 증감 단위 */
  step?: number;
  /** 크기 */
  size?: NumberStepperSize;
  /** 비활성화 */
  disabled?: boolean;
  /** 값 입력 가능 여부 (input으로 직접 타이핑) */
  editable?: boolean;
  /** 단위 표시 (예: "회", "잔") */
  unit?: string;
  /** aria-label (단위가 없는 컨텍스트에서) */
  "aria-label"?: string;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const numberStepperStyles = `
  :where(.${NS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${NS_BTN_CLASS}) {
    width: var(--nds-stepper-btn, 36px);
    height: var(--nds-stepper-btn, 36px);
    border-radius: ${radius.md}px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default}, border-color ${transition.default};
    flex-shrink: 0;
    padding: 0;
  }

  :where(.${NS_BTN_CLASS}:hover:not([disabled])) {
    background: ${cv.surface.section};
  }

  :where(.${NS_BTN_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${NS_BTN_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${NS_VALUE_CLASS}) {
    min-width: var(--nds-stepper-value-w, 48px);
    text-align: center;
    font-size: var(--nds-stepper-font, 15px);
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    line-height: ${typeScale.body2.lineHeight}px;
    user-select: none;
  }

  :where(.${NS_INPUT_CLASS}) {
    width: var(--nds-stepper-value-w, 48px);
    height: var(--nds-stepper-btn, 36px);
    text-align: center;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: var(--nds-stepper-font, 15px);
    font-weight: ${fontWeight.semibold};
    padding: 0;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  :where(.${NS_INPUT_CLASS}::-webkit-outer-spin-button),
  :where(.${NS_INPUT_CLASS}::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }

  :where(.${NS_INPUT_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 0;
    border-color: ${cv.borderRole.brand};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/* ─── Component ─── */

export const NumberStepper = React.forwardRef<HTMLDivElement, NumberStepperProps>(
  (
    {
      value,
      onValueChange,
      min = 0,
      max = 99,
      step = 1,
      size = "md",
      disabled = false,
      editable = false,
      unit,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const s = sizeConfig[size];

    const setValue = useCallback(
      (next: number) => {
        const clamped = clamp(next, min, max);
        if (clamped !== value) onValueChange(clamped);
      },
      [value, min, max, onValueChange],
    );

    const dec = () => setValue(value - step);
    const inc = () => setValue(value + step);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const n = Number(e.target.value);
      if (Number.isNaN(n)) return;
      setValue(n);
    };

    const isMin = value <= min;
    const isMax = value >= max;
    const formatted = unit ? `${value}${unit}` : String(value);

    return (
      <div
        ref={ref}
        data-slot="root"
        role="group"
        aria-label={ariaLabel ?? "수량 조절"}
        className={cx(NS_CLASS, className)}
        style={
          {
            "--nds-stepper-btn": `${s.btn}px`,
            "--nds-stepper-value-w": `${s.valueW}px`,
            "--nds-stepper-font": `${s.fontSize}px`,
          } as React.CSSProperties
        }
        {...rest}
      >
        <button
          type="button"
          className={NS_BTN_CLASS}
          aria-label="감소"
          disabled={disabled || isMin}
          onClick={dec}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {editable ? (
          <input
            className={NS_INPUT_CLASS}
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-label="값"
            onChange={onInputChange}
          />
        ) : (
          <span className={NS_VALUE_CLASS} aria-live="polite">
            {formatted}
          </span>
        )}

        <button
          type="button"
          className={NS_BTN_CLASS}
          aria-label="증가"
          disabled={disabled || isMax}
          onClick={inc}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  },
);

NumberStepper.displayName = "NumberStepper";
