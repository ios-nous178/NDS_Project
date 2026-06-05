/**
 * nds-toggle DOM 구조가 React Toggle 이 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsToggle } from "../src/components/nds-toggle.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-toggle — DOM parity with React Toggle", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-toggle")).toBe(NdsToggle);
  });

  it("exposes a host .checked property (read + write) like native input", async () => {
    const el = document.createElement("nds-toggle") as InstanceType<typeof NdsToggle>;
    document.body.appendChild(el);
    await flush();

    expect(el.checked).toBe(false);

    el.checked = true;
    await flush();
    expect(el.hasAttribute("checked")).toBe(true);
    expect((el.querySelector("input") as HTMLInputElement).checked).toBe(true);
    expect(el.checked).toBe(true);

    el.checked = false;
    await flush();
    expect(el.checked).toBe(false);
  });

  it("renders label root, switch input, track, thumb, and label slot", async () => {
    const el = document.createElement("nds-toggle");
    el.setAttribute("checked", "");
    el.setAttribute("label", "알림 받기");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label")!;
    const input = el.querySelector("input") as HTMLInputElement;
    const track = el.querySelector(".nds-toggle__track") as HTMLElement;
    const thumb = el.querySelector(".nds-toggle__thumb") as HTMLElement;
    const label = el.querySelector(".nds-toggle__label") as HTMLElement;

    expect(root.classList.contains("nds-toggle")).toBe(true);
    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.disabled).toBe("false");
    expect(input.type).toBe("checkbox");
    expect(input.getAttribute("role")).toBe("switch");
    expect(input.checked).toBe(true);
    expect(input.getAttribute("aria-checked")).toBe("true");
    expect(track.dataset.slot).toBe("track");
    expect(track.dataset.checked).toBe("true");
    expect(thumb.dataset.slot).toBe("thumb");
    expect(label.dataset.slot).toBe("label");
    expect(label.textContent).toBe("알림 받기");
    expect(el.style.display).toBe("contents");
  });

  it("moves child nodes into the label slot when label attribute is absent", async () => {
    const el = document.createElement("nds-toggle");
    el.textContent = "야간 알림";
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-toggle__label")?.textContent).toBe("야간 알림");
  });

  it("maps md size variables by default", async () => {
    const el = document.createElement("nds-toggle");
    document.body.appendChild(el);
    await flush();

    const track = el.querySelector(".nds-toggle__track") as HTMLElement;
    expect(track.style.getPropertyValue("--nds-toggle-track-w")).toBe("44px");
    expect(track.style.getPropertyValue("--nds-toggle-track-h")).toBe("24px");
    expect(track.style.getPropertyValue("--nds-toggle-thumb-size")).toBe("18px");
    expect(track.style.getPropertyValue("--nds-toggle-thumb-offset")).toBe("3px");
    expect(track.style.getPropertyValue("--nds-toggle-thumb-travel")).toBe("20px");
  });

  it("supports sm size and falls back to md for invalid size", async () => {
    const el = document.createElement("nds-toggle");
    el.setAttribute("size", "sm");
    document.body.appendChild(el);
    await flush();

    const track = el.querySelector(".nds-toggle__track") as HTMLElement;
    expect(track.style.getPropertyValue("--nds-toggle-track-w")).toBe("36px");
    expect(track.style.getPropertyValue("--nds-toggle-track-h")).toBe("20px");
    expect(track.style.getPropertyValue("--nds-toggle-thumb-size")).toBe("16px");
    expect(track.style.getPropertyValue("--nds-toggle-thumb-offset")).toBe("2px");
    expect(track.style.getPropertyValue("--nds-toggle-thumb-travel")).toBe("16px");

    el.setAttribute("size", "xl");
    await flush();
    expect(track.style.getPropertyValue("--nds-toggle-track-w")).toBe("44px");
  });

  it("reflects disabled state to the root and input", async () => {
    const el = document.createElement("nds-toggle");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label")!;
    const input = el.querySelector("input") as HTMLInputElement;
    expect(root.dataset.disabled).toBe("true");
    expect(input.disabled).toBe(true);
  });

  it("re-renders when checked changes at runtime", async () => {
    const el = document.createElement("nds-toggle");
    document.body.appendChild(el);
    await flush();

    el.setAttribute("checked", "");
    await flush();

    const input = el.querySelector("input") as HTMLInputElement;
    const track = el.querySelector(".nds-toggle__track") as HTMLElement;
    expect(input.checked).toBe(true);
    expect(input.getAttribute("aria-checked")).toBe("true");
    expect(track.dataset.checked).toBe("true");

    el.removeAttribute("checked");
    await flush();
    expect(input.checked).toBe(false);
    expect(input.getAttribute("aria-checked")).toBe("false");
    expect(track.dataset.checked).toBe("false");
  });

  it("reflects user input changes back to the host checked attribute", async () => {
    const el = document.createElement("nds-toggle");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector("input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();

    expect(el.hasAttribute("checked")).toBe(true);
  });

  it("forwards a11y and form attributes to the inner input", async () => {
    const el = document.createElement("nds-toggle");
    el.setAttribute("aria-label", "알림");
    el.setAttribute("aria-describedby", "desc");
    el.setAttribute("name", "notify");
    el.setAttribute("value", "on");
    el.setAttribute("form", "settings");
    el.setAttribute("required", "");
    el.setAttribute("tabindex", "0");
    document.body.appendChild(el);
    await flush();

    const input = el.querySelector("input")!;
    expect(input.getAttribute("aria-label")).toBe("알림");
    expect(input.getAttribute("aria-describedby")).toBe("desc");
    expect(input.getAttribute("name")).toBe("notify");
    expect(input.getAttribute("value")).toBe("on");
    expect(input.getAttribute("form")).toBe("settings");
    expect(input.hasAttribute("required")).toBe(true);
    expect(input.getAttribute("tabindex")).toBe("0");
  });

  it("supports explicit input-id and keeps label htmlFor in sync", async () => {
    const el = document.createElement("nds-toggle");
    el.setAttribute("input-id", "notify-toggle");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("label")!;
    const input = el.querySelector("input")!;
    expect(input.id).toBe("notify-toggle");
    expect(root.htmlFor).toBe("notify-toggle");

    el.setAttribute("input-id", "notify-toggle-2");
    await flush();
    expect(input.id).toBe("notify-toggle-2");
    expect(root.htmlFor).toBe("notify-toggle-2");
  });
});
