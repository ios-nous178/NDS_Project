/**
 * project-modal-footer-button-shape — 캐포비 모달 footer 버튼은 전부 shape="pill".
 * 보조(취소/아웃라인) 버튼에 pill 을 빠뜨려 각진 버튼이 섞이는 재발 차단.
 * 정책 SSOT = project-profiles.ts cashwalk-biz.modal.footerButtonShape="pill".
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

const OPTS = { surface: "admin" as const, project: "cashwalk-biz" };
const doc = (body: string) =>
  `<html data-project="cashwalk-biz"><head></head><body>${body}</body></html>`;
const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

test("재현: 보조 버튼에 shape=pill 누락 → project-modal-footer-button-shape warn", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open max-width="480"><p>중복 그룹</p><div slot="footer">` +
        `<nds-button variant="outlined">기존 그룹에 참여 요청하기</nds-button>` +
        `<nds-button color="neutral" variant="solid" shape="pill">새 그룹 생성</nds-button>` +
        `</div></nds-modal>`,
    ),
    OPTS,
  );
  const hit = has(v, "project-modal-footer-button-shape");
  assert.ok(hit, "pill 빠진 보조 버튼이 잡혀야 함");
  assert.equal(hit?.severity, "warn");
});

test("두 버튼 모두 shape=pill → 위반 아님", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open max-width="480"><p>x</p><div slot="footer">` +
        `<nds-button variant="outlined" shape="pill">취소</nds-button>` +
        `<nds-button color="neutral" variant="solid" shape="pill">확인</nds-button>` +
        `</div></nds-modal>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "project-modal-footer-button-shape"), undefined);
});
