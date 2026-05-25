import { describe, expect, it } from "vitest";
import { NdsTipCard } from "../src/components/nds-tip-card.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-tip-card", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-tip-card")).toBe(NdsTipCard);
  });

  it("renders tone, copy, package SVG icon, and action", async () => {
    const el = document.createElement("nds-tip-card");
    el.setAttribute("tone", "success");
    el.setAttribute("label", "추천");
    el.setAttribute("tip-title", "좋은 흐름이에요");
    el.setAttribute("description", "지금 루틴을 유지해 보세요");
    el.setAttribute("action-label", "자세히");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-tip-card") as HTMLElement;
    const icon = el.querySelector(".nds-tip-card__icon") as HTMLElement;
    const action = el.querySelector(".nds-tip-card__action") as HTMLButtonElement;
    expect(root.dataset.tone).toBe("success");
    expect(root.style.getPropertyValue("--nds-tip-fg")).toBe("var(--semantic-text-status-success)");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("svg")?.getAttribute("width")).toBe("20");
    expect(el.querySelector(".nds-tip-card__label")?.textContent).toBe("추천");
    expect(el.querySelector(".nds-tip-card__title")?.textContent).toBe("좋은 흐름이에요");
    expect(el.querySelector(".nds-tip-card__desc")?.textContent).toBe("지금 루틴을 유지해 보세요");
    expect(action.type).toBe("button");
    expect(action.querySelector("svg")?.getAttribute("width")).toBe("14");
    expect(el.style.display).toBe("contents");
  });

  it("falls back invalid tone to info", async () => {
    const el = document.createElement("nds-tip-card");
    el.setAttribute("tone", "danger");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-tip-card") as HTMLElement;
    expect(root.dataset.tone).toBe("info");
  });

  it("renders clickable card semantics", async () => {
    const el = document.createElement("nds-tip-card");
    el.setAttribute("clickable", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-tip-card") as HTMLElement;
    expect(root.dataset.clickable).toBe("true");
    expect(root.getAttribute("role")).toBe("button");
    expect(root.tabIndex).toBe(0);
  });

  it("forwards a11y attributes to root", async () => {
    const el = document.createElement("nds-tip-card");
    el.setAttribute("aria-label", "팁");
    el.setAttribute("title", "추천 팁");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-tip-card")!;
    expect(root.getAttribute("aria-label")).toBe("팁");
    expect(root.getAttribute("title")).toBe("추천 팁");
  });
});
