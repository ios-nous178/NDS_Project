/**
 * NdsElement 베이스의 `[hidden]` 존중 회귀 테스트.
 *
 * 다수 컴포넌트가 update() 에서 `style.display = "contents"` 를 강제해 UA 기본
 * `[hidden]{display:none}` 을 인라인 스타일로 덮어버린다 → `<nds-* hidden>` 이 안 먹어
 * 빈 박스(예: nds-notice-alert message="" hidden 의 아이콘만 든 분홍 박스)가 항상 노출되던
 * 버그. 베이스가 update() 이후 마지막에 display 를 교정한다.
 *
 * nds-notice-alert 를 대표 컴포넌트로 검증한다(display:contents 강제 + 인라인 노출형).
 */

import { describe, expect, it } from "vitest";
import { NdsNoticeAlert } from "../src/index.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("NdsElement — [hidden] 존중 (display:contents 강제 위 교정)", () => {
  it("registers nds-notice-alert", () => {
    expect(customElements.get("nds-notice-alert")).toBe(NdsNoticeAlert);
  });

  it("hidden 속성이 있으면 display:none 으로 숨는다 (회귀: 빈 에러박스 항상 노출)", async () => {
    const el = document.createElement("nds-notice-alert");
    el.setAttribute("variant", "error");
    el.setAttribute("message", "");
    el.setAttribute("hidden", "");
    document.body.appendChild(el);
    await flush();
    expect(el.style.display).toBe("none");
  });

  it("hidden 제거 시 다시 보인다 (display:contents 복원)", async () => {
    const el = document.createElement("nds-notice-alert");
    el.setAttribute("variant", "error");
    el.setAttribute("message", "인증번호가 올바르지 않습니다.");
    el.setAttribute("hidden", "");
    document.body.appendChild(el);
    await flush();
    expect(el.style.display).toBe("none");

    el.removeAttribute("hidden");
    await flush();
    expect(el.style.display).toBe("contents");
  });

  it(".hidden 프로퍼티 토글도 반영된다", async () => {
    const el = document.createElement("nds-notice-alert") as HTMLElement;
    el.setAttribute("variant", "caution");
    el.setAttribute("message", "확인이 필요해요.");
    document.body.appendChild(el);
    await flush();
    expect(el.style.display).toBe("contents");

    el.hidden = true;
    await flush();
    expect(el.style.display).toBe("none");

    el.hidden = false;
    await flush();
    expect(el.style.display).toBe("contents");
  });
});
