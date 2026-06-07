import { beforeEach, describe, expect, it } from "vitest";
import { withVisualReferencePrompt } from "../src/server";
import { _resetSessionState, visualRefEmitted } from "../src/tools/session-state";

/**
 * 회귀: visual-reference 게이트 프롬프트는 세션 첫 응답에만 축약형으로 실리고,
 * 이후 조회 응답에는 슬림 stub 만 붙어야 한다 (토큰 중복 제거).
 * 첫 응답의 필수 질문 + full guide 재조회 경로는 절대 누락되면 안 된다.
 */
describe("withVisualReferencePrompt — session-once gate", () => {
  beforeEach(() => _resetSessionState());

  function gateOf(toolName: string) {
    const wrapped = withVisualReferencePrompt(toolName, { items: [1, 2, 3] }) as Record<
      string,
      Record<string, unknown>
    >;
    return wrapped._visualReferenceFirstResponse;
  }

  it("세션 첫 호출은 축약 게이트(질문·required·fullGuide)를 싣는다", () => {
    expect(visualRefEmitted()).toBe(false);
    const gate = gateOf("find_icon");

    expect(gate.rule).toBe("visual-reference-first-response");
    expect(gate.required).toBe(true);
    expect(gate.requiredFirstResponseQuestion).toBeTypeOf("string");
    expect(gate.fullGuide).toBe("pattern:visual-reference");
    expect(gate.next).toBeTypeOf("string");
    expect(gate.enforcement).toBeUndefined();
    expect(gate.knownBypassPatterns).toBeUndefined();
    // 풀 게이트엔 슬림 stub 전용 필드가 없다
    expect(gate.recap).toBeUndefined();
    expect(visualRefEmitted()).toBe(true);
  });

  it("두 번째 이후 호출은 슬림 stub(recap 1줄)만 싣는다", () => {
    gateOf("find_icon"); // 첫 호출 → 풀
    const gate = gateOf("get_guide"); // 두 번째 → stub

    expect(gate.rule).toBe("visual-reference-first-response");
    expect(gate.required).toBe(false);
    expect(gate.recap).toBeTypeOf("string");
    // 풀 게이트 전용 장문 필드는 빠져야 한다 (중복 제거의 핵심)
    expect(gate.requiredFirstResponseQuestion).toBeUndefined();
    expect(gate.enforcement).toBeUndefined();
    expect(gate.knownBypassPatterns).toBeUndefined();
  });

  it("stub 은 풀 게이트보다 직렬화 바이트가 작다", () => {
    const full = JSON.stringify(gateOf("find_icon"));
    const stub = JSON.stringify(gateOf("find_component"));
    expect(full.length).toBeLessThan(800);
    expect(stub.length).toBeLessThan(full.length);
  });

  it("원본 결과 payload 는 풀/stub 양쪽 모두 보존된다", () => {
    const first = withVisualReferencePrompt("get_brand", { brand: "geniet" }) as Record<
      string,
      unknown
    >;
    const second = withVisualReferencePrompt("find_token", { brand: "trost" }) as Record<
      string,
      unknown
    >;
    expect(first.brand).toBe("geniet");
    expect(second.brand).toBe("trost");
  });

  it("리셋 후엔 다시 풀 게이트부터 시작한다", () => {
    gateOf("find_icon");
    expect(visualRefEmitted()).toBe(true);
    _resetSessionState();
    expect(visualRefEmitted()).toBe(false);
    const gate = gateOf("find_icon");
    expect(gate.fullGuide).toBe("pattern:visual-reference");
  });
});
