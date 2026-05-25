/**
 * nds-segmented DOM 구조가 React SegmentedControl 가 만드는 DOM 과 동일한지 검사.
 */

import { describe, expect, it } from "vitest";
import { NdsSegmented } from "../src/components/nds-segmented.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

const OPTIONS_JSON = JSON.stringify([
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월", disabled: true },
]);

describe("nds-segmented — DOM parity with React SegmentedControl", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-segmented")).toBe(NdsSegmented);
  });

  it("renders radiogroup with options from JSON and marks active item", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("options", OPTIONS_JSON);
    el.setAttribute("value", "week");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-segmented__root") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.getAttribute("role")).toBe("radiogroup");
    expect(root.dataset.size).toBe("sm");
    expect(root.dataset.fullwidth).toBe("false");

    const items = root.querySelectorAll<HTMLButtonElement>(".nds-segmented__item");
    expect(items).toHaveLength(3);
    expect(items[0].dataset.active).toBe("false");
    expect(items[1].dataset.active).toBe("true");
    expect(items[1].getAttribute("aria-checked")).toBe("true");
    expect(items[0].getAttribute("aria-checked")).toBe("false");
    expect(items[2].disabled).toBe(true);
    expect(items[2].textContent).toBe("월");
    expect(el.style.display).toBe("contents");
  });

  it("applies size and full-width datasets", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("options", OPTIONS_JSON);
    el.setAttribute("size", "md");
    el.setAttribute("full-width", "");
    el.setAttribute("value", "day");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-segmented__root") as HTMLElement;
    expect(root.dataset.size).toBe("md");
    expect(root.dataset.fullwidth).toBe("true");
  });

  it("falls back to sm size for invalid size", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("options", OPTIONS_JSON);
    el.setAttribute("size", "huge");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-segmented__root") as HTMLElement;
    expect(root.dataset.size).toBe("sm");
  });

  it("click updates value attribute and dispatches segmented-change", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("options", OPTIONS_JSON);
    el.setAttribute("value", "day");
    document.body.appendChild(el);
    await flush();

    let detail: { value: string } | null = null;
    el.addEventListener("segmented-change", (e) => {
      detail = (e as CustomEvent<{ value: string }>).detail;
    });

    const items = el.querySelectorAll<HTMLButtonElement>(".nds-segmented__item");
    items[1].click();
    await flush();

    expect(el.getAttribute("value")).toBe("week");
    expect(detail).toEqual({ value: "week" });
    const refreshed = el.querySelectorAll<HTMLButtonElement>(".nds-segmented__item");
    expect(refreshed[1].dataset.active).toBe("true");
    expect(refreshed[0].dataset.active).toBe("false");
  });

  it("disabled item does not emit change", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("options", OPTIONS_JSON);
    el.setAttribute("value", "day");
    document.body.appendChild(el);
    await flush();

    let fired = 0;
    el.addEventListener("segmented-change", () => fired++);
    const items = el.querySelectorAll<HTMLButtonElement>(".nds-segmented__item");
    items[2].click();
    await flush();
    expect(fired).toBe(0);
    expect(el.getAttribute("value")).toBe("day");
  });

  it("group disabled blocks all clicks", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("options", OPTIONS_JSON);
    el.setAttribute("value", "day");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const items = el.querySelectorAll<HTMLButtonElement>(".nds-segmented__item");
    items.forEach((it) => expect(it.disabled).toBe(true));

    let fired = 0;
    el.addEventListener("segmented-change", () => fired++);
    items[1].click();
    expect(fired).toBe(0);
  });

  it("falls back to child <button value> when options attribute is absent", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("value", "b");
    for (const v of ["a", "b", "c"] as const) {
      const btn = document.createElement("button");
      btn.setAttribute("value", v);
      btn.textContent = v.toUpperCase();
      el.appendChild(btn);
    }
    document.body.appendChild(el);
    await flush();

    const items = el.querySelectorAll<HTMLButtonElement>(".nds-segmented__item");
    expect(items).toHaveLength(3);
    expect(items[1].dataset.active).toBe("true");
    expect(items[2].textContent).toBe("C");
  });

  it("clicking the active item does not emit", async () => {
    const el = document.createElement("nds-segmented");
    el.setAttribute("options", OPTIONS_JSON);
    el.setAttribute("value", "week");
    document.body.appendChild(el);
    await flush();

    let fired = 0;
    el.addEventListener("segmented-change", () => fired++);
    el.querySelectorAll<HTMLButtonElement>(".nds-segmented__item")[1].click();
    expect(fired).toBe(0);
  });
});
