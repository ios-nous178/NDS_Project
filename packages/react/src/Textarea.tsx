import React, { useCallback, useId, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const TA_CLASS = "nds-textarea";
const TA_ROOT_CLASS = `${TA_CLASS}__root`;
const TA_LABEL_CLASS = `${TA_CLASS}__label`;
const TA_WRAPPER_CLASS = `${TA_CLASS}__wrapper`;
const TA_FIELD_CLASS = `${TA_CLASS}__field`;
const TA_HELPER_CLASS = `${TA_CLASS}__helper`;
const TA_COUNT_CLASS = `${TA_CLASS}__count`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const textareaStyles = `
  :where(.${TA_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-comfortable);
    width: var(--nds-textarea-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TA_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${TA_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: var(--inset-input) var(--inset-card);
    border: 1px solid var(--nds-textarea-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-textarea-radius, ${radius.md}px);
    background: var(--nds-textarea-background, ${cv.surface.default});
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${TA_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${TA_WRAPPER_CLASS}[data-error="true"]) {
    border-color: ${cv.borderRole.statusError};
  }

  :where(.${TA_WRAPPER_CLASS}[data-disabled="true"]) {
    background: ${cv.surface.subtle};
    cursor: default;
  }

  :where(.${TA_WRAPPER_CLASS}[data-readonly="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${TA_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    padding: 0;
    resize: var(--nds-textarea-resize, vertical);
    min-height: var(--nds-textarea-min-height, 80px);
  }

  :where(.${TA_FIELD_CLASS}::placeholder) {
    color: ${cv.textRole.muted};
  }

  :where(.${TA_FIELD_CLASS}:disabled) {
    color: ${cv.textRole.muted};
    cursor: default;
    resize: none;
  }

  :where(.${TA_HELPER_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: var(--nds-textarea-helper-color, ${cv.textRole.subtle});
  }

  :where(.${TA_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${TA_COUNT_CLASS}) {
    text-align: right;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.muted};
    margin-top: ${spacing[4]}px;
  }

  :where(.${TA_COUNT_CLASS}[data-over="true"]) {
    color: ${cv.textRole.statusError};
  }
`;

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
