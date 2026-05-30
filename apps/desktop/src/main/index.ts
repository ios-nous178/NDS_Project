import { app, BrowserWindow } from "electron";
import { join } from "node:path";
import { bootstrapValidator } from "./catalog.js";
import { registerIpcHandlers } from "./ipc.js";
import { registerMockupScheme, registerMockupProtocol } from "./mockup-protocol.js";
import { stopWatch } from "./watcher.js";
import { stopAllAgents } from "./agent-runner.js";

let mainWindow: BrowserWindow | null = null;

// privileged 스킴 등록은 app.whenReady 이전이어야 한다.
registerMockupScheme();

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    show: false,
    title: "Nudge EAP Harness",
    webPreferences: {
      preload: join(import.meta.dirname, "../preload/index.mjs"),
      // main 프로세스가 결정론 파이프라인(Node)을 돌리므로 renderer 는 preload 로만 통신.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.on("ready-to-show", () => win.show());
  win.on("closed", () => {
    mainWindow = null;
  });

  // dev 는 electron-vite 가 띄운 Vite 서버 URL, prod 는 번들된 index.html.
  if (process.env.ELECTRON_RENDERER_URL) {
    void win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void win.loadFile(join(import.meta.dirname, "../renderer/index.html"));
  }

  mainWindow = win;
}

app.whenReady().then(() => {
  // validator 부트스트랩(하드 어서션) — catalog 누락/빈 값이면 여기서 크래시.
  bootstrapValidator();
  registerMockupProtocol();
  registerIpcHandlers(() => mainWindow);
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  stopWatch();
  stopAllAgents();
});
