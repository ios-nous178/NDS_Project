import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * primary-cta-per-container + 예외 ux:p2-multi-judgment-unit (③-b detect 배선).
 * Primary 1개 제한은 "같은 판단 단위(Card/section/Modal/...)" 안에서만 따진다.
 * 단위가 여럿이면(중첩 카드 등) 화면에 Primary 가 여러 개여도 정당하다 — 각 Primary 는
 * 가장 가까운 컨테이너에만 귀속시켜 센다. (없으면 단위 여럿을 한 단위로 합산해 오탐)
 */

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

test("한 카드 안 Primary 2개 → primary-cta-per-container error", () => {
  // [승격 2026-06-26 warn→error] 원칙2 — 승격 로그: scripts/validator-promotion-log.json
  const html = `<nds-card>
    <nds-button>저장</nds-button>
    <nds-button>완료</nds-button>
  </nds-card>`;
  const hit = has(validateHtmlSource(html), "primary-cta-per-container");
  assert.ok(hit, "한 단위 안 Primary 2개면 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("section 안 카드 2개, 각 카드 Primary 1개 → 위반 없음(판단 단위 예외)", () => {
  const html = `<section>
    <nds-card><nds-button>신청</nds-button></nds-card>
    <nds-card><nds-button>신청</nds-button></nds-card>
  </section>`;
  assert.equal(
    has(validateHtmlSource(html), "primary-cta-per-container"),
    undefined,
    "단위(카드)가 여럿이면 화면에 Primary 여러 개여도 정당 — 오탐 금지",
  );
});

test("한 section 직속에 Primary 2개 → 위반(같은 단위 2개)", () => {
  const html = `<section>
    <nds-button>저장</nds-button>
    <nds-button>완료</nds-button>
  </section>`;
  assert.ok(
    has(validateHtmlSource(html), "primary-cta-per-container"),
    "같은 단위 직속 Primary 2개는 위반",
  );
});
