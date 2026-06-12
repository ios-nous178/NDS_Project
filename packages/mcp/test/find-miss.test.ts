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

  // 주소 손조립 재발 방지: 작성자가 검색하는 한글/도메인 용어가 AddressPicker 로 라우팅돼야 한다.
  it.each(["주소", "우편번호", "도로명", "지번"])(
    "'%s' 별칭이 AddressPicker 를 끌어온다",
    (query) => {
      const result = findComponent({ query }) as Item[];
      expect(Array.isArray(result)).toBe(true);
      expect(result.some((c) => c.name === "AddressPicker")).toBe(true);
    },
  );
});

describe("find_icon({ query }) — 미스 대칭화", () => {
  it("매치 없으면 빈 배열이 아니라 error 객체를 돌려준다", async () => {
    const result = await findIcon({ query: "zzzznosuchiconqq" });
    expect(Array.isArray(result)).toBe(false);
    expect((result as Item).error).toBeTypeOf("string");
  });
});

// 소셜/간편 로그인 로고는 아이콘이 아니라 sns-logos 자산이다. find_icon 으로 찾으면 0 매치라
// 작성자가 이니셜/이모지로 때우거나 계속 헛삽질했다("계속 못 가져오네"). social-brand 질의는
// 에러가 아니라 자산 경로 + pattern:social-login 으로 리다이렉트해야 한다.
describe("find_icon — 소셜 로그인 → sns-logos 자산 리다이렉트", () => {
  it.each(["kakao", "naver", "google", "apple", "카카오", "소셜 로그인", "간편로그인"])(
    "'%s' 질의는 sns-logos 자산으로 리다이렉트한다",
    async (query) => {
      const result = (await findIcon({ query })) as Item;
      expect(Array.isArray(result)).toBe(false);
      expect(result.redirect).toBe("sns-logos (asset, not icon)");
      expect(result.assets).toMatch(/sns-logos/);
      expect(result.example).toMatch(/@nudge-design\/assets\/files\/shared\/sns-logos\//);
      expect(JSON.stringify(result.seeAlso)).toMatch(/pattern:social-login/);
    },
  );

  it("find_icon({ name: 'kakao' }) 도 자산으로 리다이렉트한다", async () => {
    const result = (await findIcon({ name: "kakao" })) as Item;
    expect(result.redirect).toBe("sns-logos (asset, not icon)");
  });

  it("소셜과 무관한 질의는 평소대로 동작(리다이렉트 안 함)", async () => {
    const result = await findIcon({ query: "arrow" });
    expect(Array.isArray(result)).toBe(true);
  });
});
