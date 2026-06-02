import { describe, expect, it } from "vitest";
import { NdsStatCard } from "../src/components/nds-stat-card.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-stat-card", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-stat-card")).toBe(NdsStatCard);
  });

  it("renders label, icon, value, unit, delta, and description", async () => {
    const el = document.createElement("nds-stat-card");
    el.setAttribute("label", "완료율");
    // icon = inline SVG 마크업 (find_icon 결과) — 이름/이모지 아님, innerHTML 로 주입
    el.setAttribute(
      "icon",
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" /></svg>',
    );
    el.setAttribute("value", "84");
    el.setAttribute("unit", "%");
    el.setAttribute("delta", "+12%");
    el.setAttribute("trend", "up");
    el.setAttribute("description", "지난주 대비");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-stat-card") as HTMLElement;
    const delta = el.querySelector(".nds-stat-card__delta") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    // icon 은 innerHTML 로 주입된 inline SVG → svg 엘리먼트로 렌더 (이름/이모지가 텍스트로 흘러나오지 않음)
    expect(el.querySelector(".nds-stat-card__icon svg")).toBeTruthy();
    expect(el.querySelector(".nds-stat-card__label")?.textContent).toBe("완료율");
    expect(el.querySelector(".nds-stat-card__value strong")?.textContent).toBe("84");
    expect(el.querySelector(".nds-stat-card__unit")?.textContent).toBe("%");
    expect(delta.dataset.trend).toBe("up");
    expect(delta.querySelector("svg")).toBeTruthy();
    expect(el.querySelector(".nds-stat-card__desc")?.textContent).toBe("지난주 대비");
    expect(el.style.display).toBe("contents");
  });

  it("renders clickable card semantics", async () => {
    const el = document.createElement("nds-stat-card");
    el.setAttribute("clickable", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-stat-card") as HTMLElement;
    expect(root.dataset.clickable).toBe("true");
    expect(root.getAttribute("role")).toBe("button");
    expect(root.tabIndex).toBe(0);

    el.removeAttribute("clickable");
    await flush();
    expect(root.dataset.clickable).toBe("false");
    expect(root.getAttribute("role")).toBeNull();
  });

  it("falls back invalid trend to flat without arrow", async () => {
    const el = document.createElement("nds-stat-card");
    el.setAttribute("delta", "0%");
    el.setAttribute("trend", "sideways");
    document.body.appendChild(el);
    await flush();

    const delta = el.querySelector(".nds-stat-card__delta") as HTMLElement;
    expect(delta.dataset.trend).toBe("flat");
    expect(delta.querySelector("svg")).toBeNull();
  });

  it("forwards a11y attributes to root", async () => {
    const el = document.createElement("nds-stat-card");
    el.setAttribute("aria-label", "상담 통계");
    el.setAttribute("title", "통계");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-stat-card")!;
    expect(root.getAttribute("aria-label")).toBe("상담 통계");
    expect(root.getAttribute("title")).toBe("통계");
  });
});
