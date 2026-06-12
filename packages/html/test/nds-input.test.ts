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
import {
  expectAttrUpdatePreservesFocus,
  expectTypingPreservesFocus,
} from "./helpers/focus-preservation.js";

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

describe("nds-input — 비밀번호 표시/숨김 토글", () => {
  const setup = async (attrs: Record<string, string>) => {
    const el = document.createElement("nds-input");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    await flush();
    return el;
  };

  it("type=password 면 토글 버튼이 생기고 field 는 password 로 가려진다", async () => {
    const el = await setup({ type: "password" });
    const field = el.querySelector<HTMLInputElement>('[data-slot="field"]')!;
    const toggle = el.querySelector<HTMLButtonElement>('[data-slot="password-toggle"]');
    expect(toggle).toBeTruthy();
    expect(field.type).toBe("password");
    expect(toggle!.getAttribute("aria-pressed")).toBe("false");
  });

  it("토글 클릭 시 field type 이 text↔password 로 바뀐다", async () => {
    const el = await setup({ type: "password" });
    const field = el.querySelector<HTMLInputElement>('[data-slot="field"]')!;
    const toggle = el.querySelector<HTMLButtonElement>('[data-slot="password-toggle"]')!;
    toggle.click();
    await flush();
    expect(field.type).toBe("text");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    toggle.click();
    await flush();
    expect(field.type).toBe("password");
  });

  it('password-toggle="false" 면 토글을 숨긴다', async () => {
    const el = await setup({ type: "password", "password-toggle": "false" });
    expect(el.querySelector('[data-slot="password-toggle"]')).toBeNull();
  });

  it("password 가 아닌 type 은 토글이 없다", async () => {
    const el = await setup({ type: "email" });
    expect(el.querySelector('[data-slot="password-toggle"]')).toBeNull();
  });
});

describe("nds-input — host .value 접근자 (네이티브 input 정합)", () => {
  const flushP = () => new Promise<void>((r) => setTimeout(r, 0));

  it("사용자 입력 후 host.value 가 내부 field 값을 반환한다 (회귀: undefined)", async () => {
    const el = document.createElement("nds-input") as HTMLElement & { value: string };
    document.body.appendChild(el);
    await flushP();
    const field = el.querySelector<HTMLInputElement>('[data-slot="field"]')!;
    field.value = "123";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    expect(el.value).toBe("123");
  });

  it("host.value 설정이 내부 field 에 반영된다", async () => {
    const el = document.createElement("nds-input") as HTMLElement & { value: string };
    document.body.appendChild(el);
    await flushP();
    el.value = "hello";
    const field = el.querySelector<HTMLInputElement>('[data-slot="field"]')!;
    expect(field.value).toBe("hello");
    expect(el.value).toBe("hello");
  });
});

// ─── 포커스/커서 보존 (mount-once 계약) ───
// base Input 은 모든 입력 합성의 기준 — focus/blur 가 scheduleUpdate 를 부르므로
// update() 가 field 를 재생성하면 포커스만 줘도 입력이 끊긴다.
describe("nds-input — focus preservation", () => {
  const FIELD = "input.nds-input__field";

  it("typing keeps the same field node, focus, and cursor", async () => {
    const el = document.createElement("nds-input");
    el.setAttribute("label", "이름");
    document.body.appendChild(el);
    await flush();
    await expectTypingPreservesFocus({
      requery: () => el.querySelector<HTMLInputElement>(FIELD),
    });
  });

  it("external attribute update keeps focused field alive", async () => {
    const el = document.createElement("nds-input");
    document.body.appendChild(el);
    await flush();
    const target = { requery: () => el.querySelector<HTMLInputElement>(FIELD) };
    await expectTypingPreservesFocus(target, "트로");
    // 입력 중 헬퍼/에러가 바뀌어도(검증 피드백 경로) field 는 살아 있어야 한다.
    await expectAttrUpdatePreservesFocus(el, target, "helper-text", "공백 없이 입력하세요");
    await expectAttrUpdatePreservesFocus(el, target, "error", "");
  });
});
