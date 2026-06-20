import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlMockup, validateHtmlSource } from "./html-validator.js";

/**
 * region-as-chip 룰.
 * 회고: 캐포비 타겟팅 폼의 '특정 지역' 선택 결과를 노란 outlined <nds-chip>(`강원특별자치도 > 강릉시 ✕`)
 * 으로 인라인 나열한 잘못된 목업이 생성됐다. 지역 경로(시/도 > 시/군/구)가 든 Chip 은 SelectionButton 과
 * 혼동되고 '추가 선택/선택 해제'·개수 강조·개별 제거가 빠진다 — SelectedItemsPanel + RegionRow 가 SSOT.
 */

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

const WRONG = `<html data-project="cashwalk-biz"><body>
  <div class="field">지역
    <nds-chip>강원특별자치도 &gt; 강릉시</nds-chip>
    <nds-chip>강원특별자치도 &gt; 고성군</nds-chip>
    <nds-chip>경상남도</nds-chip>
  </div>
</body></html>`;

const CORRECT = `<html data-project="cashwalk-biz"><body>
  <nds-selected-items-panel panel-title="선택한 지역" count="2">
    <nds-region-row>강원특별자치도 &gt; 강릉시</nds-region-row>
    <nds-region-row>서울특별시 &gt; 강남구</nds-region-row>
  </nds-selected-items-panel>
</body></html>`;

const PLAIN_CHIPS = `<html data-project="cashwalk-biz"><body>
  <nds-chip>진행중</nds-chip>
  <nds-chip>최근 7일</nds-chip>
  <nds-chip>안드로이드</nds-chip>
</body></html>`;

test("지역 경로(>)가 든 nds-chip → region-as-chip warn", () => {
  const v = validateHtmlSource(WRONG, { surface: "admin", project: "cashwalk-biz" });
  const hit = has(v, "region-as-chip");
  assert.ok(hit, "지역 경로 칩이면 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("캐포비 admin scope 밖 지역 경로 nds-chip 은 region-as-chip 위반 아님", () => {
  const v = validateHtmlSource(WRONG, { surface: "service", project: "nudge-eap" });
  assert.equal(has(v, "region-as-chip"), undefined);
});

test("region-as-chip 은 D1 layout 점수에도 반영", () => {
  const result = validateHtmlMockup({
    source: WRONG,
    surface: "admin",
    project: "cashwalk-biz",
  });
  assert.ok(result.violationsByRule.some((x) => x.rule === "region-as-chip"));
  assert.ok(result.scores.dimensions.layout < 100);
});

test("SelectedItemsPanel + RegionRow(정답)는 region-as-chip 위반 없음", () => {
  const v = validateHtmlSource(CORRECT, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(has(v, "region-as-chip"), undefined, "RegionRow 는 칩이 아니므로 통과");
});

test("일반 칩(지역 경로 없음)은 오탐 없음", () => {
  const v = validateHtmlSource(PLAIN_CHIPS, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(has(v, "region-as-chip"), undefined, "‘ > ’ 경로가 없으면 통과");
});
