/**
 * nds-radio DOM 구조가 React Radio 가 만드는 DOM 과 동일한지 검사.
 *
 * 이 테스트는 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록
 * 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsRadio } from "../src/components/nds-radio.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-radio — DOM parity with React Radio", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-radio")).toBe(NdsRadio);
  });

  it("renders label root, hidden input, indicator, dot, and label slot", async () => {
    const el = document.createElement("nds-radio");
    el.setAttribute("checked", "");
    el.setAttribute("label", "기본 플랜");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label");
    const input = el.querySelector("input") as HTMLInputElement;
    const indicator = el.querySelector(".nds-radio__indicator") as HTMLElement;
    const dot = el.querySelector(".nds-radio__dot");
    const label = el.querySelector(".nds-radio__label") as HTMLElement;

    expect(root?.classList.contains("nds-radio__root")).toBe(true);
    expect(root?.dataset.slot).toBe("root");
    expect(root?.dataset.disabled).toBe("false");
    expect(input.classList.contains("nds-radio__input")).toBe(true);
    expect(input.type).toBe("radio");
    expect(input.checked).toBe(true);
    expect(indicator.dataset.slot).toBe("indicator");
    expect(indicator.dataset.checked).toBe("true");
    expect(dot).toBeTruthy();
    expect(label.dataset.slot).toBe("label");
    expect(label.textContent).toBe("기본 플랜");
  });

  it("moves child nodes into the label slot when label attribute is absent", async () => {
    const el = document.createElement("nds-radio");
    el.textContent = "프리미엄 플랜";
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-radio__label")?.textContent).toBe("프리미엄 플랜");
  });

  it("host element uses display:contents and does not carry DS root class", async () => {
    const el = document.createElement("nds-radio");
    document.body.appendChild(el);
    await flush();

    expect(el.style.display).toBe("contents");
    expect(el.classList.contains("nds-radio__root")).toBe(false);
  });

  it("reflects disabled state to the root and input", async () => {
    const el = document.createElement("nds-radio");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label")!;
    const input = el.querySelector("input") as HTMLInputElement;
    expect(root.dataset.disabled).toBe("true");
    expect(input.disabled).toBe(true);
  });

  it("re-renders when checked changes at runtime", async () => {
    const el = document.createElement("nds-radio");
    document.body.appendChild(el);
    await flush();

    el.setAttribute("checked", "");
    await flush();

    const input = el.querySelector("input") as HTMLInputElement;
    const indicator = el.querySelector(".nds-radio__indicator") as HTMLElement;
    expect(input.checked).toBe(true);
    expect(indicator.dataset.checked).toBe("true");

    el.removeAttribute("checked");
    await flush();
    expect(input.checked).toBe(false);
    expect(indicator.dataset.checked).toBe("false");
  });

  it("reflects user input changes back to the host checked attribute", async () => {
    const el = document.createElement("nds-radio");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();

    expect(el.hasAttribute("checked")).toBe(true);
  });

  it("forwards a11y and form attributes to the inner input", async () => {
    const el = document.createElement("nds-radio");
    el.setAttribute("aria-label", "플랜 선택");
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("name", "plan");
    el.setAttribute("value", "basic");
    el.setAttribute("form", "signup");
    el.setAttribute("required", "");
    el.setAttribute("tabindex", "0");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector("input")!;
    expect(input.getAttribute("aria-label")).toBe("플랜 선택");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("name")).toBe("plan");
    expect(input.getAttribute("value")).toBe("basic");
    expect(input.getAttribute("form")).toBe("signup");
    expect(input.hasAttribute("required")).toBe(true);
    expect(input.getAttribute("tabindex")).toBe("0");
  });

  it("supports explicit input-id and keeps label htmlFor in sync", async () => {
    const el = document.createElement("nds-radio");
    el.setAttribute("input-id", "plan-basic");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label")!;
    const input = el.querySelector("input")!;
    expect(input.id).toBe("plan-basic");
    expect(root.htmlFor).toBe("plan-basic");

    el.setAttribute("input-id", "plan-premium");
    await flush();
    expect(input.id).toBe("plan-premium");
    expect(root.htmlFor).toBe("plan-premium");
  });
});
