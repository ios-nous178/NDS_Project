import React from "react";

/* ─── Class names ─── */

const SBG_CLASS = "nds-selection-button-group";
const SBG_ROOT_CLASS = `${SBG_CLASS}__root`;
const SBG_ITEM_CLASS = `${SBG_CLASS}__item`;

/* ─── Types ─── */

export interface SelectionButtonOption<T extends string = string> {
  /** 옵션 값 */
  value: T;
  /** 표시 라벨 */
  label: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
}

export interface SelectionButtonGroupProps<T extends string = string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 옵션 목록 (단일 선택, 권장 2~3개) */
  options: SelectionButtonOption<T>[];
  /** 선택된 값 */
  value: T;
  /** 값 변경 콜백 */
  onValueChange: (value: T) => void;
  /** 전체 너비를 옵션 수만큼 균등 분할 */
  fullWidth?: boolean;
  /** 전체 비활성화 */
  disabled?: boolean;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

/**
 * SelectionButtonGroup — 폼 내에서 상호 배타적인 옵션을 단일 선택하는 버튼 그룹.
 *
 * SegmentedControl(연결된 회색 트랙 + 슬라이딩 펄)과 달리, 브랜드색 아웃라인의
 * 개별 버튼을 gap 으로 나열한다. FormField 의 ContentSlot 에 교체해 사용한다.
 * 선택 상태는 `--semantic-bg-brand-subtle` + `--semantic-border-brand-default`
 * 시멘틱 캐스케이드로 5개 브랜드 모두 브랜드색에 자동 대응한다.
 */
export const SelectionButtonGroup = <T extends string = string>({
  options,
  value,
  onValueChange,
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}: SelectionButtonGroupProps<T>) => {
  return (
    <div
      data-slot="root"
      data-fullwidth={fullWidth ? "true" : "false"}
      role="radiogroup"
      className={cx(SBG_ROOT_CLASS, className)}
      {...rest}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const isDisabled = disabled || opt.disabled;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            data-slot="item"
            data-selected={isSelected ? "true" : "false"}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled && !isSelected) onValueChange(opt.value);
            }}
            className={SBG_ITEM_CLASS}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

SelectionButtonGroup.displayName = "SelectionButtonGroup";
