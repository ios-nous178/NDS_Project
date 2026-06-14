/**
 * nds-numeric-spinner — 동작 + 포커스/커서 보존 계약.
 *
 * 타이핑/외부 attribute 갱신이 input 을 재생성하지 않는지(mount-once) 잠근다.
 * (scripts/check-input-tests.mjs 게이트 — 입력 가진 컴포넌트는 양면 필수.)
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-numeric-spinner.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const FIELD = "input.nds-numeric-spinner__input";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-numeric-spinner");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-numeric-spinner — focus preservation", () => {
  it("typing keeps the same input node, focus, and cursor", async () => {
    const el = await mount({ value: "0", min: "0", max: "100" });
    await expectTypingPreservesFocus(
      { requery: () => el.querySelector<HTMLInputElement>(FIELD) },
      "12",
    );
    expect(el.getAttribute("value")).toBe("12");
  });

  it("external attribute update keeps focused input alive", async () => {
    const el = await mount({ value: "5", min: "0", max: "100" });
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    await expectTypingPreservesFocus(target, "7");
    await expectAttrUpdatePreservesFocus(el, target, "max", "999");
  });
});

describe("nds-numeric-spinner — behavior", () => {
  it("buttons increment/decrement by step and emit numeric-spinner-change", async () => {
    const el = await mount({ value: "2", step: "3", min: "0", max: "100" });
    const input = el.querySelector<HTMLInputElement>(FIELD)!;
    const minus = el.querySelector<HTMLButtonElement>('[data-action="decrement"]')!;
    const plus = el.querySelector<HTMLButtonElement>('[data-action="increment"]')!;

    let last = -1;
    el.addEventListener("numeric-spinner-change", (e) => {
      last = (e as CustomEvent<{ value: number }>).detail.value;
    });

    plus.click();
    await flush();
    expect(el.getAttribute("value")).toBe("5");
    expect(last).toBe(5);
    expect(input.value).toBe("5");

    minus.click();
    await flush();
    expect(el.getAttribute("value")).toBe("2");
    expect(last).toBe(2);
  });

  it("clamps at bounds and disables the boundary button", async () => {
    const el = await mount({ value: "9", min: "0", max: "10" });
    const plus = el.querySelector<HTMLButtonElement>('[data-action="increment"]')!;

    plus.click();
    await flush();
    expect(el.getAttribute("value")).toBe("10");
    expect(plus.disabled).toBe(true);

    const elMin = await mount({ value: "1", min: "1", max: "10" });
    const minus = elMin.querySelector<HTMLButtonElement>('[data-action="decrement"]')!;
    expect(minus.disabled).toBe(true);
  });

  it("disabled blocks input and buttons", async () => {
    const el = await mount({ value: "3", disabled: "" });
    const input = el.querySelector<HTMLInputElement>(FIELD)!;
    const plus = el.querySelector<HTMLButtonElement>('[data-action="increment"]')!;
    const minus = el.querySelector<HTMLButtonElement>('[data-action="decrement"]')!;
    expect(input.disabled).toBe(true);
    expect(plus.disabled).toBe(true);
    expect(minus.disabled).toBe(true);
  });
});
