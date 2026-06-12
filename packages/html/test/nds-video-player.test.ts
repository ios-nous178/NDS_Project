/**
 * nds-video-player — 커스텀 컨트롤(range input) 포커스 보존 계약.
 *
 * timeupdate / attribute 갱신마다 도는 _renderOverlay() 가 시크 range input 을
 * 재생성하지 않는지(mount-once) 잠근다. jsdom 에는 미디어 재생이 없으므로
 * video 요소에 play 이벤트를 직접 쏴서 "재생 중" 상태(컨트롤 노출)만 만든다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-video-player.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const RANGE = "input.nds-video-player__input";

async function mountPlaying(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-video-player");
  el.setAttribute("src", "/intro.mp4");
  // autoplay → _interacted=true (재생 중일 때만 커스텀 컨트롤이 노출된다)
  el.setAttribute("autoplay", "");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  // jsdom 은 실제 재생이 없으니 play 이벤트만 흉내 → _playing=true
  el.querySelector("video")!.dispatchEvent(new Event("play"));
  await flush();
  return el;
}

describe("nds-video-player — focus preservation", () => {
  it("재생 중 표시 attribute(title/duration-label) 갱신에도 시크 range input 노드가 보존된다", async () => {
    const el = await mountPlaying({ title: "시작하기" });
    const controls = el.querySelector<HTMLElement>(".nds-video-player__controls");
    expect(controls?.style.display).toBe("");

    const requery = () => el.querySelector<HTMLInputElement>(RANGE);
    await expectAttrUpdatePreservesNode(el, requery, "title", "시작하기 2강");
    await expectAttrUpdatePreservesNode(el, requery, "duration-label", "3:42");
    expect(el.querySelector(".nds-video-player__duration")?.textContent).toBe("3:42");
  });

  it("timeupdate(재생 진행) 가 돌아도 range input 이 재생성되지 않는다", async () => {
    const el = await mountPlaying();
    const input = el.querySelector<HTMLInputElement>(RANGE)!;
    input.focus();

    // 매 timeupdate 마다 _renderOverlay 가 돈다 — input 은 같은 노드여야 한다.
    el.querySelector("video")!.dispatchEvent(new Event("timeupdate"));
    await flush();
    expect(el.querySelector<HTMLInputElement>(RANGE)).toBe(input);
    expect(document.activeElement).toBe(input);
  });
});
