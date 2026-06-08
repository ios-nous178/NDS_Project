import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 캐포비 어드민 Page Pattern 강제 룰 (cashwalk-biz-admin-page-pattern).
 * surface=admin + brand=cashwalk-biz 화면은 루트에 data-page-pattern 으로
 * 5종(Onboarding/Dashboard/List/Detail/Form) 중 하나를 선언해야 한다(없거나 미지 값이면 error).
 */

const ADMIN_NO_PATTERN = `<html data-brand="cashwalk-biz"><body>
  <div class="nds-shell"><main>정산 목록</main></div>
</body></html>`;

const ADMIN_VALID_PATTERN = `<html data-brand="cashwalk-biz" data-page-pattern="list"><body>
  <div class="nds-shell"><main>정산 목록</main></div>
</body></html>`;

const ADMIN_INVALID_PATTERN = `<html data-brand="cashwalk-biz" data-page-pattern="kanban"><body>
  <div class="nds-shell"><main>정산 보드</main></div>
</body></html>`;

const ADMIN_PATTERN_ON_BODY = `<html><body data-page-pattern="detail">
  <div class="nds-shell"><main>상세</main></div>
</body></html>`;

test("admin + cashwalk-biz + 패턴 미선언 → cashwalk-biz-admin-page-pattern error", () => {
  const v = validateHtmlSource(ADMIN_NO_PATTERN, { surface: "admin", brand: "cashwalk-biz" });
  const hit = v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern");
  assert.ok(hit, "패턴 미선언이면 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("admin + cashwalk-biz + 유효 data-page-pattern 은 위반 아님", () => {
  const v = validateHtmlSource(ADMIN_VALID_PATTERN, { surface: "admin", brand: "cashwalk-biz" });
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern"),
    undefined,
  );
});

test("admin + cashwalk-biz + 미지 패턴 값 → error", () => {
  const v = validateHtmlSource(ADMIN_INVALID_PATTERN, { surface: "admin", brand: "cashwalk-biz" });
  const hit = v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern");
  assert.ok(hit, "미지 패턴 값이면 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("brand 인자 없이 HTML data-brand=cashwalk-biz 만으로도 트리거된다", () => {
  const v = validateHtmlSource(ADMIN_NO_PATTERN, { surface: "admin" });
  assert.ok(v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern"));
});

test("brand 별칭(cashpobi)도 정규화돼 트리거된다", () => {
  const v = validateHtmlSource(ADMIN_NO_PATTERN, { surface: "admin", brand: "cashpobi" });
  assert.ok(v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern"));
});

test("data-page-pattern 이 body 에 있어도 인식한다", () => {
  const v = validateHtmlSource(ADMIN_PATTERN_ON_BODY, { surface: "admin", brand: "cashwalk-biz" });
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern"),
    undefined,
  );
});

test("admin 이지만 다른 브랜드(trost)면 페이지 패턴 룰 미적용", () => {
  const v = validateHtmlSource(ADMIN_NO_PATTERN, { surface: "admin", brand: "trost" });
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern"),
    undefined,
  );
});

test("surface=service 면 캐포비여도 페이지 패턴 룰 미적용", () => {
  const v = validateHtmlSource(ADMIN_NO_PATTERN, { surface: "service", brand: "cashwalk-biz" });
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern"),
    undefined,
  );
});

test("surface 미선언(null)이면 페이지 패턴 룰 미적용(백워드 호환)", () => {
  const v = validateHtmlSource(ADMIN_NO_PATTERN, { brand: "cashwalk-biz" });
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-admin-page-pattern"),
    undefined,
  );
});

/**
 * onboarding 레이아웃 계약 (cashwalk-biz-onboarding-no-shell).
 * onboarding(로그인·아이디/비번 찾기)은 비로그인 진입 화면이라 shell(사이드바/풀하이트 셸)이 없다.
 * data-page-pattern="onboarding" 으로 선언해 놓고 사이드바/셸을 붙이면 error.
 */
const ONBOARDING_WITH_SIDEBAR = `<html data-brand="cashwalk-biz" data-page-pattern="onboarding"><body>
  <div class="nds-shell"><nds-sidebar brand="cashwalk-biz"></nds-sidebar><main>로그인</main></div>
</body></html>`;

const ONBOARDING_PROPER_CARD = `<html data-brand="cashwalk-biz" data-page-pattern="onboarding"><body>
  <div class="onboarding-card">
    <svg viewBox="0 0 10 10"></svg>
    <form><input /></form>
  </div>
</body></html>`;

const ONBOARDING_EMPTY = `<html data-brand="cashwalk-biz" data-page-pattern="onboarding"><body>
  <main>로그인</main>
</body></html>`;

const LIST_WITH_SIDEBAR = `<html data-brand="cashwalk-biz" data-page-pattern="list"><body>
  <div class="nds-shell"><nds-sidebar brand="cashwalk-biz"></nds-sidebar><main>정산 목록</main></div>
</body></html>`;

test("onboarding 인데 사이드바/셸이 있으면 → cashwalk-biz-onboarding-no-shell error", () => {
  const v = validateHtmlSource(ONBOARDING_WITH_SIDEBAR, {
    surface: "admin",
    brand: "cashwalk-biz",
  });
  const hits = v.filter((x) => x.rule === "cashwalk-biz-onboarding-no-shell");
  assert.ok(hits.length >= 1, "온보딩 + shell 이면 위반이어야 함");
  assert.equal(hits[0]?.severity, "error");
});

test("onboarding + 사이드바면 'incomplete' 가 아니라 'no-shell' 메시지로 잡는다", () => {
  const v = validateHtmlSource(ONBOARDING_WITH_SIDEBAR, {
    surface: "admin",
    brand: "cashwalk-biz",
  });
  // 사이드바 자체가 금지이므로 완성도(incomplete) 검사는 건너뛴다 — "빼라"가 맞는 메시지.
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-sidebar-incomplete"),
    undefined,
  );
});

test("onboarding + shell 없이 카드+로고면 위반 아님", () => {
  const v = validateHtmlSource(ONBOARDING_PROPER_CARD, { surface: "admin", brand: "cashwalk-biz" });
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-onboarding-no-shell"),
    undefined,
  );
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-onboarding-skeleton"),
    undefined,
  );
});

test("onboarding 인데 로고·카드 골격이 둘 다 안 보이면 → skeleton info(권고)", () => {
  const v = validateHtmlSource(ONBOARDING_EMPTY, { surface: "admin", brand: "cashwalk-biz" });
  const hit = v.find((x) => x.rule === "cashwalk-biz-onboarding-skeleton");
  assert.ok(hit, "골격 미완이면 권고가 떠야 함");
  assert.equal(hit?.severity, "info");
});

test("list 패턴은 사이드바가 있어도 no-shell 룰 미적용(온보딩 전용)", () => {
  const v = validateHtmlSource(LIST_WITH_SIDEBAR, { surface: "admin", brand: "cashwalk-biz" });
  assert.equal(
    v.find((x) => x.rule === "cashwalk-biz-onboarding-no-shell"),
    undefined,
  );
});
