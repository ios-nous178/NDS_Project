import { app, BrowserWindow, dialog } from "electron";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrapValidator } from "./catalog.js";
import { registerIpcHandlers } from "./ipc.js";
import { registerMockupScheme, registerMockupProtocol } from "./mockup-protocol.js";
import { stopWatch } from "./watcher.js";
import { stopAllAgents } from "./agent-runner.js";

let mainWindow: BrowserWindow | null = null;

// 전역 안전망 — 어디서도 안 잡힌 Promise 거부를 콘솔에 남긴다(패키징 시 로그로 흐름).
// 조용한 실패(창 안 뜸/멈춤)를 최소한 진단 가능하게 한다.
process.on("unhandledRejection", (reason) => {
  console.error("[main] unhandledRejection:", reason);
});

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

  // show 안전망 — ready-to-show 가 끝내 안 와도(로드 실패/렌더러 멈춤) 일정 시간 뒤 강제로
  // 창을 띄워 "보이지 않는 창" 무음 실패를 막는다(backgroundColor 가 깜빡임을 흡수).
  const showTimer = setTimeout(() => {
    if (!win.isDestroyed() && !win.isVisible()) win.show();
  }, 8000);
  win.on("ready-to-show", () => {
    clearTimeout(showTimer);
    win.show();
  });
  win.on("closed", () => {
    clearTimeout(showTimer);
    mainWindow = null;
    // 창과 함께 에이전트 정리 — macOS 는 창을 닫아도 will-quit 이 안 떠서, 이게 없으면
    // 실행 중 PTY/child 가 파괴된 webContents 클로저에 묶인 채 orphan 으로 누적된다.
    stopAllAgents();
  });

  // 렌더러 로드/크래시 진단 — 무음 실패(다크 빈 창)를 콘솔(패키징 시 로그)로 드러내고,
  // 실패해도 최소한 창은 띄워 사용자가 "앱이 멈췄나" 헷갈리지 않게 한다.
  win.webContents.on("did-fail-load", (_e, code, desc, url, isMainFrame) => {
    if (!isMainFrame || code === -3) return; // -3=ERR_ABORTED(정상 네비 취소) 무시
    console.error(`[main] renderer did-fail-load ${code} ${desc} ${url}`);
    if (!win.isDestroyed() && !win.isVisible()) win.show();
  });
  win.webContents.on("render-process-gone", (_e, details) => {
    console.error("[main] render-process-gone:", details.reason, details.exitCode);
  });
  win.webContents.on("preload-error", (_e, preloadPath, error) => {
    console.error("[main] preload-error:", preloadPath, error);
  });

  // 전체화면 진입/해제를 렌더러에 알린다. mac 은 전체화면이면 신호등이 사라지므로
  // 헤더가 좌측 84px 예약을 풀고 로고/타이틀을 왼쪽에 붙이는 데 쓴다.
  const sendFullscreen = (): void => win.webContents.send("window:fullscreen", win.isFullScreen());
  win.on("enter-full-screen", sendFullscreen);
  win.on("leave-full-screen", sendFullscreen);

  // dev 는 electron-vite 가 띄운 Vite 서버 URL, prod 는 번들된 index.html.
  // 로드 거부를 삼키지 않고(.catch) 로그 + 창 표시로 드러낸다(dev 서버 미기동/경로 회귀 대비).
  const load = process.env.ELECTRON_RENDERER_URL
    ? win.loadURL(process.env.ELECTRON_RENDERER_URL)
    : win.loadFile(join(import.meta.dirname, "../renderer/index.html"));
  load.catch((err) => {
    console.error("[main] renderer load failed:", err);
    if (!win.isDestroyed() && !win.isVisible()) win.show();
  });

  mainWindow = win;
}

app
  .whenReady()
  .then(() => {
    // dev 모드 mac Dock 아이콘 — 패키징 시엔 번들(icns)이 담당하므로 dev 에서만 설정.
    if (isMac && process.env.ELECTRON_RENDERER_URL) {
      try {
        app.dock?.setIcon(join(import.meta.dirname, "../../build/icon.png"));
      } catch {
        /* 아이콘 누락 시 무시 */
      }
    }
    // validator 부트스트랩 — 실패해도 앱을 죽이지 않는다(창은 띄우고 검증만 비활성). 예전엔
    // catalog 누락/손상으로 throw 하면 createWindow 에 도달 못 해 "창이 아예 안 뜸" 이 됐다(#5).
    try {
      bootstrapValidator();
    } catch (e) {
      console.error("[main] validator 부트스트랩 실패 — 검증 비활성으로 계속:", e);
      dialog.showErrorBox(
        "검증 비활성",
        `목업 카탈로그를 불러오지 못해 검증이 꺼진 상태로 실행합니다.\n${String(e)}`,
      );
    }
    registerMockupProtocol();
    registerIpcHandlers(() => mainWindow);
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((e) => {
    // createWindow 등 이후 단계의 예기치 못한 실패도 무음 종료 대신 사용자에게 노출한다.
    console.error("[main] 부팅 실패:", e);
    dialog.showErrorBox("부팅 실패", String(e));
    app.quit();
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  stopWatch();
  stopAllAgents();
});
