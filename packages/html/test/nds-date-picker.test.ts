/**
 * nds-date-picker 패널 portal 검증 — Modal 등 overflow:hidden 안에서 캘린더가 잘리지 않도록
 * 패널을 document.body 로 portal(position:fixed)한다. (nds-select 와 동일 전략)
 * jsdom 은 레이아웃이 없어 좌표 계산은 검증 못 하지만, "모달 밖으로 탈출"의 본질인
 * DOM portal + 패널 내부 클릭이 닫지 않음(month nav 회귀) + 닫힘 정리를 고정한다.
 */

import { afterEach, describe, expect, it } from "vitest";
import { NdsDatePicker } from "../src/components/nds-date-picker.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

// 패널은 document.body 로 portal 되므로 테스트마다 body 를 비워 격리한다
// (jsdom 은 테스트 간 DOM 을 리셋하지 않아, 남은 인스턴스의 패널이 querySelector 를 오염시킨다).
afterEach(() => {
  document.body.replaceChildren();
});

const open = async (el: HTMLElement) => {
  (el.querySelector(".nds-date-picker__trigger") as HTMLButtonElement).click();
  await flush();
};

describe("nds-date-picker — 패널 portal (모달 overflow 탈출)", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-date-picker")).toBe(NdsDatePicker);
  });

  it("열리면 패널이 _root 안이 아니라 document.body 로 portal + position:fixed", async () => {
    const el = document.createElement("nds-date-picker");
    document.body.appendChild(el);
    await flush();
    await open(el);

    const panel = document.body.querySelector(":scope > .nds-date-picker__panel") as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.parentElement).toBe(document.body);
    expect(panel.style.position).toBe("fixed");
    // 트리거 root 안에는 패널이 없어야 한다(absolute 시절 회귀 방지).
    const root = el.querySelector(".nds-date-picker__root") as HTMLElement;
    expect(root.querySelector(".nds-date-picker__panel")).toBeNull();
  });

  it("패널 내부 클릭(이전/다음 달)은 닫지 않는다 — portal 후 outside-click 회귀 방지", async () => {
    const el = document.createElement("nds-date-picker");
    document.body.appendChild(el);
    await flush();
    await open(el);

    const navBtn = document.body.querySelector(
      ".nds-date-picker__panel .nds-date-picker__nav-btn",
    ) as HTMLButtonElement;
    expect(navBtn).toBeTruthy();
    navBtn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flush();

    expect(el.hasAttribute("open")).toBe(true);
    expect(document.body.querySelector(":scope > .nds-date-picker__panel")).toBeTruthy();
  });

  it("패널 밖 클릭은 닫고, 닫히면 portal 패널이 제거된다", async () => {
    const el = document.createElement("nds-date-picker");
    document.body.appendChild(el);
    await flush();
    await open(el);
    expect(el.hasAttribute("open")).toBe(true);

    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flush();

    expect(el.hasAttribute("open")).toBe(false);
    expect(document.body.querySelector(":scope > .nds-date-picker__panel")).toBeNull();
  });

  it("disconnect 시 portal 패널을 정리한다(누수 방지)", async () => {
    const el = document.createElement("nds-date-picker");
    document.body.appendChild(el);
    await flush();
    await open(el);
    expect(document.body.querySelector(":scope > .nds-date-picker__panel")).toBeTruthy();

    el.remove();
    await flush();
    expect(document.body.querySelector(":scope > .nds-date-picker__panel")).toBeNull();
  });
});

/**
 * clear(×) ↔ 캘린더 아이콘 겹침 방지 — DS 는 swap 설계다: 값+allow-clear 면 trigger 에
 * data-clearable="true" 가 붙고, CSS 가 캘린더 아이콘을 숨겨 그 자리에 × 를 놓는다(겹치지 않게).
 * 이 wiring(× 노출 ⇔ data-clearable ⇔ 아이콘 숨김)이 리팩터로 어긋나면 둘이 겹친다 — 회귀 고정.
 */
describe("nds-date-picker — clearable swap (× ↔ 캘린더 아이콘 겹침 방지)", () => {
  const trigger = (el: Element) => el.querySelector(".nds-date-picker__trigger") as HTMLElement;
  const clearBtn = (el: Element) =>
    el.querySelector(".nds-date-picker__clear-btn") as HTMLButtonElement;

  it("allow-clear + value → data-clearable=true · × 노출 (아이콘은 CSS 가 숨겨 swap)", async () => {
    const el = document.createElement("nds-date-picker");
    el.setAttribute("allow-clear", "");
    el.setAttribute("value", "2026-05-25");
    document.body.appendChild(el);
    await flush();
    expect(trigger(el).dataset.clearable).toBe("true");
    expect(clearBtn(el).hidden).toBe(false);
  });

  it("값 없으면 × 숨김 · data-clearable=false (캘린더 아이콘만 — 겹칠 × 없음)", async () => {
    const el = document.createElement("nds-date-picker");
    el.setAttribute("allow-clear", "");
    document.body.appendChild(el);
    await flush();
    expect(trigger(el).dataset.clearable).toBe("false");
    expect(clearBtn(el).hidden).toBe(true);
  });

  it("allow-clear 없으면 값이 있어도 × 숨김", async () => {
    const el = document.createElement("nds-date-picker");
    el.setAttribute("value", "2026-05-25");
    document.body.appendChild(el);
    await flush();
    expect(trigger(el).dataset.clearable).toBe("false");
    expect(clearBtn(el).hidden).toBe(true);
  });

  it("disabled 면 × 안 띄움(data-clearable=false)", async () => {
    const el = document.createElement("nds-date-picker");
    el.setAttribute("allow-clear", "");
    el.setAttribute("value", "2026-05-25");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();
    expect(trigger(el).dataset.clearable).toBe("false");
    expect(clearBtn(el).hidden).toBe(true);
  });

  it("× 클릭 → value 제거 + data-clearable=false 복귀(캘린더 아이콘 복귀)", async () => {
    const el = document.createElement("nds-date-picker");
    el.setAttribute("allow-clear", "");
    el.setAttribute("value", "2026-05-25");
    document.body.appendChild(el);
    await flush();
    clearBtn(el).click();
    await flush();
    expect(el.hasAttribute("value")).toBe(false);
    expect(trigger(el).dataset.clearable).toBe("false");
    expect(clearBtn(el).hidden).toBe(true);
  });
});
