/**
 * nds-chat-input — 포커스/커서 보존 계약.
 *
 * 타이핑 → setAttribute("value") → scheduleUpdate → update() 경로가
 * textarea 를 재생성하지 않는지(mount-once) 잠근다. 채팅 입력은 가장 타이핑이
 * 잦은 표면이라 여기가 깨지면 "한 글자마다 끊김"이 즉시 체감된다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-chat-input.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const FIELD = "textarea.nds-chat-input__textarea";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-chat-input");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-chat-input — focus preservation", () => {
  it("typing keeps the same textarea node, focus, and cursor", async () => {
    const el = await mount({ placeholder: "메시지를 입력하세요" });
    await expectTypingPreservesFocus({
      requery: () => el.querySelector<HTMLTextAreaElement>(FIELD),
    });
    expect(el.getAttribute("value")).toBe("강남구");
  });

  it("external attribute update keeps focused textarea alive", async () => {
    const el = await mount({ "max-length": "500" });
    const target = { requery: () => el.querySelector<HTMLTextAreaElement>(FIELD) };
    await expectTypingPreservesFocus(target, "안녕");
    // 입력 중 quick-replies/placeholder 가 외부에서 바뀌어도 textarea 는 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(
      el,
      target,
      "quick-replies",
      JSON.stringify([{ label: "네" }, { label: "아니오" }]),
    );
    await expectAttrUpdatePreservesFocus(el, target, "placeholder", "답장을 입력하세요");
  });
});
