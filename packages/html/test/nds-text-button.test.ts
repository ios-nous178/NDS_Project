import { describe, expect, it } from "vitest";
import { NdsTextButton } from "../src/components/nds-text-button.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-text-button", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-text-button")).toBe(NdsTextButton);
  });

  it("renders label and default medium sizing", async () => {
    const el = document.createElement("nds-text-button");
    el.setAttribute("label", "더보기");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button") as HTMLButtonElement;
    expect(button.className).toBe("nds-text-button");
    expect(button.dataset.slot).toBe("root");
    expect(button.dataset.size).toBe("medium");
    expect(button.type).toBe("button");
    expect(button.style.getPropertyValue("--nds-text-button-font-size")).toBe("14px");
    expect(el.querySelector(".nds-text-button__label")?.textContent).toBe("더보기");
    expect(el.style.display).toBe("contents");
  });

  it("supports large size and package icons", async () => {
    const el = document.createElement("nds-text-button");
    el.setAttribute("label", "이동");
    el.setAttribute("size", "large");
    el.setAttribute("left-icon", "InfoIcon");
    el.setAttribute("right-icon", "ChevronRightIcon");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button") as HTMLButtonElement;
    const icons = el.querySelectorAll(".nds-text-button__icon svg");
    expect(button.dataset.size).toBe("large");
    expect(button.style.getPropertyValue("--nds-text-button-font-size")).toBe("16px");
    expect(icons).toHaveLength(2);
    expect(icons[0]?.getAttribute("width")).toBe("16");
  });

  it("슬롯 텍스트로 라벨을 줘도 re-render 시 중복되지 않는다 (회귀: '라벨라벨')", async () => {
    const el = document.createElement("nds-text-button");
    el.textContent = "방법 다시 선택";
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector(".nds-text-button__label")?.textContent).toBe("방법 다시 선택");

    // 어떤 속성 변경이든 re-render 를 유발 → 라벨이 두 배로 늘면 회귀
    el.setAttribute("size", "large");
    await flush();
    expect(el.querySelector(".nds-text-button__label")?.textContent).toBe("방법 다시 선택");
    expect(el.textContent).toBe("방법 다시 선택");
  });

  it("forwards button attributes and disabled state", async () => {
    const el = document.createElement("nds-text-button");
    el.setAttribute("label", "제출");
    el.setAttribute("type", "submit");
    el.setAttribute("name", "intent");
    el.setAttribute("value", "save");
    el.setAttribute("aria-label", "저장하기");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const button = el.querySelector("button") as HTMLButtonElement;
    expect(button.type).toBe("submit");
    expect(button.name).toBe("intent");
    expect(button.value).toBe("save");
    expect(button.getAttribute("aria-label")).toBe("저장하기");
    expect(button.disabled).toBe(true);
  });
});
