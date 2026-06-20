import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SCENARIO_BOARD_MARKER,
  injectScenarioBoard,
  parseScenarioFromHtml,
  renderScenarioBoard,
  stripScenarioBoard,
} from "./scenario-board.js";

const countOccurrences = (s: string, sub: string): number => s.split(sub).length - 1;

const scenarioJson = JSON.stringify({
  flow: [
    { key: "login", title: "로그인", sub: "신규 진입" },
    { key: "home", title: "홈", sub: "대시보드" },
  ],
  screens: {
    login: { desc: "로그인 화면", tips: ["아이디를 입력"] },
    home: { desc: "홈 화면", tips: ["메뉴를 선택"] },
  },
  commonTips: ["뒤로가기"],
  edgeCases: [{ screen: "home", label: "빈 상태", note: "계정 없음" }],
});

const docWith = (json: string): string =>
  `<!doctype html><html><body>` +
  `<main data-screen="login">login</main><main data-screen="home" hidden>home</main>` +
  `<script type="application/json" data-nds-scenario>${json}</script>` +
  `</body></html>`;

test("parseScenarioFromHtml 은 data-nds-scenario JSON 을 파싱한다", () => {
  const data = parseScenarioFromHtml(docWith(scenarioJson));
  assert.ok(data);
  assert.equal(data?.flow.length, 2);
  assert.equal(data?.screens.login.desc, "로그인 화면");
  assert.deepEqual(data?.commonTips, ["뒤로가기"]);
  assert.equal(data?.edgeCases?.[0]?.label, "빈 상태");
});

test("parseScenarioFromHtml 은 블록 없음·깨진 JSON·빈 flow 에 null", () => {
  assert.equal(parseScenarioFromHtml("<html><body></body></html>"), null);
  assert.equal(
    parseScenarioFromHtml(
      `<script type="application/json" data-nds-scenario>{not json}</script>`,
    ),
    null,
  );
  assert.equal(
    parseScenarioFromHtml(
      `<script type="application/json" data-nds-scenario>{"flow":[],"screens":{}}</script>`,
    ),
    null,
  );
});

test("renderScenarioBoard 은 셸(style/panel/toggle/driver)을 모두 박는다", () => {
  const board = renderScenarioBoard();
  assert.match(board, new RegExp(`${SCENARIO_BOARD_MARKER}="style"`));
  assert.match(board, new RegExp(`${SCENARIO_BOARD_MARKER}="panel"`));
  assert.match(board, new RegExp(`${SCENARIO_BOARD_MARKER}="toggle"`));
  assert.match(board, new RegExp(`${SCENARIO_BOARD_MARKER}="driver"`));
  assert.match(board, /시나리오 보드/);
  assert.match(board, /이 목업을 처음 보는 분/);
  // 콘텐츠 마운트 포인트(드라이버가 런타임에 채움)
  assert.match(board, /data-ndssb="flow"/);
  assert.match(board, /data-ndssb="now"/);
  assert.match(board, /data-ndssb="tips"/);
  // validator unknown-nds-class 오탐 회피 — 클래스는 nds- 로 시작하지 않는다.
  assert.doesNotMatch(board, /class="nds-[a-z]/);
});

test("injectScenarioBoard 은 콘텐츠 블록이 있을 때 </body> 직전에 보드를 박는다", () => {
  const out = injectScenarioBoard(docWith(scenarioJson));
  assert.match(out, new RegExp(`${SCENARIO_BOARD_MARKER}="panel"[\\s\\S]*</body>`));
});

test("injectScenarioBoard 은 콘텐츠 블록이 없으면 보드를 박지 않는다(빈 패널 방지)", () => {
  const html = "<html><body><h1>hi</h1></body></html>";
  const out = injectScenarioBoard(html);
  assert.doesNotMatch(out, new RegExp(SCENARIO_BOARD_MARKER));
  assert.equal(out, html);
});

test("재주입해도 보드는 항상 1개만 남는다(멱등)", () => {
  const once = injectScenarioBoard(docWith(scenarioJson));
  const twice = injectScenarioBoard(once);
  assert.equal(countOccurrences(twice, `${SCENARIO_BOARD_MARKER}="panel"`), 1);
  assert.equal(countOccurrences(twice, `${SCENARIO_BOARD_MARKER}="style"`), 1);
  assert.equal(countOccurrences(twice, `${SCENARIO_BOARD_MARKER}="driver"`), 1);
  assert.equal(countOccurrences(twice, `${SCENARIO_BOARD_MARKER}="toggle"`), 1);
});

test("stripScenarioBoard 은 보드를 걷어내고 콘텐츠 블록은 보존한다", () => {
  const injected = injectScenarioBoard(docWith(scenarioJson));
  const stripped = stripScenarioBoard(injected);
  assert.doesNotMatch(stripped, new RegExp(SCENARIO_BOARD_MARKER));
  // 작성된 콘텐츠 블록(data-nds-scenario)은 strip 대상이 아니다.
  assert.match(stripped, /data-nds-scenario/);
});

test("</body> 가 없으면 끝에 덧붙인다", () => {
  const bare = `<div>x</div><script type="application/json" data-nds-scenario>${scenarioJson}</script>`;
  const out = injectScenarioBoard(bare);
  assert.match(out, new RegExp(`<div>x</div>[\\s\\S]*${SCENARIO_BOARD_MARKER}`));
});
