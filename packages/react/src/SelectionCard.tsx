import React, { createContext, useContext, useId } from "react";

/* ─── Constants ─── */

const SC_CLASS = "nds-selection-card";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;
const SC_INDICATOR_CLASS = `${SC_CLASS}__indicator`;
const SC_BODY_CLASS = `${SC_CLASS}__body`;
const SC_TITLE_CLASS = `${SC_CLASS}__title`;
const SC_DESCRIPTION_CLASS = `${SC_CLASS}__description`;
const SC_ICON_CLASS = `${SC_CLASS}__icon`;

/* ─── Types ─── */

export type SelectionCardLayout = "vertical" | "horizontal";
export type SelectionCardMode = "single" | "multiple";

export interface SelectionCardGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 단일 vs 다중 선택 */
  mode?: SelectionCardMode;
  /** 단일 모드: 선택된 value */
  value?: string;
  /** 다중 모드: 선택된 value 배열 */
  values?: string[];
  /** 단일 모드 변경 콜백 */
  onValueChange?: (value: string) => void;
  /** 다중 모드 변경 콜백 */
  onValuesChange?: (values: string[]) => void;
  /** 카드 배치 */
  layout?: SelectionCardLayout;
  /** 동일 라디오 그룹 식별 (단일 모드) */
  name?: string;
  /** 카드들 */
  children: React.ReactNode;
}

interface ContextValue {
  mode: SelectionCardMode;
  value?: string;
  values?: string[];
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  name: string;
}

const SelectionCardContext = createContext<ContextValue | null>(null);

export interface SelectionCardItemProps extends Omit<
  React.HTMLAttributes<HTMLLabelElement>,
  "title" | "onChange"
> {
  /** 옵션 값 */
  value: string;
  /** 카드 제목 */
  title: React.ReactNode;
  /** 보조 설명 */
  description?: React.ReactNode;
  /** 좌측 큰 아이콘/일러스트 (인디케이터와 별도) */
  icon?: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
  /** 인디케이터 표시 (체크/라디오 마크). 기본 true */
  showIndicator?: boolean;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Item ─── */

const Item: React.FC<SelectionCardItemProps> = ({
  value,
  title,
  description,
  icon,
  disabled = false,
  showIndicator = true,
  className,
  ...rest
}) => {
  const ctx = useContext(SelectionCardContext);
  if (!ctx) {
    throw new Error("SelectionCard.Item은 SelectionCard.Group 안에서만 사용해야 합니다.");
  }

  const { mode, value: singleValue, values, onValueChange, onValuesChange, name } = ctx;
  const itemId = useId();

  const checked = mode === "single" ? singleValue === value : (values ?? []).includes(value);

  const handleChange = () => {
    if (disabled) return;
    if (mode === "single") {
      onValueChange?.(value);
    } else {
      const next = checked ? (values ?? []).filter((v) => v !== value) : [...(values ?? []), value];
      onValuesChange?.(next);
    }
  };

  return (
    <label
      className={cx(SC_ITEM_CLASS, className)}
      data-slot="item"
      data-checked={checked ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      data-mode={mode}
      htmlFor={itemId}
      {...rest}
    >
      <input
        id={itemId}
        type={mode === "single" ? "radio" : "checkbox"}
        name={mode === "single" ? name : undefined}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      {showIndicator && (
        <span className={SC_INDICATOR_CLASS} aria-hidden>
          {mode === "multiple" ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6.5l2.5 2.5L9.5 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="4" fill="currentColor" />
            </svg>
          )}
        </span>
      )}
      {icon && <span className={SC_ICON_CLASS}>{icon}</span>}
      <span className={SC_BODY_CLASS}>
        <span className={SC_TITLE_CLASS}>{title}</span>
        {description && <span className={SC_DESCRIPTION_CLASS}>{description}</span>}
      </span>
    </label>
  );
};

Item.displayName = "SelectionCard.Item";

/* ─── Group ─── */

const Group: React.FC<SelectionCardGroupProps> = ({
  mode = "single",
  value,
  values,
  onValueChange,
  onValuesChange,
  layout = "vertical",
  name: nameProp,
  className,
  children,
  ...rest
}) => {
  const generatedName = useId();
  const name = nameProp ?? generatedName;

  return (
    <SelectionCardContext.Provider
      value={{ mode, value, values, onValueChange, onValuesChange, name }}
    >
      <div
        role={mode === "single" ? "radiogroup" : "group"}
        data-slot="root"
        data-layout={layout}
        data-mode={mode}
        className={cx(SC_ROOT_CLASS, className)}
        {...rest}
      >
        {children}
      </div>
    </SelectionCardContext.Provider>
  );
};

Group.displayName = "SelectionCard.Group";

/* ─── Compound API ─── */

export const SelectionCard = {
  Group,
  Item,
};
