import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * missing-viewport-meta 룰 (B3).
 * 회고(2026-06): 목업 카드가 모바일에서 4열로 짓눌려 글자가 세로로 쪼개졌다. 근본 원인은
 * <head> 의 <meta name="viewport"> 누락 — 모바일이 데스크탑 폭으로 렌더돼 반응형(@media)이
 * 전혀 안 먹는다. full 문서(<head> 존재)인데 viewport 가 없으면 warn 으로 환기한다.
 */

const FULL_DOC_NO_VIEWPORT = `<html><head><meta charset="utf-8"></head><body>
  <main>홈</main>
</body></html>`;

const FULL_DOC_WITH_VIEWPORT = `<html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head><body>
  <main>홈</main>
</body></html>`;

const FRAGMENT_NO_HEAD = `<section><div class="nds-container">홈</div></section>`;

test("full 문서(<head>)인데 viewport meta 없음 → missing-viewport-meta warn", () => {
  const v = validateHtmlSource(FULL_DOC_NO_VIEWPORT);
  const hit = v.find((x) => x.rule === "missing-viewport-meta");
  assert.ok(hit, "missing-viewport-meta 위반이 있어야 함");
  assert.equal(hit?.severity, "warn");
});

test("viewport meta 가 있으면 위반 아님", () => {
  const v = validateHtmlSource(FULL_DOC_WITH_VIEWPORT);
  assert.equal(
    v.find((x) => x.rule === "missing-viewport-meta"),
    undefined,
  );
});

test("fragment(<head> 없음)는 판정 불가라 skip(위반 아님) — false positive 방지", () => {
  const v = validateHtmlSource(FRAGMENT_NO_HEAD);
  assert.equal(
    v.find((x) => x.rule === "missing-viewport-meta"),
    undefined,
  );
});
