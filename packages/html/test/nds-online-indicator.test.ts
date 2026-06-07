/**
 * nds-online-indicator DOM 구조가 React OnlineIndicator 가 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsOnlineIndicator } from "../src/components/nds-online-indicator.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-online-indicator — DOM parity with React OnlineIndicator", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-online-indicator")).toBe(NdsOnlineIndicator);
  });

  it("renders root and dot with default offline status", async () => {
    const el = document.createElement("nds-online-indicator");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-online-indicator") as HTMLElement;
    const dot = el.querySelector(".nds-online-indicator__dot") as HTMLElement;

    expect(root.dataset.slot).toBe("root");
    expect(root.getAttribute("aria-label")).toBe("오프라인");
    expect(root.style.getPropertyValue("--nds-presence-color")).toBe(
      "var(--semantic-icon-disabled-default)",
    );
    expect(root.style.getPropertyValue("--nds-presence-size")).toBe("8px");
    expect(dot.dataset.status).toBe("offline");
    expect(dot.getAttribute("aria-hidden")).toBe("true");
    expect(el.style.display).toBe("contents");
  });

  it("maps statuses to labels and color variables", async () => {
    const el = document.createElement("nds-online-indicator");
    el.setAttribute("status", "online");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-online-indicator") as HTMLElement;
    const dot = el.querySelector(".nds-online-indicator__dot") as HTMLElement;
    expect(root.getAttribute("aria-label")).toBe("온라인");
    expect(root.style.getPropertyValue("--nds-presence-color")).toBe(
      "var(--semantic-icon-status-success)",
    );
    expect(dot.dataset.status).toBe("online");

    el.setAttribute("status", "busy");
    await flush();
    expect(root.getAttribute("aria-label")).toBe("상담 중");
    expect(root.style.getPropertyValue("--nds-presence-color")).toBe(
      "var(--semantic-icon-status-error)",
    );
    expect(dot.dataset.status).toBe("busy");
  });

  it("falls back to offline for invalid status", async () => {
    const el = document.createElement("nds-online-indicator");
    el.setAttribute("status", "sleeping");
    document.body.appendChild(el);
    await flush();

    const dot = el.querySelector(".nds-online-indicator__dot") as HTMLElement;
    expect(dot.dataset.status).toBe("offline");
  });

  it("renders label only when show-label is present", async () => {
    const el = document.createElement("nds-online-indicator");
    el.setAttribute("status", "away");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-online-indicator__label")).toBeNull();

    el.setAttribute("show-label", "");
    await flush();
    const label = el.querySelector(".nds-online-indicator__label")!;
    expect(label.textContent).toBe("자리비움");
  });

  it("uses label override for aria-label and visible label", async () => {
    const el = document.createElement("nds-online-indicator");
    el.setAttribute("status", "online");
    el.setAttribute("label", "응답 가능");
    el.setAttribute("show-label", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-online-indicator")!;
    const label = el.querySelector(".nds-online-indicator__label")!;
    expect(root.getAttribute("aria-label")).toBe("응답 가능");
    expect(label.textContent).toBe("응답 가능");
  });

  it("explicit aria-label wins over label text", async () => {
    const el = document.createElement("nds-online-indicator");
    el.setAttribute("label", "응답 가능");
    el.setAttribute("aria-label", "상담사가 응답 가능한 상태");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-online-indicator")!;
    expect(root.getAttribute("aria-label")).toBe("상담사가 응답 가능한 상태");
  });

  it("maps size to CSS variable and ignores invalid size", async () => {
    const el = document.createElement("nds-online-indicator");
    el.setAttribute("size", "12");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-online-indicator") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-presence-size")).toBe("12px");

    el.setAttribute("size", "-1");
    await flush();
    expect(root.style.getPropertyValue("--nds-presence-size")).toBe("8px");
  });

  it("forwards title and aria-labelledby to root", async () => {
    const el = document.createElement("nds-online-indicator");
    el.setAttribute("title", "상태");
    el.setAttribute("aria-labelledby", "presence-label");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-online-indicator")!;
    expect(root.getAttribute("title")).toBe("상태");
    expect(root.getAttribute("aria-labelledby")).toBe("presence-label");
  });
});
