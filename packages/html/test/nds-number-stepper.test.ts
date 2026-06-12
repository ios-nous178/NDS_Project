/**
 * nds-number-stepper — 포커스 보존 계약 (editable 숫자 input).
 *
 * type=number 는 selection API 가 적용되지 않아(커서 단언 불가) 노드 동일성 +
 * activeElement 만 잠근다 — expectAttrUpdatePreservesNode. update() 가 input 을
 * 재생성하면 직접 입력 중 외부 attr 갱신(min/max/value)마다 포커스가 유실된다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-number-stepper.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const FIELD = "input.nds-number-stepper__input";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-number-stepper");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-number-stepper — focus preservation", () => {
  it("external attribute update keeps focused editable input node alive", async () => {
    const el = await mount({ editable: "", value: "3", min: "1", max: "10" });
    const requery = () => el.querySelector<HTMLInputElement>(FIELD);
    expect(requery()).not.toBeNull();
    // 입력 중 외부에서 한계값이 바뀌어도 input 노드는 보존되어야 한다.
    await expectAttrUpdatePreservesNode(el, requery, "max", "50");
    await expectAttrUpdatePreservesNode(el, requery, "value", "5");
    expect(requery()!.value).toBe("5");
  });

  it("+/- 버튼으로 value 가 바뀌어도 input 이 재생성되지 않는다", async () => {
    const el = await mount({ editable: "", value: "3", min: "1", max: "10" });
    const input = el.querySelector<HTMLInputElement>(FIELD)!;
    input.focus();
    el.querySelectorAll<HTMLButtonElement>(".nds-number-stepper__btn")[1].click();
    await flush();
    expect(el.querySelector<HTMLInputElement>(FIELD)).toBe(input);
    expect(input.value).toBe("4");
  });
});
