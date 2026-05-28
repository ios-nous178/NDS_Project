import { beforeEach, describe, expect, it } from "vitest";
import { getGuide } from "../src/tools/guides.js";
import { _resetSessionState, principlesAcked } from "../src/tools/session-state.js";

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
