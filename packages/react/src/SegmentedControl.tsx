import React from "react";

/* ─── Class names ─── */

const SC_CLASS = "nds-segmented";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;
const SC_ICON_CLASS = `${SC_CLASS}__icon`;

/* ─── Types ─── */

/** sm 32 / md 36 / lg 40px(PC — 구 Tabs.segment 흡수, 아이콘 동반 가능) */
export type SegmentedControlSize = "sm" | "md" | "lg";

/**
 * 시각 변형.
 *  - `default` : 회색 트랙 위에 흰색으로 떠오르는 active (iOS 스타일).
 *  - `solid`   : active 가 진한(Inverse) fill + 흰 텍스트. 캐포비 리포트의 노출/클릭
 *                연결형 토글(Figma 3001:30014) 정합.
 */
export type SegmentedControlVariant = "default" | "solid";

export interface SegmentedOption<T extends string = string> {
  /** 옵션 값 */
  value: T;
  /** 표시 라벨 */
  label: React.ReactNode;
  /** 라벨 앞 아이콘 (선택 — PC 세그먼트 네비 등) */
  icon?: React.ReactNode;
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
  /** 시각 변형 @default "default" */
  variant?: SegmentedControlVariant;
  /** 전체 너비 차지 */
  fullWidth?: boolean;
  /** 비활성화 */
  disabled?: boolean;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const SegmentedControl = <T extends string = string>({
  options,
  value,
  onValueChange,
  size = "sm",
  variant = "default",
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}: SegmentedControlProps<T>) => {
  return (
    <div
      data-slot="root"
      data-size={size}
      data-variant={variant}
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
            {opt.icon && (
              <span className={SC_ICON_CLASS} aria-hidden="true">
                {opt.icon}
              </span>
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = "SegmentedControl";
