/**
 * nds-amount-input DOM 구조 + 변경 / 프리셋 동작 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsAmountInput } from "../src/components/nds-amount-input.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-amount-input — DOM parity with React AmountInput", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-amount-input")).toBe(NdsAmountInput);
  });

  it("renders label, field, formatted value, prefix and unit", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("label", "결제 금액");
    el.setAttribute("value", "50000");
    el.setAttribute("prefix", "₩");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-amount-input") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.querySelector(".nds-amount-input__label")!.textContent).toBe("결제 금액");
    expect(root.querySelector(".nds-amount-input__prefix")!.textContent).toBe("₩");
    expect(root.querySelector(".nds-amount-input__unit")!.textContent).toBe("원");

    const input = root.querySelector("input.nds-amount-input__input") as HTMLInputElement;
    expect(input.value).toBe("50,000");
    expect(input.inputMode).toBe("numeric");
    expect(input.placeholder).toBe("0");
    expect(el.style.display).toBe("contents");
  });

  it("input change emits amount-change and updates host value", async () => {
    const el = document.createElement("nds-amount-input");
    document.body.appendChild(el);
    await flush();

    const events: Array<number | null> = [];
    el.addEventListener("amount-change", (e) => {
      events.push((e as CustomEvent<{ value: number | null }>).detail.value);
    });

    const input = el.querySelector("input") as HTMLInputElement;
    input.value = "1,234,abc";
    input.dispatchEvent(new Event("input"));
    expect(events).toEqual([1234]);
    expect(el.getAttribute("value")).toBe("1234");
    expect(input.value).toBe("1,234");

    input.value = "";
    input.dispatchEvent(new Event("input"));
    expect(events.at(-1)).toBeNull();
    expect(el.hasAttribute("value")).toBe(false);
  });

  it("preset add and set modes work", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("value", "5000");
    el.setAttribute(
      "presets",
      JSON.stringify([
        { label: "+1만", amount: 10000 },
        { label: "전액", amount: 100000, set: true },
      ]),
    );
    document.body.appendChild(el);
    await flush();

    const buttons = el.querySelectorAll<HTMLButtonElement>(".nds-amount-input__preset");
    expect(buttons).toHaveLength(2);

    const detail: Array<number | null> = [];
    el.addEventListener("amount-change", (e) => {
      detail.push((e as CustomEvent<{ value: number | null }>).detail.value);
    });

    buttons[0].click();
    expect(detail.at(-1)).toBe(15000);
    expect(el.getAttribute("value")).toBe("15000");

    buttons[1].click();
    expect(detail.at(-1)).toBe(100000);
    expect(el.getAttribute("value")).toBe("100000");
  });

  it("max attribute clamps the value", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("max", "10000");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector("input") as HTMLInputElement;
    input.value = "99999";
    input.dispatchEvent(new Event("input"));
    expect(el.getAttribute("value")).toBe("10000");
    expect(input.value).toBe("10,000");
  });

  it("error toggles data-error on field and helper", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("helper-text", "금액을 확인하세요");
    el.setAttribute("error", "");
    document.body.appendChild(el);
    await flush();

    const field = el.querySelector(".nds-amount-input__field") as HTMLElement;
    const helper = el.querySelector(".nds-amount-input__helper") as HTMLElement;
    expect(field.dataset.error).toBe("true");
    expect(helper.dataset.error).toBe("true");
    expect(helper.textContent).toBe("금액을 확인하세요");
  });

  it("unit override and disabled flag", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("unit", "USD");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-amount-input__unit")!.textContent).toBe("USD");
    const input = el.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("invalid presets JSON renders no preset buttons", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("presets", "not-json");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-amount-input__presets")).toBeNull();
  });
});
