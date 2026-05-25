import React, { useCallback, useId, useState } from "react";

/* ─── Class names ─── */

const TA_CLASS = "nds-textarea";
const TA_ROOT_CLASS = `${TA_CLASS}__root`;
const TA_LABEL_CLASS = `${TA_CLASS}__label`;
const TA_WRAPPER_CLASS = `${TA_CLASS}__wrapper`;
const TA_FIELD_CLASS = `${TA_CLASS}__field`;
const TA_HELPER_CLASS = `${TA_CLASS}__helper`;
const TA_COUNT_CLASS = `${TA_CLASS}__count`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> {
  /** 라벨 */
  label?: React.ReactNode;
  /** 에러 상태 */
  error?: boolean;
  /** 헬퍼 텍스트 */
  helperText?: React.ReactNode;
  /** 최대 글자수 (카운터 표시) */
  maxLength?: number;
  /** 최소 높이 (px) */
  minHeight?: number;
  /** 리사이즈 모드 */
  resize?: "none" | "vertical" | "horizontal" | "both";
  /** 루트 className */
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error = false,
      helperText,
      maxLength,
      minHeight,
      resize,
      disabled = false,
      readOnly = false,
      className,
      style,
      id: idProp,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const helperId = `${inputId}-helper`;
    const [focused, setFocused] = useState(false);
    const [charCount, setCharCount] = useState(() => {
      const initial = (value ?? defaultValue ?? "") as string;
      return initial.length;
    });

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        onChange?.(e);
      },
      [onChange],
    );

    const cssVars: Record<string, string> = {};
    if (minHeight !== undefined) {
      cssVars["--nds-textarea-min-height"] = `${minHeight}px`;
    }
    if (resize !== undefined) {
      cssVars["--nds-textarea-resize"] = resize;
    }

    return (
      <div
        data-slot="root"
        className={cx(TA_ROOT_CLASS, className)}
        style={{ ...cssVars, ...style }}
      >
        {label && (
          <label data-slot="label" className={TA_LABEL_CLASS} htmlFor={inputId}>
            {label}
          </label>
        )}
        <div
          data-slot="wrapper"
          data-focused={focused ? "true" : "false"}
          data-error={error ? "true" : "false"}
          data-disabled={disabled ? "true" : "false"}
          data-readonly={readOnly ? "true" : "false"}
          className={TA_WRAPPER_CLASS}
        >
          <textarea
            ref={ref}
            data-slot="field"
            id={inputId}
            className={TA_FIELD_CLASS}
            disabled={disabled}
            readOnly={readOnly}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            aria-invalid={error || undefined}
            aria-describedby={helperText ? helperId : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...rest}
          />
          {maxLength !== undefined && (
            <div
              data-slot="count"
              data-over={charCount > maxLength ? "true" : "false"}
              className={TA_COUNT_CLASS}
            >
              {charCount}/{maxLength}
            </div>
          )}
        </div>
        {helperText && (
          <span
            data-slot="helper"
            data-error={error ? "true" : "false"}
            id={helperId}
            className={TA_HELPER_CLASS}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
