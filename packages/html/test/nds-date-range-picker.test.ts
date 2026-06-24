/**
 * nds-date-range-picker — panel portal + view-init 회귀 계약.
 *
 * 이 컴포넌트는 React DateRangePicker / nds-select 와 동일하게 panel 을 document.body 로
 * portal 해야 한다 — 안 그러면 overflow:hidden 조상(아코디언/모달 본문)에 잘린다.
 * 또 값/attribute 로 열릴 때 view 가 미초기화(0년→JS Date 1900)면 "1900년" 달력이 뜨는
 * 버그가 있었다(트리거 클릭 경로만 _syncViewToValue 를 호출). 두 회귀를 잠근다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-date-range-picker.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

async function mountOpen(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-date-range-picker");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  el.setAttribute("open", "");
  await flush();
  return el;
}

const panelOf = () => document.querySelector<HTMLElement>('[data-slot="panel"]');

describe("nds-date-range-picker — panel portal", () => {
  it("attribute 로 열면 panel 이 document.body 로 portal 된다 (아코디언 overflow 탈출)", async () => {
    const el = await mountOpen();
    const panel = panelOf();
    expect(panel).not.toBeNull();
    // _root 자식이 아니라 body 직속이어야 한다 — 안 그러면 조상 overflow 에 잘린다.
    expect(panel!.parentElement).toBe(document.body);
    expect(el.contains(panel)).toBe(false);
    expect(panel!.style.position).toBe("fixed");
    el.remove();
  });

  it("닫으면 portal 된 panel 이 정리된다", async () => {
    const el = await mountOpen();
    expect(panelOf()).not.toBeNull();
    el.removeAttribute("open");
    await flush();
    expect(panelOf()).toBeNull();
    el.remove();
  });

  it("disconnect 시 portal 된 panel 이 남지 않는다", async () => {
    const el = await mountOpen();
    expect(panelOf()).not.toBeNull();
    el.remove();
    await flush();
    expect(panelOf()).toBeNull();
  });
});

describe("nds-date-range-picker — view 초기화 (1900 회귀)", () => {
  it("값 없이 attribute 로 열어도 현재 연·월 달력이 뜬다 (1900 아님)", async () => {
    const el = await mountOpen();
    const text = panelOf()!.textContent ?? "";
    expect(text).not.toContain("1900년");
    expect(text).toContain(`${new Date().getFullYear()}년`);
    el.remove();
  });

  it("from 값이 있으면 그 달로 view 가 맞춰진다", async () => {
    const el = await mountOpen({ from: "2030-03-10" });
    const text = panelOf()!.textContent ?? "";
    expect(text).toContain("2030년 3월");
    el.remove();
  });
});

describe("nds-date-range-picker — portal panel outside-click", () => {
  it("portal 된 panel 내부 클릭은 닫지 않는다", async () => {
    const el = await mountOpen();
    const day = panelOf()!.querySelector<HTMLElement>('[data-slot="day"]');
    expect(day).not.toBeNull();
    day!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flush();
    expect(panelOf()).not.toBeNull(); // 여전히 열림
    el.remove();
  });

  it("panel 밖(body) 클릭은 닫는다", async () => {
    const el = await mountOpen();
    expect(panelOf()).not.toBeNull();
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flush();
    expect(panelOf()).toBeNull();
    el.remove();
  });
});
