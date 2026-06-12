/**
 * 커버리지 갭 픽스처 — 금지 텍스트/헤딩 error 룰
 * (emoji-banned / text-symbol-banned / text-icon-substitute / repeated-h1).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

test("emoji-banned: 텍스트 노드의 이모지는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<p>참여해 주셔서 감사합니다 😀</p>`);
  const hit = v.find((x) => x.rule === "emoji-banned");
  assert.ok(hit, "emoji-banned 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("emoji-banned: placeholder 속성의 이모지도 잡는다", () => {
  const v = validateHtmlSource(`<nds-input placeholder="이름을 입력하세요 ✏️"></nds-input>`);
  assert.ok(v.find((x) => x.rule === "emoji-banned"));
});

test("emoji-banned: 평문 한글/영문은 위반이 아니다", () => {
  const v = validateHtmlSource(`<p>참여해 주셔서 감사합니다</p>`);
  assert.equal(
    v.find((x) => x.rule === "emoji-banned"),
    undefined,
  );
});

test("text-symbol-banned: → 같은 기호 텍스트는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<span>다음 단계 →</span>`);
  const hit = v.find((x) => x.rule === "text-symbol-banned");
  assert.ok(hit, "text-symbol-banned 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("text-symbol-banned: 기호 없는 텍스트는 위반이 아니다", () => {
  const v = validateHtmlSource(`<span>다음 단계</span>`);
  assert.equal(
    v.find((x) => x.rule === "text-symbol-banned"),
    undefined,
  );
});

test("text-icon-substitute: 닫기 의도의 × 텍스트는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<span class="close" aria-label="닫기">×</span>`);
  const hit = v.find((x) => x.rule === "text-icon-substitute");
  assert.ok(hit, "text-icon-substitute 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("text-icon-substitute: 닫기 텍스트 라벨(기호 아님)은 위반이 아니다", () => {
  const v = validateHtmlSource(`<span class="close">닫기</span>`);
  assert.equal(
    v.find((x) => x.rule === "text-icon-substitute"),
    undefined,
  );
});

test("repeated-h1: <h1> 2개는 error 로 잡는다", () => {
  const v = validateHtmlSource(`<h1>대시보드</h1><h1>설정</h1>`);
  const hit = v.find((x) => x.rule === "repeated-h1");
  assert.ok(hit, "repeated-h1 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("repeated-h1: <h1> 1개는 위반이 아니다", () => {
  const v = validateHtmlSource(`<h1>대시보드</h1><h2>요약</h2>`);
  assert.equal(
    v.find((x) => x.rule === "repeated-h1"),
    undefined,
  );
});
