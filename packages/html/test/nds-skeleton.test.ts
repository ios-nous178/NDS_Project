/**
 * nds-skeleton DOM 구조가 React Skeleton 이 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsSkeleton } from "../src/components/nds-skeleton.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-skeleton — DOM parity with React Skeleton", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-skeleton")).toBe(NdsSkeleton);
  });

  it("renders inner div with default rectangular variant and width", async () => {
    const el = document.createElement("nds-skeleton");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("div") as HTMLElement;
    expect(inner.classList.contains("nds-skeleton")).toBe(true);
    expect(inner.dataset.slot).toBe("root");
    expect(inner.dataset.variant).toBe("rectangular");
    expect(inner.style.width).toBe("100%");
    expect(inner.style.height).toBe("");
    expect(inner.getAttribute("aria-hidden")).toBe("true");
    expect(el.style.display).toBe("contents");
  });

  it("supports numeric width and height as px", async () => {
    const el = document.createElement("nds-skeleton");
    el.setAttribute("width", "120");
    el.setAttribute("height", "24");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("div") as HTMLElement;
    expect(inner.style.width).toBe("120px");
    expect(inner.style.height).toBe("24px");
  });

  it("supports CSS string dimensions", async () => {
    const el = document.createElement("nds-skeleton");
    el.setAttribute("width", "50%");
    el.setAttribute("height", "1.5rem");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("div") as HTMLElement;
    expect(inner.style.width).toBe("50%");
    expect(inner.style.height).toBe("1.5rem");
  });

  it("uses width as height for circular variant when height is absent", async () => {
    const el = document.createElement("nds-skeleton");
    el.setAttribute("variant", "circular");
    el.setAttribute("width", "40");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("div") as HTMLElement;
    expect(inner.dataset.variant).toBe("circular");
    expect(inner.style.width).toBe("40px");
    expect(inner.style.height).toBe("40px");
  });

  it("supports text variant and falls back for invalid variant", async () => {
    const el = document.createElement("nds-skeleton");
    el.setAttribute("variant", "text");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("div") as HTMLElement;
    expect(inner.dataset.variant).toBe("text");

    el.setAttribute("variant", "pill");
    await flush();
    expect(inner.dataset.variant).toBe("rectangular");
  });

  it("maps radius to CSS variable", async () => {
    const el = document.createElement("nds-skeleton");
    el.setAttribute("radius", "12");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("div") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-skeleton-radius")).toBe("12px");

    el.removeAttribute("radius");
    await flush();
    expect(inner.style.getPropertyValue("--nds-skeleton-radius")).toBe("");
  });

  it("forwards a11y text attributes and removes aria-hidden when labelled", async () => {
    const el = document.createElement("nds-skeleton");
    el.setAttribute("aria-label", "로딩 자리");
    el.setAttribute("title", "스켈레톤");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("div")!;
    expect(inner.getAttribute("aria-label")).toBe("로딩 자리");
    expect(inner.getAttribute("title")).toBe("스켈레톤");
    expect(inner.hasAttribute("aria-hidden")).toBe(false);
  });
});
