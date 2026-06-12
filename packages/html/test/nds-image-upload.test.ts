/**
 * nds-image-upload — 숨겨진 file input 포커스 보존 계약.
 *
 * 외부 attribute 갱신(state / upload-label 등) → update() 경로가 file input 을
 * 재생성하지 않는지(mount-once) 잠근다. 파일 dialog 자체는 jsdom 밖 —
 * DOM 골격 보존만 검증한다.
 *
 * 주의: jsdom 은 inline display:none 요소를 focus 불가로 보므로, 포커스 단언
 * 전에 테스트에서만 input 을 잠시 노출한다 (update() 는 display 를 건드리지 않는다).
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-image-upload.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const FILE_INPUT = 'input[type="file"]';

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-image-upload");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  // jsdom focus 제약 우회 — 숨김 해제 (컴포넌트 update 는 이 값을 다시 쓰지 않는다)
  el.querySelector<HTMLInputElement>(FILE_INPUT)!.style.display = "";
  return el;
}

describe("nds-image-upload — focus preservation", () => {
  it("state 전환(empty→uploaded→error)에도 file input 노드가 보존된다", async () => {
    const el = await mount({ "image-url": "/avatar.png" });
    const requery = () => el.querySelector<HTMLInputElement>(FILE_INPUT);

    await expectAttrUpdatePreservesNode(el, requery, "state", "uploaded");
    expect(el.querySelector<HTMLImageElement>(".nds-image-upload__preview-img")?.src).toContain(
      "/avatar.png",
    );

    await expectAttrUpdatePreservesNode(el, requery, "state", "error");
    expect(el.querySelector(".nds-image-upload__helper")?.textContent).toContain(
      "이미지를 등록해 주세요.",
    );
  });

  it("표시 텍스트(upload-label/size-hint/helper-text) 갱신에도 file input 이 살아 있다", async () => {
    const el = await mount();
    const requery = () => el.querySelector<HTMLInputElement>(FILE_INPUT);

    await expectAttrUpdatePreservesNode(el, requery, "upload-label", "로고 업로드");
    await expectAttrUpdatePreservesNode(el, requery, "size-hint", "사이즈 : 400*400 px 권장");
    await expectAttrUpdatePreservesNode(el, requery, "helper-text", "로고를 올려주세요.");
    expect(el.querySelector(".nds-image-upload__upload-btn")?.textContent).toBe("로고 업로드");
  });
});
