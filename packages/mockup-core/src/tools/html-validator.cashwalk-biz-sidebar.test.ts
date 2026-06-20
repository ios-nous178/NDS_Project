import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 캐포비 어드민 사이드바 구성 검증 룰.
 * 회고: nds-sidebar 가 로고 + 계정 블록(이메일→잔액→충전/내역 CTA) 없이, 또 풀하이트 셸 밖에
 * 렌더돼 "로고+로그인영역이 빠지고 높이가 안 차는" 목업이 반복 생성됐다. 가이드 권고로는
 * 막히지 않아 validator 하드 룰로 차단한다.
 *   - cashwalk-biz-sidebar-incomplete : 로고(logo-src) / 계정 블록(account) 누락 (error)
 *   - cashwalk-biz-sidebar-logout     : 로그아웃(footer-actions) 누락 (warn)
 *   - cashwalk-biz-sidebar-shell      : 풀하이트 셸(.nds-shell) 밖 (error)
 */

const ACCOUNT =
  `account='{"email":"biz@cashwalk.io","balanceLabel":"충전 잔액","balance":"₩1,250,000",` +
  `"actions":[{"label":"충전하기","variant":"solid"},{"label":"내역보기","variant":"outlined"}]}'`;
const FOOTER = `footer-actions='[{"label":"로그아웃","variant":"outlined"}]'`;
const ITEMS = `items='[{"key":"home","label":"홈"}]'`;

const COMPLETE = `<html data-project="cashwalk-biz" data-page-pattern="list"><body>
  <div class="nds-shell">
    <nds-sidebar logo-src="data:image/svg+xml;base64,AAAA" ${ACCOUNT} ${FOOTER} ${ITEMS}></nds-sidebar>
    <main class="nds-shell__main">정산 목록</main>
  </div>
</body></html>`;

const NO_LOGO_NO_ACCOUNT = `<html data-project="cashwalk-biz" data-page-pattern="list"><body>
  <div class="nds-shell">
    <nds-sidebar ${ITEMS}></nds-sidebar>
    <main class="nds-shell__main">정산 목록</main>
  </div>
</body></html>`;

const NO_FOOTER_ACTIONS = `<html data-project="cashwalk-biz" data-page-pattern="list"><body>
  <div class="nds-shell">
    <nds-sidebar logo-src="data:image/svg+xml;base64,AAAA" ${ACCOUNT} ${ITEMS}></nds-sidebar>
    <main class="nds-shell__main">정산 목록</main>
  </div>
</body></html>`;

const NO_SHELL = `<html data-project="cashwalk-biz" data-page-pattern="list"><body>
  <nds-sidebar logo-src="data:image/svg+xml;base64,AAAA" ${ACCOUNT} ${FOOTER} ${ITEMS}></nds-sidebar>
  <main>정산 목록</main>
</body></html>`;

const TROST_SIDEBAR = `<html data-project="trost" data-page-pattern="list"><body>
  <nds-sidebar ${ITEMS}></nds-sidebar>
  <main>목록</main>
</body></html>`;

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

test("로고+계정 블록 누락 → cashwalk-biz-sidebar-incomplete error", () => {
  const v = validateHtmlSource(NO_LOGO_NO_ACCOUNT, { surface: "admin", project: "cashwalk-biz" });
  const hit = has(v, "cashwalk-biz-sidebar-incomplete");
  assert.ok(hit, "로고/계정 누락이면 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("완전한 사이드바(로고+계정+로그아웃, 셸 안)는 사이드바 위반 없음", () => {
  const v = validateHtmlSource(COMPLETE, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(has(v, "cashwalk-biz-sidebar-incomplete"), undefined);
  assert.equal(has(v, "cashwalk-biz-sidebar-logout"), undefined);
  assert.equal(has(v, "cashwalk-biz-sidebar-shell"), undefined);
});

test("로그아웃(footer-actions) 누락 → cashwalk-biz-sidebar-logout warn (incomplete 아님)", () => {
  const v = validateHtmlSource(NO_FOOTER_ACTIONS, { surface: "admin", project: "cashwalk-biz" });
  const hit = has(v, "cashwalk-biz-sidebar-logout");
  assert.ok(hit, "로그아웃 누락이면 warn 이어야 함");
  assert.equal(hit?.severity, "warn");
  assert.equal(
    has(v, "cashwalk-biz-sidebar-incomplete"),
    undefined,
    "로고+계정은 있으니 incomplete 아님",
  );
});

test("풀하이트 셸 밖 → cashwalk-biz-sidebar-shell error", () => {
  const v = validateHtmlSource(NO_SHELL, { surface: "admin", project: "cashwalk-biz" });
  const hit = has(v, "cashwalk-biz-sidebar-shell");
  assert.ok(hit, "셸 밖이면 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("셸 안이면 cashwalk-biz-sidebar-shell 위반 아님", () => {
  const v = validateHtmlSource(COMPLETE, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(has(v, "cashwalk-biz-sidebar-shell"), undefined);
});

test("다른 프로젝트(trost) 어드민 사이드바면 캐포비 사이드바 룰 미적용", () => {
  const v = validateHtmlSource(TROST_SIDEBAR, { surface: "admin", project: "trost" });
  assert.equal(has(v, "cashwalk-biz-sidebar-incomplete"), undefined);
  assert.equal(has(v, "cashwalk-biz-sidebar-logout"), undefined);
  assert.equal(has(v, "cashwalk-biz-sidebar-shell"), undefined);
});

test("surface=service 면 캐포비여도 사이드바 구성 룰 미적용", () => {
  const v = validateHtmlSource(NO_LOGO_NO_ACCOUNT, { surface: "service", project: "cashwalk-biz" });
  assert.equal(has(v, "cashwalk-biz-sidebar-incomplete"), undefined);
  assert.equal(has(v, "cashwalk-biz-sidebar-shell"), undefined);
});

// ─── 신규 ready-made 폼: project= 로고 자동주입 + <script type="application/json" slot="..."> 텍스트 노드 ───
const PROJECT_SLOT_FORM = `<html data-project="cashwalk-biz" data-page-pattern="list"><body>
  <div class="nds-shell">
    <nds-sidebar project="cashwalk-biz" active-key="banner-list" width="300" title="포 비즈니스">
      <script type="application/json" slot="account">{"email":"biz@cashwalk.io","balanceLabel":"충전 잔액","balance":"₩1,250,000","actions":[{"label":"충전하기","variant":"solid"},{"label":"내역보기","variant":"outlined"}]}</script>
      <script type="application/json" slot="footer-actions">[{"label":"로그아웃","variant":"outlined"}]</script>
      <script type="application/json" slot="items">[{"key":"home","label":"홈"}]</script>
    </nds-sidebar>
    <main class="nds-shell__main">정산 목록</main>
  </div>
</body></html>`;

test("신규 폼(project= + <script slot>)은 로고/계정/로그아웃 모두 인정 → 사이드바 위반 없음", () => {
  const v = validateHtmlSource(PROJECT_SLOT_FORM, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(
    has(v, "cashwalk-biz-sidebar-incomplete"),
    undefined,
    "project= 로고 + <script slot=account> 를 인정해야 함",
  );
  assert.equal(
    has(v, "cashwalk-biz-sidebar-logout"),
    undefined,
    "<script slot=footer-actions> 를 인정해야 함",
  );
  assert.equal(has(v, "cashwalk-biz-sidebar-shell"), undefined);
});

// ─── 모지바케(UTF-8 한글을 Latin-1 로 잘못 디코딩) 감지 ───
//   Buffer.from(korean,'utf8').toString('latin1') 이 실제 회귀의 깨짐 바이트를 그대로 재현.
const mojibakeKorean = Buffer.from("광고 관리 자산 관리 로그아웃", "utf8").toString("latin1");
const MOJIBAKE = `<html data-project="cashwalk-biz" data-page-pattern="list"><body>
  <div class="nds-shell">
    <nds-sidebar project="cashwalk-biz">
      <script type="application/json" slot="items">[{"key":"ad","label":"${mojibakeKorean}"}]</script>
    </nds-sidebar>
    <main class="nds-shell__main">${mojibakeKorean}</main>
  </div>
</body></html>`;

test("UTF-8 한글을 Latin-1 로 잘못 디코딩한 모지바케 → mojibake-encoding error", () => {
  const v = validateHtmlSource(MOJIBAKE, { surface: "admin", project: "cashwalk-biz" });
  const hit = has(v, "mojibake-encoding");
  assert.ok(hit, "모지바케면 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("정상 한글 목업(신규 폼)은 mojibake-encoding 오탐 없음", () => {
  const v = validateHtmlSource(PROJECT_SLOT_FORM, { surface: "admin", project: "cashwalk-biz" });
  assert.equal(
    has(v, "mojibake-encoding"),
    undefined,
    "정상 Hangul·base64·ASCII 는 오탐 없어야 함",
  );
});
