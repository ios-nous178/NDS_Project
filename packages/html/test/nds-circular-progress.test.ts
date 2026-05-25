import { describe, expect, it } from "vitest";
import { NdsCircularProgress } from "../src/components/nds-circular-progress.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-circular-progress", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-circular-progress")).toBe(NdsCircularProgress);
  });

  it("renders progressbar root, svg, track, fill, and default label", async () => {
    const el = document.createElement("nds-circular-progress");
    el.setAttribute("value", "25");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-circular-progress") as HTMLElement;
    const svg = el.querySelector(".nds-circular-progress__svg")!;
    const track = el.querySelector(".nds-circular-progress__track")!;
    const fill = el.querySelector(".nds-circular-progress__fill")!;
    const value = el.querySelector(".nds-circular-progress__value")!;

    expect(root.dataset.slot).toBe("root");
    expect(root.getAttribute("role")).toBe("progressbar");
    expect(root.getAttribute("aria-valuenow")).toBe("25");
    expect(root.getAttribute("aria-valuemax")).toBe("100");
    expect(root.getAttribute("aria-label")).toBe("진행도");
    expect(root.style.width).toBe("80px");
    expect(root.style.height).toBe("80px");
    expect(svg.getAttribute("width")).toBe("80");
    expect(track.getAttribute("stroke-width")).toBe("7");
    expect(fill.getAttribute("stroke-dasharray")).toBeTruthy();
    expect(fill.getAttribute("stroke-dashoffset")).toBeTruthy();
    expect(value.textContent).toBe("25%");
    expect(el.style.display).toBe("contents");
  });

  it("supports max, size, thickness, label, and caption", async () => {
    const el = document.createElement("nds-circular-progress");
    el.setAttribute("value", "30");
    el.setAttribute("max", "120");
    el.setAttribute("size", "100");
    el.setAttribute("thickness", "10");
    el.setAttribute("label", "3/12");
    el.setAttribute("caption", "완료");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-circular-progress") as HTMLElement;
    const svg = el.querySelector("svg")!;
    const track = el.querySelector(".nds-circular-progress__track")!;
    const value = el.querySelector(".nds-circular-progress__value")!;
    const caption = el.querySelector(".nds-circular-progress__caption")!;

    expect(root.getAttribute("aria-valuemax")).toBe("120");
    expect(root.style.width).toBe("100px");
    expect(svg.getAttribute("width")).toBe("100");
    expect(track.getAttribute("stroke-width")).toBe("10");
    expect(value.textContent).toBe("3/12");
    expect(caption.textContent).toBe("완료");
  });

  it("hides label when hide-label is present", async () => {
    const el = document.createElement("nds-circular-progress");
    el.setAttribute("hide-label", "");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-circular-progress__label")).toBeNull();
  });

  it("maps color attrs to CSS vars", async () => {
    const el = document.createElement("nds-circular-progress");
    el.setAttribute("color", "red");
    el.setAttribute("track-color", "gray");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-circular-progress") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-cp-fill")).toBe("red");
    expect(root.style.getPropertyValue("--nds-cp-track")).toBe("gray");
  });
});
