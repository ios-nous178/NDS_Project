import React from "react";
import { cv } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const SG_CLASS = "nds-score-gauge";
const SG_TRACK_CLASS = `${SG_CLASS}__track`;
const SG_NEEDLE_CLASS = `${SG_CLASS}__needle`;
const SG_VALUE_CLASS = `${SG_CLASS}__value`;
const SG_VALUE_NUMBER_CLASS = `${SG_CLASS}__value-number`;
const SG_VALUE_MAX_CLASS = `${SG_CLASS}__value-max`;
const SG_LABEL_CLASS = `${SG_CLASS}__label`;
const SG_LEGEND_CLASS = `${SG_CLASS}__legend`;
const SG_LEGEND_ITEM_CLASS = `${SG_CLASS}__legend-item`;

/* ─── Types ─── */

export type GaugeLevel = "normal" | "mild" | "moderate" | "severe";

export interface GaugeSegment {
  /** 단계 키 */
  level: GaugeLevel;
  /** 라벨 (예: "정상") */
  label: string;
  /** 시작값 (포함) */
  from: number;
  /** 끝값 (미포함) */
  to: number;
}

const DEFAULT_SEGMENTS = (max: number): GaugeSegment[] => [
  { level: "normal", label: "정상", from: 0, to: max * 0.4 },
  { level: "mild", label: "주의", from: max * 0.4, to: max * 0.6 },
  { level: "moderate", label: "경계", from: max * 0.6, to: max * 0.8 },
  { level: "severe", label: "심각", from: max * 0.8, to: max + 0.001 },
];

const LEVEL_COLOR_VAR: Record<GaugeLevel, string> = {
  normal: cv.iconRole.statusSuccess,
  mild: cv.iconRole.statusCaution,
  moderate: cv.textRole.statusCaution,
  severe: cv.iconRole.statusError,
};
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const findLevel = (value: number, segments: GaugeSegment[]): GaugeSegment => {
  return segments.find((s) => value >= s.from && value < s.to) ?? segments[segments.length - 1];
};

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  thickness: number,
) => {
  const outerStart = polar(cx, cy, r, startDeg);
  const outerEnd = polar(cx, cy, r, endDeg);
  const innerStart = polar(cx, cy, r - thickness, endDeg);
  const innerEnd = polar(cx, cy, r - thickness, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${r - thickness} ${r - thickness} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
};

/* ─── Component ─── */

export interface ScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 점수 */
  value: number;
  /** 최대 점수 */
  max?: number;
  /** 단계 구간 (기본: max 비율 0~40%/40~60%/60~80%/80~100%) */
  segments?: GaugeSegment[];
  /** 단계 라벨 표시 (예: "정상") */
  showLabel?: boolean;
  /** 범례 표시 */
  showLegend?: boolean;
}

export const ScoreGauge = React.forwardRef<HTMLDivElement, ScoreGaugeProps>(
  (
    { value, max = 100, segments, showLabel = true, showLegend = false, className, ...rest },
    ref,
  ) => {
    const segs = segments ?? DEFAULT_SEGMENTS(max);
    const clamped = clamp(value, 0, max);
    const angleRange = 180;
    const valueDeg = (clamped / max) * angleRange;
    const current = findLevel(value, segs);
    const thickness = 18;

    return (
      <div ref={ref} data-slot="root" className={cx(SG_CLASS, className)} {...rest}>
        <div data-slot="track" className={SG_TRACK_CLASS}>
          <svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg">
            {segs.map((seg) => {
              const startDeg = (seg.from / max) * angleRange;
              const endDeg = (Math.min(seg.to, max) / max) * angleRange;
              return (
                <path
                  key={seg.level}
                  d={arcPath(100, 100, 90, startDeg, endDeg, thickness)}
                  fill={LEVEL_COLOR_VAR[seg.level]}
                  opacity={0.9}
                />
              );
            })}
            <g
              data-slot="needle"
              className={SG_NEEDLE_CLASS}
              style={{ transform: `rotate(${valueDeg - 90}deg)` }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="22"
                stroke={cv.iconRole.strong}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="6" fill={cv.iconRole.strong} />
              <circle cx="100" cy="100" r="3" fill={cv.surface.default} />
            </g>
          </svg>
        </div>
        <div data-slot="value" className={SG_VALUE_CLASS}>
          <span data-slot="value-number" className={SG_VALUE_NUMBER_CLASS}>
            {value}
          </span>
          <span data-slot="value-max" className={SG_VALUE_MAX_CLASS}>
            / {max}점
          </span>
        </div>
        {showLabel && (
          <span data-slot="label" data-level={current.level} className={SG_LABEL_CLASS}>
            {current.label}
          </span>
        )}
        {showLegend && (
          <div data-slot="legend" className={SG_LEGEND_CLASS}>
            {segs.map((seg) => (
              <span
                key={seg.level}
                data-slot="legend-item"
                className={SG_LEGEND_ITEM_CLASS}
                style={
                  { "--nds-gauge-legend-color": LEVEL_COLOR_VAR[seg.level] } as React.CSSProperties
                }
              >
                {seg.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  },
);

ScoreGauge.displayName = "ScoreGauge";
