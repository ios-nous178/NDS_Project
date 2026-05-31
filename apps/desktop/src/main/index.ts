import { app, BrowserWindow } from "electron";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrapValidator } from "./catalog.js";
import { registerIpcHandlers } from "./ipc.js";
import { registerMockupScheme, registerMockupProtocol } from "./mockup-protocol.js";
import { stopWatch } from "./watcher.js";
import { stopAllAgents } from "./agent-runner.js";

let mainWindow: BrowserWindow | null = null;

/**
 * main 프로세스가 직접 도는 미리보기 주입(injectStandaloneRuntime)·내보내기가 DS 단일
 * 자산(standalone runtime/CSS, assets/files)을 찾게 env 로 위치를 못박는다.
 *
 *  - packaged: node_modules 가 없으니 sidecar(resources/mcp/dist/{standalone,assets}).
 *  - dev: electron-vite 가 @nudge-design/mockup-core·html 을 main 번들에 인라인하므로
 *    그 안의 createRequire(import.meta.url) 가 out/main 기준으로 동작 → packages/mockup-core/
 *    node_modules 에 있는 @nudge-design/html 을 못 찾아 resolveStandaloneDir 가 throw 한다
 *    (= 미리보기가 주입 실패로 raw HTML 만 서빙 → CSS·헤더 사라짐). 워크스페이스의
 *    packages/{html,assets}/dist 를 직접 못박아 env(strategy ①)로 확정한다.
 */
function bootstrapBundledAssetDirs(): void {
  const setIfPresent = (key: string, dir: string | null): void => {
    if (dir && !process.env[key] && existsSync(dir)) process.env[key] = dir;
  };

  // packaged sidecar 우선.
  const resourcesPath = (process as NodeJS.Process & { resourcesPath?: string }).resourcesPath;
  if (resourcesPath) {
    setIfPresent("NUDGE_DS_STANDALONE_DIR", join(resourcesPath, "mcp", "dist", "standalone"));
    setIfPresent("NUDGE_DS_ASSETS_DIR", join(resourcesPath, "mcp", "dist", "assets"));
  }

  // dev/모노레포 폴백 — 번들 위치(out/main)에서 위로 올라가며 워크스페이스 dist 를 찾는다.
  // sentinel 로 정확한 디렉터리만 잡는다(standalone=manifest.json, assets=files/).
  const findUp = (rel: string, sentinel: string): string | null => {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 8; i += 1) {
      const cand = join(dir, rel);
      if (existsSync(join(cand, sentinel))) return cand;
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    return null;
  };
  setIfPresent(
    "NUDGE_DS_STANDALONE_DIR",
    findUp(join("packages", "html", "dist", "standalone"), "manifest.json"),
  );
  setIfPresent(
    "NUDGE_DS_ASSETS_DIR",
    findUp(join("packages", "assets", "dist", "files"), "brand-logos"),
  );
}

bootstrapBundledAssetDirs();

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

  // 전체화면 진입/해제를 렌더러에 알린다. mac 은 전체화면이면 신호등이 사라지므로
  // 헤더가 좌측 84px 예약을 풀고 로고/타이틀을 왼쪽에 붙이는 데 쓴다.
  const sendFullscreen = (): void => win.webContents.send("window:fullscreen", win.isFullScreen());
  win.on("enter-full-screen", sendFullscreen);
  win.on("leave-full-screen", sendFullscreen);

  // dev 는 electron-vite 가 띄운 Vite 서버 URL, prod 는 번들된 index.html.
  if (process.env.ELECTRON_RENDERER_URL) {
    void win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void win.loadFile(join(import.meta.dirname, "../renderer/index.html"));
  }

  mainWindow = win;
}

app.whenReady().then(() => {
  // dev 모드 mac Dock 아이콘 — 패키징 시엔 번들(icns)이 담당하므로 dev 에서만 설정.
  if (isMac && process.env.ELECTRON_RENDERER_URL) {
    try {
      app.dock?.setIcon(join(import.meta.dirname, "../../build/icon.png"));
    } catch {
      /* 아이콘 누락 시 무시 */
    }
  }
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
