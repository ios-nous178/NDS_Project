/**
 * nds-expandable-text DOM 구조와 토글 동작 검증.
 * JSDOM 은 실제 layout 을 측정하지 않으므로 scrollHeight / lineHeight 를 명시적으로 mock 한다.
 * mock 후 attribute 를 새 값으로 바꿔 re-render 를 트리거한다.
 */

import { describe, expect, it, vi } from "vitest";
import { NdsExpandableText } from "../src/components/nds-expandable-text.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

function mockBodyHeights(body: HTMLElement, scrollH: number, lineHeightPx: number) {
  Object.defineProperty(body, "scrollHeight", { configurable: true, get: () => scrollH });
  body.style.lineHeight = `${lineHeightPx}px`;
}

/** mock 적용 후 lines attribute 를 새 값으로 바꿔 update 를 강제. */
async function setupOverflow(
  el: HTMLElement,
  { scrollH, lineHeightPx, lines }: { scrollH: number; lineHeightPx: number; lines: number },
) {
  document.body.appendChild(el);
  await flush();
  const body = el.querySelector(".nds-expandable-text__body") as HTMLElement;
  mockBodyHeights(body, scrollH, lineHeightPx);
  el.setAttribute("lines", String(lines));
  await flush();
  return body;
}

describe("nds-expandable-text — DOM parity with React ExpandableText", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-expandable-text")).toBe(NdsExpandableText);
  });

  it("preserves children inside body and exposes default vars", async () => {
    const el = document.createElement("nds-expandable-text");
    el.textContent = "한 줄짜리 본문";
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-expandable-text") as HTMLElement;
    const body = el.querySelector(".nds-expandable-text__body") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.style.getPropertyValue("--nds-expandable-lines")).toBe("3");
    expect(body.textContent).toBe("한 줄짜리 본문");
    expect(el.style.display).toBe("contents");
    expect(el.querySelector(".nds-expandable-text__toggle")).toBeNull();
  });

  it("does not show toggle when content fits within limit", async () => {
    const el = document.createElement("nds-expandable-text");
    el.textContent = "짧음";
    const body = await setupOverflow(el, { scrollH: 40, lineHeightPx: 20, lines: 3 });
    expect(el.querySelector(".nds-expandable-text__toggle")).toBeNull();
    expect(body.dataset.clamped).toBe("false");
  });

  it("clamps and shows 더보기 when overflowing, toggles on click", async () => {
    const el = document.createElement("nds-expandable-text");
    el.textContent = "긴 본문이라 두 줄을 넘김";
    const body = await setupOverflow(el, { scrollH: 200, lineHeightPx: 20, lines: 2 });

    const toggle = el.querySelector(".nds-expandable-text__toggle") as HTMLButtonElement;
    expect(toggle).not.toBeNull();
    expect(toggle.type).toBe("button");
    expect(toggle.textContent).toBe("더보기");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(body.dataset.clamped).toBe("true");

    let detail: { expanded: boolean } | null = null;
    el.addEventListener("expanded-change", (e) => {
      detail = (e as CustomEvent<{ expanded: boolean }>).detail;
    });
    toggle.click();
    await flush();

    expect(detail).toEqual({ expanded: true });
    expect(el.hasAttribute("expanded")).toBe(true);
    const refreshedToggle = el.querySelector(".nds-expandable-text__toggle") as HTMLButtonElement;
    expect(refreshedToggle.textContent).toBe("접기");
    expect(refreshedToggle.getAttribute("aria-expanded")).toBe("true");
    expect(body.dataset.clamped).toBe("false");
  });

  it("hide-collapse hides the toggle once expanded", async () => {
    const el = document.createElement("nds-expandable-text");
    el.setAttribute("hide-collapse", "");
    el.textContent = "긴 본문";
    await setupOverflow(el, { scrollH: 200, lineHeightPx: 20, lines: 2 });

    const toggle = el.querySelector(".nds-expandable-text__toggle") as HTMLButtonElement;
    toggle.click();
    await flush();

    expect(el.querySelector(".nds-expandable-text__toggle")).toBeNull();
  });

  it("custom expand-label / collapse-label", async () => {
    const el = document.createElement("nds-expandable-text");
    el.setAttribute("expand-label", "전체 보기");
    el.setAttribute("collapse-label", "줄이기");
    el.textContent = "본문";
    await setupOverflow(el, { scrollH: 200, lineHeightPx: 20, lines: 2 });

    expect(el.querySelector(".nds-expandable-text__toggle")!.textContent).toBe("전체 보기");

    (el.querySelector(".nds-expandable-text__toggle") as HTMLButtonElement).click();
    await flush();
    expect(el.querySelector(".nds-expandable-text__toggle")!.textContent).toBe("줄이기");
  });

  it("controlled expanded attribute reflects state without click", async () => {
    const el = document.createElement("nds-expandable-text");
    el.setAttribute("expanded", "");
    el.textContent = "본문";
    const body = await setupOverflow(el, { scrollH: 200, lineHeightPx: 20, lines: 2 });

    expect(body.dataset.clamped).toBe("false");
    const toggle = el.querySelector(".nds-expandable-text__toggle") as HTMLButtonElement;
    expect(toggle.textContent).toBe("접기");
  });

  it("does not throw when ResizeObserver is missing", async () => {
    const original = globalThis.ResizeObserver;
    // @ts-expect-error force absence
    delete globalThis.ResizeObserver;
    const el = document.createElement("nds-expandable-text");
    el.textContent = "x";
    expect(() => document.body.appendChild(el)).not.toThrow();
    await flush();
    globalThis.ResizeObserver = original;
  });

  it("ResizeObserver re-observes body for size changes", async () => {
    const observed: Element[] = [];
    const disconnects = vi.fn();
    class MockRO {
      callback: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) {
        this.callback = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      unobserve() {}
      disconnect() {
        disconnects();
      }
    }
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = MockRO as unknown as typeof ResizeObserver;

    const el = document.createElement("nds-expandable-text");
    el.textContent = "본문";
    document.body.appendChild(el);
    await flush();

    expect(observed).toHaveLength(1);
    expect(observed[0].classList.contains("nds-expandable-text__body")).toBe(true);

    el.remove();
    expect(disconnects).toHaveBeenCalled();
    globalThis.ResizeObserver = original;
  });
});
