import { contextBridge, ipcRenderer } from "electron";
const harness = {
  openProject: () => ipcRenderer.invoke("project:open"),
  readMockup: (filePath) => ipcRenderer.invoke("mockup:read", { filePath }),
  validate: (filePath) => ipcRenderer.invoke("validate:run", { filePath }),
  stopWatch: () => ipcRenderer.invoke("watch:stop"),
  /** 파일 변경 구독. 반환된 함수로 구독 해제. */
  onFileChanged: (cb) => {
    const listener = (_e, payload) => cb(payload);
    ipcRenderer.on("watch:fileChanged", listener);
    return () => ipcRenderer.removeListener("watch:fileChanged", listener);
  },
  /** 미리보기 iframe 용 mockup:// URL. 프로젝트 루트 기준 상대경로 + 캐시버스터. */
  previewUrl: (relPath, bust) => `mockup://preview/${relPath.split("/").map(encodeURIComponent).join("/")}?t=${bust}`,
  // ── 비파괴 내보내기 (공유용 HTML) ──
  /** 원본 무변경 — 자체완결 dist/index.html 생성 + 버전 stamp + usage + webhook. */
  exportMockup: (projectPath) => ipcRenderer.invoke("export:run", { projectPath }),
  /** 자체완결 산출물을 네이티브 저장 다이얼로그로 원하는 파일명/위치에 복사. */
  saveExport: (sourcePath, defaultPath) => ipcRenderer.invoke("export:save", { sourcePath, defaultPath }),
  // ── 유저 피드백 (Phase 3) — 로컬 저장만 ──
  /** 현재 목업에 대한 수정요청/기타 피드백 1건을 `.ds-feedback-log.jsonl` 에 적재. */
  submitFeedback: (args) => ipcRenderer.invoke("feedback:submit", args)
};
contextBridge.exposeInMainWorld("harness", harness);
