/**
 * nds-action-chip DOM 구조가 React ActionChip 가 만드는 DOM 과 동일한지 검사.
 */

import { describe, expect, it } from "vitest";
import { NdsActionChip } from "../src/components/nds-action-chip.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-action-chip — DOM parity with React ActionChip", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-action-chip")).toBe(NdsActionChip);
  });

  it("renders button with label from attribute", async () => {
    const el = document.createElement("nds-action-chip");
    el.setAttribute("label", "필터 추가");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button.nds-action-chip") as HTMLButtonElement;
    expect(button.type).toBe("button");
    expect(button.dataset.slot).toBe("root");
    expect(button.disabled).toBe(false);

    const label = button.querySelector(".nds-action-chip__label") as HTMLElement;
    expect(label.textContent).toBe("필터 추가");
    expect(button.querySelector(".nds-action-chip__icon")).toBeNull();
    expect(el.style.display).toBe("contents");
  });

  it("falls back to text child for label when attribute is absent", async () => {
    const el = document.createElement("nds-action-chip");
    el.textContent = "직접 라벨";
    document.body.appendChild(el);
    await flush();

    const label = el.querySelector(".nds-action-chip__label")!;
    expect(label.textContent).toBe("직접 라벨");
  });

  it("renders icon slot before label when provided", async () => {
    const el = document.createElement("nds-action-chip");
    el.setAttribute("label", "공유");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("slot", "icon");
    svg.setAttribute("width", "14");
    el.appendChild(svg);
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button.nds-action-chip")!;
    const children = Array.from(button.children);
    expect(children[0].classList.contains("nds-action-chip__icon")).toBe(true);
    expect(children[1].classList.contains("nds-action-chip__label")).toBe(true);

    const icon = children[0] as HTMLElement;
    expect(icon.dataset.slot).toBe("icon");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("svg")).toBe(svg);
  });

  it("disabled attribute reflects to inner button", async () => {
    const el = document.createElement("nds-action-chip");
    el.setAttribute("label", "x");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    el.removeAttribute("disabled");
    await flush();
    expect(button.disabled).toBe(false);
  });

  it("forwards aria-label and title to button", async () => {
    const el = document.createElement("nds-action-chip");
    el.setAttribute("label", "공유");
    el.setAttribute("aria-label", "포스트 공유");
    el.setAttribute("title", "공유하기");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button")!;
    expect(button.getAttribute("aria-label")).toBe("포스트 공유");
    expect(button.getAttribute("title")).toBe("공유하기");
  });

  it("button click bubbles through host", async () => {
    const el = document.createElement("nds-action-chip");
    el.setAttribute("label", "x");
    document.body.appendChild(el);
    await flush();

    let fired = 0;
    el.addEventListener("click", () => fired++);
    const button = el.querySelector("button")!;
    button.click();
    expect(fired).toBe(1);
  });
});
