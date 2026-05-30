import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import type { OpenProjectResult } from "../main/ipc.js";
import type { ExportResult } from "../main/export-runner.js";
import type { SubmitFeedbackArgs, SubmitFeedbackResult } from "../main/feedback.js";

// renderer 가 preload 를 단일 타입 계약 표면으로 쓰도록 재export.
export type { ExportResult } from "../main/export-runner.js";
export type { OpenProjectResult } from "../main/ipc.js";
export type { SubmitFeedbackArgs, SubmitFeedbackResult } from "../main/feedback.js";

export interface FileChangedEvent {
  filePath: string;
  relPath: string;
}

/**
 * renderer 가 접근하는 유일한 표면. main 의 IPC 핸들러를 타입드 래퍼로 노출한다.
 */
const harness = {
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
  /** 자체완결 산출물을 네이티브 저장 다이얼로그로 원하는 파일명/위치에 복사. */
  saveExport: (
    sourcePath: string,
    defaultPath: string,
  ): Promise<{ saved: boolean; path?: string }> =>
    ipcRenderer.invoke("export:save", { sourcePath, defaultPath }),

  // ── 유저 피드백 (Phase 3) — 로컬 저장만 ──
  /** 현재 목업에 대한 수정요청/기타 피드백 1건을 `.ds-feedback-log.jsonl` 에 적재. */
  submitFeedback: (args: SubmitFeedbackArgs): Promise<SubmitFeedbackResult> =>
    ipcRenderer.invoke("feedback:submit", args),
};

contextBridge.exposeInMainWorld("harness", harness);

export type HarnessApi = typeof harness;
