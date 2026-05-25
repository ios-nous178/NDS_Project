/**
 * nds-divider DOM 구조가 React Divider 가 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsDivider } from "../src/components/nds-divider.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-divider — DOM parity with React Divider", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-divider")).toBe(NdsDivider);
  });

  it("renders inner hr with default horizontal orientation", async () => {
    const el = document.createElement("nds-divider");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("hr") as HTMLHRElement;
    expect(inner.classList.contains("nds-divider")).toBe(true);
    expect(inner.dataset.slot).toBe("root");
    expect(inner.dataset.orientation).toBe("horizontal");
    expect(inner.getAttribute("role")).toBe("separator");
    expect(inner.getAttribute("aria-orientation")).toBe("horizontal");
    expect(el.style.display).toBe("contents");
  });

  it("supports vertical orientation", async () => {
    const el = document.createElement("nds-divider");
    el.setAttribute("orientation", "vertical");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("hr")!;
    expect(inner.dataset.orientation).toBe("vertical");
    expect(inner.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("falls back to horizontal for invalid orientation", async () => {
    const el = document.createElement("nds-divider");
    el.setAttribute("orientation", "diagonal");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("hr")!;
    expect(inner.dataset.orientation).toBe("horizontal");
  });

  it("maps thickness, spacing, and color attributes to CSS variables", async () => {
    const el = document.createElement("nds-divider");
    el.setAttribute("thickness", "2");
    el.setAttribute("spacing", "12");
    el.setAttribute("color", "var(--semantic-border-normal-default)");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("hr") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-divider-thickness")).toBe("2px");
    expect(inner.style.getPropertyValue("--nds-divider-spacing")).toBe("12px");
    expect(inner.style.getPropertyValue("--nds-divider-color")).toBe(
      "var(--semantic-border-normal-default)",
    );
  });

  it("removes CSS vars when attributes are removed", async () => {
    const el = document.createElement("nds-divider");
    el.setAttribute("thickness", "2");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("hr") as HTMLElement;
    expect(inner.style.getPropertyValue("--nds-divider-thickness")).toBe("2px");
    el.removeAttribute("thickness");
    await flush();
    expect(inner.style.getPropertyValue("--nds-divider-thickness")).toBe("");
  });

  it("forwards a11y text attributes to the inner hr", async () => {
    const el = document.createElement("nds-divider");
    el.setAttribute("aria-label", "섹션 구분");
    el.setAttribute("title", "구분선");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("hr")!;
    expect(inner.getAttribute("aria-label")).toBe("섹션 구분");
    expect(inner.getAttribute("title")).toBe("구분선");
  });
});
