import { describe, expect, it } from "vitest";
import {
  arcPath,
  circularMetrics,
  clamp,
  findSegment,
  normalizeSeries,
  polar,
} from "../src/components/viz-svg.js";

/**
 * viz-svg 는 Sparkline · CircularProgress · ScoreGauge 의 react/html 미러가 공유하는
 * 순수 지오메트리 코어다. 이 테스트가 좌표/스케일/각도 계약을 고정해 드리프트를 막는다.
 */
describe("viz-svg — shared data-viz geometry", () => {
  it("clamp bounds a value to [min, max]", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it("polar maps gauge degrees (0=left, 180=right) around center", () => {
    // deg 0 → 좌측: x = cx - r
    const left = polar(100, 100, 90, 0);
    expect(left.x).toBeCloseTo(10, 6);
    expect(left.y).toBeCloseTo(100, 6);
    // deg 180 → 우측: x = cx + r
    const right = polar(100, 100, 90, 180);
    expect(right.x).toBeCloseTo(190, 6);
    expect(right.y).toBeCloseTo(100, 6);
    // deg 90 → 상단: y = cy - r
    const top = polar(100, 100, 90, 90);
    expect(top.x).toBeCloseTo(100, 6);
    expect(top.y).toBeCloseTo(10, 6);
  });

  it("arcPath produces a closed donut segment with correct large-arc flag", () => {
    const small = arcPath(100, 100, 90, 0, 90, 18);
    expect(small.startsWith("M ")).toBe(true);
    expect(small.endsWith("Z")).toBe(true);
    expect(small).toContain("A 90 90 0 0 1"); // <=180° → largeArc 0
    const wide = arcPath(100, 100, 90, 0, 200, 18);
    expect(wide).toContain("A 90 90 0 1 1"); // >180° → largeArc 1
  });

  it("findSegment returns the [from, to) match, last as fallback", () => {
    const segs = [
      { level: "a", from: 0, to: 40 },
      { level: "b", from: 40, to: 60 },
      { level: "c", from: 60, to: 100 },
    ];
    expect(findSegment(20, segs).level).toBe("a");
    expect(findSegment(40, segs).level).toBe("b"); // from inclusive
    expect(findSegment(60, segs).level).toBe("c");
    expect(findSegment(999, segs).level).toBe("c"); // out of range → last
  });

  it("circularMetrics derives ring dimensions and clamps ratio", () => {
    const m = circularMetrics(75, 100, 80);
    expect(m.stroke).toBe(7); // size/12 rounded, min 4
    expect(m.radius).toBe((80 - 7) / 2);
    expect(m.circumference).toBeCloseTo(2 * Math.PI * m.radius, 6);
    expect(m.percent).toBe(75);
    expect(m.dashOffset).toBeCloseTo(m.circumference * 0.25, 6);
    // 명시 thickness + over-max ratio clamp
    const full = circularMetrics(150, 100, 120, 10);
    expect(full.stroke).toBe(10);
    expect(full.ratio).toBe(1);
    expect(full.dashOffset).toBe(0);
  });

  it("normalizeSeries scales points into the padded box and finds the 0-baseline", () => {
    const { points, min, max, midY } = normalizeSeries([0, 10], 100, 40, 2);
    expect(min).toBe(0);
    expect(max).toBe(10);
    // 첫 점 x = pad, 마지막 x = width - pad
    expect(points[0].x).toBe(2);
    expect(points[1].x).toBe(98);
    // 최솟값(0)은 박스 하단, 최댓값(10)은 상단
    expect(points[0].y).toBe(2 + (40 - 4)); // bottom
    expect(points[1].y).toBe(2); // top
    // 0 == min → baseline 이 하단에 위치
    expect(midY).toBe(2 + (40 - 4));
  });

  it("normalizeSeries is safe on empty data", () => {
    const r = normalizeSeries([], 100, 40, 2);
    expect(r.points).toEqual([]);
    expect(r.midY).toBe(20);
  });
});
