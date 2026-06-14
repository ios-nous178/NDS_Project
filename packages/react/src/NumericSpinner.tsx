import React, { useImperativeHandle, useRef, useState } from "react";

/* ─── Class names ─── */

const NS_CLASS = "nds-numeric-spinner";
const NS_BUTTON_CLASS = `${NS_CLASS}__button`;
const NS_INPUT_CLASS = `${NS_CLASS}__input`;

/* ─── Types ─── */

export type NumericSpinnerSize = "medium" | "small";

export interface NumericSpinnerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "size" | "min" | "max" | "step"
> {
  /** 현재 값 (controlled, 정수) */
  value: number;
  /** 변경 콜백 — 버튼 증감/직접 입력 모두 clamp 된 정수를 넘긴다 */
  onValueChange: (value: number) => void;
  /** 최솟값 — 도달 시 `−` 버튼 disabled */
  min?: number;
  /** 최댓값 — 도달 시 `+` 버튼 disabled */
  max?: number;
  /** 증감 단위 @default 1 */
  step?: number;
  /** 비활성화 */
  disabled?: boolean;
  /** 높이 — medium(48) / small(40) @default "medium" */
  size?: NumericSpinnerSize;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const clamp = (n: number, min?: number, max?: number): number => {
  let next = n;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  return next;
};

const MinusIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M3.75 9h10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PlusIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M9 3.75v10.5M3.75 9h10.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── Component ─── */

/**
 * NumericSpinner — `−` / 값 / `+` 으로 정수를 증감하는 입력.
 *
 * 키보드 없이 수량·회차·세트 수 같은 작은 정수를 조정할 때. 가운데 값은 직접 입력도 가능
 * (입력 중에는 자유롭게 타이핑, blur 시 clamp). 화살표 위/아래 키로도 증감한다(role="spinbutton").
 *
 * 혼동 주의:
 * - `Stepper` 는 단계 **진행 표시기**(numbered/dots/bar) — 증감 입력이 아니다.
 * - `AmountInput` 은 금액(천단위 콤마 + 프리셋 칩) 입력 — 큰 수/통화용.
 */
export const NumericSpinner = React.forwardRef<HTMLInputElement, NumericSpinnerProps>(
  (
    {
      value,
      onValueChange,
      min,
      max,
      step = 1,
      disabled = false,
      size = "medium",
      className,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // 입력 중 사용자가 친 원문(빈 문자열·"-" 같은 중간 상태 허용). null = prop value 표시.
    const [draft, setDraft] = useState<string | null>(null);

    const commit = (n: number) => {
      const next = clamp(Math.round(n), min, max);
      if (next !== value) onValueChange(next);
    };

    const minusDisabled = disabled || (min !== undefined && value <= min);
    const plusDisabled = disabled || (max !== undefined && value >= max);

    const stepBy = (dir: 1 | -1) => {
      setDraft(null);
      commit(value + dir * step);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (!/^-?\d*$/.test(raw)) return; // 정수 외 문자는 무시(노드/커서 보존)
      setDraft(raw);
      if (raw === "" || raw === "-") return; // 중간 상태 — 아직 commit 안 함
      commit(Number(raw));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setDraft(null); // 표시를 clamp 된 prop value 로 되돌린다
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!disabled) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          stepBy(1);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          stepBy(-1);
        }
      }
      onKeyDown?.(e);
    };

    const display = draft ?? String(value);

    return (
      <div
        data-slot="root"
        data-size={size}
        data-disabled={disabled ? "true" : "false"}
        className={cx(NS_CLASS, className)}
      >
        <button
          type="button"
          className={NS_BUTTON_CLASS}
          data-action="decrement"
          onClick={() => stepBy(-1)}
          disabled={minusDisabled}
          tabIndex={-1}
          aria-label="값 감소"
        >
          {MinusIcon}
        </button>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          className={NS_INPUT_CLASS}
          value={display}
          disabled={disabled}
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        <button
          type="button"
          className={NS_BUTTON_CLASS}
          data-action="increment"
          onClick={() => stepBy(1)}
          disabled={plusDisabled}
          tabIndex={-1}
          aria-label="값 증가"
        >
          {PlusIcon}
        </button>
      </div>
    );
  },
);

NumericSpinner.displayName = "NumericSpinner";
