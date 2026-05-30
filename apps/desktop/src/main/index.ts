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

const isMac = process.platform === "darwin";

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    show: false,
    title: "Nudge Studio",
    // 네이티브 타이틀바를 다크 UI 에 녹여 헤더를 직접 그린다. backgroundColor 로 로딩 중
    // 흰 플래시 제거. 'hiddenInset' 은 macOS 전용(윈도우에선 창 컨트롤이 사라짐)이라
    // 플랫폼별로 분기한다:
    //   · mac  : titleBarStyle 'hidden' + 좌측 신호등(trafficLightPosition).
    //            'hiddenInset' 대신 'hidden' 으로 상단 네이티브 하이라이트(흰 1px 선)를 줄인다.
    //   · win  : titleBarStyle 'hidden' + titleBarOverlay 로 우측에 다크 테마 최소/최대/닫기 노출.
    titleBarStyle: "hidden",
    ...(isMac
      ? { trafficLightPosition: { x: 16, y: 14 } }
      : { titleBarOverlay: { color: "#252526", symbolColor: "#d4d4d4", height: 38 } }),
    backgroundColor: "#1e1e1e",
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
