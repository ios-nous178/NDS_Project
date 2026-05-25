/**
 * nds-countdown-timer DOM 구조와 동작 검증.
 * Date.now 를 vi.useFakeTimers 로 고정해 안정적으로 테스트.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NdsCountdownTimer } from "../src/components/nds-countdown-timer.js";

// fake timers 환경에서 setTimeout 기반 flush 가 멈추지 않도록 microtask 기반으로.
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("nds-countdown-timer — DOM parity with React CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-25T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("registers as a custom element", () => {
    expect(customElements.get("nds-countdown-timer")).toBe(NdsCountdownTimer);
  });

  it("renders mm:ss format by default and rounds up ceiling", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 65_000).toISOString());
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-countdown-timer") as HTMLElement;
    const time = el.querySelector(".nds-countdown-timer__time") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.getAttribute("aria-live")).toBe("polite");
    expect(root.dataset.expired).toBe("false");
    expect(time.textContent).toBe("01:05");
  });

  it("supports hh:mm:ss format", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 3_725_000).toISOString());
    el.setAttribute("format", "hh:mm:ss");
    document.body.appendChild(el);
    await flush();
    const time = el.querySelector(".nds-countdown-timer__time")!;
    expect(time.textContent).toBe("01:02:05");
  });

  it("supports remaining format with Korean unit", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 45_000).toISOString());
    el.setAttribute("format", "remaining");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-countdown-timer__time")!.textContent).toBe("45초 남음");

    el.setAttribute("ends-at", new Date(Date.now() + 600_000).toISOString());
    await flush();
    expect(el.querySelector(".nds-countdown-timer__time")!.textContent).toBe("10분 남음");
  });

  it("marks urgent when remaining <= 10s", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 5_000).toISOString());
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-countdown-timer") as HTMLElement;
    expect(root.dataset.urgent).toBe("true");
  });

  it("no-urgent disables urgent styling", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 5_000).toISOString());
    el.setAttribute("no-urgent", "");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-countdown-timer") as HTMLElement;
    expect(root.dataset.urgent).toBe("false");
  });

  it("shows expired text and hides label when target passed", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() - 1000).toISOString());
    el.setAttribute("expired-text", "끝!");
    el.setAttribute("label", "남음");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-countdown-timer") as HTMLElement;
    expect(root.dataset.expired).toBe("true");
    expect(el.querySelector(".nds-countdown-timer__time")!.textContent).toBe("끝!");
    expect(el.querySelector(".nds-countdown-timer__label")).toBeNull();
  });

  it("shows label while not expired", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 30_000).toISOString());
    el.setAttribute("label", "남음");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-countdown-timer__label")!.textContent).toBe("남음");
  });

  it("ticks and fires countdown-complete once when reaching zero", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 2_000).toISOString());
    document.body.appendChild(el);
    await flush();

    const tickDetails: number[] = [];
    let completeFired = 0;
    el.addEventListener("countdown-tick", (e) => {
      tickDetails.push((e as CustomEvent<{ ms: number }>).detail.ms);
    });
    el.addEventListener("countdown-complete", () => completeFired++);

    vi.advanceTimersByTime(1_000);
    vi.advanceTimersByTime(1_000);
    vi.advanceTimersByTime(1_000);

    expect(tickDetails.length).toBeGreaterThanOrEqual(3);
    expect(completeFired).toBe(1);
    const root = el.querySelector(".nds-countdown-timer") as HTMLElement;
    expect(root.dataset.expired).toBe("true");

    vi.advanceTimersByTime(1_000);
    expect(completeFired).toBe(1);
  });

  it("clears interval after disconnect", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", new Date(Date.now() + 60_000).toISOString());
    document.body.appendChild(el);
    await flush();

    let ticks = 0;
    el.addEventListener("countdown-tick", () => ticks++);
    vi.advanceTimersByTime(1_000);
    expect(ticks).toBe(1);

    el.remove();
    vi.advanceTimersByTime(5_000);
    expect(ticks).toBe(1);
  });

  it("accepts ms timestamp number string", async () => {
    const el = document.createElement("nds-countdown-timer");
    el.setAttribute("ends-at", String(Date.now() + 60_000));
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-countdown-timer__time")!.textContent).toBe("01:00");
  });
});
