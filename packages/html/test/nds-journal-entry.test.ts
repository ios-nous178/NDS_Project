/**
 * nds-journal-entry DOM 구조 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsJournalEntry } from "../src/components/nds-journal-entry.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-journal-entry — DOM parity with React JournalEntry", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-journal-entry")).toBe(NdsJournalEntry);
  });

  it("renders basic structure with date + body and default lines", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "오늘");
    el.setAttribute("body", "햇살이 좋았어요");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-journal-entry") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.clickable).toBe("false");
    expect(root.style.getPropertyValue("--nds-journal-lines")).toBe("3");

    expect(root.querySelector(".nds-journal-entry__date")!.textContent).toBe("오늘");
    expect(root.querySelector(".nds-journal-entry__body")!.textContent).toBe("햇살이 좋았어요");
    expect(root.querySelector(".nds-journal-entry__title")).toBeNull();
    expect(root.querySelector(".nds-journal-entry__mood")).toBeNull();
    expect(root.querySelector(".nds-journal-entry__thumb")).toBeNull();
    expect(el.style.display).toBe("contents");
  });

  it("renders mood, title, tags, footer, thumbnail when provided", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "2026-05-25");
    el.setAttribute("mood", "😊");
    el.setAttribute("title", "좋은 하루");
    el.setAttribute("body", "감사한 일");
    el.setAttribute("tags", '["산책","감사"]');
    el.setAttribute("thumbnail-src", "/x.jpg");
    el.setAttribute("footer", "5분 전 기록");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-journal-entry__mood")!.textContent).toBe("😊");
    expect(el.querySelector(".nds-journal-entry__title")!.textContent).toBe("좋은 하루");

    const tags = el.querySelectorAll(".nds-journal-entry__tag");
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent).toBe("#산책");
    expect(tags[1].textContent).toBe("#감사");

    const img = el.querySelector(".nds-journal-entry__thumb") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/x.jpg");

    expect(el.querySelector(".nds-journal-entry__footer")!.textContent).toBe("5분 전 기록");
  });

  it("clickable flag enables role=button + tabindex", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "오늘");
    el.setAttribute("body", "x");
    el.setAttribute("clickable", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-journal-entry") as HTMLElement;
    expect(root.dataset.clickable).toBe("true");
    expect(root.getAttribute("role")).toBe("button");
    expect(root.tabIndex).toBe(0);
  });

  it("Enter/Space on clickable triggers click", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "오늘");
    el.setAttribute("body", "x");
    el.setAttribute("clickable", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-journal-entry") as HTMLElement;
    let clicks = 0;
    root.addEventListener("click", () => clicks++);
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(clicks).toBe(1);
    root.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    expect(clicks).toBe(2);
  });

  it("non-clickable ignores Enter", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "오늘");
    el.setAttribute("body", "x");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-journal-entry") as HTMLElement;
    let clicks = 0;
    root.addEventListener("click", () => clicks++);
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(clicks).toBe(0);
  });

  it("max-lines attribute updates --nds-journal-lines", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "x");
    el.setAttribute("body", "y");
    el.setAttribute("max-lines", "5");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-journal-entry") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-journal-lines")).toBe("5");
  });

  it("falls back to slot=body text when body attribute missing", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "x");
    const body = document.createElement("span");
    body.setAttribute("slot", "body");
    body.textContent = "슬롯 본문";
    el.appendChild(body);
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-journal-entry__body")!.textContent).toBe("슬롯 본문");
  });

  it("parses tags from comma string", async () => {
    const el = document.createElement("nds-journal-entry");
    el.setAttribute("date", "x");
    el.setAttribute("body", "y");
    el.setAttribute("tags", "산책, 감사,운동");
    document.body.appendChild(el);
    await flush();
    const tags = el.querySelectorAll(".nds-journal-entry__tag");
    expect(tags).toHaveLength(3);
    expect(tags[2].textContent).toBe("#운동");
  });
});
