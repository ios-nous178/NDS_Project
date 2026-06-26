import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * nested-card + 예외 ux:p2-card-justified waiver (③-c).
 * 카드 안 카드는 위계를 무너뜨려 차단(error)이지만, 정당한 중첩은 외곽 카드에
 *   data-nudge-allow="ux:p2-card-justified — <사유>"
 * 를 달면 면제된다(// allow-native 의 일반화).
 */

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

test("카드 안 카드 → nested-card error", () => {
  // [승격 2026-06-26 warn→error] 원칙2 — 승격 로그: scripts/validator-promotion-log.json
  const html = `<nds-card><nds-card>내부</nds-card></nds-card>`;
  const hit = has(validateHtmlSource(html), "nested-card");
  assert.ok(hit, "중첩 카드면 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("외곽 카드 data-nudge-allow 면 면제(waiver)", () => {
  const html = `<nds-card data-nudge-allow="ux:p2-card-justified — 독립 요약 카드">
    <nds-card>내부</nds-card>
  </nds-card>`;
  assert.equal(
    has(validateHtmlSource(html), "nested-card"),
    undefined,
    "정당한 중첩은 waiver 로 면제돼야 함",
  );
});

test("다른 예외 id 의 waiver 는 면제하지 않음", () => {
  const html = `<nds-card data-nudge-allow="ux:p2-real-float — 잘못된 예외">
    <nds-card>내부</nds-card>
  </nds-card>`;
  assert.ok(has(validateHtmlSource(html), "nested-card"), "매칭되지 않는 예외 id 는 면제 안 됨");
});
