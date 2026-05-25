import React, { useCallback, useId } from "react";

/* ─── Constants ─── */

const TG_CLASS = "nds-toggle";
const TG_TRACK_CLASS = `${TG_CLASS}__track`;
const TG_THUMB_CLASS = `${TG_CLASS}__thumb`;
const TG_LABEL_CLASS = `${TG_CLASS}__label`;

/* ─── Sizes ─── */

const sizeConfig = {
  md: { trackW: 44, trackH: 24, thumbSize: 18, thumbOffset: 3 },
  sm: { trackW: 36, trackH: 20, thumbSize: 16, thumbOffset: 2 },
} as const;

export type ToggleSize = keyof typeof sizeConfig;
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
  /** 라벨 */
  label?: React.ReactNode;
  /** 크기 */
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
    const s = sizeConfig[size];
    const thumbTravel = s.trackW - s.thumbSize - s.thumbOffset * 2;

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
          className={TG_TRACK_CLASS}
          style={
            {
              "--nds-toggle-track-w": `${s.trackW}px`,
              "--nds-toggle-track-h": `${s.trackH}px`,
              "--nds-toggle-thumb-size": `${s.thumbSize}px`,
              "--nds-toggle-thumb-offset": `${s.thumbOffset}px`,
              "--nds-toggle-thumb-travel": `${thumbTravel}px`,
            } as React.CSSProperties
          }
        >
          <span data-slot="thumb" className={TG_THUMB_CLASS} />
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
