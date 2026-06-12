/**
 * 커버리지 갭 픽스처 — 목업 동작/산출물 계약 error 룰
 * (button-without-interaction / ds-badge-missing).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

test("button-without-interaction: 핸들러 연결 근거 없는 활성 버튼은 error 로 잡는다", () => {
  const v = validateHtmlSource(`<nds-button id="save">저장</nds-button>`);
  const hit = v.find((x) => x.rule === "button-without-interaction");
  assert.ok(hit, "button-without-interaction 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("button-without-interaction: script 의 addEventListener 연결이 있으면 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<nds-button id="save">저장</nds-button>` +
      `<script>document.getElementById("save").addEventListener("click", () => {});</script>`,
  );
  assert.equal(
    v.find((x) => x.rule === "button-without-interaction"),
    undefined,
  );
});

test("button-without-interaction: disabled 버튼은 위반이 아니다", () => {
  const v = validateHtmlSource(`<nds-button id="save" disabled>저장</nds-button>`);
  assert.equal(
    v.find((x) => x.rule === "button-without-interaction"),
    undefined,
  );
});

test("ds-badge-missing: 풋터에 DS 뱃지가 없으면 error 로 잡는다", () => {
  const v = validateHtmlSource(`<footer><p>copyright 2026</p></footer>`);
  const hit = v.find((x) => x.rule === "ds-badge-missing");
  assert.ok(hit, "ds-badge-missing 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("ds-badge-missing: data-ds-badge 요소가 있으면 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<footer><span data-ds-badge>DS@0.1.10 · DS 12 (45%)</span></footer>`,
  );
  assert.equal(
    v.find((x) => x.rule === "ds-badge-missing"),
    undefined,
  );
});

test("ds-badge-missing: 풋터 자체가 없으면 룰을 적용하지 않는다", () => {
  const v = validateHtmlSource(`<main><p>본문</p></main>`);
  assert.equal(
    v.find((x) => x.rule === "ds-badge-missing"),
    undefined,
  );
});
