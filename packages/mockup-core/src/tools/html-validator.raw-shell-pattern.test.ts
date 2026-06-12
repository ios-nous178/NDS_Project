/**
 * 커버리지 갭 픽스처 — raw-shell-pattern (error/model-guard).
 * <style> 안 layout primitive(.page/.topbar/.section/.form-row) 재정의 → admin-shell 클래스로 유도.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

test("raw-shell-pattern: raw .page grid 셸 정의는 error 로 잡는다", () => {
  const v = validateHtmlSource(
    `<style>.page { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }</style>` +
      `<div class="page">본문</div>`,
  );
  const hit = v.find((x) => x.rule === "raw-shell-pattern");
  assert.ok(hit, "raw-shell-pattern 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
  assert.ok(hit?.suggestion?.includes("nds-shell"));
});

test("raw-shell-pattern: sticky .topbar 정의도 잡는다", () => {
  const v = validateHtmlSource(
    `<style>.topbar { position: sticky; top: 0; background: white; }</style>`,
  );
  assert.ok(v.find((x) => x.rule === "raw-shell-pattern"));
});

test("raw-shell-pattern: 시그니처 속성 조합이 아니면 위반이 아니다", () => {
  const v = validateHtmlSource(`<style>.page { padding: 16px; }</style>`);
  assert.equal(
    v.find((x) => x.rule === "raw-shell-pattern"),
    undefined,
  );
});

test("raw-shell-pattern: nds- prefix 클래스(DS 본인 정의)는 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<style>.nds-shell { display: grid; grid-template-columns: 240px 1fr; }</style>`,
  );
  assert.equal(
    v.find((x) => x.rule === "raw-shell-pattern"),
    undefined,
  );
});
