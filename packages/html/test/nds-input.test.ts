/**
 * nds-input size별 inline 높이 — 브랜드 :root cascade 보존 검사.
 *
 * 회고(2026-06): 캐포비 admin 폼에서 nds-input(default)이 48px, nds-select 가 40px 로
 * 어긋났다. 원인 = nds-input 이 default 에서도 --nds-input-height 를 inline 으로 박아
 * 브랜드 :root override(캐포비 40)를 눌렀던 것. default 는 inline 을 박지 않아야
 * :root 40 이 cascade 로 이긴다(브랜드 미지정 환경은 CSS fallback 48). field/compact 는
 * 작성자가 명시한 의도이므로 inline 유지.
 */

import { describe, expect, it } from "vitest";
import { NdsInput } from "../src/index.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-input — size별 inline 높이 (브랜드 cascade 보존)", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-input")).toBe(NdsInput);
  });

  it("size=default 는 --nds-input-height 를 inline 으로 박지 않는다 (브랜드 :root 40 cascade 보존)", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("label", "이름");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector<HTMLElement>('[data-slot="root"]')!;
    expect(root).toBeTruthy();
    expect(root.style.getPropertyValue("--nds-input-height")).toBe("");
  });

  it("size=compact 는 --nds-input-height:40px 를 inline 으로 박는다", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("size", "compact");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector<HTMLElement>('[data-slot="root"]')!;
    expect(root.style.getPropertyValue("--nds-input-height")).toBe("40px");
  });

  it("size=field 는 --nds-input-height:44px 를 inline 으로 박는다", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("size", "field");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector<HTMLElement>('[data-slot="root"]')!;
    expect(root.style.getPropertyValue("--nds-input-height")).toBe("44px");
  });
});
