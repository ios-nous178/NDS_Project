/**
 * nds-breathing-guide DOM 구조 + 사이클 동작 검증.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NdsBreathingGuide } from "../src/components/nds-breathing-guide.js";

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("nds-breathing-guide — DOM parity with React BreathingGuide", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-25T00:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("registers as a custom element", () => {
    expect(customElements.get("nds-breathing-guide")).toBe(NdsBreathingGuide);
  });

  it("renders idle stage with rest circle and controls", async () => {
    const el = document.createElement("nds-breathing-guide");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-breathing-guide") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.playing).toBe("false");

    const circle = root.querySelector(".nds-breathing-guide__circle") as HTMLElement;
    expect(circle.dataset.kind).toBe("rest");
    expect(root.querySelector(".nds-breathing-guide__label")!.textContent).toBe("들이마시기");
    expect(root.querySelector(".nds-breathing-guide__count")).toBeNull();

    const buttons = root.querySelectorAll(".nds-breathing-guide__btn");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toBe("시작");
    expect(buttons[1].textContent).toBe("처음부터");
    expect(el.style.display).toBe("contents");
  });

  it("auto-start renders count and playing dataset", async () => {
    const el = document.createElement("nds-breathing-guide");
    el.setAttribute("auto-start", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-breathing-guide") as HTMLElement;
    expect(root.dataset.playing).toBe("true");
    expect(root.querySelector(".nds-breathing-guide__count")!.textContent).toBe("4");
    expect(root.querySelector(".nds-breathing-guide__circle")!.getAttribute("data-kind")).toBe(
      "inhale",
    );
    const primary = root.querySelector(".nds-breathing-guide__btn") as HTMLElement;
    expect(primary.textContent).toBe("일시정지");
  });

  it("ticks down and advances phase + cycle, fires complete event", async () => {
    const el = document.createElement("nds-breathing-guide");
    el.setAttribute("auto-start", "");
    el.setAttribute("cycles", "1");
    el.setAttribute(
      "phases",
      JSON.stringify([
        { kind: "inhale", seconds: 2 },
        { kind: "exhale", seconds: 2 },
      ]),
    );
    document.body.appendChild(el);
    await flush();

    let complete = 0;
    el.addEventListener("breathing-complete", () => complete++);

    // tick 1
    vi.advanceTimersByTime(1_000);
    await flush();
    expect(el.querySelector(".nds-breathing-guide__count")!.textContent).toBe("1");

    // tick 2 → 다음 phase (exhale, 2 초)
    vi.advanceTimersByTime(1_000);
    await flush();
    expect(el.querySelector(".nds-breathing-guide__circle")!.getAttribute("data-kind")).toBe(
      "exhale",
    );
    expect(el.querySelector(".nds-breathing-guide__count")!.textContent).toBe("2");

    // tick 3-4 → 사이클 1 완료 → playing 해제 + complete 이벤트
    vi.advanceTimersByTime(2_000);
    await flush();
    expect(complete).toBe(1);
    const root = el.querySelector(".nds-breathing-guide") as HTMLElement;
    expect(root.dataset.playing).toBe("false");
  });

  it("primary button toggles playing and fires playing-change", async () => {
    const el = document.createElement("nds-breathing-guide");
    document.body.appendChild(el);
    await flush();

    const states: boolean[] = [];
    el.addEventListener("breathing-playing-change", (e) => {
      states.push((e as CustomEvent<{ playing: boolean }>).detail.playing);
    });

    (el.querySelector(".nds-breathing-guide__btn") as HTMLButtonElement).click();
    await flush();
    expect(states).toEqual([true]);
    expect(el.hasAttribute("playing")).toBe(true);

    (el.querySelector(".nds-breathing-guide__btn") as HTMLButtonElement).click();
    await flush();
    expect(states).toEqual([true, false]);
    expect(el.hasAttribute("playing")).toBe(false);
  });

  it("reset button stops and clears cycle count", async () => {
    const el = document.createElement("nds-breathing-guide");
    el.setAttribute("auto-start", "");
    el.setAttribute("cycles", "5");
    el.setAttribute("phases", JSON.stringify([{ kind: "inhale", seconds: 1 }]));
    document.body.appendChild(el);
    await flush();

    vi.advanceTimersByTime(2_500);
    await flush();

    const buttons = el.querySelectorAll(".nds-breathing-guide__btn");
    (buttons[1] as HTMLButtonElement).click();
    await flush();

    const root = el.querySelector(".nds-breathing-guide") as HTMLElement;
    expect(root.dataset.playing).toBe("false");
    const cycle = root.querySelector(".nds-breathing-guide__cycle");
    expect(cycle!.textContent).toBe("0 / 5 사이클");
  });

  it("hide-controls hides buttons", async () => {
    const el = document.createElement("nds-breathing-guide");
    el.setAttribute("hide-controls", "");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-breathing-guide__controls")).toBeNull();
  });

  it("no-count hides countdown even while playing", async () => {
    const el = document.createElement("nds-breathing-guide");
    el.setAttribute("auto-start", "");
    el.setAttribute("no-count", "");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-breathing-guide__count")).toBeNull();
  });

  it("invalid phases JSON falls back to defaults", async () => {
    const el = document.createElement("nds-breathing-guide");
    el.setAttribute("phases", "not-json");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-breathing-guide__label")!.textContent).toBe("들이마시기");
  });
});
