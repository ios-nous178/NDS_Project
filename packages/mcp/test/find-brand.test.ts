import { describe, it, expect } from "vitest";
import { findToken } from "../src/server.js";

/**
 * find_token brand scoping — 멀티브랜드 목업 시 브랜드 고유 토큰 가시성 +
 * shared 시멘틱의 브랜드별 값 해석. (feat: brand= 옵션)
 *
 * 핵심 계약:
 *  - brand 미지정 → base(shared)만. 브랜드 고유 토큰은 절대 누출되지 않음(크로스브랜드 오추천 방지).
 *  - brand 지정 → shared + 그 브랜드 고유 토큰. shared 시멘틱은 그 브랜드 실제 값으로 치환.
 */
describe("find_token brand scoping", () => {
  it("브랜드 고유 토큰(mint)은 brand 미지정 시 노출되지 않는다", () => {
    const r = findToken({ query: "mint" }) as Array<{ name: string }>;
    expect(r.length).toBe(0);
  });

  it("brand=geniet 면 mint 가 보이고 raw palette 로 deprioritize 된다", () => {
    const r = findToken({ query: "mint", brand: "geniet" }) as Array<{
      name: string;
      value: string;
      avoid?: string;
    }>;
    const mint500 = r.find((t) => t.name === "--color-mint-500");
    expect(mint500?.value).toBe("#48C2C5");
    // 시멘틱 우선 규칙 유지 — 원색은 추천이 아니라 회피 플래그와 함께 노출
    expect(mint500?.avoid).toBeTruthy();
  });

  it("shared 시멘틱은 brand 값으로 치환되고 base 값은 baseValue 로 보존된다", () => {
    const [g] = findToken({ query: "button-bg-default", brand: "geniet" }) as Array<{
      name: string;
      value: string;
      baseValue?: string;
      brand?: string;
    }>;
    expect(g.name).toBe("--semantic-button-bg-default");
    expect(g.value).toBe("#00A8AC"); // geniet — 브랜드 액션 색 = mint/600
    expect(g.baseValue).toBe("#2B96ED"); // nudge base
    expect(g.brand).toBe("geniet");
  });

  it("동일 시멘틱이 brand 미지정 시 base 값을 그대로 반환한다(회귀 없음)", () => {
    const [b] = findToken({ query: "button-bg-default" }) as Array<{
      value: string;
      brand?: string;
      baseValue?: string;
    }>;
    expect(b.value).toBe("#2B96ED");
    expect(b.brand).toBeUndefined();
    expect(b.baseValue).toBeUndefined();
  });

  it("base = shared-only, brand 풀 = shared + 고유 토큰(superset)", () => {
    const base = findToken({}) as { total: number; brand?: string };
    const cashpobi = findToken({ brand: "cashpobi" }) as {
      total: number;
      brand: string;
      requestedBrand: string;
    };
    expect(base.brand).toBeUndefined();
    expect(cashpobi.brand).toBe("cashwalk-biz");
    expect(cashpobi.requestedBrand).toBe("cashpobi");
    expect(cashpobi.total).toBeGreaterThan(base.total);
  });
});
