import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { addDismissableLayerListeners, WebPortal } from "./internal/web";

/* ─── Constants ─── */

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_TRIGGER_CLASS = `${TP_CLASS}__trigger`;
const TP_TRIGGER_TEXT_CLASS = `${TP_CLASS}__trigger-text`;
const TP_ICON_CLASS = `${TP_CLASS}__icon`;
const TP_PRESETS_CLASS = `${TP_CLASS}__presets`;
const TP_PRESET_CLASS = `${TP_CLASS}__preset`;
const TP_PANEL_CLASS = `${TP_CLASS}__panel`;
const TP_COLS_CLASS = `${TP_CLASS}__columns`;
const TP_COL_CLASS = `${TP_CLASS}__col`;
const TP_COL_HEAD_CLASS = `${TP_CLASS}__col-head`;
const TP_COL_LIST_CLASS = `${TP_CLASS}__col-list`;
const TP_OPTION_CLASS = `${TP_CLASS}__option`;
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
  /** step 분 단위 (초 단위 — 60 = 1분, 300 = 5분). 분 컬럼 간격으로 환산된다. */
  step?: number;
  /** 라벨 */
  label?: React.ReactNode;
  /** 미선택 시 트리거 placeholder */
  placeholder?: string;
  /** 헬퍼 / 에러 텍스트 */
  helperText?: React.ReactNode;
  /** 에러 */
  error?: boolean;
  /** 가로 가득 */
  fullWidth?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 선택 가능한 최소 시각 (HH:mm, 포함) */
  min?: string;
  /** 선택 가능한 최대 시각 (HH:mm, 포함) */
  max?: string;
  /** 포털 컨테이너 */
  portalContainer?: HTMLElement | null;
  /**
   * 빠른설정 프리셋 칩 (예: `[{ label: "자정까지", value: "23:59" }]`). 클릭하면 value 를 즉시 세팅.
   * 시간 필드 트레일링(시계아이콘 우측)에 붙는 회색 중립 보조 액션 칩으로 렌더 —
   * 노란 brand Chip / SelectionButton 이 아니다(캐포비 어드민 시간 인풋, Figma 3001:19122).
   */
  presets?: TimePickerPreset[];
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** "HH:mm" → 자정 기준 분. 형식이 잘못되면 null. */
const parseHM = (v: string): { h: number; m: number } | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
};

const toMinutes = (h: number, m: number) => h * 60 + m;

/* ─── Component ─── */

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      onValueChange,
      step = 60 * 5,
      label,
      placeholder = "시간 선택",
      helperText,
      error = false,
      fullWidth = false,
      disabled = false,
      min,
      max,
      portalContainer,
      presets,
      className,
      ...rest
    },
    ref,
  ) => {
    const labelId = useId();
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const rootRef = useRef<HTMLDivElement>(null);
    const fieldRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

    const selected = useMemo(() => parseHM(value), [value]);
    const minuteStep = Math.min(60, Math.max(1, Math.round(step / 60)));

    const minBound = useMemo(() => {
      const p = min ? parseHM(min) : null;
      return p ? toMinutes(p.h, p.m) : null;
    }, [min]);
    const maxBound = useMemo(() => {
      const p = max ? parseHM(max) : null;
      return p ? toMinutes(p.h, p.m) : null;
    }, [max]);

    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
    const minutes = useMemo(() => {
      const list: number[] = [];
      for (let m = 0; m < 60; m += minuteStep) list.push(m);
      return list;
    }, [minuteStep]);

    const inRange = (mins: number) => {
      if (minBound != null && mins < minBound) return false;
      if (maxBound != null && mins > maxBound) return false;
      return true;
    };

    const displayText = selected ? `${pad2(selected.h)}:${pad2(selected.m)}` : placeholder;

    // 패널 위치 계산 (필드 기준) + 외부 클릭/스크롤 dismiss
    useEffect(() => {
      if (!open || !fieldRef.current) return;
      const rect = fieldRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      return addDismissableLayerListeners({
        contentEl: panelRef.current,
        triggerEl: fieldRef.current,
        onDismiss: () => setOpen(false),
      });
    }, [open]);

    // Escape 닫기
    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    // 열릴 때 선택된 시/분을 가운데로 스크롤
    useEffect(() => {
      if (!open || !panelRef.current) return;
      panelRef.current
        .querySelectorAll<HTMLElement>(`.${TP_OPTION_CLASS}[data-selected="true"]`)
        .forEach((el) => el.scrollIntoView({ block: "center" }));
    }, [open]);

    const commit = (h: number, m: number) => onValueChange(`${pad2(h)}:${pad2(m)}`);

    const selectHour = (h: number) => {
      const m = selected?.m ?? 0;
      if (inRange(toMinutes(h, m))) {
        commit(h, m);
        return;
      }
      // 현재 분이 범위를 벗어나면 해당 시의 첫 유효 분으로 보정
      const fallback = minutes.find((mm) => inRange(toMinutes(h, mm)));
      if (fallback != null) commit(h, fallback);
    };

    const selectMinute = (m: number) => {
      const h = selected?.h ?? 0;
      if (inRange(toMinutes(h, m))) commit(h, m);
    };

    const openPanel = () => !disabled && setOpen((prev) => !prev);

    return (
      <div
        ref={rootRef}
        data-slot="root"
        data-full-width={fullWidth ? "true" : "false"}
        className={cx(TP_ROOT_CLASS, className)}
        {...rest}
      >
        {label && (
          <span id={labelId} className={TP_LABEL_CLASS}>
            {label}
          </span>
        )}
        <div
          ref={fieldRef}
          data-slot="field"
          data-open={open ? "true" : "false"}
          data-error={error ? "true" : "false"}
          data-disabled={disabled ? "true" : "false"}
          className={TP_FIELD_CLASS}
        >
          <button
            ref={triggerRef}
            type="button"
            data-slot="trigger"
            data-placeholder={selected ? "false" : "true"}
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-labelledby={label ? labelId : undefined}
            className={TP_TRIGGER_CLASS}
            onClick={openPanel}
          >
            <span data-slot="trigger-text" className={TP_TRIGGER_TEXT_CLASS}>
              {displayText}
            </span>
            <span aria-hidden="true" className={TP_ICON_CLASS}>
              <ClockIcon />
            </span>
          </button>
          {presets && presets.length > 0 && (
            <span className={TP_PRESETS_CLASS}>
              {presets.map((p) => (
                <button
                  key={`${p.value}:${p.label}`}
                  type="button"
                  data-slot="preset"
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

        {open && (
          <WebPortal container={portalContainer}>
            <div
              ref={panelRef}
              role="dialog"
              aria-label="시간 선택"
              data-slot="panel"
              className={TP_PANEL_CLASS}
              style={{ top: position.top, left: position.left, minWidth: position.width }}
            >
              <div className={TP_COLS_CLASS}>
                <div className={TP_COL_CLASS} data-unit="hour">
                  <span className={TP_COL_HEAD_CLASS}>시</span>
                  <div role="listbox" aria-label="시" className={TP_COL_LIST_CLASS}>
                    {hours.map((h) => {
                      const isSel = selected?.h === h;
                      const m = selected?.m ?? 0;
                      const dis =
                        !inRange(toMinutes(h, m)) &&
                        !minutes.some((mm) => inRange(toMinutes(h, mm)));
                      return (
                        <button
                          key={h}
                          type="button"
                          role="option"
                          aria-selected={isSel}
                          data-slot="option"
                          data-selected={isSel ? "true" : "false"}
                          disabled={dis}
                          className={TP_OPTION_CLASS}
                          onClick={() => selectHour(h)}
                        >
                          {pad2(h)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className={TP_COL_CLASS} data-unit="minute">
                  <span className={TP_COL_HEAD_CLASS}>분</span>
                  <div role="listbox" aria-label="분" className={TP_COL_LIST_CLASS}>
                    {minutes.map((m) => {
                      const isSel = selected?.m === m;
                      const h = selected?.h ?? 0;
                      const dis = !inRange(toMinutes(h, m));
                      return (
                        <button
                          key={m}
                          type="button"
                          role="option"
                          aria-selected={isSel}
                          data-slot="option"
                          data-selected={isSel ? "true" : "false"}
                          disabled={dis}
                          className={TP_OPTION_CLASS}
                          onClick={() => selectMinute(m)}
                        >
                          {pad2(m)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </WebPortal>
        )}

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
