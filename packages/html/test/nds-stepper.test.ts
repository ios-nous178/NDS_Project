import { describe, expect, it } from "vitest";
import { NdsStepper } from "../src/components/nds-stepper.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-stepper", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-stepper")).toBe(NdsStepper);
  });

  it("renders numbered steps with completed/current/upcoming state", async () => {
    const el = document.createElement("nds-stepper");
    el.setAttribute("steps", JSON.stringify(["신청", "상담", "완료"]));
    el.setAttribute("current", "1");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("ol") as HTMLOListElement;
    const items = el.querySelectorAll(".nds-stepper__item");
    expect(root.className).toBe("nds-stepper__root");
    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.variant).toBe("numbered");
    expect(items).toHaveLength(3);
    expect((items[0] as HTMLElement).dataset.state).toBe("completed");
    expect(items[0].querySelector("svg.nds-stepper__check")).toBeTruthy();
    expect((items[1] as HTMLElement).dataset.state).toBe("current");
    expect(items[1].getAttribute("aria-current")).toBe("step");
    expect(items[1].querySelector(".nds-stepper__indicator")?.textContent).toBe("2");
    expect((items[2] as HTMLElement).dataset.state).toBe("upcoming");
    expect(el.querySelectorAll(".nds-stepper__connector")).toHaveLength(2);
    expect(el.style.display).toBe("contents");
  });

  it("supports comma-list steps and dots variant", async () => {
    const el = document.createElement("nds-stepper");
    el.setAttribute("steps", "A,B,C");
    el.setAttribute("variant", "dots");
    document.body.appendChild(el);
    await flush();

    const indicators = el.querySelectorAll(".nds-stepper__indicator");
    expect((el.querySelector("ol") as HTMLElement).dataset.variant).toBe("dots");
    expect(indicators[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(indicators[0]?.textContent).toBe("");
    expect(el.querySelector(".nds-stepper__label")?.textContent).toBe("A");
  });

  it("clamps current to last step and forwards a11y attrs", async () => {
    const el = document.createElement("nds-stepper");
    el.setAttribute("steps", JSON.stringify([{ key: "a", label: "첫번째" }]));
    el.setAttribute("current", "9");
    el.setAttribute("aria-label", "진행 단계");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector("ol")!;
    const item = el.querySelector(".nds-stepper__item") as HTMLElement;
    expect(root.getAttribute("aria-label")).toBe("진행 단계");
    expect(item.dataset.state).toBe("current");
  });
});
