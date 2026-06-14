import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildSinglefileHtml } from "./build-html.js";
import { listStandaloneBrands } from "./standalone-assets.js";

/**
 * build_singlefile_html viewport meta 주입 (B3).
 * 회고(2026-06): 모바일 카드가 데스크탑 폭으로 렌더돼 4열로 짓눌렸다. 원본 index.html 에
 * <meta name="viewport"> 가 없으면 모바일이 데스크탑 폭으로 렌더되므로, 빌드 산출물에 자동 주입한다.
 * 멱등 — 원본에 이미 있으면 중복 주입하지 않는다.
 */
const hasManifest = (() => {
  try {
    return listStandaloneBrands().includes("nudge-eap");
  } catch {
    return false;
  }
})();

function withWorkspace(
  files: Record<string, string>,
  fn: (cwd: string) => Promise<void>,
): Promise<void> {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-viewport-"));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(cwd, name), content, "utf-8");
  }
  return fn(cwd).finally(() => fs.rmSync(cwd, { recursive: true, force: true }));
}

const countViewport = (html: string) => (html.match(/name=["']viewport["']/gi) ?? []).length;

const indexHtml = (head: string) => `<!doctype html>
<html data-brand="nudge-eap"><head>${head}</head>
<body>
  <script type="application/json" data-prd-coverage>{"requirements":[]}</script>
  <nds-button id="ok-btn">확인</nds-button>
  <script>document.getElementById("ok-btn").addEventListener("click", () => alert("ok"));</script>
</body></html>`;

test(
  "원본에 viewport meta 가 없으면 산출물에 자동 주입한다",
  { skip: !hasManifest },
  async () => {
    await withWorkspace({ "index.html": indexHtml(`<meta charset="utf-8">`) }, async (cwd) => {
      const result = await buildSinglefileHtml({ cwd, skipAudit: true, intent: "html" });
      assert.ok(result.outputPath && fs.existsSync(result.outputPath), "산출물이 생성돼야 함");
      const out = fs.readFileSync(result.outputPath!, "utf-8");
      assert.equal(countViewport(out), 1, "viewport meta 가 정확히 1개 주입돼야 함");
    });
  },
);

test(
  "원본에 viewport meta 가 이미 있으면 중복 주입하지 않는다(멱등)",
  { skip: !hasManifest },
  async () => {
    const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">`;
    await withWorkspace({ "index.html": indexHtml(head) }, async (cwd) => {
      const result = await buildSinglefileHtml({ cwd, skipAudit: true, intent: "html" });
      assert.ok(result.outputPath && fs.existsSync(result.outputPath), "산출물이 생성돼야 함");
      const out = fs.readFileSync(result.outputPath!, "utf-8");
      assert.equal(countViewport(out), 1, "viewport meta 가 중복되지 않아야 함");
    });
  },
);
