/**
 * nds-avatar-group DOM 구조가 React AvatarGroup 가 만드는 DOM 과 동일한지 검사.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-avatar.js";
import { NdsAvatarGroup } from "../src/components/nds-avatar-group.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

const ITEMS_JSON = JSON.stringify([
  { name: "홍길동" },
  { name: "이몽룡", src: "/a.png" },
  { name: "성춘향" },
  { name: "임꺽정" },
  { name: "춘향" },
]);

describe("nds-avatar-group — DOM parity with React AvatarGroup", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-avatar-group")).toBe(NdsAvatarGroup);
  });

  it("renders avatars from JSON items with md size default", async () => {
    const el = document.createElement("nds-avatar-group");
    el.setAttribute("items", ITEMS_JSON);
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar-group") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.style.getPropertyValue("--nds-avatar-group-overlap")).toBe("16px");
    expect(root.style.getPropertyValue("--nds-avatar-group-more-size")).toBe("48px");
    expect(root.style.getPropertyValue("--nds-avatar-group-more-font")).toBe("20px");
    expect(root.getAttribute("aria-label")).toBe("총 5명");

    const avatars = root.querySelectorAll("nds-avatar");
    expect(avatars).toHaveLength(4);
    avatars.forEach((a) => expect(a.classList.contains("nds-avatar-group__item")).toBe(true));

    const more = root.querySelector(".nds-avatar-group__more") as HTMLElement;
    expect(more.textContent).toBe("+1");
    expect(more.getAttribute("aria-label")).toBe("외 1명");
  });

  it("respects max attribute", async () => {
    const el = document.createElement("nds-avatar-group");
    el.setAttribute("items", ITEMS_JSON);
    el.setAttribute("max", "2");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar-group") as HTMLElement;
    expect(root.querySelectorAll("nds-avatar")).toHaveLength(2);
    const more = root.querySelector(".nds-avatar-group__more")!;
    expect(more.textContent).toBe("+3");
  });

  it("omits the +N more span when nothing overflows", async () => {
    const el = document.createElement("nds-avatar-group");
    el.setAttribute("items", JSON.stringify([{ name: "홍" }, { name: "이" }]));
    el.setAttribute("max", "4");
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-avatar-group__more")).toBeNull();
  });

  it("size variants tune overlap / more dimensions", async () => {
    const el = document.createElement("nds-avatar-group");
    el.setAttribute("items", ITEMS_JSON);
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar-group") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-avatar-group-overlap")).toBe("22px");
    expect(root.style.getPropertyValue("--nds-avatar-group-more-size")).toBe("64px");
    expect(root.style.getPropertyValue("--nds-avatar-group-more-font")).toBe("26px");

    const avatar = root.querySelector("nds-avatar")!;
    expect(avatar.getAttribute("size")).toBe("lg");
    expect(avatar.getAttribute("shape")).toBe("circle");
  });

  it("overlap attribute wins over size default", async () => {
    const el = document.createElement("nds-avatar-group");
    el.setAttribute("items", ITEMS_JSON);
    el.setAttribute("overlap", "20");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar-group") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-avatar-group-overlap")).toBe("20px");
  });

  it("falls back to child <nds-avatar> when items attribute is absent", async () => {
    const el = document.createElement("nds-avatar-group");
    const a1 = document.createElement("nds-avatar");
    a1.setAttribute("name", "A");
    const a2 = document.createElement("nds-avatar");
    a2.setAttribute("name", "B");
    a2.setAttribute("src", "/b.png");
    el.append(a1, a2);
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar-group") as HTMLElement;
    const avatars = root.querySelectorAll("nds-avatar");
    expect(avatars).toHaveLength(2);
    expect(avatars[0].getAttribute("name")).toBe("A");
    expect(avatars[1].getAttribute("src")).toBe("/b.png");
  });

  it("explicit aria-label overrides default count label", async () => {
    const el = document.createElement("nds-avatar-group");
    el.setAttribute("items", ITEMS_JSON);
    el.setAttribute("aria-label", "참여자 5명");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-avatar-group")!;
    expect(root.getAttribute("aria-label")).toBe("참여자 5명");
  });
});
