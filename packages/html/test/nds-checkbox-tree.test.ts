/**
 * nds-checkbox-tree — 포커스 보존 계약.
 *
 * ① 항목 외 표시용 attr(search-placeholder) 갱신이 트리 checkbox input 을 재생성하지 않는지,
 * ② 검색 input 타이핑(리스트만 재구성)이 검색 input 자신을 보존하는지,
 * ③ 사용자 체크 커밋(value attr 갱신)이 포커스 중인 checkbox 를 보존하는지 잠근다.
 * nodes attr 자체가 바뀌면 트리 재구성이 정당하므로 여기서는 다루지 않는다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-checkbox-tree.js";
import {
  expectAttrUpdatePreservesNode,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const NODES = JSON.stringify([
  {
    value: "gangwon",
    label: "강원도",
    children: [
      { value: "gangneung", label: "강릉시" },
      { value: "sokcho", label: "속초시" },
    ],
  },
]);

async function mount() {
  const el = document.createElement("nds-checkbox-tree");
  el.setAttribute("nodes", NODES);
  el.setAttribute("value", "[]");
  el.setAttribute("default-expanded", '["gangwon"]');
  document.body.appendChild(el);
  await flush();
  return el;
}

// 행 순서: [0]=전체 선택, [1]=강원도, [2]=강릉시(leaf), [3]=속초시(leaf)
const treeInput = (el: Element, index: number) =>
  el.querySelectorAll<HTMLInputElement>("input.nds-checkbox-tree__input")[index] ?? null;

describe("nds-checkbox-tree — focus preservation", () => {
  it("표시용 attr(search-placeholder) 갱신이 포커스 중인 트리 checkbox 를 재생성하지 않는다", async () => {
    const el = await mount();
    await expectAttrUpdatePreservesNode(
      el,
      () => treeInput(el, 2),
      "search-placeholder",
      "소재명으로 검색하기",
    );
  });

  it("검색어 타이핑은 리스트만 재구성하고 검색 input/커서를 보존한다", async () => {
    const el = await mount();
    await expectTypingPreservesFocus({
      requery: () => el.querySelector<HTMLInputElement>(".nds-checkbox-tree__search input"),
    });
  });

  it("사용자 체크 커밋(value attr 갱신) 후에도 포커스 중인 checkbox 가 살아 있다", async () => {
    const el = await mount();
    const input = treeInput(el, 2)!;
    input.focus();
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();

    expect(treeInput(el, 2), "체크 커밋 후 input 이 재생성됨 — mount-once 계약 위반").toBe(input);
    expect(document.activeElement, "체크 커밋 후 포커스 유실").toBe(input);
    expect(JSON.parse(el.getAttribute("value")!)).toEqual(["gangneung"]);
  });
});
