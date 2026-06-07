import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource, type HtmlValidationContext } from "./html-validator.js";

/**
 * 재발방지 룰 2종 (회고: 캐포비 CMS 목업):
 *  A) nds-custom-element-content-mutation — <script> 에서 nds-* 호스트의
 *     textContent/innerText/innerHTML 을 직접 대입(회귀: nds-button 라벨을 textContent 로
 *     갈아끼워 버튼 내부 렌더가 통째로 날아감).
 *  B) avoidable-reinvention — div+role/onclick 로 파일업로드·페이지네이션·스텝퍼·검색을
 *     자작(회귀: nds-pagination/nds-stepper 미등록인 줄 알고 div 로 페이저·스텝바를 손수 그림).
 */
const CTX: HtmlValidationContext = {
  tokenSet: new Set(),
  ndsTagSet: new Set([
    "nds-button",
    "nds-input",
    "nds-pagination",
    "nds-stepper",
    "nds-file-upload",
    "nds-image-upload",
    "nds-search-input",
  ]),
  ndsClassPrefixSet: new Set(["nds-"]),
  ndsAttrEnums: new Map(),
};

const v = (html: string) => validateHtmlSource(html, { context: CTX });
const has = (html: string, rule: string) => v(html).some((x) => x.rule === rule);
const hit = (html: string, rule: string) => v(html).find((x) => x.rule === rule);

const A = "nds-custom-element-content-mutation";
const B = "avoidable-reinvention";

// ── A) nds-* textContent 직접 변경 ───────────────────────────────
test("getElementById(nds id).textContent 대입 → A 위반", () => {
  const html = `<html><body>
    <nds-button id="b">다음</nds-button>
    <script>document.getElementById("b").textContent = "변경";</script>
  </body></html>`;
  assert.equal(has(html, A), true);
});

test("변수에 담은 nds 클래스 셀렉터의 innerHTML 대입 → A 위반", () => {
  const html = `<html><body>
    <nds-button class="next-btn">다음</nds-button>
    <script>const btn = document.querySelector(".next-btn"); btn.innerHTML = "<span>x</span>";</script>
  </body></html>`;
  const found = hit(html, A);
  assert.ok(found, "nds 호스트 innerHTML 대입을 잡아야 한다");
  assert.match(found!.suggestion ?? "", /\.value|슬롯/);
});

test("인라인 querySelector('nds-button').textContent 대입 → A 위반", () => {
  const html = `<html><body>
    <nds-button>x</nds-button>
    <script>document.querySelector("nds-button").textContent = "y";</script>
  </body></html>`;
  assert.equal(has(html, A), true);
});

test("plain <div> 의 textContent 대입은 위반 아님(오탐 방지)", () => {
  const html = `<html><body>
    <nds-input id="i"></nds-input>
    <div id="plain"></div>
    <script>
      document.getElementById("i").value = "10";
      document.getElementById("plain").textContent = "ok";
    </script>
  </body></html>`;
  assert.equal(has(html, A), false);
});

test("nds 호스트에 .value/.checked/setAttribute 는 위반 아님(정상 API)", () => {
  const html = `<html><body>
    <nds-input id="amt"></nds-input>
    <script>
      const el = document.getElementById("amt");
      el.value = "1,000";
      el.setAttribute("disabled", "");
    </script>
  </body></html>`;
  assert.equal(has(html, A), false);
});

// ── B) 컴포넌트 재발명(div+role/onclick) ─────────────────────────
test("div[role=button] '파일 첨부' → avoidable-reinvention (FileUpload)", () => {
  const html = `<html><body>
    <div role="button" onclick="pick()">파일 첨부 (드래그하여 업로드)</div>
  </body></html>`;
  const found = hit(html, B);
  assert.ok(found, "파일업로드 자작을 잡아야 한다");
  assert.match(found!.suggestion ?? "", /nds-file-upload/);
});

test("div[onclick] '이미지 업로드' → avoidable-reinvention (ImageUpload)", () => {
  const html = `<html><body>
    <div onclick="pick()">이미지 업로드 (권장 1200x600)</div>
  </body></html>`;
  const found = hit(html, B);
  assert.ok(found);
  assert.match(found!.suggestion ?? "", /nds-image-upload/);
});

test("div[onclick] 페이지 번호 + ‹ › → avoidable-reinvention (Pagination)", () => {
  const html = `<html><body>
    <div onclick="goPage(event)"><span>‹</span><span>1</span><span>2</span><span>3</span><span>›</span></div>
  </body></html>`;
  const found = hit(html, B);
  assert.ok(found, "자작 페이저를 잡아야 한다");
  assert.match(found!.suggestion ?? "", /nds-pagination/);
});

test("div[onclick] 'Step 1 / Step 2 / Step 3' → avoidable-reinvention (Stepper)", () => {
  const html = `<html><body>
    <div onclick="goStep(event)">Step 1 캠페인 · Step 2 광고 · Step 3 소재</div>
  </body></html>`;
  const found = hit(html, B);
  assert.ok(found, "자작 스텝바를 잡아야 한다");
  assert.match(found!.suggestion ?? "", /nds-stepper/);
});

test("실제 <nds-pagination> 사용은 avoidable-reinvention 아님(오탐 방지)", () => {
  const html = `<html><body><nds-pagination total="120" page="1"></nds-pagination></body></html>`;
  assert.equal(has(html, B), false);
});

test("실제 <nds-file-upload> 사용은 avoidable-reinvention 아님(오탐 방지)", () => {
  const html = `<html><body><nds-file-upload>파일 첨부</nds-file-upload></body></html>`;
  assert.equal(has(html, B), false);
});

test("시그니처 없는 일반 div[onclick] 은 named avoidable-reinvention 아님", () => {
  // role-widget 으로 dsRatio 분모엔 들어가지만, 특정 컴포넌트 재발명이 아니므로 named warn 은 안 난다.
  const html = `<html><body><div onclick="openMenu()">메뉴 열기</div></body></html>`;
  assert.equal(has(html, B), false);
});
