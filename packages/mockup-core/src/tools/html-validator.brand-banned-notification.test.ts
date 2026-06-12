import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 캐포비(cashwalk-biz)는 알림을 Snackbar 만 사용한다 — Toast 미사용(예외 없음).
 * 가이드(component:Toast)는 권고만 있었고 검증룰이 없어 <nds-toast> 가 캐포비 목업에서
 * silent 통과했다(회귀). 캐포비 알림 SSOT 는 Snackbar(흰 카드·우측 상단·상태 칩·닫기 X)이므로
 * brand-banned-notification 룰로 전면 차단(error)한다.
 */

test("캐포비에서 nds-toast 는 brand-banned-notification error 로 잡는다", () => {
  const v = validateHtmlSource(
    `<html data-brand="cashwalk-biz"><body><nds-toast message="저장됨"></nds-toast></body></html>`,
  );
  const hit = v.find((x) => x.rule === "brand-banned-notification");
  assert.ok(hit, "brand-banned-notification 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("캐포비 별칭(cashpobi)에서도 nds-toast 를 잡는다", () => {
  const v = validateHtmlSource(
    `<html data-brand="cashpobi"><body><nds-toast message="복사됨"></nds-toast></body></html>`,
  );
  assert.ok(v.find((x) => x.rule === "brand-banned-notification"));
});

test("캐포비에서 nds-snackbar 는 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<html data-brand="cashwalk-biz"><body>` +
      `<nds-snackbar-host brand="cashwalk-biz"></nds-snackbar-host></body></html>`,
  );
  assert.equal(
    v.find((x) => x.rule === "brand-banned-notification"),
    undefined,
  );
});

test("다른 브랜드(미선언)에서는 nds-toast 가 정상 — 룰 미적용", () => {
  const v = validateHtmlSource(
    `<html><body><nds-toast message="저장됨"></nds-toast></body></html>`,
  );
  assert.equal(
    v.find((x) => x.rule === "brand-banned-notification"),
    undefined,
  );
});
