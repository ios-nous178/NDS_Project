import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  appendFileSync,
  utimesSync,
  statSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  SNAPSHOT_VERSION,
  captureCodexSession,
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
test("parseCodexHeader: 유효한 session_meta → id+cwd (시각은 안 봄)", () => {
  const line = JSON.stringify({
    type: "session_meta",
    payload: { id: "uuid-1", cwd: "/w", timestamp: "2026-06-02T01:23:10.439Z" },
  });
  assert.deepEqual(parseCodexHeader(line), { id: "uuid-1", cwd: "/w" });
});

test("parseCodexHeader: timestamp 없거나 깨져도 id+cwd 만 있으면 OK (TZ skew 무관)", () => {
  // windowing 은 fs 생성시각으로 하므로, payload.timestamp 누락/이상이 캡처를 막아선 안 된다.
  assert.deepEqual(
    parseCodexHeader(
      JSON.stringify({ type: "session_meta", payload: { id: "uuid-2", cwd: "/w" } }),
    ),
    { id: "uuid-2", cwd: "/w" },
  );
});

test("parseCodexHeader: session_meta 아님/깨짐/필수필드 누락 → null", () => {
  assert.equal(parseCodexHeader(JSON.stringify({ type: "event" })), null);
  assert.equal(parseCodexHeader("{not json"), null);
  assert.equal(
    parseCodexHeader(JSON.stringify({ type: "session_meta", payload: { id: "x" } })),
    null, // cwd 누락
  );
});

// ── codex: 어느 rollout 이 이 세션인가 ─────────────────────────────────────────
const T = Date.parse("2026-06-02T10:00:00.000Z");
const mk = (id: string, cwd: string, ms: number): CodexRolloutHeader => ({
  id,
  cwd,
  createdMs: ms,
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

// ── codex: captureCodexSession 통합(임시 home 에 실제 rollout 파일) ─────────────
/** 임시 home 에 codex rollout 파일을 하나 만들고, 정리 콜백을 돌려준다. */
function withCodexHome(
  fn: (home: string, mkRollout: (name: string, payload: object) => string) => void,
): void {
  const home = mkdtempSync(join(tmpdir(), "codex-home-"));
  try {
    const mkRollout = (name: string, payload: object): string => {
      const dir = join(home, ".codex", "sessions", "2026", "06", "04");
      mkdirSync(dir, { recursive: true });
      const file = join(dir, name);
      writeFileSync(file, `${JSON.stringify({ type: "session_meta", payload })}\n{}\n`);
      return file;
    };
    fn(home, mkRollout);
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

test("captureCodexSession: payload.timestamp 가 -9h 스큐여도 fs 생성시각으로 캡처(TZ 회복)", () => {
  withCodexHome((home, mkRollout) => {
    const cwd = "/Users/me/proj";
    // 파일은 방금 생성 → fs 생성시각 ≈ now. payload.timestamp 는 일부러 9h 과거(잘못된 로컬 naive 가정).
    const skewedTs = new Date(Date.now() - 9 * 3600_000).toISOString();
    const file = mkRollout("rollout-2026-06-04T08-35-32-uuid-skew.jsonl", {
      id: "uuid-skew",
      cwd,
      timestamp: skewedTs,
    });
    const got = captureCodexSession(cwd, Date.now() - 5_000, { home });
    assert.equal(got?.id, "uuid-skew");
    assert.equal(got?.file, file);
  });
});

test("captureCodexSession: payload.timestamp 누락이어도 캡처(fs 시각만으로 충분)", () => {
  withCodexHome((home, mkRollout) => {
    const cwd = "/Users/me/proj";
    const file = mkRollout("rollout-2026-06-04T08-35-32-uuid-nots.jsonl", {
      id: "uuid-nots",
      cwd,
    });
    const got = captureCodexSession(cwd, Date.now() - 5_000, { home });
    assert.equal(got?.id, "uuid-nots");
    assert.equal(got?.file, file);
  });
});

test("captureCodexSession: spawn 한참 전(mtime 옛) 세션은 1차 컷에서 제외", () => {
  withCodexHome((home, mkRollout) => {
    const cwd = "/Users/me/proj";
    const file = mkRollout("rollout-2026-06-04T01-00-00-uuid-old.jsonl", {
      id: "uuid-old",
      cwd,
      timestamp: new Date().toISOString(),
    });
    // mtime 을 1시간 전으로 → "append 조차 없던 옛 파일" → mtime 1차 컷에서 제외.
    const oldSec = (Date.now() - 3600_000) / 1000;
    utimesSync(file, oldSec, oldSec);
    assert.equal(captureCodexSession(cwd, Date.now() - 5_000, { home }), null);
  });
});

test("captureCodexSession: birthtime 과거 + spawn 후 append(mtime=now) → createdMs 가 제외", () => {
  // 이 fix 의 핵심(birthtime 이 mtime 보다 더해주는 유일한 가치): 옛 rollout(birthtime<spawn)을
  // codex 가 spawn 이후 append 하면 mtime 이 now 로 점프 → mtime 1차 컷을 통과한다. 그래도 fs
  // 생성시각(createdMs=birthtime)이 과거라 제외돼야 한다. windowing 을 mtime 으로 되돌리면 깨질 라인.
  withCodexHome((home, mkRollout) => {
    const cwd = "/Users/me/proj";
    const file = mkRollout("rollout-2026-06-04T01-00-00-uuid-stale.jsonl", {
      id: "uuid-stale",
      cwd,
      timestamp: new Date().toISOString(),
    });
    const spawnedAtMs = Date.now() - 5_000;
    // birthtime+mtime 둘 다 2h 전으로(macOS 는 mtime<birthtime 이면 birthtime 도 끌어내림).
    const pastSec = (spawnedAtMs - 2 * 3600_000) / 1000;
    utimesSync(file, pastSec, pastSec);
    // spawn 이후 append → mtime 만 now 로 점프(birthtime 은 과거 유지) = mtime 1차 컷 통과.
    appendFileSync(file, `${JSON.stringify({ type: "event" })}\n`);
    const st = statSync(file);
    // 이 케이스가 성립할 때(birthtime<spawn<=mtime, birthtime 지원 FS)에만 단언 — birthtime 미지원
    // FS(0)에선 폴백=mtime 이라 제외 안 되는 게 계약(별도 mtime-폴백 케이스)이므로 vacuous skip.
    if (st.birthtimeMs > 0 && st.birthtimeMs < spawnedAtMs && st.mtimeMs >= spawnedAtMs) {
      assert.equal(captureCodexSession(cwd, spawnedAtMs, { home }), null);
    }
  });
});

test("captureCodexSession: cwd 불일치는 제외", () => {
  withCodexHome((home, mkRollout) => {
    mkRollout("rollout-2026-06-04T08-35-32-uuid-other.jsonl", {
      id: "uuid-other",
      cwd: "/Users/me/other",
      timestamp: new Date().toISOString(),
    });
    assert.equal(captureCodexSession("/Users/me/proj", Date.now() - 5_000, { home }), null);
  });
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
