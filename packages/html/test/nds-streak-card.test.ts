/**
 * nds-streak-card DOM 구조 검증.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NdsStreakCard } from "../src/components/nds-streak-card.js";

const DAYS = JSON.stringify([
  { date: "2026-05-23", done: true, label: "토" },
  { date: "2026-05-24", done: true, label: "일" },
  { date: "2026-05-25", done: false, label: "월" },
]);

describe("nds-streak-card — DOM parity with React StreakCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-25T08:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("registers as a custom element", () => {
    expect(customElements.get("nds-streak-card")).toBe(NdsStreakCard);
  });

  it("renders default header with 🔥 icon and streak value", async () => {
    const el = document.createElement("nds-streak-card");
    el.setAttribute("streak", "7");
    document.body.appendChild(el);
    await Promise.resolve();

    const root = el.querySelector(".nds-streak-card") as HTMLElement;
    expect(root.dataset.slot).toBe("root");

    const icon = root.querySelector(".nds-streak-card__icon") as HTMLElement;
    expect(icon.textContent).toBe("🔥");
    expect(icon.getAttribute("aria-hidden")).toBe("true");

    expect(root.querySelector(".nds-streak-card__title")!.textContent).toBe("연속 기록");
    expect(root.querySelector(".nds-streak-card__number")!.textContent).toBe("7");
    expect(root.querySelector(".nds-streak-card__unit")!.textContent).toBe("일째");
    expect(el.style.display).toBe("contents");
  });

  it("uses slot=icon when provided", async () => {
    const el = document.createElement("nds-streak-card");
    el.setAttribute("streak", "3");
    const sparkle = document.createElement("span");
    sparkle.setAttribute("slot", "icon");
    sparkle.textContent = "✨";
    el.appendChild(sparkle);
    document.body.appendChild(el);
    await Promise.resolve();

    expect(el.querySelector(".nds-streak-card__icon")!.textContent).toBe("✨");
  });

  it("supports custom title and unit", async () => {
    const el = document.createElement("nds-streak-card");
    el.setAttribute("title", "명상 기록");
    el.setAttribute("streak", "14");
    el.setAttribute("unit", "주");
    document.body.appendChild(el);
    await Promise.resolve();

    expect(el.querySelector(".nds-streak-card__title")!.textContent).toBe("명상 기록");
    expect(el.querySelector(".nds-streak-card__unit")!.textContent).toBe("주째");
  });

  it("renders day grid with done/today flags", async () => {
    const el = document.createElement("nds-streak-card");
    el.setAttribute("streak", "2");
    el.setAttribute("days", DAYS);
    document.body.appendChild(el);
    await Promise.resolve();

    const grid = el.querySelector(".nds-streak-card__grid") as HTMLElement;
    expect(grid.getAttribute("role")).toBe("list");
    const dots = grid.querySelectorAll<HTMLElement>(".nds-streak-card__day-dot");
    expect(dots).toHaveLength(3);
    expect(dots[0].dataset.done).toBe("true");
    expect(dots[0].dataset.today).toBe("false");
    expect(dots[2].dataset.done).toBe("false");
    expect(dots[2].dataset.today).toBe("true");
    expect(dots[2].getAttribute("aria-label")).toContain("미완료");
    expect(dots[0].getAttribute("aria-label")).toContain("완료");
  });

  it("omits grid when days is empty or invalid", async () => {
    const el = document.createElement("nds-streak-card");
    el.setAttribute("streak", "1");
    el.setAttribute("days", "[]");
    document.body.appendChild(el);
    await Promise.resolve();
    expect(el.querySelector(".nds-streak-card__grid")).toBeNull();

    el.setAttribute("days", "not-json");
    await Promise.resolve();
    expect(el.querySelector(".nds-streak-card__grid")).toBeNull();
  });

  it("renders footer when provided", async () => {
    const el = document.createElement("nds-streak-card");
    el.setAttribute("streak", "5");
    el.setAttribute("footer", "잘하고 있어요!");
    document.body.appendChild(el);
    await Promise.resolve();

    expect(el.querySelector(".nds-streak-card__footer")!.textContent).toBe("잘하고 있어요!");
  });

  it("uses date suffix as label when label is missing", async () => {
    const el = document.createElement("nds-streak-card");
    el.setAttribute("streak", "1");
    el.setAttribute("days", JSON.stringify([{ date: "2026-05-23", done: true }]));
    document.body.appendChild(el);
    await Promise.resolve();
    expect(el.querySelector(".nds-streak-card__day-label")!.textContent).toBe("23");
  });
});
