import React from "react";
import {
  CHART_CLASS,
  buildChartSvg,
  buildLegendHtml,
  type ChartConfig,
  type ChartSeries,
  type ChartTooltip,
} from "./chart-svg";

/**
 * Chart — 캐포비 어드민 통계 차트 (line / grouped-bar).
 *
 * 무번들러 목업 정합을 위해 정적 inline-SVG 로 렌더 (런타임 차트 라이브러리 없음).
 * vanilla `<nds-chart>` 와 동일한 SVG 빌더(chart-svg)를 공유.
 * Figma: 🗄️ 캐포비 Library › 퀴즈 통계 (node 3001:47404)
 *
 * 시리즈 색 기본값(--nds-chart-* 토큰으로 오버라이드):
 *   line  = #FFD200, bar 1 = #007AFF(남성), bar 2 = #FF8437(여성)
 */
export interface ChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** "line" | "bar" (그룹 막대) */
  type?: "line" | "bar";
  /** x축 라벨 */
  labels: string[];
  /** 데이터 시리즈 (bar 는 다중 시리즈 = 그룹 막대) */
  series: ChartSeries[];
  /** y축 상한 (미지정 시 데이터 기준 자동) */
  yMax?: number;
  /** y축 눈금 개수 (기본 4) */
  yTicks?: number;
  /** 강조 툴팁 */
  tooltip?: ChartTooltip;
  /** 범례 표시 (기본 true) */
  showLegend?: boolean;
}

export function Chart({
  type = "line",
  labels,
  series,
  yMax,
  yTicks,
  tooltip,
  showLegend = true,
  className,
  ...rest
}: ChartProps) {
  const cfg: ChartConfig = { type, labels, series, yMax, yTicks, tooltip };
  const html = buildChartSvg(cfg) + (showLegend ? buildLegendHtml(cfg) : "");
  const rootClass = className ? `${CHART_CLASS} ${className}` : CHART_CLASS;
  return <div className={rootClass} {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}

export type { ChartSeries, ChartTooltip, ChartConfig } from "./chart-svg";
