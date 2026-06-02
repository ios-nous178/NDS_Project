import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  configureDesignSpec,
  parseDesignSpecInput,
  saveDesignSpec,
  validateDesignSpec,
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
      ["Button", new Map([["color", ["primary", "secondary", "assistive"]]])],
    ]),
    ndsAttrEnums: new Map([
      ["nds-button", new Map([["color", ["primary", "secondary", "assistive"]]])],
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
