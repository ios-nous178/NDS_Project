/**
 * nds-address-picker DOM 구조 + 검색 / 선택 / 상세 입력 동작 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsAddressPicker } from "../src/components/nds-address-picker.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

const RESULTS = JSON.stringify([
  {
    roadAddress: "서울특별시 강남구 테헤란로 123",
    jibunAddress: "역삼동 123-45",
    postalCode: "06234",
  },
  { roadAddress: "서울특별시 강남구 봉은사로 456" },
]);

describe("nds-address-picker — DOM parity with React AddressPicker", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-address-picker")).toBe(NdsAddressPicker);
  });

  it("renders label + search row with input and 검색 button", async () => {
    const el = document.createElement("nds-address-picker");
    el.setAttribute("label", "배송지");
    el.setAttribute("query", "테헤란");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-address-picker") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    expect(root.querySelector(".nds-address-picker__label")!.textContent).toBe("배송지");

    const input = root.querySelector("input.nds-address-picker__input") as HTMLInputElement;
    expect(input.value).toBe("테헤란");
    expect(input.placeholder).toBe("도로명 또는 지번 주소");

    // 검색 버튼은 DS Button(nds-button) 합성 (size="field")
    const button = root.querySelector("nds-button") as HTMLElement;
    expect(button).not.toBeNull();
    expect(button.getAttribute("size")).toBe("field");
    expect(button.textContent?.trim()).toBe("검색");
    expect(button.hasAttribute("disabled")).toBe(false);

    // 검색 전에는 결과 영역이 표시되지 않음
    expect(root.querySelector(".nds-address-picker__result")).toBeNull();
    expect(el.style.display).toBe("contents");
  });

  it("typing updates query attribute and emits address-query", async () => {
    const el = document.createElement("nds-address-picker");
    document.body.appendChild(el);
    await flush();

    const events: string[] = [];
    el.addEventListener("address-query", (e) => {
      events.push((e as CustomEvent<{ query: string }>).detail.query);
    });

    const input = el.querySelector("input.nds-address-picker__input") as HTMLInputElement;
    input.value = "강남";
    input.dispatchEvent(new Event("input"));
    expect(events).toEqual(["강남"]);
    expect(el.getAttribute("query")).toBe("강남");
  });

  it("clicking 검색 button dispatches address-search and shows result block", async () => {
    const el = document.createElement("nds-address-picker");
    el.setAttribute("query", "강남");
    document.body.appendChild(el);
    await flush();

    const searches: string[] = [];
    el.addEventListener("address-search", (e) => {
      searches.push((e as CustomEvent<{ query: string }>).detail.query);
    });

    (el.querySelector("nds-button") as HTMLElement).click();
    await flush();
    expect(searches).toEqual(["강남"]);

    // 결과가 비어 있어도 empty 메시지가 보여야 함.
    const result = el.querySelector(".nds-address-picker__result") as HTMLElement;
    expect(result).not.toBeNull();
    expect(result.dataset.empty).toBe("true");
    expect(result.textContent).toBe("검색 결과가 없어요");
  });

  it("Enter in input also triggers search", async () => {
    const el = document.createElement("nds-address-picker");
    el.setAttribute("query", "x");
    document.body.appendChild(el);
    await flush();

    let count = 0;
    el.addEventListener("address-search", () => count++);
    const input = el.querySelector("input.nds-address-picker__input") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(count).toBe(1);
  });

  it("results attribute renders list and clicking item emits address-change", async () => {
    const el = document.createElement("nds-address-picker");
    el.setAttribute("results", RESULTS);
    document.body.appendChild(el);
    await flush();

    const items = el.querySelectorAll(".nds-address-picker__result-item");
    expect(items).toHaveLength(2);
    expect(items[0].querySelector("strong")!.textContent).toBe("서울특별시 강남구 테헤란로 123");
    expect(items[0].querySelectorAll("span")[0].textContent).toBe("지번: 역삼동 123-45");
    expect(items[0].querySelectorAll("span")[1].textContent).toBe("우편번호: 06234");

    let detail: { value: unknown } | null = null;
    el.addEventListener("address-change", (e) => {
      detail = (e as CustomEvent<{ value: unknown }>).detail;
    });
    (items[1] as HTMLElement).click();
    await flush();

    expect(el.hasAttribute("value")).toBe(true);
    const parsed = JSON.parse(el.getAttribute("value")!);
    expect(parsed.address.roadAddress).toBe("서울특별시 강남구 봉은사로 456");
    expect(parsed.detail).toBe("");
    expect(detail).not.toBeNull();
  });

  it("detail input updates value JSON", async () => {
    const el = document.createElement("nds-address-picker");
    el.setAttribute(
      "value",
      JSON.stringify({
        address: { roadAddress: "서울시 강남구 테헤란로 123", postalCode: "06234" },
        detail: "",
      }),
    );
    document.body.appendChild(el);
    await flush();

    const detail = el.querySelector(".nds-address-picker__detail") as HTMLElement;
    expect(detail).not.toBeNull();
    expect(detail.querySelector("strong")!.textContent).toBe("서울시 강남구 테헤란로 123");

    const input = detail.querySelector("input") as HTMLInputElement;
    input.value = "101동 202호";
    input.dispatchEvent(new Event("input"));
    await flush();
    const parsed = JSON.parse(el.getAttribute("value")!);
    expect(parsed.detail).toBe("101동 202호");
    expect(parsed.address.postalCode).toBe("06234");
  });

  it("loading disables button and shows progress label", async () => {
    const el = document.createElement("nds-address-picker");
    el.setAttribute("loading", "");
    document.body.appendChild(el);
    await flush();
    const button = el.querySelector("nds-button") as HTMLElement;
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.textContent?.trim()).toBe("검색 중...");
  });

  it("error sets input data-error and helper data-error", async () => {
    const el = document.createElement("nds-address-picker");
    el.setAttribute("helper-text", "주소를 선택하세요");
    el.setAttribute("error", "");
    document.body.appendChild(el);
    await flush();
    const input = el.querySelector("input.nds-address-picker__input") as HTMLInputElement;
    expect(input.dataset.error).toBe("true");
    const helper = el.querySelector(".nds-address-picker__helper") as HTMLElement;
    expect(helper.dataset.error).toBe("true");
    expect(helper.textContent).toBe("주소를 선택하세요");
  });
});
