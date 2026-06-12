/**
 * nds-search-input — 포커스/커서 보존 계약.
 *
 * 타이핑 → setAttribute("value") → scheduleUpdate → update() 경로가
 * input 을 재생성하지 않는지(mount-once) 잠근다. nds-search-input 은
 * MultiSelect 등 합성 컴포넌트의 기반이라 여기가 깨지면 전부 깨진다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-search-input.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const FIELD = "input.nds-search-input__field";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-search-input");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-search-input — focus preservation", () => {
  it("typing keeps the same input node, focus, and cursor", async () => {
    const el = await mount({ placeholder: "검색" });
    await expectTypingPreservesFocus({
      requery: () => el.querySelector<HTMLInputElement>(FIELD),
    });
    expect(el.getAttribute("value")).toBe("강남구");
  });

  it("external attribute update keeps focused input alive", async () => {
    const el = await mount();
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    await expectTypingPreservesFocus(target, "트로");
    // 입력 중 에러 상태가 바뀌어도(외부 update 경로) input 은 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "error-message", "검색어를 확인하세요");
  });
});
