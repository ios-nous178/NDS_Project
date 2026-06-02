/**
 * nudge-design-api(로컬 채팅/리뷰 DB) 로 내보내는 **best-effort 싱크**.
 *
 * 로컬-퍼스트 계약 유지:
 *  - 기본 ON(localhost:3000). 끄려면 `NUDGE_API_LOG=0`. 다른 서버로 보내려면 `NUDGE_API_URL`.
 *  - fire-and-forget + 절대 throw 안 함. 서버가 꺼져 있어도 조용히 무시(에이전트 UX 영향 0).
 *  - 로컬 JSONL 이 여전히 SSOT. 이건 그 위에 얹는 보조 sink 일 뿐.
 *
 * 활성화(로컬 테스트):
 *   NUDGE_API_LOG=1  [NUDGE_API_URL=http://localhost:3000]  [NUDGE_API_USER=you@x] pnpm dev
 *
 * 전송 대상(전부 clientId=앱의 로컬 id 라 idempotent — 중복 저장 안 됨):
 *  - 세션 메타       → POST /sessions/import (clientId=sessionId, 메시지 빈 배열)
 *  - 구조화 메시지   → POST /sessions/import (clientId=sessionId, messages=[1건])
 *  - 유저 피드백     → POST /reviews        (clientId=feedbackId)
 */
import os from "node:os";
import type { ChatSession } from "./sessions.js";
import type { ChatMessage } from "./chat-types.js";
import type { FeedbackEntry } from "@nudge-design/mockup-core";

// 기본 ON. 끄려면 NUDGE_API_LOG=0 (또는 false/off/no). best-effort 라 서버 꺼져 있어도 무해.
const RAW_FLAG = process.env.NUDGE_API_LOG;
const ENABLED = !["0", "false", "off", "no"].includes((RAW_FLAG ?? "").toLowerCase());
const BASE_URL = (process.env.NUDGE_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

function safeUser(): string {
  try {
    return os.userInfo().username || "unknown";
  } catch {
    return "unknown";
  }
}
const USER_ID = process.env.NUDGE_API_USER || safeUser();

// 라이브 세션의 메시지 순번(중복 방지용 clientId 생성). 임포터는 파일 인덱스를 쓴다.
const seqBySession = new Map<string, number>();

if (ENABLED) {
  // 활성 상태를 한 번 알림(테스트 시 동작 확인용).

  console.log(`[api-sink] enabled → ${BASE_URL} (user=${USER_ID})`);
}

/** 서버로 best-effort POST. 실패는 전부 삼킨다(절대 throw 안 함). */
function post(path: string, body: unknown): void {
  if (!ENABLED) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  // fire-and-forget
  void fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  })
    .catch(() => {
      /* 서버 꺼짐/네트워크 오류 등 — 로컬-퍼스트라 무시 */
    })
    .finally(() => clearTimeout(timer));
}

/** ChatMessage(kind union) → API 의 {role, content, metadata} 로 매핑. */
export function mapMessage(m: ChatMessage): {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  metadata: Record<string, unknown>;
} {
  switch (m.kind) {
    case "user":
      return { role: "user", content: m.text, metadata: { kind: m.kind } };
    case "assistant-text":
      return { role: "assistant", content: m.text, metadata: { kind: m.kind } };
    case "tool-use":
      return {
        role: "tool",
        content: `🔧 ${m.tool}: ${m.summary}`,
        metadata: { kind: m.kind, id: m.id, tool: m.tool },
      };
    case "tool-result":
      return {
        role: "tool",
        content: `${m.ok ? "✅" : "❌"} ${m.summary}`,
        metadata: { kind: m.kind, id: m.id, ok: m.ok },
      };
    case "result":
      return {
        role: "system",
        content: `(완료) ${m.ok ? "성공" : "실패"}`,
        metadata: {
          kind: m.kind,
          durationMs: m.durationMs,
          usage: m.usage,
          costUsd: m.costUsd,
        },
      };
    case "error":
      return { role: "system", content: `⚠️ ${m.text}`, metadata: { kind: m.kind } };
    default: {
      // 미래에 kind 가 추가돼도 안전하게 보존
      const unknown = m as { kind?: string };
      return {
        role: "system",
        content: JSON.stringify(unknown),
        metadata: { kind: unknown.kind ?? "unknown" },
      };
    }
  }
}

/** 세션 메타 1건 기록(생성/상태변경/제목변경/reconcile 공통). */
export function logSession(session: ChatSession): void {
  if (!ENABLED) return;
  post("/sessions/import", {
    clientId: session.sessionId,
    userId: USER_ID,
    tool: session.agentType,
    title: session.customTitle ?? session.screenName ?? session.title,
    status: session.status,
    messages: [],
  });
}

/** 구조화(stream-json) 메시지 1건 기록. */
export function logMessage(sessionId: string, msg: ChatMessage): void {
  if (!ENABLED) return;
  const seq = seqBySession.get(sessionId) ?? 0;
  seqBySession.set(sessionId, seq + 1);
  post("/sessions/import", {
    clientId: sessionId,
    userId: USER_ID,
    messages: [{ clientId: `${sessionId}#${seq}`, ...mapMessage(msg) }],
  });
}

/** 유저 피드백(리뷰) 1건 기록. */
export function logReview(entry: FeedbackEntry): void {
  if (!ENABLED) return;
  post("/reviews", {
    clientId: entry.feedbackId,
    userId: entry.reviewer ?? "unknown",
    category: entry.kind,
    content: entry.comment,
    metadata: {
      screen: entry.screen,
      mockupFile: entry.mockupFile,
      dsVersion: entry.dsVersion,
      timestamp: entry.timestamp,
    },
  });
}
