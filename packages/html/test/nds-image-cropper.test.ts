/**
 * nds-image-cropper — 줌 슬라이더(range input) 포커스 보존 계약.
 *
 * 외부 attribute 갱신(label / shape) → update() 경로가 줌 슬라이더를
 * 재생성하지 않는지(mount-once) 잠근다. 크롭/캔버스 동작은 jsdom 밖 —
 * 여기서는 DOM 골격 보존만 검증한다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-image-cropper.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const SLIDER = "input.nds-image-cropper__slider";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-image-cropper");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-image-cropper — focus preservation", () => {
  it("label / shape 갱신에도 줌 슬라이더 노드가 보존된다", async () => {
    const el = await mount({ src: "/photo.jpg", label: "프로필" });
    const requery = () => el.querySelector<HTMLInputElement>(SLIDER);

    await expectAttrUpdatePreservesNode(el, requery, "label", "프로필 사진");
    await expectAttrUpdatePreservesNode(el, requery, "shape", "square");
    expect(el.querySelector<HTMLElement>(".nds-image-cropper__overlay")?.dataset.shape).toBe(
      "square",
    );
  });

  it("슬라이더 조작(zoom-change) 후에도 같은 노드가 남는다", async () => {
    const el = await mount({ src: "/photo.jpg" });
    const slider = el.querySelector<HTMLInputElement>(SLIDER)!;
    slider.focus();

    slider.value = "2";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    await flush();

    expect(el.querySelector<HTMLInputElement>(SLIDER)).toBe(slider);
    expect(document.activeElement).toBe(slider);
    expect(el.querySelector(".nds-image-cropper__zoom-value")?.textContent).toBe("200%");
  });
});
