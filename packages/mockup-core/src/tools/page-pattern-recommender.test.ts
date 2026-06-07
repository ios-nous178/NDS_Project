import { test } from "node:test";
import assert from "node:assert/strict";
import { recommendPagePattern, PAGE_PATTERN_SELECTION } from "./page-pattern-recommender.js";
import { CASHWALK_BIZ_PAGE_PATTERNS } from "./standalone-assets.js";

test("선택 테이블 키 집합은 CASHWALK_BIZ_PAGE_PATTERNS 와 1:1 (드리프트 방지)", () => {
  const tablePatterns = PAGE_PATTERN_SELECTION.map((s) => s.pattern).sort();
  const enumPatterns = [...CASHWALK_BIZ_PAGE_PATTERNS].sort();
  assert.deepEqual(tablePatterns, enumPatterns);
  // 중복 없음
  assert.equal(new Set(tablePatterns).size, tablePatterns.length);
});

test("대표 PRD → 기대 패턴이 top + confident", () => {
  const cases: Array<{ prd: string; expect: string }> = [
    { prd: "관리자 로그인 화면. 이메일/비밀번호 입력 후 로그인.", expect: "onboarding" },
    { prd: "광고주 회원가입 폼 — 본인인증 후 가입하기.", expect: "onboarding" },
    { prd: "전체 현황을 한눈에 보는 대시보드. KPI 지표와 차트.", expect: "dashboard" },
    {
      prd: "배너 광고 목록 화면. 검색/필터/페이지네이션, 상태 배지와 노출 토글.",
      expect: "list",
    },
    {
      prd: "신규 캠페인 등록 — 광고 → 소재를 단계별(step)로 생성하는 마법사.",
      expect: "form",
    },
  ];
  for (const c of cases) {
    const r = recommendPagePattern(c.prd);
    assert.equal(r.top, c.expect, `PRD="${c.prd}" → top`);
    assert.equal(r.confident, true, `PRD="${c.prd}" → confident`);
    assert.equal(r.ranked.length, 5);
    // ranked 는 점수 내림차순
    for (let i = 1; i < r.ranked.length; i++) {
      assert.ok(r.ranked[i - 1].score >= r.ranked[i].score);
    }
    // top 후보에 근거 키워드가 채워짐
    assert.ok(r.ranked[0].matchedKeywords.length > 0);
  }
});

test("상세 PRD 가 '목록' 을 언급해도 detail 이 top (역신호 없음)", () => {
  const r = recommendPagePattern(
    "캠페인 상세 화면. 목록에서 row 클릭 후 진입해 상세 정보를 보고 수정/삭제.",
  );
  assert.equal(r.top, "detail");
});

test("키워드 없는 PRD → top=null, confident=false, 5종 모두 0점", () => {
  const r = recommendPagePattern("아무말 잡담 텍스트입니다.");
  assert.equal(r.top, null);
  assert.equal(r.confident, false);
  assert.ok(r.ranked.every((c) => c.score === 0));
  assert.match(r.reason, /직접 선택/);
});

test("빈/누락 PRD 도 throw 하지 않고 보류로 처리", () => {
  for (const prd of ["", "   ", undefined as unknown as string]) {
    const r = recommendPagePattern(prd);
    assert.equal(r.top, null);
    assert.equal(r.confident, false);
  }
});

test("경쟁 패턴이 비등하면 confident=false (모호 → 사용자 확정)", () => {
  // list(목록=3) 와 form(등록=3) 가 동점 → 격차 0 < margin → 확신 낮음
  const r = recommendPagePattern("목록 등록");
  assert.equal(r.confident, false);
  // 동점이면 패턴 정의 순서(list 가 form 보다 앞)로 안정 정렬
  assert.equal(r.top, "list");
});
