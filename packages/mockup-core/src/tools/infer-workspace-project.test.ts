import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { inferWorkspaceProject } from "./build-html.js";
import { listStandaloneProjects } from "./standalone-assets.js";

const hasManifest = (() => {
  try {
    return listStandaloneProjects().includes("cashwalk-biz");
  } catch {
    return false;
  }
})();

/** mkdtemp 한 임시 워크스페이스에서 fn 실행 후 정리. dirName 으로 폴더명도 제어. */
function withWorkspace(dirName: string, files: Record<string, string>, fn: (cwd: string) => void) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-ws-"));
  const cwd = path.join(root, dirName);
  fs.mkdirSync(cwd, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(cwd, name), content, "utf-8");
  }
  try {
    fn(cwd);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("brief.md '프로젝트: X' 에서 추론한다", { skip: !hasManifest }, () => {
  withWorkspace("anything", { "brief.md": "프로젝트: cashwalk-biz · 표면: admin" }, (cwd) => {
    assert.equal(inferWorkspaceProject(cwd), "cashwalk-biz");
  });
});

test("폴더명 prefix 에서 추론한다 (cashwalk-biz-screen-7c4806)", { skip: !hasManifest }, () => {
  withWorkspace("cashwalk-biz-screen-7c4806", {}, (cwd) => {
    assert.equal(inferWorkspaceProject(cwd), "cashwalk-biz");
  });
});

test("폴더명 별칭(cashpobi-*)도 정식 slug 로 추론한다", { skip: !hasManifest }, () => {
  withWorkspace("cashpobi-screen-abc", {}, (cwd) => {
    assert.equal(inferWorkspaceProject(cwd), "cashwalk-biz");
  });
});

test("brief 가 폴더명보다 우선한다", { skip: !hasManifest }, () => {
  withWorkspace("trost-screen-xyz", { "brief.md": "프로젝트: cashwalk-biz" }, (cwd) => {
    assert.equal(inferWorkspaceProject(cwd), "cashwalk-biz");
  });
});

test("프로젝트 신호가 없으면 undefined", { skip: !hasManifest }, () => {
  withWorkspace("my-random-project", { "brief.md": "그냥 메모" }, (cwd) => {
    assert.equal(inferWorkspaceProject(cwd), undefined);
  });
});
