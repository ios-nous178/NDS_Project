/**
 * nds-checkbox DOM 구조가 React Checkbox 이 만드는 DOM 과 동일한지 검사.
 */

import { describe, expect, it } from "vitest";
import { NdsCheckbox } from "../src/index.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-checkbox — DOM parity with React Checkbox", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-checkbox")).toBe(NdsCheckbox);
  });

  it("renders label root, hidden input, indicator, check icon, and label slot", async () => {
    const el = document.createElement("nds-checkbox");
    el.setAttribute("checked", "");
    el.setAttribute("label", "약관에 동의합니다");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label");
    const input = el.querySelector("input");
    const indicator = el.querySelector(".nds-checkbox__indicator") as HTMLElement;
    const icon = el.querySelector(".nds-checkbox__check");
    const label = el.querySelector(".nds-checkbox__label") as HTMLElement;

    expect(root?.classList.contains("nds-checkbox__root")).toBe(true);
    expect(root?.dataset.slot).toBe("root");
    expect(root?.dataset.disabled).toBe("false");
    expect(input?.classList.contains("nds-checkbox__input")).toBe(true);
    expect(input?.type).toBe("checkbox");
    expect((input as HTMLInputElement).checked).toBe(true);
    expect(indicator.dataset.slot).toBe("indicator");
    expect(indicator.dataset.state).toBe("checked");
    expect(indicator.dataset.checked).toBe("true");
    expect(icon).toBeTruthy();
    expect(label.dataset.slot).toBe("label");
    expect(label.textContent).toBe("약관에 동의합니다");
  });

  it("moves child nodes into the label slot when label attribute is absent", async () => {
    const el = document.createElement("nds-checkbox");
    el.textContent = "마케팅 수신 동의";
    document.body.appendChild(el);
    await flush();

    const label = el.querySelector(".nds-checkbox__label");
    expect(label?.textContent).toBe("마케팅 수신 동의");
  });

  it("host element uses display:contents and does not carry DS root class", async () => {
    const el = document.createElement("nds-checkbox");
    document.body.appendChild(el);
    await flush();

    expect(el.style.display).toBe("contents");
    expect(el.classList.contains("nds-checkbox__root")).toBe(false);
  });

  it("reflects disabled state to the root and input", async () => {
    const el = document.createElement("nds-checkbox");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label")!;
    const input = el.querySelector("input") as HTMLInputElement;
    expect(root.dataset.disabled).toBe("true");
    expect(input.disabled).toBe(true);
  });

  it("re-renders when checked changes at runtime", async () => {
    const el = document.createElement("nds-checkbox");
    document.body.appendChild(el);
    await flush();

    el.setAttribute("checked", "");
    await flush();

    const input = el.querySelector("input") as HTMLInputElement;
    const indicator = el.querySelector(".nds-checkbox__indicator") as HTMLElement;
    expect(input.checked).toBe(true);
    expect(indicator.dataset.state).toBe("checked");

    el.removeAttribute("checked");
    await flush();
    expect(input.checked).toBe(false);
    expect(indicator.dataset.state).toBe("unchecked");
  });

  it("reflects user input changes back to the host checked attribute", async () => {
    const el = document.createElement("nds-checkbox");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();

    expect(el.hasAttribute("checked")).toBe(true);
  });

  it("forwards a11y and form attributes to the inner input", async () => {
    const el = document.createElement("nds-checkbox");
    el.setAttribute("aria-label", "동의");
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("name", "agree");
    el.setAttribute("value", "yes");
    el.setAttribute("form", "survey");
    el.setAttribute("required", "");
    el.setAttribute("tabindex", "0");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector("input")!;
    expect(input.getAttribute("aria-label")).toBe("동의");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("name")).toBe("agree");
    expect(input.getAttribute("value")).toBe("yes");
    expect(input.getAttribute("form")).toBe("survey");
    expect(input.hasAttribute("required")).toBe(true);
    expect(input.getAttribute("tabindex")).toBe("0");
  });

  it("supports explicit input-id and keeps label htmlFor in sync", async () => {
    const el = document.createElement("nds-checkbox");
    el.setAttribute("input-id", "terms-checkbox");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label")!;
    const input = el.querySelector("input")!;
    expect(input.id).toBe("terms-checkbox");
    expect(root.htmlFor).toBe("terms-checkbox");

    el.setAttribute("input-id", "terms-checkbox-2");
    await flush();
    expect(input.id).toBe("terms-checkbox-2");
    expect(root.htmlFor).toBe("terms-checkbox-2");
  });
});
