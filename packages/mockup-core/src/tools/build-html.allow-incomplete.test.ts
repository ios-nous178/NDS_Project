import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildSinglefileHtml } from "./build-html.js";
import { listStandaloneBrands } from "./standalone-assets.js";

// 빌드는 prebuilt standalone 자산(DS CSS/runtime) manifest 가 있어야 동작한다.
// 단위 테스트 환경에서 manifest 가 비면(클린 체크아웃 등) 통째로 skip.
const hasManifest = (() => {
  try {
    return listStandaloneBrands().includes("nudge-eap");
  } catch {
    return false;
  }
})();

/** mkdtemp 한 임시 html 워크스페이스에서 fn 실행 후 정리. */
function withWorkspace(
  files: Record<string, string>,
  fn: (cwd: string) => Promise<void>,
): Promise<void> {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-build-"));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(cwd, name), content, "utf-8");
  }
  return fn(cwd).finally(() => fs.rmSync(cwd, { recursive: true, force: true }));
}

// emoji-banned 는 error-severity 룰 → 빌드 게이트 트리거에 사용.
// data-prd-coverage 빈 매니페스트로 PRD 노이즈는 분리.
const indexHtml = (extra = "") => `<!doctype html>
<html data-brand="nudge-eap"><head><meta charset="utf-8"></head>
<body>
  <script type="application/json" data-prd-coverage>{"requirements":[]}</script>
  <nds-button id="ok-btn">확인</nds-button>
  ${extra}
  <script>document.getElementById("ok-btn").addEventListener("click", () => alert("ok"));</script>
</body></html>`;

test(
  "기본(allowIncomplete 미지정): DS error 위반이 있으면 빌드를 막는다(ok:false) — 위반은 보고됨",
  { skip: !hasManifest },
  async () => {
    await withWorkspace({ "index.html": indexHtml("<p>완료 🎉</p>") }, async (cwd) => {
      const result = await buildSinglefileHtml({ cwd, skipAudit: true, intent: "html" });
      assert.equal(result.ok, false, "error 위반이 있으면 빌드는 ok:false 여야 한다");
      assert.ok(
        (result.validation?.severitySummary.error ?? 0) > 0,
        "emoji-banned(error) 위반이 검출돼야 한다",
      );
      // 위반을 조용히 삼키지 않는다 — 응답에 그대로 담겨야 한다.
      assert.ok(
        (result.validation?.violations.length ?? 0) > 0,
        "막힌 빌드도 violations[] 를 보고해야 한다",
      );
      assert.match(result.humanReadable, /BLOCKED/);
      assert.equal(result.forcedDsErrorCount, undefined);
    });
  },
);

test(
  "allowIncomplete:true: DS error 위반이 있어도 빌드 성공(ok:true) — 위반은 여전히 보고됨 + 경고",
  { skip: !hasManifest },
  async () => {
    await withWorkspace({ "index.html": indexHtml("<p>완료 🎉</p>") }, async (cwd) => {
      const result = await buildSinglefileHtml({
        cwd,
        skipAudit: true,
        intent: "html",
        allowIncomplete: true,
      });
      assert.equal(result.ok, true, "allowIncomplete:true 면 강제로 빌드 성공이어야 한다");
      const errCount = result.validation?.severitySummary.error ?? 0;
      assert.ok(errCount > 0, "강제 빌드여도 error 위반은 그대로 검출돼야 한다");
      // 위반을 삼키지 않음 — 카운트/경고가 응답에 노출돼야 한다.
      assert.equal(result.forcedDsErrorCount, errCount);
      assert.ok(result.forcedBuildWarning, "강제 빌드 경고가 있어야 한다");
      assert.match(result.forcedBuildWarning!, /강제 빌드/);
      assert.ok(
        (result.validation?.violations.length ?? 0) > 0,
        "강제 빌드도 violations[] 를 보고해야 한다",
      );
      assert.ok(fs.existsSync(result.outputPath!), "산출물 dist/index.html 이 생성돼야 한다");
    });
  },
);

test(
  "위반이 없으면 allowIncomplete 와 무관하게 ok:true (기본 동작 회귀 없음)",
  { skip: !hasManifest },
  async () => {
    await withWorkspace({ "index.html": indexHtml() }, async (cwd) => {
      const result = await buildSinglefileHtml({ cwd, skipAudit: true, intent: "html" });
      assert.equal(result.validation?.severitySummary.error ?? 0, 0, "error 위반이 없어야 한다");
      assert.equal(result.ok, true);
      assert.equal(result.forcedDsErrorCount, undefined);
      assert.equal(result.forcedBuildWarning, undefined);
    });
  },
);
