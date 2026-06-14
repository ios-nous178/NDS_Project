import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlMockup } from "./html-validator.js";

/**
 * 응답 violations[] cap (A2).
 * 회고(2026-06): 같은 룰(인라인 스타일)이 240건 터지면 응답이 라인별로 통째 덤프돼 단일 응답 중
 * 최대 토큰을 먹고, 이후 턴마다 컨텍스트를 점거했다. cap 의 핵심 계약:
 *  - 룰별 첫 N(=5)건은 full(selector 포함), 그 뒤(꼬리)는 selector 를 생략(rule/line/severity 만).
 *  - 행(=위반) 자체는 드롭하지 않는다 — 위반당 1행을 적재하는 telemetry(rule-stats) 카운트 보존.
 *  - 전체 line·룰별 총계는 violationsByRule 가 정확히 보유(정보 손실 없음).
 */

const FULL_SAMPLES_PER_RULE = 5; // html-validator.ts 의 동명 상수와 일치해야 함.

// 인라인 hex 색을 가진 span 8개 → inline-color 위반 8건(요소당 1건).
const EIGHT_INLINE_COLOR = `<html><head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head><body>
${Array.from({ length: 8 }, (_, i) => `  <span style="color:#ff00${i}0">x${i}</span>`).join("\n")}
</body></html>`;

test("inline-color 8건: violationsByRule 는 전체 카운트(8) 보존", () => {
  const result = validateHtmlMockup({ source: EIGHT_INLINE_COLOR });
  const byRule = result.violationsByRule.find((r) => r.rule === "inline-color");
  assert.ok(byRule, "inline-color 룰 집계가 있어야 함");
  assert.equal(byRule?.count, 8, "룰별 총계는 trim 과 무관하게 정확해야 함");
  assert.equal(byRule?.lines.length, 8, "전체 line 도 보존돼야 함");
});

test("inline-color 8건: violations[] 행은 8개 모두 보존(telemetry 카운트용)", () => {
  const result = validateHtmlMockup({ source: EIGHT_INLINE_COLOR });
  const rows = result.violations.filter((v) => v.rule === "inline-color");
  assert.equal(rows.length, 8, "꼬리도 드롭하지 않고 selector 만 빼므로 행 수는 유지");
});

test("inline-color 8건: 첫 5건만 selector full, 꼬리 3건은 selector 생략", () => {
  const result = validateHtmlMockup({ source: EIGHT_INLINE_COLOR });
  const rows = result.violations.filter((v) => v.rule === "inline-color");
  const withSelector = rows.filter((v) => v.selector !== undefined);
  const withoutSelector = rows.filter((v) => v.selector === undefined);
  assert.equal(withSelector.length, FULL_SAMPLES_PER_RULE, "첫 5건은 selector 포함");
  assert.equal(withoutSelector.length, 8 - FULL_SAMPLES_PER_RULE, "꼬리 3건은 selector 생략");
  // 꼬리 행도 위반 식별 최소 정보(rule/line)는 유지.
  for (const tail of withoutSelector) {
    assert.equal(tail.rule, "inline-color");
    assert.equal(typeof tail.line, "number");
  }
});
