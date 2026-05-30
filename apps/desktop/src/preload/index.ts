import { contextBridge, ipcRenderer } from "electron";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import type { OpenProjectResult } from "../main/ipc.js";

/**
 * renderer 가 접근하는 유일한 표면. main 의 IPC 핸들러를 타입드 래퍼로 노출한다.
 * 이후 preview/feedback IPC 가 여기에 추가된다.
 */
const harness = {
  openProject: (): Promise<OpenProjectResult | { canceled: true }> =>
    ipcRenderer.invoke("project:open"),
  readMockup: (filePath: string): Promise<{ source: string }> =>
    ipcRenderer.invoke("mockup:read", { filePath }),
  validate: (filePath: string): Promise<ValidateHtmlMockupResult> =>
    ipcRenderer.invoke("validate:run", { filePath }),
};

contextBridge.exposeInMainWorld("harness", harness);

export type HarnessApi = typeof harness;
