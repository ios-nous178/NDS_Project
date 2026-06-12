/**
 * nds-phone-input — 포커스/커서 보존 계약.
 *
 * 타이핑 → auto-format 재포맷 → setAttribute("value") → update() 경로가
 * input 을 재생성하지 않는지(mount-once) 잠근다. 본인인증 폼의 핵심 입력이라
 * "한 글자마다 끊김" 회귀가 가장 치명적인 표면.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-phone-input.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const FIELD = "input.nds-phone-input__input";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-phone-input");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-phone-input — focus preservation", () => {
  it("typing digits keeps the same input node, focus, and cursor (auto-format 경유)", async () => {
    const el = await mount({ label: "휴대전화" });
    await expectTypingPreservesFocus(
      { requery: () => el.querySelector<HTMLInputElement>(FIELD) },
      "0101234567",
    );
    expect(el.getAttribute("value")).toBe("0101234567");
    expect(el.querySelector<HTMLInputElement>(FIELD)!.value).toBe("010-1234-567");
  });

  it("external attribute update keeps focused input alive", async () => {
    const el = await mount();
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    await expectTypingPreservesFocus(target, "010");
    // 입력 중 헬퍼/에러가 바뀌어도(검증 피드백 경로) input 은 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "helper-text", "인증번호가 발송됩니다");
    await expectAttrUpdatePreservesFocus(el, target, "error", "");
  });
});
