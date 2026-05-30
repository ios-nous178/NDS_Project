import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DS_STAMP_MARKER,
  injectDsStampBar,
  renderDsStampBar,
  stripDsStampBar,
} from "./ds-stamp.js";

const countOccurrences = (s: string, sub: string): number => s.split(sub).length - 1;

test("renderDsStampBar 은 DS 버전 / NDS% / 앱 버전을 모두 박는다", () => {
  const bar = renderDsStampBar({ dsVersion: "1.4.2", ratio: 92, appVersion: "0.0.1" });
  assert.match(bar, /v1\.4\.2/);
  assert.match(bar, /92%/);
  assert.match(bar, /v0\.0\.1/);
  assert.match(bar, /STUDIO/);
  assert.match(bar, /position:fixed/);
  assert.match(bar, /pointer-events:none/);
});

test("앱 버전이 없으면 STUDIO 세그먼트를 생략한다", () => {
  const bar = renderDsStampBar({ dsVersion: "1.4.2", ratio: 50 });
  assert.doesNotMatch(bar, /STUDIO/);
  assert.match(bar, /50%/);
});

test("DS 버전이 비면 — 로 폴백", () => {
  const bar = renderDsStampBar({ dsVersion: null, ratio: 0 });
  assert.match(bar, /v—/);
});

test("ratio 는 0–100 으로 clamp + 반올림", () => {
  assert.match(renderDsStampBar({ ratio: 150 }), /100%/);
  assert.match(renderDsStampBar({ ratio: -5 }), /0%/);
  assert.match(renderDsStampBar({ ratio: 66.7 }), /67%/);
});

test("injectDsStampBar 은 </body> 직전에 삽입한다", () => {
  const html = "<html><body><h1>hi</h1></body></html>";
  const out = injectDsStampBar(html, { dsVersion: "1.0.0", ratio: 80, appVersion: "0.0.1" });
  assert.match(out, /<h1>hi<\/h1>.*data-nds-stamp.*<\/body>/s);
});

test("재주입해도 스탬프는 항상 1개만 남는다(멱등)", () => {
  const html = "<html><body><h1>hi</h1></body></html>";
  const once = injectDsStampBar(html, { dsVersion: "1.0.0", ratio: 80, appVersion: "0.0.1" });
  const twice = injectDsStampBar(once, { dsVersion: "2.0.0", ratio: 90, appVersion: "0.0.2" });
  // bar div 와 style 이 각각 1개씩만.
  assert.equal(countOccurrences(twice, `${DS_STAMP_MARKER}="bar"`), 1);
  assert.equal(countOccurrences(twice, `${DS_STAMP_MARKER}="style"`), 1);
  // 최신 수치로 갱신되고 옛 수치는 사라진다.
  assert.match(twice, /v2\.0\.0/);
  assert.match(twice, /90%/);
  assert.doesNotMatch(twice, /v1\.0\.0/);
});

test("stripDsStampBar 은 원본을 그대로 복원한다", () => {
  const html = "<html><body><h1>hi</h1></body></html>";
  const injected = injectDsStampBar(html, { dsVersion: "1.0.0", ratio: 80 });
  assert.equal(stripDsStampBar(injected), html);
});

test("</body> 가 없으면 끝에 덧붙인다", () => {
  const out = injectDsStampBar("<div>bare</div>", { ratio: 10 });
  assert.match(out, /<div>bare<\/div>[\s\S]*data-nds-stamp/);
});

test("버전 문자열의 HTML 특수문자는 이스케이프된다", () => {
  const bar = renderDsStampBar({ dsVersion: '1<script>"', ratio: 10 });
  assert.doesNotMatch(bar, /1<script>/);
  assert.match(bar, /&lt;script&gt;/);
});
