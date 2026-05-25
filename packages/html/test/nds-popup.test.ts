/**
 * nds-popup DOM 구조 + open/close + 액션 이벤트 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsPopup } from "../src/components/nds-popup.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-popup — DOM parity with React Popup", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-popup")).toBe(NdsPopup);
  });

  it("renders hidden root when closed", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("title", "x");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-popup__root") as HTMLElement;
    expect(root.hidden).toBe(true);
    expect(root.dataset.open).toBe("false");
    expect(el.style.display).toBe("contents");
  });

  it("renders overlay + content with title/description when open", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    el.setAttribute("title", "삭제하시겠습니까?");
    el.setAttribute("description", "복구할 수 없습니다.");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-popup__root") as HTMLElement;
    expect(root.hidden).toBe(false);
    expect(root.dataset.open).toBe("true");

    const content = root.querySelector(".nds-popup__content") as HTMLElement;
    expect(content.getAttribute("role")).toBe("alertdialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.querySelector(".nds-popup__title")!.textContent).toBe("삭제하시겠습니까?");
    expect(content.querySelector(".nds-popup__description")!.textContent).toBe(
      "복구할 수 없습니다.",
    );
  });

  it("renders confirm-only actions when show-cancel absent", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    document.body.appendChild(el);
    await flush();

    const actions = el.querySelector(".nds-popup__actions") as HTMLElement;
    expect(actions.dataset.single).toBe("true");
    expect(actions.querySelectorAll("button")).toHaveLength(1);
    expect(actions.querySelector(".nds-popup__btn--confirm")!.textContent).toBe("확인");
  });

  it("renders cancel + confirm when show-cancel present", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    el.setAttribute("show-cancel", "");
    el.setAttribute("cancel-text", "그만하기");
    el.setAttribute("confirm-text", "삭제");
    document.body.appendChild(el);
    await flush();

    const actions = el.querySelector(".nds-popup__actions") as HTMLElement;
    expect(actions.dataset.single).toBe("false");
    const buttons = actions.querySelectorAll("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toBe("그만하기");
    expect(buttons[1].textContent).toBe("삭제");
  });

  it("confirm button dispatches popup-confirm without closing", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    document.body.appendChild(el);
    await flush();

    let confirms = 0;
    let closes = 0;
    el.addEventListener("popup-confirm", () => confirms++);
    el.addEventListener("popup-close", () => closes++);
    (el.querySelector(".nds-popup__btn--confirm") as HTMLButtonElement).click();
    expect(confirms).toBe(1);
    expect(closes).toBe(0);
  });

  it("cancel button dispatches cancel + close", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    el.setAttribute("show-cancel", "");
    document.body.appendChild(el);
    await flush();

    const events: string[] = [];
    el.addEventListener("popup-cancel", () => events.push("cancel"));
    el.addEventListener("popup-close", () => events.push("close"));
    (el.querySelector(".nds-popup__btn--cancel") as HTMLButtonElement).click();
    expect(events).toEqual(["cancel", "close"]);
    expect(el.hasAttribute("open")).toBe(false);
  });

  it("overlay click closes by default and respects no-mask-close", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    document.body.appendChild(el);
    await flush();

    let closes = 0;
    el.addEventListener("popup-close", () => closes++);

    (el.querySelector(".nds-popup__overlay") as HTMLDivElement).click();
    expect(closes).toBe(1);
    expect(el.hasAttribute("open")).toBe(false);

    el.setAttribute("open", "");
    el.setAttribute("no-mask-close", "");
    await flush();
    (el.querySelector(".nds-popup__overlay") as HTMLDivElement).click();
    expect(closes).toBe(1);
    expect(el.hasAttribute("open")).toBe(true);
  });

  it("Escape key closes when open", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    document.body.appendChild(el);
    await flush();

    let closes = 0;
    el.addEventListener("popup-close", () => closes++);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(closes).toBe(1);
    expect(el.hasAttribute("open")).toBe(false);
  });

  it("max-width attribute applies CSS variable", async () => {
    const el = document.createElement("nds-popup");
    el.setAttribute("open", "");
    el.setAttribute("max-width", "320");
    document.body.appendChild(el);
    await flush();
    const content = el.querySelector(".nds-popup__content") as HTMLElement;
    expect(content.style.getPropertyValue("--nds-popup-max-width")).toBe("320px");
  });
});
