/**
 * nds-progress-bar DOM 구조가 React ProgressBar 가 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsProgressBar } from "../src/components/nds-progress-bar.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-progress-bar — DOM parity with React ProgressBar", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-progress-bar")).toBe(NdsProgressBar);
  });

  it("renders root, track, and fill with default values", async () => {
    const el = document.createElement("nds-progress-bar");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-progress-bar") as HTMLElement;
    const track = el.querySelector(".nds-progress-bar__track") as HTMLElement;
    const fill = el.querySelector(".nds-progress-bar__fill") as HTMLElement;

    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.size).toBe("md");
    expect(root.getAttribute("role")).toBe("progressbar");
    expect(root.getAttribute("aria-valuenow")).toBe("0");
    expect(root.getAttribute("aria-valuemin")).toBe("0");
    expect(root.getAttribute("aria-valuemax")).toBe("100");
    expect(track.dataset.slot).toBe("track");
    expect(track.style.getPropertyValue("--nds-progress-height")).toBe("8px");
    expect(fill.dataset.slot).toBe("fill");
    expect(fill.style.width).toBe("0%");
    expect(el.style.display).toBe("contents");
  });

  it("calculates fill width from value and max", async () => {
    const el = document.createElement("nds-progress-bar");
    el.setAttribute("value", "30");
    el.setAttribute("max", "120");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-progress-bar") as HTMLElement;
    const fill = el.querySelector(".nds-progress-bar__fill") as HTMLElement;
    expect(root.getAttribute("aria-valuenow")).toBe("30");
    expect(root.getAttribute("aria-valuemax")).toBe("120");
    expect(fill.style.width).toBe("25%");
  });

  it("clamps fill width to 0..100", async () => {
    const el = document.createElement("nds-progress-bar");
    el.setAttribute("value", "150");
    document.body.appendChild(el);
    await flush();

    const fill = el.querySelector(".nds-progress-bar__fill") as HTMLElement;
    expect(fill.style.width).toBe("100%");

    el.setAttribute("value", "-10");
    await flush();
    expect(fill.style.width).toBe("0%");
  });

  it("maps size to track height", async () => {
    const el = document.createElement("nds-progress-bar");
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-progress-bar") as HTMLElement;
    const track = el.querySelector(".nds-progress-bar__track") as HTMLElement;
    expect(root.dataset.size).toBe("lg");
    expect(track.style.getPropertyValue("--nds-progress-height")).toBe("12px");

    el.setAttribute("size", "sm");
    await flush();
    expect(root.dataset.size).toBe("sm");
    expect(track.style.getPropertyValue("--nds-progress-height")).toBe("4px");
  });

  it("falls back to md for invalid size", async () => {
    const el = document.createElement("nds-progress-bar");
    el.setAttribute("size", "huge");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-progress-bar") as HTMLElement;
    const track = el.querySelector(".nds-progress-bar__track") as HTMLElement;
    expect(root.dataset.size).toBe("md");
    expect(track.style.getPropertyValue("--nds-progress-height")).toBe("8px");
  });

  it("maps color to fill CSS variable on track", async () => {
    const el = document.createElement("nds-progress-bar");
    el.setAttribute("color", "var(--semantic-fill-status-success)");
    document.body.appendChild(el);
    await flush();

    const track = el.querySelector(".nds-progress-bar__track") as HTMLElement;
    expect(track.style.getPropertyValue("--nds-progress-fill-bg")).toBe(
      "var(--semantic-fill-status-success)",
    );
  });

  it("forwards a11y text attributes to the root", async () => {
    const el = document.createElement("nds-progress-bar");
    el.setAttribute("aria-label", "진행률");
    el.setAttribute("title", "업로드 진행률");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-progress-bar")!;
    expect(root.getAttribute("aria-label")).toBe("진행률");
    expect(root.getAttribute("title")).toBe("업로드 진행률");
  });
});
