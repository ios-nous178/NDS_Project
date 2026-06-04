import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 회고(2026-06): 단일파일 빌드에서 nds-sidebar 가 "로고만 뜨고 메뉴가 통째로 사라지는"
 * #1 원인 — items 속성의 JSON **구조용 따옴표**까지 \" 로 과이스케이프해 파싱이 깨졌는데
 * 컴포넌트가 조용히 [] 를 렌더했다. 빌드 validator 가 깨진 JSON 속성을 error 로 잡아
 * 침묵 실패를 차단하는지 회귀 가드. (build-html.ts 가 validate 를 자동 실행.)
 *
 * 휴리스틱: nds-* 의 속성 값이 [ 또는 { 로 시작하면 JSON 으로 간주하고 파싱 시도.
 */

// items='[{\"key\"...]' — HTML 속성 안 백슬래시는 리터럴이라 JSON 파싱 실패
const overEscaped = `<html><body>
  <nds-sidebar items='[{\\"key\\":\\"home\\",\\"label\\":\\"홈\\"}]'></nds-sidebar>
</body></html>`;

// 구조용 따옴표 bare — 정상 JSON
const cleanAttr = `<html><body>
  <nds-sidebar items='[{"key":"home","label":"홈"}]'></nds-sidebar>
</body></html>`;

// 권장 패턴: 속성이 아니라 <script type="application/json" slot="items"> 텍스트 → 검사 대상 아님
const scriptSlot = `<html><body>
  <nds-sidebar><script type="application/json" slot="items">[{"key":"home","label":"홈"}]</script></nds-sidebar>
</body></html>`;

// JSON 이 아닌 일반 nds-* 속성([/{ 로 시작 안 함)은 무시
const plainAttr = `<html><body>
  <nds-button color="primary" variant="solid">저장</nds-button>
</body></html>`;

test("nds-json-attr-unparseable: 과이스케이프된 items 를 error 로 잡는다", () => {
  const violations = validateHtmlSource(overEscaped);
  const hit = violations.find((v) => v.rule === "nds-json-attr-unparseable");
  assert.ok(hit, "과이스케이프 items 는 nds-json-attr-unparseable 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("nds-json-attr-unparseable: 정상 JSON items 는 통과", () => {
  const violations = validateHtmlSource(cleanAttr);
  assert.ok(!violations.some((v) => v.rule === "nds-json-attr-unparseable"));
});

test("nds-json-attr-unparseable: script-slot 형태는 속성 검사 대상이 아니다(통과)", () => {
  const violations = validateHtmlSource(scriptSlot);
  assert.ok(!violations.some((v) => v.rule === "nds-json-attr-unparseable"));
});

test("nds-json-attr-unparseable: JSON 형태가 아닌 일반 속성은 검사하지 않는다", () => {
  const violations = validateHtmlSource(plainAttr);
  assert.ok(!violations.some((v) => v.rule === "nds-json-attr-unparseable"));
});
