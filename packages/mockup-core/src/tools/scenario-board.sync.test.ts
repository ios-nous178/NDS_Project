import { test } from "node:test";
import assert from "node:assert/strict";
import { renderScenarioBoard } from "./scenario-board.js";
import { MOCKUP_FRAME_JS } from "./standalone-assets.js";

/**
 * 시나리오 보드 ↔ 멀티스크린 스위처 양방향 동기화 계약(회귀 잠금).
 *
 * 회고: 스위처는 화면을 .mockup-screen[data-active] 로 전환하는데 보드 옵저버는 hidden/style/class 만
 * 봐서 — (1) 탭 바꿔도 보드 '지금 보는 화면'이 안 따라오고, (2) 보드 단계 클릭해도 화면이 안 바뀌어
 * 목업마다 브릿지 스크립트를 손으로 끼워야 했다(두 번 재발). 둘을 nds-scenario-nav 한 이벤트로 묶어
 * DS 차원에서 양방향이 되게 했다. 이 계약(emit·listen·관찰·루프가드)이 빠지면 재발하므로 잠근다.
 */

test("보드 옵저버가 data-active 를 관찰한다 (탭 전환 → 보드, 정방향)", () => {
  const board = renderScenarioBoard();
  assert.match(board, /attributeFilter:\[[^\]]*"data-active"/);
});

test("보드는 nds-scenario-nav 이벤트로 라이브싱크한다", () => {
  const board = renderScenarioBoard();
  assert.match(board, /addEventListener\(\s*["']nds-scenario-nav["']/);
});

test("스위처가 탭 활성화 시 nds-scenario-nav 를 쏜다 (보드가 따라오도록 + 루프가드 마커)", () => {
  assert.match(MOCKUP_FRAME_JS, /dispatchEvent\(\s*new CustomEvent\(\s*['"]nds-scenario-nav['"]/);
  assert.match(MOCKUP_FRAME_JS, /from\s*:\s*['"]switcher['"]/);
});

test("스위처가 nds-scenario-nav 를 듣고 화면을 전환한다 (보드 단계 클릭 → 화면, 역방향)", () => {
  assert.match(MOCKUP_FRAME_JS, /addEventListener\(\s*['"]nds-scenario-nav['"]/);
  // 자기가 쏜 이벤트(from:'switcher')는 무시해 무한루프를 막아야 한다
  assert.match(MOCKUP_FRAME_JS, /from\s*===\s*['"]switcher['"]/);
});
