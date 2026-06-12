/**
 * nds-checkbox-group — 포커스 보존 계약 (데이터 모드).
 *
 * 항목 외 표시용 attr(select-all-label) 갱신과 사용자 체크 커밋(value attr 갱신)이
 * 항목 checkbox input 을 재생성하지 않는지(구조 1회 구성 + in-place 상태 sync) 잠근다.
 * items attr 자체가 바뀌면 리스트 재구성이 정당하므로 여기서는 다루지 않는다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-checkbox-group.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const ITEMS = JSON.stringify([
  { value: "terms", label: "이용약관 동의", badge: "[필수]", detail: "약관 상세 내용" },
  { value: "marketing", label: "마케팅 수신 동의" },
]);

async function mount() {
  const el = document.createElement("nds-checkbox-group");
  el.setAttribute("select-all", "");
  el.setAttribute("items", ITEMS);
  el.setAttribute("value", '["terms"]');
  document.body.appendChild(el);
  await flush();
  return el;
}

const itemInput = (el: Element, index: number) =>
  el.querySelectorAll<HTMLInputElement>(".nds-checkbox-group__item input")[index] ?? null;

describe("nds-checkbox-group — focus preservation", () => {
  it("표시용 attr(select-all-label) 갱신이 포커스 중인 항목 input 을 재생성하지 않는다", async () => {
    const el = await mount();
    await expectAttrUpdatePreservesNode(el, () => itemInput(el, 0), "select-all-label", "모두 동의");
  });

  it("사용자 체크 커밋(value attr 갱신) 후에도 포커스 중인 input 이 살아 있다", async () => {
    const el = await mount();
    const input = itemInput(el, 1)!;
    input.focus();
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();

    expect(itemInput(el, 1), "체크 커밋 후 input 이 재생성됨 — mount-once 계약 위반").toBe(input);
    expect(document.activeElement, "체크 커밋 후 포커스 유실").toBe(input);
    expect(JSON.parse(el.getAttribute("value")!)).toEqual(["terms", "marketing"]);
  });
});
