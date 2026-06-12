import { afterEach, describe, expect, it, vi } from "vitest";
import { NdsToast } from "../src/components/nds-toast.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-toast", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.querySelectorAll(".nds-toast__viewport").forEach((node) => node.remove());
  });

  it("registers as a custom element", () => {
    expect(customElements.get("nds-toast")).toBe(NdsToast);
  });

  it("portals viewport into document.body", async () => {
    const el = document.createElement("nds-toast");
    document.body.appendChild(el);
    await flush();

    const viewport = document.body.querySelector(".nds-toast__viewport") as HTMLElement;
    expect(viewport).toBeTruthy();
    expect(viewport.parentElement).toBe(document.body);
    expect(viewport.dataset.slot).toBe("viewport");
    expect(viewport.dataset.position).toBe("bottom");
    expect(viewport.getAttribute("aria-live")).toBe("polite");
    expect(el.style.display).toBe("contents");
  });

  it("shows toast through imperative API and caps max count", async () => {
    const el = document.createElement("nds-toast");
    el.setAttribute("max-count", "2");
    document.body.appendChild(el);
    await flush();

    el.show("첫번째", { duration: 0 });
    el.show({ message: "두번째", duration: 0 });
    el.show("세번째", { duration: 0 });

    const items = document.body.querySelectorAll(".nds-toast__item");
    expect(items).toHaveLength(2);
    expect(items[0]?.querySelector(".nds-toast__message")?.textContent).toBe("두번째");
    expect((items[0] as HTMLElement).role).toBe("status");
    expect(items[1]?.querySelector(".nds-toast__message")?.textContent).toBe("세번째");
  });

  it("supports top position (PC · pill)", async () => {
    const el = document.createElement("nds-toast");
    el.setAttribute("position", "top");
    document.body.appendChild(el);
    await flush();

    el.show("상단에 표시됩니다", { duration: 0 });

    const viewport = document.body.querySelector(".nds-toast__viewport") as HTMLElement;
    expect(viewport.dataset.position).toBe("top");
    const item = document.body.querySelector(".nds-toast__item") as HTMLElement;
    expect(item.role).toBe("status");
  });

  it("defaults to single toast — new replaces existing (max-count 1)", async () => {
    const el = document.createElement("nds-toast");
    document.body.appendChild(el);
    await flush();

    el.show("저장 완료", { duration: 0 });
    el.show("전송 완료", { duration: 0 });

    const items = document.body.querySelectorAll(".nds-toast__item");
    expect(items).toHaveLength(1);
    expect(items[0]?.querySelector(".nds-toast__message")?.textContent).toBe("전송 완료");
  });

  it("falls back to default position for unknown value", async () => {
    const el = document.createElement("nds-toast");
    el.setAttribute("position", "left");
    document.body.appendChild(el);
    await flush();

    el.show("메시지", { duration: 0 });

    const viewport = document.body.querySelector(".nds-toast__viewport") as HTMLElement;
    expect(viewport.dataset.position).toBe("bottom");
  });

  it("supports window nds-toast-show and nds-toast-dismiss events", async () => {
    const el = document.createElement("nds-toast");
    document.body.appendChild(el);
    await flush();

    window.dispatchEvent(
      new CustomEvent("nds-toast-show", {
        detail: { id: "save", message: "저장되었습니다", duration: 0 },
      }),
    );
    expect(document.body.querySelector(".nds-toast__message")?.textContent).toBe("저장되었습니다");

    window.dispatchEvent(new CustomEvent("nds-toast-dismiss", { detail: { id: "save" } }));
    expect(document.body.querySelector(".nds-toast__item")).toBeNull();
  });

  it("auto dismisses after duration", async () => {
    const el = document.createElement("nds-toast");
    document.body.appendChild(el);
    await flush();
    vi.useFakeTimers();

    el.show("잠시 표시", { duration: 100 });
    expect(document.body.querySelector(".nds-toast__item")).toBeTruthy();

    vi.advanceTimersByTime(100);
    expect(document.body.querySelector(".nds-toast__item")).toBeNull();
  });

  it("removes portal on disconnect", async () => {
    const el = document.createElement("nds-toast");
    document.body.appendChild(el);
    await flush();

    expect(document.body.querySelector(".nds-toast__viewport")).toBeTruthy();
    el.remove();
    expect(document.body.querySelector(".nds-toast__viewport")).toBeNull();
  });
});
