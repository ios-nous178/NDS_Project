/**
 * 포커스 보존 공통 헬퍼 — nds-* 입력 컴포넌트의 mount-once 계약 검증.
 *
 * 배경: nds-* 의 update() 가 input 을 재생성(replaceChildren)하면 키 입력 1번마다
 * 포커스/커서가 유실된다("한 글자마다 끊김"). AddressPicker · DatePicker 에서 반복된
 * 회귀라, 입력을 가진 컴포넌트는 이 헬퍼로 양면(타이핑 / 외부 attribute 갱신)을 잠근다.
 * scripts/check-input-tests.mjs 가 커버리지를 게이트한다.
 */

import { expect } from "vitest";

export const flush = () => new Promise<void>((r) => setTimeout(r, 0));

type TextField = HTMLInputElement | HTMLTextAreaElement;

export interface FocusTarget {
  /** 매 단계 후 같은 위치의 input 을 다시 찾는다 — 재생성되면 다른 노드가 잡힌다. */
  requery: () => TextField | null;
}

/**
 * 한 글자씩 타이핑 → update flush → ① 노드 동일성 ② document.activeElement
 * ③ 커서 위치(끝) 보존을 단언한다.
 */
export async function expectTypingPreservesFocus(
  target: FocusTarget,
  text = "강남구",
): Promise<void> {
  const input = target.requery();
  expect(input, "입력 필드를 찾지 못함 (requery 셀렉터 확인)").not.toBeNull();
  input!.focus();

  for (const ch of text) {
    const before = target.requery()!;
    before.value += ch;
    before.setSelectionRange?.(before.value.length, before.value.length);
    before.dispatchEvent(new Event("input", { bubbles: true }));
    await flush();

    const after = target.requery()!;
    expect(after, `"${ch}" 입력 후 input 이 재생성됨 — mount-once 계약 위반`).toBe(before);
    expect(document.activeElement, `"${ch}" 입력 후 포커스 유실`).toBe(before);
    expect(after.selectionStart, `"${ch}" 입력 후 커서 위치 유실`).toBe(after.value.length);
  }
}

/**
 * 외부 attribute 갱신(attributeChangedCallback → update() 경로)이 돌아도
 * 포커스 중인 input 노드가 보존되는지 단언한다.
 */
export async function expectAttrUpdatePreservesFocus(
  host: Element,
  target: FocusTarget,
  attr: string,
  value: string,
): Promise<void> {
  const input = target.requery();
  expect(input, "입력 필드를 찾지 못함 (requery 셀렉터 확인)").not.toBeNull();
  input!.focus();
  const typed = input!.value;

  host.setAttribute(attr, value);
  await flush();

  const after = target.requery()!;
  expect(after, `attribute "${attr}" 갱신 후 input 이 재생성됨`).toBe(input);
  expect(document.activeElement, `attribute "${attr}" 갱신 후 포커스 유실`).toBe(input);
  expect(after.value, `attribute "${attr}" 갱신이 입력 중인 값을 덮어씀`).toBe(typed);
}
