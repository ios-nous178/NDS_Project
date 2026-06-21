/**
 * nds-dim DOM 구조가 React Dim 이 만드는 DOM 과 동일한지 + 백드롭 클릭 이벤트를 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsDim } from "../src/components/nds-dim.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-dim — DOM parity with React Dim", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-dim")).toBe(NdsDim);
  });

  it("renders inner backdrop div with default type · aria-hidden", async () => {
    const el = document.createElement("nds-dim");
    document.body.appendChild(el);
    await flush();
    const inner = el.querySelector(".nds-dim") as HTMLElement;
    expect(inner).toBeTruthy();
    expect(inner.dataset.slot).toBe("root");
    expect(inner.dataset.type).toBe("default");
    expect(inner.dataset.animated).toBe("true");
    expect(inner.getAttribute("aria-hidden")).toBe("true");
    el.remove();
  });

  it("reflects type attribute to data-type", async () => {
    const el = document.createElement("nds-dim");
    el.setAttribute("type", "strong");
    document.body.appendChild(el);
    await flush();
    const inner = el.querySelector(".nds-dim") as HTMLElement;
    expect(inner.dataset.type).toBe("strong");
    el.remove();
  });

  it("animated=false 면 data-animated 가 없다", async () => {
    const el = document.createElement("nds-dim");
    el.setAttribute("animated", "false");
    document.body.appendChild(el);
    await flush();
    const inner = el.querySelector(".nds-dim") as HTMLElement;
    expect(inner.dataset.animated).toBeUndefined();
    el.remove();
  });

  it("백드롭 클릭 시 nds-dim-close 를 디스패치한다", async () => {
    const el = document.createElement("nds-dim");
    document.body.appendChild(el);
    await flush();
    let closed = false;
    el.addEventListener("nds-dim-close", () => {
      closed = true;
    });
    (el.querySelector(".nds-dim") as HTMLElement).click();
    expect(closed).toBe(true);
    el.remove();
  });
});
