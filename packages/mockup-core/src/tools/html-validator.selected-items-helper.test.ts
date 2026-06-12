/**
 * 커버리지 갭 픽스처 — selected-items-helper-outside-form-field (error/invariant).
 * SelectedItemsPanel 바로 아래 helper 텍스트 sibling 배치 → FormField helper 슬롯으로 유도.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

test("selected-items-helper-outside-form-field: 패널 옆 helper sibling 은 error 로 잡는다", () => {
  const v = validateHtmlSource(
    `<nds-selected-items-panel></nds-selected-items-panel>` +
      `<p>시/도, 시/군/구를 검색해 노출할 지역을 추가하세요.</p>`,
  );
  const hit = v.find((x) => x.rule === "selected-items-helper-outside-form-field");
  assert.ok(hit, "selected-items-helper-outside-form-field 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("selected-items-helper-outside-form-field: marker 클래스(helper)로도 잡는다", () => {
  const v = validateHtmlSource(
    `<nds-selected-items-panel></nds-selected-items-panel>` +
      `<div class="field-helper">최대 10개까지 등록됩니다.</div>`,
  );
  assert.ok(v.find((x) => x.rule === "selected-items-helper-outside-form-field"));
});

test("FormField 안에 감싼 패널은 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<nds-form-field density="admin" helper="시/도, 시/군/구를 검색해 노출할 지역을 추가하세요.">` +
      `<nds-selected-items-panel></nds-selected-items-panel>` +
      `</nds-form-field>`,
  );
  assert.equal(
    v.find((x) => x.rule === "selected-items-helper-outside-form-field"),
    undefined,
  );
});

test("helper 신호가 없는 일반 sibling 텍스트는 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<nds-selected-items-panel></nds-selected-items-panel>` + `<p>2026 cashwalk for business</p>`,
  );
  assert.equal(
    v.find((x) => x.rule === "selected-items-helper-outside-form-field"),
    undefined,
  );
});
