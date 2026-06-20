import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * nds-host-box-style 룰.
 * 회고: 캐포비 타게팅 폼에서 <nds-selection-button-group> 호스트에 직접 margin-bottom 을 줬는데
 * NDS 웹컴포넌트 호스트는 display:contents(light-DOM 미러)라 margin 이 드롭 → 하단 패널과 딱 붙었다.
 * '컴포넌트 딱 붙음 / 모달 헤더 사라짐 / 여백 사라짐' 이 전부 같은 한 가지 원인. 간격·크기는 wrapper div
 * 또는 부모 gap 으로. 호스트엔 --nds- / --semantic- 변수만 허용. get_guide({ topic: 'pattern:host-spacing' }).
 */

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

// 재현: 호스트 margin → 무시 → 딱 붙음
const HOST_MARGIN = `<html data-project="cashwalk-biz"><body>
  <nds-selection-button-group style="margin-bottom:16px"></nds-selection-button-group>
  <nds-selected-items-panel></nds-selected-items-panel>
</body></html>`;

// 호스트 width / padding 도 동일하게 드롭
const HOST_SIZE = `<html data-project="cashwalk-biz"><body>
  <nds-select style="width:240px; padding:8px"></nds-select>
</body></html>`;

// 정답: wrapper div 에 간격
const WRAPPED = `<html data-project="cashwalk-biz"><body>
  <div style="margin-bottom:16px"><nds-selection-button-group></nds-selection-button-group></div>
  <nds-selected-items-panel></nds-selected-items-panel>
</body></html>`;

// 호스트에 커스텀 프로퍼티(슬롯/토큰)·display:contents 만 — 허용
const HOST_VARS_OK = `<html data-project="cashwalk-biz"><body>
  <nds-card style="--nds-card-gap: var(--semantic-gap-default); display:contents"></nds-card>
</body></html>`;

// 예외 컴포넌트(display:contents 미사용) — 호스트 스타일 OK
const EXEMPT = `<html data-project="cashwalk-biz"><body>
  <nds-input-group style="width:320px"></nds-input-group>
</body></html>`;

test("호스트 margin → nds-host-box-style warn (딱 붙음 재현)", () => {
  const v = validateHtmlSource(HOST_MARGIN, { surface: "admin", project: "cashwalk-biz" });
  const hit = has(v, "nds-host-box-style");
  assert.ok(hit, "호스트 margin 은 위반이어야 함");
  assert.equal(hit?.severity, "warn");
  assert.match(String(hit?.detail), /margin-bottom/);
});

test("호스트 width/padding 도 드롭 대상", () => {
  const v = validateHtmlSource(HOST_SIZE, { surface: "admin", project: "cashwalk-biz" });
  const hit = has(v, "nds-host-box-style");
  assert.ok(hit, "width/padding 도 위반");
  assert.match(String(hit?.detail), /width/);
  assert.match(String(hit?.detail), /padding/);
});

test("wrapper div 에 간격(정답) → 위반 없음", () => {
  const v = validateHtmlSource(WRAPPED, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(has(v, "nds-host-box-style"), undefined, "wrapper div 는 일반 박스라 통과");
});

test("호스트에 --nds-*/--semantic-* 변수 + display:contents 는 허용", () => {
  const v = validateHtmlSource(HOST_VARS_OK, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(
    has(v, "nds-host-box-style"),
    undefined,
    "커스텀 프로퍼티·display:contents 는 오탐 없음",
  );
});

test("display:contents 미사용 예외 컴포넌트(input-group)는 호스트 스타일 통과", () => {
  const v = validateHtmlSource(EXEMPT, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(has(v, "nds-host-box-style"), undefined, "예외 태그는 오탐 없음");
});
