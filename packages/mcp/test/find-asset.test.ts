import { describe, it, expect } from "vitest";
import { findAsset } from "../src/server.js";

/**
 * find_asset — 프로젝트 이미지 검색 + pull-first 정책의 핵심 계약.
 *
 * 배경: "어떤 이미지가 있는지 몰라 못 가져온다" 공백을 메우는 도구. 응답은 항상
 * inlineRef(<img src> 에 그대로 박는 경로) 를 주고, 모든 응답에 _policy(미스 시 placeholder,
 * 프로젝트 이미지 AI 생성 금지) 를 동봉한다.
 */

type Hit = { id: string; inlineRef: string; project: string; category: string };
type AssetResponse = {
  count?: number;
  assets?: Hit[];
  miss?: boolean;
  _onMiss?: string;
  _policy?: string;
  total?: number;
  projects?: Record<string, Record<string, number>>;
};

describe("find_asset", () => {
  it("query+project → 정확한 에셋 inlineRef 를 준다", () => {
    const r = findAsset({ query: "salad", project: "geniet" }) as AssetResponse;
    const salad = r.assets?.find((a) => a.id === "salad");
    expect(salad?.inlineRef).toBe(
      "@nudge-design/assets/files/project/geniet/images/food-types/salad.png",
    );
    expect(salad?.project).toBe("geniet");
  });

  it("한글 별칭('음식') 이 geniet food 에셋으로 매핑된다", () => {
    const r = findAsset({ query: "음식", project: "geniet", limit: 20 }) as AssetResponse;
    expect(r.count).toBeGreaterThan(0);
    // 모두 geniet(또는 shared) 범위 안.
    expect(r.assets?.every((a) => a.project === "geniet" || a.project === "shared")).toBe(true);
    // food-types 카테고리 항목이 결과에 포함된다.
    expect(r.assets?.some((a) => a.category.includes("food-types"))).toBe(true);
  });

  it("id 정확 매치", () => {
    const r = findAsset({ id: "bibimbap" }) as AssetResponse;
    expect(r.assets?.[0]?.id).toBe("bibimbap");
  });

  it("project 별칭(cashpobi) 이 cashwalk-biz 로 해소된다", () => {
    const r = findAsset({ query: "logo", project: "cashpobi" }) as AssetResponse;
    // cashpobi → cashwalk-biz. shared 도 포함되므로 cashwalk-biz/shared 만 나와야 함.
    expect(r.assets?.every((a) => a.project === "cashwalk-biz" || a.project === "shared")).toBe(true);
  });

  it("회귀: 짧은 토큰('three-d' 의 'd')이 무관한 질의를 매치하지 않는다 — MISS 는 MISS", () => {
    const r = findAsset({ query: "dragon-spaceship-xyz" }) as AssetResponse;
    expect(r.miss).toBe(true);
    expect(r.assets).toBeUndefined();
    expect(r._onMiss).toContain("placeholder");
  });

  it("모든 응답에 _policy(pull-first · AI 생성 금지) 가 동봉된다", () => {
    const hit = findAsset({ query: "salad" }) as AssetResponse;
    const miss = findAsset({ query: "zzz-nope-xyz" }) as AssetResponse;
    const index = findAsset({}) as AssetResponse;
    for (const r of [hit, miss, index]) {
      expect(r._policy).toMatch(/find_asset/);
      expect(r._policy).toMatch(/AI/);
    }
  });

  it("인자 없음 → 프로젝트×카테고리 인덱스", () => {
    const r = findAsset({}) as AssetResponse;
    expect(r.total).toBeGreaterThan(0);
    expect(Object.keys(r.projects ?? {})).toContain("geniet");
  });
});
