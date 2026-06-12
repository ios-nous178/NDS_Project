/**
 * nds-stats-table — 구조형 래퍼 계약.
 *
 * children(`<table>` + 병합셀 markup)을 절대 재구성하지 않고 클래스만 입히는지,
 * scroll/sticky-first attr 토글이 호스트/테이블 클래스에 반영되는지 잠근다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-stats-table.js";

async function flush() {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
}

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-stats-table");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = `
    <table>
      <thead>
        <tr><th rowspan="2">날짜</th><th colspan="2" data-align="center">남성</th></tr>
        <tr><th>10대</th><th>20대</th></tr>
      </thead>
      <tbody>
        <tr><td>06-01</td><td data-align="right">12</td><td data-align="right">34</td></tr>
        <tr class="is-summary"><td>합계</td><td data-align="right">12</td><td data-align="right">34</td></tr>
      </tbody>
    </table>`;
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-stats-table — structural wrapper contract", () => {
  it("applies .nds-stats-table to the light-DOM table without rebuilding children", async () => {
    const el = await mount();
    const table = el.querySelector("table")!;
    expect(table.classList.contains("nds-stats-table")).toBe(true);
    // 병합셀/합계행 markup 보존
    expect(el.querySelector('th[rowspan="2"]')).not.toBeNull();
    expect(el.querySelector("tr.is-summary")).not.toBeNull();

    // attr 토글이 자식을 재생성하지 않는다 (노드 동일성)
    el.setAttribute("sticky-first", "");
    await flush();
    expect(el.querySelector("table")).toBe(table);
  });

  it("toggles sticky-first on the table and scroll on the host", async () => {
    const el = await mount({ scroll: "", "sticky-first": "" });
    const table = el.querySelector("table")!;
    expect(table.classList.contains("nds-stats-table--sticky-first")).toBe(true);
    expect(el.classList.contains("nds-stats-table__scroll")).toBe(true);

    el.removeAttribute("sticky-first");
    el.removeAttribute("scroll");
    await flush();
    expect(table.classList.contains("nds-stats-table--sticky-first")).toBe(false);
    expect(el.classList.contains("nds-stats-table__scroll")).toBe(false);
  });
});
