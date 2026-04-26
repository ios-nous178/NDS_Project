import React, { createContext, useCallback, useContext, useId, useRef, useState } from "react";
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

/* ─── Class names ─── */

const INPUT_CLASS = "nds-input";
const INPUT_ROOT_CLASS = `${INPUT_CLASS}__root`;
const INPUT_WRAPPER_CLASS = `${INPUT_CLASS}__wrapper`;
const INPUT_LABEL_CLASS = `${INPUT_CLASS}__label`;
const INPUT_FIELD_CLASS = `${INPUT_CLASS}__field`;
const INPUT_PREFIX_CLASS = `${INPUT_CLASS}__prefix`;
const INPUT_SUFFIX_CLASS = `${INPUT_CLASS}__suffix`;
const INPUT_CLEAR_CLASS = `${INPUT_CLASS}__clear`;
const INPUT_HELPER_CLASS = `${INPUT_CLASS}__helper`;

export type InputSize = "default" | "field";

const inputSizeConfig = {
  default: {
    height: sizing.input.default,
    labelGap: spacing[12],
  },
  field: {
    height: sizing.input.field,
    labelGap: spacing[8],
  },
} as const;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const inputStyles = `
  :where(.${INPUT_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-input-label-gap, ${spacing[12]}px);
    width: var(--nds-input-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${INPUT_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.default};
  }

  :where(.${INPUT_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 ${spacing[16]}px;
    border: 1px solid var(--nds-input-border-color, ${cv.border.default});
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: var(--nds-input-background, ${cv.bg.white});
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.border.focus};
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-error="true"]) {
    border-color: ${cv.error.main};
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-disabled="true"]) {
    background: ${cv.bg.light};
    cursor: default;
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-readonly="true"]) {
    background: ${cv.bg.light};
  }

  :where(.${INPUT_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.default};
    padding: 0;
  }

  :where(.${INPUT_FIELD_CLASS}::placeholder) {
    color: ${cv.text.placeholder};
  }

  :where(.${INPUT_FIELD_CLASS}:disabled) {
    color: ${cv.text.disabled};
    cursor: default;
  }

  :where(.${INPUT_PREFIX_CLASS}),
  :where(.${INPUT_SUFFIX_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    line-height: 1;
  }

  :where(.${INPUT_PREFIX_CLASS}) {
    margin-right: ${spacing[8]}px;
    color: ${cv.icon.default};
  }

  :where(.${INPUT_SUFFIX_CLASS}) {
    margin-left: ${spacing[8]}px;
    color: ${cv.icon.default};
  }

  :where(.${INPUT_CLEAR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: ${spacing[8]}px;
    color: ${cv.icon.subtle};
    line-height: 1;
  }

  :where(.${INPUT_CLEAR_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  :where(.${INPUT_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.subtle};
  }

  :where(.${INPUT_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.error.main};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Context (compound) ─── */

interface InputContextValue {
  inputId: string;
  helperId: string;
  focused: boolean;
  setFocused: (v: boolean) => void;
  error: boolean;
  disabled: boolean;
  readOnly: boolean;
  hasHelper: boolean;
  setHasHelper: (v: boolean) => void;
}

const InputContext = createContext<InputContextValue | undefined>(undefined);

const useInputContext = () => {
  const ctx = useContext(InputContext);
  if (!ctx) throw new Error("Input compound components must be used within Input.Root");
  return ctx;
};

/* ─── Compound: Root ─── */

export interface InputRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 에러 상태 표시 */
  error?: boolean;
  /** 입력 비활성화 */
  disabled?: boolean;
  /** 읽기 전용 */
  readOnly?: boolean;
  /** 부모 너비에 맞춤 @default true */
  fullWidth?: boolean;
  /** 입력 필드 높이 변형 @default "default" */
  size?: InputSize;
  /** 외부에서 주입할 input ID (미지정 시 자동 생성) */
  inputId?: string;
  /** Root 내부 콘텐츠 (Label, Wrapper, Helper 등) */
  children: React.ReactNode;
}

export const InputRoot: React.FC<InputRootProps> = ({
  error = false,
  disabled = false,
  readOnly = false,
  fullWidth = true,
  size = "default",
  inputId: inputIdProp,
  children,
  className,
  style,
  ...rest
}) => {
  const generatedInputId = useId();
  const generatedHelperId = useId();
  const inputId = inputIdProp ?? generatedInputId;
  const helperId = `${inputId}-helper`;
  const [focused, setFocused] = useState(false);
  const [hasHelper, setHasHelper] = useState(false);
  const sizeStyle = inputSizeConfig[size];

  return (
    <InputContext.Provider
      value={{
        inputId,
        helperId,
        focused,
        setFocused,
        error,
        disabled,
        readOnly,
        hasHelper,
        setHasHelper,
      }}
    >
      <div
        data-slot="root"
        data-size={size}
        className={cx(INPUT_ROOT_CLASS, className)}
        style={
          {
            "--nds-input-width": fullWidth ? "100%" : "auto",
            "--nds-input-height": `${sizeStyle.height}px`,
            "--nds-input-label-gap": `${sizeStyle.labelGap}px`,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </InputContext.Provider>
  );
};

/* ─── Compound: Label ─── */

export interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 라벨 텍스트 (자동으로 input과 htmlFor 연결) */
  children: React.ReactNode;
}

export const InputLabel: React.FC<InputLabelProps> = ({ children, className, ...rest }) => {
  const { inputId } = useInputContext();
  return (
    <label
      htmlFor={inputId}
      data-slot="label"
      className={cx(INPUT_LABEL_CLASS, className)}
      {...rest}
    >
      {children}
    </label>
  );
};

/* ─── Compound: Wrapper ─── */

export interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 입력 필드와 부가 요소 (ClearButton, suffix 등) */
  children: React.ReactNode;
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  className,
  style,
  ...rest
}) => {
  const { focused, error, disabled, readOnly } = useInputContext();

  return (
    <div
      data-slot="wrapper"
      data-focused={focused ? "true" : "false"}
      data-error={error ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      data-readonly={readOnly ? "true" : "false"}
      className={cx(INPUT_WRAPPER_CLASS, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};

/* ─── Compound: Field ─── */

export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      onFocus,
      onBlur,
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) => {
    const { inputId, helperId, setFocused, disabled, readOnly, error, hasHelper } =
      useInputContext();

    return (
      <input
        ref={ref}
        id={inputId}
        data-slot="field"
        className={cx(INPUT_FIELD_CLASS, className)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={ariaInvalidProp ?? (error ? true : undefined)}
        aria-describedby={ariaDescribedByProp ?? (hasHelper ? helperId : undefined)}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setTimeout(() => setFocused(false), 150);
          onBlur?.(e);
        }}
        {...rest}
      />
    );
  },
);
InputField.displayName = "InputField";

/* ─── Compound: ClearButton ─── */

export type InputClearButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const InputClearButton: React.FC<InputClearButtonProps> = React.memo(
  ({ className, onClick, ...rest }) => (
    <button
      type="button"
      data-slot="clear"
      aria-label="입력 삭제"
      className={cx(INPUT_CLEAR_CLASS, className)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill={cv.border.default} /> {/* clear 버튼 원형 배경 */}
        <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  ),
);
InputClearButton.displayName = "InputClearButton";

/* ─── Compound: Helper ─── */

export interface InputHelperProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** true이면 에러 스타일 + role="alert" 적용 */
  error?: boolean;
  /** 도움/에러 메시지 텍스트 */
  children: React.ReactNode;
}

export const InputHelper: React.FC<InputHelperProps> = ({
  error,
  children,
  className,
  id: idProp,
  ...rest
}) => {
  const ctx = useContext(InputContext);
  const helperId = idProp ?? ctx?.helperId;

  React.useEffect(() => {
    ctx?.setHasHelper(true);
    return () => ctx?.setHasHelper(false);
  }, [ctx]);

  return (
    <span
      id={helperId}
      data-slot="helper"
      data-error={error ? "true" : "false"}
      className={cx(INPUT_HELPER_CLASS, className)}
      role={error ? "alert" : undefined}
      {...rest}
    >
      {children}
    </span>
  );
};

/* ─── Flat (convenience) API ─── */

export interface InputSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<InputRootProps, "children" | "error" | "disabled" | "readOnly" | "fullWidth">;
  /** 입력 래퍼 `<div>`에 전달할 추가 props */
  wrapper?: Omit<InputWrapperProps, "children">;
  /** `<label>`에 전달할 추가 props */
  label?: Omit<InputLabelProps, "children">;
  /** `<input>`에 전달할 추가 props */
  field?: Omit<InputFieldProps, never>;
  /** 클리어 `<button>`에 전달할 추가 props */
  clearButton?: InputClearButtonProps;
  /** 헬퍼 `<span>`에 전달할 추가 props */
  helper?: Omit<InputHelperProps, "children" | "error">;
}

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> {
  /** 라벨 텍스트 */
  label?: string;
  /** 도움 텍스트 */
  helperText?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 (helperText 대신 표시) */
  errorMessage?: string;
  /** 클리어 버튼 표시 여부 */
  clearable?: boolean;
  /** 클리어 시 콜백 */
  onClear?: () => void;
  /** 우측 addon (버튼 등) */
  suffix?: React.ReactNode;
  /** 좌측 addon (아이콘 등) */
  prefix?: React.ReactNode;
  /** 컴포넌트 너비 */
  fullWidth?: boolean;
  /** 입력 필드 높이 변형 */
  size?: InputSize;
  /** 슬롯 프롭 */
  slotProps?: InputSlotProps;
  /** 래퍼 클래스 */
  wrapperClassName?: string;
  /** 래퍼 스타일 */
  wrapperStyle?: React.CSSProperties;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      clearable = false,
      onClear,
      suffix,
      prefix,
      fullWidth = true,
      size = "default",
      className,
      style,
      wrapperClassName,
      wrapperStyle,
      slotProps,
      disabled = false,
      readOnly = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    const [internalValue, setInternalValue] = useState(defaultValue ?? "");

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue !== undefined && currentValue !== null;
    const showError = error || !!errorMessage;
    const displayHelper = showError ? errorMessage : helperText;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalValue(e.target.value);
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const handleClear = useCallback(() => {
      if (!isControlled) setInternalValue("");
      onClear?.();
      if (inputRef && "current" in inputRef) inputRef.current?.focus();
    }, [isControlled, onClear, inputRef]);

    return (
      <InputRoot
        error={showError}
        disabled={disabled}
        readOnly={readOnly}
        fullWidth={fullWidth}
        size={size}
        inputId={idProp}
        className={cx(slotProps?.root?.className, className)}
        style={{ ...slotProps?.root?.style, ...style }}
      >
        {label && (
          <InputLabel className={slotProps?.label?.className} style={slotProps?.label?.style}>
            {label}
          </InputLabel>
        )}

        <InputWrapper
          className={cx(slotProps?.wrapper?.className, wrapperClassName)}
          style={{ ...slotProps?.wrapper?.style, ...wrapperStyle }}
        >
          {prefix && (
            <span data-slot="prefix" className={INPUT_PREFIX_CLASS}>
              {prefix}
            </span>
          )}
          <InputField
            ref={inputRef}
            value={currentValue}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={slotProps?.field?.className}
            style={slotProps?.field?.style}
            {...rest}
          />
          {clearable && hasValue && !disabled && !readOnly && (
            <InputClearButton
              className={slotProps?.clearButton?.className}
              style={slotProps?.clearButton?.style}
              onClick={handleClear}
            />
          )}
          {suffix && (
            <span data-slot="suffix" className={INPUT_SUFFIX_CLASS}>
              {suffix}
            </span>
          )}
        </InputWrapper>

        {displayHelper && (
          <InputHelper
            error={showError}
            className={slotProps?.helper?.className}
            style={slotProps?.helper?.style}
          >
            {displayHelper}
          </InputHelper>
        )}
      </InputRoot>
    );
  },
);

InputComponent.displayName = "Input";

/* ─── Export: Flat + Compound ─── */

export const Input = Object.assign(InputComponent, {
  Root: InputRoot,
  Label: InputLabel,
  Wrapper: InputWrapper,
  Field: InputField,
  ClearButton: InputClearButton,
  Helper: InputHelper,
});
