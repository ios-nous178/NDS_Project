import React from "react";

/* ─── Constants ─── */

const MI_CLASS = "nds-medication-item";
const MI_ICON_CLASS = `${MI_CLASS}__icon`;
const MI_BODY_CLASS = `${MI_CLASS}__body`;
const MI_HEAD_CLASS = `${MI_CLASS}__head`;
const MI_NAME_CLASS = `${MI_CLASS}__name`;
const MI_DOSAGE_CLASS = `${MI_CLASS}__dosage`;
const MI_META_CLASS = `${MI_CLASS}__meta`;
const MI_TIMES_CLASS = `${MI_CLASS}__times`;
const MI_TIME_CLASS = `${MI_CLASS}__time`;
const MI_NOTE_CLASS = `${MI_CLASS}__note`;
const MI_CHECK_CLASS = `${MI_CLASS}__check`;
const MI_CHECK_INPUT_CLASS = `${MI_CLASS}__check-input`;
const MI_CHECK_BOX_CLASS = `${MI_CLASS}__check-box`;

/* ─── Types ─── */

export type MedicationTime = "morning" | "noon" | "evening" | "bedtime";

const TIME_LABEL: Record<MedicationTime, string> = {
  morning: "아침",
  noon: "점심",
  evening: "저녁",
  bedtime: "취침",
};
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const PillIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path
      d="M5 5L15 15C16.6569 16.6569 16.6569 19.3431 15 21C13.3431 22.6569 10.6569 22.6569 9 21L-1 11C-2.65685 9.34315 -2.65685 6.65685 -1 5C0.65685 3.34315 3.34315 3.34315 5 5Z"
      transform="translate(3 -1) rotate(45 11 11)"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.15"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8L6.5 11L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Component ─── */

export interface MedicationItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 약 이름 */
  name: string;
  /** 용량 (예: "10mg", "1정") */
  dosage?: React.ReactNode;
  /** 복용 시기 */
  times?: MedicationTime[];
  /** 노트 (예: "식후 30분") */
  note?: React.ReactNode;
  /** 복용 완료 여부 */
  taken?: boolean;
  /** 변경 콜백 (제공 시 우측에 체크박스 표시) */
  onTakenChange?: (taken: boolean) => void;
  /** 좌측 아이콘 커스터마이즈 */
  icon?: React.ReactNode;
}

export const MedicationItem = React.forwardRef<HTMLDivElement, MedicationItemProps>(
  ({ name, dosage, times, note, taken = false, onTakenChange, icon, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-taken={taken ? "true" : "false"}
        className={cx(MI_CLASS, className)}
        {...rest}
      >
        <span data-slot="icon" className={MI_ICON_CLASS}>
          {icon ?? <PillIcon />}
        </span>
        <div data-slot="body" className={MI_BODY_CLASS}>
          <div data-slot="head" className={MI_HEAD_CLASS}>
            <span data-slot="name" className={MI_NAME_CLASS}>
              {name}
            </span>
            {dosage && (
              <span data-slot="dosage" className={MI_DOSAGE_CLASS}>
                {dosage}
              </span>
            )}
          </div>
          {((times && times.length > 0) || note) && (
            <div data-slot="meta" className={MI_META_CLASS}>
              {times && times.length > 0 && (
                <div data-slot="times" className={MI_TIMES_CLASS}>
                  {times.map((t) => (
                    <span key={t} data-slot="time" className={MI_TIME_CLASS}>
                      {TIME_LABEL[t]}
                    </span>
                  ))}
                </div>
              )}
              {note && (
                <span data-slot="note" className={MI_NOTE_CLASS}>
                  {note}
                </span>
              )}
            </div>
          )}
        </div>
        {onTakenChange && (
          <label data-slot="check" className={MI_CHECK_CLASS}>
            <input
              type="checkbox"
              className={MI_CHECK_INPUT_CLASS}
              checked={taken}
              onChange={(e) => onTakenChange(e.target.checked)}
            />
            <span
              data-slot="check-box"
              data-checked={taken ? "true" : "false"}
              className={MI_CHECK_BOX_CLASS}
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
          </label>
        )}
      </div>
    );
  },
);

MedicationItem.displayName = "MedicationItem";
