import { appendFileSync, mkdirSync } from "node:fs";
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
