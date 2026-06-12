/**
 * nds-select — searchable 검색 input 의 포커스/커서 보존 계약.
 *
 * 검색 input 은 드롭다운이 열려야 의미가 있고(닫혀도 노드는 유지), 타이핑마다
 * _query → scheduleUpdate → update() 가 돌며 옵션을 필터한다. 이 경로가 검색
 * input 을 재생성하면 검색형 셀렉트가 "한 글자마다 끊김"이 된다.
 * 드롭다운은 open 시 body 로 portal 되므로 listbox id 로 스코프해 조회한다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-select.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

async function mountOpenSearchable(selectId: string) {
  const el = document.createElement("nds-select");
  el.setAttribute("searchable", "");
  el.setAttribute("select-id", selectId);
  el.setAttribute("placeholder", "선택");
  el.innerHTML =
    '<nds-select-option value="kr">대한민국</nds-select-option>' +
    '<nds-select-option value="jp">일본</nds-select-option>';
  document.body.appendChild(el);
  await flush();
  el.setAttribute("open", "");
  await flush();
  return el;
}

const searchInputOf = (selectId: string) => () =>
  document.querySelector<HTMLInputElement>(`#${selectId}-listbox input[data-slot="search-input"]`);

describe("nds-select — focus preservation (searchable search input)", () => {
  it("typing a query keeps the same search input node, focus, and cursor", async () => {
    const el = await mountOpenSearchable("sel-focus-1");
    const requery = searchInputOf("sel-focus-1");
    expect(requery()).not.toBeNull();
    await expectTypingPreservesFocus({ requery }, "대한");
    // 필터가 실제로 돌았는지 — 일본 옵션은 숨고 대한민국만 남는다.
    const options = document.querySelectorAll<HTMLElement>(
      "#sel-focus-1-listbox nds-select-option",
    );
    expect(options[0].style.display).not.toBe("none");
    expect(options[1].style.display).toBe("none");
    el.remove();
  });

  it("external attribute update keeps focused search input alive", async () => {
    const el = await mountOpenSearchable("sel-focus-2");
    const target = { requery: searchInputOf("sel-focus-2") };
    await expectTypingPreservesFocus(target, "일");
    // 열려 있는 동안 외부에서 helper/error 가 바뀌어도 검색 input 은 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "helper-text", "필수 항목입니다");
    await expectAttrUpdatePreservesFocus(el, target, "error", "");
    el.remove();
  });
});
