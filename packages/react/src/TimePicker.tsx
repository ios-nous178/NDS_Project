import React, { useId } from "react";

/* ─── Constants ─── */

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_INPUT_CLASS = `${TP_CLASS}__input`;
const TP_ICON_CLASS = `${TP_CLASS}__icon`;
const TP_PRESETS_CLASS = `${TP_CLASS}__presets`;
const TP_PRESET_CLASS = `${TP_CLASS}__preset`;
const TP_HELPER_CLASS = `${TP_CLASS}__helper`;

/* 시계 아이콘 — Figma ic_time_picker (캐포비 Library 3001:19125) 의 ring + 시계바늘 path 그대로.
   색은 currentColor 로 토큰화. */
const ClockIcon = (): React.ReactElement => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20.5 20.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.58167 1.82397C4.33382 2.17163 0.73445 7.42529 2.10344 12.485C3.6885 18.3433 10.9148 20.6728 15.6216 16.7722C21.9684 11.5125 17.8328 1.27734 9.58167 1.82397V1.82397ZM10.8392 0.25L12.355 0.471973C16.1593 1.28052 19.2198 4.34185 20.0281 8.14775L20.25 9.66406V10.8359L20.0281 12.3522C19.2198 16.1579 16.1596 19.2194 12.355 20.028L10.8392 20.25H9.6678L8.15203 20.028C4.34749 19.2194 1.28723 16.1579 0.478982 12.3522L0.257058 10.8359C0.273366 10.4484 0.234939 10.0505 0.257058 9.66406C0.543435 4.6668 4.67205 0.536475 9.6678 0.25H10.8392Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.087 4.90784C10.5621 4.82683 10.9265 5.09026 11.0251 5.55237L11.0418 9.91062L13.9239 12.1056C14.49 12.8384 13.7446 13.7372 12.9121 13.2741C11.865 12.6916 10.8111 11.5556 9.76652 10.913C9.57058 10.7542 9.49221 10.5156 9.47116 10.2709C9.34348 8.78752 9.56975 7.12346 9.47234 5.62082C9.51814 5.28318 9.73464 4.96794 10.087 4.90784"
      fill="currentColor"
    />
  </svg>
);

/* ─── Types ─── */

export interface TimePickerPreset {
  /** 칩 라벨 (예: "자정까지") */
  label: string;
  /** 클릭 시 세팅되는 시각 값 (HH:mm, 예: "23:59") */
  value: string;
}

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 값 (`HH:mm`) */
  value: string;
  /** 변경 콜백 */
  onValueChange: (value: string) => void;
  /** step 분 단위 (input[type=time]의 step 속성, 초 단위 — 60 = 1분) */
  step?: number;
  /** 라벨 */
  label?: React.ReactNode;
  /** 헬퍼 / 에러 텍스트 */
  helperText?: React.ReactNode;
  /** 에러 */
  error?: boolean;
  /** 가로 가득 */
  fullWidth?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** min (HH:mm) */
  min?: string;
  /** max (HH:mm) */
  max?: string;
  /**
   * 빠른설정 프리셋 칩 (예: `[{ label: "자정까지", value: "23:59" }]`). 클릭하면 value 를 즉시 세팅.
   * 회색 중립 보조 액션 칩으로 렌더 — 노란 brand Chip / SelectionButton 이 아니다(캐포비 어드민 시간 인풋).
   */
  presets?: TimePickerPreset[];
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value,
      onValueChange,
      step = 60 * 5,
      label,
      helperText,
      error = false,
      fullWidth = false,
      disabled = false,
      min,
      max,
      presets,
      className,
      ...rest
    },
    ref,
  ) => {
    const inputId = useId();
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

    const openPicker = () => {
      const el = innerRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
      if (!el || disabled) return;
      // showPicker 지원 시 네이티브 시간 picker 호출, 아니면 입력 포커스로 폴백.
      if (typeof el.showPicker === "function") {
        try {
          el.showPicker();
          return;
        } catch {
          /* user-gesture 필요 등 — 포커스로 폴백 */
        }
      }
      el.focus();
    };

    return (
      <div
        data-slot="root"
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(TP_ROOT_CLASS, className)}
      >
        {label && (
          <label htmlFor={inputId} className={TP_LABEL_CLASS}>
            {label}
          </label>
        )}
        <div
          className={TP_FIELD_CLASS}
          data-error={error ? "true" : "false"}
          data-disabled={disabled ? "true" : "false"}
        >
          <input
            ref={innerRef}
            id={inputId}
            type="time"
            className={TP_INPUT_CLASS}
            value={value}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
            onChange={(e) => onValueChange(e.target.value)}
            {...rest}
          />
          <button
            type="button"
            className={TP_ICON_CLASS}
            aria-label="시간 선택"
            tabIndex={-1}
            disabled={disabled}
            onClick={openPicker}
          >
            <ClockIcon />
          </button>
          {presets && presets.length > 0 && (
            <span className={TP_PRESETS_CLASS}>
              {presets.map((p) => (
                <button
                  key={`${p.value}:${p.label}`}
                  type="button"
                  className={TP_PRESET_CLASS}
                  disabled={disabled}
                  onClick={() => onValueChange(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </span>
          )}
        </div>
        {helperText && (
          <p className={TP_HELPER_CLASS} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TimePicker.displayName = "TimePicker";
