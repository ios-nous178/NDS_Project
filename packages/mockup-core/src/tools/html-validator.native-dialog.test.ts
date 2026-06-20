import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

/**
 * native-dialog-in-mockup — 목업 <script> 에서 네이티브 alert()/confirm()/prompt() 사용 감지
 * (회고: 캐포비 온보딩 — "완료"를 alert() 로 띄움. OS 회색 박스라 프로젝트 스타일 0).
 * DS 는 <nds-modal>(확인/완료/안내) + Toast 패턴을 제공한다.
 */
const CTX: HtmlValidationContext = {
  tokenSet: new Set(),
  ndsTagSet: new Set(["nds-button", "nds-modal"]),
  ndsClassPrefixSet: new Set(["nds-"]),
  ndsAttrEnums: new Map(),
};

const v = (html: string) => validateHtmlSource(html, { context: CTX });
const has = (html: string, rule: string) => v(html).some((x) => x.rule === rule);
const hit = (html: string, rule: string) => v(html).find((x) => x.rule === rule);

const R = "native-dialog-in-mockup";

test("bare alert() → 위반 + Modal/Toast 로 유도", () => {
  const html = `<html><body>
    <script>function done(){ alert("제출이 완료되었습니다"); }</script>
  </body></html>`;
  const found = hit(html, R);
  assert.ok(found, "alert() 를 잡아야 한다");
  assert.equal(found!.severity, "warn");
  assert.match(found!.suggestion ?? "", /nds-modal|Toast/);
});

test("confirm() / prompt() 도 위반", () => {
  const a = `<html><body><script>if(confirm("취소할까요?")) cancel();</script></body></html>`;
  const b = `<html><body><script>const n = prompt("이름?");</script></body></html>`;
  assert.equal(has(a, R), true);
  assert.equal(has(b, R), true);
});

test("window.alert(...) prefix 도 위반", () => {
  const html = `<html><body><script>window.alert("x");</script></body></html>`;
  assert.equal(has(html, R), true);
});

test("el.alert(...) 같은 메서드/식별자는 오탐 아님", () => {
  const html = `<html><body>
    <script>
      const banner = makeAlert();
      banner.alert("커스텀 배너");
      const myalert = 1;
    </script>
  </body></html>`;
  assert.equal(has(html, R), false);
});

test("alert 가 없는 정상 스크립트는 위반 아님", () => {
  const html = `<html><body>
    <nds-modal id="done"><p>완료</p></nds-modal>
    <script>document.getElementById("done").setAttribute("open", "");</script>
  </body></html>`;
  assert.equal(has(html, R), false);
});
