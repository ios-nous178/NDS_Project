import { describe, expect, it } from "vitest";
import { NdsBreadcrumb } from "../src/components/nds-breadcrumb.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-breadcrumb", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-breadcrumb")).toBe(NdsBreadcrumb);
  });

  it("renders items from child anchors and marks last item current", async () => {
    const el = document.createElement("nds-breadcrumb");
    el.innerHTML = `<a href="/">홈</a><a href="/care">케어</a><span>상담</span>`;
    document.body.appendChild(el);
    await flush();

    const nav = el.querySelector("nav")!;
    const items = [...el.querySelectorAll(".nds-breadcrumb__item")];
    const separators = [...el.querySelectorAll(".nds-breadcrumb__separator")];

    expect(nav.dataset.slot).toBe("root");
    expect(nav.getAttribute("aria-label")).toBe("경로");
    expect(items).toHaveLength(3);
    expect(items[0].tagName).toBe("A");
    expect((items[0] as HTMLAnchorElement).getAttribute("href")).toBe("/");
    expect(items[2].textContent).toBe("상담");
    expect((items[2] as HTMLElement).dataset.current).toBe("true");
    expect(items[2].getAttribute("aria-current")).toBe("page");
    expect(separators).toHaveLength(2);
    expect(el.style.display).toBe("contents");
  });

  it("renders items from JSON attribute", async () => {
    const el = document.createElement("nds-breadcrumb");
    el.setAttribute(
      "items",
      JSON.stringify([
        { label: "홈", href: "/" },
        { label: "설정", href: "/settings" },
      ]),
    );
    document.body.appendChild(el);
    await flush();

    const items = [...el.querySelectorAll(".nds-breadcrumb__item")];
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe("홈");
    expect(items[1].textContent).toBe("설정");
    expect(items[1].tagName).toBe("SPAN");
  });

  it("supports custom text separator", async () => {
    const el = document.createElement("nds-breadcrumb");
    el.setAttribute("separator", "/");
    el.innerHTML = `<span>홈</span><span>상담</span>`;
    document.body.appendChild(el);
    await flush();

    const sep = el.querySelector(".nds-breadcrumb__separator")!;
    expect(sep.textContent).toBe("/");
  });
});
