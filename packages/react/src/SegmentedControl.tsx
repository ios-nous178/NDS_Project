import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const SC_CLASS = "nds-segmented";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;

/* ─── Types ─── */

export type SegmentedControlSize = "sm" | "md";

export interface SegmentedOption<T extends string = string> {
  /** 옵션 값 */
  value: T;
  /** 표시 라벨 */
  label: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 옵션 목록 */
  options: SegmentedOption<T>[];
  /** 선택된 값 */
  value: T;
  /** 값 변경 콜백 */
  onValueChange: (value: T) => void;
  /** 크기 */
  size?: SegmentedControlSize;
  /** 전체 너비 차지 */
  fullWidth?: boolean;
  /** 비활성화 */
  disabled?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const segmentedStyles = `
  :where(.${SC_ROOT_CLASS}) {
    display: inline-flex;
    align-items: stretch;
    background: ${cv.bg.light};
    border-radius: ${radius.md}px;
    padding: ${spacing[4]}px;
    gap: ${spacing[4]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SC_ROOT_CLASS}[data-fullwidth="true"]) {
    display: flex;
    width: 100%;
  }

  :where(.${SC_ITEM_CLASS}) {
    flex: 1 1 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    height: 32px;
    padding: 0 ${spacing[12]}px;
    background: transparent;
    border: none;
    border-radius: ${radius.sm}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.text.subtle};
    white-space: nowrap;
    transition: background-color ${transition.default}, color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${SC_ROOT_CLASS}[data-size="md"] .${SC_ITEM_CLASS}) {
    height: 36px;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
  }

  :where(.${SC_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.bg.white};
    color: ${cv.text.default};
    font-weight: ${fontWeight.medium};
    box-shadow: ${shadow["1"]};
  }

  :where(.${SC_ITEM_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${SC_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: 2px;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const SegmentedControl = <T extends string = string>({
  options,
  value,
  onValueChange,
  size = "sm",
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}: SegmentedControlProps<T>) => {
  return (
    <div
      data-slot="root"
      data-size={size}
      data-fullwidth={fullWidth ? "true" : "false"}
      role="radiogroup"
      className={cx(SC_ROOT_CLASS, className)}
      {...rest}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        const isDisabled = disabled || opt.disabled;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            data-slot="item"
            data-active={isActive ? "true" : "false"}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled && !isActive) onValueChange(opt.value);
            }}
            className={SC_ITEM_CLASS}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = "SegmentedControl";
