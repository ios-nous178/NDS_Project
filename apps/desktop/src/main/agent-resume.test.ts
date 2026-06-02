import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SNAPSHOT_VERSION,
  claudeProjectDir,
  claudeStoreFile,
  parseCodexHeader,
  pickCodexRollout,
  resumeArgsFor,
  setSessionIdArgsFor,
  isResumable,
  type CodexRolloutHeader,
} from "./agent-resume.ts";

// ── claude: cwd → 네이티브 store 경로 ──────────────────────────────────────────
test("claudeProjectDir: 비영숫자를 모두 - 로 치환", () => {
  assert.equal(
    claudeProjectDir("/Users/nudge_133/Desktop/03_NudgeTest/NudgeEAPDesignSystem"),
    "-Users-nudge-133-Desktop-03-NudgeTest-NudgeEAPDesignSystem",
  );
});

test("claudeStoreFile: home/.claude/projects/<dashed>/<id>.jsonl", () => {
  const f = claudeStoreFile("/Users/a/p", "abc-123", "/home/test");
  assert.equal(f, "/home/test/.claude/projects/-Users-a-p/abc-123.jsonl");
});

// ── codex: rollout 헤더 파싱 ────────────────────────────────────────────────────
test("parseCodexHeader: 유효한 session_meta → 헤더", () => {
  const line = JSON.stringify({
    type: "session_meta",
    payload: { id: "uuid-1", cwd: "/w", timestamp: "2026-06-02T01:23:10.439Z" },
  });
  const h = parseCodexHeader("/f.jsonl", line);
  assert.deepEqual(h, {
    id: "uuid-1",
    cwd: "/w",
    timestampMs: Date.parse("2026-06-02T01:23:10.439Z"),
    file: "/f.jsonl",
  });
});

test("parseCodexHeader: session_meta 아님/깨짐 → null", () => {
  assert.equal(parseCodexHeader("/f", JSON.stringify({ type: "event" })), null);
  assert.equal(parseCodexHeader("/f", "{not json"), null);
  assert.equal(
    parseCodexHeader("/f", JSON.stringify({ type: "session_meta", payload: { id: "x" } })),
    null, // cwd/timestamp 누락
  );
});

// ── codex: 어느 rollout 이 이 세션인가 ─────────────────────────────────────────
const T = Date.parse("2026-06-02T10:00:00.000Z");
const mk = (id: string, cwd: string, ms: number): CodexRolloutHeader => ({
  id,
  cwd,
  timestampMs: ms,
  file: `/${id}.jsonl`,
});

test("pickCodexRollout: cwd 일치 & spawn 이후 중 가장 이른 것", () => {
  const headers = [
    mk("old", "/w", T - 5 * 60_000), // spawn 이전 → 제외
    mk("mine", "/w", T + 2_000), // ← 정답(우리 세션)
    mk("later", "/w", T + 90_000), // 이후 다른 세션 → 더 늦음
    mk("other-cwd", "/x", T + 1_000), // cwd 불일치 → 제외
  ];
  assert.equal(pickCodexRollout(headers, "/w", T)?.id, "mine");
});

test("pickCodexRollout: tolerance 안의 직전 생성도 허용(클럭 스큐)", () => {
  // spawn 직전 2초에 생성(시계 차이) — 60s tolerance 안이면 매칭.
  assert.equal(pickCodexRollout([mk("skew", "/w", T - 2_000)], "/w", T)?.id, "skew");
});

test("pickCodexRollout: 매칭 없음 → null", () => {
  assert.equal(pickCodexRollout([mk("x", "/other", T + 1000)], "/w", T), null);
  assert.equal(pickCodexRollout([], "/w", T), null);
});

// ── per-agent resume 계약 ──────────────────────────────────────────────────────
test("resumeArgsFor: claude=플래그 / codex=서브커맨드", () => {
  assert.deepEqual(resumeArgsFor("claude", "id1"), ["--resume", "id1"]);
  assert.deepEqual(resumeArgsFor("codex", "id1"), ["resume", "id1"]);
});

test("setSessionIdArgsFor: claude 만 id 선제 정렬", () => {
  assert.deepEqual(setSessionIdArgsFor("claude", "id1"), ["--session-id", "id1"]);
  assert.deepEqual(setSessionIdArgsFor("codex", "id1"), []);
});

// ── resumable 게이트 ───────────────────────────────────────────────────────────
test("isResumable: store+cwd 존재하면 true", () => {
  const exists = (p: string): boolean => p === "/store.jsonl" || p === "/cwd";
  assert.equal(
    isResumable({ agentSessionFile: "/store.jsonl", cwd: "/cwd", snapshotVersion: 1 }, exists),
    true,
  );
});

test("isResumable: 필드 누락이면 false", () => {
  const yes = (): boolean => true;
  assert.equal(isResumable({ cwd: "/cwd" }, yes), false); // store 없음
  assert.equal(isResumable({ agentSessionFile: "/s" }, yes), false); // cwd 없음
});

test("isResumable: store 또는 cwd 가 디스크에 없으면 false", () => {
  const onlyStore = (p: string): boolean => p === "/store.jsonl";
  assert.equal(
    isResumable({ agentSessionFile: "/store.jsonl", cwd: "/cwd" }, onlyStore),
    false, // cwd 사라짐
  );
});

test("isResumable: 미래 스키마 버전이면 거절", () => {
  const yes = (): boolean => true;
  assert.equal(
    isResumable({ agentSessionFile: "/s", cwd: "/c", snapshotVersion: SNAPSHOT_VERSION + 1 }, yes),
    false,
  );
});
