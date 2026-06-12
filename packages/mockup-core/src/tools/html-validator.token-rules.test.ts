/**
 * 커버리지 갭 픽스처 — 토큰/색 계열 error 룰 (inline-color / gradient-banned / unknown-token).
 * RULE_META 대비 기존 테스트가 단언하지 않던 룰의 발화/비발화 양면 잠금.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

const ctx: HtmlValidationContext = {
  tokenSet: new Set(["--semantic-text-default", "--semantic-bg-surface"]),
  ndsTagSet: new Set(),
  ndsClassPrefixSet: new Set(),
  ndsAttrEnums: new Map(),
};

test("inline-color: style 의 raw hex 는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<div style="color:#ff0000">텍스트</div>`, { context: ctx });
  const hit = v.find((x) => x.rule === "inline-color");
  assert.ok(hit, "inline-color 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("inline-color: rgb() 도 잡는다", () => {
  const v = validateHtmlSource(`<div style="background:rgb(255, 0, 0)">텍스트</div>`, {
    context: ctx,
  });
  assert.ok(v.find((x) => x.rule === "inline-color"));
});

test("inline-color: 토큰 var() (hex 폴백 포함) 는 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<div style="color:var(--semantic-text-default, #111111)">텍스트</div>`,
    { context: ctx },
  );
  assert.equal(
    v.find((x) => x.rule === "inline-color"),
    undefined,
  );
});

test("gradient-banned: linear-gradient 는 error 로 잡는다", () => {
  const v = validateHtmlSource(
    `<div style="background:linear-gradient(90deg, #ffffff, #000000)">배너</div>`,
    { context: ctx },
  );
  const hit = v.find((x) => x.rule === "gradient-banned");
  assert.ok(hit, "gradient-banned 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("gradient-banned: 단색 토큰 배경은 위반이 아니다", () => {
  const v = validateHtmlSource(`<div style="background:var(--semantic-bg-surface)">배너</div>`, {
    context: ctx,
  });
  assert.equal(
    v.find((x) => x.rule === "gradient-banned"),
    undefined,
  );
});

test("unknown-token: 카탈로그에 없는 var(--*) 는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<div style="color:var(--made-up-token)">텍스트</div>`, {
    context: ctx,
  });
  const hit = v.find((x) => x.rule === "unknown-token");
  assert.ok(hit, "unknown-token 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
  assert.ok(hit?.detail?.includes("--made-up-token"));
});

test("unknown-token: 카탈로그에 있는 토큰은 위반이 아니다", () => {
  const v = validateHtmlSource(`<div style="color:var(--semantic-text-default)">텍스트</div>`, {
    context: ctx,
  });
  assert.equal(
    v.find((x) => x.rule === "unknown-token"),
    undefined,
  );
});
