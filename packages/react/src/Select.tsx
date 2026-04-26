import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-eap/tokens";
import { addDismissableLayerListeners, WebPortal } from "./internal/web";

/* ─── Class names ─── */

const SELECT_CLASS = "nds-select";
const SELECT_ROOT_CLASS = `${SELECT_CLASS}__root`;
const SELECT_LABEL_CLASS = `${SELECT_CLASS}__label`;
const SELECT_TRIGGER_CLASS = `${SELECT_CLASS}__trigger`;
const SELECT_TRIGGER_TEXT_CLASS = `${SELECT_CLASS}__trigger-text`;
const SELECT_CHEVRON_CLASS = `${SELECT_CLASS}__chevron`;
const SELECT_DROPDOWN_CLASS = `${SELECT_CLASS}__dropdown`;
const SELECT_OPTION_CLASS = `${SELECT_CLASS}__option`;
const SELECT_HELPER_CLASS = `${SELECT_CLASS}__helper`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const selectStyles = `
  :where(.${SELECT_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-select-label-gap, ${spacing[12]}px);
    width: var(--nds-select-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SELECT_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.default};
  }

  :where(.${SELECT_TRIGGER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: var(--nds-select-height, ${sizing.input.default}px);
    padding: 0 ${spacing[12]}px;
    border: 1px solid var(--nds-select-border-color, ${cv.border.default});
    border-radius: var(--nds-select-radius, ${radius.md}px);
    background: var(--nds-select-background, ${cv.bg.white});
    cursor: pointer;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${SELECT_TRIGGER_CLASS}[data-open="true"]) {
    border-color: ${cv.border.focus};
  }

  :where(.${SELECT_TRIGGER_CLASS}[data-error="true"]) {
    border-color: ${cv.error.main};
  }

  :where(.${SELECT_TRIGGER_CLASS}[data-disabled="true"]) {
    background: ${cv.bg.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${SELECT_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    min-width: 0;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.default};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  :where(.${SELECT_TRIGGER_TEXT_CLASS}[data-placeholder="true"]) {
    color: ${cv.text.placeholder};
  }

  :where(.${SELECT_CHEVRON_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: ${spacing[4]}px;
    color: ${cv.icon.subtle};
    transition: transform ${transition.default};
  }

  :where(.${SELECT_CHEVRON_CLASS}[data-open="true"]) {
    transform: rotate(180deg);
  }

  :where(.${SELECT_CHEVRON_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${SELECT_DROPDOWN_CLASS}) {
    position: fixed;
    max-height: var(--nds-select-dropdown-max-height, 200px);
    overflow-y: auto;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow.md};
    z-index: ${zIndex.dropdown};
    box-sizing: border-box;
    animation: nds-select-fade-in ${transition.default};
  }

  :where(.${SELECT_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    padding: ${spacing[12]}px;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.default};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  :where(.${SELECT_OPTION_CLASS}:hover) {
    background: ${cv.bg.light};
  }

  :where(.${SELECT_OPTION_CLASS}[data-selected="true"]) {
    color: ${cv.primary.main};
    background: ${cv.primary.bgLighter};
  }

  :where(.${SELECT_OPTION_CLASS}[data-active="true"]) {
    background: ${cv.bg.light};
    outline: none;
  }

  :where(.${SELECT_OPTION_CLASS}[data-disabled="true"]) {
    color: ${cv.text.disabled};
    cursor: not-allowed;
  }

  :where(.${SELECT_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.text.disabled};
  }

  :where(.${SELECT_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.error.main};
  }

  @keyframes nds-select-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

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
            "--nds-select-width": fullWidth ? "100%" : "auto",
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
          width: position.width,
          ...style,
        }}
        onKeyDown={(event) => {
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

          if (event.key === "Home") {
            event.preventDefault();
            setActiveOptionValue(enabledOptions[0]?.dataset.value ?? null);
            return;
          }

          if (event.key === "End") {
            event.preventDefault();
            setActiveOptionValue(enabledOptions[enabledOptions.length - 1]?.dataset.value ?? null);
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

          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
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
      {children}
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
        {options.map((opt) => (
          <SelectOption
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className={slotProps?.option?.className}
            style={slotProps?.option?.style}
          >
            {opt.label}
          </SelectOption>
        ))}
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
