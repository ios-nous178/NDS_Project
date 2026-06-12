/**
 * 커버리지 갭 픽스처 — nds-* 카탈로그 대조 error 룰
 * (unknown-nds-tag / unknown-nds-class / invalid-nds-attr-value).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

const ctx: HtmlValidationContext = {
  tokenSet: new Set(),
  ndsTagSet: new Set(["nds-button", "nds-card"]),
  ndsClassPrefixSet: new Set(["nds-card"]),
  ndsAttrEnums: new Map([
    ["nds-button", new Map([["color", ["primary", "secondary", "neutral"]]])],
  ]),
};

test("unknown-nds-tag: 카탈로그에 없는 nds-* 태그는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<nds-widget>콘텐츠</nds-widget>`, { context: ctx });
  const hit = v.find((x) => x.rule === "unknown-nds-tag");
  assert.ok(hit, "unknown-nds-tag 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
  assert.ok(hit?.detail?.includes("nds-widget"));
});

test("unknown-nds-tag: 카탈로그에 있는 태그는 위반이 아니다", () => {
  const v = validateHtmlSource(`<nds-card>콘텐츠</nds-card>`, { context: ctx });
  assert.equal(
    v.find((x) => x.rule === "unknown-nds-tag"),
    undefined,
  );
});

test("unknown-nds-class: stylesheet 에 없는 nds-* 클래스는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<div class="nds-fancy-box">콘텐츠</div>`, { context: ctx });
  const hit = v.find((x) => x.rule === "unknown-nds-class");
  assert.ok(hit, "unknown-nds-class 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
  assert.ok(hit?.detail?.includes("nds-fancy-box"));
});

test("unknown-nds-class: 실재 베이스 클래스(+BEM modifier)는 위반이 아니다", () => {
  const v = validateHtmlSource(`<div class="nds-card nds-card__body">콘텐츠</div>`, {
    context: ctx,
  });
  assert.equal(
    v.find((x) => x.rule === "unknown-nds-class"),
    undefined,
  );
});

test("invalid-nds-attr-value: enum 에 없는 attribute 값은 error 로 잡는다", () => {
  const v = validateHtmlSource(`<nds-button color="rainbow" onclick="go()">버튼</nds-button>`, {
    context: ctx,
  });
  const hit = v.find((x) => x.rule === "invalid-nds-attr-value");
  assert.ok(hit, "invalid-nds-attr-value 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
  assert.ok(hit?.detail?.includes('color="rainbow"'));
});

test("invalid-nds-attr-value: 허용값 / 미지정(컴포넌트 기본값)은 위반이 아니다", () => {
  const allowed = validateHtmlSource(
    `<nds-button color="primary" onclick="go()">버튼</nds-button>`,
    { context: ctx },
  );
  assert.equal(
    allowed.find((x) => x.rule === "invalid-nds-attr-value"),
    undefined,
  );
  const omitted = validateHtmlSource(`<nds-button onclick="go()">버튼</nds-button>`, {
    context: ctx,
  });
  assert.equal(
    omitted.find((x) => x.rule === "invalid-nds-attr-value"),
    undefined,
  );
});
