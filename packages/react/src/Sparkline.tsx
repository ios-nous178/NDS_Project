import React, { useId, useMemo } from "react";
import { cv } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const SL_CLASS = "nds-sparkline";

/* ─── Types ─── */

export type SparklineKind = "line" | "area" | "bar";

export interface SparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 데이터 (숫자 배열) */
  data: number[];
  /** 표시 종류 */
  kind?: SparklineKind;
  /** 색상 (기본 primary) */
  color?: string;
  /** width px */
  width?: number;
  /** height px */
  height?: number;
  /** 두께 (line 전용) */
  strokeWidth?: number;
  /** 0/baseline 표시 */
  showBaseline?: boolean;
  /** 마지막 값 점 표시 (line/area) */
  showLastDot?: boolean;
  /** 접근성 라벨 */
  "aria-label"?: string;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

interface NormalizedPoint {
  x: number;
  y: number;
}

const normalize = (
  data: number[],
  width: number,
  height: number,
  pad: number,
): { points: NormalizedPoint[]; min: number; max: number; midY: number } => {
  if (data.length === 0) return { points: [], min: 0, max: 0, midY: height / 2 };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const usableW = width - pad * 2;
  const usableH = height - pad * 2;
  const stepX = data.length === 1 ? 0 : usableW / (data.length - 1);
  const points = data.map((v, i) => ({
    x: pad + stepX * i,
    y: pad + usableH - ((v - min) / range) * usableH,
  }));
  const midY = pad + usableH - ((0 - min) / range) * usableH;
  return { points, min, max, midY: Math.max(pad, Math.min(height - pad, midY)) };
};

/* ─── Component ─── */

export const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  (
    {
      data,
      kind = "line",
      color,
      width = 120,
      height = 36,
      strokeWidth = 2,
      showBaseline = false,
      showLastDot = true,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const gradId = useId();
    const stroke = color ?? cv.iconRole.brand;
    const pad = 2;
    const { points, midY } = useMemo(
      () => normalize(data, width, height, pad),
      [data, width, height],
    );

    const linePath = useMemo(() => {
      if (points.length === 0) return "";
      return points
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(" ");
    }, [points]);

    const areaPath = useMemo(() => {
      if (points.length === 0) return "";
      const last = points[points.length - 1];
      const first = points[0];
      return `${linePath} L${last.x.toFixed(1)},${(height - pad).toFixed(1)} L${first.x.toFixed(1)},${(height - pad).toFixed(1)} Z`;
    }, [linePath, points, height]);

    return (
      <div
        ref={ref}
        data-slot="root"
        role="img"
        aria-label={ariaLabel ?? "추세 차트"}
        className={cx(SL_CLASS, className)}
        style={{ display: "inline-block", lineHeight: 0 }}
        {...rest}
      >
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
          {kind === "area" && (
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
          )}
          {showBaseline && (
            <line
              x1={pad}
              x2={width - pad}
              y1={midY}
              y2={midY}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          )}
          {kind === "bar" &&
            points.map((p, i) => {
              const barW = (width - pad * 2) / (points.length * 1.4);
              return (
                <rect
                  key={i}
                  x={p.x - barW / 2}
                  y={p.y}
                  width={barW}
                  height={Math.max(1, height - pad - p.y)}
                  fill={stroke}
                  rx={1}
                />
              );
            })}
          {(kind === "line" || kind === "area") && (
            <>
              {kind === "area" && <path d={areaPath} fill={`url(#${gradId})`} />}
              <path
                d={linePath}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {showLastDot && points.length > 0 && (
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r={strokeWidth + 0.5}
                  fill={stroke}
                />
              )}
            </>
          )}
        </svg>
      </div>
    );
  },
);

Sparkline.displayName = "Sparkline";
