import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

/**
 * E1: low-ds-ratio 게이트 — "DS 반영"이 보고만 되고 강제되지 않던 구멍을 막는다.
 *     nds-* 1개만 있어도 통과하던 문제 → DS 대상 요소가 충분한데 반영도가 바닥이면 error.
 *     단순 화면(대상 < LOW_DS_MIN_ELIGIBLE)은 면제(억울한 차단 방지).
 * E4: 가짜 nds-* 클래스가 native-interactive 를 무력화하거나 dsRatio 를 부풀리지 못하게 한다.
 */

const sixNative = `<html><body>${Array.from({ length: 6 }, () => "<button>x</button>").join("")}</body></html>`;
const sixNds = `<html><body>${Array.from({ length: 6 }, () => "<nds-button>x</nds-button>").join("")}</body></html>`;
const twoNative = `<html><body><button>a</button><button>b</button></body></html>`;
// 2 채택 / 3 미교체 = 40% (<50) → 위반
const ratio40 = `<html><body><nds-button>a</nds-button><nds-button>b</nds-button><button>c</button><button>d</button><button>e</button></body></html>`;
// 3 채택 / 2 미교체 = 60% (>=50) → 통과
const ratio60 = `<html><body><nds-button>a</nds-button><nds-button>b</nds-button><nds-button>c</nds-button><button>d</button><button>e</button></body></html>`;

test("E1: native 다수 + nds 0 → low-ds-ratio error (반영도 0%)", () => {
  const v = validateHtmlSource(sixNative);
  const hit = v.find((x) => x.rule === "low-ds-ratio");
  assert.ok(hit, "low-ds-ratio 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("E1: nds 다수(100%) → low-ds-ratio 없음", () => {
  const v = validateHtmlSource(sixNds);
  assert.equal(
    v.find((x) => x.rule === "low-ds-ratio"),
    undefined,
  );
});

test("E1: 단순 화면(대상 2개)은 면제 — low-ds-ratio 없음", () => {
  const v = validateHtmlSource(twoNative);
  assert.equal(
    v.find((x) => x.rule === "low-ds-ratio"),
    undefined,
    "대상이 LOW_DS_MIN_ELIGIBLE 미만이면 게이트 면제",
  );
});

test("E1 경계: 40% 는 위반, 60% 는 통과", () => {
  const lo = validateHtmlSource(ratio40);
  const hi = validateHtmlSource(ratio60);
  assert.ok(
    lo.find((x) => x.rule === "low-ds-ratio"),
    "40% 는 low-ds-ratio 위반",
  );
  assert.equal(
    hi.find((x) => x.rule === "low-ds-ratio"),
    undefined,
    "60% 는 통과",
  );
});

// ── E4: 가짜 nds-* 클래스 차단 (실재 nds 클래스 목록을 가진 컨텍스트에서) ──

const CTX: HtmlValidationContext = {
  tokenSet: new Set<string>(),
  ndsTagSet: new Set<string>(["nds-button", "nds-input"]),
  ndsClassPrefixSet: new Set<string>(["nds-button", "nds-input"]),
};

test("E4: 가짜 nds-foo 클래스는 native-interactive 를 무력화하지 못한다", () => {
  const v = validateHtmlSource(`<html><body><button class="nds-foo">x</button></body></html>`, {
    context: CTX,
  });
  assert.ok(
    v.find((x) => x.rule === "native-interactive"),
    "실재하지 않는 nds 클래스는 native-interactive 를 잠재우면 안 됨",
  );
});

test("E4: 실재 nds-button 클래스는 native-interactive 를 무력화한다", () => {
  const v = validateHtmlSource(`<html><body><button class="nds-button">x</button></body></html>`, {
    context: CTX,
  });
  assert.equal(
    v.find((x) => x.rule === "native-interactive"),
    undefined,
    "카탈로그에 있는 nds 클래스는 정상 silencing",
  );
});

test("E4: 가짜 nds-* 로 dsRatio 를 부풀려 low-ds-ratio 게이트를 우회하지 못한다", () => {
  const sixFake = `<html><body>${Array.from(
    { length: 6 },
    () => '<button class="nds-foo">x</button>',
  ).join("")}</body></html>`;
  const v = validateHtmlSource(sixFake, { context: CTX });
  assert.ok(
    v.find((x) => x.rule === "low-ds-ratio"),
    "가짜 nds-foo 는 채택으로 카운트되지 않아 반영도 0% → 게이트가 잡아야 함",
  );
});
