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
import type { Surface } from "./intake.js";
import type { ChatMessage } from "./chat-types.js";

/**
 * 에이전트 전송 방식. `pty`(기본) = node-pty raw TUI / `stream-json`(canary) = headless
 * `claude -p --output-format stream-json` 구조화 이벤트. 후자는 raw .log 대신 정규화된
 * <id>.jsonl(ChatMessage 라인)을 남겨 라이브/재생이 같은 렌더러를 쓴다.
 */
export type Transport = "pty" | "stream-json";

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
/** 구조화(stream-json) 세션의 정규화 메시지 로그 확장자. raw pty 는 `.log`. */
const STRUCTURED_EXT = ".jsonl";

// interrupted = 사용자가 중지했거나 앱 종료/크래시로 끊긴 세션. 진짜 오류(failed)와 구분한다.
export type SessionStatus = "active" | "completed" | "failed" | "interrupted";

export interface ChatSession {
  sessionId: string;
  agentType: AgentType;
  mockupFile?: string;
  title: string;
  /** 인테이크에서 받은 사람이 읽는 화면 이름(채팅기록 리스트 타이틀의 기본값). */
  screenName?: string;
  /** 사용자가 직접 고친 제목(더블클릭 인라인 편집). 있으면 screenName/title 보다 우선. */
  customTitle?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  /** 인테이크 세션 메타(Level 3 검증/표시용). bare 세션이면 undefined. */
  brand?: string;
  surface?: Surface;
  intent?: "html" | "admin-cms";
  /** 전송 방식. 기록 클릭 시 렌더러가 raw(xterm) vs 구조화(카드) 재생을 분기. 옛 세션은 undefined=pty. */
  transport?: Transport;
}

/** create/update 가 받는 세션 베이스(상태/타임스탬프 제외). */
export type SessionBase = Omit<ChatSession, "status" | "createdAt" | "updatedAt">;

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

export function createSession(projectPath: string, input: SessionBase): ChatSession {
  const now = new Date().toISOString();
  const session: ChatSession = { ...input, status: "active", createdAt: now, updatedAt: now };
  appendSession(projectPath, session);
  return session;
}

export function updateSessionStatus(
  projectPath: string,
  base: SessionBase,
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

/** 구조화(stream-json) 세션의 정규화 메시지 1건을 <id>.jsonl 에 append. */
export function appendStructuredTranscript(
  projectPath: string,
  sessionId: string,
  msg: ChatMessage,
): void {
  try {
    const dir = join(logDir(projectPath), TRANSCRIPT_DIRNAME);
    mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, `${sessionId}${STRUCTURED_EXT}`), JSON.stringify(msg) + "\n", "utf8");
  } catch {
    /* best-effort */
  }
}

/** 구조화 세션의 정규화 메시지 배열(없거나 깨진 줄은 건너뜀). 재생용. */
export function readStructuredTranscript(projectPath: string, sessionId: string): ChatMessage[] {
  const file = join(logDir(projectPath), TRANSCRIPT_DIRNAME, `${sessionId}${STRUCTURED_EXT}`);
  if (!existsSync(file)) return [];
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return [];
  }
  const out: ChatMessage[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line) as ChatMessage);
    } catch {
      /* 깨진 줄 무시 */
    }
  }
  return out;
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
    // 같은 세션의 후속 라인(상태 갱신 등)은 createdAt 을 잃지 않게 첫 라인 값을 보존.
    // screenName/customTitle 은 상태 갱신 라인(onExit 의 sessionBase)·rename 라인에서 누락될 수
    // 있으므로 이전에 본 값을 이월한다(최신 라인이 명시하면 그 값 우선).
    const prev = latest.get(s.sessionId);
    latest.set(
      s.sessionId,
      prev
        ? {
            ...s,
            createdAt: prev.createdAt,
            screenName: s.screenName ?? prev.screenName,
            customTitle: s.customTitle ?? prev.customTitle,
          }
        : s,
    );
  }
  // 파일 등장 순서의 역순 = 최근 시작 세션 우선.
  return order.reverse().map((id) => latest.get(id)!);
}

/**
 * 재시작 후 stale "active" 정리. PTY 는 main 프로세스 자식이라 앱 종료와 함께 죽지만,
 * 상태를 적는 onExit 은 비동기라 종료 직전엔 못 돌 수 있다(또는 강제종료/크래시).
 * 그래서 메타엔 "active" 가 남아 재시작 시 "진행중" 으로 잘못 보이고, 클릭해도 라이브 PTY 가
 * 없어 입력이 조용히 먹힌다. 살아있지 않은 "active" 세션을 "interrupted"(중단됨)로 마킹한다.
 * 정상 종료가 아닌 것뿐이지 오류는 아니므로 "failed" 가 아니라 "interrupted".
 * 멱등 — 이미 active 가 아니면 건너뛴다. 변경한 세션 수를 반환.
 */
export function reconcileStaleSessions(projectPath: string, liveIds: Set<string>): number {
  let changed = 0;
  for (const s of readSessions(projectPath)) {
    if (s.status === "active" && !liveIds.has(s.sessionId)) {
      appendSession(projectPath, {
        ...s,
        status: "interrupted",
        updatedAt: new Date().toISOString(),
      });
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
    const dir = join(logDir(projectPath), TRANSCRIPT_DIRNAME);
    rmSync(join(dir, `${sessionId}.log`), { force: true });
    rmSync(join(dir, `${sessionId}${STRUCTURED_EXT}`), { force: true });
  } catch {
    /* best-effort */
  }
  return { ok: true };
}

/**
 * 세션 제목 변경(채팅기록 인라인 편집). append-only JSONL 이라 현재 세션 스냅샷에
 * customTitle 만 얹어 새 라인을 덧붙인다(reader 가 최신 라인 사용). 빈 문자열이면
 * customTitle 을 비워(undefined) 기본 제목으로 되돌린다. best-effort.
 */
export function renameSession(
  projectPath: string,
  sessionId: string,
  customTitle: string,
): { ok: boolean } {
  const current = readSessions(projectPath).find((s) => s.sessionId === sessionId);
  if (!current) return { ok: false };
  const trimmed = customTitle.trim();
  appendSession(projectPath, {
    ...current,
    customTitle: trimmed || undefined,
    updatedAt: new Date().toISOString(),
  });
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
