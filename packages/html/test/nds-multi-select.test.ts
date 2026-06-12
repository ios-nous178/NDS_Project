/**
 * nds-multi-select — 합성(nds-search-input) 케이스의 포커스 보존 계약.
 *
 * 드롭다운 본문(_renderBody)은 replaceChildren 으로 재렌더되지만 검색 영역은
 * 영구 유지돼야 한다. 검색 타이핑(본문 필터 재렌더 유발) · 외부 value 갱신
 * 두 경로 모두에서 검색 input 노드가 살아 있는지 잠근다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-multi-select.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const OPTIONS = JSON.stringify([
  { value: "a", label: "캠페인 A" },
  { value: "b", label: "캠페인 B" },
  { value: "ab", label: "캠페인 AB" },
]);

async function mountOpen() {
  const el = document.createElement("nds-multi-select");
  el.setAttribute("options", OPTIONS);
  el.setAttribute("value", "[]");
  document.body.appendChild(el);
  await flush();
  el.querySelector<HTMLButtonElement>(".nds-multi-select__trigger")!.click();
  await flush();
  return el;
}

const searchField = (el: Element) => el.querySelector<HTMLInputElement>("nds-search-input input");

describe("nds-multi-select — focus preservation (composed search input)", () => {
  it("search typing re-renders body but keeps the search input node", async () => {
    const el = await mountOpen();
    expect(searchField(el)).not.toBeNull();
    await expectTypingPreservesFocus({ requery: () => searchField(el) }, "AB");
  });

  it("external value update keeps focused search input alive", async () => {
    const el = await mountOpen();
    const target = { requery: () => searchField(el) };
    await expectTypingPreservesFocus(target, "캠");
    await expectAttrUpdatePreservesFocus(el, target, "value", JSON.stringify(["a"]));
  });
});
