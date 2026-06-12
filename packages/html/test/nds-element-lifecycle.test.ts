/**
 * NdsElement — mount/update 라이프사이클 계약.
 *
 * mount() 는 첫 연결 시 정확히 1회만 호출된다 — disconnect 후 재연결돼도
 * 다시 호출되지 않는다(DOM 골격 재생성 = input 포커스 유실 footgun 의 구조적 차단).
 * update() 는 연결 시마다/attr 변경 시마다 스케줄된다.
 */

import { describe, expect, it } from "vitest";
import { NdsElement, define } from "../src/base/nds-element.js";

async function flush() {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
}

class LifecycleProbe extends NdsElement {
  static elementName = "test-lifecycle-probe";
  static get observedAttributes(): readonly string[] {
    return ["tone"];
  }
  mountCalls = 0;
  updateCalls = 0;

  protected override mount(): void {
    this.mountCalls += 1;
    const field = document.createElement("input");
    field.className = "probe-field";
    this.appendChild(field);
  }

  protected update(): void {
    this.updateCalls += 1;
    this.dataset.tone = this.attr("tone", "default");
  }
}
define(LifecycleProbe);

describe("NdsElement — mount once contract", () => {
  it("calls mount() exactly once on first connect and builds skeleton", async () => {
    const el = document.createElement("test-lifecycle-probe") as LifecycleProbe;
    document.body.appendChild(el);
    await flush();
    expect(el.mountCalls).toBe(1);
    expect(el.querySelector("input.probe-field")).not.toBeNull();
    expect(el.updateCalls).toBeGreaterThanOrEqual(1);
  });

  it("does NOT re-run mount() on disconnect → reconnect (skeleton node identity preserved)", async () => {
    const el = document.createElement("test-lifecycle-probe") as LifecycleProbe;
    document.body.appendChild(el);
    await flush();
    const field = el.querySelector("input.probe-field");

    el.remove();
    document.body.appendChild(el);
    await flush();

    expect(el.mountCalls).toBe(1);
    expect(el.querySelector("input.probe-field")).toBe(field);
  });

  it("attribute change triggers update() without touching skeleton", async () => {
    const el = document.createElement("test-lifecycle-probe") as LifecycleProbe;
    document.body.appendChild(el);
    await flush();
    const field = el.querySelector("input.probe-field");
    const before = el.updateCalls;

    el.setAttribute("tone", "loud");
    await flush();

    expect(el.updateCalls).toBe(before + 1);
    expect(el.dataset.tone).toBe("loud");
    expect(el.mountCalls).toBe(1);
    expect(el.querySelector("input.probe-field")).toBe(field);
  });
});
