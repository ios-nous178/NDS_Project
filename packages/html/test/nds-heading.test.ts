/**
 * nds-heading DOM 구조가 React Heading 가 만드는 DOM 과 동일한지 검사.
 */

import { describe, expect, it } from "vitest";
import { NdsHeading } from "../src/components/nds-heading.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-heading — DOM parity with React Heading", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-heading")).toBe(NdsHeading);
  });

  it("renders heading and description with level mapping (h2 default)", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("title", "안녕");
    el.setAttribute("description", "반가워");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(`.nds-heading`) as HTMLElement;
    const title = el.querySelector(`.nds-heading__title`) as HTMLElement;
    const description = el.querySelector(`.nds-heading__description`) as HTMLElement;

    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.level).toBe("h2");
    expect(root.style.gap).toBe("var(--semantic-gap-title-h2)");
    expect(title.tagName).toBe("H2");
    expect(title.textContent).toBe("안녕");
    expect(title.style.fontSize).toBe("28px");
    expect(title.style.lineHeight).toBe("38px");
    expect(description.tagName).toBe("P");
    expect(description.textContent).toBe("반가워");
    expect(description.style.fontSize).toBe("14px");
    expect(description.style.lineHeight).toBe("20px");
    expect(el.style.display).toBe("contents");
  });

  it("switches heading tag and font when level changes", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("level", "h1");
    el.setAttribute("title", "큰 제목");
    document.body.appendChild(el);
    await flush();

    let title = el.querySelector(".nds-heading__title") as HTMLElement;
    expect(title.tagName).toBe("H1");
    expect(title.style.fontSize).toBe("36px");
    expect(title.style.lineHeight).toBe("48px");

    el.setAttribute("level", "h4");
    await flush();
    title = el.querySelector(".nds-heading__title") as HTMLElement;
    expect(title.tagName).toBe("H4");
    expect(title.style.fontSize).toBe("20px");
    expect(title.style.lineHeight).toBe("28px");

    const root = el.querySelector(".nds-heading") as HTMLElement;
    expect(root.dataset.level).toBe("h4");
    expect(root.style.gap).toBe("var(--semantic-gap-title-h4)");
  });

  it("renders `as` tag while keeping level visual scale", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("level", "h2");
    el.setAttribute("as", "h1");
    el.setAttribute("title", "설정");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-heading") as HTMLElement;
    const title = el.querySelector(".nds-heading__title") as HTMLElement;
    // 시맨틱 태그는 as(h1), 비주얼(폰트·gap)은 level(h2).
    expect(title.tagName).toBe("H1");
    expect(title.style.fontSize).toBe("28px");
    expect(root.dataset.level).toBe("h2");
    expect(root.style.gap).toBe("var(--semantic-gap-title-h2)");
  });

  it("falls back to h2 for invalid level", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("level", "h99");
    el.setAttribute("title", "x");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-heading") as HTMLElement;
    expect(root.dataset.level).toBe("h2");
  });

  it("omits description when not provided", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("level", "h3");
    el.setAttribute("title", "단독 헤딩");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-heading__description")).toBeNull();

    el.setAttribute("description", "추가 설명");
    await flush();
    const description = el.querySelector(".nds-heading__description") as HTMLElement;
    expect(description.textContent).toBe("추가 설명");

    el.removeAttribute("description");
    await flush();
    expect(el.querySelector(".nds-heading__description")).toBeNull();
  });

  it("uses h4 caption1 description mapping", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("level", "h4");
    el.setAttribute("title", "t");
    el.setAttribute("description", "s");
    document.body.appendChild(el);
    await flush();

    const description = el.querySelector(".nds-heading__description") as HTMLElement;
    expect(description.style.fontSize).toBe("13px");
    expect(description.style.lineHeight).toBe("18px");
  });

  it("reads title/description from slotted children when attribute missing", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("level", "h3");
    const t = document.createElement("span");
    t.setAttribute("slot", "title");
    t.textContent = "슬롯 제목";
    const s = document.createElement("span");
    s.setAttribute("slot", "description");
    s.textContent = "슬롯 설명";
    el.append(t, s);
    document.body.appendChild(el);
    await flush();

    const title = el.querySelector(".nds-heading__title") as HTMLElement;
    const description = el.querySelector(".nds-heading__description") as HTMLElement;
    expect(title.textContent).toBe("슬롯 제목");
    expect(description.textContent).toBe("슬롯 설명");
  });

  it("forwards aria-label to root", async () => {
    const el = document.createElement("nds-heading");
    el.setAttribute("title", "x");
    el.setAttribute("aria-label", "섹션 헤더");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-heading")!;
    expect(root.getAttribute("aria-label")).toBe("섹션 헤더");
  });
});
