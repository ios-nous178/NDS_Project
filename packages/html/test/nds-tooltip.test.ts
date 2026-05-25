import { describe, expect, it } from "vitest";
import { NdsTooltip } from "../src/components/nds-tooltip.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-tooltip", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-tooltip")).toBe(NdsTooltip);
  });

  it("renders trigger only while closed", async () => {
    const el = document.createElement("nds-tooltip");
    el.setAttribute("trigger-label", "도움말");
    el.setAttribute("content", "설명입니다");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-tooltip") as HTMLElement;
    const trigger = el.querySelector(".nds-tooltip__trigger") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(trigger.textContent).toBe("도움말");
    expect(trigger.getAttribute("aria-describedby")).toBeNull();
    expect(el.querySelector(".nds-tooltip__content")).toBeNull();
    expect(el.style.display).toBe("contents");
  });

  it("renders content with placement and describedby while open", async () => {
    const el = document.createElement("nds-tooltip");
    el.id = "tip-a";
    el.setAttribute("trigger-label", "상태");
    el.setAttribute("content", "대기 중");
    el.setAttribute("placement", "right");
    el.setAttribute("open", "");
    document.body.appendChild(el);
    await flush();

    const trigger = el.querySelector(".nds-tooltip__trigger") as HTMLElement;
    const content = el.querySelector(".nds-tooltip__content") as HTMLElement;
    expect(trigger.getAttribute("aria-describedby")).toBe("tip-a-tooltip");
    expect(content.id).toBe("tip-a-tooltip");
    expect(content.role).toBe("tooltip");
    expect(content.dataset.placement).toBe("right");
    expect(content.textContent).toBe("대기 중");
    expect(content.querySelector(".nds-tooltip__arrow")).toBeTruthy();
  });

  it("hides content when disabled even if open", async () => {
    const el = document.createElement("nds-tooltip");
    el.setAttribute("open", "");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-tooltip__content")).toBeNull();
  });

  it("forwards a11y attributes to root", async () => {
    const el = document.createElement("nds-tooltip");
    el.setAttribute("aria-label", "툴팁 래퍼");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-tooltip")?.getAttribute("aria-label")).toBe("툴팁 래퍼");
  });
});
