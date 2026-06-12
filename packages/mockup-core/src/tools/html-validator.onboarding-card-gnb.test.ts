import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 캐포비 온보딩 회귀 3종 (사용자 피드백: "카드 패딩 없는데 오케이" / "GNB 쓰지 말라 / 쓸거면 로고라도"):
 *  - cashwalk-biz-onboarding-no-gnb        : 온보딩에 상단 GNB/글로벌 헤더 부착 + 텍스트 로고
 *  - onboarding-card-no-padding            : 카드에 inset 패딩이 없어 CTA full-bleed
 *  - onboarding-multistep-cta-inside-card  : Stepper 멀티스텝인데 제출 CTA 가 카드 안
 * 온보딩 룰은 surface=admin + brand=cashwalk-biz + data-page-pattern="onboarding" 스코프.
 */
const OPTS = { surface: "admin" as const, brand: "cashwalk-biz" };

const onboarding = (body: string) =>
  `<html data-brand="cashwalk-biz" data-page-pattern="onboarding"><head></head><body>` +
  `<nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>${body}</body></html>`;

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

// ─── GNB ───────────────────────────────────────────────────────────────────
test("온보딩에 raw <header> GNB + 텍스트 로고 → cashwalk-biz-onboarding-no-gnb error", () => {
  const v = validateHtmlSource(
    onboarding(`<header class="gnb"><span>cashwalk for business</span></header>` + `<div>form</div>`),
    OPTS,
  );
  const hit = has(v, "cashwalk-biz-onboarding-no-gnb");
  assert.ok(hit, "no-gnb 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("온보딩에 nds-header 도 GNB 로 잡는다", () => {
  const v = validateHtmlSource(onboarding(`<nds-header></nds-header>`), OPTS);
  assert.ok(has(v, "cashwalk-biz-onboarding-no-gnb"));
});

test("GNB 없는 온보딩은 no-gnb 미발화", () => {
  const v = validateHtmlSource(
    onboarding(`<div class="card" style="padding:48px"><nds-input></nds-input></div>`),
    OPTS,
  );
  assert.equal(has(v, "cashwalk-biz-onboarding-no-gnb"), undefined);
});

// ─── 카드 패딩 ──────────────────────────────────────────────────────────────
test("패딩 없는 카드 + full-width CTA → onboarding-card-no-padding error", () => {
  const v = validateHtmlSource(
    onboarding(
      `<div class="card" style="background:#fff;border-radius:16px">` +
        `<nds-input></nds-input>` +
        `<nds-button color="primary" full-width>로그인</nds-button></div>`,
    ),
    OPTS,
  );
  const hit = has(v, "onboarding-card-no-padding");
  assert.ok(hit, "card-no-padding 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("인라인 padding 48px 카드는 패딩 위반 아님", () => {
  const v = validateHtmlSource(
    onboarding(
      `<div class="card" style="padding:48px;background:#fff;border-radius:16px">` +
        `<nds-input></nds-input><nds-button full-width>로그인</nds-button></div>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "onboarding-card-no-padding"), undefined);
});

test("<style> 클래스 규칙으로 padding 준 카드도 위반 아님", () => {
  const v = validateHtmlSource(
    onboarding(
      `<style>.card{background:#fff;border-radius:16px;padding:48px}</style>` +
        `<div class="card"><nds-input></nds-input><nds-button full-width>로그인</nds-button></div>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "onboarding-card-no-padding"), undefined);
});

test("nds-card 는 패딩 내장 → 패딩 위반 아님", () => {
  const v = validateHtmlSource(
    onboarding(`<nds-card><nds-input></nds-input><nds-button full-width>로그인</nds-button></nds-card>`),
    OPTS,
  );
  assert.equal(has(v, "onboarding-card-no-padding"), undefined);
});

// ─── 멀티스텝 감지 + 제출 CTA 카드 내부 ──────────────────────────────────────
test("Stepper(Step 1/2/3) 멀티스텝 + 카드 안 제출 Primary → onboarding-multistep-cta-inside-card error", () => {
  const v = validateHtmlSource(
    onboarding(
      `<div class="stepper">Step 1 계정 생성 Step 2 비즈니스 그룹 Step 3 광고 시작</div>` +
        `<div class="card" style="padding:48px">` +
        `<span>이전</span>` +
        `<nds-input></nds-input>` +
        `<nds-button color="primary" variant="solid" full-width>비즈니스 그룹 생성하기</nds-button></div>`,
    ),
    OPTS,
  );
  const hit = has(v, "onboarding-multistep-cta-inside-card");
  assert.ok(hit, "multistep-cta-inside-card 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
  // 멀티스텝으로 인식했으니 단일액션 full-width 룰은 발화하지 않는다.
  assert.equal(has(v, "onboarding-cta-not-fullwidth"), undefined);
});

test("멀티스텝 제출 버튼이 카드 밖 footer 면 위반 아님", () => {
  const v = validateHtmlSource(
    onboarding(
      `<nds-stepper></nds-stepper>` +
        `<div class="card" style="padding:48px"><nds-input></nds-input></div>` +
        `<div class="footer-nav">` +
        `<nds-button color="primary" variant="outlined">이전 단계</nds-button>` +
        `<nds-button color="primary" variant="solid">제출</nds-button></div>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "onboarding-multistep-cta-inside-card"), undefined);
});

test("Stepper 없는 단일 액션은 멀티스텝 룰 미적용 (full-width 룰만 적용)", () => {
  const v = validateHtmlSource(
    onboarding(
      `<div class="card" style="padding:48px"><nds-input></nds-input>` +
        `<nds-button color="primary">로그인</nds-button></div>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "onboarding-multistep-cta-inside-card"), undefined);
  assert.ok(has(v, "onboarding-cta-not-fullwidth"), "단일액션이라 full-width 룰이 잡아야 함");
});

// ─── 스크린샷 재현(3종 동시) ────────────────────────────────────────────────
test("스크린샷 재현: GNB + 패딩없는 카드 + Stepper 멀티스텝 제출 카드내부 → 3종 모두 발화", () => {
  const v = validateHtmlSource(
    onboarding(
      `<header class="gnb"><span>cashwalk for business</span></header>` +
        `<div class="stepper">Step 1 계정 생성 Step 2 비즈니스 그룹 Step 3 광고 시작</div>` +
        `<div class="card" style="background:#fff;border-radius:16px">` +
        `<span>이전</span><nds-input></nds-input>` +
        `<nds-button color="primary" variant="solid" full-width>비즈니스 그룹 생성하기</nds-button></div>`,
    ),
    OPTS,
  );
  assert.ok(has(v, "cashwalk-biz-onboarding-no-gnb"), "GNB");
  assert.ok(has(v, "onboarding-card-no-padding"), "패딩");
  assert.ok(has(v, "onboarding-multistep-cta-inside-card"), "멀티스텝 제출 카드내부");
});
