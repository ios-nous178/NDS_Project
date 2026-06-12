/**
 * nds-inspector — outline 체크박스 포커스 보존 계약.
 *
 * 패널 내부 합성(checkbox)이 host attribute 갱신(no-outline) → update() 경로에서
 * 재생성되지 않는지(mount-once) 잠근다. 스캔/outline 주입 동작이 아니라
 * DOM 골격 보존만 검증한다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-inspector.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const OUTLINE_CHECK = 'input[type="checkbox"]';

async function mountEnabled() {
  const el = document.createElement("nds-inspector");
  document.body.appendChild(el);
  await flush();
  // floating 토글 버튼 클릭으로 패널 오픈 (checkbox 가 focus 가능해진다)
  el.querySelector<HTMLButtonElement>("button")!.click();
  await flush();
  return el;
}

describe("nds-inspector — focus preservation", () => {
  it("no-outline 갱신에도 outline 체크박스 노드가 보존된다", async () => {
    const el = await mountEnabled();
    const requery = () => el.querySelector<HTMLInputElement>(OUTLINE_CHECK);
    expect(requery()!.checked).toBe(true);

    await expectAttrUpdatePreservesNode(el, requery, "no-outline", "");
    expect(requery()!.checked).toBe(false);
  });

  it("default-enabled 갱신(스캔 트리거)에도 체크박스가 살아 있다", async () => {
    const el = await mountEnabled();
    const requery = () => el.querySelector<HTMLInputElement>(OUTLINE_CHECK);

    await expectAttrUpdatePreservesNode(el, requery, "default-enabled", "");
  });
});
