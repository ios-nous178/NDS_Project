/**
 * nds-textarea DOM 구조가 React Textarea 가 만드는 DOM 과 동일한지 검사.
 *
 * 통합 export/runtime 등록 전에도 병렬 작업 충돌 없이 돌 수 있도록 컴포넌트 파일을 직접 import 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsTextarea } from "../src/components/nds-textarea.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-textarea — DOM parity with React Textarea", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-textarea")).toBe(NdsTextarea);
  });

  it("renders root, label, wrapper, field, helper, and counter slots", async () => {
    const el = document.createElement("nds-textarea");
    el.setAttribute("label", "상담 메모");
    el.setAttribute("helper-text", "상담 전에 남길 내용을 적어주세요");
    el.setAttribute("max-length", "200");
    el.setAttribute("default-value", "안녕하세요");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-textarea__root") as HTMLElement;
    const label = el.querySelector(".nds-textarea__label") as HTMLLabelElement;
    const wrapper = el.querySelector(".nds-textarea__wrapper") as HTMLElement;
    const field = el.querySelector("textarea") as HTMLTextAreaElement;
    const helper = el.querySelector(".nds-textarea__helper") as HTMLElement;
    const count = el.querySelector(".nds-textarea__count") as HTMLElement;

    expect(root.dataset.slot).toBe("root");
    expect(label.dataset.slot).toBe("label");
    expect(label.textContent).toBe("상담 메모");
    expect(label.htmlFor).toBe(field.id);
    expect(wrapper.dataset.slot).toBe("wrapper");
    expect(wrapper.dataset.focused).toBe("false");
    expect(wrapper.dataset.error).toBe("false");
    expect(wrapper.dataset.disabled).toBe("false");
    expect(wrapper.dataset.readonly).toBe("false");
    expect(field.classList.contains("nds-textarea__field")).toBe(true);
    expect(field.dataset.slot).toBe("field");
    expect(field.value).toBe("안녕하세요");
    expect(helper.dataset.slot).toBe("helper");
    expect(helper.textContent).toBe("상담 전에 남길 내용을 적어주세요");
    expect(field.getAttribute("aria-describedby")).toBe(helper.id);
    expect(count.dataset.slot).toBe("count");
    expect(count.textContent).toBe("5/200");
  });

  it("host element uses display:contents", async () => {
    const el = document.createElement("nds-textarea");
    document.body.appendChild(el);
    await flush();
    expect(el.style.display).toBe("contents");
  });

  it("reflects disabled, readonly, and error states", async () => {
    const el = document.createElement("nds-textarea");
    el.setAttribute("disabled", "");
    el.setAttribute("readonly", "");
    el.setAttribute("error", "");
    el.setAttribute("helper-text", "필수 입력입니다");
    document.body.appendChild(el);
    await flush();

    const wrapper = el.querySelector(".nds-textarea__wrapper") as HTMLElement;
    const field = el.querySelector("textarea") as HTMLTextAreaElement;
    const helper = el.querySelector(".nds-textarea__helper") as HTMLElement;

    expect(wrapper.dataset.disabled).toBe("true");
    expect(wrapper.dataset.readonly).toBe("true");
    expect(wrapper.dataset.error).toBe("true");
    expect(field.disabled).toBe(true);
    expect(field.readOnly).toBe(true);
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(helper.dataset.error).toBe("true");
  });

  it("updates focused state on focus and blur", async () => {
    const el = document.createElement("nds-textarea");
    document.body.appendChild(el);
    await flush();

    const field = el.querySelector("textarea") as HTMLTextAreaElement;
    const wrapper = el.querySelector(".nds-textarea__wrapper") as HTMLElement;

    field.dispatchEvent(new Event("focus"));
    await flush();
    expect(wrapper.dataset.focused).toBe("true");

    field.dispatchEvent(new Event("blur"));
    await flush();
    expect(wrapper.dataset.focused).toBe("false");
  });

  it("updates character count on input", async () => {
    const el = document.createElement("nds-textarea");
    el.setAttribute("max-length", "4");
    document.body.appendChild(el);
    await flush();

    const field = el.querySelector("textarea") as HTMLTextAreaElement;
    const count = el.querySelector(".nds-textarea__count") as HTMLElement;

    expect(count.textContent).toBe("0/4");
    field.value = "abcde";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flush();
    expect(count.textContent).toBe("5/4");
    expect(count.dataset.over).toBe("true");
  });

  it("forwards textarea attributes to the inner field", async () => {
    const el = document.createElement("nds-textarea");
    el.setAttribute("aria-label", "메모");
    el.setAttribute("name", "memo");
    el.setAttribute("placeholder", "내용 입력");
    el.setAttribute("form", "survey");
    el.setAttribute("required", "");
    el.setAttribute("rows", "5");
    el.setAttribute("cols", "30");
    el.setAttribute("minlength", "2");
    el.setAttribute("tabindex", "0");
    document.body.appendChild(el);
    await flush();

    const field = el.querySelector("textarea")!;
    expect(field.getAttribute("aria-label")).toBe("메모");
    expect(field.getAttribute("name")).toBe("memo");
    expect(field.getAttribute("placeholder")).toBe("내용 입력");
    expect(field.getAttribute("form")).toBe("survey");
    expect(field.hasAttribute("required")).toBe(true);
    expect(field.getAttribute("rows")).toBe("5");
    expect(field.getAttribute("cols")).toBe("30");
    expect(field.getAttribute("minlength")).toBe("2");
    expect(field.getAttribute("tabindex")).toBe("0");
  });

  it("supports explicit input-id and keeps label/helper wiring in sync", async () => {
    const el = document.createElement("nds-textarea");
    el.setAttribute("input-id", "memo-field");
    el.setAttribute("label", "메모");
    el.setAttribute("helper-text", "도움말");
    document.body.appendChild(el);
    await flush();

    const label = el.querySelector("label") as HTMLLabelElement;
    const field = el.querySelector("textarea")!;
    const helper = el.querySelector(".nds-textarea__helper")!;
    expect(field.id).toBe("memo-field");
    expect(label.htmlFor).toBe("memo-field");
    expect(field.getAttribute("aria-describedby")).toBe(helper.id);

    el.setAttribute("input-id", "memo-field-2");
    await flush();
    expect(field.id).toBe("memo-field-2");
    expect(label.htmlFor).toBe("memo-field-2");
    expect(field.getAttribute("aria-describedby")).toBe("memo-field-2-helper");
  });

  it("applies min-height and resize as root CSS variables", async () => {
    const el = document.createElement("nds-textarea");
    el.setAttribute("min-height", "144");
    el.setAttribute("resize", "none");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-textarea__root") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-textarea-min-height")).toBe("144px");
    expect(root.style.getPropertyValue("--nds-textarea-resize")).toBe("none");
  });
});
