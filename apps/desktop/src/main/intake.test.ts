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

test("intent: cashwalk-biz + admin -> html (자체 어드민 디자인)", () => {
  assert.equal(resolveIntent("admin", "cashwalk-biz"), "html");
});

test("intent: geniet + admin -> admin-cms (antd)", () => {
  assert.equal(resolveIntent("admin", "geniet"), "admin-cms");
});

test("intent: 서비스는 항상 html", () => {
  assert.equal(resolveIntent("service", "geniet"), "html");
});

test("slug: 한글 화면명 -> screen-<hash> 폴백", () => {
  const slug = computeSlug("geniet", "다이어리 허브");
  assert.match(slug, /^geniet-screen-[0-9a-f]{6}$/);
});

test("slug: 영문 화면명 -> brand-kebab", () => {
  assert.equal(computeSlug("trost", "Diary Hub"), "trost-diary-hub");
});

test("중복 slug -> -2 suffix (비파괴)", () => {
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

test("시각 0 -> references.md 미생성, brief/CLAUDE/AGENTS 는 생성", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(baseArgs({ projectPath }));
    assert.ok(r.ok);
    const ws = r.workspaceDir!;
    assert.equal(existsSync(join(ws, "references.md")), false);
    assert.ok(existsSync(join(ws, "brief.md")));
    assert.ok(existsSync(join(ws, "CLAUDE.md")));
    assert.ok(existsSync(join(ws, "AGENTS.md")));
    assert.equal(
      readFileSync(join(ws, "CLAUDE.md"), "utf8"),
      readFileSync(join(ws, "AGENTS.md"), "utf8"),
    );
    assert.match(r.seedPrompt!, /사용자에게 요청/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("nudge.brand 마커를 정식 brand 로 박는다 (빌드의 브랜드 SSOT)", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(baseArgs({ projectPath, brand: "cashwalk-biz" }));
    assert.ok(r.ok);
    const markerPath = join(r.workspaceDir!, "nudge.brand");
    assert.ok(existsSync(markerPath));
    assert.equal(readFileSync(markerPath, "utf8").trim(), "cashwalk-biz");
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("nudge.surface 마커를 선언 표면으로 박는다 (표면 SSOT — 화면 이름 통념보다 우선)", () => {
  const projectPath = tmpProject();
  try {
    const admin = runIntake(baseArgs({ projectPath, brand: "cashwalk-biz", surface: "admin" }));
    assert.ok(admin.ok);
    const adminMarker = join(admin.workspaceDir!, "nudge.surface");
    assert.ok(existsSync(adminMarker));
    assert.equal(readFileSync(adminMarker, "utf8").trim(), "admin");

    const svc = runIntake(baseArgs({ projectPath, brand: "cashwalk-biz", surface: "service" }));
    assert.equal(readFileSync(join(svc.workspaceDir!, "nudge.surface"), "utf8").trim(), "service");
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("surface=admin -> 부트스트랩/seed 에 표면 우선 + 소비자 chrome 금지 가드", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(baseArgs({ projectPath, brand: "cashwalk-biz", surface: "admin" }));
    assert.ok(r.ok);
    const claude = readFileSync(join(r.workspaceDir!, "CLAUDE.md"), "utf8");
    assert.match(claude, /표면\(surface\)이 화면 이름 통념을 지배/);
    assert.match(claude, /소비자 brand chrome/);
    assert.match(r.seedPrompt!, /표면=admin 이 화면 이름 통념보다 우선/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("시각 >=1 -> references.md 첫 줄 task: + source=.references/ 경로", () => {
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
    assert.ok(existsSync(join(r.workspaceDir!, ".references", "shot-one.png")));
    assert.match(r.seedPrompt!, /재질문 없이 진행/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("platform: service + app -> brief/seed 에 플랫폼 가이드 반영", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(baseArgs({ projectPath, surface: "service", platform: "app" }));
    assert.ok(r.ok);
    const brief = readFileSync(join(r.workspaceDir!, "brief.md"), "utf8");
    assert.match(brief, /제작 대상 플랫폼/);
    assert.match(brief, /앱\(모바일 네이티브 느낌\)/);
    assert.match(r.seedPrompt!, /제작 대상 플랫폼=앱/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("platform: admin 이면 플랫폼 섹션 생략", () => {
  const projectPath = tmpProject();
  try {
    // admin + geniet -> admin-cms. platform 을 줘도 brief 에 플랫폼 섹션이 없어야 한다.
    const r = runIntake(baseArgs({ projectPath, surface: "admin", platform: "app" }));
    assert.ok(r.ok);
    const brief = readFileSync(join(r.workspaceDir!, "brief.md"), "utf8");
    assert.doesNotMatch(brief, /제작 대상 플랫폼/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("directionMode=propose -> brief/seed 가 코드 작성 전 방향 제안을 강제", () => {
  const projectPath = tmpProject();
  try {
    const r = runIntake(
      baseArgs({
        projectPath,
        directionMode: "propose",
        selectedDirection: "상단은 가능 시간, 하단은 상담사 신뢰 정보 중심.",
      }),
    );
    assert.ok(r.ok);
    const brief = readFileSync(join(r.workspaceDir!, "brief.md"), "utf8");
    assert.match(brief, /## UI 방향 결정/);
    assert.match(brief, /mode: propose/);
    assert.match(brief, /상단은 가능 시간/);
    assert.match(r.seedPrompt!, /방향 2-3개를 먼저 제안/);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});

test("이미지 10MB 초과 -> ok:false, 파일 미생성", () => {
  const projectPath = tmpProject();
  try {
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

test("이미지 형식 외 확장자 -> ok:false", () => {
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
