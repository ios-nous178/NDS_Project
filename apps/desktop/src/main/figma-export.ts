import { BrowserWindow, clipboard } from "electron";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildFigmaSceneScript, normalizeScene, type FigmaScene } from "@nudge-design/mockup-core";
import { exportMockup } from "./export-runner.js";

export interface FigmaExportResult {
  ok: boolean;
  /** 저장된 scene.json 절대경로(<목업>/dist/.figma/scene.json). */
  scenePath?: string;
  /** projectPath 기준 상대경로 — 렌더러 토스트/이벤트용. */
  sceneRel?: string;
  nodeCount?: number;
  width?: number;
  height?: number;
  error?: string;
}

/**
 * 목업 → Figma 평면 레이어 scene 추출 (canary).
 *
 * Figma REST 로는 디자인 노드를 만들 수 없으므로 2단 파이프라인의 1단을 담당한다:
 *   ① exportMockup 으로 self-contained dist/index.html 빌드(= <nds-*> 가 런타임/CSS/자산
 *      인라인 상태로 완전 렌더되는 유일한 산출물).
 *   ② 화면 밖 BrowserWindow 에 그 dist 를 로드하고 buildFigmaSceneScript() 를 주입해
 *      DOM 을 평면 scene 으로 추출 → normalizeScene → dist/.figma/scene.json 저장 +
 *      클립보드 복사(플러그인에 붙여넣기 쉽게).
 *
 * 전 과정 로컬 — 네트워크 없음(무유출 단일 산출물 기조). 짝 플러그인은 tools/figma-plugin.
 */
/** Promise 에 타임아웃을 건다 — 초과 시 reject(이긴 쪽이 타이머 정리). hang 방지용. */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Figma 추출 시간 초과(${label}, ${ms}ms)`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export async function exportFigmaScene(
  projectPath: string,
  mockupDir: string | undefined,
  appVersion?: string,
): Promise<FigmaExportResult> {
  // ① 자체완결 dist 빌드(= 워커가 렌더할 대상). 원본 무변경은 exportMockup 이 보장.
  const built = await exportMockup(projectPath, mockupDir, appVersion);
  if (!built.build.ok || !built.build.outputPath) {
    return { ok: false, error: built.build.error ?? "dist 빌드 실패" };
  }
  const distPath = built.build.outputPath;

  // ② 화면 밖 창에 렌더 후 DOM 추출. 데스크탑 폭(1440) 뷰포트로 띄워 풀폭 레이아웃을 잡는다
  //    (모바일 목업은 콘텐츠가 가운데 좁게 잡혀도 절대좌표라 그대로 옮겨진다).
  const win = new BrowserWindow({
    show: false,
    width: 1440,
    height: 1024,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      offscreen: false,
      // 숨김 창은 rAF 가 throttle 돼 fonts.ready→rAF 대기가 안 풀릴 수 있다 — throttle 끄기.
      backgroundThrottling: false,
    },
  });
  // 로드/스크립트가 끝내 settle 안 되면 win 이 destroy 안 돼 figma:export 가 영구 hang 하고
  // UI 가 "추출 중…" 에 멈춘다 — 각 단계에 타임아웃을 걸어 catch→finally(win.destroy)로 흘린다.
  try {
    await withTimeout(win.loadFile(distPath), 15000, "load");
    // 폰트/이미지 디코드가 끝나야 getComputedStyle/box 가 안정적. fonts.ready + 다음 프레임 대기.
    await withTimeout(
      win.webContents.executeJavaScript(
        "(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())" +
          ".then(function(){return new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(function(){r(true)})})})})",
      ),
      10000,
      "ready",
    );
    const raw: unknown = await withTimeout(
      win.webContents.executeJavaScript(buildFigmaSceneScript()),
      10000,
      "extract",
    );
    const scene: FigmaScene = normalizeScene(raw);

    const sceneDir = join(dirname(distPath), ".figma");
    mkdirSync(sceneDir, { recursive: true });
    const scenePath = join(sceneDir, "scene.json");
    const json = JSON.stringify(scene);
    writeFileSync(scenePath, json, "utf8");
    clipboard.writeText(json);

    const sceneRel = scenePath.startsWith(projectPath)
      ? scenePath.slice(projectPath.length).replace(/^[/\\]+/, "")
      : scenePath;

    return {
      ok: true,
      scenePath,
      sceneRel,
      nodeCount: scene.nodes.length,
      width: scene.width,
      height: scene.height,
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  } finally {
    win.destroy();
  }
}
