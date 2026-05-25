import { describe, expect, it } from "vitest";
import { NdsFab } from "../src/components/nds-fab.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-fab", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-fab")).toBe(NdsFab);
  });

  it("renders icon-only default FAB", async () => {
    const el = document.createElement("nds-fab");
    el.setAttribute("aria-label", "추가");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button") as HTMLButtonElement;
    expect(button.className).toBe("nds-fab");
    expect(button.dataset.slot).toBe("root");
    expect(button.dataset.position).toBe("bottom-right");
    expect(button.dataset.color).toBe("primary");
    expect(button.dataset.size).toBe("md");
    expect(button.style.getPropertyValue("--nds-fab-size")).toBe("48px");
    expect(button.style.getPropertyValue("--nds-fab-padding")).toBe("0");
    expect(button.querySelector(".nds-fab__icon svg")?.getAttribute("width")).toBe("24");
    expect(button.getAttribute("aria-label")).toBe("추가");
    expect(el.style.display).toBe("contents");
  });

  it("renders extended FAB with label, color, size, position, and offset", async () => {
    const el = document.createElement("nds-fab");
    el.setAttribute("icon", "EditIcon");
    el.setAttribute("label", "작성");
    el.setAttribute("color", "neutral");
    el.setAttribute("size", "lg");
    el.setAttribute("position", "bottom-center");
    el.setAttribute("offset", "24");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button") as HTMLButtonElement;
    expect(button.dataset.color).toBe("neutral");
    expect(button.dataset.size).toBe("lg");
    expect(button.dataset.position).toBe("bottom-center");
    expect(button.style.getPropertyValue("--nds-fab-size")).toBe("56px");
    expect(button.style.getPropertyValue("--nds-fab-padding")).toBe("16px");
    expect(button.style.getPropertyValue("--nds-fab-offset")).toBe("24px");
    expect(el.querySelector(".nds-fab__label")?.textContent).toBe("작성");
  });

  it("forwards button attributes and disabled state", async () => {
    const el = document.createElement("nds-fab");
    el.setAttribute("name", "compose");
    el.setAttribute("value", "open");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button") as HTMLButtonElement;
    expect(button.name).toBe("compose");
    expect(button.value).toBe("open");
    expect(button.disabled).toBe(true);
  });
});
