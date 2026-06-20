import { test } from "node:test";
import assert from "node:assert/strict";
import {
  injectStandaloneRuntime,
  STANDALONE_MARKER,
  listStandaloneProjects,
  loadStandaloneAssets,
  canonicalProjectSlug,
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

test("data-project 로 프로젝트 CSS 를 고른다", () => {
  const projects = listStandaloneProjects();
  // runmile 자산이 있으면 프로젝트 토큰 CSS 가 들어간다.
  if (projects.includes("runmile")) {
    const out = injectStandaloneRuntime(`<html data-project="runmile"><body></body></html>`);
    assert.match(out, new RegExp(`<style ${STANDALONE_MARKER}>`));
  }
});

test("회고: 프로젝트를 nds-project-header[project] 에만 선언해도 감지해 프로젝트 CSS 를 인라인한다", () => {
  if (!listStandaloneProjects().includes("cashwalk-biz")) return; // 자산 없으면 skip
  // <html data-project> 없이 chrome 컴포넌트 속성에만 project 가 있는 케이스(이 목업의 실제 형태).
  const html = `<html lang="ko"><head></head><body><nds-project-header project="cashwalk-biz" surface="web"></nds-project-header></body></html>`;
  const out = injectStandaloneRuntime(html);
  const decls = [...out.matchAll(/--semantic-button-bg-default:\s*(#[0-9A-Fa-f]{3,8})/g)];
  assert.ok(decls.length > 0);
  // 캐스케이드 승자가 캐포비 노랑이어야(블루 base 폴백 X).
  assert.equal(decls[decls.length - 1][1].toUpperCase(), "#FFD200");
});

test("canonicalProjectSlug 은 통용 별칭을 정식 slug 로 정규화한다", () => {
  assert.equal(canonicalProjectSlug("cashpobi"), "cashwalk-biz");
  assert.equal(canonicalProjectSlug("CASHPOBI"), "cashwalk-biz");
  assert.equal(canonicalProjectSlug(" cashwalk "), "cashwalk-biz");
  assert.equal(canonicalProjectSlug("cashwalk-biz"), "cashwalk-biz"); // 이미 정식
  assert.equal(canonicalProjectSlug("nudge"), "nudge-eap");
  assert.equal(canonicalProjectSlug(undefined), undefined);
  assert.equal(canonicalProjectSlug("totally-unknown"), "totally-unknown"); // 미지는 그대로
});

test("회고: cashpobi 별칭은 cashwalk-biz 노란 버튼 토큰으로 해석된다(블루 폴백 X)", () => {
  if (!listStandaloneProjects().includes("cashwalk-biz")) return; // 자산 없으면 skip
  const assets = loadStandaloneAssets("cashpobi");
  assert.equal(assets.project, "cashwalk-biz");
  assert.equal(assets.recognized, true);
  // base tokens.css(블루) + project.cashwalk-biz.css(노랑) 가 concat 되므로 두 선언이 모두
  // 문자열에 존재한다. 실제 렌더 색은 캐스케이드 승자(= 마지막 :root 선언). 캐포비는 노랑이어야.
  const decls = [...assets.css.matchAll(/--semantic-button-bg-default:\s*(#[0-9A-Fa-f]{3,8})/g)];
  assert.ok(decls.length > 0, "button-bg-default 선언이 있어야 함");
  const winner = decls[decls.length - 1][1].toUpperCase();
  assert.equal(winner, "#FFD200", `캐포비 primary 버튼은 노랑이어야 하는데 ${winner}`);
});

test("미지 프로젝트는 base 로 폴백하되 recognized:false 로 표시한다", () => {
  const assets = loadStandaloneAssets("does-not-exist");
  assert.equal(assets.recognized, false);
  assert.equal(assets.requested, "does-not-exist");
  // 폴백 대상은 base(미지정 시와 동일).
  assert.equal(assets.project, loadStandaloneAssets(undefined).project);
});

test("프로젝트 미지정은 base 의도이므로 recognized:true", () => {
  const assets = loadStandaloneAssets(undefined);
  assert.equal(assets.recognized, true);
  assert.equal(assets.requested, undefined);
});
