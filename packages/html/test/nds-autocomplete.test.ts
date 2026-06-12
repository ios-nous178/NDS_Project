/**
 * nds-autocomplete — 포커스/커서 보존 계약.
 *
 * 타이핑 → setAttribute("value") → scheduleUpdate → update() 경로가
 * input 을 재생성하지 않는지(mount-once) 잠근다. 드롭다운 리스트는 매 update
 * 재구성해도 되지만 콤보박스 input 은 절대 갈아끼우면 안 된다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-autocomplete.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const FIELD = "input.nds-autocomplete__input";

const OPTIONS = JSON.stringify([
  { value: "1", label: "김상담", description: "심리상담사" },
  { value: "2", label: "이상담", description: "정신과전문의" },
]);

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-autocomplete");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-autocomplete — focus preservation", () => {
  it("typing keeps the same input node, focus, and cursor", async () => {
    const el = await mount({ options: OPTIONS, placeholder: "상담사 검색" });
    await expectTypingPreservesFocus({
      requery: () => el.querySelector<HTMLInputElement>(FIELD),
    });
    expect(el.getAttribute("value")).toBe("강남구");
  });

  it("external attribute update keeps focused input alive", async () => {
    const el = await mount({ options: OPTIONS });
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    await expectTypingPreservesFocus(target, "김상");
    // 입력 중 외부에서 loading/error 가 바뀌어도(원격 검색 패턴) input 은 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "loading", "");
    await expectAttrUpdatePreservesFocus(el, target, "error", "");
  });
});
