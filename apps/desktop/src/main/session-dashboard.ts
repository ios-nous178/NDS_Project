import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

import {
  appEventsLogPath,
  feedbackLogPath,
  readAppEvents,
  readFeedbackLog,
} from "@nudge-design/mockup-core";

import type { AppEvent } from "@nudge-design/mockup-core";
import type { FeedbackEntry } from "@nudge-design/mockup-core";
import type { ChatMessage } from "./chat-types.js";
import type { ChatSession } from "./sessions.js";
import {
  CHAT_SESSIONS_FILENAME,
  TRANSCRIPT_DIRNAME,
  readSessions,
  readStructuredTranscript,
  sessionStorageDirs,
} from "./sessions.js";

export interface SessionDashboardFile {
  kind:
    | "session-meta"
    | "transcript"
    | "structured-transcript"
    | "mockup"
    | "brief"
    | "reference"
    | "attachment"
    | "feedback-log"
    | "app-events"
    | "agent-session";
  label: string;
  path: string | null;
  exists: boolean;
  sizeBytes?: number;
}

export interface SessionScoreSnapshot {
  kind: "design-score";
  source: "structured-transcript";
  seq?: number;
  verdict?: "pass" | "warn" | "fail";
  verdictLabel?: string;
  overall?: number | null;
  codeOverall?: number | null;
  llmOverall?: number | null;
  codeDimensions?: Record<string, number> | null;
  llmScores?: Record<string, number> | null;
  notes?: string | null;
}

export interface SessionDashboardItem {
  session: ChatSession;
  files: SessionDashboardFile[];
  feedback: FeedbackEntry[];
  scores: SessionScoreSnapshot[];
  events: AppEvent[];
}

export interface SessionDashboardResult {
  projectPath: string;
  summary: {
    sessionCount: number;
    fileCount: number;
    feedbackCount: number;
    scoreCount: number;
    eventCount: number;
  };
  files: {
    sessions: string[];
    feedback: string[];
    events: string[];
  };
  sessions: SessionDashboardItem[];
}

function firstExisting(paths: Array<string | null>): string | null {
  for (const p of paths) {
    if (p && existsSync(p)) return p;
  }
  return null;
}

function statBytes(filePath: string | null): number | undefined {
  if (!filePath || !existsSync(filePath)) return undefined;
  try {
    return statSync(filePath).size;
  } catch {
    return undefined;
  }
}

function absoluteMockupPath(session: ChatSession, projectPath: string): string | null {
  if (!session.mockupFile) return null;
  const base = session.cwd ?? projectPath;
  return join(base, session.mockupFile);
}

function readBrandMarker(startDir: string | null): string | undefined {
  if (!startDir) return undefined;
  let dir = startDir;
  for (let i = 0; i < 5; i++) {
    const marker = join(dir, "nudge.brand");
    if (existsSync(marker)) {
      try {
        const brand = readFileSync(marker, "utf8").trim();
        if (brand) return brand;
      } catch {
        return undefined;
      }
    }
    const next = dirname(dir);
    if (next === dir) break;
    dir = next;
  }
  return undefined;
}

function hydrateSessionContext(session: ChatSession, projectPath: string): ChatSession {
  if (session.brand) return session;
  const mockupPath = absoluteMockupPath(session, projectPath);
  const markerStart = mockupPath ? dirname(mockupPath) : (session.cwd ?? projectPath);
  const brand = readBrandMarker(markerStart);
  return brand ? { ...session, brand } : session;
}

function workspaceDirs(session: ChatSession, projectPath: string): string[] {
  const dirs: string[] = [];
  if (session.cwd) dirs.push(session.cwd);
  if (session.mockupFile) {
    const slash = session.mockupFile.lastIndexOf("/");
    if (slash > 0) dirs.push(join(projectPath, session.mockupFile.slice(0, slash)));
  }
  dirs.push(projectPath);
  return [...new Set(dirs)];
}

function collectWorkspaceFiles(session: ChatSession, projectPath: string): SessionDashboardFile[] {
  const dir = workspaceDirs(session, projectPath).find((candidate) =>
    existsSync(join(candidate, "brief.md")),
  );
  if (!dir) return [];

  const files: SessionDashboardFile[] = [];
  const push = (kind: SessionDashboardFile["kind"], label: string, path: string): void => {
    if (!existsSync(path)) return;
    files.push({ kind, label, path, exists: true, sizeBytes: statBytes(path) });
  };

  push("brief", "brief.md (PRD)", join(dir, "brief.md"));
  push("reference", "references.md", join(dir, "references.md"));

  const briefDir = join(dir, "brief");
  if (existsSync(briefDir)) {
    try {
      for (const entry of readdirSync(briefDir, { withFileTypes: true })) {
        if (!entry.isFile()) continue;
        push("attachment", `brief/${entry.name}`, join(briefDir, entry.name));
      }
    } catch {
      /* best-effort */
    }
  }
  return files;
}

function isDesignScoreMessage(
  msg: ChatMessage,
): msg is Extract<ChatMessage, { kind: "design-score" }> {
  return msg.kind === "design-score";
}

function buildScoreSnapshots(messages: ChatMessage[]): SessionScoreSnapshot[] {
  const out: SessionScoreSnapshot[] = [];
  for (const msg of messages) {
    if (!isDesignScoreMessage(msg)) continue;
    out.push({
      kind: "design-score",
      source: "structured-transcript",
      seq: msg.seq,
      verdict: msg.verdict,
      verdictLabel: msg.verdictLabel,
      overall: msg.overall ?? null,
      codeOverall: msg.codeScores?.overall ?? null,
      llmOverall: msg.llm.ok ? (msg.llm.overall ?? null) : null,
      codeDimensions: msg.codeScores?.dimensions ?? null,
      llmScores: msg.llm.ok ? (msg.llm.scores ?? null) : null,
      notes: msg.llm.ok ? (msg.llm.notes ?? null) : (msg.llm.error ?? null),
    });
  }
  return out;
}

function dedupeFeedback(items: FeedbackEntry[]): FeedbackEntry[] {
  const seen = new Set<string>();
  const out: FeedbackEntry[] = [];
  for (const item of items) {
    if (seen.has(item.feedbackId)) continue;
    seen.add(item.feedbackId);
    out.push(item);
  }
  return out;
}

function dedupeEvents(items: AppEvent[]): AppEvent[] {
  const seen = new Set<string>();
  const out: AppEvent[] = [];
  for (const item of items) {
    if (seen.has(item.eventId)) continue;
    seen.add(item.eventId);
    out.push(item);
  }
  return out;
}

function uniqueStrings(paths: string[]): string[] {
  return [...new Set(paths)];
}

function collectLogFiles(projectPath: string): {
  sessionLogs: string[];
  feedbackLogs: string[];
  eventLogs: string[];
} {
  const dirs = sessionStorageDirs(projectPath);
  return {
    sessionLogs: uniqueStrings(
      dirs.map((dir) => join(dir, CHAT_SESSIONS_FILENAME)).filter(existsSync),
    ),
    feedbackLogs: uniqueStrings(dirs.map((dir) => feedbackLogPath(dir)).filter(existsSync)),
    eventLogs: uniqueStrings(dirs.map((dir) => appEventsLogPath(dir)).filter(existsSync)),
  };
}

export function readSessionDashboard(projectPath: string): SessionDashboardResult {
  const sessions = readSessions(projectPath);
  const logFiles = collectLogFiles(projectPath);
  const dirs = sessionStorageDirs(projectPath);

  const feedbackEntries = dedupeFeedback(
    logFiles.feedbackLogs.flatMap((path) => readFeedbackLog(path)),
  );
  const events = dedupeEvents(logFiles.eventLogs.flatMap((path) => readAppEvents(path)));

  const items: SessionDashboardItem[] = sessions.map((rawSession) => {
    const session = hydrateSessionContext(rawSession, projectPath);
    const structuredMessages = readStructuredTranscript(projectPath, session.sessionId);
    const scoreSnapshots = buildScoreSnapshots(structuredMessages);
    const sessionEvents = events.filter(
      (event) => event.sessionId === session.sessionId || event.mockupFile === session.mockupFile,
    );
    const sessionFeedback = feedbackEntries.filter((entry) => {
      if (!session.mockupFile) return false;
      return entry.mockupFile === session.mockupFile;
    });
    const transcriptCandidates = dirs.map((dir) =>
      join(dir, TRANSCRIPT_DIRNAME, `${session.sessionId}.log`),
    );
    const structuredCandidates = dirs.map((dir) =>
      join(dir, TRANSCRIPT_DIRNAME, `${session.sessionId}.jsonl`),
    );
    const sessionMetaPath = firstExisting(logFiles.sessionLogs);
    const transcriptPath = firstExisting(transcriptCandidates);
    const structuredPath = firstExisting(structuredCandidates);
    const feedbackPath = firstExisting(logFiles.feedbackLogs);
    const eventPath = firstExisting(logFiles.eventLogs);

    const files: SessionDashboardFile[] = [
      ...collectWorkspaceFiles(session, projectPath),
      {
        kind: "session-meta",
        label: ".ds-chat-sessions.jsonl",
        path: sessionMetaPath,
        exists: sessionMetaPath != null,
        sizeBytes: statBytes(sessionMetaPath),
      },
      {
        kind: "transcript",
        label: "raw transcript (.log)",
        path: transcriptPath,
        exists: transcriptPath != null,
        sizeBytes: statBytes(transcriptPath),
      },
      {
        kind: "structured-transcript",
        label: "structured transcript (.jsonl)",
        path: structuredPath,
        exists: structuredPath != null,
        sizeBytes: statBytes(structuredPath),
      },
      {
        kind: "feedback-log",
        label: ".ds-feedback-log.jsonl",
        path: feedbackPath,
        exists: feedbackPath != null,
        sizeBytes: statBytes(feedbackPath),
      },
      {
        kind: "app-events",
        label: ".ds-app-events.jsonl",
        path: eventPath,
        exists: eventPath != null,
        sizeBytes: statBytes(eventPath),
      },
    ];

    const mockupPath = absoluteMockupPath(session, projectPath);
    if (mockupPath) {
      files.unshift({
        kind: "mockup",
        label: session.mockupFile ?? "mockup",
        path: mockupPath,
        exists: existsSync(mockupPath),
        sizeBytes: statBytes(mockupPath),
      });
    }
    if (session.agentSessionFile) {
      files.push({
        kind: "agent-session",
        label: "native agent store",
        path: session.agentSessionFile,
        exists: existsSync(session.agentSessionFile),
        sizeBytes: statBytes(session.agentSessionFile),
      });
    }

    return {
      session,
      files,
      feedback: sessionFeedback,
      scores: scoreSnapshots,
      events: sessionEvents,
    };
  });

  return {
    projectPath,
    summary: {
      sessionCount: items.length,
      fileCount: items.reduce((sum, item) => sum + item.files.filter((f) => f.exists).length, 0),
      feedbackCount: feedbackEntries.length,
      scoreCount: items.reduce((sum, item) => sum + item.scores.length, 0),
      eventCount: events.length,
    },
    files: {
      sessions: logFiles.sessionLogs,
      feedback: logFiles.feedbackLogs,
      events: logFiles.eventLogs,
    },
    sessions: items,
  };
}
