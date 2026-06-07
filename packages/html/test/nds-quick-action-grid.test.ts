/**
 * nds-quick-action-grid DOM 구조 + 클릭 동작 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsQuickActionGrid } from "../src/components/nds-quick-action-grid.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

// icon = inline SVG 마크업 (find_icon 결과). 이름/이모지가 아니라 innerHTML 로 주입된다.
const ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" /></svg>';
const ACTIONS = JSON.stringify([
  { key: "call", label: "전화", icon: ICON_SVG, badge: "NEW" },
  { key: "chat", label: "채팅", icon: ICON_SVG, badge: "3", iconBg: "#abc" },
  { key: "book", label: "예약", icon: ICON_SVG, disabled: true },
]);

describe("nds-quick-action-grid — DOM parity with React QuickActionGrid", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-quick-action-grid")).toBe(NdsQuickActionGrid);
  });

  it("renders grid with default 4 columns and action buttons", async () => {
    const el = document.createElement("nds-quick-action-grid");
    el.setAttribute("actions", ACTIONS);
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-quick-action-grid") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.style.getPropertyValue("--nds-quick-action-cols")).toBe("4");

    const items = root.querySelectorAll<HTMLButtonElement>(".nds-quick-action-grid__item");
    expect(items).toHaveLength(3);
    expect(items[0].dataset.key).toBe("call");
    expect(items[0].type).toBe("button");
    // icon 은 innerHTML 로 주입된 inline SVG → svg 엘리먼트로 렌더 (이름/이모지가 텍스트로 흘러나오지 않음)
    expect(items[0].querySelector(".nds-quick-action-grid__icon svg")).not.toBeNull();
    expect(items[0].querySelector(".nds-quick-action-grid__label")!.textContent).toBe("전화");
    expect(items[0].querySelector(".nds-quick-action-grid__badge")!.textContent).toBe("NEW");
    expect(el.style.display).toBe("contents");
  });

  it("supports columns 2/3/4 with fallback to 4", async () => {
    const el = document.createElement("nds-quick-action-grid");
    el.setAttribute("actions", ACTIONS);
    el.setAttribute("columns", "3");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-quick-action-grid") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-quick-action-cols")).toBe("3");

    el.setAttribute("columns", "9");
    await flush();
    expect(root.style.getPropertyValue("--nds-quick-action-cols")).toBe("4");
  });

  it("gap attribute applies CSS variable", async () => {
    const el = document.createElement("nds-quick-action-grid");
    el.setAttribute("actions", ACTIONS);
    el.setAttribute("gap", "12");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-quick-action-grid") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-quick-action-gap")).toBe("12px");
  });

  it("disabled action is not clickable and does not emit quick-action", async () => {
    const el = document.createElement("nds-quick-action-grid");
    el.setAttribute("actions", ACTIONS);
    document.body.appendChild(el);
    await flush();

    const items = el.querySelectorAll<HTMLButtonElement>(".nds-quick-action-grid__item");
    expect(items[2].disabled).toBe(true);

    const events: string[] = [];
    el.addEventListener("quick-action", (e) => {
      events.push((e as CustomEvent<{ key: string }>).detail.key);
    });

    items[2].click();
    expect(events).toEqual([]);

    items[1].click();
    expect(events).toEqual(["chat"]);
  });

  it("iconBg overrides CSS variable on the button", async () => {
    const el = document.createElement("nds-quick-action-grid");
    el.setAttribute("actions", ACTIONS);
    document.body.appendChild(el);
    await flush();
    const items = el.querySelectorAll<HTMLButtonElement>(".nds-quick-action-grid__item");
    expect(items[1].style.getPropertyValue("--nds-quick-action-icon-bg")).toBe("#abc");
  });

  it("invalid actions JSON renders empty grid", async () => {
    const el = document.createElement("nds-quick-action-grid");
    el.setAttribute("actions", "not-json");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelectorAll(".nds-quick-action-grid__item")).toHaveLength(0);
  });

  it("omits badge span when badge is absent", async () => {
    const el = document.createElement("nds-quick-action-grid");
    el.setAttribute("actions", JSON.stringify([{ key: "x", label: "X", icon: "★" }]));
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-quick-action-grid__badge")).toBeNull();
  });
});
