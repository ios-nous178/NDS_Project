/**
 * nds-tag-input — 포커스/커서 보존 계약.
 *
 * 회귀 클래스: update() 가 variant 컨테이너를 재구성하며 input 을 remove/append
 * 하면 노드는 같아도 detach 순간 포커스가 떨어진다 — Enter 로 태그를 추가할 때마다
 * (setAttribute("value") → update) 입력이 끊긴다. variant 가 바뀔 때만 골격을
 * 재구성하고 평소엔 칩만 갈아끼우는지 잠근다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-tag-input.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const FIELD = "input.nds-tag-input__input";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-tag-input");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

const pressEnter = (input: HTMLInputElement) =>
  input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

describe("nds-tag-input — focus preservation", () => {
  it("typing keeps the same input node, focus, and cursor", async () => {
    const el = await mount({ label: "멤버 초대하기" });
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    await expectTypingPreservesFocus(target);
    // 입력 중 외부 attr 갱신(헬퍼/에러)에도 input 은 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "helper-text", "이메일 형식으로 입력하세요");
    await expectAttrUpdatePreservesFocus(el, target, "error", "");
  });

  it("Enter 로 태그를 추가해도 input 포커스가 유지된다 (연속 입력 흐름)", async () => {
    const el = await mount();
    const input = el.querySelector<HTMLInputElement>(FIELD)!;
    input.focus();

    input.value = "hello";
    pressEnter(input);
    await flush();

    expect(el.querySelector<HTMLInputElement>(FIELD)).toBe(input);
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("");
    expect(el.querySelectorAll(".nds-tag-input__tag")).toHaveLength(1);

    // 두 번째 태그도 끊김 없이
    input.value = "world";
    pressEnter(input);
    await flush();
    expect(document.activeElement).toBe(input);
    expect(el.querySelectorAll(".nds-tag-input__tag")).toHaveLength(2);
  });

  it("inline variant 도 태그 추가/외부 갱신에 input 을 보존한다", async () => {
    const el = await mount({ variant: "inline", prefix: "#" });
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    const input = target.requery()!;
    input.focus();

    input.value = "tag1";
    pressEnter(input);
    await flush();

    expect(target.requery()).toBe(input);
    expect(document.activeElement).toBe(input);
    expect(el.querySelector(".nds-tag-input__tag")!.textContent).toContain("#tag1");

    await expectAttrUpdatePreservesFocus(el, target, "helper-text", "최대 5개");
  });
});
