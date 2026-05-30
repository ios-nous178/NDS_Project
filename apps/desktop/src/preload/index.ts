import { contextBridge } from "electron";

/**
 * renderer 가 접근하는 유일한 표면. Phase 1 스켈레톤은 ping 만 노출하고,
 * 이후 project/validate/preview/feedback IPC 가 여기에 추가된다.
 */
const harness = {
  ping: (): string => "pong",
};

contextBridge.exposeInMainWorld("harness", harness);

export type HarnessApi = typeof harness;
