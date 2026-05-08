import React, { useId } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_INPUT_CLASS = `${TP_CLASS}__input`;
const TP_HELPER_CLASS = `${TP_CLASS}__helper`;

/* ─── Types ─── */

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 값 (`HH:mm`) */
  value: string;
  /** 변경 콜백 */
  onValueChange: (value: string) => void;
  /** step 분 단위 (input[type=time]의 step 속성, 초 단위 — 60 = 1분) */
  step?: number;
  /** 라벨 */
  label?: React.ReactNode;
  /** 헬퍼 / 에러 텍스트 */
  helperText?: React.ReactNode;
  /** 에러 */
  error?: boolean;
  /** 가로 가득 */
  fullWidth?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** min (HH:mm) */
  min?: string;
  /** max (HH:mm) */
  max?: string;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const tpStyles = `
  :where(.${TP_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    font-family: ${fontFamily.web};
  }

  :where(.${TP_ROOT_CLASS}[data-full-width="true"]) { width: 100%; }

  :where(.${TP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.default};
  }

  :where(.${TP_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    height: ${sizing.input.default}px;
    padding: 0 ${spacing[16]}px;
    border: 1px solid ${cv.border.default};
    border-radius: ${radius.md}px;
    background: ${cv.bg.white};
    transition: border-color ${transition.default};
  }

  :where(.${TP_FIELD_CLASS}:focus-within) { border-color: ${cv.primary.main}; }
  :where(.${TP_FIELD_CLASS}[data-error="true"]) { border-color: var(--color-semantic-error-main); }
  :where(.${TP_FIELD_CLASS}[data-disabled="true"]) {
    background: ${cv.bg.coolGray};
    cursor: not-allowed;
  }

  :where(.${TP_INPUT_CLASS}) {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.text.default};
    font-variant-numeric: tabular-nums;
  }

  :where(.${TP_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.text.subtle};
  }

  :where(.${TP_HELPER_CLASS}[data-error="true"]) { color: var(--color-semantic-error-main); }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value,
      onValueChange,
      step = 60 * 5,
      label,
      helperText,
      error = false,
      fullWidth = false,
      disabled = false,
      min,
      max,
      className,
      ...rest
    },
    ref,
  ) => {
    const inputId = useId();

    return (
      <div
        data-slot="root"
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(TP_ROOT_CLASS, className)}
      >
        {label && (
          <label htmlFor={inputId} className={TP_LABEL_CLASS}>
            {label}
          </label>
        )}
        <div
          className={TP_FIELD_CLASS}
          data-error={error ? "true" : "false"}
          data-disabled={disabled ? "true" : "false"}
        >
          <input
            ref={ref}
            id={inputId}
            type="time"
            className={TP_INPUT_CLASS}
            value={value}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
            onChange={(e) => onValueChange(e.target.value)}
            {...rest}
          />
        </div>
        {helperText && (
          <p className={TP_HELPER_CLASS} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TimePicker.displayName = "TimePicker";
