import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlMockup, validateHtmlSource } from "./html-validator.js";

/**
 * chip-as-entry-grid 룰 (model-guard / warn).
 * 회고: 지니어트 서비스 홈의 '건강고민' 아이콘 타일 진입 그리드를 선택형 <nds-chip> 그리드로 바꾼
 * 패착 — 한눈 스캔성과 좌/우 레이아웃 균형을 잃었다. 탭하면 화면이 전환되는 '카테고리/고민 진입'
 * 그리드는 chip 이 아니라 pattern:quick-action-grid (아이콘+라벨 Card 셀)이 SSOT.
 * chip 은 폼 선택/필터값용 → 텍스트-only 다중선택(연령/지역/태그)은 오탐 없이 통과해야 한다.
 */

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

// 아이콘을 단 chip 6개를 한 그룹으로 — 미스캐스트된 '아이콘 타일' 진입 그리드.
const WRONG_ICON_TILES = `<html data-brand="geniet"><body>
  <section>
    <nds-chip selected><svg slot="icon" viewBox="0 0 24 24"></svg>눈 건강</nds-chip>
    <nds-chip><svg slot="icon" viewBox="0 0 24 24"></svg>면역력</nds-chip>
    <nds-chip><svg slot="icon" viewBox="0 0 24 24"></svg>수면</nds-chip>
    <nds-chip><svg slot="icon" viewBox="0 0 24 24"></svg>피로회복</nds-chip>
    <nds-chip><svg slot="icon" viewBox="0 0 24 24"></svg>체중</nds-chip>
    <nds-chip><svg slot="icon" viewBox="0 0 24 24"></svg>혈당</nds-chip>
  </section>
</body></html>`;

// CSS 그리드 레이아웃에 chip 6개(텍스트-only) — 타일 그리드처럼 배치.
const WRONG_GRID_STYLE = `<html data-brand="geniet"><body>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
    <nds-chip>눈 건강</nds-chip>
    <nds-chip>면역력</nds-chip>
    <nds-chip>수면</nds-chip>
    <nds-chip>피로회복</nds-chip>
    <nds-chip>체중</nds-chip>
    <nds-chip>혈당</nds-chip>
  </div>
</body></html>`;

// 정답: 진입 그리드는 pattern:quick-action-grid — Card 셀 grid (chip 아님).
const CORRECT_QA_GRID = `<html data-brand="geniet"><body>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
    <button class="qa-cell"><svg viewBox="0 0 24 24"></svg><span>눈 건강</span></button>
    <button class="qa-cell"><svg viewBox="0 0 24 24"></svg><span>면역력</span></button>
    <button class="qa-cell"><svg viewBox="0 0 24 24"></svg><span>수면</span></button>
    <button class="qa-cell"><svg viewBox="0 0 24 24"></svg><span>피로회복</span></button>
    <button class="qa-cell"><svg viewBox="0 0 24 24"></svg><span>체중</span></button>
    <button class="qa-cell"><svg viewBox="0 0 24 24"></svg><span>혈당</span></button>
  </div>
</body></html>`;

// 오탐 방지: 텍스트-only flex-wrap 다중선택(연령대 등) — 그리드도 아이콘도 아님 → 통과.
const OK_TEXT_SELECT_CHIPS = `<html data-brand="geniet"><body>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    <nds-chip selected interactive>10대</nds-chip>
    <nds-chip interactive>20대</nds-chip>
    <nds-chip interactive>30대</nds-chip>
    <nds-chip interactive>40대</nds-chip>
    <nds-chip interactive>50대</nds-chip>
    <nds-chip interactive>60대 이상</nds-chip>
    <nds-chip interactive>전체</nds-chip>
  </div>
</body></html>`;

// 오탐 방지: 다중선택 칩 묶음에서 선택된 1~2개만 ✓ 체크 아이콘 — 아이콘 칩 < 6 → 통과.
const OK_FEW_CHECK_ICONS = `<html data-brand="geniet"><body>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    <nds-chip selected interactive><svg slot="icon" viewBox="0 0 24 24"></svg>10대</nds-chip>
    <nds-chip selected interactive><svg slot="icon" viewBox="0 0 24 24"></svg>20대</nds-chip>
    <nds-chip interactive>30대</nds-chip>
    <nds-chip interactive>40대</nds-chip>
    <nds-chip interactive>50대</nds-chip>
    <nds-chip interactive>60대 이상</nds-chip>
    <nds-chip interactive>전체</nds-chip>
  </div>
</body></html>`;

test("아이콘 단 chip ≥6 을 한 그룹으로 나열 → chip-as-entry-grid warn", () => {
  const v = validateHtmlSource(WRONG_ICON_TILES, { surface: "service", brand: "geniet" });
  const hit = has(v, "chip-as-entry-grid");
  assert.ok(hit, "아이콘 타일을 chip 그리드로 만들면 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("CSS 그리드 레이아웃에 chip ≥6 → chip-as-entry-grid warn", () => {
  const v = validateHtmlSource(WRONG_GRID_STYLE, { surface: "service", brand: "geniet" });
  assert.ok(has(v, "chip-as-entry-grid"), "그리드에 chip 다수면 위반이어야 함");
});

test("chip-as-entry-grid 는 D1 layout 점수에도 반영", () => {
  const result = validateHtmlMockup({ source: WRONG_ICON_TILES, surface: "service", brand: "geniet" });
  assert.ok(result.violationsByRule.some((x) => x.rule === "chip-as-entry-grid"));
  assert.ok(result.scores.dimensions.layout < 100);
});

test("정답(quick-action-grid Card 셀)은 chip-as-entry-grid 위반 없음", () => {
  const v = validateHtmlSource(CORRECT_QA_GRID, { surface: "service", brand: "geniet" });
  assert.equal(has(v, "chip-as-entry-grid"), undefined, "Card 셀 그리드는 chip 이 아니므로 통과");
});

test("텍스트-only 다중선택 칩(연령대)은 오탐 없음", () => {
  const v = validateHtmlSource(OK_TEXT_SELECT_CHIPS, { surface: "service", brand: "geniet" });
  assert.equal(has(v, "chip-as-entry-grid"), undefined, "그리드도 아이콘 타일도 아니면 통과");
});

test("선택된 1~2개만 체크 아이콘 단 다중선택 칩은 오탐 없음", () => {
  const v = validateHtmlSource(OK_FEW_CHECK_ICONS, { surface: "service", brand: "geniet" });
  assert.equal(has(v, "chip-as-entry-grid"), undefined, "아이콘 칩 < 6 이면 통과");
});
