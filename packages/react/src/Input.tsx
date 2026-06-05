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
const INPUT_PASSWORD_TOGGLE_CLASS = `${INPUT_CLASS}__password-toggle`;
const INPUT_HELPER_CLASS = `${INPUT_CLASS}__helper`;
const INPUT_HELPER_GROUP_CLASS = `${INPUT_CLASS}__helper-group`;
const INPUT_COUNT_CLASS = `${INPUT_CLASS}__count`;

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
            // size="default" 는 inline 높이 생략 → 브랜드 :root override(캐포비 admin 40)가
            // cascade 로 이김. inline 으로 박으면 nds-select(40) 와 높이 어긋남(48 vs 40).
            ...(size !== "default" && {
              "--nds-input-height": `${sizeStyle.height}px`,
            }),
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

/* ─── Compound: PasswordToggle ─── */

export interface InputPasswordToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 현재 평문 노출 상태. true = 보임(eye-off 아이콘으로 "숨기기" 안내). */
  revealed: boolean;
}

/**
 * `type="password"` 입력의 표시/숨김 토글 버튼 — 우측 끝 눈 아이콘.
 * eye = 가려진 상태(누르면 보임), eye-off = 노출된 상태(누르면 숨김). 아이콘 path 는 DS eye/eye-off 와 동일.
 */
export const InputPasswordToggle: React.FC<InputPasswordToggleProps> = React.memo(
  ({ revealed, className, onClick, ...rest }) => (
    <button
      type="button"
      data-slot="password-toggle"
      aria-label={revealed ? "비밀번호 숨기기" : "비밀번호 표시"}
      aria-pressed={revealed}
      className={cx(INPUT_PASSWORD_TOGGLE_CLASS, className)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      {...rest}
    >
      {revealed ? (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g transform="translate(0 3)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.156796 8.93661C-0.0522653 9.29924 -0.0522653 9.74743 0.156796 10.1101C1.13231 11.8068 2.42448 13.2384 3.94195 14.3485L2.30912 15.9984C2.08973 16.2174 1.96625 16.516 1.96625 16.8276C1.96625 17.1392 2.08973 17.4378 2.30912 17.6568C2.76253 18.1144 3.49706 18.1144 3.95046 17.6568L19.4557 1.98908C20.48 0.900126 18.8557 -0.72313 17.7912 0.354086L15.6388 2.53121C9.77336 0.79921 3.16154 3.5654 0.156022 8.9374L0.156796 8.93661ZM20.0661 4.69033L16.4513 8.34286C16.5798 8.82005 16.6347 9.35201 16.5906 9.8605C16.4381 12.7057 13.5402 14.7944 10.8312 14.0207L8.35371 16.5241C14.2385 18.2271 20.8279 15.4977 23.8435 10.1101C24.0525 9.7502 24.0525 9.29647 23.8435 8.93661C22.8804 7.23356 21.5843 5.8403 20.0661 4.68955V4.69033ZM7.5485 10.7046L13.1693 5.02518C10.3187 4.21551 7.3503 6.52718 7.39443 9.52336C7.39443 9.93015 7.44863 10.3291 7.5485 10.7046Z"
              fill="currentColor"
            />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g transform="translate(0 4)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C17.4219 0 21.887 4.62766 23.6412 6.54255C24.1196 7.18085 24.1196 7.81915 23.6412 8.45745C21.887 10.3723 17.2625 15 12 15C6.57807 15 1.95349 10.5319 0.358804 8.45745C-0.119601 7.97872 -0.119601 7.18085 0.358804 6.70213C1.95349 4.62766 6.57807 0 12 0ZM6.7377 7.49999C6.7377 10.3723 9.12972 12.7659 12.0002 12.7659C14.8706 12.7659 17.2626 10.3723 17.2626 7.49999C17.2626 4.62765 14.8706 2.23403 12.0002 2.23403C9.12972 2.23403 6.7377 4.62765 6.7377 7.49999Z"
              fill="currentColor"
            />
            <ellipse cx="11.9997" cy="7.49997" rx="2.5515" ry="2.55319" fill="currentColor" />
          </g>
        </svg>
      )}
    </button>
  ),
);
InputPasswordToggle.displayName = "InputPasswordToggle";

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
  /**
   * `maxLength` 와 함께 우측에 "현재/최대" 글자수 카운터를 노출 (예: 24/25).
   * Figma 캐포비 캠페인 이름 입력(3782:19709) 정합. Textarea 의 카운터와 동일 톤.
   */
  showCount?: boolean;
  /**
   * `type="password"` 일 때 우측 눈 아이콘으로 표시/숨김 토글을 노출. **기본 자동 노출**.
   * `passwordToggle={false}` 로 끌 수 있다 (type 이 password 가 아니면 무시).
   */
  passwordToggle?: boolean;
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
      showCount = false,
      maxLength,
      passwordToggle,
      type,
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
    const [revealed, setRevealed] = useState(false);
    // type="password" 면 기본으로 눈 토글을 노출(passwordToggle={false} 로 끔). 노출 시 실제 type 을 토글.
    const showPasswordToggle = type === "password" && passwordToggle !== false;
    const fieldType = showPasswordToggle ? (revealed ? "text" : "password") : type;

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue !== undefined && currentValue !== null;
    const charCount = String(currentValue ?? "").length;
    const showCounter = showCount && typeof maxLength === "number";
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
            type={fieldType}
            value={currentValue}
            maxLength={maxLength}
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
          {showCounter && (
            <span
              data-slot="count"
              data-over={charCount > maxLength! ? "true" : "false"}
              className={INPUT_COUNT_CLASS}
            >
              {charCount}/{maxLength}
            </span>
          )}
          {showPasswordToggle && (
            <InputPasswordToggle
              revealed={revealed}
              disabled={disabled}
              onClick={() => setRevealed((v) => !v)}
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
