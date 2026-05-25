/**
 * nds-avatar DOM 구조가 React Avatar 가 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsAvatar } from "../src/components/nds-avatar.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-avatar — DOM parity with React Avatar", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-avatar")).toBe(NdsAvatar);
  });

  it("renders root with default md sizing and default icon fallback", async () => {
    const el = document.createElement("nds-avatar");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar") as HTMLElement;
    const fallback = el.querySelector(".nds-avatar__fallback") as HTMLElement;
    const svg = fallback.querySelector("svg")!;

    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.size).toBe("md");
    expect(root.style.getPropertyValue("--nds-avatar-size")).toBe("40px");
    expect(root.style.getPropertyValue("--nds-avatar-font-size")).toBe("14px");
    expect(fallback).toBeTruthy();
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(el.style.display).toBe("contents");
  });

  it("renders image when src is present", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("src", "/profile.png");
    el.setAttribute("alt", "홍길동");
    document.body.appendChild(el);
    await flush();

    const img = el.querySelector("img")!;
    expect(img.classList.contains("nds-avatar__image")).toBe(true);
    expect(img.dataset.slot).toBe("image");
    expect(img.getAttribute("src")).toBe("/profile.png");
    expect(img.getAttribute("alt")).toBe("홍길동");
  });

  it("falls back to initials from name", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("name", "Hong Gil");
    document.body.appendChild(el);
    await flush();

    const fallback = el.querySelector(".nds-avatar__fallback")!;
    expect(fallback.textContent).toBe("HG");
  });

  it("uses single-character initial for a single name", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("name", "길동");
    document.body.appendChild(el);
    await flush();

    const fallback = el.querySelector(".nds-avatar__fallback")!;
    expect(fallback.textContent).toBe("길");
  });

  it("uses explicit fallback text before name", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("name", "Hong Gil");
    el.setAttribute("fallback", "상");
    document.body.appendChild(el);
    await flush();

    const fallback = el.querySelector(".nds-avatar__fallback")!;
    expect(fallback.textContent).toBe("상");
  });

  it("maps size variants to CSS variables", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("size", "xl");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar") as HTMLElement;
    expect(root.dataset.size).toBe("xl");
    expect(root.style.getPropertyValue("--nds-avatar-size")).toBe("64px");
    expect(root.style.getPropertyValue("--nds-avatar-font-size")).toBe("20px");

    el.setAttribute("size", "xs");
    await flush();
    expect(root.dataset.size).toBe("xs");
    expect(root.style.getPropertyValue("--nds-avatar-size")).toBe("24px");
    expect(root.style.getPropertyValue("--nds-avatar-font-size")).toBe("10px");
  });

  it("falls back to md for invalid size", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("size", "huge");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar") as HTMLElement;
    expect(root.dataset.size).toBe("md");
    expect(root.style.getPropertyValue("--nds-avatar-size")).toBe("40px");
  });

  it("switches to fallback after image error", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("src", "/broken.png");
    el.setAttribute("name", "Hong Gil");
    document.body.appendChild(el);
    await flush();

    const img = el.querySelector("img")!;
    img.dispatchEvent(new Event("error"));
    await flush();

    expect(el.querySelector("img")).toBeNull();
    expect(el.querySelector(".nds-avatar__fallback")?.textContent).toBe("HG");
  });

  it("forwards a11y text attributes to root", async () => {
    const el = document.createElement("nds-avatar");
    el.setAttribute("aria-label", "상담사 프로필");
    el.setAttribute("title", "프로필");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar")!;
    expect(root.getAttribute("aria-label")).toBe("상담사 프로필");
    expect(root.getAttribute("title")).toBe("프로필");
  });
});
