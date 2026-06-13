/**
 * nds-agreement — 포커스 보존 계약.
 *
 * Agreement 는 텍스트 입력이 없는 체크박스 합성 컴포넌트라, "사용자 체크 커밋(value attr 갱신)이
 * 포커스 중인 checkbox 를 보존하는지"(mount-once)를 잠근다. items attr 자체가 바뀌면 행 재구성이
 * 정당하므로 다루지 않는다. cascade 동작(전체동의 ↔ 항목)도 함께 확인.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-agreement.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const ITEMS = JSON.stringify([
  { value: "tos", label: "이용약관 동의", required: true, viewHref: "/tos" },
  { value: "privacy", label: "개인정보 처리방침 동의", required: true },
  { value: "mkt", label: "마케팅 수신 동의", required: false },
]);

async function mount() {
  const el = document.createElement("nds-agreement");
  el.setAttribute("items", ITEMS);
  el.setAttribute("all-label", "전체 동의");
  el.setAttribute("value", "[]");
  document.body.appendChild(el);
  await flush();
  return el;
}

// 행 순서: [0]=전체동의, [1]=tos, [2]=privacy, [3]=mkt
const input = (el: Element, index: number) =>
  el.querySelectorAll<HTMLInputElement>("input.nds-agreement__input")[index] ?? null;

describe("nds-agreement — focus preservation", () => {
  it("value attr 갱신이 포커스 중인 항목 checkbox 를 재생성하지 않는다(mount-once)", async () => {
    const el = await mount();
    await expectAttrUpdatePreservesNode(el, () => input(el, 1), "value", '["tos"]');
  });
});

describe("nds-agreement — cascade", () => {
  it("전체동의 토글이 활성 항목 전체를 켜고 nds-agreement-change 를 쏜다", async () => {
    const el = await mount();
    let detail: string[] | null = null;
    el.addEventListener("nds-agreement-change", (e) => {
      detail = (e as CustomEvent<{ value: string[] }>).detail.value;
    });

    input(el, 0)!.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();

    expect(detail).toEqual(["tos", "privacy", "mkt"]);
    expect(el.getAttribute("value")).toBe(JSON.stringify(["tos", "privacy", "mkt"]));
  });

  it("일부 항목만 선택되면 전체동의가 indeterminate 다", async () => {
    const el = await mount();
    el.setAttribute("value", '["tos"]');
    await flush();

    const all = input(el, 0)!;
    expect(all.indeterminate).toBe(true);
    expect(all.checked).toBe(false);
  });

  it("항목 체크 해제가 value 에서 빠진다", async () => {
    const el = await mount();
    el.setAttribute("value", '["tos","privacy","mkt"]');
    await flush();
    let detail: string[] | null = null;
    el.addEventListener("nds-agreement-change", (e) => {
      detail = (e as CustomEvent<{ value: string[] }>).detail.value;
    });

    input(el, 3)!.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();

    expect(detail).toEqual(["tos", "privacy"]);
  });
});
