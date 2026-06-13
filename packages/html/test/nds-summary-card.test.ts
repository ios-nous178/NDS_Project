/**
 * nds-summary-card DOM 구조 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsSummaryCard } from "../src/components/nds-summary-card.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

const ROWS = JSON.stringify([
  { label: "소계", value: "50,000원" },
  { label: "할인", value: "-5,000원", emphasis: "discount" },
  { label: "포인트", value: "1,000P", emphasis: "info" },
]);

describe("nds-summary-card — DOM parity with React SummaryCard", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-summary-card")).toBe(NdsSummaryCard);
  });

  it("renders default header / rows / divider / total", async () => {
    const el = document.createElement("nds-summary-card");
    el.setAttribute("rows", ROWS);
    el.setAttribute("total", "45,000원");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-summary-card") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.querySelector(".nds-summary-card__title")!.textContent).toBe("결제 정보");

    const rows = root.querySelectorAll(".nds-summary-card__row");
    expect(rows).toHaveLength(3);
    expect(rows[0].querySelector(".nds-summary-card__label")!.textContent).toBe("소계");
    const v0 = rows[0].querySelector(".nds-summary-card__value") as HTMLElement;
    expect(v0.dataset.emphasis).toBe("default");
    const v1 = rows[1].querySelector(".nds-summary-card__value") as HTMLElement;
    expect(v1.dataset.emphasis).toBe("discount");
    const v2 = rows[2].querySelector(".nds-summary-card__value") as HTMLElement;
    expect(v2.dataset.emphasis).toBe("info");
    expect(v1.textContent).toBe("-5,000원");

    expect(root.querySelector(".nds-summary-card__divider")).not.toBeNull();
    const totalRow = root.querySelector(".nds-summary-card__total")!;
    expect(totalRow.querySelector("span")!.textContent).toBe("총 결제금액");
    expect(totalRow.querySelector(".nds-summary-card__total-value")!.textContent).toBe(
      "45,000원",
    );
    expect(el.style.display).toBe("contents");
  });

  it("supports custom title and total-label", async () => {
    const el = document.createElement("nds-summary-card");
    el.setAttribute("rows", ROWS);
    el.setAttribute("title", "주문 요약");
    el.setAttribute("total-label", "최종 금액");
    el.setAttribute("total", "1,000원");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-summary-card__title")!.textContent).toBe("주문 요약");
    expect(el.querySelector(".nds-summary-card__total span")!.textContent).toBe("최종 금액");
  });

  it("hides header when title is empty string", async () => {
    const el = document.createElement("nds-summary-card");
    el.setAttribute("rows", ROWS);
    el.setAttribute("title", "");
    el.setAttribute("total", "0원");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-summary-card__header")).toBeNull();
  });

  it("falls back to slot=total content when total attribute is absent", async () => {
    const el = document.createElement("nds-summary-card");
    el.setAttribute("rows", ROWS);
    const tag = document.createElement("strong");
    tag.setAttribute("slot", "total");
    tag.textContent = "₩100,000";
    el.appendChild(tag);
    document.body.appendChild(el);
    await flush();

    const valueWrap = el.querySelector(".nds-summary-card__total-value")!;
    expect(valueWrap.querySelector("strong")!.textContent).toBe("₩100,000");
  });

  it("renders footer slot when provided", async () => {
    const el = document.createElement("nds-summary-card");
    el.setAttribute("rows", ROWS);
    el.setAttribute("total", "0원");
    const btn = document.createElement("button");
    btn.setAttribute("slot", "footer");
    btn.textContent = "결제하기";
    el.appendChild(btn);
    document.body.appendChild(el);
    await flush();

    const footer = el.querySelector(".nds-summary-card__footer");
    expect(footer).not.toBeNull();
    expect(footer!.querySelector("button")!.textContent).toBe("결제하기");
  });

  it("ignores invalid rows JSON gracefully", async () => {
    const el = document.createElement("nds-summary-card");
    el.setAttribute("rows", "not-json");
    el.setAttribute("total", "0원");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelectorAll(".nds-summary-card__row")).toHaveLength(0);
    expect(el.querySelector(".nds-summary-card__total-value")!.textContent).toBe("0원");
  });
});
