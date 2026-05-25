import { describe, expect, it, vi } from "vitest";
import { NdsSnackbar } from "../src/components/nds-snackbar.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-snackbar", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-snackbar")).toBe(NdsSnackbar);
  });

  it("renders variant icon, title, description, and action", async () => {
    const el = document.createElement("nds-snackbar");
    el.setAttribute("variant", "success");
    el.setAttribute("snackbar-title", "저장됨");
    el.setAttribute("description", "변경사항이 반영되었습니다");
    el.setAttribute("action-label", "보기");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-snackbar") as HTMLElement;
    expect(root.dataset.variant).toBe("success");
    expect(root.dataset.hasDesc).toBe("true");
    expect(root.style.getPropertyValue("--nds-snackbar-bg")).toBe(
      "var(--semantic-bg-status-success)",
    );
    expect(el.querySelector(".nds-snackbar__icon svg")).toBeTruthy();
    expect(el.querySelector(".nds-snackbar__title")?.textContent).toBe("저장됨");
    expect(el.querySelector(".nds-snackbar__desc")?.textContent).toBe("변경사항이 반영되었습니다");
    expect(el.querySelector(".nds-snackbar__action")?.textContent).toBe("보기");
    expect(el.style.display).toBe("contents");
  });

  it("can hide icon and forwards a11y attrs", async () => {
    const el = document.createElement("nds-snackbar");
    el.setAttribute("hide-icon", "");
    el.setAttribute("aria-label", "알림");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-snackbar") as HTMLElement;
    expect(el.querySelector(".nds-snackbar__icon")).toBeNull();
    expect(root.getAttribute("aria-label")).toBe("알림");
  });

  it("dispatches action and close events", async () => {
    const el = document.createElement("nds-snackbar");
    const action = vi.fn();
    const close = vi.fn();
    el.setAttribute("action-label", "실행");
    el.setAttribute("closable", "");
    el.addEventListener("nds-snackbar-action", action);
    el.addEventListener("nds-snackbar-close", close);
    document.body.appendChild(el);
    await flush();

    (el.querySelector(".nds-snackbar__action") as HTMLButtonElement).click();
    expect(action).toHaveBeenCalledTimes(1);

    (el.querySelector(".nds-snackbar__close") as HTMLButtonElement).click();
    expect(close).toHaveBeenCalledTimes(1);
    expect(document.body.contains(el)).toBe(false);
  });
});
