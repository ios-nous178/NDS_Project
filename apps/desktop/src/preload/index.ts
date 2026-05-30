import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import type { OpenProjectResult } from "../main/ipc.js";
import type { ExportResult } from "../main/export-runner.js";
import type { SubmitFeedbackArgs, SubmitFeedbackResult } from "../main/feedback.js";
import type { StartAgentArgs } from "../main/agent-runner.js";
import type { ChatSession } from "../main/sessions.js";
import type { AppEventInput } from "@nudge-design/mockup-core";

// renderer 가 preload 를 단일 타입 계약 표면으로 쓰도록 재export.
export type { ExportResult } from "../main/export-runner.js";
export type { OpenProjectResult } from "../main/ipc.js";
export type { SubmitFeedbackArgs, SubmitFeedbackResult } from "../main/feedback.js";
export type { AgentType } from "../main/agent-runner.js";
export type { ChatSession } from "../main/sessions.js";

export interface FileChangedEvent {
  filePath: string;
  relPath: string;
}

export interface AgentDataEvent {
  sessionId: string;
  data: string;
}
export interface AgentExitEvent {
  sessionId: string;
  exitCode: number;
}

/** 렌더러가 main 의 hash 처리를 거치도록 projectPathHash 는 제외하고 넘긴다. */
export type AppEventArgs = { projectPath: string } & Omit<AppEventInput, "projectPathHash">;

/**
 * renderer 가 접근하는 유일한 표면. main 의 IPC 핸들러를 타입드 래퍼로 노출한다.
 */
const harness = {
  /** 커스텀 타이틀바 패딩(신호등 vs Windows 오버레이)을 헤더가 분기하도록 노출. */
  platform: process.platform,
  /** 앱 버전(package.json) — 상단바 상시 노출용. */
  getVersion: (): Promise<string> => ipcRenderer.invoke("app:version"),
  openProject: (): Promise<OpenProjectResult | { canceled: true }> =>
    ipcRenderer.invoke("project:open"),
  readMockup: (filePath: string): Promise<{ source: string }> =>
    ipcRenderer.invoke("mockup:read", { filePath }),
  validate: (filePath: string): Promise<ValidateHtmlMockupResult> =>
    ipcRenderer.invoke("validate:run", { filePath }),
  stopWatch: (): Promise<{ ok: true }> => ipcRenderer.invoke("watch:stop"),
  /** 파일 변경 구독. 반환된 함수로 구독 해제. */
  onFileChanged: (cb: (e: FileChangedEvent) => void): (() => void) => {
    const listener = (_e: IpcRendererEvent, payload: FileChangedEvent): void => cb(payload);
    ipcRenderer.on("watch:fileChanged", listener);
    return () => ipcRenderer.removeListener("watch:fileChanged", listener);
  },
  /** 미리보기 iframe 용 mockup:// URL. 프로젝트 루트 기준 상대경로 + 캐시버스터. */
  previewUrl: (relPath: string, bust: number): string =>
    `mockup://preview/${relPath.split("/").map(encodeURIComponent).join("/")}?t=${bust}`,

  // ── 비파괴 내보내기 (공유용 HTML) ──
  /** 원본 무변경 — 자체완결 dist/index.html 생성 + 버전 stamp + usage + webhook. */
  exportMockup: (projectPath: string): Promise<ExportResult> =>
    ipcRenderer.invoke("export:run", { projectPath }),
  /** 내보낼 위치/파일명을 먼저 고른다(빌드 전). 취소 시 path 없음. */
  pickExportPath: (defaultPath: string): Promise<{ path?: string }> =>
    ipcRenderer.invoke("export:pickPath", { defaultPath }),
  /** 빌드된 자체완결 산출물을 미리 고른 목적지로 기록. */
  placeExport: (sourcePath: string, destPath: string): Promise<{ path: string }> =>
    ipcRenderer.invoke("export:place", { sourcePath, destPath }),

  // ── 유저 피드백 (Phase 3) — 로컬 저장만 ──
  /** 현재 목업에 대한 수정요청/기타 피드백 1건을 `.ds-feedback-log.jsonl` 에 적재. */
  submitFeedback: (args: SubmitFeedbackArgs): Promise<SubmitFeedbackResult> =>
    ipcRenderer.invoke("feedback:submit", args),

  // ── 앱 이벤트 로그 (Phase 5) — 로컬 .ds-app-events.jsonl ──
  /** UI 맥락 이벤트(mockup_selected · validation_completed 등) 명시 기록. */
  appendEvent: (args: AppEventArgs): Promise<{ ok: true }> =>
    ipcRenderer.invoke("event:append", args),

  // ── 인앱 에이전트 (Phase 5) — claude/codex PTY ──
  startAgent: (args: StartAgentArgs): Promise<{ ok: boolean; error?: string }> =>
    ipcRenderer.invoke("agent:start", args),
  sendAgentInput: (sessionId: string, data: string): Promise<void> =>
    ipcRenderer.invoke("agent:input", { sessionId, data }),
  resizeAgent: (sessionId: string, cols: number, rows: number): Promise<void> =>
    ipcRenderer.invoke("agent:resize", { sessionId, cols, rows }),
  stopAgent: (sessionId: string): Promise<void> => ipcRenderer.invoke("agent:stop", { sessionId }),
  /** 에이전트 PTY 출력 구독. 반환 함수로 해제. */
  onAgentData: (cb: (e: AgentDataEvent) => void): (() => void) => {
    const listener = (_e: IpcRendererEvent, payload: AgentDataEvent): void => cb(payload);
    ipcRenderer.on("agent:data", listener);
    return () => ipcRenderer.removeListener("agent:data", listener);
  },
  /** 에이전트 종료 구독. 반환 함수로 해제. */
  onAgentExit: (cb: (e: AgentExitEvent) => void): (() => void) => {
    const listener = (_e: IpcRendererEvent, payload: AgentExitEvent): void => cb(payload);
    ipcRenderer.on("agent:exit", listener);
    return () => ipcRenderer.removeListener("agent:exit", listener);
  },

  // ── 채팅기록 (Phase 6) — 로컬 세션 조회 ──
  listSessions: (projectPath: string): Promise<ChatSession[]> =>
    ipcRenderer.invoke("session:list", { projectPath }),
  readTranscript: (projectPath: string, sessionId: string): Promise<{ text: string }> =>
    ipcRenderer.invoke("session:transcript", { projectPath, sessionId }),
  /** 세션 메타 + raw 트랜스크립트 삭제(실행 중이면 main 이 먼저 종료). */
  deleteSession: (projectPath: string, sessionId: string): Promise<{ ok: boolean }> =>
    ipcRenderer.invoke("session:delete", { projectPath, sessionId }),
};

contextBridge.exposeInMainWorld("harness", harness);

export type HarnessApi = typeof harness;
