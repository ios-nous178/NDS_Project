import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import type { OpenProjectResult } from "../main/ipc.js";

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
};

contextBridge.exposeInMainWorld("harness", harness);

export type HarnessApi = typeof harness;
