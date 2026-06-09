import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 캐포비 온보딩/인증 화면 오용 룰 5종 — DS 컴포넌트/패턴을 안 쓰고 손으로 때운 케이스 차단.
 *   onboarding-missing-brand-logo / onboarding-social-bare-text / onboarding-success-plain-circle /
 *   verification-manual-assembly / consent-raw-checkbox
 * 모두 onboarding(data-page-pattern="onboarding") + cashwalk-biz admin 스코프에서만 발화.
 * 각 룰: 위반 HTML(잡혀야 함) + 정상 HTML(false-positive 가드, 안 잡혀야 함).
 */

const OPTS = { surface: "admin" as const, brand: "cashwalk-biz" };

function wrap(inner: string): string {
  return `<html data-brand="cashwalk-biz" data-page-pattern="onboarding"><body>
    <div class="onboarding-card">${inner}</div>
  </body></html>`;
}

function has(html: string, rule: string) {
  return validateHtmlSource(html, OPTS).find((x) => x.rule === rule);
}

// ─── 1) onboarding-missing-brand-logo ───

test("로고를 raw svg 로 조립 + nds-brand-logo 없음 → onboarding-missing-brand-logo warn", () => {
  const html = wrap(`<svg viewBox="0 0 10 10"></svg><form><input placeholder="이메일" /></form>`);
  const hit = has(html, "onboarding-missing-brand-logo");
  assert.ok(hit, "nds-brand-logo 가 없으면 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("nds-brand-logo 컴포넌트가 있으면 위반 아님", () => {
  const html = wrap(
    `<nds-brand-logo brand="cashwalk-biz" height="40"></nds-brand-logo><form><input placeholder="이메일" /></form>`,
  );
  assert.equal(has(html, "onboarding-missing-brand-logo"), undefined);
});

// ─── 2) onboarding-social-bare-text ───

test("소셜 로그인을 텍스트(G/K/N)로 때움 → onboarding-social-bare-text warn", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <div class="social-row"><span>소셜 로그인</span>
      <button>G</button><button>K</button><button>N</button></div>`);
  const hit = has(html, "onboarding-social-bare-text");
  assert.ok(hit, "소셜 신호 + sns 자산 미사용이면 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("소셜 영역에 sns-logos 자산을 쓰면 위반 아님", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <div class="social-row"><span>간편 로그인</span>
      <button><img src="@nudge-design/assets/files/sns-logos/google-main.png" alt="google" /></button>
      <button><img src="@nudge-design/assets/files/sns-logos/kakao-main.png" alt="kakao" /></button></div>`);
  assert.equal(has(html, "onboarding-social-bare-text"), undefined);
});

test("소셜/간편 텍스트 신호가 없으면 발화 안 함(false-positive 가드)", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <form><input placeholder="이메일" /><button>로그인</button></form>`);
  assert.equal(has(html, "onboarding-social-bare-text"), undefined);
});

// ─── 3) onboarding-success-plain-circle ───

test("완료 화면 + 체크 없는 민무늬 초록 원 → onboarding-success-plain-circle warn", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <div style="width:64px;height:64px;border-radius:50%;background:green;"></div>
    <h2>신청 완료</h2>`);
  const hit = has(html, "onboarding-success-plain-circle");
  assert.ok(hit, "완료 신호 + 체크 없는 초록 원이면 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("초록 원 안에 체크 아이콘이 있으면 위반 아님", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <div style="width:64px;height:64px;border-radius:50%;background:green;"><svg></svg></div>
    <h2>심사 완료</h2>`);
  assert.equal(has(html, "onboarding-success-plain-circle"), undefined);
});

test("완료/성공/심사 신호가 없으면 원이 있어도 발화 안 함(false-positive 가드)", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <div style="width:64px;height:64px;border-radius:50%;background:green;"></div>
    <form><input placeholder="이메일" /></form>`);
  assert.equal(has(html, "onboarding-success-plain-circle"), undefined);
});

// ─── 4) verification-manual-assembly ───

test("인증번호 input 을 손으로 조립 → verification-manual-assembly warn", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <form>
      <input placeholder="인증번호 6자리" />
      <span>남은 시간 02:59</span>
    </form>`);
  const hit = has(html, "verification-manual-assembly");
  assert.ok(hit, "인증번호 placeholder + 손조립이면 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("nds-field-action-row 로 감싸면 위반 아님", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <nds-field-action-row>
      <nds-verification-code-input length="6"></nds-verification-code-input>
      <nds-countdown-timer></nds-countdown-timer>
    </nds-field-action-row>`);
  assert.equal(has(html, "verification-manual-assembly"), undefined);
});

// ─── 5) consent-raw-checkbox ───

test("약관 동의를 raw 체크박스로 조립 → consent-raw-checkbox warn", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <label><input type="checkbox" /> [필수] 이용약관에 동의합니다</label>`);
  const hit = has(html, "consent-raw-checkbox");
  assert.ok(hit, "약관 신호 + raw 체크박스면 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("nds-checkbox-group 으로 약관 동의를 만들면 위반 아님", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <nds-checkbox-group>
      <script type="application/json" slot="items">[{"label":"[필수] 이용약관 동의"}]</script>
    </nds-checkbox-group>`);
  assert.equal(has(html, "consent-raw-checkbox"), undefined);
});

test("약관/동의/필수 신호 없는 일반 체크박스는 발화 안 함(false-positive 가드)", () => {
  const html = wrap(`
    <nds-brand-logo brand="cashwalk-biz"></nds-brand-logo>
    <label><input type="checkbox" /> 로그인 상태 유지</label>`);
  assert.equal(has(html, "consent-raw-checkbox"), undefined);
});

// ─── 스코프 가드: onboarding 이 아니면 5종 모두 미적용 ───

test("data-page-pattern=list 면 온보딩 룰 5종 전부 미적용", () => {
  const html = `<html data-brand="cashwalk-biz" data-page-pattern="list"><body>
    <div class="nds-shell"><main>
      <svg></svg>
      <div style="width:64px;height:64px;border-radius:50%;background:green;"></div>
      <span>소셜 로그인</span><button>G</button>
      <input placeholder="인증번호 6자리" />
      <label><input type="checkbox" /> [필수] 약관 동의</label>
      <h2>완료</h2>
    </main></div>
  </body></html>`;
  const v = validateHtmlSource(html, OPTS);
  for (const rule of [
    "onboarding-missing-brand-logo",
    "onboarding-social-bare-text",
    "onboarding-success-plain-circle",
    "verification-manual-assembly",
    "consent-raw-checkbox",
  ]) {
    assert.equal(
      v.find((x) => x.rule === rule),
      undefined,
      `${rule} 는 onboarding 이 아니면 발화하면 안 됨`,
    );
  }
});
