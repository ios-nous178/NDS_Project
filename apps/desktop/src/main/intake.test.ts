import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { computeSlug, resolveIntent, runIntake, type RunIntakeArgs } from "./intake.ts";

function tmpProject(): string {
  return mkdtempSync(join(tmpdir(), "intake-test-"));
}

function baseArgs(
  over: Partial<RunIntakeArgs> & Pick<RunIntakeArgs, "projectPath">,
): RunIntakeArgs {
  return {
    brand: "geniet",
    surface: "service",
    screenName: "home",
    prd: "테스트 기획서",
    screenshots: [],
    agentType: "claude",
    ...over,
  };
}

test("intent: cashwalk-biz + admin → html (자체 어드민 디자인)", () => {
  assert.equal(resolveIntent("admin", "cashwalk-biz"), "html");
});

test("intent: geniet + admin → admin-cms (antd)", () => {
  assert.equal(resolveIntent("admin", "geniet"), "admin-cms");
});

test("intent: 서비스는 항상 html", () => {
  assert.equal(resolveIntent("service", "geniet"), "html");
});

test("slug: 한글 화면명 → screen-<hash> 폴백", () => {
  const slug = computeSlug("geniet", "다이어리 허브");
  assert.match(slug, /^geniet-screen-[0-9a-f]{6}$/);
});

test("slug: 영문 화면명 → brand-kebab", () => {
  assert.equal(computeSlug("trost", "Diary Hub"), "trost-diary-hub");
});

test("중복 slug → -2 suffix (비파괴)", () => {
  const projectPath = tmpProject();
  try {
    const a = runIntake(baseArgs({ projectPath }));
    const b = runIntake(baseArgs({ projectPath }));
    assert.equal(a.slug, "geniet-home");
    assert.equal(b.slug, "geniet-home-2");
    assert.ok(existsSync(join(projectPath, "geniet-home")));
    assert.ok(existsSync(join(projectPath, "geniet-home-2")));
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("시각 0 → references.md 미생성, brief/CLAUDE/AGENTS 는 생성", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(baseArgs({ projectPath }));
    assert.ok(r.ok);
    const ws = r.workspaceDir!;
    assert.equal(existsSync(join(ws, "references.md")), false);
    assert.ok(existsSync(join(ws, "brief.md")));
    assert.ok(existsSync(join(ws, "CLAUDE.md")));
    assert.ok(existsSync(join(ws, "AGENTS.md")));
    // CLAUDE.md = AGENTS.md (동일 부트스트랩)
    assert.equal(
      readFileSync(join(ws, "CLAUDE.md"), "utf8"),
      readFileSync(join(ws, "AGENTS.md"), "utf8"),
    );
    // 시각 없음 → 시드가 재질문 지시
    assert.match(r.seedPrompt!, /사용자에게 요청/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("시각 ≥1 → references.md 첫 줄 task: + source=.references/ 경로", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(
      baseArgs({
        projectPath,
        screenshots: [
          { fileName: "Shot One.png", base64: Buffer.from("png-bytes").toString("base64") },
        ],
        figmaUrls: ["https://figma.com/design/abc?node-id=1:2"],
      }),
    );
    assert.ok(r.ok);
    const refs = readFileSync(join(r.workspaceDir!, "references.md"), "utf8");
    const lines = refs.trim().split("\n");
    assert.equal(lines[0], `task: ${r.slug}`);
    assert.ok(lines.some((l) => l.startsWith("[good] source=https://figma.com/")));
    assert.ok(lines.some((l) => l.includes("source=.references/shot-one.png")));
    // 실제 이미지 파일도 저장됨
    assert.ok(existsSync(join(r.workspaceDir!, ".references", "shot-one.png")));
    // 시각 있음 → 시드가 재질문 없이 진행 지시
    assert.match(r.seedPrompt!, /재질문 없이 진행/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("이미지 10MB 초과 → ok:false, 파일 미생성", () => {
  const projectPath = tmpProject();
  try {
    // base64 길이*3/4 가 10MB 초과하도록 (11MB 상당)
    const big = "A".repeat(Math.ceil((11 * 1024 * 1024 * 4) / 3));
    const r = runIntake(
      baseArgs({ projectPath, screenshots: [{ fileName: "huge.png", base64: big }] }),
    );
    assert.equal(r.ok, false);
    assert.match(r.error!, /10MB/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("이미지 형식 외 확장자 → ok:false", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(
      baseArgs({ projectPath, screenshots: [{ fileName: "spec.pdf", base64: "AAAA" }] }),
    );
    assert.equal(r.ok, false);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});
