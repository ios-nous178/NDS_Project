/**
 * nds-spinner DOM 구조가 React Spinner 가 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsSpinner } from "../src/components/nds-spinner.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-spinner — DOM parity with React Spinner", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-spinner")).toBe(NdsSpinner);
  });

  it("renders inner span with status semantics and default size", async () => {
    const el = document.createElement("nds-spinner");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("span") as HTMLElement;
    const svg = inner.querySelector("svg")!;
    const circle = inner.querySelector("circle")!;

    expect(inner.classList.contains("nds-spinner")).toBe(true);
    expect(inner.dataset.slot).toBe("root");
    expect(inner.getAttribute("role")).toBe("status");
    expect(inner.getAttribute("aria-live")).toBe("polite");
    expect(inner.getAttribute("aria-label")).toBe("로딩 중");
    expect(inner.style.getPropertyValue("--nds-spinner-size")).toBe("24px");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("fill")).toBe("none");
    expect(circle.getAttribute("cx")).toBe("12");
    expect(circle.getAttribute("cy")).toBe("12");
    expect(circle.getAttribute("r")).toBe("10");
    expect(el.style.display).toBe("contents");
  });

  it("maps named sizes to px variables", async () => {
    const el = document.createElement("nds-spinner");
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("span") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-spinner-size")).toBe("32px");

    el.setAttribute("size", "sm");
    await flush();
    expect(inner.style.getPropertyValue("--nds-spinner-size")).toBe("16px");
  });

  it("accepts numeric size values", async () => {
    const el = document.createElement("nds-spinner");
    el.setAttribute("size", "40");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("span") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-spinner-size")).toBe("40px");
  });

  it("falls back to md for invalid size", async () => {
    const el = document.createElement("nds-spinner");
    el.setAttribute("size", "huge");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("span") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-spinner-size")).toBe("24px");
  });

  it("maps color and label attributes", async () => {
    const el = document.createElement("nds-spinner");
    el.setAttribute("color", "var(--semantic-text-status-success)");
    el.setAttribute("label", "저장 중");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("span") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-spinner-color")).toBe(
      "var(--semantic-text-status-success)",
    );
    expect(inner.getAttribute("aria-label")).toBe("저장 중");
  });

  it("removes color variable when color attribute is removed", async () => {
    const el = document.createElement("nds-spinner");
    el.setAttribute("color", "red");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("span") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-spinner-color")).toBe("red");
    el.removeAttribute("color");
    await flush();
    expect(inner.style.getPropertyValue("--nds-spinner-color")).toBe("");
  });

  it("forwards title to the inner span", async () => {
    const el = document.createElement("nds-spinner");
    el.setAttribute("title", "로딩 표시");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("span")!;
    expect(inner.getAttribute("title")).toBe("로딩 표시");
  });
});
