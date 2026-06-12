/**
 * nds-verification-code-input DOM 구조 + 입력/페이스트 동작 검증 (웹용 단일 필드).
 */

import { describe, expect, it } from "vitest";
import { NdsVerificationCodeInput } from "../src/components/nds-verification-code-input.js";
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
} from "./helpers/focus-preservation.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));
const inputOf = (el: Element) =>
  el.querySelector<HTMLInputElement>("input.nds-verification-code__input")!;

describe("nds-verification-code-input — DOM parity with React VerificationCodeInput", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-verification-code-input")).toBe(NdsVerificationCodeInput);
  });

  it("renders a single field with correct attributes", async () => {
    const el = document.createElement("nds-verification-code-input");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-verification-code__root") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.dataset.disabled).toBe("false");
    expect(root.dataset.error).toBe("false");

    const input = inputOf(el);
    expect(input.autocomplete).toBe("one-time-code");
    expect(input.maxLength).toBe(6);
    expect(input.inputMode).toBe("numeric");
    expect(input.getAttribute("aria-label")).toBe("인증번호");
    expect(input.placeholder).toBe("인증번호 입력");
    expect(el.style.display).toBe("contents");
  });

  it("respects length attribute and reflects value", async () => {
    const el = document.createElement("nds-verification-code-input");
    el.setAttribute("length", "4");
    el.setAttribute("value", "1234");
    document.body.appendChild(el);
    await flush();

    const input = inputOf(el);
    expect(input.maxLength).toBe(4);
    expect(input.value).toBe("1234");
  });

  it("emits code-change on input (digits only)", async () => {
    const el = document.createElement("nds-verification-code-input");
    el.setAttribute("length", "4");
    document.body.appendChild(el);
    await flush();

    const changes: string[] = [];
    el.addEventListener("code-change", (e) =>
      changes.push((e as CustomEvent<{ value: string }>).detail.value),
    );

    const input = inputOf(el);
    input.value = "12ab";
    input.dispatchEvent(new Event("input"));
    expect(changes.at(-1)).toBe("12");
    expect(input.value).toBe("12");
  });

  it("emits code-complete once when fully filled", async () => {
    const el = document.createElement("nds-verification-code-input");
    el.setAttribute("length", "4");
    document.body.appendChild(el);
    await flush();

    const completes: string[] = [];
    el.addEventListener("code-complete", (e) =>
      completes.push((e as CustomEvent<{ value: string }>).detail.value),
    );

    const input = inputOf(el);
    input.value = "1234";
    input.dispatchEvent(new Event("input"));
    await flush();
    expect(completes).toEqual(["1234"]);
  });

  it("paste fills digits only", async () => {
    const el = document.createElement("nds-verification-code-input");
    el.setAttribute("length", "4");
    document.body.appendChild(el);
    await flush();

    const paste = new Event("paste") as ClipboardEvent;
    Object.defineProperty(paste, "clipboardData", { value: { getData: () => "abc-9876xx" } });
    inputOf(el).dispatchEvent(paste);
    await flush();

    expect(el.getAttribute("value")).toBe("9876");
    expect(inputOf(el).value).toBe("9876");
  });

  it("disabled propagates to input and root dataset", async () => {
    const el = document.createElement("nds-verification-code-input");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();
    const root = el.querySelector(".nds-verification-code__root") as HTMLElement;
    expect(root.dataset.disabled).toBe("true");
    expect(inputOf(el).disabled).toBe(true);
  });

  it("strips non-digits from value attribute", async () => {
    const el = document.createElement("nds-verification-code-input");
    el.setAttribute("length", "4");
    el.setAttribute("value", "12ab34");
    document.body.appendChild(el);
    await flush();
    expect(inputOf(el).value).toBe("1234");
  });
});

// ─── 포커스/커서 보존 (mount-once 계약) ───
// 한 글자마다 setAttribute("value") → update() 가 도는 입력이라
// input 재생성 시 인증번호 6자리를 한 번에 못 친다.
describe("nds-verification-code-input — focus preservation", () => {
  it("typing digits keeps the same input node, focus, and cursor", async () => {
    const el = document.createElement("nds-verification-code-input");
    document.body.appendChild(el);
    await flush();
    await expectTypingPreservesFocus({ requery: () => inputOf(el) }, "031259");
    expect(el.getAttribute("value")).toBe("031259");
  });

  it("external attribute update keeps focused input alive", async () => {
    const el = document.createElement("nds-verification-code-input");
    document.body.appendChild(el);
    await flush();
    const target = { requery: () => inputOf(el) };
    await expectTypingPreservesFocus(target, "0312");
    // 입력 중 외부에서 에러 상태가 바뀌어도(검증 실패 피드백) input 은 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "error", "");
  });
});
