import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

/**
 * 입력 컴포넌트 오용 재발방지 룰(#1 날짜, #3 금액, #6 지역 선택).
 * 회귀: 캐포비 어드민 폼에서 '노출 기간' → placeholder 'YYYY-MM-DD' text input 2개,
 *       '목표 참여자 수' → "3,000,000 명" 큰 정적 숫자, 지역 선택 → add 어포던스 중복.
 */
const CTX: HtmlValidationContext = {
  tokenSet: new Set(),
  ndsTagSet: new Set([
    "nds-input",
    "nds-date-range-picker",
    "nds-amount-input",
    "nds-selected-items-panel",
    "nds-region-row",
    "nds-button",
  ]),
  ndsClassPrefixSet: new Set(["nds-"]),
  ndsAttrEnums: new Map(),
};

const v = (html: string) => validateHtmlSource(html, { context: CTX });
const has = (html: string, rule: string) => v(html).some((x) => x.rule === rule);

// ── #1 날짜/기간 ──────────────────────────────────────────────
test("기간 placeholder('시작일/종료일') text input → date-as-text-input (range)", () => {
  const html = `<html><body>
    <nds-input placeholder="시작일 (예: 2026-06-10)"></nds-input>
    <nds-input placeholder="종료일 (예: 2026-06-30)"></nds-input>
  </body></html>`;
  const hit = v(html).find((x) => x.rule === "date-as-text-input");
  assert.ok(hit, "날짜 text input 을 잡아야 한다");
  assert.match(hit!.suggestion ?? "", /nds-date-range-picker/);
});

test("type=date 단일 input → date-as-text-input (single → DatePicker)", () => {
  const hit = v(`<html><body><input type="date"></body></html>`).find(
    (x) => x.rule === "date-as-text-input",
  );
  assert.ok(hit);
  assert.match(hit!.suggestion ?? "", /nds-date-picker/);
});

test("nds-date-range-picker 사용은 위반 아님(inner input 오탐 없음)", () => {
  // 실제 DS 사용 — 래퍼는 unknown-nds-tag 가 날 수 있으니 ndsTagSet 에 포함됨.
  const html = `<html><body><nds-date-range-picker></nds-date-range-picker></body></html>`;
  assert.equal(has(html, "date-as-text-input"), false);
});

// ── #3 금액/수량 ──────────────────────────────────────────────
test("금액/수량 input(placeholder '명') → amount-as-text-input", () => {
  const hit = v(
    `<html><body><nds-input placeholder="목표 참여자 수 (명)"></nds-input></body></html>`,
  ).find((x) => x.rule === "amount-as-text-input");
  assert.ok(hit);
  assert.match(hit!.suggestion ?? "", /nds-amount-input/);
});

test("폼 필드 자리의 정적 숫자('3,000,000 명') → amount-as-static-display", () => {
  const html = `<html><body>
    <div class="nds-form-row"><label>목표 참여자 수</label>
      <div class="nds-form-row__field"><strong>3,000,000 명</strong></div>
    </div>
  </body></html>`;
  assert.equal(has(html, "amount-as-static-display"), true);
});

test("대시보드 통계의 정적 숫자(폼 밖)는 위반 아님(false-positive 방지)", () => {
  const html = `<html><body>
    <nds-card><div class="kpi"><span>3,000,000 명</span></div></nds-card>
  </body></html>`;
  assert.equal(has(html, "amount-as-static-display"), false);
});

// ── #6 지역 선택 ──────────────────────────────────────────────
test("add 어포던스 2개(외부 '지역 추가' + 패널 '추가 선택') → region-add-affordance-duplicated", () => {
  const html = `<html><body>
    <nds-button>+ 지역 추가</nds-button>
    <nds-selected-items-panel>
      <nds-button>+ 추가 선택</nds-button>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "region-add-affordance-duplicated"), true);
});

test("add 어포던스 1개는 위반 아님", () => {
  const html = `<html><body>
    <nds-selected-items-panel><nds-button>+ 추가 선택</nds-button></nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "region-add-affordance-duplicated"), false);
});

test("패널 내 중복 region-row → region-row-duplicated", () => {
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-region-row>인천광역시 > 연수구</nds-region-row>
      <nds-region-row>경기도 > 수원시 영통구</nds-region-row>
      <nds-region-row>인천광역시 > 연수구</nds-region-row>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "region-row-duplicated"), true);
});

test("유니크한 region-row 는 위반 아님", () => {
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-region-row>인천광역시 > 연수구</nds-region-row>
      <nds-region-row>경기도 > 수원시 영통구</nds-region-row>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "region-row-duplicated"), false);
});
