import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { DESIGN_DECISIONS_FILE, type DesignDecisionRow } from "@nudge-design/mockup-core";
import { formatMemoryRead, buildMemoryRead } from "./memory-read.ts";

function mk(over: Partial<DesignDecisionRow> & { ts: string }): DesignDecisionRow {
  return {
    ts: over.ts,
    ok: over.ok ?? true,
    screen: over.screen ?? { project: "trost", surface: "web", intent: "로그인" },
    decisions: over.decisions ?? [],
    rationales: over.rationales ?? [],
    componentsUsed: over.componentsUsed ?? [],
    tokensUsed: over.tokensUsed ?? [],
    hash: over.hash ?? "h",
    specVersion: over.specVersion,
  };
}

test("formatMemoryRead: 빈 배열 → null", () => {
  assert.equal(formatMemoryRead([]), null);
});

test("formatMemoryRead: 결정·근거가 섹션에 포함된다", () => {
  const out = formatMemoryRead([
    mk({
      ts: "2026-06-01T00:00:00.000Z",
      decisions: ["CTA 는 projectSolid 고정"],
      rationales: [{ path: "tree[0]", component: "Button", rationale: "주목도 우선" }],
    }),
  ]);
  assert.ok(out, "섹션이 생성되어야 함");
  assert.match(out, /Memory Read/);
  assert.match(out, /CTA 는 projectSolid 고정/);
  assert.match(out, /Button: 주목도 우선/);
});

test("formatMemoryRead: 다른 프로젝트 결정은 제외(프로젝트 필터)", () => {
  const rows = [
    mk({ ts: "t1", screen: { project: "trost" }, decisions: ["TROST 결정"] }),
    mk({ ts: "t2", screen: { project: "geniet" }, decisions: ["GENIET 결정"] }),
  ];
  const out = formatMemoryRead(rows, { project: "trost" });
  assert.ok(out);
  assert.match(out, /TROST 결정/);
  assert.doesNotMatch(out, /GENIET 결정/);
});

test("formatMemoryRead: 프로젝트 alias(cashpobi→cashwalk-biz)도 매칭", () => {
  const out = formatMemoryRead(
    [mk({ ts: "t1", screen: { project: "cashwalk-biz" }, decisions: ["캐포비 결정"] })],
    { project: "cashpobi" },
  );
  assert.ok(out, "별칭 project 가 정규화되어 매칭되어야 함");
  assert.match(out, /캐포비 결정/);
});

test("formatMemoryRead: 프로젝트를 아는데 같은 프로젝트 결정이 없으면 null", () => {
  const out = formatMemoryRead(
    [mk({ ts: "t1", screen: { project: "geniet" }, decisions: ["GENIET"] })],
    { project: "trost" },
  );
  assert.equal(out, null);
});

test("formatMemoryRead: ok=true 결정 우선(미통과 결정 제외)", () => {
  const rows = [
    mk({ ts: "t1", ok: false, decisions: ["미통과 결정"] }),
    mk({ ts: "t2", ok: true, decisions: ["승인된 결정"] }),
  ];
  const out = formatMemoryRead(rows);
  assert.ok(out);
  assert.match(out, /승인된 결정/);
  assert.doesNotMatch(out, /미통과 결정/);
});

test("formatMemoryRead: 전부 미통과면 fallback 으로 포함", () => {
  const out = formatMemoryRead([mk({ ts: "t1", ok: false, decisions: ["유일한 결정"] })]);
  assert.ok(out);
  assert.match(out, /유일한 결정/);
});

test("formatMemoryRead: 최신순 + maxRows 상한", () => {
  const rows = [
    mk({ ts: "2026-06-01T00:00:00.000Z", decisions: ["가장 오래됨"] }),
    mk({ ts: "2026-06-02T00:00:00.000Z", decisions: ["중간"] }),
    mk({ ts: "2026-06-03T00:00:00.000Z", decisions: ["가장 최신"] }),
  ];
  const out = formatMemoryRead(rows, { maxRows: 2 });
  assert.ok(out);
  assert.doesNotMatch(out, /가장 오래됨/); // maxRows=2 라 잘림
  // 최신이 먼저 와야 함
  assert.ok(out.indexOf("가장 최신") < out.indexOf("중간"), "최신순이어야 함");
});

test("formatMemoryRead: maxChars 예산 초과 시 오래된 행부터 줄인다", () => {
  const long = "결정 ".repeat(30).trim();
  const rows = [
    mk({ ts: "t1", decisions: [`${long} A`] }),
    mk({ ts: "t2", decisions: [`${long} B`] }),
    mk({ ts: "t3", decisions: [`${long} C`] }),
  ];
  const out = formatMemoryRead(rows, { maxChars: 400 });
  assert.ok(out);
  assert.ok(out.length <= 600, `예산 근처로 줄어야 함(실제 ${out.length})`);
  // 최신(C)은 유지
  assert.match(out, /C/);
});

test("buildMemoryRead: jsonl 을 읽어 섹션을 만든다", () => {
  const dir = mkdtempSync(join(tmpdir(), "memread-"));
  try {
    const rows = [
      mk({
        ts: "t1",
        screen: { project: "trost", intent: "홈" },
        decisions: ["헤더는 project Header"],
      }),
    ];
    writeFileSync(
      join(dir, DESIGN_DECISIONS_FILE),
      rows.map((r) => JSON.stringify(r)).join("\n") + "\n",
      "utf-8",
    );
    const out = buildMemoryRead(dir, { project: "trost" });
    assert.ok(out);
    assert.match(out, /헤더는 project Header/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("buildMemoryRead: NUDGE_MEMORY_READ=0 이면 null(opt-out)", () => {
  const dir = mkdtempSync(join(tmpdir(), "memread-"));
  const prev = process.env.NUDGE_MEMORY_READ;
  try {
    writeFileSync(
      join(dir, DESIGN_DECISIONS_FILE),
      JSON.stringify(mk({ ts: "t1", decisions: ["x"] })) + "\n",
      "utf-8",
    );
    process.env.NUDGE_MEMORY_READ = "0";
    assert.equal(buildMemoryRead(dir), null);
  } finally {
    if (prev === undefined) delete process.env.NUDGE_MEMORY_READ;
    else process.env.NUDGE_MEMORY_READ = prev;
    rmSync(dir, { recursive: true, force: true });
  }
});

test("buildMemoryRead: 없는 디렉토리 → null(best-effort)", () => {
  assert.equal(buildMemoryRead(join(tmpdir(), "memread-does-not-exist-xyz")), null);
});
