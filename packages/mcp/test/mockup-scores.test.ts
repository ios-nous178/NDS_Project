import { describe, expect, it } from "vitest";
import { computeScores } from "@nudge-design/mockup-core/tools/html-validator";

type ByRule = Parameters<typeof computeScores>[0];
const r = (rule: string, severity: "error" | "warn" | "info", count: number): ByRule[number] => ({
  rule,
  severity,
  count,
  lines: Array.from({ length: count }, (_, i) => i + 1),
});

describe("computeScores", () => {
  it("위반 없음 → 전부 100", () => {
    const s = computeScores([]);
    expect(s.overall).toBe(100);
    expect(s.dimensions).toEqual({
      color: 100,
      typography: 100,
      spacing: 100,
      layout: 100,
      component: 100,
      icon: 100,
    });
  });

  it("error 1건당 -20, warn 1건당 -8", () => {
    expect(computeScores([r("inline-color", "error", 2)]).dimensions.color).toBe(60); // 100-40
    expect(computeScores([r("bold-overuse", "warn", 1)]).dimensions.typography).toBe(92); // 100-8
  });

  it("0 미만으로 안 내려감(클램프)", () => {
    expect(computeScores([r("inline-color", "error", 10)]).dimensions.color).toBe(0);
  });

  it("한 차원 위반은 다른 차원 점수에 영향 없음", () => {
    const s = computeScores([r("inline-color", "error", 2)]);
    expect(s.dimensions.color).toBe(60);
    expect(s.dimensions.typography).toBe(100);
    expect(s.dimensions.layout).toBe(100);
    expect(s.overall).toBe(93); // round((60+100*5)/6)
  });

  it("rule 이 올바른 차원에 매핑된다", () => {
    expect(computeScores([r("native-interactive", "error", 1)]).dimensions.component).toBe(80);
    expect(computeScores([r("emoji-banned", "error", 1)]).dimensions.icon).toBe(80);
    expect(computeScores([r("non-4pt-spacing", "warn", 1)]).dimensions.spacing).toBe(92);
    expect(computeScores([r("repeated-h1", "error", 1)]).dimensions.typography).toBe(80);
  });

  it("매핑 안 된 rule 은 점수에 반영 안 함(보수적)", () => {
    expect(computeScores([r("totally-made-up-rule", "error", 5)]).overall).toBe(100);
  });

  it("여러 차원 위반이 overall 에 합산된다", () => {
    const s = computeScores([
      r("inline-color", "error", 1), // color 80
      r("native-interactive", "error", 1), // component 80
    ]);
    expect(s.dimensions.color).toBe(80);
    expect(s.dimensions.component).toBe(80);
    expect(s.overall).toBe(93); // round((80+80+100*4)/6)=round(93.33)
  });
});
