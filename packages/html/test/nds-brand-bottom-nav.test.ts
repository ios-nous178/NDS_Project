/**
 * nds-brand-bottom-nav — 브랜드별 5탭 BottomNav 가 BRAND_DATA 에서 자동 렌더되는지 검사.
 * React 의 brand BottomNav (Trost/Geniet/NudgeEAP/Runmile) 와 동등한 탭/아이콘/색 cascade.
 */

import { describe, expect, it } from "vitest";
import { NdsBrandBottomNav } from "../src/components/nds-brand-chrome.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

async function mount(brand: string, activeKey?: string): Promise<HTMLElement> {
  const el = document.createElement("nds-brand-bottom-nav");
  el.setAttribute("brand", brand);
  if (activeKey) el.setAttribute("active-key", activeKey);
  document.body.appendChild(el);
  await flush();
  await flush();
  return el;
}

describe("nds-brand-bottom-nav", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-brand-bottom-nav")).toBe(NdsBrandBottomNav);
  });

  it("registers per-brand aliases", () => {
    for (const tag of [
      "nds-trost-bottom-nav",
      "nds-geniet-bottom-nav",
      "nds-nudge-eap-bottom-nav",
      "nds-runmile-bottom-nav",
    ]) {
      expect(customElements.get(tag)).toBeTruthy();
    }
  });

  it("renders 5 tabs with brand labels (trost)", async () => {
    const el = await mount("trost", "counsel");
    const items = el.querySelectorAll("nds-footer-tab-item");
    expect(items.length).toBe(5);
    const labels = Array.from(items).map((i) => i.getAttribute("label"));
    expect(labels).toEqual(["홈", "심리상담", "커뮤니티", "멘탈케어", "내공간"]);
    // active-tab 전달
    expect(el.querySelector("nds-footer-tab-bar")!.getAttribute("active-tab")).toBe("counsel");
  });

  it("injects icon + active-icon SVG into each tab (split policy)", async () => {
    const el = await mount("nudge-eap", "home");
    const first = el.querySelector("nds-footer-tab-item")!;
    const iconSlot = first.querySelector('[slot="icon"]')!;
    const activeSlot = first.querySelector('[slot="active-icon"]')!;
    expect(iconSlot.querySelector("svg")).toBeTruthy();
    expect(activeSlot.querySelector("svg")).toBeTruthy();
    // split: inactive ≠ active 그래픽
    expect(iconSlot.innerHTML).not.toBe(activeSlot.innerHTML);
  });

  it("uses identical graphic for icon/active-icon (geniet single policy)", async () => {
    const el = await mount("geniet", "home");
    const first = el.querySelector("nds-footer-tab-item")!;
    const iconSlot = first.querySelector('[slot="icon"]')!;
    const activeSlot = first.querySelector('[slot="active-icon"]')!;
    expect(iconSlot.innerHTML).toBe(activeSlot.innerHTML);
  });

  it("sets nav color cascade vars on the tab-bar", async () => {
    const el = await mount("geniet");
    const bar = el.querySelector("nds-footer-tab-bar") as HTMLElement;
    expect(bar.style.getPropertyValue("--nds-footer-nav-active-color")).toContain(
      "--semantic-text-brand-default",
    );
    expect(bar.style.getPropertyValue("--nds-footer-nav-inactive-color")).toContain(
      "--semantic-text-muted-default",
    );
  });

  it("applies 12/16 label typography for runmile", async () => {
    const el = await mount("runmile");
    const bar = el.querySelector("nds-footer-tab-bar") as HTMLElement;
    expect(bar.style.getPropertyValue("--nds-footer-nav-label-font-size")).toBe("12px");
    expect(bar.style.getPropertyValue("--nds-footer-nav-label-line-height")).toBe("16px");
  });

  it("renders empty for web-only cashwalk-biz (no bottomNav data)", async () => {
    const el = await mount("cashwalk-biz");
    expect(el.querySelector("nds-footer-tab-bar")).toBeNull();
  });

  it("emits unique url(#…) ids to avoid clip/mask collisions", async () => {
    // geniet "리뷰" 아이콘이 clipPath(url(#…)) 를 쓰므로 유니크 prefix(nds-bn-*) 로 박혀
    // 다중 인라인 시 id 충돌이 없어야 한다. (counsel 은 mask→stroke 전환으로 url 참조 제거)
    const el = await mount("geniet", "home");
    const html = el.innerHTML;
    expect(html).toContain("nds-bn-geniet-review-clip");
  });
});
