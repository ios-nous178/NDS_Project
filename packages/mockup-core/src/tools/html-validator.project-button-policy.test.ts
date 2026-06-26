/**
 * 커버리지 갭 픽스처 — 프로젝트 정책(warn/project-policy) 룰
 * (neutral-solid-cta / project-denied-button-color / project-modal-single-button-fullwidth).
 * 발화 조건은 프로젝트 프로필(@nudge-design/tokens/project-profiles)이 결정한다.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

test("neutral-solid-cta: 일반 프로젝트의 neutral solid 버튼은 warn 으로 잡는다", () => {
  const v = validateHtmlSource(`<nds-button color="neutral" onclick="go()">확인</nds-button>`);
  const hit = v.find((x) => x.rule === "neutral-solid-cta");
  assert.ok(hit, "neutral-solid-cta 위반이 있어야 함");
  assert.equal(hit?.severity, "warn");
});

test("neutral-solid-cta: 검정 CTA=neutral 프로젝트(캐포비)는 면제다", () => {
  const v = validateHtmlSource(
    `<html data-project="cashwalk-biz"><body>` +
      `<nds-button color="neutral" onclick="go()">확인</nds-button>` +
      `</body></html>`,
  );
  assert.equal(
    v.find((x) => x.rule === "neutral-solid-cta"),
    undefined,
  );
});

test("neutral-solid-cta: variant=outlined 같은 non-solid 는 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<nds-button color="neutral" variant="outlined" onclick="go()">취소</nds-button>`,
  );
  assert.equal(
    v.find((x) => x.rule === "neutral-solid-cta"),
    undefined,
  );
});

test("project-denied-button-color: 캐포비 color=secondary 는 error 로 잡는다", () => {
  // [승격 2026-06-26 warn→error] 원칙5 — 승격 로그: scripts/validator-promotion-log.json
  const v = validateHtmlSource(
    `<html data-project="cashwalk-biz"><body>` +
      `<nds-button color="secondary" onclick="go()">버튼</nds-button>` +
      `</body></html>`,
  );
  const hit = v.find((x) => x.rule === "project-denied-button-color");
  assert.ok(hit, "project-denied-button-color 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
  assert.ok(hit?.suggestion?.includes("neutral"));
});

test("project-denied-button-color: denylist 미선언 프로젝트(trost)는 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<html data-project="trost"><body>` +
      `<nds-button color="secondary" onclick="go()">버튼</nds-button>` +
      `</body></html>`,
  );
  assert.equal(
    v.find((x) => x.rule === "project-denied-button-color"),
    undefined,
  );
});

test("project-modal-single-button-fullwidth: 캐포비 단일 버튼 모달의 full-width 는 warn 으로 잡는다", () => {
  const v = validateHtmlSource(
    `<html data-project="cashwalk-biz"><body>` +
      `<nds-modal open><p>저장되었습니다.</p><div slot="footer">` +
      `<nds-button full-width color="neutral" variant="solid" onclick="go()">확인</nds-button>` +
      `</div></nds-modal>` +
      `</body></html>`,
  );
  const hit = v.find((x) => x.rule === "project-modal-single-button-fullwidth");
  assert.ok(hit, "project-modal-single-button-fullwidth 위반이 있어야 함");
  assert.equal(hit?.severity, "warn");
});

test("project-modal-single-button-fullwidth: full-width 없는 단일 버튼(hug)은 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<html data-project="cashwalk-biz"><body>` +
      `<nds-modal open><p>저장되었습니다.</p><div slot="footer">` +
      `<nds-button color="neutral" variant="solid" onclick="go()">확인</nds-button>` +
      `</div></nds-modal>` +
      `</body></html>`,
  );
  assert.equal(
    v.find((x) => x.rule === "project-modal-single-button-fullwidth"),
    undefined,
  );
});

test("project-modal-single-button-fullwidth: 모달 정책 미선언 프로젝트(trost)는 위반이 아니다", () => {
  const v = validateHtmlSource(
    `<html data-project="trost"><body>` +
      `<nds-modal open><div slot="footer">` +
      `<nds-button full-width onclick="go()">확인</nds-button>` +
      `</div></nds-modal>` +
      `</body></html>`,
  );
  assert.equal(
    v.find((x) => x.rule === "project-modal-single-button-fullwidth"),
    undefined,
  );
});
