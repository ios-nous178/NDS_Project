import { describe, expect, it } from "vitest";
import { NdsSparkline } from "../src/components/nds-sparkline.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-sparkline", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-sparkline")).toBe(NdsSparkline);
  });

  it("renders line sparkline with default label and last dot", async () => {
    const el = document.createElement("nds-sparkline");
    el.setAttribute("data", "[1,3,2,5]");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-sparkline") as HTMLElement;
    const svg = el.querySelector("svg")!;
    expect(root.dataset.slot).toBe("root");
    expect(root.role).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("추세 차트");
    expect(svg.getAttribute("width")).toBe("120");
    expect(svg.getAttribute("height")).toBe("36");
    expect(svg.querySelector("path")?.getAttribute("d")).toContain("M");
    expect(svg.querySelector("circle")).toBeTruthy();
    expect(el.style.display).toBe("contents");
  });

  it("renders area with baseline and custom dimensions", async () => {
    const el = document.createElement("nds-sparkline");
    el.setAttribute("data", "1,2,4");
    el.setAttribute("kind", "area");
    el.setAttribute("width", "80");
    el.setAttribute("height", "24");
    el.setAttribute("color", "#123456");
    el.setAttribute("show-baseline", "");
    document.body.appendChild(el);
    await flush();

    const svg = el.querySelector("svg")!;
    const paths = svg.querySelectorAll("path");
    expect(svg.getAttribute("viewBox")).toBe("0 0 80 24");
    expect(svg.querySelector("line")?.getAttribute("stroke-dasharray")).toBe("2 3");
    expect(paths[0]?.getAttribute("fill")).toBe("#123456");
    expect(paths[0]?.getAttribute("fill-opacity")).toBe("0.2");
  });

  it("renders bar kind without last dot", async () => {
    const el = document.createElement("nds-sparkline");
    el.setAttribute("data", "[2,4,6]");
    el.setAttribute("kind", "bar");
    el.setAttribute("show-last-dot", "false");
    document.body.appendChild(el);
    await flush();

    const svg = el.querySelector("svg")!;
    expect(svg.querySelectorAll("rect")).toHaveLength(3);
    expect(svg.querySelector("circle")).toBeNull();
  });

  it("forwards a11y attributes to root", async () => {
    const el = document.createElement("nds-sparkline");
    el.setAttribute("aria-label", "매출 추세");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-sparkline")?.getAttribute("aria-label")).toBe("매출 추세");
  });
});
