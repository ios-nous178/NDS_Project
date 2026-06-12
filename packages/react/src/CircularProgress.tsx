import React from "react";
import { circularMetrics } from "./viz-svg.js";

/* ─── Constants ─── */

const CP_CLASS = "nds-circular-progress";
const CP_SVG_CLASS = `${CP_CLASS}__svg`;
const CP_TRACK_CLASS = `${CP_CLASS}__track`;
const CP_FILL_CLASS = `${CP_CLASS}__fill`;
const CP_LABEL_CLASS = `${CP_CLASS}__label`;
const CP_VALUE_CLASS = `${CP_CLASS}__value`;
const CP_CAPTION_CLASS = `${CP_CLASS}__caption`;

/* ─── Types ─── */

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 값 */
  value: number;
  /** 최댓값 */
  max?: number;
  /** 크기 px (정사각). 기본 80 */
  size?: number;
  /** 트랙/링 두께 */
  thickness?: number;
  /** 채움 색 (기본 primary) */
  color?: string;
  /** 트랙 색 */
  trackColor?: string;
  /** 가운데 라벨 (기본 "{percent}%") */
  label?: React.ReactNode;
  /** 라벨 아래 캡션 */
  caption?: React.ReactNode;
  /** 라벨 숨김 */
  hideLabel?: boolean;
  /** 접근성 라벨 */
  "aria-label"?: string;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      size = 80,
      thickness,
      color,
      trackColor,
      label,
      caption,
      hideLabel = false,
      className,
      style,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const { stroke, radius, circumference, dashOffset, percent, valueSize } = circularMetrics(
      value,
      max,
      size,
      thickness,
    );

    const styleVars: React.CSSProperties = {
      "--nds-cp-value-size": `${valueSize}px`,
      ...(color && { "--nds-cp-fill": color }),
      ...(trackColor && { "--nds-cp-track": trackColor }),
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        data-slot="root"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={ariaLabel ?? "진행도"}
        className={cx(CP_CLASS, className)}
        style={{ width: size, height: size, ...styleVars }}
        {...rest}
      >
        <svg className={CP_SVG_CLASS} width={size} height={size}>
          <circle
            className={CP_TRACK_CLASS}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
          />
          <circle
            className={CP_FILL_CLASS}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        {!hideLabel && (
          <div className={CP_LABEL_CLASS}>
            <span className={CP_VALUE_CLASS}>{label ?? `${percent}%`}</span>
            {caption && <span className={CP_CAPTION_CLASS}>{caption}</span>}
          </div>
        )}
      </div>
    );
  },
);

CircularProgress.displayName = "CircularProgress";
