import { describe, expect, it, vi } from "vitest";
import { NdsBanner } from "../src/components/nds-banner.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-banner", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-banner")).toBe(NdsBanner);
  });

  it("renders filled banner content, action, and side image", async () => {
    const el = document.createElement("nds-banner");
    el.setAttribute("banner-title", "이벤트");
    el.setAttribute("description", "오늘만 제공됩니다");
    el.setAttribute("action-label", "확인");
    el.setAttribute("image-src", "/banner.png");
    el.setAttribute("image-alt", "배너");
    el.setAttribute("image-width", "80");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-banner") as HTMLElement;
    const img = el.querySelector("img") as HTMLImageElement;
    expect(root.dataset.variant).toBe("filled");
    expect(root.dataset.clickable).toBe("false");
    expect(el.querySelector(".nds-banner__title")?.textContent).toBe("이벤트");
    expect(el.querySelector(".nds-banner__description")?.textContent).toBe("오늘만 제공됩니다");
    expect(el.querySelector(".nds-banner__action")?.textContent).toBe("확인");
    expect(img.className).toBe("nds-banner__image");
    expect(img.getAttribute("src")).toBe("/banner.png");
    expect(img.getAttribute("width")).toBe("80");
    expect(el.style.display).toBe("contents");
  });

  it("renders image variant", async () => {
    const el = document.createElement("nds-banner");
    el.setAttribute("variant", "image");
    el.setAttribute("full-image-src", "/full.png");
    el.setAttribute("full-image-srcset", "/full@2x.png 2x");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-banner") as HTMLElement;
    const img = el.querySelector("img") as HTMLImageElement;
    expect(root.dataset.variant).toBe("image");
    expect(img.getAttribute("src")).toBe("/full.png");
    expect(img.getAttribute("srcset")).toBe("/full@2x.png 2x");
  });

  it("dispatches navigate/action/close events", async () => {
    const el = document.createElement("nds-banner");
    const navigate = vi.fn();
    const action = vi.fn();
    const close = vi.fn();
    el.setAttribute("href", "/promo");
    el.setAttribute("action-label", "자세히");
    el.setAttribute("action-href", "/detail");
    el.setAttribute("closable", "");
    el.addEventListener("nds-banner-navigate", navigate);
    el.addEventListener("nds-banner-action", action);
    el.addEventListener("nds-banner-close", close);
    document.body.appendChild(el);
    await flush();

    (el.querySelector(".nds-banner__action") as HTMLElement).click();
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0]?.[0].detail.href).toBe("/detail");
    expect(navigate).not.toHaveBeenCalled();

    (el.querySelector(".nds-banner") as HTMLElement).click();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0]?.[0].detail.href).toBe("/promo");

    (el.querySelector(".nds-banner__close") as HTMLButtonElement).click();
    expect(close).toHaveBeenCalledTimes(1);
    expect(document.body.contains(el)).toBe(false);
  });
});
