/**
 * nds-title-block DOM 구조가 React TitleBlock 가 만드는 DOM 과 동일한지 검사.
 */

import { describe, expect, it } from "vitest";
import { NdsTitleBlock } from "../src/components/nds-title-block.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-title-block — DOM parity with React TitleBlock", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-title-block")).toBe(NdsTitleBlock);
  });

  it("renders heading and subtitle with level mapping (h2 default)", async () => {
    const el = document.createElement("nds-title-block");
    el.setAttribute("title", "안녕");
    el.setAttribute("subtitle", "반가워");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(`.nds-title-block`) as HTMLElement;
    const title = el.querySelector(`.nds-title-block__title`) as HTMLElement;
    const subtitle = el.querySelector(`.nds-title-block__subtitle`) as HTMLElement;

    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.level).toBe("h2");
    expect(root.style.gap).toBe("var(--gap-title-h2)");
    expect(title.tagName).toBe("H2");
    expect(title.textContent).toBe("안녕");
    expect(title.style.fontSize).toBe("28px");
    expect(title.style.lineHeight).toBe("38px");
    expect(subtitle.tagName).toBe("P");
    expect(subtitle.textContent).toBe("반가워");
    expect(subtitle.style.fontSize).toBe("14px");
    expect(subtitle.style.lineHeight).toBe("20px");
    expect(el.style.display).toBe("contents");
  });

  it("switches heading tag and font when level changes", async () => {
    const el = document.createElement("nds-title-block");
    el.setAttribute("level", "h1");
    el.setAttribute("title", "큰 제목");
    document.body.appendChild(el);
    await flush();

    let title = el.querySelector(".nds-title-block__title") as HTMLElement;
    expect(title.tagName).toBe("H1");
    expect(title.style.fontSize).toBe("36px");
    expect(title.style.lineHeight).toBe("48px");

    el.setAttribute("level", "h4");
    await flush();
    title = el.querySelector(".nds-title-block__title") as HTMLElement;
    expect(title.tagName).toBe("H4");
    expect(title.style.fontSize).toBe("20px");
    expect(title.style.lineHeight).toBe("28px");

    const root = el.querySelector(".nds-title-block") as HTMLElement;
    expect(root.dataset.level).toBe("h4");
    expect(root.style.gap).toBe("var(--gap-title-h4)");
  });

  it("falls back to h2 for invalid level", async () => {
    const el = document.createElement("nds-title-block");
    el.setAttribute("level", "h99");
    el.setAttribute("title", "x");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-title-block") as HTMLElement;
    expect(root.dataset.level).toBe("h2");
  });

  it("omits subtitle when not provided", async () => {
    const el = document.createElement("nds-title-block");
    el.setAttribute("level", "h3");
    el.setAttribute("title", "단독 헤딩");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-title-block__subtitle")).toBeNull();

    el.setAttribute("subtitle", "추가 설명");
    await flush();
    const subtitle = el.querySelector(".nds-title-block__subtitle") as HTMLElement;
    expect(subtitle.textContent).toBe("추가 설명");

    el.removeAttribute("subtitle");
    await flush();
    expect(el.querySelector(".nds-title-block__subtitle")).toBeNull();
  });

  it("uses h4 caption1 subtitle mapping", async () => {
    const el = document.createElement("nds-title-block");
    el.setAttribute("level", "h4");
    el.setAttribute("title", "t");
    el.setAttribute("subtitle", "s");
    document.body.appendChild(el);
    await flush();

    const subtitle = el.querySelector(".nds-title-block__subtitle") as HTMLElement;
    expect(subtitle.style.fontSize).toBe("13px");
    expect(subtitle.style.lineHeight).toBe("18px");
  });

  it("reads title/subtitle from slotted children when attribute missing", async () => {
    const el = document.createElement("nds-title-block");
    el.setAttribute("level", "h3");
    const t = document.createElement("span");
    t.setAttribute("slot", "title");
    t.textContent = "슬롯 제목";
    const s = document.createElement("span");
    s.setAttribute("slot", "subtitle");
    s.textContent = "슬롯 서브";
    el.append(t, s);
    document.body.appendChild(el);
    await flush();

    const title = el.querySelector(".nds-title-block__title") as HTMLElement;
    const subtitle = el.querySelector(".nds-title-block__subtitle") as HTMLElement;
    expect(title.textContent).toBe("슬롯 제목");
    expect(subtitle.textContent).toBe("슬롯 서브");
  });

  it("forwards aria-label to root", async () => {
    const el = document.createElement("nds-title-block");
    el.setAttribute("title", "x");
    el.setAttribute("aria-label", "섹션 헤더");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-title-block")!;
    expect(root.getAttribute("aria-label")).toBe("섹션 헤더");
  });
});
