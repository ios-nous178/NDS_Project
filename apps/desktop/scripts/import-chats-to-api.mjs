#!/usr/bin/env node
/**
 * 로컬에 이미 쌓인 채팅(.ds-chat-sessions.jsonl + .ds-agent-sessions/<id>.jsonl)을
 * nudge-design-api 로 한 번에 백필(import)한다. 앱 소스를 import 하지 않는 standalone 스크립트.
 *
 * clientId(=sessionId / sessionId#index)로 보내므로 여러 번 돌려도 중복 저장 안 됨(idempotent).
 *
 * 사용:
 *   node apps/desktop/scripts/import-chats-to-api.mjs
 *   API_URL=http://localhost:3000 NUDGE_API_USER=you@x node apps/desktop/scripts/import-chats-to-api.mjs
 *
 * ※ 메시지 본문은 transport="stream-json" 세션(<id>.jsonl)에만 존재.
 *   pty 세션은 메타데이터만 들어간다(raw .log 는 전송하지 않음).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

const API_URL = (process.env.API_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const USER_ID = process.env.NUDGE_API_USER || safeUser();

function safeUser() {
  try {
    return os.userInfo().username || "unknown";
  } catch {
    return "unknown";
  }
}

// 앱이 채팅 메타를 저장하는 후보 디렉토리(플랫폼별 appData 아래 chat-sessions).
function appDataRoot() {
  if (process.platform === "darwin") return join(os.homedir(), "Library", "Application Support");
  if (process.platform === "win32")
    return process.env.APPDATA ?? join(os.homedir(), "AppData", "Roaming");
  return process.env.XDG_CONFIG_HOME ?? join(os.homedir(), ".config");
}
function chatDirs() {
  const root = appDataRoot();
  return [
    join(root, "@nudge-design", "desktop", "chat-sessions"), // dev (electron-vite)
    join(root, "Nudge Studio", "chat-sessions"), // packaged productName
    join(root, "Electron", "chat-sessions"), // 일부 dev 환경
  ].filter((d, i, a) => a.indexOf(d) === i);
}

const CHAT_SESSIONS_FILE = ".ds-chat-sessions.jsonl";
const TRANSCRIPT_DIR = ".ds-agent-sessions";

// .ds-chat-sessions.jsonl 들을 읽어 sessionId별 최신 메타(carry-over 포함)로 합친다.
function readSessions(dirs) {
  const latest = new Map();
  for (const dir of dirs) {
    const file = join(dir, CHAT_SESSIONS_FILE);
    if (!existsSync(file)) continue;
    let raw;
    try {
      raw = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split("\n")) {
      if (!line.trim()) continue;
      let s;
      try {
        s = JSON.parse(line);
      } catch {
        continue;
      }
      if (!s.sessionId) continue;
      const prev = latest.get(s.sessionId);
      latest.set(s.sessionId, {
        ...s,
        _dir: dir,
        createdAt: prev?.createdAt ?? s.createdAt,
        screenName: s.screenName ?? prev?.screenName,
        customTitle: s.customTitle ?? prev?.customTitle,
      });
    }
  }
  return [...latest.values()];
}

// 구조화 메시지(<id>.jsonl) 읽기. 여러 후보 디렉토리에서 먼저 발견되는 것 사용.
function readStructured(dirs, sessionId) {
  for (const dir of dirs) {
    const file = join(dir, TRANSCRIPT_DIR, `${sessionId}.jsonl`);
    if (!existsSync(file)) continue;
    try {
      return readFileSync(file, "utf8")
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => {
          try {
            return JSON.parse(l);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  }
  return [];
}

// ChatMessage(kind union) → {role, content, metadata}. api-sink.ts 의 mapMessage 와 동일 규칙.
function mapMessage(m) {
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
        metadata: { kind: m.kind, durationMs: m.durationMs, usage: m.usage, costUsd: m.costUsd },
      };
    case "error":
      return { role: "system", content: `⚠️ ${m.text}`, metadata: { kind: m.kind } };
    default:
      return {
        role: "system",
        content: JSON.stringify(m),
        metadata: { kind: m.kind ?? "unknown" },
      };
  }
}

async function main() {
  const dirs = chatDirs();
  const sessions = readSessions(dirs);
  if (!sessions.length) {
    console.log("가져올 세션이 없습니다. 확인한 경로:");
    dirs.forEach((d) => console.log("  -", d));
    return;
  }

  console.log(`API: ${API_URL}  ·  user: ${USER_ID}`);
  console.log(`세션 ${sessions.length}건 발견. 업로드 시작…\n`);

  let okCount = 0;
  let msgTotal = 0;
  for (const s of sessions) {
    const structured = readStructured(dirs, s.sessionId);
    const messages = structured.map((m, i) => ({
      clientId: `${s.sessionId}#${i}`,
      ...mapMessage(m),
    }));
    const payload = {
      clientId: s.sessionId,
      userId: USER_ID,
      tool: s.agentType ?? "unknown",
      title: s.customTitle ?? s.screenName ?? s.title ?? null,
      status: s.status ?? null,
      messages,
    };
    try {
      const res = await fetch(`${API_URL}/sessions/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.log(`  ✗ ${s.sessionId.slice(0, 8)} (${s.transport ?? "pty"})  HTTP ${res.status}`);
        continue;
      }
      okCount++;
      msgTotal += messages.length;
      const title = payload.title ?? "(제목 없음)";
      console.log(
        `  ✓ ${s.sessionId.slice(0, 8)}  [${s.transport ?? "pty"}/${s.status}]  메시지 ${messages.length}건  · ${title}`,
      );
    } catch (e) {
      console.log(
        `  ✗ ${s.sessionId.slice(0, 8)}  네트워크 오류: ${e.message} (서버가 켜져 있나요?)`,
      );
    }
  }

  console.log(`\n완료: 세션 ${okCount}/${sessions.length}건, 메시지 ${msgTotal}건 업로드.`);
  console.log(`확인: ${API_URL}/admin`);
}

main();
