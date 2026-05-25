import { describe, expect, it } from "vitest";
import { NdsPriceTag } from "../src/components/nds-price-tag.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-price-tag", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-price-tag")).toBe(NdsPriceTag);
  });

  it("renders formatted amount, unit, discount, and original amount", async () => {
    const el = document.createElement("nds-price-tag");
    el.setAttribute("amount", "12000");
    el.setAttribute("original-amount", "15000");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-price-tag") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(el.querySelector(".nds-price-tag__discount")?.textContent).toBe("20%");
    expect(el.querySelector(".nds-price-tag__amount")?.textContent).toBe("12,000");
    expect(el.querySelector(".nds-price-tag__unit")?.textContent).toBe("원");
    expect(el.querySelector(".nds-price-tag__original")?.textContent).toBe("15,000원");
    expect(el.style.display).toBe("contents");
  });

  it("supports free label and hides unit/original for free amount", async () => {
    const el = document.createElement("nds-price-tag");
    el.setAttribute("amount", "0");
    el.setAttribute("free-label", "무료 체험");
    document.body.appendChild(el);
    await flush();

    const amount = el.querySelector(".nds-price-tag__amount") as HTMLElement;
    expect(amount.textContent).toBe("무료 체험");
    expect(amount.dataset.free).toBe("true");
    expect(el.querySelector(".nds-price-tag__unit")).toBeNull();
    expect(el.querySelector(".nds-price-tag__original")).toBeNull();
  });

  it("maps size to CSS variables and allows unformatted numbers", async () => {
    const el = document.createElement("nds-price-tag");
    el.setAttribute("amount", "12000");
    el.setAttribute("original-amount", "15000");
    el.setAttribute("size", "lg");
    el.setAttribute("prefix", "$");
    el.setAttribute("unit", "");
    el.setAttribute("format-thousands", "false");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-price-tag") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-price-amount-size")).toBe("24px");
    expect(root.style.getPropertyValue("--nds-price-original-size")).toBe("14px");
    expect(el.querySelector(".nds-price-tag__amount")?.textContent).toBe("$12000");
    expect(el.querySelector(".nds-price-tag__original")?.textContent).toBe("$15000");
  });

  it("forwards a11y attributes to root", async () => {
    const el = document.createElement("nds-price-tag");
    el.setAttribute("aria-label", "월 구독 가격");
    el.setAttribute("title", "가격");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-price-tag")!;
    expect(root.getAttribute("aria-label")).toBe("월 구독 가격");
    expect(root.getAttribute("title")).toBe("가격");
  });
});
