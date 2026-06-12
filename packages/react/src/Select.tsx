import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";

import { type FieldWidth, resolveFieldWidth } from "./internal/fieldWidth.js";
import { addDismissableLayerListeners, WebPortal } from "./internal/web.js";

/* ─── Class names ─── */

const SELECT_CLASS = "nds-select";
const SELECT_ROOT_CLASS = `${SELECT_CLASS}__root`;
const SELECT_LABEL_CLASS = `${SELECT_CLASS}__label`;
const SELECT_TRIGGER_CLASS = `${SELECT_CLASS}__trigger`;
const SELECT_TRIGGER_TEXT_CLASS = `${SELECT_CLASS}__trigger-text`;
const SELECT_CHEVRON_CLASS = `${SELECT_CLASS}__chevron`;
const SELECT_DROPDOWN_CLASS = `${SELECT_CLASS}__dropdown`;
const SELECT_OPTION_CLASS = `${SELECT_CLASS}__option`;
const SELECT_OPTION_LABEL_CLASS = `${SELECT_CLASS}__option-label`;
const SELECT_OPTION_CHECK_CLASS = `${SELECT_CLASS}__option-check`;
const SELECT_HELPER_CLASS = `${SELECT_CLASS}__helper`;
const SELECT_SEARCH_CLASS = `${SELECT_CLASS}__search`;
const SELECT_EMPTY_CLASS = `${SELECT_CLASS}__empty`;

/**
 * auto(좁은) 셀렉트에서 드롭다운 메뉴가 가장 넓은 옵션까지 grow 할 때의 상한.
 * fullWidth 셀렉트는 트리거 폭으로 고정되므로 이 캡을 쓰지 않는다. 넘으면 옵션 말줄임.
 */
const SELECT_AUTO_MENU_MAX_WIDTH = 360;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const getEnabledOptionElements = (container: HTMLElement | null) =>
  Array.from(container?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).filter(
    (element) => element.getAttribute("aria-disabled") !== "true",
  );

const focusActiveOption = (container: HTMLElement | null, activeValue: string | null) => {
  if (!container || !activeValue) return;
  const option = container.querySelector<HTMLElement>(`[data-value="${CSS.escape(activeValue)}"]`);
  option?.focus();
};

const getOptionId = (selectId: string, value: string) =>
  `${selectId}-option-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

/* ─── Context ─── */

interface SelectContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string | undefined;
  onValueChange: (v: string) => void;
  activeOptionValue: string | null;
  setActiveOptionValue: React.Dispatch<React.SetStateAction<string | null>>;
  disabled: boolean;
  error: boolean;
  /** 트리거 100% 폭(폼/캐포비 기본). 드롭다운 메뉴 폭 전략 분기에 사용. */
  fullWidth: boolean;
  selectId: string;
  labelId: string;
  helperId: string;
  listboxId: string;
  hasLabel: boolean;
  hasHelper: boolean;
  setHasLabel: React.Dispatch<React.SetStateAction<boolean>>;
  setHasHelper: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  portalContainer?: HTMLElement | null;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

const useSelectContext = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select compound components must be used within Select.Root");
  return ctx;
};

/* ─── Compound: Root ─── */

export interface SelectRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 선택된 값 */
  value?: string;
  /** 값 변경 시 호출되는 콜백 */
  onValueChange: (value: string) => void;
  /** 선택 비활성화 */
  disabled?: boolean;
  /** 에러 상태 표시 */
  error?: boolean;
  /** 부모 너비에 맞춤 @default true */
  fullWidth?: boolean;
  /**
   * 입력 필드 가로 너비 6단계 스케일 (xs 120 / sm 200 / md 304 / lg 400 / xl 488 / full 100%).
   * 지정 시 `fullWidth` 보다 우선. Filter Dropdown 은 `sm`(200), 폼 내부는 `md`(304) 권장.
   */
  fieldWidth?: FieldWidth;
  /** 드롭다운이 렌더링될 포털 컨테이너 (미지정 시 document.body) */
  portalContainer?: HTMLElement | null;
  /** Root 내부 콘텐츠 (Label, Trigger, Dropdown, Helper 등) */
  children: React.ReactNode;
}

export const SelectRoot: React.FC<SelectRootProps> = ({
  value,
  onValueChange,
  disabled = false,
  error = false,
  fullWidth = true,
  fieldWidth,
  portalContainer,
  children,
  className,
  style,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [activeOptionValue, setActiveOptionValue] = useState<string | null>(null);
  const [hasLabel, setHasLabel] = useState(false);
  const [hasHelper, setHasHelper] = useState(false);
  const selectId = useId();
  const labelId = `${selectId}-label`;
  const helperId = `${selectId}-helper`;
  const listboxId = `${selectId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value,
        onValueChange,
        activeOptionValue,
        setActiveOptionValue,
        disabled,
        error,
        fullWidth,
        selectId,
        labelId,
        helperId,
        listboxId,
        hasLabel,
        hasHelper,
        setHasLabel,
        setHasHelper,
        triggerRef,
        portalContainer,
      }}
    >
      <div
        data-slot="root"
        className={cx(SELECT_ROOT_CLASS, className)}
        style={
          {
            "--nds-select-width": resolveFieldWidth(fieldWidth) ?? (fullWidth ? "100%" : "auto"),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
};

/* ─── Compound: Label ─── */

export interface SelectLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 라벨 텍스트 (자동으로 trigger와 htmlFor 연결) */
  children: React.ReactNode;
}

export const SelectLabel: React.FC<SelectLabelProps> = ({ children, className, ...rest }) => {
  const { selectId, labelId, setHasLabel } = useSelectContext();

  useEffect(() => {
    setHasLabel(true);
    return () => setHasLabel(false);
  }, [setHasLabel]);

  return (
    <label
      htmlFor={selectId}
      id={labelId}
      data-slot="label"
      className={cx(SELECT_LABEL_CLASS, className)}
      {...rest}
    >
      {children}
    </label>
  );
};

/* ─── Compound: Trigger ─── */

export interface SelectTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** 값이 없을 때 표시할 텍스트 @default "선택" */
  placeholder?: string;
  /** 커스텀 트리거 콘텐츠 (미지정 시 선택된 값 또는 placeholder 표시) */
  children?: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  placeholder = "선택",
  children,
  className,
  ...rest
}) => {
  const {
    open,
    setOpen,
    value,
    activeOptionValue,
    setActiveOptionValue,
    disabled,
    error,
    selectId,
    labelId,
    helperId,
    listboxId,
    hasLabel,
    hasHelper,
    triggerRef,
  } = useSelectContext();
  const hasValue = value !== undefined && value !== "";
  const triggerTextId = `${selectId}-value`;

  return (
    <button
      ref={triggerRef}
      type="button"
      id={selectId}
      data-slot="trigger"
      data-open={open ? "true" : "false"}
      data-has-value={hasValue ? "true" : "false"}
      data-error={error ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      className={cx(SELECT_TRIGGER_CLASS, className)}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listboxId : undefined}
      aria-labelledby={hasLabel ? `${labelId} ${triggerTextId}` : undefined}
      aria-describedby={hasHelper ? helperId : undefined}
      aria-invalid={error || undefined}
      aria-disabled={disabled || undefined}
      aria-activedescendant={
        open && activeOptionValue ? getOptionId(selectId, activeOptionValue) : undefined
      }
      onClick={() => !disabled && setOpen(!open)}
      onKeyDown={(event) => {
        if (disabled) return;
        if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
          event.preventDefault();
          setOpen(true);
          setActiveOptionValue(value ?? null);
          return;
        }
        if ((event.key === "Enter" || event.key === " ") && !open) {
          event.preventDefault();
          setOpen(true);
          setActiveOptionValue(value ?? null);
          return;
        }
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
        }
      }}
      {...rest}
    >
      <span
        id={triggerTextId}
        data-placeholder={!hasValue ? "true" : "false"}
        className={SELECT_TRIGGER_TEXT_CLASS}
      >
        {children ?? (hasValue ? value : placeholder)}
      </span>
      <span data-open={open ? "true" : "false"} className={SELECT_CHEVRON_CLASS} aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
};

/* ─── Compound: Dropdown ─── */

export interface SelectDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 드롭다운 옵션 목록 (Option 컴포넌트들) */
  children: React.ReactNode;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  children,
  className,
  style,
  ...rest
}) => {
  const {
    open,
    setOpen,
    value,
    activeOptionValue,
    setActiveOptionValue,
    triggerRef,
    portalContainer,
    listboxId,
    selectId,
    fullWidth,
  } = useSelectContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });

    return addDismissableLayerListeners({
      contentEl: dropdownRef.current,
      triggerEl: triggerRef.current,
      onDismiss: () => setOpen(false),
    });
  }, [open, setOpen, triggerRef]);

  useEffect(() => {
    if (!open || !dropdownRef.current) return;

    // 검색형(searchable): 드롭다운 상단 검색 인풋이 있으면 거기로 포커스를 주고,
    // 초기 active option 은 설정하지 않는다(사용자가 타이핑 후 ArrowDown 으로 리스트에 진입).
    const searchInput = dropdownRef.current.querySelector<HTMLInputElement>(
      'input[data-slot="search-input"]',
    );
    if (searchInput) {
      searchInput.focus();
      return;
    }

    const enabledOptions = getEnabledOptionElements(dropdownRef.current);
    const selectedOption =
      (value &&
        dropdownRef.current.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`)) ||
      null;
    const initialOption =
      selectedOption?.getAttribute("aria-disabled") !== "true"
        ? selectedOption
        : (enabledOptions[0] ?? null);

    const nextValue = initialOption?.dataset.value ?? null;
    setActiveOptionValue((current) => current ?? nextValue);
    dropdownRef.current.focus();
  }, [open, value, setActiveOptionValue]);

  useEffect(() => {
    if (!open) {
      setActiveOptionValue(null);
      return;
    }

    focusActiveOption(dropdownRef.current, activeOptionValue);
  }, [open, activeOptionValue, setActiveOptionValue]);

  if (!open) return null;

  return (
    <WebPortal container={portalContainer}>
      <div
        ref={dropdownRef}
        id={listboxId}
        data-slot="dropdown"
        role="listbox"
        aria-labelledby={selectId}
        tabIndex={-1}
        className={cx(SELECT_DROPDOWN_CLASS, className)}
        style={{
          top: position.top,
          left: position.left,
          // 메뉴 폭: 항상 트리거 폭 이상(min-width). fullWidth 면 트리거 폭으로 고정
          // (max-width=트리거폭), auto 면 가장 넓은 옵션까지 grow 후 캡(말줄임).
          minWidth: position.width,
          width: "max-content",
          maxWidth: fullWidth ? position.width : SELECT_AUTO_MENU_MAX_WIDTH,
          ...style,
        }}
        onKeyDown={(event) => {
          // Escape 는 옵션 유무와 무관하게 항상 닫는다(검색형에서 결과 0건일 때도).
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
            return;
          }

          // 검색형: 포커스가 검색 인풋에 있으면 Space/Home/End 는 텍스트 편집용으로 흘려보낸다.
          // (Arrow = 리스트 탐색, Enter = 활성/첫 매치 선택 은 검색 중에도 유효)
          const typingInSearch = (event.target as HTMLElement).tagName === "INPUT";

          const enabledOptions = getEnabledOptionElements(dropdownRef.current);
          if (enabledOptions.length === 0) return;

          const activeIndex = enabledOptions.findIndex(
            (element) => element.dataset.value === activeOptionValue,
          );

          if (event.key === "ArrowDown") {
            event.preventDefault();
            const nextOption = enabledOptions[Math.min(activeIndex + 1, enabledOptions.length - 1)];
            setActiveOptionValue(nextOption?.dataset.value ?? null);
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            const previousOption = enabledOptions[Math.max(activeIndex - 1, 0)];
            setActiveOptionValue(previousOption?.dataset.value ?? null);
            return;
          }

          if (event.key === "Home" && !typingInSearch) {
            event.preventDefault();
            setActiveOptionValue(enabledOptions[0]?.dataset.value ?? null);
            return;
          }

          if (event.key === "End" && !typingInSearch) {
            event.preventDefault();
            setActiveOptionValue(enabledOptions[enabledOptions.length - 1]?.dataset.value ?? null);
            return;
          }

          if (event.key === " " && typingInSearch) {
            // 검색어에 공백 입력 — 선택으로 가로채지 않는다.
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const targetOption =
              enabledOptions[Math.max(activeIndex, 0)] ?? enabledOptions[0] ?? null;
            targetOption?.click();
            triggerRef.current?.focus();
            return;
          }
        }}
        {...rest}
      >
        {children}
      </div>
    </WebPortal>
  );
};

/* ─── Compound: Option ─── */

export interface SelectOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이 옵션의 고유 값 */
  value: string;
  /** 옵션 비활성화 */
  disabled?: boolean;
  /** 옵션 라벨 콘텐츠 */
  children: React.ReactNode;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  value: optionValue,
  disabled: optionDisabled = false,
  children,
  className,
  onClick,
  ...rest
}) => {
  const { value, onValueChange, setOpen, activeOptionValue, setActiveOptionValue, selectId } =
    useSelectContext();
  const isSelected = value === optionValue;
  const isActive = activeOptionValue === optionValue;

  return (
    <div
      id={getOptionId(selectId, optionValue)}
      data-slot="option"
      data-value={optionValue}
      data-selected={isSelected ? "true" : "false"}
      data-disabled={optionDisabled ? "true" : "false"}
      data-active={isActive ? "true" : "false"}
      role="option"
      aria-selected={isSelected}
      aria-disabled={optionDisabled || undefined}
      tabIndex={isActive ? 0 : -1}
      className={cx(SELECT_OPTION_CLASS, className)}
      onMouseEnter={() => {
        if (!optionDisabled) {
          setActiveOptionValue(optionValue);
        }
      }}
      onClick={(e) => {
        if (optionDisabled) return;
        onValueChange(optionValue);
        setOpen(false);
        setActiveOptionValue(optionValue);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className={SELECT_OPTION_LABEL_CLASS}>{children}</span>
      <span className={SELECT_OPTION_CHECK_CLASS} aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.5 8.5L6.5 11.5L12.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
};

/* ─── Compound: Helper ─── */

export interface SelectHelperProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** true이면 에러 스타일 적용 */
  error?: boolean;
  /** 도움/에러 메시지 텍스트 */
  children: React.ReactNode;
}

export const SelectHelper: React.FC<SelectHelperProps> = ({
  error,
  children,
  className,
  ...rest
}) => {
  const { helperId, setHasHelper } = useSelectContext();

  useEffect(() => {
    setHasHelper(true);
    return () => setHasHelper(false);
  }, [setHasHelper]);

  return (
    <span
      id={helperId}
      data-slot="helper"
      data-error={error ? "true" : "false"}
      className={cx(SELECT_HELPER_CLASS, className)}
      {...rest}
    >
      {children}
    </span>
  );
};

/* ─── Internal: searchable dropdown content ───
 * 드롭다운(open 일 때만 마운트) 안에 검색 인풋 + 필터된 옵션 + 빈 상태를 렌더한다.
 * query 상태를 이 컴포넌트가 소유하므로 드롭다운이 닫히며 언마운트되면 자동 리셋된다.
 * 자유 입력 자동완성(Autocomplete)과 달리 값은 항상 options 중에서만 선택된다.
 */
interface SelectSearchableContentProps {
  options: SelectItem[];
  searchPlaceholder: string;
  emptyMessage: React.ReactNode;
  optionClassName?: string;
  optionStyle?: React.CSSProperties;
}

const SelectSearchableContent: React.FC<SelectSearchableContentProps> = ({
  options,
  searchPlaceholder,
  emptyMessage,
  optionClassName,
  optionStyle,
}) => {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((opt) => opt.label.toLowerCase().includes(q)) : options;

  return (
    <>
      <div data-slot="search" className={SELECT_SEARCH_CLASS}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          data-slot="search-input"
          value={query}
          placeholder={searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
      </div>
      {filtered.length === 0 ? (
        <div data-slot="empty" className={SELECT_EMPTY_CLASS}>
          {emptyMessage}
        </div>
      ) : (
        filtered.map((opt) => (
          <SelectOption
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className={optionClassName}
            style={optionStyle}
          >
            {opt.label}
          </SelectOption>
        ))
      )}
    </>
  );
};

/* ─── Flat API ─── */

export interface SelectItem {
  /** 옵션의 고유 값 */
  value: string;
  /** 화면에 표시할 라벨 */
  label: string;
  /** 옵션 비활성화 */
  disabled?: boolean;
}

export interface SelectSlotProps {
  /** 루트 `<div>`에 전달할 추가 props */
  root?: Omit<
    SelectRootProps,
    "children" | "value" | "onValueChange" | "disabled" | "error" | "portalContainer"
  >;
  /** `<label>`에 전달할 추가 props */
  label?: Omit<SelectLabelProps, "children">;
  /** 트리거 `<button>`에 전달할 추가 props */
  trigger?: Omit<SelectTriggerProps, "placeholder" | "children">;
  /** 드롭다운 `<div>`에 전달할 추가 props */
  dropdown?: Omit<SelectDropdownProps, "children">;
  /** 각 옵션 `<div>`에 공통으로 전달할 추가 props */
  option?: Omit<SelectOptionProps, "value" | "children" | "disabled">;
  /** 헬퍼 `<span>`에 전달할 추가 props */
  helper?: Omit<SelectHelperProps, "children" | "error">;
}

export interface SelectProps {
  /** 옵션 목록 */
  options: SelectItem[];
  /** 선택된 값 */
  value?: string;
  /** 값 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 라벨 텍스트 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 도움 텍스트 */
  helperText?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /**
   * 입력 필드 가로 너비 6단계 스케일 (xs 120 / sm 200 / md 304 / lg 400 / xl 488 / full 100%).
   * 지정 시 `fullWidth` 보다 우선. Filter Dropdown 은 `sm`(200), 폼 내부는 `md`(304) 권장.
   */
  fieldWidth?: FieldWidth;
  /**
   * 드롭다운 상단에 검색 인풋을 노출해 옵션을 label 로 필터(Ant `showSearch` 모델).
   * 값은 여전히 options 중에서만 선택된다 — 자유 입력이 필요하면 Autocomplete 사용.
   * 옵션이 많을 때(대략 10개 초과) 권장.
   */
  searchable?: boolean;
  /** 검색 인풋 placeholder @default "검색" (searchable 일 때만) */
  searchPlaceholder?: string;
  /** 검색 결과 0건 메시지 @default "검색 결과가 없어요" (searchable 일 때만). html `empty-message` 는 문자열만. */
  emptyMessage?: React.ReactNode;
  /** 드롭다운 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 슬롯 프롭 */
  slotProps?: SelectSlotProps;
}

const SelectComponent: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  label,
  placeholder = "선택",
  helperText,
  error = false,
  errorMessage,
  disabled = false,
  fullWidth = true,
  fieldWidth,
  searchable = false,
  searchPlaceholder = "검색",
  emptyMessage = "검색 결과가 없어요",
  portalContainer,
  className,
  style,
  slotProps,
}) => {
  const showError = error || !!errorMessage;
  const displayHelper = showError ? errorMessage : helperText;
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <SelectRoot
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      error={showError}
      fullWidth={fullWidth}
      fieldWidth={fieldWidth}
      portalContainer={portalContainer}
      className={cx(slotProps?.root?.className, className)}
      style={{ ...slotProps?.root?.style, ...style }}
    >
      {label && (
        <SelectLabel className={slotProps?.label?.className} style={slotProps?.label?.style}>
          {label}
        </SelectLabel>
      )}
      <SelectTrigger
        placeholder={placeholder}
        className={slotProps?.trigger?.className}
        style={slotProps?.trigger?.style}
      >
        {selectedLabel}
      </SelectTrigger>
      <SelectDropdown className={slotProps?.dropdown?.className} style={slotProps?.dropdown?.style}>
        {searchable ? (
          <SelectSearchableContent
            options={options}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            optionClassName={slotProps?.option?.className}
            optionStyle={slotProps?.option?.style}
          />
        ) : (
          options.map((opt) => (
            <SelectOption
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className={slotProps?.option?.className}
              style={slotProps?.option?.style}
            >
              {opt.label}
            </SelectOption>
          ))
        )}
      </SelectDropdown>
      {displayHelper && (
        <SelectHelper
          error={showError}
          className={slotProps?.helper?.className}
          style={slotProps?.helper?.style}
        >
          {displayHelper}
        </SelectHelper>
      )}
    </SelectRoot>
  );
};

SelectComponent.displayName = "Select";

/* ─── Export: Flat + Compound ─── */

export const Select = Object.assign(SelectComponent, {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Dropdown: SelectDropdown,
  Option: SelectOption,
  Helper: SelectHelper,
});
