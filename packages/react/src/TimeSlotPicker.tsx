import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const TS_CLASS = "nds-time-slot-picker";
const TS_ROOT_CLASS = `${TS_CLASS}__root`;
const TS_GROUP_CLASS = `${TS_CLASS}__group`;
const TS_GROUP_LABEL_CLASS = `${TS_CLASS}__group-label`;
const TS_GRID_CLASS = `${TS_CLASS}__grid`;
const TS_SLOT_CLASS = `${TS_CLASS}__slot`;
const TS_EMPTY_CLASS = `${TS_CLASS}__empty`;

/* ─── Types ─── */

export interface TimeSlot {
  /** 슬롯 키 (보통 "HH:MM") */
  value: string;
  /** 표시 라벨 (없으면 value 그대로) */
  label?: React.ReactNode;
  /** 예약 불가 (이미 예약됨/시간 지남 등) */
  unavailable?: boolean;
}

export interface TimeSlotGroup {
  /** 그룹 키 */
  key: string;
  /** 그룹 라벨 (예: "오전", "오후", "저녁") */
  label: React.ReactNode;
  /** 슬롯들 */
  slots: TimeSlot[];
}

export interface TimeSlotPickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 단일 슬롯 목록 (또는 groups 사용) */
  slots?: TimeSlot[];
  /** 그룹화된 슬롯 (오전/오후 등) */
  groups?: TimeSlotGroup[];
  /** 선택된 값 */
  value?: string;
  /** 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 한 줄에 표시할 슬롯 개수 */
  columns?: number;
  /** 비활성화 */
  disabled?: boolean;
  /** 빈 상태 메시지 (slots/groups 모두 비어있을 때) */
  emptyText?: React.ReactNode;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const timeSlotPickerStyles = `
  :where(.${TS_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]}px;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TS_GROUP_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${TS_GROUP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }

  :where(.${TS_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(var(--nds-time-slot-cols, 4), 1fr);
    gap: ${spacing[8]}px;
  }

  :where(.${TS_SLOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 ${spacing[8]}px;
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.sm}px;
    background: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.normal};
    transition: background-color ${transition.default}, border-color ${transition.default}, color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${TS_SLOT_CLASS}:hover:not(:disabled):not([data-selected="true"])) {
    border-color: ${"#91CAF6"};
    background: ${cv.surface.brandSubtle};
  }

  :where(.${TS_SLOT_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.medium};
  }

  :where(.${TS_SLOT_CLASS}:disabled),
  :where(.${TS_SLOT_CLASS}[data-unavailable="true"]) {
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    border-color: ${cv.borderRole.subtle};
    cursor: not-allowed;
    text-decoration: line-through;
  }

  :where(.${TS_SLOT_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${TS_EMPTY_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${spacing[24]}px;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    background: ${cv.surface.subtle};
    border-radius: ${radius.md}px;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const normalize = (slots?: TimeSlot[], groups?: TimeSlotGroup[]): TimeSlotGroup[] => {
  if (groups && groups.length > 0) return groups;
  if (slots && slots.length > 0) return [{ key: "_default", label: "", slots }];
  return [];
};

/* ─── Component ─── */

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  groups,
  value,
  onValueChange,
  columns = 4,
  disabled = false,
  emptyText = "예약 가능한 시간이 없습니다",
  className,
  style,
  ...rest
}) => {
  const normalizedGroups = normalize(slots, groups);

  if (normalizedGroups.length === 0) {
    return (
      <div className={cx(TS_ROOT_CLASS, className)} {...rest}>
        <div data-slot="empty" className={TS_EMPTY_CLASS}>
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="root"
      role="radiogroup"
      className={cx(TS_ROOT_CLASS, className)}
      style={
        {
          "--nds-time-slot-cols": columns,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {normalizedGroups.map((group) => (
        <div key={group.key} data-slot="group" className={TS_GROUP_CLASS}>
          {group.label && (
            <span data-slot="group-label" className={TS_GROUP_LABEL_CLASS}>
              {group.label}
            </span>
          )}
          <div data-slot="grid" className={TS_GRID_CLASS}>
            {group.slots.map((slot) => {
              const isSelected = value === slot.value;
              const isDisabled = disabled || slot.unavailable;
              return (
                <button
                  key={slot.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  data-slot="slot"
                  data-selected={isSelected ? "true" : "false"}
                  data-unavailable={slot.unavailable ? "true" : "false"}
                  disabled={isDisabled}
                  className={TS_SLOT_CLASS}
                  onClick={() => {
                    if (isDisabled) return;
                    onValueChange(slot.value);
                  }}
                >
                  {slot.label ?? slot.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

TimeSlotPicker.displayName = "TimeSlotPicker";
