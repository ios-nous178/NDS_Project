import { describe, expect, it } from "vitest";
import { findComponent, findIcon } from "../src/server";

type Item = Record<string, unknown>;

// find_component / find_icon 의 { query } 미스가 빈 배열([])을 돌려주던 비대칭 버그 회귀 가드.
// []는 외부 에이전트가 "DS 에 컴포넌트/아이콘 없음 → native 직접 작성"으로 오판하게 만들고,
// 그 오판이 taxonomy-gap 신호로 집계되면 컨텍스트 수집 데이터까지 오염된다. { name } 미스
// 경로처럼 { error, suggestions } 객체로 대칭화한다.

describe("find_component({ query }) — 미스 대칭화", () => {
  it("매치 없으면 빈 배열이 아니라 error 객체를 돌려준다", () => {
    const result = findComponent({ query: "zzzznosuchcomponentqq" });
    expect(Array.isArray(result)).toBe(false);
    expect((result as Item).error).toBeTypeOf("string");
    expect((result as Item).suggestions).toBeDefined();
  });

  it("매치가 있으면 기존대로 배열을 돌려준다", () => {
    const result = findComponent({ query: "button" });
    expect(Array.isArray(result)).toBe(true);
    expect((result as Item[]).length).toBeGreaterThan(0);
  });

  it("한글/약어 별칭으로 검색된다 ('버튼' → Button)", () => {
    const result = findComponent({ query: "버튼" }) as Item[];
    expect(Array.isArray(result)).toBe(true);
    expect(result.some((c) => c.name === "Button")).toBe(true);
  });

  it("별칭 'dropdown' 이 Select 를 끌어온다", () => {
    const result = findComponent({ query: "dropdown" }) as Item[];
    expect(Array.isArray(result)).toBe(true);
    expect(result.some((c) => c.name === "Select")).toBe(true);
  });
});

describe("find_icon({ query }) — 미스 대칭화", () => {
  it("매치 없으면 빈 배열이 아니라 error 객체를 돌려준다", async () => {
    const result = await findIcon({ query: "zzzznosuchiconqq" });
    expect(Array.isArray(result)).toBe(false);
    expect((result as Item).error).toBeTypeOf("string");
  });
});
