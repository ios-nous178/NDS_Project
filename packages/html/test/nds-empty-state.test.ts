import { describe, expect, it } from "vitest";
import { NdsEmptyState } from "../src/components/nds-empty-state.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-empty-state", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-empty-state")).toBe(NdsEmptyState);
  });

  it("renders default icon, title, description, and action slots", async () => {
    const el = document.createElement("nds-empty-state");
    el.setAttribute("title", "내역이 없어요");
    el.setAttribute("description", "조건을 바꿔\n다시 확인해 주세요");
    el.setAttribute("action", "다시 시도");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-empty-state__root") as HTMLElement;
    const icon = el.querySelector(".nds-empty-state__icon") as HTMLElement;
    const title = el.querySelector(".nds-empty-state__title")!;
    const desc = el.querySelector(".nds-empty-state__description")!;
    const action = el.querySelector(".nds-empty-state__action")!;

    expect(root.dataset.slot).toBe("root");
    expect(icon.dataset.slot).toBe("icon");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("svg")).toBeTruthy();
    expect(title.textContent).toBe("내역이 없어요");
    expect(desc.querySelector("br")).toBeTruthy();
    expect(action.textContent).toBe("다시 시도");
    expect(el.style.display).toBe("contents");
  });

  it("supports min-height CSS variable and hide-icon", async () => {
    const el = document.createElement("nds-empty-state");
    el.setAttribute("min-height", "320");
    el.setAttribute("hide-icon", "");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-empty-state__root") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-empty-state-min-height")).toBe("320px");
    expect(el.querySelector(".nds-empty-state__icon")).toBeNull();
  });

  it("uses child nodes as action content when action attr is absent", async () => {
    const el = document.createElement("nds-empty-state");
    el.innerHTML = `<button>추가하기</button>`;
    document.body.appendChild(el);
    await flush();

    const action = el.querySelector(".nds-empty-state__action")!;
    expect(action.querySelector("button")?.textContent).toBe("추가하기");
  });

  it("forwards a11y attributes to root", async () => {
    const el = document.createElement("nds-empty-state");
    el.setAttribute("aria-label", "빈 목록");
    el.setAttribute("title", "목록 없음");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-empty-state__root")!;
    expect(root.getAttribute("aria-label")).toBe("빈 목록");
    expect(root.getAttribute("title")).toBe("목록 없음");
  });
});
