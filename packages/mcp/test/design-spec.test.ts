import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  appendDesignDecisionRow,
  buildDesignDecisionRow,
  configureDesignSpec,
  DESIGN_DECISIONS_FILE,
  parseDesignSpecInput,
  promoteDesignDecisions,
  readDesignDecisions,
  saveDesignSpec,
  validateDesignSpec,
  type DesignDecisionRow,
  type DesignSpec,
} from "../src/tools/design-spec";

// 테스트용 카탈로그 픽스처 — server.ts 가 manifest 에서 채우는 것을 작게 흉내낸다.
beforeAll(() => {
  configureDesignSpec({
    tokenSet: new Set([
      "--semantic-bg-default",
      "--semantic-text-default",
      "--semantic-button-bg-primary",
      "--color-blue-500",
    ]),
    componentNames: new Set(["Button", "Card", "Chip", "BrandHeader"]),
    brands: new Set(["trost", "geniet", "cashwalk-biz", "nudge-eap", "runmile"]),
    propAllowedValues: new Map([
      ["Button", new Map([["color", ["primary", "secondary", "neutral"]]])],
    ]),
    ndsAttrEnums: new Map([
      ["nds-button", new Map([["color", ["primary", "secondary", "neutral"]]])],
    ]),
  });
});

const validSpec: DesignSpec = {
  screen: { brand: "geniet", surface: "app", intent: "리뷰 상세" },
  tree: [
    {
      component: "Card",
      role: "리뷰 본문",
      tokens: ["--semantic-bg-default", "--semantic-text-default"],
      children: [
        {
          component: "Button",
          role: "primary CTA",
          props: { color: "secondary" },
          rationale: "Geniet secondary = dark inverse",
        },
      ],
    },
  ],
  decisions: ["primary CTA 1개만"],
};

function rules(spec: unknown): string[] {
  return validateDesignSpec(spec).violations.map((v) => v.rule);
}

describe("validateDesignSpec", () => {
  it("accepts a valid lightweight spec (ok:true, no errors)", () => {
    const r = validateDesignSpec(validSpec);
    expect(r.ok).toBe(true);
    expect(r.summary.error).toBe(0);
    expect(r.brand).toBe("geniet");
    expect(r.componentsUsed).toEqual(["Button", "Card"]);
    expect(r.tokensUsed).toContain("--semantic-bg-default");
  });

  it("normalizes a brand alias (cashpobi -> cashwalk-biz)", () => {
    const r = validateDesignSpec({
      ...validSpec,
      screen: { brand: "cashpobi", surface: "web", intent: "x" },
    });
    expect(r.brand).toBe("cashwalk-biz");
    expect(r.violations.map((v) => v.rule)).not.toContain("unknown-brand");
  });

  it("flags an unknown brand slug (guards the base-blue silent fallback)", () => {
    const r = validateDesignSpec({
      ...validSpec,
      screen: { brand: "totally-made-up", surface: "app", intent: "x" },
    });
    expect(r.violations.map((v) => v.rule)).toContain("unknown-brand");
    expect(r.ok).toBe(false);
  });

  it("flags an invalid surface", () => {
    expect(
      rules({ ...validSpec, screen: { brand: "geniet", surface: "tablet", intent: "x" } }),
    ).toContain("invalid-surface");
  });

  it("flags a raw hex token (semantic-token-only enforcement)", () => {
    const spec = {
      ...validSpec,
      tree: [{ component: "Card", tokens: ["#ffffff"] }],
    };
    expect(rules(spec)).toContain("raw-hex-token");
  });

  it("flags an unknown token name", () => {
    const spec = {
      ...validSpec,
      tree: [{ component: "Card", tokens: ["--semantic-does-not-exist"] }],
    };
    expect(rules(spec)).toContain("unknown-token");
  });

  it("warns on a raw palette token (prefer semantic)", () => {
    const spec = {
      ...validSpec,
      tree: [{ component: "Card", tokens: ["--color-blue-500"] }],
    };
    expect(rules(spec)).toContain("raw-palette-token");
  });

  it("flags an invalid prop enum value", () => {
    const spec = {
      ...validSpec,
      tree: [{ component: "Button", role: "x", props: { color: "rainbow" } }],
    };
    expect(rules(spec)).toContain("invalid-prop-value");
  });

  it("resolves an nds-tag to its DS component (shared scene.ts vocabulary)", () => {
    const r = validateDesignSpec({
      ...validSpec,
      tree: [{ component: "nds-button", role: "cta", props: { color: "primary" } }],
    });
    expect(r.componentsUsed).toContain("Button");
    expect(r.violations.map((v) => v.rule)).not.toContain("unknown-component");
  });

  it("flags an invalid enum on the nds-tag form too", () => {
    const r = validateDesignSpec({
      ...validSpec,
      tree: [{ component: "nds-button", role: "cta", props: { color: "rainbow" } }],
    });
    expect(r.violations.map((v) => v.rule)).toContain("invalid-prop-value");
  });

  it("warns (not errors) on an unknown component", () => {
    const r = validateDesignSpec({
      ...validSpec,
      tree: [{ component: "TotallyFakeWidget", role: "x" }],
    });
    expect(r.violations.map((v) => v.rule)).toContain("unknown-component");
    expect(r.ok).toBe(true); // warn only — not a ship-blocker
  });

  it("does not warn on layout primitives", () => {
    const r = validateDesignSpec({
      ...validSpec,
      tree: [{ component: "Stack", children: [{ component: "Card", role: "x" }] }],
    });
    expect(r.violations.map((v) => v.rule)).not.toContain("unknown-component");
  });

  it("requires screen + tree (missing-field errors)", () => {
    const r = validateDesignSpec({});
    const ruleSet = r.violations.map((v) => v.rule);
    expect(ruleSet).toContain("missing-field");
    expect(r.ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(validateDesignSpec(null).ok).toBe(false);
    expect(validateDesignSpec("nope").ok).toBe(false);
    expect(validateDesignSpec([]).ok).toBe(false);
  });

  it("requires a page pattern for a cashwalk-biz admin screen", () => {
    const r = validateDesignSpec({
      ...validSpec,
      screen: { brand: "cashwalk-biz", surface: "web", intent: "정산 목록", surfaceKind: "admin" },
    });
    expect(r.violations.map((v) => v.rule)).toContain("cashwalk-biz-admin-page-pattern");
    expect(r.ok).toBe(false);
  });

  it("accepts a cashwalk-biz admin screen with a valid page pattern", () => {
    const r = validateDesignSpec({
      ...validSpec,
      screen: {
        brand: "cashwalk-biz",
        surface: "web",
        intent: "정산 목록",
        surfaceKind: "admin",
        pagePattern: "list",
      },
    });
    expect(r.violations.map((v) => v.rule)).not.toContain("cashwalk-biz-admin-page-pattern");
    expect(r.ok).toBe(true);
  });

  it("flags an unknown page pattern value on a cashwalk-biz admin screen", () => {
    const r = validateDesignSpec({
      ...validSpec,
      screen: {
        brand: "cashpobi",
        surface: "web",
        intent: "보드",
        surfaceKind: "admin",
        pagePattern: "kanban",
      },
    });
    const hit = r.violations.find((v) => v.rule === "cashwalk-biz-admin-page-pattern");
    expect(hit?.severity).toBe("error");
  });

  it("does NOT require a page pattern for a non-admin cashwalk-biz screen", () => {
    const r = validateDesignSpec({
      ...validSpec,
      screen: {
        brand: "cashwalk-biz",
        surface: "web",
        intent: "프로모션 홈",
        surfaceKind: "service",
      },
    });
    expect(r.violations.map((v) => v.rule)).not.toContain("cashwalk-biz-admin-page-pattern");
  });

  it("does NOT require a page pattern for another brand's admin screen", () => {
    const r = validateDesignSpec({
      ...validSpec,
      screen: { brand: "trost", surface: "web", intent: "관리", surfaceKind: "admin" },
    });
    expect(r.violations.map((v) => v.rule)).not.toContain("cashwalk-biz-admin-page-pattern");
  });
});

describe("parseDesignSpecInput", () => {
  it("parses a JSON string", () => {
    const { spec, parseError } = parseDesignSpecInput(JSON.stringify(validSpec));
    expect(parseError).toBeNull();
    expect((spec as DesignSpec).screen.brand).toBe("geniet");
  });

  it("passes an object through unchanged", () => {
    const { spec, parseError } = parseDesignSpecInput(validSpec);
    expect(parseError).toBeNull();
    expect(spec).toBe(validSpec);
  });

  it("reports a parse error on malformed JSON", () => {
    const { parseError } = parseDesignSpecInput("{ not json");
    expect(parseError).not.toBeNull();
  });
});

describe("saveDesignSpec", () => {
  let dir: string;
  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-spec-"));
  });
  afterAll(() => {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* noop */
    }
  });

  it("writes design-spec.json and returns the path + validation", () => {
    const r = saveDesignSpec({ spec: validSpec, cwd: dir });
    expect(r.written).toBe(true);
    expect(r.path).toBe(path.join(dir, "design-spec.json"));
    expect(r.ok).toBe(true);
    const onDisk = JSON.parse(fs.readFileSync(r.path!, "utf-8")) as DesignSpec;
    expect(onDisk.screen.brand).toBe("geniet");
  });

  it("writes the file even when invalid (inspectable), but ok:false", () => {
    const r = saveDesignSpec({
      spec: { ...validSpec, screen: { brand: "totally-made-up", surface: "app", intent: "x" } },
      cwd: dir,
    });
    expect(r.written).toBe(true);
    expect(r.ok).toBe(false);
    expect(r.summary.hasErrors).toBe(true);
  });

  it("returns a parse error (and does not write) on malformed JSON string", () => {
    const r = saveDesignSpec({ spec: "{ broken", cwd: dir });
    expect(r.written).toBe(false);
    expect(r.violations.map((v) => v.rule)).toContain("invalid-json");
  });
});

describe("design decision log", () => {
  const okResult = {
    ok: true,
    componentsUsed: ["Button", "Card"],
    tokensUsed: ["--semantic-bg-default"],
  };

  describe("buildDesignDecisionRow (pure)", () => {
    it("extracts screen decisions + per-node rationale (with tree paths)", () => {
      const row = buildDesignDecisionRow(validSpec, okResult as never, "2026-06-02T00:00:00.000Z");
      expect(row).not.toBeNull();
      expect(row!.decisions).toEqual(["primary CTA 1개만"]);
      expect(row!.rationales).toEqual([
        {
          path: "tree[0].children[0]",
          component: "Button",
          rationale: "Geniet secondary = dark inverse",
        },
      ]);
      expect(row!.screen).toMatchObject({ brand: "geniet", surface: "app", intent: "리뷰 상세" });
      expect(row!.ok).toBe(true);
      expect(row!.ts).toBe("2026-06-02T00:00:00.000Z");
      expect(row!.hash).toMatch(/^[0-9a-f]{12}$/);
    });

    it("returns null when there is no decision content (decision log, not save log)", () => {
      const bare: DesignSpec = {
        screen: { brand: "geniet", surface: "app", intent: "x" },
        tree: [{ component: "Card" }],
      };
      expect(buildDesignDecisionRow(bare, okResult as never, "t")).toBeNull();
    });

    it("logs a spec that has only node rationale (no screen decisions)", () => {
      const onlyRationale: DesignSpec = {
        screen: { brand: "geniet", surface: "app", intent: "x" },
        tree: [{ component: "Card", rationale: "본문 카드" }],
      };
      const row = buildDesignDecisionRow(onlyRationale, okResult as never, "t");
      expect(row).not.toBeNull();
      expect(row!.decisions).toEqual([]);
      expect(row!.rationales).toHaveLength(1);
    });

    it("rejects non-object specs", () => {
      expect(buildDesignDecisionRow(null, okResult as never, "t")).toBeNull();
      expect(buildDesignDecisionRow("nope", okResult as never, "t")).toBeNull();
    });
  });

  describe("appendDesignDecisionRow + readDesignDecisions (IO)", () => {
    let dir: string;
    beforeAll(() => {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-decisions-"));
    });
    afterAll(() => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        /* noop */
      }
    });

    const mk = (decisions: string[], ts: string): DesignDecisionRow =>
      buildDesignDecisionRow({ ...validSpec, decisions }, okResult as never, ts)!;

    it("appends rows and reads them back in order", () => {
      expect(appendDesignDecisionRow(dir, mk(["a"], "t1"))).toBe(true);
      expect(appendDesignDecisionRow(dir, mk(["b"], "t2"))).toBe(true);
      const rows = readDesignDecisions(dir);
      expect(rows.map((r) => r.decisions[0])).toEqual(["a", "b"]);
      expect(fs.existsSync(path.join(dir, DESIGN_DECISIONS_FILE))).toBe(true);
    });

    it("skips a duplicate of the immediately-previous row (auto-fix re-save guard)", () => {
      const before = readDesignDecisions(dir).length;
      const dup = mk(["b"], "t3-different-ts"); // same content as last → same hash
      expect(appendDesignDecisionRow(dir, dup)).toBe(false);
      expect(readDesignDecisions(dir)).toHaveLength(before);
    });

    it("appends again once the decision content actually changes", () => {
      const before = readDesignDecisions(dir).length;
      expect(appendDesignDecisionRow(dir, mk(["c"], "t4"))).toBe(true);
      expect(readDesignDecisions(dir)).toHaveLength(before + 1);
    });

    it("skips array-shaped corrupt lines on read (typeof [] === 'object' guard)", () => {
      const corruptDir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-corrupt-"));
      fs.writeFileSync(
        path.join(corruptDir, DESIGN_DECISIONS_FILE),
        ["[1,2]", JSON.stringify(mk(["x"], "t")), "{ not json"].join("\n") + "\n",
      );
      const rows = readDesignDecisions(corruptDir);
      expect(rows).toHaveLength(1);
      expect(rows[0].decisions).toEqual(["x"]);
      fs.rmSync(corruptDir, { recursive: true, force: true });
    });
  });

  describe("validity transition + cap + interleaved screens", () => {
    const row = (spec: DesignSpec, ok: boolean, ts: string): DesignDecisionRow =>
      buildDesignDecisionRow(spec, { ok, componentsUsed: [], tokensUsed: [] } as never, ts)!;

    it("records an ok:false → ok:true transition as a new row (same decisions)", () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-okflip-"));
      expect(appendDesignDecisionRow(dir, row(validSpec, false, "t1"))).toBe(true);
      // identical decisions/rationale but now valid → different hash → must append
      expect(appendDesignDecisionRow(dir, row(validSpec, true, "t2"))).toBe(true);
      const rows = readDesignDecisions(dir);
      expect(rows.map((r) => r.ok)).toEqual([false, true]);
      fs.rmSync(dir, { recursive: true, force: true });
    });

    it("caps the file to maxRows, dropping the oldest", () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-cap-"));
      for (const d of ["a", "b", "c", "d"]) {
        appendDesignDecisionRow(
          dir,
          row({ ...validSpec, decisions: [d] }, true, `t-${d}`),
          undefined,
          2,
        );
      }
      const rows = readDesignDecisions(dir);
      expect(rows).toHaveLength(2);
      expect(rows.map((r) => r.decisions[0])).toEqual(["c", "d"]);
      fs.rmSync(dir, { recursive: true, force: true });
    });

    it("dedups per-screen, so re-saving an earlier screen unchanged is skipped", () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-interleave-"));
      const A: DesignSpec = {
        screen: { brand: "geniet", surface: "app", intent: "A" },
        tree: [{ component: "Card", rationale: "a" }],
      };
      const B: DesignSpec = {
        screen: { brand: "geniet", surface: "web", intent: "B" },
        tree: [{ component: "Card", rationale: "b" }],
      };
      expect(appendDesignDecisionRow(dir, row(A, true, "t1"))).toBe(true);
      expect(appendDesignDecisionRow(dir, row(B, true, "t2"))).toBe(true);
      // A again, unchanged → compared against the last A row (not the global last B) → skip
      expect(appendDesignDecisionRow(dir, row(A, true, "t3"))).toBe(false);
      expect(readDesignDecisions(dir)).toHaveLength(2);
      fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  describe("saveDesignSpec integration", () => {
    let dir: string;
    beforeAll(() => {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-save-decisions-"));
    });
    afterAll(() => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        /* noop */
      }
    });

    it("accumulates a decision row next to design-spec.json on save", () => {
      saveDesignSpec({ spec: validSpec, cwd: dir });
      const rows = readDesignDecisions(dir);
      expect(rows).toHaveLength(1);
      expect(rows[0].decisions).toEqual(["primary CTA 1개만"]);
      expect(rows[0].rationales[0].rationale).toBe("Geniet secondary = dark inverse");
    });

    it("does not write a row for a spec with no decisions/rationale", () => {
      const bareDir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-bare-"));
      saveDesignSpec({
        spec: {
          screen: { brand: "geniet", surface: "app", intent: "x" },
          tree: [{ component: "Card" }],
        },
        cwd: bareDir,
      });
      expect(readDesignDecisions(bareDir)).toHaveLength(0);
      expect(fs.existsSync(path.join(bareDir, DESIGN_DECISIONS_FILE))).toBe(false);
      fs.rmSync(bareDir, { recursive: true, force: true });
    });

    it("injects screen.pagePattern from nudge.pagePattern marker when omitted (cashwalk-biz admin)", () => {
      const ppDir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-pp-"));
      fs.writeFileSync(path.join(ppDir, "nudge.pagePattern"), "list\n", "utf8");
      const res = saveDesignSpec({
        spec: {
          screen: {
            brand: "cashwalk-biz",
            surface: "web",
            intent: "배너 광고 목록",
            surfaceKind: "admin",
          },
          tree: [{ component: "Card" }],
        },
        cwd: ppDir,
      });
      // 마커가 주입돼 캐포비 어드민 Page Pattern 게이트를 통과(에러 0).
      expect(res.ok).toBe(true);
      const written = JSON.parse(fs.readFileSync(path.join(ppDir, "design-spec.json"), "utf8"));
      expect(written.screen.pagePattern).toBe("list");
      fs.rmSync(ppDir, { recursive: true, force: true });
    });

    it("respects an explicitly declared pagePattern over the marker", () => {
      const ppDir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-pp2-"));
      fs.writeFileSync(path.join(ppDir, "nudge.pagePattern"), "list\n", "utf8");
      saveDesignSpec({
        spec: {
          screen: {
            brand: "cashwalk-biz",
            surface: "web",
            intent: "캠페인 상세",
            surfaceKind: "admin",
            pagePattern: "detail",
          },
          tree: [{ component: "Card" }],
        },
        cwd: ppDir,
      });
      const written = JSON.parse(fs.readFileSync(path.join(ppDir, "design-spec.json"), "utf8"));
      expect(written.screen.pagePattern).toBe("detail");
      fs.rmSync(ppDir, { recursive: true, force: true });
    });
  });
});

describe("promoteDesignDecisions (Decision Log → Principles)", () => {
  const row = (over: Partial<DesignDecisionRow> & { ts: string }): DesignDecisionRow => ({
    ts: over.ts,
    ok: over.ok ?? true,
    screen: over.screen ?? { brand: "trost", surface: "web", intent: "화면" },
    decisions: over.decisions ?? [],
    rationales: over.rationales ?? [],
    componentsUsed: [],
    tokensUsed: [],
    hash: over.hash ?? Math.random().toString(36).slice(2),
  });

  // 같은 결정을 N개의 '서로 다른' 화면에 박는다.
  const screensWith = (decision: string, n: number, brand = "trost"): DesignDecisionRow[] =>
    Array.from({ length: n }, (_, i) =>
      row({
        ts: `t${i}`,
        screen: { brand, surface: "web", intent: `화면-${i}` },
        decisions: [decision],
      }),
    );

  it("promotes a decision repeated across >= threshold distinct screens", () => {
    const out = promoteDesignDecisions(screensWith("CTA 는 brandSolid", 3), {
      brand: "trost",
      threshold: 3,
    });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ text: "CTA 는 brandSolid", count: 3, kind: "decision" });
  });

  it("does NOT promote below threshold", () => {
    expect(
      promoteDesignDecisions(screensWith("드문 결정", 2), { brand: "trost", threshold: 3 }),
    ).toEqual([]);
  });

  it("counts distinct screens only — re-saves of the same screen do not inflate count", () => {
    const rows = [
      row({ ts: "t1", screen: { brand: "trost", intent: "동일화면" }, decisions: ["반복 결정"] }),
      row({ ts: "t2", screen: { brand: "trost", intent: "동일화면" }, decisions: ["반복 결정"] }),
      row({ ts: "t3", screen: { brand: "trost", intent: "동일화면" }, decisions: ["반복 결정"] }),
    ];
    // 같은 화면 3행 → 화면 1개 → threshold 3 미달.
    expect(promoteDesignDecisions(rows, { brand: "trost", threshold: 3 })).toEqual([]);
  });

  it("filters by brand (alias normalized) and excludes other brands", () => {
    const rows = [
      ...screensWith("캐포비 규칙", 3, "cashwalk-biz"),
      ...screensWith("지니어트 규칙", 3, "geniet"),
    ];
    const out = promoteDesignDecisions(rows, { brand: "cashpobi", threshold: 3 }); // alias → cashwalk-biz
    expect(out.map((p) => p.text)).toEqual(["캐포비 규칙"]);
  });

  it("promotes recurring node rationale with its source components", () => {
    const rows = Array.from({ length: 3 }, (_, i) =>
      row({
        ts: `t${i}`,
        screen: { brand: "trost", intent: `화면-${i}` },
        rationales: [{ path: "tree[0]", component: "Button", rationale: "주목도 우선" }],
      }),
    );
    const out = promoteDesignDecisions(rows, { brand: "trost", threshold: 3 });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ kind: "rationale", count: 3, components: ["Button"] });
  });

  it("ignores ok=false rows by default (okOnly)", () => {
    const rows = screensWith("미통과 결정", 3).map((r) => ({ ...r, ok: false }));
    expect(promoteDesignDecisions(rows, { brand: "trost", threshold: 3 })).toEqual([]);
  });

  it("sorts by count desc and caps at max", () => {
    const rows = [...screensWith("자주", 4), ...screensWith("가끔", 3)];
    const out = promoteDesignDecisions(rows, { brand: "trost", threshold: 3, max: 1 });
    expect(out).toHaveLength(1);
    expect(out[0].text).toBe("자주");
    expect(out[0].count).toBe(4);
  });
});
