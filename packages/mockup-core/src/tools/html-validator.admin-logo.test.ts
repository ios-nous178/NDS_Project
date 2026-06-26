import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * admin-sidebar-logo-not-component 룰.
 * 회고(2026-06): 백오피스 CMS 사이드바 로고를 텍스트 placeholder 로 두거나 빌드 산출물에서
 * 로고 base64 를 추출해 raw <img data:…> 로 박는 우회가 반복됐다(에셋 패키지에 data URI 로
 * 내장돼 있는데도). admin 셸 사이드바·톱바에 손수 만든 로고가 있고 <nds-sidebar project> /
 * <nds-project-logo> 가 없으면 warn 으로 컴포넌트 사용을 유도. 사이드바 아이콘(inline SVG)·
 * 계정 아바타는 오탐 제외.
 */

const RULE = "admin-sidebar-logo-not-component";

const MANUAL_BASE64_LOGO = `<aside class="nds-shell__sidebar">
  <img src="data:image/webp;base64,UklGRkAAAAB" alt="geniet logo" />
  <nav><a href="/">대시보드</a></nav>
</aside>`;

const TEXT_LOGO = `<aside class="nds-shell__sidebar">
  <div class="cms-sidebar-logo">geniet</div>
  <nds-sidebar items="[]"></nds-sidebar>
</aside>`;

const PROPER_SIDEBAR_PROJECT = `<aside class="nds-shell__sidebar">
  <nds-sidebar project="geniet" items="[]"></nds-sidebar>
</aside>`;

const PROPER_PROJECT_LOGO = `<aside class="nds-shell__sidebar">
  <nds-project-logo project="geniet" height="40"></nds-project-logo>
  <nds-sidebar items="[]"></nds-sidebar>
</aside>`;

const SIDEBAR_ICONS_ONLY = `<aside class="nds-shell__sidebar">
  <nds-sidebar project="geniet" items='[{"label":"홈","icon":"<svg viewBox=\\"0 0 24 24\\"><path d=\\"M1 1\\"/></svg>"}]'></nds-sidebar>
</aside>`;

const AVATAR_DATA_IMG = `<aside class="nds-shell__sidebar">
  <nds-sidebar project="geniet" items="[]"></nds-sidebar>
  <div class="account"><img src="data:image/png;base64,iVBORw0" alt="avatar" /></div>
</aside>`;

test("admin 셸 사이드바에 수동 base64 <img> 로고 → admin-sidebar-logo-not-component error", () => {
  // [승격 2026-06-26 warn→error] 원칙5 — 승격 로그: scripts/validator-promotion-log.json
  const v = validateHtmlSource(MANUAL_BASE64_LOGO);
  const hit = v.find((x) => x.rule === RULE);
  assert.ok(hit, "수동 base64 로고는 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("admin 셸 사이드바에 텍스트 로고(.logo 박스) → 위반", () => {
  const v = validateHtmlSource(TEXT_LOGO);
  assert.ok(
    v.find((x) => x.rule === RULE),
    "텍스트 로고도 위반이어야 함",
  );
});

test("<nds-sidebar project> 로 로고 자동 주입 → 위반 아님", () => {
  const v = validateHtmlSource(PROPER_SIDEBAR_PROJECT);
  assert.equal(
    v.find((x) => x.rule === RULE),
    undefined,
  );
});

test("<nds-project-logo> 사용 → 위반 아님", () => {
  const v = validateHtmlSource(PROPER_PROJECT_LOGO);
  assert.equal(
    v.find((x) => x.rule === RULE),
    undefined,
  );
});

test("사이드바 아이콘(inline SVG)만 있고 로고는 project 주입 → 위반 아님(오탐 방지)", () => {
  const v = validateHtmlSource(SIDEBAR_ICONS_ONLY);
  assert.equal(
    v.find((x) => x.rule === RULE),
    undefined,
  );
});

test("계정/아바타 data img 는 로고 아님 → 위반 아님(오탐 방지)", () => {
  const v = validateHtmlSource(AVATAR_DATA_IMG);
  assert.equal(
    v.find((x) => x.rule === RULE),
    undefined,
  );
});
