/**
 * nds-likert-scale DOM 구조 + 변경 이벤트 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsLikertScale } from "../src/components/nds-likert-scale.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

const OPTIONS = JSON.stringify([
  { value: "1", label: "전혀" },
  { value: "2" },
  { value: "3", label: "보통" },
  { value: "4" },
  { value: "5", label: "매우" },
]);

describe("nds-likert-scale — DOM parity with React LikertScale", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-likert-scale")).toBe(NdsLikertScale);
  });

  it("renders radiogroup with track, dots, item labels", async () => {
    const el = document.createElement("nds-likert-scale");
    el.setAttribute("options", OPTIONS);
    el.setAttribute("value", "3");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-likert__root") as HTMLElement;
    expect(root.getAttribute("role")).toBe("radiogroup");
    expect(root.dataset.slot).toBe("root");

    const track = root.querySelector(".nds-likert__track")!;
    expect(track.querySelector(".nds-likert__line")).not.toBeNull();

    const items = track.querySelectorAll<HTMLLabelElement>(".nds-likert__item");
    expect(items).toHaveLength(5);
    expect(items[2].dataset.checked).toBe("true");
    const dot2 = items[2].querySelector(".nds-likert__dot") as HTMLElement;
    expect(dot2.dataset.checked).toBe("true");

    const inputs = root.querySelectorAll<HTMLInputElement>("input.nds-likert__input");
    expect(inputs[2].checked).toBe(true);
    expect(inputs[0].checked).toBe(false);

    expect(items[0].querySelector(".nds-likert__item-label")!.textContent).toBe("전혀");
    expect(items[1].querySelector(".nds-likert__item-label")).toBeNull();
    expect(el.style.display).toBe("contents");
  });

  it("radio change updates value attribute and dispatches likert-change", async () => {
    const el = document.createElement("nds-likert-scale");
    el.setAttribute("options", OPTIONS);
    el.setAttribute("value", "1");
    document.body.appendChild(el);
    await flush();

    let detail: { value: string } | null = null;
    el.addEventListener("likert-change", (e) => {
      detail = (e as CustomEvent<{ value: string }>).detail;
    });

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-likert__input");
    inputs[3].click();
    await flush();

    expect(detail).toEqual({ value: "4" });
    expect(el.getAttribute("value")).toBe("4");
    const refreshedItems = el.querySelectorAll<HTMLLabelElement>(".nds-likert__item");
    expect(refreshedItems[3].dataset.checked).toBe("true");
    expect(refreshedItems[0].dataset.checked).toBe("false");
  });

  it("disabled blocks selection", async () => {
    const el = document.createElement("nds-likert-scale");
    el.setAttribute("options", OPTIONS);
    el.setAttribute("value", "1");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-likert__input");
    inputs.forEach((input) => expect(input.disabled).toBe(true));

    let fired = 0;
    el.addEventListener("likert-change", () => fired++);
    inputs[2].dispatchEvent(new Event("change"));
    expect(fired).toBe(0);
  });

  it("renders anchors when start/end labels provided", async () => {
    const el = document.createElement("nds-likert-scale");
    el.setAttribute("options", OPTIONS);
    el.setAttribute("start-label", "전혀 아님");
    el.setAttribute("end-label", "매우 그렇다");
    document.body.appendChild(el);
    await flush();

    const anchors = el.querySelector(".nds-likert__anchors")!;
    const spans = anchors.querySelectorAll(".nds-likert__anchor");
    expect(spans).toHaveLength(2);
    expect(spans[0].textContent).toBe("전혀 아님");
    expect(spans[1].textContent).toBe("매우 그렇다");
  });

  it("omits anchors when neither label provided", async () => {
    const el = document.createElement("nds-likert-scale");
    el.setAttribute("options", OPTIONS);
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-likert__anchors")).toBeNull();
  });

  it("uses provided name for radio name and input ids", async () => {
    const el = document.createElement("nds-likert-scale");
    el.setAttribute("options", OPTIONS);
    el.setAttribute("name", "mood");
    document.body.appendChild(el);
    await flush();

    const inputs = el.querySelectorAll<HTMLInputElement>("input.nds-likert__input");
    inputs.forEach((input) => expect(input.name).toBe("mood"));
    expect(inputs[0].id).toBe("mood-1");
  });

  it("invalid options JSON renders no items", async () => {
    const el = document.createElement("nds-likert-scale");
    el.setAttribute("options", "not-json");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelectorAll(".nds-likert__item")).toHaveLength(0);
  });
});
