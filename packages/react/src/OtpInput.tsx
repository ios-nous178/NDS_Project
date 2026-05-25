import React, { useCallback, useId, useRef } from "react";

/* ─── Constants ─── */

const OTP_CLASS = "nds-otp";
const OTP_ROOT_CLASS = `${OTP_CLASS}__root`;
const OTP_CELL_CLASS = `${OTP_CLASS}__cell`;
const OTP_INPUT_CLASS = `${OTP_CLASS}__input`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const onlyDigits = (s: string) => s.replace(/\D/g, "");

/* ─── Component ─── */

export interface OtpInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 자릿수 (기본 6) */
  length?: number;
  /** 현재 값 (자릿수 길이 이하의 숫자 문자열) */
  value: string;
  /** 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 입력 완료 시 콜백 (length 만큼 채워졌을 때) */
  onComplete?: (value: string) => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** autoFocus */
  autoFocus?: boolean;
}

export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      length = 6,
      value,
      onValueChange,
      onComplete,
      disabled = false,
      error = false,
      autoFocus = false,
      className,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const baseId = idProp ?? generatedId;
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const writeValue = useCallback(
      (next: string) => {
        const sliced = onlyDigits(next).slice(0, length);
        onValueChange(sliced);
        if (sliced.length === length) onComplete?.(sliced);
      },
      [length, onValueChange, onComplete],
    );

    const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const ch = onlyDigits(e.target.value).slice(-1);
      const arr = value.split("");
      arr[idx] = ch ?? "";
      const next = arr.join("").padEnd(0, "");
      writeValue(next);
      if (ch && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    };

    const handleKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (value[idx]) {
          const arr = value.split("");
          arr[idx] = "";
          writeValue(arr.join(""));
        } else if (idx > 0) {
          inputsRef.current[idx - 1]?.focus();
          const arr = value.split("");
          arr[idx - 1] = "";
          writeValue(arr.join(""));
        }
      } else if (e.key === "ArrowLeft" && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      } else if (e.key === "ArrowRight" && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = onlyDigits(e.clipboardData.getData("text"));
      if (!pasted) return;
      writeValue(pasted);
      const focusIdx = Math.min(pasted.length, length - 1);
      inputsRef.current[focusIdx]?.focus();
    };

    return (
      <div
        ref={ref}
        data-slot="root"
        data-disabled={disabled ? "true" : "false"}
        data-error={error ? "true" : "false"}
        className={cx(OTP_ROOT_CLASS, className)}
        {...rest}
      >
        {Array.from({ length }, (_, idx) => {
          const ch = value[idx] ?? "";
          const inputId = `${baseId}-${idx}`;
          return (
            <div key={idx} data-slot="cell" className={OTP_CELL_CLASS}>
              <input
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                id={inputId}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={idx === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={ch}
                disabled={disabled}
                autoFocus={autoFocus && idx === 0}
                onChange={handleChange(idx)}
                onKeyDown={handleKeyDown(idx)}
                onPaste={handlePaste}
                className={OTP_INPUT_CLASS}
                aria-label={`인증번호 ${idx + 1}자리`}
              />
            </div>
          );
        })}
      </div>
    );
  },
);

OtpInput.displayName = "OtpInput";
