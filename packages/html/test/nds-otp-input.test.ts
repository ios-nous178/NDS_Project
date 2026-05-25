/**
 * nds-otp-input DOM 구조 + 입력/포커스/페이스트 동작 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsOtpInput } from "../src/components/nds-otp-input.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-otp-input — DOM parity with React OtpInput", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-otp-input")).toBe(NdsOtpInput);
  });

  it("renders 6 cells by default with correct attributes", async () => {
    const el = document.createElement("nds-otp-input");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-otp__root") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.disabled).toBe("false");
    expect(root.dataset.error).toBe("false");

    const cells = root.querySelectorAll(".nds-otp__cell");
    expect(cells).toHaveLength(6);

    const inputs = root.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    expect(inputs[0].autocomplete).toBe("one-time-code");
    expect(inputs[1].autocomplete).toBe("off");
    inputs.forEach((input, i) => {
      expect(input.maxLength).toBe(1);
      expect(input.inputMode).toBe("numeric");
      expect(input.getAttribute("aria-label")).toBe(`인증번호 ${i + 1}자리`);
    });
    expect(el.style.display).toBe("contents");
  });

  it("respects length attribute and reflects value", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("length", "4");
    el.setAttribute("value", "1234");
    document.body.appendChild(el);
    await flush();

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    expect(inputs).toHaveLength(4);
    expect(inputs[0].value).toBe("1");
    expect(inputs[3].value).toBe("4");
  });

  it("input advances focus and emits otp-change", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("length", "4");
    document.body.appendChild(el);
    await flush();

    const changes: string[] = [];
    el.addEventListener("otp-change", (e) =>
      changes.push((e as CustomEvent<{ value: string }>).detail.value),
    );

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    inputs[0].value = "1";
    inputs[0].dispatchEvent(new Event("input"));
    expect(changes.at(-1)).toBe("1");
    expect(document.activeElement).toBe(inputs[1]);

    inputs[1].value = "2";
    inputs[1].dispatchEvent(new Event("input"));
    expect(changes.at(-1)).toBe("12");
    expect(document.activeElement).toBe(inputs[2]);
  });

  it("emits otp-complete once when fully filled", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("length", "4");
    document.body.appendChild(el);
    await flush();

    const completes: string[] = [];
    el.addEventListener("otp-complete", (e) =>
      completes.push((e as CustomEvent<{ value: string }>).detail.value),
    );

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    inputs[0].value = "1";
    inputs[0].dispatchEvent(new Event("input"));
    inputs[1].value = "2";
    inputs[1].dispatchEvent(new Event("input"));
    inputs[2].value = "3";
    inputs[2].dispatchEvent(new Event("input"));
    inputs[3].value = "4";
    inputs[3].dispatchEvent(new Event("input"));
    await flush();

    expect(completes).toEqual(["1234"]);

    // 한 자리 지웠다가 다시 채우면 새 complete 이벤트 발생
    inputs[3].dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    await flush();
    inputs[3].value = "4";
    inputs[3].dispatchEvent(new Event("input"));
    await flush();
    expect(completes).toEqual(["1234", "1234"]);
  });

  it("Backspace clears current cell first, then moves back", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("length", "4");
    el.setAttribute("value", "12");
    document.body.appendChild(el);
    await flush();

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    inputs[2].focus();
    inputs[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    expect(el.getAttribute("value")).toBe("1");
    expect(document.activeElement).toBe(inputs[1]);

    inputs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    expect(el.getAttribute("value")).toBe("");
  });

  it("ArrowLeft / ArrowRight move focus without changing value", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("length", "4");
    document.body.appendChild(el);
    await flush();
    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    inputs[2].focus();
    inputs[2].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(document.activeElement).toBe(inputs[1]);
    inputs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(document.activeElement).toBe(inputs[2]);
  });

  it("paste bulk fills cells", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("length", "4");
    document.body.appendChild(el);
    await flush();

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    const paste = new Event("paste") as ClipboardEvent;
    Object.defineProperty(paste, "clipboardData", {
      value: { getData: () => "abc-9876xx" },
    });
    inputs[0].dispatchEvent(paste);
    await flush();

    expect(el.getAttribute("value")).toBe("9876");
    const refreshed = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    expect(Array.from(refreshed).map((i) => i.value)).toEqual(["9", "8", "7", "6"]);
  });

  it("disabled propagates to inputs and root dataset", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-otp__root") as HTMLElement;
    expect(root.dataset.disabled).toBe("true");
    el.querySelectorAll<HTMLInputElement>("input.nds-otp__input").forEach((input) =>
      expect(input.disabled).toBe(true),
    );
  });

  it("strips non-digits from input and value attribute", async () => {
    const el = document.createElement("nds-otp-input");
    el.setAttribute("length", "4");
    el.setAttribute("value", "12ab34");
    document.body.appendChild(el);
    await flush();
    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-otp__input");
    expect(Array.from(inputs).map((i) => i.value)).toEqual(["1", "2", "3", "4"]);
  });
});
