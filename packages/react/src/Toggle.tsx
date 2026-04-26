import React, { useCallback, useId } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const TG_CLASS = "nds-toggle";
const TG_TRACK_CLASS = `${TG_CLASS}__track`;
const TG_THUMB_CLASS = `${TG_CLASS}__thumb`;
const TG_LABEL_CLASS = `${TG_CLASS}__label`;

/* ─── Sizes ─── */

const sizeConfig = {
  md: { trackW: 44, trackH: 24, thumbSize: 20, thumbOffset: 2 },
  sm: { trackW: 36, trackH: 20, thumbSize: 16, thumbOffset: 2 },
} as const;

export type ToggleSize = keyof typeof sizeConfig;

// eslint-disable-next-line unused-imports/no-unused-vars
const toggleStyles = `
  :where(.${TG_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[8]}px;
    cursor: pointer;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TG_CLASS}[data-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${TG_CLASS}) input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${TG_TRACK_CLASS}) {
    position: relative;
    width: var(--nds-toggle-track-w, 44px);
    height: var(--nds-toggle-track-h, 24px);
    border-radius: ${radius.pill}px;
    background: var(--nds-toggle-track-bg, ${cv.border.default});
    transition: background-color ${transition.default};
    flex-shrink: 0;
  }

  :where(.${TG_TRACK_CLASS}[data-checked="true"]) {
    background: var(--nds-toggle-track-active-bg, ${cv.primary.main});
  }

  :where(.${TG_THUMB_CLASS}) {
    position: absolute;
    top: var(--nds-toggle-thumb-offset, 2px);
    left: var(--nds-toggle-thumb-offset, 2px);
    width: var(--nds-toggle-thumb-size, 20px);
    height: var(--nds-toggle-thumb-size, 20px);
    border-radius: ${radius.pill}px;
    background: ${cv.bg.white};
    box-shadow: var(--nds-toggle-thumb-shadow, 0 1px 3px rgba(0, 0, 0, 0.15));
    transition: transform ${transition.default};
  }

  :where(.${TG_TRACK_CLASS}[data-checked="true"]) .${TG_THUMB_CLASS} {
    transform: translateX(var(--nds-toggle-thumb-travel, 20px));
  }

  :where(.${TG_LABEL_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.default};
    user-select: none;
  }
`;

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
