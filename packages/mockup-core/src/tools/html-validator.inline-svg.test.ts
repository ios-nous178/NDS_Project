import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 회고(2026-06): inline-svg 가 warn(−8) 으로 icon 차원을 0 까지 끌어내려, DS 100%·다른
 * 5개 차원 96점 목업이 총점 81 로 보였다. find_icon 이 HTML 용으로 내려주는 DS 아이콘
 * 인라인은 **불가피한 정상 패턴**이라 게이트를 깎으면 안 된다:
 *  - standalone <svg> → info(권고)로만 (warn 아님)
 *  - nds-* 컴포넌트 안 <svg>(버튼/사이드바 아이콘 슬롯 = DS-driven) → 아예 제외
 */

test("inline-svg: standalone <svg> 는 info 권고로만 (게이트 감점 최소)", () => {
  const v = validateHtmlSource(
    `<html><body><div><svg viewBox="0 0 10 10"></svg></div></body></html>`,
  );
  const hit = v.find((x) => x.rule === "inline-svg");
  assert.ok(hit, "standalone svg 는 inline-svg 권고 대상이어야 함");
  assert.equal(hit?.severity, "info");
});

test("inline-svg: nds-* 컴포넌트 안의 <svg>(DS 아이콘 슬롯)는 잡지 않는다", () => {
  const v = validateHtmlSource(
    `<html><body><nds-button color="primary"><svg viewBox="0 0 10 10"></svg>저장</nds-button></body></html>`,
  );
  assert.ok(
    !v.some((x) => x.rule === "inline-svg"),
    "nds-button 안 아이콘은 DS-driven → inline-svg 제외",
  );
});
