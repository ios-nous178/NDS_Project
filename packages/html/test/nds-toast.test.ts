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
    el.show({ message: "두번째", variant: "success", duration: 0 });
    el.show("세번째", { variant: "info", duration: 0 });

    const items = document.body.querySelectorAll(".nds-toast__item");
    expect(items).toHaveLength(2);
    expect(items[0]?.querySelector(".nds-toast__message")?.textContent).toBe("두번째");
    expect((items[0] as HTMLElement).dataset.variant).toBe("success");
    expect(items[1]?.querySelector(".nds-toast__message")?.textContent).toBe("세번째");
  });

  it("supports window nds-toast-show and nds-toast-dismiss events", async () => {
    const el = document.createElement("nds-toast");
    document.body.appendChild(el);
    await flush();

    window.dispatchEvent(
      new CustomEvent("nds-toast-show", {
        detail: { id: "save", message: "저장되었습니다", variant: "info", duration: 0 },
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

  it("dispatches action event and dismisses when action is clicked", async () => {
    const el = document.createElement("nds-toast");
    const handler = vi.fn();
    el.addEventListener("nds-toast-action", handler);
    document.body.appendChild(el);
    await flush();

    el.show({ id: "undo", message: "삭제됨", actionLabel: "되돌리기", duration: 0 });
    (document.body.querySelector(".nds-toast__action") as HTMLButtonElement).click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0].detail.id).toBe("undo");
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
