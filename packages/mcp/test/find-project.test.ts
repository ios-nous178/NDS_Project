import { describe, it, expect } from "vitest";
import { findToken } from "../src/server.js";

/**
 * find_token project scoping — 멀티프로젝트 목업 시 프로젝트 고유 토큰 가시성 +
 * shared 시멘틱의 프로젝트별 값 해석. (feat: project= 옵션)
 *
 * 핵심 계약:
 *  - project 미지정 → base(shared)만. 프로젝트 고유 토큰은 절대 누출되지 않음(크로스프로젝트 오추천 방지).
 *  - project 지정 → shared + 그 프로젝트 고유 토큰. shared 시멘틱은 그 프로젝트 실제 값으로 치환.
 */
describe("find_token project scoping", () => {
  it("프로젝트 고유 토큰(mint)은 project 미지정 시 노출되지 않는다", () => {
    const r = findToken({ query: "mint" }) as Array<{ name: string }>;
    expect(r.length).toBe(0);
  });

  it("project=geniet 면 mint 가 보이고 raw palette 로 deprioritize 된다", () => {
    const r = findToken({ query: "mint", project: "geniet" }) as Array<{
      name: string;
      value: string;
      avoid?: string;
    }>;
    const mint500 = r.find((t) => t.name === "--color-mint-500");
    expect(mint500?.value).toBe("#48C2C5");
    // 시멘틱 우선 규칙 유지 — 원색은 추천이 아니라 회피 플래그와 함께 노출
    expect(mint500?.avoid).toBeTruthy();
  });

  it("shared 시멘틱은 project 값으로 치환되고 base 값은 baseValue 로 보존된다", () => {
    const [g] = findToken({ query: "button-bg-default", project: "geniet" }) as Array<{
      name: string;
      value: string;
      baseValue?: string;
      project?: string;
    }>;
    expect(g.name).toBe("--semantic-button-bg-default");
    expect(g.value).toBe("#00A8AC"); // geniet — 프로젝트 액션 색 = mint/600
    expect(g.baseValue).toBe("#2B96ED"); // nudge base
    expect(g.project).toBe("geniet");
  });

  it("동일 시멘틱이 project 미지정 시 base 값을 그대로 반환한다(회귀 없음)", () => {
    const [b] = findToken({ query: "button-bg-default" }) as Array<{
      value: string;
      project?: string;
      baseValue?: string;
    }>;
    expect(b.value).toBe("#2B96ED");
    expect(b.project).toBeUndefined();
    expect(b.baseValue).toBeUndefined();
  });

  it("base = shared-only, project 풀 = shared + 고유 토큰(superset)", () => {
    const base = findToken({}) as { total: number; project?: string };
    const cashpobi = findToken({ project: "cashpobi" }) as {
      total: number;
      project: string;
      requestedProject: string;
    };
    expect(base.project).toBeUndefined();
    expect(cashpobi.project).toBe("cashwalk-biz");
    expect(cashpobi.requestedProject).toBe("cashpobi");
    expect(cashpobi.total).toBeGreaterThan(base.total);
  });
});
