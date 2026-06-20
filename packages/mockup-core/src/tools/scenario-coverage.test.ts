import { test } from "node:test";
import assert from "node:assert/strict";
import { validateScenarioCoverage } from "./scenario-coverage.js";

const block = (json: string): string =>
  `<script type="application/json" data-nds-scenario>${json}</script>`;

test("매니페스트(data-nds-scenario) 누락을 잡는다", () => {
  const r = validateScenarioCoverage({ source: `<main data-screen="login"></main>` });
  assert.equal(r.ok, false);
  assert.equal(r.summary.hasManifest, false);
  assert.equal(r.violationsByRule[0]?.rule, "scenario-board-incomplete");
});

test("깨진 JSON / 빈 flow 를 잡는다", () => {
  const r = validateScenarioCoverage({ source: block("{not json}") });
  assert.equal(r.ok, false);
  assert.equal(r.summary.hasManifest, true);
  assert.match(r.violations[0]?.detail ?? "", /파싱 실패|비어/);
});

test("화면 설명(desc) 누락을 잡는다", () => {
  const src =
    `<main data-screen="login"></main>` +
    block('{"flow":[{"key":"login","title":"로그인"}],"screens":{}}');
  const r = validateScenarioCoverage({ source: src });
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => /설명/.test(v.detail)));
});

test("flow key 에 대응하는 [data-screen] 부재를 잡는다", () => {
  const src =
    `<main id="x"></main>` +
    block('{"flow":[{"key":"login","title":"로그인"}],"screens":{"login":{"desc":"로그인 화면"}}}');
  const r = validateScenarioCoverage({ source: src });
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => /data-screen="login"/.test(v.detail)));
  assert.equal(r.summary.domMatched, 0);
});

test("flow/screens/desc/data-screen 이 모두 일치하면 통과", () => {
  const src =
    `<main data-screen="login">login</main><main data-screen="home" hidden>home</main>` +
    block(
      '{"flow":[{"key":"login","title":"로그인"},{"key":"home","title":"홈"}],' +
        '"screens":{"login":{"desc":"로그인 화면","tips":["입력"]},"home":{"desc":"홈 화면"}}}',
    );
  const r = validateScenarioCoverage({ source: src });
  assert.equal(r.ok, true);
  assert.deepEqual(r.summary, {
    flowSteps: 2,
    screensCovered: 2,
    screensMissing: 0,
    domMatched: 2,
    hasManifest: true,
  });
});

test("단일 화면 목업도 flow 1 + data-screen 하나로 최소 충족", () => {
  const src =
    `<main data-screen="main">x</main>` +
    block('{"flow":[{"key":"main","title":"메인"}],"screens":{"main":{"desc":"메인 화면"}}}');
  const r = validateScenarioCoverage({ source: src });
  assert.equal(r.ok, true);
  assert.equal(r.summary.flowSteps, 1);
});
