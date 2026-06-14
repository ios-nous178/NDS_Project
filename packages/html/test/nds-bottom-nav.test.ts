/**
 * nds-bottom-nav — react(BottomNav.tsx) 미러. active 좌표화(부모→자식 setActive),
 * active-icon 폴백, badge 토글, active-key 변경 시 재좌표화를 잠근다.
 */

import { describe, expect, it } from "vitest";
import { NdsBottomNav, NdsBottomNavItem } from "../src/components/nds-bottom-nav.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

async function mount(html: string): Promise<HTMLElement> {
  const host = document.createElement("div");
  host.innerHTML = html;
  document.body.appendChild(host);
  await flush();
  await flush();
  return host;
}

const ITEM = (key: string, label: string, opts: { activeIcon?: boolean; badge?: string } = {}) => `
  <nds-bottom-nav-item item-key="${key}" label="${label}" href="/${key}"${
    opts.badge ? ` badge="${opts.badge}"` : ""
  }>
    <svg slot="icon"><circle /></svg>
    ${opts.activeIcon === false ? "" : '<svg slot="active-icon"><rect /></svg>'}
  </nds-bottom-nav-item>`;

describe("nds-bottom-nav", () => {
  it("registers both custom elements", () => {
    expect(customElements.get("nds-bottom-nav")).toBe(NdsBottomNav);
    expect(customElements.get("nds-bottom-nav-item")).toBe(NdsBottomNavItem);
  });

  it("wraps items in a role=tablist nav and keeps item count", async () => {
    const host = await mount(
      `<nds-bottom-nav active-key="home">${ITEM("home", "홈")}${ITEM("my", "내 공간")}</nds-bottom-nav>`,
    );
    const nav = host.querySelector("nds-bottom-nav > nav") as HTMLElement;
    expect(nav).toBeTruthy();
    expect(nav.getAttribute("role")).toBe("tablist");
    expect(nav.classList.contains("nds-bottom-nav")).toBe(true);
    expect(host.querySelectorAll(".nds-bottom-nav__item").length).toBe(2);
  });

  it("marks the matching item active (data-active + aria)", async () => {
    const host = await mount(
      `<nds-bottom-nav active-key="my">${ITEM("home", "홈")}${ITEM("my", "내 공간")}</nds-bottom-nav>`,
    );
    const [home, my] = Array.from(
      host.querySelectorAll<HTMLAnchorElement>(".nds-bottom-nav__item"),
    );
    expect(home.dataset.active).toBeUndefined();
    expect(home.getAttribute("aria-selected")).toBe("false");
    expect(my.dataset.active).toBe("true");
    expect(my.getAttribute("aria-selected")).toBe("true");
    expect(my.getAttribute("aria-current")).toBe("page");
  });

  it("shows active-icon when active, inactive icon otherwise", async () => {
    const host = await mount(
      `<nds-bottom-nav active-key="home">${ITEM("home", "홈")}${ITEM("my", "내 공간")}</nds-bottom-nav>`,
    );
    const [home, my] = Array.from(host.querySelectorAll(".nds-bottom-nav__item"));
    const icons = (item: Element) =>
      Array.from(item.querySelector(".nds-bottom-nav__icon")!.children) as HTMLElement[];
    // home active → active-icon(span[1]) visible, inactive(span[0]) hidden
    expect(icons(home)[0].style.display).toBe("none");
    expect(icons(home)[1].style.display).toBe("");
    // my inactive → inactive visible, active hidden
    expect(icons(my)[0].style.display).toBe("");
    expect(icons(my)[1].style.display).toBe("none");
  });

  it("falls back to inactive icon when active item has no active-icon", async () => {
    const host = await mount(
      `<nds-bottom-nav active-key="home">${ITEM("home", "홈", { activeIcon: false })}</nds-bottom-nav>`,
    );
    const item = host.querySelector(".nds-bottom-nav__item")!;
    const spans = Array.from(
      item.querySelector(".nds-bottom-nav__icon")!.children,
    ) as HTMLElement[];
    // active 인데 active-icon 없음 → inactive 그래픽 유지(색만 cascade)
    expect(item.getAttribute("data-active")).toBe("true");
    expect(spans[0].style.display).toBe("");
  });

  it("renders badge only when badge attr is set", async () => {
    const host = await mount(
      `<nds-bottom-nav active-key="home">${ITEM("home", "홈")}${ITEM("my", "내 공간", { badge: "3" })}</nds-bottom-nav>`,
    );
    const [home, my] = Array.from(host.querySelectorAll(".nds-bottom-nav__item"));
    const badge = (item: Element) => item.querySelector(".nds-bottom-nav__badge") as HTMLElement;
    expect(badge(home).style.display).toBe("none");
    expect(badge(my).style.display).toBe("");
    expect(badge(my).textContent).toBe("3");
  });

  it("re-coordinates active state when active-key changes", async () => {
    const host = await mount(
      `<nds-bottom-nav active-key="home">${ITEM("home", "홈")}${ITEM("my", "내 공간")}</nds-bottom-nav>`,
    );
    const nav = host.querySelector("nds-bottom-nav")!;
    nav.setAttribute("active-key", "my");
    await flush();
    await flush();
    const [home, my] = Array.from(host.querySelectorAll(".nds-bottom-nav__item"));
    expect(home.getAttribute("data-active")).toBeNull();
    expect(my.getAttribute("data-active")).toBe("true");
  });

  it("toggles fixed/static position and shadow", async () => {
    const host = await mount(
      `<nds-bottom-nav active-key="home" position="static" shadow>${ITEM("home", "홈")}</nds-bottom-nav>`,
    );
    const nav = host.querySelector("nds-bottom-nav > nav") as HTMLElement;
    expect(nav.dataset.position).toBe("static");
    expect(nav.dataset.shadow).toBe("true");
  });
});
