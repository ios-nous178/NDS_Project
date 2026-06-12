/**
 * nds-header / nds-header-search — 검색 input 포커스 보존 계약.
 *
 * 헤더 검색 input 에 타이핑 → host attribute 갱신(placeholder, header-title 등)이
 * 돌아도 input 이 재생성되지 않는지(mount-once) 잠근다. nds-header 는 mount 시
 * children 을 슬롯으로 한 번만 분배하고 update() 는 표시 토글만 한다.
 */

import { describe, expect, it } from "vitest";
import "../src/components/nds-header.js";
import {
  expectAttrUpdatePreservesFocus,
  expectAttrUpdatePreservesNode,
  expectTypingPreservesFocus,
  flush,
} from "./helpers/focus-preservation.js";

const SEARCH_FIELD = ".nds-header__search input";

async function mountWebHeader() {
  const header = document.createElement("nds-header");
  header.setAttribute("variant", "web");
  header.innerHTML = `
    <nds-header-main-bar>
      <nds-header-logo src="/logo.svg"></nds-header-logo>
      <nds-header-search placeholder="검색"></nds-header-search>
    </nds-header-main-bar>`;
  document.body.appendChild(header);
  await flush();
  return header;
}

describe("nds-header — focus preservation", () => {
  it("typing keeps the same search input node, focus, and cursor", async () => {
    const header = await mountWebHeader();
    await expectTypingPreservesFocus({
      requery: () => header.querySelector<HTMLInputElement>(SEARCH_FIELD),
    });
  });

  it("search placeholder 갱신이 입력 중인 검색어/포커스를 보존한다", async () => {
    const header = await mountWebHeader();
    const search = header.querySelector("nds-header-search")!;
    const target = { requery: () => header.querySelector<HTMLInputElement>(SEARCH_FIELD) };

    await expectTypingPreservesFocus(target, "명상");
    await expectAttrUpdatePreservesFocus(search, target, "placeholder", "콘텐츠 검색");
  });

  it("host header attribute(header-title/max-width) 갱신에도 검색 input 이 살아 있다", async () => {
    const header = await mountWebHeader();
    const requery = () => header.querySelector<HTMLInputElement>(SEARCH_FIELD);

    await expectAttrUpdatePreservesNode(header, requery, "header-title", "상세보기");
    await expectAttrUpdatePreservesNode(header, requery, "max-width", "1200");
    expect(header.querySelector("header")?.style.getPropertyValue("--nds-header-max-width")).toBe(
      "1200px",
    );
  });
});
