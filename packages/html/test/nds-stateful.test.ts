/**
 * Phase 2 stateful sanity check — input / tabs / modal / select.
 */

import { describe, expect, it } from "vitest";
import { NdsInput } from "../src/components/nds-input.js";
import { NdsModal } from "../src/components/nds-modal.js";
import { NdsSelect, NdsSelectOption } from "../src/components/nds-select.js";
import { NdsTabs, NdsTabsList, NdsTabsPanel, NdsTabsTrigger } from "../src/components/nds-tabs.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));
const twice = async () => {
  await flush();
  await flush();
};

describe("nds-input", () => {
  it("registers + renders root/wrapper/field DOM", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("label", "이름");
    el.setAttribute("helper-text", "공백 없이");
    el.setAttribute("size", "default");
    document.body.appendChild(el);
    await flush();

    expect(customElements.get("nds-input")).toBe(NdsInput);
    expect(el.querySelector(".nds-input__root")).toBeTruthy();
    expect(el.querySelector(".nds-input__wrapper")).toBeTruthy();
    const field = el.querySelector("input.nds-input__field") as HTMLInputElement;
    expect(field).toBeTruthy();
    expect(el.querySelector(".nds-input__label")!.textContent).toBe("이름");
    expect(el.querySelector(".nds-input__helper")!.textContent).toBe("공백 없이");
  });

  it("forwards placeholder/type/name to inner input", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("placeholder", "입력하세요");
    el.setAttribute("type", "email");
    el.setAttribute("name", "email");
    document.body.appendChild(el);
    await flush();
    const field = el.querySelector("input")!;
    expect(field.placeholder).toBe("입력하세요");
    expect(field.type).toBe("email");
    expect(field.name).toBe("email");
  });

  it("controlled value attribute syncs to field", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("value", "초기");
    document.body.appendChild(el);
    await flush();
    expect((el.querySelector("input") as HTMLInputElement).value).toBe("초기");

    el.setAttribute("value", "변경");
    await flush();
    expect((el.querySelector("input") as HTMLInputElement).value).toBe("변경");
  });

  it("input event bubbles + dirty flag pins user value", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("default-value", "기본");
    document.body.appendChild(el);
    await flush();
    const field = el.querySelector("input") as HTMLInputElement;
    expect(field.value).toBe("기본");

    let bubbled = false;
    el.addEventListener("input", () => (bubbled = true));
    field.value = "사용자가 입력함";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    expect(bubbled).toBe(true);

    // default-value 가 다시 적용되면 안 됨 (dirty)
    el.setAttribute("default-value", "다른기본");
    await flush();
    expect(field.value).toBe("사용자가 입력함");
  });

  it("clearable adds clear button when value present", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("clearable", "");
    el.setAttribute("value", "삭제대상");
    document.body.appendChild(el);
    await flush();

    const clear = el.querySelector(".nds-input__clear") as HTMLButtonElement;
    expect(clear).toBeTruthy();
    clear.click();
    await flush();
    expect((el.querySelector("input") as HTMLInputElement).value).toBe("");
  });

  it("error sets aria-invalid + helper data-error", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("helper-text", "잘못됨");
    el.setAttribute("error", "");
    document.body.appendChild(el);
    await flush();
    const field = el.querySelector("input") as HTMLInputElement;
    const helper = el.querySelector(".nds-input__helper") as HTMLSpanElement;
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(helper.dataset.error).toBe("true");
  });
});

describe("nds-tabs", () => {
  it("registers all four sub-elements", () => {
    expect(customElements.get("nds-tabs")).toBe(NdsTabs);
    expect(customElements.get("nds-tabs-list")).toBe(NdsTabsList);
    expect(customElements.get("nds-tabs-trigger")).toBe(NdsTabsTrigger);
    expect(customElements.get("nds-tabs-panel")).toBe(NdsTabsPanel);
  });

  it("marks active trigger + hides non-active panel", async () => {
    document.body.innerHTML = `
      <nds-tabs active-key="b" variant="line">
        <nds-tabs-list>
          <nds-tabs-trigger key="a">A</nds-tabs-trigger>
          <nds-tabs-trigger key="b">B</nds-tabs-trigger>
        </nds-tabs-list>
        <nds-tabs-panel key="a">aaa</nds-tabs-panel>
        <nds-tabs-panel key="b">bbb</nds-tabs-panel>
      </nds-tabs>
    `;
    await twice();

    const a = document.querySelector('nds-tabs-trigger[key="a"]')!;
    const b = document.querySelector('nds-tabs-trigger[key="b"]')!;
    expect((a.querySelector("li") as HTMLLIElement).dataset.active).toBe("false");
    expect((b.querySelector("li") as HTMLLIElement).dataset.active).toBe("true");

    const aPanel = document.querySelector('nds-tabs-panel[key="a"]')!;
    const bPanel = document.querySelector('nds-tabs-panel[key="b"]')!;
    expect((aPanel.querySelector("div") as HTMLDivElement).dataset.hidden).toBe("true");
    expect((bPanel.querySelector("div") as HTMLDivElement).dataset.hidden).toBe("false");
  });

  it("trigger click changes active-key + dispatches tabs-change", async () => {
    document.body.innerHTML = `
      <nds-tabs active-key="a">
        <nds-tabs-list>
          <nds-tabs-trigger key="a">A</nds-tabs-trigger>
          <nds-tabs-trigger key="b">B</nds-tabs-trigger>
        </nds-tabs-list>
      </nds-tabs>
    `;
    await twice();

    const tabs = document.querySelector("nds-tabs")!;
    let event: CustomEvent<{ activeKey: string }> | null = null;
    tabs.addEventListener("tabs-change", (e) => (event = e as CustomEvent));

    const triggerB = document.querySelector('nds-tabs-trigger[key="b"] li') as HTMLLIElement;
    triggerB.click();
    await twice();

    expect(tabs.getAttribute("active-key")).toBe("b");
    expect(event).not.toBeNull();
    expect((event as unknown as CustomEvent<{ activeKey: string }>).detail.activeKey).toBe("b");
  });

  it("trigger click on the host element (not just inner li) toggles active-key", async () => {
    // 회귀 방지: trigger 가 부모 mount 시 reparent 되면서 disconnect→reconnect 되는데,
    // 이전엔 클릭 리스너를 inner li 에 달아둬서 재mount 가드 때문에 다시 안 달려 무반응이었음.
    // 이제 host element 자체에 달아서 light DOM bubble 로 잡힌다.
    document.body.innerHTML = `
      <nds-tabs active-key="a">
        <nds-tabs-list>
          <nds-tabs-trigger key="a">A</nds-tabs-trigger>
          <nds-tabs-trigger key="b">B</nds-tabs-trigger>
        </nds-tabs-list>
      </nds-tabs>
    `;
    await twice();

    const tabs = document.querySelector("nds-tabs")!;
    const triggerBHost = document.querySelector('nds-tabs-trigger[key="b"]') as HTMLElement;
    triggerBHost.click();
    await twice();

    expect(tabs.getAttribute("active-key")).toBe("b");
  });
});

describe("nds-modal", () => {
  it("registers + open attribute toggles display", async () => {
    const el = document.createElement("nds-modal");
    document.body.appendChild(el);
    await flush();
    expect(customElements.get("nds-modal")).toBe(NdsModal);

    const root = el.querySelector(".nds-modal__root") as HTMLDivElement;
    expect(root.style.display).toBe("none");

    el.setAttribute("open", "");
    await flush();
    expect(root.dataset.open).toBe("true");
    expect(root.style.display).not.toBe("none");
  });

  it("close() removes open + dispatches modal-close", async () => {
    const el = document.createElement("nds-modal");
    el.setAttribute("open", "");
    document.body.appendChild(el);
    await flush();

    let closed = false;
    el.addEventListener("modal-close", () => (closed = true));
    (el as NdsModal).close();
    await flush();
    expect(el.hasAttribute("open")).toBe(false);
    expect(closed).toBe(true);
  });

  it("closable=true renders ✕ button + click closes", async () => {
    const el = document.createElement("nds-modal");
    el.setAttribute("open", "");
    el.setAttribute("closable", "");
    document.body.appendChild(el);
    await flush();

    const closeBtn = el.querySelector(".nds-modal__close") as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    await flush();
    expect(el.hasAttribute("open")).toBe(false);
  });

  it("Escape key closes when open", async () => {
    const el = document.createElement("nds-modal");
    el.setAttribute("open", "");
    document.body.appendChild(el);
    await flush();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flush();
    expect(el.hasAttribute("open")).toBe(false);
  });

  it('slot="footer" 를 .nds-modal__footer 로 승격 + body 의 형제로 배치 (single)', async () => {
    const el = document.createElement("nds-modal");
    el.setAttribute("open", "");
    el.innerHTML = '<p>본문</p><div slot="footer"><button>확인</button></div>';
    document.body.appendChild(el);
    await flush();

    const content = el.querySelector(".nds-modal__content") as HTMLElement;
    const body = content.querySelector(":scope > .nds-modal__body");
    const footer = content.querySelector(":scope > .nds-modal__footer") as HTMLElement;
    expect(footer).toBeTruthy(); // body 에 덤프되지 않고 content 직속으로 승격
    expect(footer.previousElementSibling).toBe(body); // body 의 형제(다음)
    expect(footer.querySelector("button")).toBeTruthy();
    expect(footer.dataset.hasBothActions).toBeUndefined(); // single → 미설정(캐포비 우측정렬 cascade)
  });

  it("footer 버튼 2개 → data-has-both-actions=true (가로 분할)", async () => {
    const el = document.createElement("nds-modal");
    el.setAttribute("open", "");
    el.innerHTML = '<p>본문</p><div slot="footer"><button>취소</button><button>확인</button></div>';
    document.body.appendChild(el);
    await flush();

    const footer = el.querySelector(".nds-modal__footer") as HTMLElement;
    expect(footer).toBeTruthy();
    expect(footer.dataset.hasBothActions).toBe("true");
  });
});

describe("nds-select", () => {
  it("registers + renders trigger / dropdown", async () => {
    document.body.innerHTML = `
      <nds-select placeholder="선택" label="국가">
        <nds-select-option value="kr">대한민국</nds-select-option>
        <nds-select-option value="jp">일본</nds-select-option>
      </nds-select>
    `;
    await twice();
    expect(customElements.get("nds-select")).toBe(NdsSelect);
    expect(customElements.get("nds-select-option")).toBe(NdsSelectOption);

    const root = document.querySelector(".nds-select__root")!;
    expect(root).toBeTruthy();
    const trigger = document.querySelector("button.nds-select__trigger") as HTMLButtonElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");

    const dropdown = document.querySelector(".nds-select__dropdown") as HTMLDivElement;
    expect(dropdown.style.display).toBe("none");
  });

  it("trigger click toggles open + sets aria-expanded", async () => {
    document.body.innerHTML = `
      <nds-select placeholder="선택">
        <nds-select-option value="kr">대한민국</nds-select-option>
      </nds-select>
    `;
    await twice();
    const sel = document.querySelector("nds-select") as NdsSelect;
    const trigger = sel.querySelector("button") as HTMLButtonElement;
    trigger.click();
    await twice();
    expect(sel.hasAttribute("open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    // dropdown 은 open 시 document.body 로 portal 되므로 document 전체에서 검색.
    const dropdown = document.querySelector(".nds-select__dropdown") as HTMLDivElement;
    expect(dropdown.style.display).not.toBe("none");
    expect(dropdown.parentElement).toBe(document.body); // portal 검증
  });

  it("option click sets value + dispatches select-change + closes", async () => {
    document.body.innerHTML = `
      <nds-select placeholder="선택">
        <nds-select-option value="kr">대한민국</nds-select-option>
        <nds-select-option value="jp">일본</nds-select-option>
      </nds-select>
    `;
    await twice();
    const sel = document.querySelector("nds-select") as NdsSelect;
    let detailValue: string | null = null;
    sel.addEventListener("select-change", (e) => {
      detailValue = (e as CustomEvent<{ value: string }>).detail.value;
    });

    (sel.querySelector("button") as HTMLButtonElement).click();
    await twice();
    // option 들은 dropdown 과 함께 body 로 portal 됨 — document 에서 찾는다.
    const optJp = document.querySelector('nds-select-option[value="jp"]') as HTMLElement;
    optJp.click();
    await twice();

    expect(sel.getAttribute("value")).toBe("jp");
    expect(detailValue).toBe("jp");
    expect(sel.hasAttribute("open")).toBe(false);
  });

  it("marks the selected option with data-selected + renders a checkmark", async () => {
    document.body.innerHTML = `
      <nds-select value="jp" placeholder="선택">
        <nds-select-option value="kr">대한민국</nds-select-option>
        <nds-select-option value="jp">일본</nds-select-option>
      </nds-select>
    `;
    await twice();
    const optKr = document.querySelector('nds-select-option[value="kr"]') as HTMLElement;
    const optJp = document.querySelector('nds-select-option[value="jp"]') as HTMLElement;
    expect(optJp.dataset.selected).toBe("true");
    expect(optJp.getAttribute("aria-selected")).toBe("true");
    expect(optKr.dataset.selected).toBe("false");
    // 선택 표시용 체크가 옵션 내부에 렌더되고, 라벨 textContent 는 영향받지 않는다.
    expect(optJp.querySelector(".nds-select__option-check svg")).toBeTruthy();
    expect(optJp.textContent?.trim()).toBe("일본");
  });

  it("value attribute shows selected option label in trigger", async () => {
    document.body.innerHTML = `
      <nds-select value="jp" placeholder="선택">
        <nds-select-option value="kr">대한민국</nds-select-option>
        <nds-select-option value="jp">일본</nds-select-option>
      </nds-select>
    `;
    await twice();
    const text = document.querySelector(".nds-select__trigger-text")!;
    expect(text.textContent).toBe("일본");
    expect((text as HTMLElement).dataset.placeholder).toBe("false");
  });

  it("dropdown portals to body on open and returns on close", async () => {
    document.body.innerHTML = `
      <div style="overflow:hidden; height:100px">
        <nds-select placeholder="x">
          <nds-select-option value="a">A</nds-select-option>
        </nds-select>
      </div>
    `;
    await twice();
    const sel = document.querySelector("nds-select") as NdsSelect;
    const dropdown = sel.querySelector(".nds-select__dropdown") as HTMLDivElement;
    // closed: dropdown stays inside root
    expect(dropdown.parentElement).toBe(sel.querySelector(".nds-select__root"));

    (sel.querySelector("button") as HTMLButtonElement).click();
    await twice();
    // open: portal to body
    expect((document.querySelector(".nds-select__dropdown") as HTMLDivElement).parentElement).toBe(
      document.body,
    );

    // close again (ESC)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await twice();
    // back inside root
    expect((sel.querySelector(".nds-select__dropdown") as HTMLDivElement).parentElement).toBe(
      sel.querySelector(".nds-select__root"),
    );
  });

  it("disabled option not selectable + cant become active", async () => {
    document.body.innerHTML = `
      <nds-select>
        <nds-select-option value="kr">대한민국</nds-select-option>
        <nds-select-option value="jp" disabled>일본</nds-select-option>
      </nds-select>
    `;
    await twice();
    const sel = document.querySelector("nds-select") as NdsSelect;
    const optJp = sel.querySelector('nds-select-option[value="jp"]') as HTMLElement;
    expect(optJp.getAttribute("aria-disabled")).toBe("true");

    optJp.click();
    await flush();
    expect(sel.hasAttribute("value")).toBe(false);
  });
});
