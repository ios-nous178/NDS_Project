import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { auditMockupWorkspace, type WorkspaceAuditRule } from "./build-html.js";

// 캐포비 어드민 DesignSpec-first 게이트 — auditMockupWorkspace 를 직접 호출해 검증한다.
// (실제 빌드/standalone manifest 불필요 — 게이트는 순수 FS 검사다.)

function withWorkspace(files: Record<string, string>, fn: (cwd: string) => void): void {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nudge-dsgate-"));
  try {
    for (const [name, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(cwd, name), content, "utf-8");
    }
    fn(cwd);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
}

const indexHtml = (brand: string) => `<!doctype html>
<html data-brand="${brand}"><head><meta charset="utf-8"></head>
<body>
  <script type="application/json" data-prd-coverage>{"requirements":[]}</script>
  <nds-button>확인</nds-button>
</body></html>`;

const spec = (extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    screen: { brand: "cashwalk-biz", surface: "web", surfaceKind: "admin", ...extra },
    tree: [],
  });

// 게이트 룰만 추려서 본다(다른 audit 룰은 무시 — 시각 레퍼런스 등은 skipVisualReferences 로 끔).
function gateRules(cwd: string, opts?: { skipDesignSpec?: boolean }): WorkspaceAuditRule[] {
  return auditMockupWorkspace(cwd, "html", { skipVisualReferences: true, ...opts })
    .map((v) => v.rule)
    .filter(
      (r) =>
        r === "cashwalk-biz-admin-missing-design-spec" ||
        r === "cashwalk-biz-admin-missing-page-pattern",
    );
}

test("캐포비 어드민 + design-spec.json 없음 → missing-design-spec 위반", () => {
  withWorkspace({ "index.html": indexHtml("cashwalk-biz") }, (cwd) => {
    assert.deepEqual(gateRules(cwd), ["cashwalk-biz-admin-missing-design-spec"]);
  });
});

test("캐포비 어드민 + 유효 pagePattern 선언 → 게이트 통과(위반 없음)", () => {
  withWorkspace(
    { "index.html": indexHtml("cashwalk-biz"), "design-spec.json": spec({ pagePattern: "dashboard" }) },
    (cwd) => {
      assert.deepEqual(gateRules(cwd), []);
    },
  );
});

test("캐포비 어드민 + design-spec 는 있으나 pagePattern 누락 → missing-page-pattern 위반", () => {
  withWorkspace(
    { "index.html": indexHtml("cashwalk-biz"), "design-spec.json": spec() },
    (cwd) => {
      assert.deepEqual(gateRules(cwd), ["cashwalk-biz-admin-missing-page-pattern"]);
    },
  );
});

test("캐포비 어드민 + pagePattern 이 5종이 아님 → missing-page-pattern 위반", () => {
  withWorkspace(
    { "index.html": indexHtml("cashwalk-biz"), "design-spec.json": spec({ pagePattern: "wizard" }) },
    (cwd) => {
      assert.deepEqual(gateRules(cwd), ["cashwalk-biz-admin-missing-page-pattern"]);
    },
  );
});

test("skipDesignSpec:true (=allowIncomplete) → 게이트 우회", () => {
  withWorkspace({ "index.html": indexHtml("cashwalk-biz") }, (cwd) => {
    assert.deepEqual(gateRules(cwd, { skipDesignSpec: true }), []);
  });
});

test("비-캐포비 브랜드(nudge-eap) → 게이트 적용 안 함", () => {
  withWorkspace({ "index.html": indexHtml("nudge-eap") }, (cwd) => {
    assert.deepEqual(gateRules(cwd), []);
  });
});

test("캐포비라도 nudge.surface=service 로 명시되면 게이트 끔", () => {
  withWorkspace(
    { "index.html": indexHtml("cashwalk-biz"), "nudge.surface": "service\n" },
    (cwd) => {
      assert.deepEqual(gateRules(cwd), []);
    },
  );
});

test("브랜드 별칭(cashpobi/data-brand) 도 캐포비로 정규화돼 게이트 적용", () => {
  withWorkspace({ "index.html": indexHtml("cashpobi") }, (cwd) => {
    assert.deepEqual(gateRules(cwd), ["cashwalk-biz-admin-missing-design-spec"]);
  });
});
