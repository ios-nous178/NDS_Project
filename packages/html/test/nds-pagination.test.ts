import { describe, expect, it, vi } from "vitest";
import { NdsPagination } from "../src/components/nds-pagination.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-pagination", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-pagination")).toBe(NdsPagination);
  });

  it("renders page buttons, arrows, current page, and ellipsis", async () => {
    const el = document.createElement("nds-pagination");
    el.setAttribute("page", "5");
    el.setAttribute("total-pages", "10");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("nav") as HTMLElement;
    const active = el.querySelector('[aria-current="page"]') as HTMLButtonElement;
    const ellipsis = el.querySelectorAll(".nds-pagination__ellipsis");
    const arrows = el.querySelectorAll('[data-type="arrow"]');

    expect(root.className).toBe("nds-pagination");
    expect(root.dataset.slot).toBe("root");
    expect(root.getAttribute("aria-label")).toBe("페이지 네비게이션");
    expect(active.textContent).toBe("5");
    expect(active.dataset.active).toBe("true");
    expect(ellipsis.length).toBeGreaterThan(0);
    expect(arrows).toHaveLength(2);
    expect(el.style.display).toBe("contents");
  });

  it("can hide arrows and forwards a11y attrs", async () => {
    const el = document.createElement("nds-pagination");
    el.setAttribute("page", "1");
    el.setAttribute("total-pages", "3");
    el.setAttribute("show-arrows", "false");
    el.setAttribute("aria-label", "검색 결과 페이지");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("nav") as HTMLElement;
    expect(root.getAttribute("aria-label")).toBe("검색 결과 페이지");
    expect(el.querySelectorAll('[data-type="arrow"]')).toHaveLength(0);
    expect(el.querySelectorAll(".nds-pagination__item")).toHaveLength(3);
  });

  it("dispatches nds-page-change and reflects page when clicked", async () => {
    const el = document.createElement("nds-pagination");
    const handler = vi.fn();
    el.setAttribute("page", "1");
    el.setAttribute("total-pages", "5");
    el.addEventListener("nds-page-change", handler);
    document.body.appendChild(el);
    await flush();

    const pageTwo = Array.from(el.querySelectorAll(".nds-pagination__item")).find(
      (button) => button.textContent === "2",
    ) as HTMLButtonElement;
    pageTwo.click();
    await flush();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0].detail).toEqual({ page: 2 });
    expect(el.getAttribute("page")).toBe("2");
    expect(el.querySelector('[aria-current="page"]')?.textContent).toBe("2");
  });

  it("disables boundary arrows", async () => {
    const el = document.createElement("nds-pagination");
    el.setAttribute("page", "1");
    el.setAttribute("total-pages", "5");
    document.body.appendChild(el);
    await flush();

    const prev = el.querySelector('[aria-label="이전 페이지"]') as HTMLButtonElement;
    const next = el.querySelector('[aria-label="다음 페이지"]') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);
  });
});
