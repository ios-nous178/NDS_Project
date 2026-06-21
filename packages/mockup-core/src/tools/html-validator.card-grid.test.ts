/**
 * .nds-grid 카드 그리드 — card-everything 예외 + unknown-nds-class 면제.
 * 카드를 다열로 배치하는 그리드(홈·갤러리)는 "모든 영역을 카드로 감싸는" 안티패턴이 아니다.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

const cells = (n: number) =>
  Array.from({ length: n }, (_, i) => `<nds-card>${i}</nds-card>`).join("");

test("card-everything: .nds-grid 안의 6개 카드 셀은 위반이 아니다", () => {
  const html = `<div class="nds-grid" data-cols="3">${cells(6)}</div>`;
  const rules = validateHtmlSource(html).map((v) => v.rule);
  assert.equal(rules.includes("card-everything"), false);
});

test("card-everything: 그리드 밖 6개 카드는 여전히 위반(대조군)", () => {
  const html = cells(6);
  const rules = validateHtmlSource(html).map((v) => v.rule);
  assert.equal(rules.includes("card-everything"), true);
});

test("card-everything: 그리드 안 4 + 밖 5 → 밖 5개만 카운트해 위반", () => {
  const html = `<div class="nds-grid" data-cols="2">${cells(4)}</div>${cells(5)}`;
  const rules = validateHtmlSource(html).map((v) => v.rule);
  assert.equal(rules.includes("card-everything"), true);
});

test("unknown-nds-class: nds-grid 가 allowlist 에 있으면 위반 아님", () => {
  const ctx: HtmlValidationContext = {
    tokenSet: new Set(),
    ndsTagSet: new Set(["nds-card"]),
    ndsClassPrefixSet: new Set(["nds-card", "nds-grid"]),
    ndsAttrEnums: new Map(),
  };
  const html = `<div class="nds-grid" data-cols="3"><nds-card>x</nds-card></div>`;
  const rules = validateHtmlSource(html, { context: ctx }).map((v) => v.rule);
  assert.equal(rules.includes("unknown-nds-class"), false);
});
