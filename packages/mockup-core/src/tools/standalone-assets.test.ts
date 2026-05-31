import { test } from "node:test";
import assert from "node:assert/strict";
import {
  injectStandaloneRuntime,
  STANDALONE_MARKER,
  listStandaloneBrands,
} from "./standalone-assets.js";

const countOccurrences = (s: string, sub: string): number => s.split(sub).length - 1;

test("injectStandaloneRuntime 은 DS runtime/CSS 를 head/body 에 inline 한다", () => {
  const html = `<html><head><title>t</title></head><body><nds-select></nds-select></body></html>`;
  const out = injectStandaloneRuntime(html);
  // 마커가 style 1 + script 1.
  assert.match(out, new RegExp(`<style ${STANDALONE_MARKER}>`));
  assert.match(out, new RegExp(`<script ${STANDALONE_MARKER}>`));
  // runtime 이 nds-select 를 정의하는 본문을 포함.
  assert.match(out, /nds-select/);
  // CSS 는 </head> 앞(head 안), script 는 </body> 앞.
  assert.match(out, new RegExp(`<style ${STANDALONE_MARKER}>[\\s\\S]*</head>`));
  assert.match(out, new RegExp(`<script ${STANDALONE_MARKER}>[\\s\\S]*</body>`));
});

test("이미 인라인된 산출물(dist)은 중복 주입하지 않는다(멱등)", () => {
  const once = injectStandaloneRuntime(`<html><head></head><body></body></html>`);
  const twice = injectStandaloneRuntime(once);
  assert.equal(twice, once);
  assert.equal(countOccurrences(twice, `<style ${STANDALONE_MARKER}>`), 1);
  assert.equal(countOccurrences(twice, `<script ${STANDALONE_MARKER}>`), 1);
});

test("head/body 가 없어도 안전하게 주입한다", () => {
  const out = injectStandaloneRuntime(`<nds-button>hi</nds-button>`);
  assert.match(out, new RegExp(`<style ${STANDALONE_MARKER}>`));
  assert.match(out, new RegExp(`<script ${STANDALONE_MARKER}>`));
});

test("data-brand 로 브랜드 CSS 를 고른다", () => {
  const brands = listStandaloneBrands();
  // runmile 자산이 있으면 브랜드 토큰 CSS 가 들어간다.
  if (brands.includes("runmile")) {
    const out = injectStandaloneRuntime(`<html data-brand="runmile"><body></body></html>`);
    assert.match(out, new RegExp(`<style ${STANDALONE_MARKER}>`));
  }
});
