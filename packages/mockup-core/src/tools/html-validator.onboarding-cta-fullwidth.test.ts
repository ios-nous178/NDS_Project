import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 온보딩 카드의 주 CTA(Primary solid)는 카드 폭 가득(FILL)이어야 한다.
 * 작성자가 모달 단일버튼(우측 hug, full-width 금지)과 혼동해 좁게 그리는 회귀가 반복돼,
 * onboarding-cta-not-fullwidth 룰(error)로 빌드 차단한다. (data-page-pattern="onboarding" 한정)
 */

// 온보딩 룰은 cashwalk-biz admin 스코프에서만 발화 (surface 옵션 필요).
const OPTS = { surface: "admin" as const, project: "cashwalk-biz" };

const onboarding = (btn: string) =>
  `<html data-project="cashwalk-biz" data-page-pattern="onboarding"><body>` +
  `<nds-project-logo project="cashwalk-biz"></nds-project-logo>${btn}</body></html>`;

test("온보딩 Primary solid CTA 에 full-width 없으면 error 로 잡는다", () => {
  const v = validateHtmlSource(onboarding(`<nds-button color="primary">로그인</nds-button>`), OPTS);
  const hit = v.find((x) => x.rule === "onboarding-cta-not-fullwidth");
  assert.ok(hit, "onboarding-cta-not-fullwidth 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("color 미지정(default=primary) solid 도 full-width 없으면 잡는다", () => {
  const v = validateHtmlSource(onboarding(`<nds-button>시작하기</nds-button>`), OPTS);
  assert.ok(v.find((x) => x.rule === "onboarding-cta-not-fullwidth"));
});

test("full-width 가 붙어 있으면 위반이 아니다", () => {
  const v = validateHtmlSource(
    onboarding(`<nds-button color="primary" full-width>로그인</nds-button>`),
    OPTS,
  );
  assert.equal(
    v.find((x) => x.rule === "onboarding-cta-not-fullwidth"),
    undefined,
  );
});

test("보조 링크(variant=text)·outlined 는 주 CTA 가 아니라 제외", () => {
  const v = validateHtmlSource(
    onboarding(
      `<nds-button color="primary" full-width>로그인</nds-button>` +
        `<nds-button variant="text">아이디 찾기</nds-button>` +
        `<nds-button color="primary" variant="outlined">회원가입</nds-button>`,
    ),
    OPTS,
  );
  assert.equal(
    v.find((x) => x.rule === "onboarding-cta-not-fullwidth"),
    undefined,
  );
});

test("온보딩이 아니면(패턴 미선언) 룰 미적용 — 모달 단일버튼 hug 와 충돌 안 함", () => {
  const v = validateHtmlSource(
    `<html data-project="cashwalk-biz"><body><nds-button color="primary">확인</nds-button></body></html>`,
    OPTS,
  );
  assert.equal(
    v.find((x) => x.rule === "onboarding-cta-not-fullwidth"),
    undefined,
  );
});

// ─── 멀티스텝 푸터(이전 단계 + 제출) — full-width 면제 + 이전버튼 배치 ───

test("멀티스텝 푸터(이전 단계 + 제출, 카드 밖)는 제출 hug 를 면제한다", () => {
  const v = validateHtmlSource(
    `<html data-project="cashwalk-biz" data-page-pattern="onboarding"><body>` +
      `<div class="onboarding-card"><nds-project-logo project="cashwalk-biz"></nds-project-logo></div>` +
      `<div class="footer-nav">` +
      `<nds-button variant="outlined">이전 단계</nds-button>` +
      `<nds-button color="primary">심사 제출</nds-button>` +
      `</div></body></html>`,
    OPTS,
  );
  assert.equal(
    v.find((x) => x.rule === "onboarding-cta-not-fullwidth"),
    undefined,
    "멀티스텝이면 hug 제출은 full-width error 가 아니다",
  );
  assert.equal(
    v.find((x) => x.rule === "onboarding-back-button-inside-card"),
    undefined,
    "이전버튼이 카드 밖이면 배치 위반 아님",
  );
});

test("멀티스텝에서 [이전 단계] 가 카드 안에 있으면 onboarding-back-button-inside-card warn", () => {
  const v = validateHtmlSource(
    `<html data-project="cashwalk-biz" data-page-pattern="onboarding"><body>` +
      `<div class="onboarding-card">` +
      `<nds-project-logo project="cashwalk-biz"></nds-project-logo>` +
      `<nds-button variant="outlined">이전 단계</nds-button>` +
      `<nds-button color="primary">심사 제출</nds-button>` +
      `</div></body></html>`,
    OPTS,
  );
  const hit = v.find((x) => x.rule === "onboarding-back-button-inside-card");
  assert.ok(hit, "이전버튼이 카드 안이면 warn");
  assert.equal(hit?.severity, "warn");
  assert.equal(
    v.find((x) => x.rule === "onboarding-cta-not-fullwidth"),
    undefined,
    "멀티스텝이므로 full-width error 는 안 뜬다",
  );
});
