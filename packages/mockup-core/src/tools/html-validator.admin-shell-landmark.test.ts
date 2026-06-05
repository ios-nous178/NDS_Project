import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

/**
 * raw-landmark × admin-shell.
 *
 * 회고(2026-06): 캐포비 어드민(업용) 목업에서 헤더/사이드바가 검증(raw-landmark)에 걸려,
 * 작성자(다른 AI)가 빠져나가려 <header>/<aside> 를 <div> 로 strip 했다. 그런데 admin-shell
 * 패턴(pattern:admin-shell)의 SSOT 는 <header class="nds-shell__topbar"> / <aside
 * class="nds-shell__sidebar"> 를 명시한다 — 즉 그 landmark 들이 정답인데 검증이 막은 것.
 * 또 raw-landmark 의 기존 suggestion 은 admin 화면에 nds-header/brand-header 를 권했는데,
 * 이는 admin-surface-consumer-chrome(error) 와 정면 충돌한다.
 */

// raw-landmark 가 발화하려면 ctx.ndsTagSet 에 대체 nds-* 태그가 있어야 한다.
const CTX: HtmlValidationContext = {
  tokenSet: new Set(),
  ndsTagSet: new Set(["nds-sidebar", "nds-header", "nds-footer", "nds-button"]),
  ndsClassPrefixSet: new Set(["nds-"]),
  ndsAttrEnums: new Map(),
};

const ADMIN_SHELL = `<html><body>
  <div class="nds-shell">
    <aside class="nds-shell__sidebar"><nds-sidebar></nds-sidebar></aside>
    <main class="nds-shell__main">
      <header class="nds-shell__topbar"><h1>퀴즈 검수</h1></header>
      <div class="nds-shell__content">본문</div>
    </main>
  </div>
</body></html>`;

const ADMIN_BARE_HEADER = `<html><body>
  <header><h1>퀴즈 검수</h1></header>
  <main>본문</main>
</body></html>`;

const SERVICE_BARE_ASIDE = `<html><body>
  <aside>메뉴</aside>
  <main>홈</main>
</body></html>`;

test("admin-shell chrome(<header class='nds-shell__topbar'> / <aside class='nds-shell__sidebar'>)는 raw-landmark 아님", () => {
  const v = validateHtmlSource(ADMIN_SHELL, { surface: "admin", context: CTX });
  assert.equal(
    v.find((x) => x.rule === "raw-landmark"),
    undefined,
    "admin-shell 이 처방하는 셸 chrome 은 raw-landmark 로 잡지 않는다",
  );
});

test("표면=admin 의 bare <header> 는 raw-landmark 이되 suggestion 이 admin-shell 로 유도(소비자 chrome 금지)", () => {
  const v = validateHtmlSource(ADMIN_BARE_HEADER, {
    surface: "admin",
    context: CTX,
  });
  const hit = v.find((x) => x.rule === "raw-landmark");
  assert.ok(hit, "shell 클래스 없는 bare <header> 는 여전히 잡아야 한다");
  const sug = hit!.suggestion ?? "";
  assert.match(sug, /nds-shell__topbar/);
  assert.match(sug, /admin-shell/);
  // 소비자 chrome 을 "우선 사용/교체" 로 권하지 않는다 (admin-surface-consumer-chrome 와 모순 방지).
  assert.doesNotMatch(
    sug,
    /nds-header 우선|nds-brand-header[^]{0,30}교체/,
    "admin 화면에 소비자 chrome 사용을 권하면 안 된다",
  );
});

test("표면=service 의 bare <aside> 는 종전처럼 nds-sidebar 로 유도(백워드 호환)", () => {
  const v = validateHtmlSource(SERVICE_BARE_ASIDE, {
    surface: "service",
    context: CTX,
  });
  const hit = v.find((x) => x.rule === "raw-landmark");
  assert.ok(hit);
  assert.match(hit!.suggestion ?? "", /nds-sidebar/);
});
