import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";
import { listStandaloneProjects } from "./standalone-assets.js";

const hasManifest = (() => {
  try {
    return listStandaloneProjects().length > 0;
  } catch {
    return false;
  }
})();

test("미지 data-project slug 는 unknown-project-slug error 로 잡는다", { skip: !hasManifest }, () => {
  const v = validateHtmlSource(`<html data-project="cashpobi-typo"><body></body></html>`);
  const hit = v.find((x) => x.rule === "unknown-project-slug");
  assert.ok(hit, "unknown-project-slug 위반이 있어야 함");
  assert.equal(hit?.severity, "error");
});

test("별칭(cashpobi)은 정식 project 로 정규화되어 위반이 아니다", { skip: !hasManifest }, () => {
  const v = validateHtmlSource(`<html data-project="cashpobi"><body></body></html>`);
  assert.equal(
    v.find((x) => x.rule === "unknown-project-slug"),
    undefined,
  );
});

test("정식 slug(cashwalk-biz)는 위반이 아니다", { skip: !hasManifest }, () => {
  const v = validateHtmlSource(`<html data-project="cashwalk-biz"><body></body></html>`);
  assert.equal(
    v.find((x) => x.rule === "unknown-project-slug"),
    undefined,
  );
});

test("프로젝트 미선언이면 룰을 적용하지 않는다", { skip: !hasManifest }, () => {
  const v = validateHtmlSource(`<html><body></body></html>`);
  assert.equal(
    v.find((x) => x.rule === "unknown-project-slug"),
    undefined,
  );
});
