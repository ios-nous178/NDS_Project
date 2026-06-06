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
    "nds-selected-item-row",
    "nds-region-row",
    "nds-button",
  ]),
  ndsClassPrefixSet: new Set(["nds-"]),
  ndsAttrEnums: new Map(),
};

const v = (html: string) => validateHtmlSource(html, { context: CTX });
const has = (html: string, rule: string) => v(html).some((x) => x.rule === rule);
const hit = (html: string, rule: string) => v(html).find((x) => x.rule === rule);

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
test("add 어포던스 2개(외부 추가 + 패널 '추가 선택') → selected-item-add-affordance-duplicated", () => {
  const html = `<html><body>
    <nds-button>+ 항목 추가</nds-button>
    <nds-selected-items-panel>
      <nds-button>+ 추가 선택</nds-button>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "selected-item-add-affordance-duplicated"), true);
});

test("add 어포던스 중복은 error(빌드 게이트 차단) — 재발 회귀", () => {
  // 회귀: 캐포비 타겟팅 폼 '지역 추가' 버튼 2개 노출이 다시 발생("또 두개 노출"). warn 으로는
  // 막히지 않아 재발했으므로 error 로 승격됨.
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-button>+ 추가 선택</nds-button>
    </nds-selected-items-panel>
    <nds-button>+ 항목 추가</nds-button>
  </body></html>`;
  assert.equal(hit(html, "selected-item-add-affordance-duplicated")?.severity, "error");
});

test("add 어포던스 1개는 위반 아님", () => {
  const html = `<html><body>
    <nds-selected-items-panel><nds-button>+ 추가 선택</nds-button></nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "selected-item-add-affordance-duplicated"), false);
});

test("패널(hide-add 없음, 추가선택 런타임 렌더) + 별도 nds-add-button → duplicated (검출공백 보강)", () => {
  // 실제 회귀: 정적 HTML 엔 패널 '추가 선택' 이 안 보이고(컴포넌트 런타임 렌더) nds-add-button 은
  // label 속성이라 텍스트 매칭을 빠져나가 룰이 0개로 통과했었음.
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-selected-item-row>서울특별시 &gt; 강남구</nds-selected-item-row>
    </nds-selected-items-panel>
    <nds-add-button label="항목 추가"></nds-add-button>
  </body></html>`;
  assert.equal(has(html, "selected-item-add-affordance-duplicated"), true);
});

test("페이지 패널 1개(hide-add 없음)만 있으면 정답 — 미발화(오탐 방지)", () => {
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-selected-item-row>서울특별시 &gt; 강남구</nds-selected-item-row>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "selected-item-add-affordance-duplicated"), false);
});

test("선택 모달에 SelectedItemsPanel 없음 → selected-items-modal-missing-panel", () => {
  // 회귀: '지역 추가' → 단순 2컬럼 팝오버(시/도 | 시/군/구)로 작게 뜨고 우측 선택결과 패널이 빠짐.
  const html = `<html><body>
    <nds-modal>
      <div>시/도, 시/군/구를 순서대로 선택한 뒤 [적용]을 누르세요</div>
      <ul><li>서울특별시</li></ul><ul><li>강남구</li></ul>
    </nds-modal>
  </body></html>`;
  assert.equal(has(html, "selected-items-modal-missing-panel"), true);
});

test("우측 SelectedItemsPanel 갖춘 2단 모달은 위반 아님(오탐 방지)", () => {
  const html = `<html><body>
    <nds-modal>
      <div>시/도, 시/군/구 검색</div>
      <nds-selected-items-panel hide-add>
        <nds-selected-item-row>서울특별시 &gt; 강남구</nds-selected-item-row>
      </nds-selected-items-panel>
    </nds-modal>
  </body></html>`;
  assert.equal(has(html, "selected-items-modal-missing-panel"), false);
});

test("패널 내 중복 selected-item-row → selected-item-row-duplicated", () => {
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-selected-item-row>인천광역시 &gt; 연수구</nds-selected-item-row>
      <nds-selected-item-row>경기도 &gt; 수원시 영통구</nds-selected-item-row>
      <nds-selected-item-row>인천광역시 &gt; 연수구</nds-selected-item-row>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "selected-item-row-duplicated"), true);
});

test("유니크한 selected-item-row 는 위반 아님", () => {
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-selected-item-row>인천광역시 &gt; 연수구</nds-selected-item-row>
      <nds-selected-item-row>경기도 &gt; 수원시 영통구</nds-selected-item-row>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "selected-item-row-duplicated"), false);
});

test("패널 밖 sibling 으로 떨어진 selected-item-row → selected-item-row-outside-panel", () => {
  // 회귀: '지역 추가' 후 누적분을 패널 다음 sibling 으로 append → 패널 gap(8)을 못 타서 간격 없이
  // 붙고 회색 패널 밖에 렌더됨(목업: 서초구/마포구/송파구가 패널 아래로 샘).
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-selected-item-row>서울특별시 &gt; 강남구</nds-selected-item-row>
      <nds-selected-item-row>경기도 &gt; 성남시 분당구</nds-selected-item-row>
    </nds-selected-items-panel>
    <nds-selected-item-row>서울특별시 &gt; 서초구</nds-selected-item-row>
    <nds-selected-item-row>서울특별시 &gt; 마포구</nds-selected-item-row>
    <nds-selected-item-row>서울특별시 &gt; 송파구</nds-selected-item-row>
  </body></html>`;
  assert.equal(has(html, "selected-item-row-outside-panel"), true);
});

test("패널 안 selected-item-row 는 selected-item-row-outside-panel 위반 아님(오탐 방지)", () => {
  const html = `<html><body>
    <nds-selected-items-panel>
      <nds-selected-item-row>서울특별시 &gt; 강남구</nds-selected-item-row>
    </nds-selected-items-panel>
  </body></html>`;
  assert.equal(has(html, "selected-item-row-outside-panel"), false);
});
