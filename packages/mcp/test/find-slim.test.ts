import { describe, expect, it } from "vitest";
import { findIcon, findToken } from "../src/server";

type Item = Record<string, unknown>;

describe("find_token({ query }) — slim response (token saving)", () => {
  it("drops score from every item and flags only raw palette tokens", () => {
    const result = findToken({ query: "blue" });
    expect(Array.isArray(result)).toBe(true);
    const items = result as Item[];
    expect(items.length).toBeGreaterThan(0);

    // score 는 정렬용 — 출력엔 싣지 않는다
    expect(items.every((t) => !("score" in t))).toBe(true);

    // raw palette(--color-blue-*) 에만 avoid 플래그, semantic 토큰엔 없어야 한다
    const raw = items.find((t) => /^--color-blue-/.test(t.name as string));
    expect(raw).toBeDefined();
    expect(raw?.avoid).toBeTypeOf("string");
    expect(items.filter((t) => t.group === "semantic").every((t) => !("avoid" in t))).toBe(true);
  });
});

describe("find_icon({ query }) — slim response (token saving)", () => {
  it("returns only name(+category) — no inline svg / style / pair / categoryLabel / score", async () => {
    const result = await findIcon({ query: "check" });
    expect(Array.isArray(result)).toBe(true);
    const items = result as Item[];
    expect(items.length).toBeGreaterThan(0);

    const allowedKeys = new Set(["name", "category"]);
    for (const item of items) {
      expect(item.name).toBeTypeOf("string");
      for (const key of Object.keys(item)) {
        expect(allowedKeys.has(key)).toBe(true);
      }
    }
  });
});
