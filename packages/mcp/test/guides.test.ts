import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getGuide } from "../src/tools/guides.js";
import { _resetSessionState, principlesAcked } from "../src/tools/session-state.js";
import { DESIGN_DECISIONS_FILE, type DesignDecisionRow } from "../src/tools/design-spec.js";

beforeEach(() => {
  _resetSessionState();
});

describe("getGuide", () => {
  it("supports batched topics and marks principles as called", () => {
    const result = getGuide({ topics: ["principles", "dos-donts"] });

    expect(result.topics).toBeTypeOf("object");
    expect((result.topics as Record<string, unknown>).principles).toBeTypeOf("object");
    expect((result.topics as Record<string, unknown>)["dos-donts"]).toBeTypeOf("object");
    expect(principlesAcked()).toBe(true);
  });

  it("adds a compact principles digest to component guides", () => {
    const result = getGuide({ topic: "component:Button", target: "html" });

    expect(result._principlesDigest).toEqual(
      expect.arrayContaining([
        "No emoji/text-symbol icons; use find_icon + @nudge-design/icons.",
        "Use semantic tokens; avoid raw hex/rgb and raw palette tokens.",
      ]),
    );
  });
});

describe("getGuide aspects (selective principle loading)", () => {
  const aspectKeys = (r: Record<string, unknown>): string[] =>
    Object.keys(r).filter((k) => !k.startsWith("_") && k !== "intent" && k !== "scope");

  it("loads only the requested aspects of principles (radius→shapes alias)", () => {
    const full = getGuide({ topic: "principles" });
    const slim = getGuide({ topic: "principles", aspects: ["spacing", "radius", "typography"] });

    // radius is an alias for the 'shapes' key; color/elevation/etc. must be dropped.
    expect(aspectKeys(slim).sort()).toEqual(["shapes", "spacing", "typography"]);
    expect(slim.spacing).toEqual((full as Record<string, unknown>).spacing);
    expect(slim.colors).toBeUndefined();
    expect(slim.elevation).toBeUndefined();
  });

  it("resolves color→colors and tone→brandTone aliases", () => {
    const slim = getGuide({ topic: "principles", aspects: ["color", "tone"] });
    expect(aspectKeys(slim).sort()).toEqual(["brandTone", "colors"]);
  });

  it("expands dos-donts into dos + donts + bannedPatterns", () => {
    const slim = getGuide({ topic: "principles", aspects: ["dos-donts"] });
    expect(aspectKeys(slim).sort()).toEqual(["bannedPatterns", "donts", "dos"]);
  });

  it("merges aspects with explicit sections", () => {
    const slim = getGuide({ topic: "principles", aspects: ["radius"], sections: ["colors"] });
    expect(aspectKeys(slim).sort()).toEqual(["colors", "shapes"]);
  });

  it("still keeps meta keys and marks principles as called", () => {
    const slim = getGuide({ topic: "principles", aspects: ["spacing"] });
    expect(slim._advisory).toBeTypeOf("string");
    expect(principlesAcked()).toBe(true);
  });

  it("errors with validAspects when no aspect resolves", () => {
    const r = getGuide({ topic: "principles", aspects: ["nonsense"] });
    expect(r.error).toBeTypeOf("string");
    expect(r.validAspects).toEqual(expect.arrayContaining(["spacing", "radius", "typography"]));
  });

  it("proceeds with the known aspects when only some are unknown, surfacing _unknownAspects", () => {
    const slim = getGuide({ topic: "principles", aspects: ["spacing", "nonsense"] });
    expect(aspectKeys(slim)).toEqual(["spacing"]);
    expect(slim._unknownAspects).toEqual(["nonsense"]);
  });

  it("threads aspects through batched topics[]", () => {
    const result = getGuide({ topics: ["principles"], aspects: ["spacing"] });
    const principles = (result.topics as Record<string, Record<string, unknown>>).principles;
    expect(aspectKeys(principles)).toEqual(["spacing"]);
  });

  it("ignores aspects on non-principles topics (no error, full guide returned)", () => {
    const full = getGuide({ topic: "component:Button", target: "html" });
    const withAspects = getGuide({
      topic: "component:Button",
      target: "html",
      aspects: ["nonsense"],
    });
    expect(withAspects.error).toBeUndefined();
    expect(Object.keys(withAspects).sort()).toEqual(Object.keys(full).sort());
  });

  it("does not break sibling topics when batching principles with a component (no section leak)", () => {
    const result = getGuide({
      topics: ["principles", "component:Button"],
      aspects: ["spacing"],
      target: "html",
    });
    const topics = result.topics as Record<string, Record<string, unknown>>;
    expect(aspectKeys(topics.principles)).toEqual(["spacing"]); // principles sliced
    expect(topics["component:Button"].error).toBeUndefined(); // component intact
    expect(topics["component:Button"].name).toBe("Button");
  });
});

describe("getGuide principles — learned principles promotion", () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "learned-principles-"));
  });
  afterEach(() => {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* noop */
    }
  });

  const mk = (intent: string, decision: string, brand = "trost"): DesignDecisionRow => ({
    ts: `t-${intent}`,
    ok: true,
    screen: { brand, surface: "web", intent },
    decisions: [decision],
    rationales: [],
    componentsUsed: [],
    tokensUsed: [],
    hash: intent,
  });
  const seed = (rows: DesignDecisionRow[]): void => {
    fs.writeFileSync(
      path.join(dir, DESIGN_DECISIONS_FILE),
      rows.map((r) => JSON.stringify(r)).join("\n") + "\n",
      "utf-8",
    );
  };

  const decision = "CTA 는 항상 brandSolid";
  const threeScreens = (brand = "trost"): DesignDecisionRow[] => [
    mk("login", decision, brand),
    mk("signup", decision, brand),
    mk("home", decision, brand),
  ];

  it("merges _learnedPrinciples into the principles response when a decision recurs >= threshold", () => {
    seed(threeScreens());
    const r = getGuide({ topic: "principles", brand: "trost", cwd: dir });
    const learned = r._learnedPrinciples as Record<string, unknown> | undefined;
    expect(learned).toBeTypeOf("object");
    expect(learned!.brand).toBe("trost");
    const principles = learned!.principles as Array<{ text: string; count: number }>;
    expect(principles[0]).toMatchObject({ text: decision, count: 3 });
  });

  it("omits _learnedPrinciples below threshold (only 2 screens, default threshold 3)", () => {
    seed([mk("login", decision), mk("signup", decision)]);
    const r = getGuide({ topic: "principles", brand: "trost", cwd: dir });
    expect(r._learnedPrinciples).toBeUndefined();
  });

  it("omits _learnedPrinciples when there is no decision log (no crash)", () => {
    const r = getGuide({ topic: "principles", brand: "trost", cwd: dir });
    expect(r._learnedPrinciples).toBeUndefined();
    expect(r._advisory).toBeTypeOf("string"); // 정상 principles 응답은 그대로
  });

  it("survives aspect/section slicing (marker attached after pickSections)", () => {
    seed(threeScreens());
    const r = getGuide({ topic: "principles", brand: "trost", cwd: dir, aspects: ["spacing"] });
    expect(Object.keys(r)).toContain("spacing");
    expect(r._learnedPrinciples).toBeTypeOf("object");
  });

  it("infers brand from the nudge.brand marker when brand arg is omitted", () => {
    seed(threeScreens());
    fs.writeFileSync(path.join(dir, "nudge.brand"), "trost\n", "utf-8");
    const r = getGuide({ topic: "principles", cwd: dir });
    const learned = r._learnedPrinciples as Record<string, unknown> | undefined;
    expect(learned?.brand).toBe("trost");
  });

  it("respects NUDGE_LEARNED_PRINCIPLES=0 opt-out", () => {
    seed(threeScreens());
    const prev = process.env.NUDGE_LEARNED_PRINCIPLES;
    try {
      process.env.NUDGE_LEARNED_PRINCIPLES = "0";
      const r = getGuide({ topic: "principles", brand: "trost", cwd: dir });
      expect(r._learnedPrinciples).toBeUndefined();
    } finally {
      if (prev === undefined) delete process.env.NUDGE_LEARNED_PRINCIPLES;
      else process.env.NUDGE_LEARNED_PRINCIPLES = prev;
    }
  });
});
