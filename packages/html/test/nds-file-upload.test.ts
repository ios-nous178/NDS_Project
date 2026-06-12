/**
 * nds-file-upload — 숨겨진 file input 포커스 보존 계약.
 *
 * 외부 attribute 갱신(description / error-message) → update() 경로가 drop 존을
 * (file input 째로) 떼었다 붙이지 않는지(mount-once) 잠근다. root.replaceChildren
 * 으로 drop 을 재삽입하면 그 순간 포커스가 유실된다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-file-upload.js";
import { expectAttrUpdatePreservesNode, flush } from "./helpers/focus-preservation.js";

const FILE_INPUT = "input.nds-file-upload__input";

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement("nds-file-upload");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  await flush();
  return el;
}

describe("nds-file-upload — focus preservation", () => {
  it("description / error-message 갱신에도 file input 노드가 보존된다", async () => {
    const el = await mount({ accept: "image/*", description: "PDF · 최대 10MB" });
    const requery = () => el.querySelector<HTMLInputElement>(FILE_INPUT);

    await expectAttrUpdatePreservesNode(el, requery, "description", "JPG · 최대 5MB");
    await expectAttrUpdatePreservesNode(el, requery, "error-message", "용량을 확인하세요");
    const error = el.querySelector<HTMLElement>(".nds-file-upload__error");
    expect(error?.textContent).toBe("용량을 확인하세요");
    expect(error?.style.display).toBe("");
  });

  it("파일 목록 갱신(setFiles) 이 돌아도 file input 이 살아 있다", async () => {
    const el = await mount({ multiple: "" });
    const input = el.querySelector<HTMLInputElement>(FILE_INPUT)!;
    input.focus();

    type WithSetFiles = HTMLElement & { setFiles(files: File[]): void };
    (el as WithSetFiles).setFiles([new File(["x"], "a.txt", { type: "text/plain" })]);
    await flush();

    expect(el.querySelector<HTMLInputElement>(FILE_INPUT)).toBe(input);
    expect(document.activeElement).toBe(input);
    expect(el.querySelectorAll(".nds-file-upload__item")).toHaveLength(1);
  });
});
