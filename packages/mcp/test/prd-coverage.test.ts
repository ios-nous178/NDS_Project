import { describe, expect, it } from "vitest";
import { validatePrdCoverage } from "@nudge-design/mockup-core/tools/prd-coverage";

describe("validatePrdCoverage", () => {
  it("flags missing PRD coverage manifest", () => {
    const result = validatePrdCoverage({ source: `<main id="screen"></main>` });

    expect(result.ok).toBe(false);
    expect(result.summary.hasManifest).toBe(false);
    expect(result.violationsByRule[0]?.rule).toBe("prd-coverage-incomplete");
  });

  it("flags incomplete PRD coverage entries", () => {
    const result = validatePrdCoverage({
      source: `
        <main id="screen"></main>
        <script type="application/json" data-prd-coverage>
          {"requirements":[{"id":"R1","requirement":"지역 추가 모달","status":"todo","evidence":"#missing"}]}
        </script>
      `,
    });

    expect(result.ok).toBe(false);
    expect(result.summary.requirements).toBe(1);
    expect(result.summary.implemented).toBe(0);
    expect(result.violations[0]?.detail).toContain("R1");
  });

  it("accepts implemented entries with existing evidence selectors", () => {
    const result = validatePrdCoverage({
      source: `
        <main id="screen"></main>
        <script type="application/json" data-prd-coverage>
          {"requirements":[{"id":"R1","requirement":"화면 본문","status":"implemented","evidence":"#screen"}]}
        </script>
      `,
    });

    expect(result.ok).toBe(true);
    expect(result.summary).toMatchObject({
      requirements: 1,
      implemented: 1,
      missing: 0,
      hasManifest: true,
    });
  });
});
