/**
 * nds-button DOM 구조가 React Button 이 만드는 DOM 과 동일한지 검사.
 *
 * React DS stylesheet 는 .nds-button + data-* 셀렉터로 매칭하므로,
 * 두 컴포넌트가 같은 stylesheet 한 장으로 동일하게 보이려면 DOM 이 같아야 한다.
 */

import { describe, expect, it } from "vitest";
import { NdsButton } from "../src/index.js";

// jsdom 환경이라 NdsButton 의 module side-effect (customElements.define) 가 동작.
// 단, 같은 모듈을 두 번 import 해도 define() 안 중복 등록 가드가 있어 안전.

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-button — DOM parity with React Button", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-button")).toBe(NdsButton);
  });

  it("host .disabled 프로퍼티가 attribute 로 reflect 된다 (회귀: el.disabled=false 가 안 먹어 버튼이 계속 비활성)", async () => {
    const el = document.createElement("nds-button") as HTMLElement & { disabled: boolean };
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();
    expect((el.querySelector("button") as HTMLButtonElement).disabled).toBe(true);

    el.disabled = false;
    await flush();
    expect(el.hasAttribute("disabled")).toBe(false);
    expect((el.querySelector("button") as HTMLButtonElement).disabled).toBe(false);

    el.disabled = true;
    await flush();
    expect(el.hasAttribute("disabled")).toBe(true);
    expect((el.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
  });

  it("renders inner <button class='nds-button'> with data attributes", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("color", "primary");
    el.setAttribute("variant", "solid");
    el.setAttribute("size", "lg");
    el.textContent = "예약하기";
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("button");
    expect(inner).toBeTruthy();
    expect(inner!.classList.contains("nds-button")).toBe(true);
    expect(inner!.dataset.slot).toBe("root");
    expect(inner!.dataset.variant).toBe("solid");
    expect(inner!.dataset.size).toBe("lg");
    expect(inner!.dataset.color).toBe("primary");
    expect(inner!.type).toBe("button");
  });

  it("moves children into <span class='nds-button__label'>", async () => {
    const el = document.createElement("nds-button");
    el.textContent = "안녕";
    document.body.appendChild(el);
    await flush();

    const label = el.querySelector(".nds-button__label");
    expect(label).toBeTruthy();
    expect(label!.textContent).toBe("안녕");
    expect((label as HTMLElement).dataset.slot).toBe("label");
  });

  it("survives el.textContent set AFTER mount (회귀: '재전송'/검색 버튼이 맨 텍스트로 깨짐)", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("color", "neutral");
    el.textContent = "인증번호 받기";
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-button__label")!.textContent).toBe("인증번호 받기");

    // 인라인 토글: 버튼 라벨을 textContent 로 바꾼다 (mockup 의 흔한 idiom)
    el.textContent = "재전송";
    await flush();

    const inner = el.querySelector("button");
    expect(inner, "inner button must survive textContent change").toBeTruthy();
    expect(inner!.classList.contains("nds-button")).toBe(true);
    const label = el.querySelector(".nds-button__label");
    expect(label, "label must be re-established").toBeTruthy();
    expect(label!.textContent).toBe("재전송");
    // host 직속 자식은 inner 버튼 하나뿐 — 맨 텍스트 노드가 남으면 안 됨
    expect(el.childNodes.length).toBe(1);
    expect(el.firstChild).toBe(inner);
  });

  it("survives el.innerHTML set after mount, absorbing markup into the label", async () => {
    const el = document.createElement("nds-button");
    el.textContent = "처음";
    document.body.appendChild(el);
    await flush();

    el.innerHTML = '<span class="ico"></span>다시 시도';
    await flush();

    const inner = el.querySelector("button");
    expect(inner).toBeTruthy();
    const label = el.querySelector(".nds-button__label")!;
    expect(label.querySelector(".ico")).toBeTruthy();
    expect(label.textContent).toBe("다시 시도");
    expect(el.firstChild).toBe(inner);
  });

  it("sets all 14 CSS variables that React Button injects inline", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("color", "primary");
    el.setAttribute("variant", "solid");
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("button")!;
    const expectedVars = [
      "--nds-button-height",
      "--nds-button-padding-x",
      "--nds-button-gap",
      "--nds-button-font-size",
      "--nds-button-line-height",
      "--nds-button-icon-size",
      "--nds-button-font-weight",
      "--nds-button-width",
      "--nds-button-background",
      "--nds-button-text-color",
      "--nds-button-border-color",
      "--nds-button-hover-background",
      "--nds-button-hover-text-color",
      "--nds-button-hover-border-color",
    ];
    for (const k of expectedVars) {
      expect(inner.style.getPropertyValue(k), `missing ${k}`).not.toBe("");
    }
  });

  it("host element uses display:contents (no layout impact)", async () => {
    const el = document.createElement("nds-button");
    document.body.appendChild(el);
    await flush();
    expect(el.style.display).toBe("contents");
    // host 자체에는 .nds-button 클래스가 박히면 안 됨 — 룰 이중 매칭 방지
    expect(el.classList.contains("nds-button")).toBe(false);
  });

  it("disabled attribute toggles inner.disabled and changes background", async () => {
    const enabled = document.createElement("nds-button");
    enabled.setAttribute("color", "primary");
    enabled.setAttribute("variant", "solid");
    enabled.setAttribute("size", "lg");
    document.body.appendChild(enabled);

    const disabled = document.createElement("nds-button");
    disabled.setAttribute("color", "primary");
    disabled.setAttribute("variant", "solid");
    disabled.setAttribute("size", "lg");
    disabled.setAttribute("disabled", "");
    document.body.appendChild(disabled);

    await flush();

    const eInner = enabled.querySelector("button")!;
    const dInner = disabled.querySelector("button")!;

    expect(eInner.disabled).toBe(false);
    expect(dInner.disabled).toBe(true);
    expect(eInner.style.getPropertyValue("--nds-button-background")).not.toBe(
      dInner.style.getPropertyValue("--nds-button-background"),
    );
  });

  it("full-width attribute sets width var to 100%", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("full-width", "");
    document.body.appendChild(el);
    await flush();
    const inner = el.querySelector("button")!;
    expect(inner.style.getPropertyValue("--nds-button-width")).toBe("100%");
  });

  it("re-renders when attributes change at runtime", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("color", "primary");
    el.setAttribute("variant", "solid");
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await flush();

    el.setAttribute("variant", "outlined");
    el.setAttribute("color", "secondary");
    await flush();

    const inner = el.querySelector("button")!;
    expect(inner.dataset.variant).toBe("outlined");
    expect(inner.dataset.color).toBe("secondary");
  });

  it("falls back to defaults for invalid attribute values", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("color", "bogus");
    el.setAttribute("variant", "weird");
    el.setAttribute("size", "huge");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("button")!;
    expect(inner.dataset.color).toBe("primary");
    expect(inner.dataset.variant).toBe("solid");
    expect(inner.dataset.size).toBe("lg");
  });

  it("forwards a11y / form attributes to the inner button", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("aria-label", "예약");
    el.setAttribute("aria-pressed", "true");
    el.setAttribute("name", "cta");
    el.setAttribute("value", "book");
    el.setAttribute("form", "main-form");
    el.setAttribute("title", "지금 예약");
    el.setAttribute("tabindex", "0");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("button")!;
    expect(inner.getAttribute("aria-label")).toBe("예약");
    expect(inner.getAttribute("aria-pressed")).toBe("true");
    expect(inner.getAttribute("name")).toBe("cta");
    expect(inner.getAttribute("value")).toBe("book");
    expect(inner.getAttribute("form")).toBe("main-form");
    expect(inner.getAttribute("title")).toBe("지금 예약");
    expect(inner.getAttribute("tabindex")).toBe("0");
  });

  it("removes forwarded attributes when host removes them", async () => {
    const el = document.createElement("nds-button");
    el.setAttribute("aria-label", "처음");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector("button")!.getAttribute("aria-label")).toBe("처음");

    el.removeAttribute("aria-label");
    await flush();
    expect(el.querySelector("button")!.hasAttribute("aria-label")).toBe(false);
  });

  it("type attribute supports submit and reset, defaults to button", async () => {
    const submit = document.createElement("nds-button");
    submit.setAttribute("type", "submit");
    document.body.appendChild(submit);

    const reset = document.createElement("nds-button");
    reset.setAttribute("type", "reset");
    document.body.appendChild(reset);

    const bogus = document.createElement("nds-button");
    bogus.setAttribute("type", "junk");
    document.body.appendChild(bogus);

    await flush();

    expect((submit.querySelector("button") as HTMLButtonElement).type).toBe("submit");
    expect((reset.querySelector("button") as HTMLButtonElement).type).toBe("reset");
    expect((bogus.querySelector("button") as HTMLButtonElement).type).toBe("button");
  });
});
