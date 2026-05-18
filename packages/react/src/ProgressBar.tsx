import React from "react";
import { cv, radius, transition } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const PB_CLASS = "nds-progress-bar";
const PB_TRACK_CLASS = `${PB_CLASS}__track`;
const PB_FILL_CLASS = `${PB_CLASS}__fill`;

/* ─── Sizes ─── */

const sizeConfig = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export type ProgressBarSize = keyof typeof sizeConfig;

// eslint-disable-next-line unused-imports/no-unused-vars
const progressBarStyles = `
  :where(.${PB_CLASS}) {
    width: 100%;
    box-sizing: border-box;
  }

  :where(.${PB_TRACK_CLASS}) {
    width: 100%;
    height: var(--nds-progress-height, 8px);
    border-radius: var(--nds-progress-radius, ${radius.pill}px);
    background: var(--nds-progress-track-bg, ${cv.surface.disabled});
    overflow: hidden;
  }

  :where(.${PB_FILL_CLASS}) {
    height: 100%;
    border-radius: inherit;
    background: var(--nds-progress-fill-bg, ${cv.surface.brand});
    transition: width ${transition.default};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

/* ─── Component ─── */

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 진행률 (0 ~ 100) */
  value: number;
  /** 최대값 (기본 100) */
  max?: number;
  /** 크기 */
  size?: ProgressBarSize;
  /** 채움 색상 오버라이드 */
  color?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, size = "md", color, className, style, ...rest }, ref) => {
    const percent = clamp((value / max) * 100, 0, 100);
    const h = sizeConfig[size];

    return (
      <div
        ref={ref}
        data-slot="root"
        data-size={size}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cx(PB_CLASS, className)}
        style={style}
        {...rest}
      >
        <div
          data-slot="track"
          className={PB_TRACK_CLASS}
          style={
            {
              "--nds-progress-height": `${h}px`,
              ...(color && { "--nds-progress-fill-bg": color }),
            } as React.CSSProperties
          }
        >
          <div data-slot="fill" className={PB_FILL_CLASS} style={{ width: `${percent}%` }} />
        </div>
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";
