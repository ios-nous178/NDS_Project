import React, { useId, useRef } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const aiStyles = `
  :where(.${AI_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${AI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${AI_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 ${spacing[16]}px;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default};
  }
  :where(.${AI_FIELD_CLASS}:focus-within) { border-color: ${cv.borderRole.brand}; }
  :where(.${AI_FIELD_CLASS}[data-error="true"]) { border-color: var(--semantic-border-status-error); }

  :where(.${AI_PREFIX_CLASS}),
  :where(.${AI_UNIT_CLASS}) {
    font-size: 22px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${AI_PREFIX_CLASS}) { margin-right: ${spacing[4]}px; }
  :where(.${AI_UNIT_CLASS}) { margin-left: ${spacing[4]}px; }

  :where(.${AI_INPUT_CLASS}) {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: 24px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    text-align: right;
    font-variant-numeric: tabular-nums;
    min-width: 0;
  }

  :where(.${AI_INPUT_CLASS}::placeholder) {
    color: ${cv.textRole.muted};
    font-weight: ${fontWeight.medium};
  }

  :where(.${AI_PRESETS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[8]}px;
  }

  :where(.${AI_PRESET_CLASS}) {
    height: 36px;
    padding: 0 ${spacing[12]}px;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: 9999px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    transition: background-color ${transition.default};
  }
  :where(.${AI_PRESET_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${AI_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }
  :where(.${AI_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatNumber = (n: number) => n.toLocaleString("ko-KR");

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
      const raw = e.target.value.replace(/[^0-9]/g, "");
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
          <p className={AI_HELPER_CLASS} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

AmountInput.displayName = "AmountInput";
