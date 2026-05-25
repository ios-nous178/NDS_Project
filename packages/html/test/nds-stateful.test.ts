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
    const dropdown = sel.querySelector(".nds-select__dropdown") as HTMLDivElement;
    expect(dropdown.style.display).not.toBe("none");
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
    const optJp = sel.querySelector('nds-select-option[value="jp"]') as HTMLElement;
    optJp.click();
    await twice();

    expect(sel.getAttribute("value")).toBe("jp");
    expect(detailValue).toBe("jp");
    expect(sel.hasAttribute("open")).toBe(false);
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
