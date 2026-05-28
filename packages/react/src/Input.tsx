import React, { createContext, useCallback, useContext, useId, useRef, useState } from "react";
import { cv, sizing, spacing } from "@nudge-design/tokens";

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
const INPUT_HELPER_GROUP_CLASS = `${INPUT_CLASS}__helper-group`;

export type InputSize = "default" | "field" | "compact";

/* Figma 실측 (171:9903)
 *   label ↔ wrapper gap : 12px
 *   wrapper ↔ helper gap: 8px (disabled=12)
 *   helper(items) gap   : 12px (HelpText 1 ↔ HelpText 2)
 *   wrapper text↔icon gap: 10px
 *
 * compact: CashwalkBiz admin TextField (Figma 3082:846) — height 40, padding 12.
 *   FormField.labelPosition="left" 와 짝으로 가장 자주 쓰임.
 */
const inputSizeConfig = {
  default: {
    height: sizing.input.default,
    paddingX: undefined,
    labelGap: spacing[12],
    helperGap: spacing[8],
  },
  field: {
    height: sizing.input.field,
    paddingX: undefined,
    labelGap: spacing[8],
    helperGap: spacing[8],
  },
  compact: {
    height: sizing.input.compact,
    paddingX: spacing[12],
    labelGap: spacing[6],
    helperGap: spacing[6],
  },
} as const;
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
  complete: boolean;
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
  /** 입력 완료 상태 (검증 통과 시 시각적 표시용) */
  complete?: boolean;
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
  complete = false,
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
        complete,
        hasHelper,
        setHasHelper,
      }}
    >
      <div
        data-slot="root"
        data-size={size}
        data-disabled={disabled ? "true" : "false"}
        data-error={error ? "true" : "false"}
        style={
          {
            "--nds-input-width": fullWidth ? "100%" : "auto",
            "--nds-input-height": `${sizeStyle.height}px`,
            "--nds-input-label-gap": `${sizeStyle.labelGap}px`,
            "--nds-input-helper-gap": `${sizeStyle.helperGap}px`,
            ...(sizeStyle.paddingX !== undefined && {
              "--nds-input-padding-x": `${sizeStyle.paddingX}px`,
            }),
            ...style,
          } as React.CSSProperties
        }
        className={cx(INPUT_ROOT_CLASS, className)}
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
  const { focused, error, disabled, readOnly, complete } = useInputContext();

  return (
    <div
      data-slot="wrapper"
      data-focused={focused ? "true" : "false"}
      data-error={error ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      data-readonly={readOnly ? "true" : "false"}
      data-complete={complete ? "true" : "false"}
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
        <circle cx="12" cy="12" r="10" fill={cv.borderRole.normal} /> {/* clear 버튼 원형 배경 */}
        <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  ),
);
InputClearButton.displayName = "InputClearButton";

/* ─── Compound: HelperGroup ─── */

export interface InputHelperGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 여러 `InputHelper` 를 row 로 배치. 폭이 좁아지면 wrap */
  children: React.ReactNode;
}

/**
 * Figma 명세상 HelpText 가 2개 이상 row 로 노출되는 경우(예: 비밀번호 규칙 체크리스트)에 사용.
 * 단일 helper 면 그냥 `InputHelper` 를 직접 쓰면 됨.
 */
export const InputHelperGroup: React.FC<InputHelperGroupProps> = ({
  children,
  className,
  ...rest
}) => {
  const ctx = useContext(InputContext);
  React.useEffect(() => {
    ctx?.setHasHelper(true);
    return () => ctx?.setHasHelper(false);
  }, [ctx]);
  return (
    <div data-slot="helper-group" className={cx(INPUT_HELPER_GROUP_CLASS, className)} {...rest}>
      {children}
    </div>
  );
};

/* ─── Compound: Helper ─── */

export type InputHelperVariant = "default" | "success" | "error" | "disabled";

export interface InputHelperProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** true이면 에러 스타일 + role="alert" 적용 (`variant="error"`와 동일) */
  error?: boolean;
  /** 헬퍼 텍스트 색상 변형 @default "default" */
  variant?: InputHelperVariant;
  /** 텍스트 앞에 표시할 16x16 아이콘 */
  icon?: React.ReactNode;
  /** 도움/에러 메시지 텍스트 */
  children: React.ReactNode;
}

export const InputHelper: React.FC<InputHelperProps> = ({
  error,
  variant,
  icon,
  children,
  className,
  id: idProp,
  ...rest
}) => {
  const ctx = useContext(InputContext);
  const helperId = idProp ?? ctx?.helperId;
  const resolvedVariant: InputHelperVariant = variant ?? (error ? "error" : "default");
  const isError = resolvedVariant === "error";

  React.useEffect(() => {
    ctx?.setHasHelper(true);
    return () => ctx?.setHasHelper(false);
  }, [ctx]);

  return (
    <span
      id={helperId}
      data-slot="helper"
      data-variant={resolvedVariant}
      className={cx(INPUT_HELPER_CLASS, className)}
      role={isError ? "alert" : undefined}
      {...rest}
    >
      {icon && (
        <span data-slot="helper-icon" className={`${INPUT_HELPER_CLASS}__icon`}>
          {icon}
        </span>
      )}
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

export interface InputHelperItem {
  /** 표시할 텍스트 (React 노드 가능) */
  text: React.ReactNode;
  /** 16x16 아이콘 (variant 색상을 따라감) */
  icon?: React.ReactNode;
  /** 항목별 색상 변형 — 미지정 시 default */
  variant?: InputHelperVariant;
  /** 고유 key (없으면 index 기반) */
  key?: React.Key;
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
  /** 입력 완료(검증 통과) 상태 */
  complete?: boolean;
  /** 성공 메시지 (helperText 대신 표시, primary 색상) */
  successMessage?: string;
  /**
   * 여러 헬퍼 항목을 row 로 노출 (Figma multi-helper 패턴).
   * errorMessage/successMessage 가 우선이며, 둘 다 없을 때 적용된다.
   */
  helpers?: InputHelperItem[];
  /** helper 텍스트 앞에 표시할 16x16 아이콘 */
  helperIcon?: React.ReactNode;
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
      complete = false,
      successMessage,
      helpers,
      helperIcon,
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
    const showSuccess = !showError && (complete || !!successMessage);
    // 단일 헬퍼 우선순위: errorMessage > successMessage > helperText
    // helpers(배열) 는 위 3개가 모두 없을 때만 그룹으로 노출
    const singleHelper = showError
      ? (errorMessage ?? helperText)
      : showSuccess
        ? (successMessage ?? helperText)
        : helperText;
    const showHelperGroup = !singleHelper && Array.isArray(helpers) && helpers.length > 0;
    const helperVariant: InputHelperVariant = showError
      ? "error"
      : showSuccess
        ? "success"
        : "default";

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
        complete={showSuccess}
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

        {singleHelper && (
          <InputHelper
            variant={helperVariant}
            icon={helperIcon}
            className={slotProps?.helper?.className}
            style={slotProps?.helper?.style}
          >
            {singleHelper}
          </InputHelper>
        )}
        {showHelperGroup && (
          <InputHelperGroup>
            {helpers!.map((h, i) => (
              <InputHelper
                key={h.key ?? i}
                variant={h.variant ?? "default"}
                icon={h.icon ?? helperIcon}
              >
                {h.text}
              </InputHelper>
            ))}
          </InputHelperGroup>
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
  HelperGroup: InputHelperGroup,
});
