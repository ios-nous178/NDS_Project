import { test } from "node:test";
import assert from "node:assert/strict";
import { convertHtmlToDsHtml } from "./html-analyzer.js";

/**
 * T2: convert_html_to_ds_html 의 정직한 잔여 리포트.
 * 이전엔 `!TAG_REWRITES.button` 이 항상 false 라 button 잔존이 절대 리포트되지 않는 죽은 코드였다.
 * 이제 convert 가 손대지 못한 native(form/header/footer/aside + 미변환 control)를 unchanged 에 노출한다.
 */

const SRC = `<html><body>
  <form>
    <header>헤더</header>
    <button type="button">go</button>
    <input type="text" />
    <footer>푸터</footer>
  </form>
</body></html>`;

test("T2: button/input 은 nds-* 로 변환된다(changes 에 기록)", () => {
  const r = convertHtmlToDsHtml({ source: SRC });
  assert.ok(
    r.changes.some((c) => c.rule === "rewrite-tag:button→nds-button"),
    "button 이 nds-button 으로 rewrite 돼야 함",
  );
  assert.ok(
    r.changes.some((c) => c.rule === "rewrite-tag:input→nds-input"),
    "input 이 nds-input 으로 rewrite 돼야 함",
  );
  assert.match(r.output, /<nds-button/);
  assert.match(r.output, /<nds-input/);
});

test("T2: convert 가 손대지 못한 form/header/footer 는 unchanged 에 정직하게 리포트된다", () => {
  const r = convertHtmlToDsHtml({ source: SRC });
  for (const tag of ["form", "header", "footer"]) {
    assert.ok(
      r.unchanged.some((u) => u.startsWith(tag)),
      `미변환 <${tag}> 가 unchanged 에 노출돼야 함 (실제: ${JSON.stringify(r.unchanged)})`,
    );
  }
});

test("T2: 변환된 button/input 은 잔존으로 잘못 리포트되지 않는다", () => {
  const r = convertHtmlToDsHtml({ source: SRC });
  assert.equal(
    r.unchanged.some((u) => u.startsWith("button") || u.startsWith("input")),
    false,
    "변환 완료된 control 은 잔존 목록에 없어야 함",
  );
});
