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

const SEARCH_CLASS = "nds-search-input";
const SEARCH_ROOT_CLASS = `${SEARCH_CLASS}__root`;
const SEARCH_LABEL_CLASS = `${SEARCH_CLASS}__label`;
const SEARCH_WRAPPER_CLASS = `${SEARCH_CLASS}__wrapper`;
const SEARCH_FIELD_CLASS = `${SEARCH_CLASS}__field`;
const SEARCH_CLEAR_CLASS = `${SEARCH_CLASS}__clear`;
const SEARCH_BUTTON_CLASS = `${SEARCH_CLASS}__button`;
const SEARCH_HELPER_CLASS = `${SEARCH_CLASS}__helper`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const searchInputStyles = `
  :where(.${SEARCH_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-search-input-label-gap, var(--gap-comfortable));
    width: var(--nds-search-input-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SEARCH_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${SEARCH_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--nds-search-input-height, 48px);
    padding: 0 var(--inset-card);
    border: 1px solid var(--nds-search-input-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-search-input-radius, ${radius.md}px);
    background: var(--nds-search-input-background, ${cv.surface.default});
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-variant="filled"]) {
    border-color: transparent;
    background: var(--nds-search-input-background, ${cv.surface.section});
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-variant="filled"][data-focused="true"]) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${SEARCH_FIELD_CLASS}) {
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
  }

  :where(.${SEARCH_FIELD_CLASS}::placeholder) {
    color: ${cv.textRole.muted};
  }

  :where(.${SEARCH_FIELD_CLASS}[type="search"]) {
    appearance: none;
    -webkit-appearance: none;
  }

  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-decoration),
  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-cancel-button),
  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-results-button),
  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-results-decoration) {
    appearance: none;
    -webkit-appearance: none;
  }

  :where(.${SEARCH_CLEAR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: ${spacing[8]}px;
    color: ${cv.iconRole.normal};
    line-height: 1;
  }

  :where(.${SEARCH_CLEAR_CLASS} svg) {
    width: ${sizing.icon.sm}px;
    height: ${sizing.icon.sm}px;
  }

  :where(.${SEARCH_BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: ${spacing[8]}px;
    color: ${cv.iconRole.strong};
    line-height: 1;
  }

  :where(.${SEARCH_BUTTON_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  :where(.${SEARCH_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  :where(.${SEARCH_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

interface SearchInputContextValue {
  inputId: string;
  helperId: string;
  hasHelper: boolean;
  setHasHelper: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchInputContext = createContext<SearchInputContextValue | undefined>(undefined);

const useSearchInputContext = () => {
  const context = useContext(SearchInputContext);
  if (!context) {
    throw new Error("SearchInput compound components must be used within SearchInput.Root");
  }
  return context;
};

/* ─── Compound: Root ─── */

export type SearchInputVariant = "outlined" | "filled";

export interface SearchInputRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 부모 너비에 맞춤 @default true */
  fullWidth?: boolean;
  /** 외부에서 주입할 input ID (미지정 시 자동 생성) */
  inputId?: string;
  /** Root 내부 콘텐츠 (Label, Wrapper, Helper 등) */
  children: React.ReactNode;
}

export const SearchInputRoot: React.FC<SearchInputRootProps> = ({
  fullWidth = true,
  inputId: inputIdProp,
  children,
  className,
  style,
  ...rest
}) => {
  const generatedInputId = useId();
  const inputId = inputIdProp ?? generatedInputId;
  const helperId = `${inputId}-helper`;
  const [hasHelper, setHasHelper] = useState(false);

  return (
    <SearchInputContext.Provider value={{ inputId, helperId, hasHelper, setHasHelper }}>
      <div
        data-slot="root"
        className={cx(SEARCH_ROOT_CLASS, className)}
        style={
          {
            "--nds-search-input-width": fullWidth ? "100%" : "auto",
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </SearchInputContext.Provider>
  );
};

export interface SearchInputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 라벨 텍스트 (자동으로 input과 htmlFor 연결) */
  children: React.ReactNode;
}

export const SearchInputLabel: React.FC<SearchInputLabelProps> = ({
  children,
  className,
  ...rest
}) => {
  const { inputId } = useSearchInputContext();

  return (
    <label
      htmlFor={inputId}
      data-slot="label"
      className={cx(SEARCH_LABEL_CLASS, className)}
      {...rest}
    >
      {children}
    </label>
  );
};

/* ─── Compound: Wrapper ─── */

export interface SearchInputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 포커스 상태 (스타일링에 사용) */
  focused?: boolean;
  /** 스타일 변형 @default "outlined" */
  variant?: SearchInputVariant;
  /** 입력 필드와 부가 요소 (ClearButton, SearchButton 등) */
  children: React.ReactNode;
}

export const SearchInputWrapper: React.FC<SearchInputWrapperProps> = React.memo(
  ({ focused = false, variant = "outlined", children, className, style, ...rest }) => (
    <div
      data-slot="wrapper"
      data-focused={focused ? "true" : "false"}
      data-variant={variant}
      className={cx(SEARCH_WRAPPER_CLASS, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  ),
);
SearchInputWrapper.displayName = "SearchInputWrapper";

/* ─── Compound: Field ─── */

export type SearchInputFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export const SearchInputField = React.forwardRef<HTMLInputElement, SearchInputFieldProps>(
  (
    {
      className,
      role,
      type: _type,
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) => {
    const { inputId, helperId, hasHelper } = useSearchInputContext();

    return (
      <input
        ref={ref}
        id={inputId}
        type="text"
        role={role ?? "searchbox"}
        data-slot="field"
        className={cx(SEARCH_FIELD_CLASS, className)}
        aria-invalid={ariaInvalidProp}
        aria-describedby={ariaDescribedByProp ?? (hasHelper ? helperId : undefined)}
        {...rest}
      />
    );
  },
);
SearchInputField.displayName = "SearchInputField";

/* ─── Compound: ClearButton ─── */

export type SearchInputClearButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SearchInputClearButton: React.FC<SearchInputClearButtonProps> = React.memo(
  ({ className, onClick, ...rest }) => (
    <button
      type="button"
      data-slot="clear"
      aria-label="검색어 지우기"
      className={cx(SEARCH_CLEAR_CLASS, className)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill={cv.borderRole.normal} />
        <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  ),
);
SearchInputClearButton.displayName = "SearchInputClearButton";

/* ─── Compound: SearchButton ─── */

export type SearchInputSearchButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SearchInputSearchButton: React.FC<SearchInputSearchButtonProps> = React.memo(
  ({ className, ...rest }) => (
    <button
      type="button"
      data-slot="search-button"
      aria-label="검색"
      className={cx(SEARCH_BUTTON_CLASS, className)}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  ),
);
SearchInputSearchButton.displayName = "SearchInputSearchButton";

export interface SearchInputHelperProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** true이면 에러 스타일 + role="alert" 적용 */
  error?: boolean;
  /** 도움/에러 메시지 텍스트 */
  children: React.ReactNode;
}

export const SearchInputHelper: React.FC<SearchInputHelperProps> = ({
  error,
  children,
  className,
  id: idProp,
  ...rest
}) => {
  const { helperId, setHasHelper } = useSearchInputContext();

  React.useEffect(() => {
    setHasHelper(true);
    return () => setHasHelper(false);
  }, [setHasHelper]);

  return (
    <span
      id={idProp ?? helperId}
      data-slot="helper"
      data-error={error ? "true" : "false"}
      className={cx(SEARCH_HELPER_CLASS, className)}
      role={error ? "alert" : undefined}
      {...rest}
    >
      {children}
    </span>
  );
};

/* ─── Flat API ─── */

export interface SearchInputSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<SearchInputRootProps, "children" | "fullWidth" | "inputId">;
  /** `<label>`에 전달할 추가 props */
  label?: Omit<SearchInputLabelProps, "children">;
  /** 입력 래퍼 `<div>`에 전달할 추가 props */
  wrapper?: Omit<SearchInputWrapperProps, "children" | "focused" | "variant">;
  /** `<input>`에 전달할 추가 props */
  field?: Omit<SearchInputFieldProps, never>;
  /** 클리어 `<button>`에 전달할 추가 props */
  clearButton?: SearchInputClearButtonProps;
  /** 검색 `<button>`에 전달할 추가 props */
  searchButton?: SearchInputSearchButtonProps;
  /** 헬퍼 `<span>`에 전달할 추가 props */
  helper?: Omit<SearchInputHelperProps, "children" | "error">;
}

export interface SearchInputProps extends Omit<
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
  /** 스타일 변형 */
  variant?: SearchInputVariant;
  /** 클리어 버튼 자동 표시 (값이 있을 때) */
  clearable?: boolean;
  /** 클리어 시 콜백 */
  onClear?: () => void;
  /** 검색 버튼 표시 */
  showSearchButton?: boolean;
  /** 검색 버튼 클릭 콜백 */
  onSearch?: () => void;
  /** 검색 아이콘을 커스텀 노드로 대체 */
  searchIcon?: React.ReactNode;
  /** 컴포넌트 너비 */
  fullWidth?: boolean;
  /** 슬롯 프롭 */
  slotProps?: SearchInputSlotProps;
}

const SearchInputComponent = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      variant = "outlined",
      label,
      helperText,
      error = false,
      errorMessage,
      clearable = true,
      onClear,
      showSearchButton = true,
      onSearch,
      searchIcon,
      fullWidth = true,
      className,
      style,
      slotProps,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [focused, setFocused] = useState(false);

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

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          onSearch?.();
        }
        onKeyDown?.(e);
      },
      [onSearch, onKeyDown],
    );

    return (
      <SearchInputRoot
        fullWidth={fullWidth}
        inputId={idProp}
        className={cx(slotProps?.root?.className, className)}
        style={{ ...slotProps?.root?.style, ...style }}
      >
        {label && (
          <SearchInputLabel className={slotProps?.label?.className} style={slotProps?.label?.style}>
            {label}
          </SearchInputLabel>
        )}
        <SearchInputWrapper
          focused={focused}
          variant={variant}
          className={slotProps?.wrapper?.className}
          style={slotProps?.wrapper?.style}
        >
          <SearchInputField
            ref={inputRef}
            value={currentValue}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setTimeout(() => setFocused(false), 150);
              onBlur?.(e);
            }}
            onKeyDown={handleKeyDown}
            className={slotProps?.field?.className}
            style={slotProps?.field?.style}
            aria-invalid={showError ? true : undefined}
            {...rest}
          />
          {clearable && hasValue && (
            <SearchInputClearButton
              className={slotProps?.clearButton?.className}
              style={slotProps?.clearButton?.style}
              onClick={handleClear}
            />
          )}
          {showSearchButton &&
            (searchIcon ? (
              <button
                type="button"
                data-slot="search-button"
                aria-label="검색"
                className={cx(SEARCH_BUTTON_CLASS, slotProps?.searchButton?.className)}
                style={slotProps?.searchButton?.style}
                onClick={onSearch}
              >
                {searchIcon}
              </button>
            ) : (
              <SearchInputSearchButton
                className={slotProps?.searchButton?.className}
                style={slotProps?.searchButton?.style}
                onClick={onSearch}
              />
            ))}
        </SearchInputWrapper>
        {displayHelper && (
          <SearchInputHelper
            error={showError}
            className={slotProps?.helper?.className}
            style={slotProps?.helper?.style}
          >
            {displayHelper}
          </SearchInputHelper>
        )}
      </SearchInputRoot>
    );
  },
);

SearchInputComponent.displayName = "SearchInput";

/* ─── Export: Flat + Compound ─── */

export const SearchInput = Object.assign(SearchInputComponent, {
  Root: SearchInputRoot,
  Label: SearchInputLabel,
  Wrapper: SearchInputWrapper,
  Field: SearchInputField,
  ClearButton: SearchInputClearButton,
  SearchButton: SearchInputSearchButton,
  Helper: SearchInputHelper,
});
