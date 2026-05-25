/**
 * nds-chat-bubble DOM 구조 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsChatBubble } from "../src/components/nds-chat-bubble.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-chat-bubble — DOM parity with React ChatBubble", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-chat-bubble")).toBe(NdsChatBubble);
  });

  it("renders them-side row with avatar initials and bubble content", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "them");
    el.setAttribute("name", "홍길동");
    el.textContent = "안녕하세요";
    document.body.appendChild(el);
    await flush();

    const row = el.querySelector(".nds-chat-bubble__row") as HTMLElement;
    expect(row.dataset.slot).toBe("row");
    expect(row.dataset.role).toBe("them");
    expect(row.dataset.group).toBe("single");

    const avatar = row.querySelector(".nds-chat-bubble__avatar") as HTMLElement;
    expect(avatar).not.toBeNull();
    expect(avatar.textContent).toBe("홍");

    expect(row.querySelector(".nds-chat-bubble__name")!.textContent).toBe("홍길동");
    expect(row.querySelector(".nds-chat-bubble__bubble")!.textContent).toBe("안녕하세요");
    expect(el.style.display).toBe("contents");
  });

  it("uses avatar-src image when provided", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "them");
    el.setAttribute("name", "홍길동");
    el.setAttribute("avatar-src", "/a.png");
    el.textContent = "x";
    document.body.appendChild(el);
    await flush();

    const img = el.querySelector(".nds-chat-bubble__avatar img") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("/a.png");
  });

  it("me-side row hides avatar and renders bubble only", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "me");
    el.textContent = "좋아요!";
    document.body.appendChild(el);
    await flush();

    const row = el.querySelector(".nds-chat-bubble__row") as HTMLElement;
    expect(row.dataset.role).toBe("me");
    expect(row.querySelector(".nds-chat-bubble__avatar")).toBeNull();
    expect(row.querySelector(".nds-chat-bubble__bubble")!.textContent).toBe("좋아요!");
  });

  it("renders time only for single/last group positions", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "me");
    el.setAttribute("time", "오후 3:24");
    el.setAttribute("group", "middle");
    el.textContent = "x";
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-chat-bubble__time")).toBeNull();

    el.setAttribute("group", "last");
    await flush();
    expect(el.querySelector(".nds-chat-bubble__time")!.textContent).toBe("오후 3:24");
  });

  it("renders read indicator only for me + read", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "me");
    el.setAttribute("read", "");
    el.setAttribute("time", "오후 3:25");
    el.textContent = "x";
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-chat-bubble__read")!.textContent).toBe("읽음");

    el.setAttribute("role", "them");
    el.setAttribute("name", "홍");
    await flush();
    expect(el.querySelector(".nds-chat-bubble__read")).toBeNull();
  });

  it("them group=first shows name; middle hides it", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "them");
    el.setAttribute("name", "홍길동");
    el.setAttribute("group", "first");
    el.textContent = "x";
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-chat-bubble__name")!.textContent).toBe("홍길동");

    el.setAttribute("group", "middle");
    await flush();
    expect(el.querySelector(".nds-chat-bubble__name")).toBeNull();
  });

  it("avatar data-hidden flag for middle group", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "them");
    el.setAttribute("name", "홍");
    el.setAttribute("group", "middle");
    el.textContent = "x";
    document.body.appendChild(el);
    await flush();
    const avatar = el.querySelector(".nds-chat-bubble__avatar") as HTMLElement;
    expect(avatar.dataset.hidden).toBe("true");
  });

  it("message attribute overrides children content", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "me");
    el.setAttribute("message", "안녕");
    el.textContent = "ignored";
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-chat-bubble__bubble")!.textContent).toBe("안녕");
  });

  it("falls back to them/single for unknown role/group", async () => {
    const el = document.createElement("nds-chat-bubble");
    el.setAttribute("role", "bot");
    el.setAttribute("group", "extreme");
    el.textContent = "x";
    document.body.appendChild(el);
    await flush();
    const row = el.querySelector(".nds-chat-bubble__row") as HTMLElement;
    expect(row.dataset.role).toBe("them");
    expect(row.dataset.group).toBe("single");
  });
});
