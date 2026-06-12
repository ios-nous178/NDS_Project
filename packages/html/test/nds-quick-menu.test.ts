/**
 * nds-quick-menu DOM 구조 + 클릭/이벤트 동작 검증 (React QuickMenu 미러).
 */

import { describe, expect, it } from "vitest";
import { NdsQuickMenu } from "../src/components/nds-quick-menu.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

// icon = inline SVG 마크업 (find_icon 결과). 이름/이모지가 아니라 innerHTML 로 주입된다.
const ICON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" /></svg>';
const ITEMS = JSON.stringify([
  { key: "counsel", label: "바로 상담하기", icon: ICON_SVG },
  { key: "search", label: "상담사 찾기", icon: ICON_SVG },
  { key: "room", label: "내 상담방", icon: ICON_SVG },
]);

describe("nds-quick-menu — DOM parity with React QuickMenu", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-quick-menu")).toBe(NdsQuickMenu);
  });

  it("renders header, items and TOP button", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", ITEMS);
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-quickmenu") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.tagName).toBe("NAV");
    expect(root.getAttribute("aria-label")).toBe("퀵메뉴");
    expect(el.style.display).toBe("contents");

    // header
    expect(root.querySelector(".nds-quickmenu__heading")!.textContent).toBe("QUICK\nMENU");
    expect(root.querySelector(".nds-quickmenu__divider")).not.toBeNull();

    // items
    const items = root.querySelectorAll<HTMLButtonElement>(".nds-quickmenu__item");
    expect(items).toHaveLength(3);
    expect(items[0].dataset.key).toBe("counsel");
    expect(items[0].type).toBe("button");
    // icon = innerHTML 로 주입된 inline SVG → svg 엘리먼트로 렌더
    expect(items[0].querySelector(".nds-quickmenu__circle .nds-quickmenu__icon svg")).not.toBeNull();
    expect(items[0].querySelector(".nds-quickmenu__label")!.textContent).toBe("바로 상담하기");

    // TOP
    const top = root.querySelector(".nds-quickmenu__top") as HTMLButtonElement;
    expect(top).not.toBeNull();
    expect(top.querySelector(".nds-quickmenu__top-icon svg")).not.toBeNull();
    expect(top.querySelector(".nds-quickmenu__top-label")!.textContent).toBe("TOP");
  });

  it("emits quick-menu-item with key on item click", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", ITEMS);
    document.body.appendChild(el);
    await flush();

    const keys: string[] = [];
    el.addEventListener("quick-menu-item", (e) => {
      keys.push((e as CustomEvent<{ key: string }>).detail.key);
    });

    const items = el.querySelectorAll<HTMLButtonElement>(".nds-quickmenu__item");
    items[0].click();
    items[2].click();
    expect(keys).toEqual(["counsel", "room"]);
  });

  it("emits quick-menu-top on TOP click", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", ITEMS);
    document.body.appendChild(el);
    await flush();

    let fired = 0;
    el.addEventListener("quick-menu-top", () => {
      fired += 1;
    });
    (el.querySelector(".nds-quickmenu__top") as HTMLButtonElement).click();
    expect(fired).toBe(1);
  });

  it("fixed attribute sets data-fixed on root, toggles off when removed", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", ITEMS);
    el.setAttribute("fixed", "");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-quickmenu") as HTMLElement;
    expect(root.dataset.fixed).toBe("");

    el.removeAttribute("fixed");
    await flush();
    expect(root.dataset.fixed).toBeUndefined();
  });

  it("show-top=false omits the TOP button", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", ITEMS);
    el.setAttribute("show-top", "false");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-quickmenu__top")).toBeNull();
  });

  it("showLabel:false on an item omits its label and sets aria-label", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute(
      "items",
      JSON.stringify([{ key: "counsel", label: "바로 상담하기", icon: ICON_SVG, showLabel: false }]),
    );
    document.body.appendChild(el);
    await flush();
    const item = el.querySelector(".nds-quickmenu__item") as HTMLButtonElement;
    expect(item.querySelector(".nds-quickmenu__label")).toBeNull();
    expect(item.getAttribute("aria-label")).toBe("바로 상담하기");
  });

  it("custom heading / top-label / aria-label override defaults", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", ITEMS);
    el.setAttribute("heading", "빠른메뉴");
    el.setAttribute("top-label", "위로");
    el.setAttribute("aria-label", "퀵 내비");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-quickmenu") as HTMLElement;
    expect(root.querySelector(".nds-quickmenu__heading")!.textContent).toBe("빠른메뉴");
    expect(root.querySelector(".nds-quickmenu__top-label")!.textContent).toBe("위로");
    expect(root.getAttribute("aria-label")).toBe("퀵 내비");
  });

  it("invalid items JSON renders no items", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", "not-json");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelectorAll(".nds-quickmenu__item")).toHaveLength(0);
  });

  it("item without key is dropped", async () => {
    const el = document.createElement("nds-quick-menu");
    el.setAttribute("items", JSON.stringify([{ label: "키없음", icon: ICON_SVG }]));
    document.body.appendChild(el);
    await flush();
    expect(el.querySelectorAll(".nds-quickmenu__item")).toHaveLength(0);
  });
});
