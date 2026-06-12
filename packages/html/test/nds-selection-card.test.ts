/**
 * nds-selection-card — 포커스 보존 계약.
 *
 * 호스트(layout)·아이템(item-title) 표시용 attr 갱신이 포커스 중인 radio/checkbox
 * input 을 재생성하지 않는지(mount-once + refreshFromParent in-place sync) 잠근다.
 */

import { describe, it } from "vitest";
import "../src/components/nds-selection-card.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

async function mount() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <nds-selection-card mode="single" value="visa">
      <nds-selection-card-item value="visa" item-title="Visa" description="**** 1234"></nds-selection-card-item>
      <nds-selection-card-item value="mc" item-title="Mastercard" description="**** 5678"></nds-selection-card-item>
    </nds-selection-card>`;
  document.body.appendChild(wrap);
  await flush();
  return wrap.querySelector("nds-selection-card")!;
}

describe("nds-selection-card — focus preservation", () => {
  it("호스트 layout attr 갱신이 포커스 중인 아이템 input 을 재생성하지 않는다", async () => {
    const card = await mount();
    await expectAttrUpdatePreservesNode(
      card,
      () => card.querySelector<HTMLInputElement>("nds-selection-card-item input"),
      "layout",
      "horizontal",
    );
  });

  it("아이템 표시용 attr(item-title) 갱신이 포커스 중인 input 을 재생성하지 않는다", async () => {
    const card = await mount();
    const item = card.querySelector("nds-selection-card-item")!;
    await expectAttrUpdatePreservesNode(
      item,
      () => item.querySelector<HTMLInputElement>("input"),
      "item-title",
      "VISA 카드",
    );
  });
});
