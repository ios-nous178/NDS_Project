import { describe, expect, it } from "vitest";
import {
  NdsCardBody,
  NdsCardFooter,
  NdsCardHeader,
  NdsCardThumbnail,
} from "../src/components/nds-card.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-card compound sub-elements", () => {
  it("all four sub-elements register", () => {
    expect(customElements.get("nds-card-header")).toBe(NdsCardHeader);
    expect(customElements.get("nds-card-body")).toBe(NdsCardBody);
    expect(customElements.get("nds-card-footer")).toBe(NdsCardFooter);
    expect(customElements.get("nds-card-thumbnail")).toBe(NdsCardThumbnail);
  });

  it("nds-card-header wraps children in div.nds-card__header", async () => {
    const el = document.createElement("nds-card-header");
    el.innerHTML = "<h3>제목</h3>";
    document.body.appendChild(el);
    await flush();
    const inner = el.querySelector("div.nds-card__header") as HTMLDivElement;
    expect(inner).toBeTruthy();
    expect(inner.dataset.slot).toBe("header");
    expect(inner.querySelector("h3")!.textContent).toBe("제목");
  });

  it("nds-card-body / footer wrap in correct class", async () => {
    const body = document.createElement("nds-card-body");
    const footer = document.createElement("nds-card-footer");
    body.innerHTML = "<p>본문</p>";
    footer.innerHTML = "<p>푸터</p>";
    document.body.append(body, footer);
    await flush();
    expect(body.querySelector(".nds-card__body")).toBeTruthy();
    expect(footer.querySelector(".nds-card__footer")).toBeTruthy();
  });

  it("nds-card-thumbnail honors ratio attribute", async () => {
    const t = document.createElement("nds-card-thumbnail");
    t.setAttribute("ratio", "");
    document.body.appendChild(t);
    await flush();
    const inner = t.querySelector(".nds-card__thumbnail") as HTMLDivElement;
    expect(inner.dataset.ratio).toBe("true");

    t.removeAttribute("ratio");
    await flush();
    expect(inner.dataset.ratio).toBeUndefined();
  });

  it("composes with parent nds-card without interference", async () => {
    document.body.innerHTML = `
      <nds-card variant="outlined">
        <nds-card-thumbnail><img src="x" alt="" /></nds-card-thumbnail>
        <nds-card-header><h3>타이틀</h3></nds-card-header>
        <nds-card-body><p>본문</p></nds-card-body>
        <nds-card-footer><button>액션</button></nds-card-footer>
      </nds-card>
    `;
    await flush();
    await flush();
    const root = document.querySelector(".nds-card__root")!;
    expect(root.querySelector(".nds-card__thumbnail")).toBeTruthy();
    expect(root.querySelector(".nds-card__header")).toBeTruthy();
    expect(root.querySelector(".nds-card__body")).toBeTruthy();
    expect(root.querySelector(".nds-card__footer")).toBeTruthy();
  });

  it("display:contents on host so parent layout sees inner div directly", async () => {
    const el = document.createElement("nds-card-body");
    document.body.appendChild(el);
    await flush();
    expect(el.style.display).toBe("contents");
  });
});
