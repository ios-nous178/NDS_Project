import { describe, expect, it } from "vitest";
import { NdsStarRating } from "../src/components/nds-star-rating.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-star-rating — DOM parity with React StarRating", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-star-rating")).toBe(NdsStarRating);
  });

  it("renders default stars at the React default 16px size", async () => {
    const el = document.createElement("nds-star-rating");
    el.setAttribute("value", "4");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-star-rating") as HTMLElement;
    const svg = root.querySelector("svg")!;

    expect(root.dataset.slot).toBe("root");
    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.getAttribute("height")).toBe("16");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    expect(el.style.display).toBe("contents");
  });

  it("accepts numeric size values like React", async () => {
    const el = document.createElement("nds-star-rating");
    el.setAttribute("value", "4");
    el.setAttribute("size", "24");
    document.body.appendChild(el);
    await flush();

    const svg = el.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("maps named size aliases without rendering NaN-sized svg", async () => {
    const el = document.createElement("nds-star-rating");
    el.setAttribute("value", "4");
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await flush();

    const svg = el.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("20");
  });

  it("falls back to 16px for invalid size values", async () => {
    const el = document.createElement("nds-star-rating");
    el.setAttribute("value", "4");
    el.setAttribute("size", "huge");
    document.body.appendChild(el);
    await flush();

    const svg = el.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.getAttribute("height")).toBe("16");
  });
});
