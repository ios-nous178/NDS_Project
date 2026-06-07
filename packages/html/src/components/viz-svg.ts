// ⚠️ 동기화: packages/react/src/viz-svg.ts 와 동일 로직 유지 (react/html 듀얼 패턴).
/**
 * viz-svg — 프레임워크 무관 순수 데이터-시각화 지오메트리.
 * DOM/React 의존 없음 → Sparkline · CircularProgress · ScoreGauge 의 react/html 미러가 공유한다.
 * 좌표·각도·스케일 계산만 담는다 (색·라벨 등 도메인 설정은 각 컴포넌트에 둔다).
 */

export interface Point {
  x: number;
  y: number;
}

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);

/* ─── Radial 게이지 (ScoreGauge) ─── */

/** 반원 게이지 극좌표 — deg 0 = 좌측(180°에서 시작), deg 180 = 우측. */
export const polar = (cx: number, cy: number, r: number, deg: number): Point => {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

/** 두께 있는 호 path — outer arc → inner arc → Z (닫힌 도넛 세그먼트). */
export const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  thickness: number,
): string => {
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

/** value 가 속하는 첫 구간([from, to)) — 못 찾으면 마지막 구간. */
export const findSegment = <T extends { from: number; to: number }>(
  value: number,
  segments: T[],
): T => segments.find((s) => value >= s.from && value < s.to) ?? segments[segments.length - 1];

/* ─── 링형 진행도 (CircularProgress) ─── */

export interface CircularMetrics {
  stroke: number;
  radius: number;
  circumference: number;
  ratio: number;
  dashOffset: number;
  percent: number;
  valueSize: number;
}

/** stroke-dasharray 기반 원형 진행 링의 모든 파생 치수. thickness 미지정 시 size/12. */
export const circularMetrics = (
  value: number,
  max: number,
  size: number,
  thickness?: number,
): CircularMetrics => {
  const stroke = thickness ?? Math.max(4, Math.round(size / 12));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = clamp(value / max, 0, 1);
  const dashOffset = circumference * (1 - ratio);
  const percent = Math.round(ratio * 100);
  const valueSize = Math.max(12, Math.round(size / 5));
  return { stroke, radius, circumference, ratio, dashOffset, percent, valueSize };
};

/* ─── 선형 스케일 (Sparkline) ─── */

export interface NormalizedSeries {
  points: Point[];
  min: number;
  max: number;
  midY: number;
}

/** 숫자 배열을 (width × height) 박스 안의 좌표점으로 정규화. midY = 0 기준선의 y. */
export const normalizeSeries = (
  data: number[],
  width: number,
  height: number,
  pad: number,
): NormalizedSeries => {
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
