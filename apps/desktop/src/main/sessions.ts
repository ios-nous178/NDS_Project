import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { resolveWritableLogDir } from "@nudge-design/mockup-core";
import type { AgentType } from "./agent-runner.js";

/**
 * 에이전트 채팅 "세션" 의 로컬 저장.
 *
 * PTY 로 구동하므로 구조적 메시지(role user/assistant)는 파싱하지 않는다 — 대신
 *  - `.ds-chat-sessions.jsonl` : 세션 메타(append-only, 같은 sessionId 의 최신 라인이 유효)
 *  - `.ds-agent-sessions/<id>.log` : raw pty 트랜스크립트(나중에 그대로 다시 보여주기 위함)
 * 로 나눠 둔다. 구조적 chat_messages(stream-json)는 후속.
 *
 * 전부 로컬 전용. 실패해도 throw 하지 않는다(에이전트 동작을 막지 않음).
 */
export const CHAT_SESSIONS_FILENAME = ".ds-chat-sessions.jsonl";
export const TRANSCRIPT_DIRNAME = ".ds-agent-sessions";

export type SessionStatus = "active" | "completed" | "failed";

export interface ChatSession {
  sessionId: string;
  agentType: AgentType;
  mockupFile?: string;
  title: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

function logDir(projectPath: string): string {
  return resolveWritableLogDir({ cwd: projectPath });
}

function appendSession(projectPath: string, session: ChatSession): void {
  try {
    const dir = logDir(projectPath);
    mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, CHAT_SESSIONS_FILENAME), JSON.stringify(session) + "\n", "utf8");
  } catch {
    /* best-effort */
  }
}

export function createSession(
  projectPath: string,
  input: { sessionId: string; agentType: AgentType; mockupFile?: string; title: string },
): ChatSession {
  const now = new Date().toISOString();
  const session: ChatSession = { ...input, status: "active", createdAt: now, updatedAt: now };
  appendSession(projectPath, session);
  return session;
}

export function updateSessionStatus(
  projectPath: string,
  base: { sessionId: string; agentType: AgentType; mockupFile?: string; title: string },
  status: SessionStatus,
): void {
  const now = new Date().toISOString();
  appendSession(projectPath, {
    ...base,
    status,
    // createdAt 은 첫 라인에 이미 있으므로 갱신 라인엔 updatedAt 만 의미. reader 는 최신 라인 사용.
    createdAt: now,
    updatedAt: now,
  });
}

export function appendTranscript(projectPath: string, sessionId: string, data: string): void {
  try {
    const dir = join(logDir(projectPath), TRANSCRIPT_DIRNAME);
    mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, `${sessionId}.log`), data, "utf8");
  } catch {
    /* best-effort */
  }
}

/**
 * 세션 메타를 읽어 newest-first 로 반환. append-only JSONL 이라 같은 sessionId 의
 * **마지막(=최신 status) 라인**만 남긴다(채팅기록 리스트용).
 */
export function readSessions(projectPath: string): ChatSession[] {
  let raw: string;
  try {
    raw = readFileSync(join(logDir(projectPath), CHAT_SESSIONS_FILENAME), "utf8");
  } catch {
    return [];
  }
  const latest = new Map<string, ChatSession>();
  const order: string[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let s: ChatSession;
    try {
      s = JSON.parse(line) as ChatSession;
    } catch {
      continue;
    }
    if (!s.sessionId) continue;
    if (!latest.has(s.sessionId)) order.push(s.sessionId);
    // 같은 세션의 후속 라인은 createdAt 을 잃지 않게 첫 라인 createdAt 을 보존.
    const prev = latest.get(s.sessionId);
    latest.set(s.sessionId, prev ? { ...s, createdAt: prev.createdAt } : s);
  }
  // 파일 등장 순서의 역순 = 최근 시작 세션 우선.
  return order.reverse().map((id) => latest.get(id)!);
}

/**
 * 재시작 후 stale "active" 정리. PTY 는 main 프로세스 자식이라 앱 종료와 함께 죽지만,
 * 상태를 "failed" 로 적는 onExit 은 비동기라 종료 직전엔 못 돌 수 있다(또는 강제종료/크래시).
 * 그래서 메타엔 "active" 가 남아 재시작 시 "진행중" 으로 잘못 보이고, 클릭해도 라이브 PTY 가
 * 없어 입력이 조용히 먹힌다. 살아있지 않은 "active" 세션을 "failed" 로 마킹해 혼란을 없앤다.
 * 멱등 — 이미 "failed/completed" 면 건너뛴다. 변경한 세션 수를 반환.
 */
export function reconcileStaleSessions(projectPath: string, liveIds: Set<string>): number {
  let changed = 0;
  for (const s of readSessions(projectPath)) {
    if (s.status === "active" && !liveIds.has(s.sessionId)) {
      appendSession(projectPath, { ...s, status: "failed", updatedAt: new Date().toISOString() });
      changed++;
    }
  }
  return changed;
}

/**
 * 세션 1건 삭제. append-only JSONL 이라 해당 sessionId 라인을 모두 걸러 rewrite 하고
 * raw 트랜스크립트(`<id>.log`)도 unlink 한다. best-effort — 실패해도 throw 하지 않는다.
 * 라이브(실행 중) 세션 가드는 호출부(stopAgent 후) 책임.
 */
export function deleteSession(projectPath: string, sessionId: string): { ok: boolean } {
  try {
    const file = join(logDir(projectPath), CHAT_SESSIONS_FILENAME);
    if (existsSync(file)) {
      const kept = readFileSync(file, "utf8")
        .split("\n")
        .filter((line) => {
          if (!line.trim()) return false;
          try {
            return (JSON.parse(line) as ChatSession).sessionId !== sessionId;
          } catch {
            return false; // 깨진 라인은 이참에 정리
          }
        });
      writeFileSync(file, kept.length ? kept.join("\n") + "\n" : "", "utf8");
    }
  } catch {
    return { ok: false };
  }
  try {
    rmSync(join(logDir(projectPath), TRANSCRIPT_DIRNAME, `${sessionId}.log`), { force: true });
  } catch {
    /* best-effort */
  }
  return { ok: true };
}

/** 세션의 raw pty 트랜스크립트(없으면 ""). */
export function readTranscript(projectPath: string, sessionId: string): string {
  const file = join(logDir(projectPath), TRANSCRIPT_DIRNAME, `${sessionId}.log`);
  if (!existsSync(file)) return "";
  try {
    return readFileSync(file, "utf8");
  } catch {
    return "";
  }
}
