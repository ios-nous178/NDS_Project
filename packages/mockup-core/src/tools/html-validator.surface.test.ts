import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 표면(surface) ↔ 화면 chrome 불일치 룰.
 * 회고(2026-06): cashwalk-biz 는 admin/service 가 둘 다 intent='html' 로 붕괴해 import 기반
 * context 감지로는 어드민/소비자를 구분 못 한다. 선언된 surface 를 지배 변수로 삼아
 * '가입/로그인' 화면 이름 통념으로 admin 을 소비자 플로우로 오제작하는 것을 차단한다.
 */

const ADMIN_WITH_PROJECT_HEADER = `<html><body>
  <nds-project-header project="cashwalk-biz" surface="web"></nds-project-header>
  <main>회원가입</main>
</body></html>`;

const ADMIN_WITH_SHELL = `<html><body>
  <div class="nds-shell">
    <aside class="nds-shell__sidebar"><nds-sidebar></nds-sidebar></aside>
    <main class="nds-shell__main">회원가입</main>
  </div>
</body></html>`;

const ADMIN_ONBOARDING_CARD = `<html><body>
  <main style="display:flex; justify-content:center;">
    <nds-card><nds-input></nds-input><nds-button>로그인</nds-button></nds-card>
  </main>
</body></html>`;

const SERVICE_WITH_SIDEBAR = `<html><body>
  <nds-sidebar></nds-sidebar>
  <main>홈</main>
</body></html>`;

test("surface=admin 인데 소비자 project chrome 사용 → admin-surface-consumer-chrome error", () => {
  const v = validateHtmlSource(ADMIN_WITH_PROJECT_HEADER, { surface: "admin" });
  const hit = v.find((x) => x.rule === "admin-surface-consumer-chrome");
  assert.ok(hit, "admin-surface-consumer-chrome 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("surface=admin + admin-shell(사이드바) 은 위반 아님", () => {
  const v = validateHtmlSource(ADMIN_WITH_SHELL, { surface: "admin" });
  assert.equal(
    v.find((x) => x.rule === "admin-surface-consumer-chrome"),
    undefined,
  );
});

test("surface=admin + 어드민 온보딩 중앙 카드(project chrome 없음)는 위반 아님", () => {
  // 어드민 온보딩(로그인/가입)은 admin-shell 없이 중앙 카드가 정상 — false positive 방지.
  const v = validateHtmlSource(ADMIN_ONBOARDING_CARD, { surface: "admin" });
  assert.equal(
    v.find((x) => x.rule === "admin-surface-consumer-chrome"),
    undefined,
  );
});

test("surface 미선언(null)이면 chrome 룰을 적용하지 않는다(백워드 호환)", () => {
  const v = validateHtmlSource(ADMIN_WITH_PROJECT_HEADER);
  assert.equal(
    v.find((x) => x.rule === "admin-surface-consumer-chrome"),
    undefined,
  );
});

test("surface=service 면 project chrome 은 정상(위반 아님)", () => {
  const v = validateHtmlSource(ADMIN_WITH_PROJECT_HEADER, { surface: "service" });
  assert.equal(
    v.find((x) => x.rule === "admin-surface-consumer-chrome"),
    undefined,
  );
});

test("surface=service 인데 어드민 사이드바 사용 → service-surface-admin-shell warn(역방향)", () => {
  const v = validateHtmlSource(SERVICE_WITH_SIDEBAR, { surface: "service" });
  const hit = v.find((x) => x.rule === "service-surface-admin-shell");
  assert.ok(hit, "service-surface-admin-shell 위반이 있어야 함");
  assert.equal(hit?.severity, "warn");
});
