/**
 * nds-amount-input DOM 구조 + 변경 / 프리셋 동작 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsAmountInput } from "../src/components/nds-amount-input.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
} from "./helpers/focus-preservation.js";

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

  // ─── caret 위치 보존 (재포맷 후 커서가 끝으로 튀지 않음) ───
  // 회고(2026-06): 매 입력마다 toLocaleString 재포맷+value 통째 교체 → caret 끝으로 튐("동작이상함").
  describe("caret 위치 보존", () => {
    const typeAt = (input: HTMLInputElement, nextValue: string, caret: number) => {
      input.value = nextValue;
      input.setSelectionRange(caret, caret);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    it("중간에 숫자를 끼워넣어도 caret 이 끝으로 튀지 않는다", async () => {
      const el = document.createElement("nds-amount-input");
      el.setAttribute("value", "1000");
      document.body.appendChild(el);
      await flush();
      const input = el.querySelector("input") as HTMLInputElement;
      expect(input.value).toBe("1,000");
      // "1,000" 의 첫 "1" 뒤(pos 1)에 "9" 삽입 → "19,000", caret 2
      typeAt(input, "19,000", 2);
      expect(input.value).toBe("19,000");
      // 앞에서 2번째 숫자("9") 바로 뒤 = index 2 (끝이 아님)
      expect(input.selectionStart).toBe(2);
    });

    it("끝에 입력하면 caret 도 끝에 유지된다", async () => {
      const el = document.createElement("nds-amount-input");
      el.setAttribute("value", "1000");
      document.body.appendChild(el);
      await flush();
      const input = el.querySelector("input") as HTMLInputElement;
      typeAt(input, "1,0005", 6); // 끝에 "5" 추가 → raw 10005
      expect(input.value).toBe("10,005");
      expect(input.selectionStart).toBe(6); // 문자열 끝
    });

    it("전체 삭제 시 빈 값 + caret 0", async () => {
      const el = document.createElement("nds-amount-input");
      el.setAttribute("value", "1000");
      document.body.appendChild(el);
      await flush();
      const input = el.querySelector("input") as HTMLInputElement;
      typeAt(input, "", 0);
      expect(input.value).toBe("");
      expect(input.selectionStart).toBe(0);
    });
  });
});

// ─── 포커스/커서 보존 (mount-once 계약) ───
// 타이핑 → setAttribute("value") → update() 가 input 을 재생성하지 않는지 잠근다.
// 천단위 콤마 재포맷이 끼는 입력이라 재생성 시 caret 까지 같이 깨진다.
describe("nds-amount-input — focus preservation", () => {
  const FIELD = "input.nds-amount-input__input";

  it("typing keeps the same input node, focus, and cursor", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("label", "결제 금액");
    document.body.appendChild(el);
    await flush();
    await expectTypingPreservesFocus(
      { requery: () => el.querySelector<HTMLInputElement>(FIELD) },
      "12345",
    );
    expect(el.getAttribute("value")).toBe("12345");
  });

  it("external attribute update keeps focused input alive (presets 포함)", async () => {
    const el = document.createElement("nds-amount-input");
    el.setAttribute("presets", JSON.stringify([{ label: "+1만", amount: 10000 }]));
    document.body.appendChild(el);
    await flush();
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    await expectTypingPreservesFocus(target, "5000");
    // 입력 중 헬퍼/에러가 바뀌어도(검증 피드백 경로) input 은 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "helper-text", "금액을 확인하세요");
    await expectAttrUpdatePreservesFocus(el, target, "error", "");
  });
});
