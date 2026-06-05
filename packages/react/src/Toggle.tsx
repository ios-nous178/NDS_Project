import React, { useCallback, useId } from "react";

/* ─── Constants ─── */

const TG_CLASS = "nds-toggle";
const TG_TRACK_CLASS = `${TG_CLASS}__track`;
const TG_THUMB_CLASS = `${TG_CLASS}__thumb`;
const TG_LABEL_CLASS = `${TG_CLASS}__label`;
const TG_INNER_LABEL_CLASS = `${TG_CLASS}__inner-label`;

/* ─── Sizes ─── */

const sizeConfig = {
  md: { trackW: 44, trackH: 24, thumbSize: 18, thumbOffset: 3 },
  sm: { trackW: 36, trackH: 20, thumbSize: 16, thumbOffset: 2 },
} as const;

// 라벨 내장(status) 변형 — 트랙 안에 on/off 텍스트. 폭 auto + 큰 썸 (Figma 캐포비 노출 토글 3172:577: 30 / thumb 25).
const LABELED = { trackH: 30, thumbSize: 25, thumbOffset: 2.5 } as const;

export type ToggleSize = keyof typeof sizeConfig;
export type ToggleTone = "brand" | "success";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface ToggleProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  /** 토글 상태 */
  checked?: boolean;
  /** 변경 콜백 */
  onCheckedChange?: (checked: boolean) => void;
  /** 트랙 **밖**(우측)에 붙는 라벨 */
  label?: React.ReactNode;
  /**
   * 트랙 **안**에 표시되는 켜짐 라벨 (예: "노출"). onLabel/offLabel 중 하나라도 주면
   * "라벨 내장 status 토글" 변형으로 렌더(폭 auto · 큰 썸). 상태/노출 토글에 사용.
   */
  onLabel?: React.ReactNode;
  /** 트랙 안에 표시되는 꺼짐 라벨 (예: "미노출"). */
  offLabel?: React.ReactNode;
  /** 켜짐 트랙 색. brand(기본·브랜드색) | success(초록 — 노출/활성 status). */
  tone?: ToggleTone;
  /** 크기 (라벨 내장 변형에서는 무시 — 고정 30/25). */
  size?: ToggleSize;
  /** 비활성화 */
  disabled?: boolean;
  /** 루트 className */
  className?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked = false,
      onCheckedChange,
      label,
      onLabel,
      offLabel,
      tone = "brand",
      size = "md",
      disabled = false,
      className,
      onChange,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const labeled = onLabel != null || offLabel != null;
    const innerLabel = checked ? onLabel : offLabel;
    const s = sizeConfig[size];
    const thumbTravel = s.trackW - s.thumbSize - s.thumbOffset * 2;

    const trackStyle: React.CSSProperties = labeled
      ? ({
          "--nds-toggle-track-h": `${LABELED.trackH}px`,
          "--nds-toggle-thumb-size": `${LABELED.thumbSize}px`,
          "--nds-toggle-thumb-offset": `${LABELED.thumbOffset}px`,
        } as React.CSSProperties)
      : ({
          "--nds-toggle-track-w": `${s.trackW}px`,
          "--nds-toggle-track-h": `${s.trackH}px`,
          "--nds-toggle-thumb-size": `${s.thumbSize}px`,
          "--nds-toggle-thumb-offset": `${s.thumbOffset}px`,
          "--nds-toggle-thumb-travel": `${thumbTravel}px`,
        } as React.CSSProperties);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(e.target.checked);
        onChange?.(e);
      },
      [onCheckedChange, onChange],
    );

    return (
      <label
        data-slot="root"
        data-disabled={disabled ? "true" : "false"}
        className={cx(TG_CLASS, className)}
        htmlFor={inputId}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          aria-checked={checked}
          {...rest}
        />
        <span
          data-slot="track"
          data-checked={checked ? "true" : "false"}
          data-labeled={labeled ? "true" : "false"}
          data-tone={tone}
          className={TG_TRACK_CLASS}
          style={trackStyle}
        >
          {labeled && checked && innerLabel != null && (
            <span data-slot="inner-label" className={TG_INNER_LABEL_CLASS}>
              {innerLabel}
            </span>
          )}
          <span data-slot="thumb" className={TG_THUMB_CLASS} />
          {labeled && !checked && innerLabel != null && (
            <span data-slot="inner-label" className={TG_INNER_LABEL_CLASS}>
              {innerLabel}
            </span>
          )}
        </span>
        {label && (
          <span data-slot="label" className={TG_LABEL_CLASS}>
            {label}
          </span>
        )}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";
