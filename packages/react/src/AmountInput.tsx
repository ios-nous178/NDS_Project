import React, { useId, useLayoutEffect, useRef } from "react";

/* ─── Constants ─── */

const AI_CLASS = "nds-amount-input";
const AI_LABEL_CLASS = `${AI_CLASS}__label`;
const AI_FIELD_CLASS = `${AI_CLASS}__field`;
const AI_PREFIX_CLASS = `${AI_CLASS}__prefix`;
const AI_INPUT_CLASS = `${AI_CLASS}__input`;
const AI_UNIT_CLASS = `${AI_CLASS}__unit`;
const AI_PRESETS_CLASS = `${AI_CLASS}__presets`;
const AI_PRESET_CLASS = `${AI_CLASS}__preset`;
const AI_HELPER_CLASS = `${AI_CLASS}__helper`;

/* ─── Types ─── */

export interface AmountInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> {
  /** 숫자 값 (controlled). null/undefined면 빈 입력 */
  value: number | null;
  /** 변경 콜백 */
  onValueChange: (value: number | null) => void;
  /** 통화 prefix (예: "₩", "$") */
  prefix?: string;
  /** 통화 suffix (예: "원") */
  unit?: string;
  /** 라벨 */
  label?: React.ReactNode;
  /** 헬퍼 / 에러 텍스트 */
  helperText?: React.ReactNode;
  /** 에러 */
  error?: boolean;
  /** 가로 가득 */
  fullWidth?: boolean;
  /** 빠른 입력 버튼 (값을 누적 또는 설정) */
  presets?: AmountPreset[];
  /** 최댓값 */
  max?: number;
  /** 최솟값 */
  min?: number;
}

export interface AmountPreset {
  /** 라벨 (예: "+1만", "전액") */
  label: string;
  /** 더할 값 (set이 true면 설정) */
  amount: number;
  /** 누적이 아닌 설정 모드 */
  set?: boolean;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatNumber = (n: number) => n.toLocaleString("ko-KR");

/** caret 앞쪽의 숫자(0-9) 개수 — 천단위 콤마 재포맷 후에도 같은 자릿수 위치로 복원하기 위한 기준. */
const countDigitsBefore = (text: string, caret: number): number => {
  let count = 0;
  for (let i = 0; i < caret && i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 48 && c <= 57) count++;
  }
  return count;
};

/** 포맷된 문자열에서 "앞에서 n번째 숫자 바로 뒤" 의 인덱스 — countDigitsBefore 의 역연산. */
const caretAfterDigits = (formatted: string, digits: number): number => {
  if (digits <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    const c = formatted.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      count++;
      if (count === digits) return i + 1;
    }
  }
  return formatted.length;
};

/* ─── Component ─── */

export const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      value,
      onValueChange,
      prefix,
      unit = "원",
      label,
      helperText,
      error = false,
      fullWidth = false,
      presets,
      max,
      min,
      placeholder = "0",
      className,
      ...rest
    },
    ref,
  ) => {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const display = value === null || value === undefined ? "" : formatNumber(value);

    // 입력 이벤트 직후 복원할 caret 의 "앞쪽 숫자 개수". null = 복원 안 함(프로그래매틱 변경 등).
    const caretDigitsRef = useRef<number | null>(null);

    // 재포맷으로 input.value(콤마 위치)가 바뀐 뒤 caret 을 같은 자릿수 위치로 되돌린다.
    // 안 하면 매 입력마다 caret 이 끝으로 튀어 중간 수정이 불가능하다(돈입력 "동작이상함" 핵심).
    useLayoutEffect(() => {
      if (caretDigitsRef.current === null) return;
      const el = inputRef.current;
      if (el) {
        const pos = caretAfterDigits(el.value, caretDigitsRef.current);
        el.setSelectionRange(pos, pos);
      }
      caretDigitsRef.current = null;
    });

    const setValue = (n: number | null) => {
      if (n !== null) {
        let next = n;
        if (max !== undefined && next > max) next = max;
        if (min !== undefined && next < min) next = min;
        onValueChange(next);
      } else {
        onValueChange(null);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const el = e.target;
      const caret = el.selectionStart ?? el.value.length;
      caretDigitsRef.current = countDigitsBefore(el.value, caret);
      const raw = el.value.replace(/[^0-9]/g, "");
      if (!raw) {
        setValue(null);
        return;
      }
      setValue(Number(raw));
    };

    const applyPreset = (p: AmountPreset) => {
      const current = value ?? 0;
      const next = p.set ? p.amount : current + p.amount;
      setValue(next);
    };

    return (
      <div
        data-slot="root"
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(AI_CLASS, className)}
      >
        {label && (
          <label htmlFor={inputId} className={AI_LABEL_CLASS}>
            {label}
          </label>
        )}
        <div className={AI_FIELD_CLASS} data-error={error ? "true" : "false"}>
          {prefix && <span className={AI_PREFIX_CLASS}>{prefix}</span>}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            inputMode="numeric"
            className={AI_INPUT_CLASS}
            value={display}
            placeholder={placeholder}
            onChange={handleChange}
            {...rest}
          />
          {unit && <span className={AI_UNIT_CLASS}>{unit}</span>}
        </div>
        {presets && presets.length > 0 && (
          <div className={AI_PRESETS_CLASS}>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                className={AI_PRESET_CLASS}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
        {helperText && (
          <p className={AI_HELPER_CLASS + " nds-helper-text"} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";
