/**
 * Phase 1 primitives sanity check — icon-button / badge / chip / card / list / list-item.
 * DOM 구조 & 핵심 attribute 처리만 확인. 시각 동등성은 별도 fixture HTML 로 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsBadge } from "../src/components/nds-badge.js";
import { NdsCard } from "../src/components/nds-card.js";
import { NdsChip } from "../src/components/nds-chip.js";
import { NdsIconButton } from "../src/components/nds-icon-button.js";
import { NdsList, NdsListItem } from "../src/components/nds-list.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-icon-button", () => {
  it("registers", () => {
    expect(customElements.get("nds-icon-button")).toBe(NdsIconButton);
  });

  it("renders inner button with size vars + forwards aria-label", async () => {
    const el = document.createElement("nds-icon-button");
    el.setAttribute("size", "medium");
    el.setAttribute("aria-label", "닫기");
    document.body.appendChild(el);
    await flush();

    const inner = el.querySelector("button")!;
    expect(inner.classList.contains("nds-icon-button")).toBe(true);
    expect(inner.dataset.size).toBe("medium");
    expect(inner.style.getPropertyValue("--nds-icon-button-size")).toBe("28px");
    expect(inner.style.getPropertyValue("--nds-icon-button-icon-size")).toBe("20px");
    expect(inner.getAttribute("aria-label")).toBe("닫기");
  });
});

describe("nds-badge", () => {
  it("registers", () => {
    expect(customElements.get("nds-badge")).toBe(NdsBadge);
  });

  it("renders span.nds-badge with data-attrs (색·치수는 styles CSS) + label child", async () => {
    const el = document.createElement("nds-badge");
    el.setAttribute("variant", "fill");
    el.setAttribute("color", "brand");
    el.setAttribute("size", "lg");
    el.setAttribute("shape", "pill");
    el.textContent = "NEW";
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-badge") as HTMLSpanElement;
    expect(root).toBeTruthy();
    // 색(variant×color)·치수(size)·shape 라운드는 @nudge-design/styles 의 .nds-badge
    // CSS 룰이 data-attr 로 합성 — WC 는 data-attr 만 set, 인라인 색/치수는 더 이상 안 박힌다.
    expect(root.dataset.variant).toBe("fill");
    expect(root.dataset.color).toBe("brand");
    expect(root.dataset.size).toBe("lg");
    expect(root.dataset.shape).toBe("pill");
    expect(root.style.height).toBe("");
    expect(root.style.padding).toBe("");
    expect(root.style.background).toBe("");
    expect(root.style.color).toBe("");

    const label = el.querySelector(".nds-badge__label")!;
    expect(label.textContent).toBe("NEW");
  });
});

describe("nds-chip", () => {
  it("registers", () => {
    expect(customElements.get("nds-chip")).toBe(NdsChip);
  });

  it("renders chip root + label, no interactive role by default", async () => {
    const el = document.createElement("nds-chip");
    el.textContent = "태그";
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-chip__root") as HTMLDivElement;
    expect(root).toBeTruthy();
    expect(root.dataset.interactive).toBe("false");
    expect(root.hasAttribute("role")).toBe(false);
    expect(el.querySelector(".nds-chip__label")!.textContent).toBe("태그");
  });

  it("interactive attribute adds button role + dispatches chip-click on Enter", async () => {
    const el = document.createElement("nds-chip");
    el.setAttribute("interactive", "");
    el.textContent = "선택";
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-chip__root") as HTMLDivElement;
    expect(root.getAttribute("role")).toBe("button");
    expect(root.getAttribute("tabindex")).toBe("0");

    let received = false;
    el.addEventListener("chip-click", () => (received = true));
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(received).toBe(true);
  });

  it("removable attribute renders remove button + dispatches chip-remove", async () => {
    const el = document.createElement("nds-chip");
    el.setAttribute("removable", "");
    el.textContent = "제거";
    document.body.appendChild(el);
    await flush();

    const removeBtn = el.querySelector(".nds-chip__remove") as HTMLButtonElement;
    expect(removeBtn).toBeTruthy();

    let received = false;
    el.addEventListener("chip-remove", () => (received = true));
    removeBtn.click();
    expect(received).toBe(true);
  });

  it("disabled hides remove button + suppresses click events", async () => {
    const el = document.createElement("nds-chip");
    el.setAttribute("interactive", "");
    el.setAttribute("removable", "");
    el.setAttribute("disabled", "");
    el.textContent = "off";
    document.body.appendChild(el);
    await flush();

    expect(el.querySelector(".nds-chip__remove")).toBeNull();
    const root = el.querySelector(".nds-chip__root") as HTMLDivElement;
    let received = false;
    el.addEventListener("chip-click", () => (received = true));
    root.click();
    expect(received).toBe(false);
  });
});

describe("nds-card", () => {
  it("registers", () => {
    expect(customElements.get("nds-card")).toBe(NdsCard);
  });

  it("wraps children in div.nds-card__root with variant", async () => {
    const el = document.createElement("nds-card");
    el.setAttribute("variant", "outlined");
    el.innerHTML = '<p class="nds-card__title">제목</p>';
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-card__root") as HTMLDivElement;
    expect(root).toBeTruthy();
    expect(root.dataset.variant).toBe("outlined");
    expect(root.querySelector(".nds-card__title")!.textContent).toBe("제목");
  });

  it("clickable adds role/tabindex + dispatches card-click on Enter", async () => {
    const el = document.createElement("nds-card");
    el.setAttribute("clickable", "");
    el.innerHTML = "<p>body</p>";
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-card__root") as HTMLDivElement;
    expect(root.getAttribute("role")).toBe("button");
    expect(root.getAttribute("tabindex")).toBe("0");

    let received = false;
    el.addEventListener("card-click", () => (received = true));
    root.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(received).toBe(true);
  });
});

describe("nds-list / nds-list-item", () => {
  it("registers both", () => {
    expect(customElements.get("nds-list")).toBe(NdsList);
    expect(customElements.get("nds-list-item")).toBe(NdsListItem);
  });

  it("nds-list wraps children in ul.nds-list__root with variant", async () => {
    const el = document.createElement("nds-list");
    el.setAttribute("variant", "card");
    document.body.appendChild(el);
    await flush();
    const ul = el.querySelector("ul.nds-list__root") as HTMLUListElement;
    expect(ul).toBeTruthy();
    expect(ul.dataset.variant).toBe("card");
    expect(ul.getAttribute("role")).toBe("list");
  });

  it("nds-list-item interactive dispatches list-item-select", async () => {
    const el = document.createElement("nds-list-item");
    el.setAttribute("interactive", "");
    document.body.appendChild(el);
    await flush();

    const li = el.querySelector("li.nds-list-item") as HTMLLIElement;
    expect(li.getAttribute("role")).toBe("button");
    expect(li.getAttribute("tabindex")).toBe("0");

    let received = false;
    el.addEventListener("list-item-select", () => (received = true));
    li.click();
    expect(received).toBe(true);
  });

  it("nds-list-item disabled blocks events + removes tabindex", async () => {
    const el = document.createElement("nds-list-item");
    el.setAttribute("interactive", "");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await flush();

    const li = el.querySelector("li.nds-list-item") as HTMLLIElement;
    expect(li.hasAttribute("tabindex")).toBe(false);
    expect(li.getAttribute("aria-disabled")).toBe("true");

    let received = false;
    el.addEventListener("list-item-select", () => (received = true));
    li.click();
    expect(received).toBe(false);
  });
});
