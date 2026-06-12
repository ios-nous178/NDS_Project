/**
 * nds-audio-player — 시크바(range input) 포커스 보존 계약.
 *
 * 외부 attribute 갱신(title / current-time / playing 토글) → update() 경로가
 * 시크바 range input 을 재생성하지 않는지(mount-once) 잠근다. 재생 중에는
 * current-time 이 계속 갱신되므로, 여기가 재생성이면 드래그 시크가 매번 끊긴다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-audio-player.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const RANGE = "input.nds-audio-player__input";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-audio-player");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-audio-player — focus preservation", () => {
  it("title / current-time 갱신에도 시크바 range input 노드가 보존된다", async () => {
    const el = await mount({ title: "아침 명상", duration: "600", "current-time": "45" });
    const requery = () => el.querySelector<HTMLInputElement>(RANGE);

    await expectAttrUpdatePreservesNode(el, requery, "title", "저녁 명상");
    // 재생 중 매초 갱신되는 경로 — 시크 드래그가 끊기지 않아야 한다.
    await expectAttrUpdatePreservesNode(el, requery, "current-time", "60");
    expect(requery()!.value).toBe("60");
    expect(el.querySelector(".nds-audio-player__title")?.textContent).toBe("저녁 명상");
  });

  it("playing 토글(아이콘 swap)에도 range input 이 살아 있다", async () => {
    const el = await mount({ duration: "600", skippable: "" });
    const requery = () => el.querySelector<HTMLInputElement>(RANGE);
    expect(el.querySelector<HTMLElement>('[data-slot="skip-back"]')?.style.display).toBe("");

    await expectAttrUpdatePreservesNode(el, requery, "playing", "true");
    expect(el.querySelector(".nds-audio-player__play")?.getAttribute("aria-label")).toBe(
      "일시정지",
    );
  });
});
