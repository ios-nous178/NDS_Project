/**
 * nds-slider — 포커스 보존 계약.
 *
 * 표시용 attr(start-label/end-label) 갱신과 사용자 드래그 커밋(value attr 갱신)이
 * range input 을 재생성하지 않는지(mount-once, 라벨 innerHTML 은 input 과 분리) 잠근다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-slider.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const FIELD = "input.nds-slider__input";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-slider");
  el.setAttribute("value", "40");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-slider — focus preservation", () => {
  it("표시용 attr(start-label/end-label) 갱신이 포커스 중인 range input 을 재생성하지 않는다", async () => {
    const el = await mount();
    const requery = () => el.querySelector<HTMLInputElement>(FIELD);
    await expectAttrUpdatePreservesNode(el, requery, "start-label", "약함");
    await expectAttrUpdatePreservesNode(el, requery, "end-label", "강함");
  });

  it("사용자 드래그 커밋(value attr 갱신) 후에도 포커스 중인 input 이 살아 있다", async () => {
    const el = await mount({ "show-value": "" });
    const input = el.querySelector<HTMLInputElement>(FIELD)!;
    input.focus();
    input.value = "55";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flush();

    expect(el.querySelector(FIELD), "드래그 커밋 후 input 이 재생성됨").toBe(input);
    expect(document.activeElement, "드래그 커밋 후 포커스 유실").toBe(input);
    expect(el.getAttribute("value")).toBe("55");
  });
});
