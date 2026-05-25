/**
 * nds-card-visual DOM 구조가 React CardVisual 가 만드는 DOM 과 동일한지 검사.
 */

import { describe, expect, it } from "vitest";
import { NdsCardVisual } from "../src/components/nds-card-visual.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-card-visual — DOM parity with React CardVisual", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-card-visual")).toBe(NdsCardVisual);
  });

  it("renders generic brand defaults with chip", async () => {
    const el = document.createElement("nds-card-visual");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-card-visual") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.brand).toBe("generic");
    expect(root.dataset.disabled).toBe("false");
    expect(root.style.getPropertyValue("--nds-card-bg")).toContain("linear-gradient");
    expect(root.style.getPropertyValue("--nds-card-fg")).toBe("#fff");

    expect(root.querySelector(".nds-card-visual__brand strong")!.textContent).toBe("Card");
    expect(root.querySelector(".nds-card-visual__chip")).not.toBeNull();
    expect(root.querySelector(".nds-card-visual__number")!.textContent).toBe("•••• •••• •••• ••••");
    expect(root.querySelector(".nds-card-visual__holder")!.textContent).toBe("Card Holder");
    expect(root.querySelector(".nds-card-visual__expiry")).toBeNull();
    expect(el.style.display).toBe("contents");
  });

  it("masks card number to last 4 digits", async () => {
    const el = document.createElement("nds-card-visual");
    el.setAttribute("brand", "visa");
    el.setAttribute("number", "1234-5678-9012-3456");
    el.setAttribute("holder", "HONG GIL DONG");
    el.setAttribute("expiry", "12/29");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-card-visual") as HTMLElement;
    expect(root.dataset.brand).toBe("visa");
    expect(root.querySelector(".nds-card-visual__brand strong")!.textContent).toBe("VISA");
    expect(root.querySelector(".nds-card-visual__number")!.textContent).toBe("•••• •••• •••• 3456");
    expect(root.querySelector(".nds-card-visual__holder")!.textContent).toBe("HONG GIL DONG");
    expect(root.querySelector(".nds-card-visual__expiry")!.textContent).toBe("12/29");
  });

  it("falls back to generic for unknown brand", async () => {
    const el = document.createElement("nds-card-visual");
    el.setAttribute("brand", "bogus");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-card-visual") as HTMLElement;
    expect(root.dataset.brand).toBe("generic");
  });

  it("no-chip hides the chip element", async () => {
    const el = document.createElement("nds-card-visual");
    el.setAttribute("no-chip", "");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-card-visual__chip")).toBeNull();
  });

  it("renders custom label next to brand label", async () => {
    const el = document.createElement("nds-card-visual");
    el.setAttribute("brand", "kakao");
    el.setAttribute("label", "주력카드");
    document.body.appendChild(el);
    await flush();

    const brandRow = el.querySelector(".nds-card-visual__brand") as HTMLElement;
    expect(brandRow.querySelector("strong")!.textContent).toBe("카카오뱅크");
    expect(brandRow.querySelector(".nds-card-visual__label")!.textContent).toBe("주력카드");
  });

  it("disabled state toggles data attribute", async () => {
    const el = document.createElement("nds-card-visual");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-card-visual") as HTMLElement;
    expect(root.dataset.disabled).toBe("true");
  });
});
