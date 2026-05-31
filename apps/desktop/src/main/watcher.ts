import { watch, type FSWatcher } from "chokidar";
import { join, relative, sep } from "node:path";
import type { WebContents } from "electron";

/**
 * 활성 프로젝트의 .html 변경을 감시해 renderer 에 watch:fileChanged 이벤트를 보낸다.
 * renderer 는 현재 선택 파일이면 재검증한다(정적이라 저장마다 재실행 OK).
 * 디바운스 200ms — 에디터의 다중 쓰기를 1회로 합친다.
 *
 * ⚠️ chokidar v4 는 glob 지원을 제거했다 — `watch(["** /*.html"])` 는 아무것도 감시하지
 * 않는다(watched paths {} → 라이브 미리보기/드롭다운 갱신이 통째로 죽음). v4 에선 디렉토리를
 * 직접 watch 하고 `ignored` 를 함수로 줘 .html 만 골라낸다.
 */
let watcher: FSWatcher | null = null;
const debounceTimers = new Map<string, NodeJS.Timeout>();

const IGNORE_DIRS = new Set(["node_modules", "dist", "out", ".git", "build"]);

export function startWatch(projectPath: string, sender: WebContents): void {
  stopWatch();
  watcher = watch(projectPath, {
    ignored: (p, stats) => {
      // 무시 디렉토리는 경로 어디에 끼어 있든 배제.
      if (p.split(sep).some((seg) => IGNORE_DIRS.has(seg))) return true;
      // 파일은 .html/.htm 만 통과(디렉토리는 통과시켜야 하위까지 재귀 감시됨).
      if (stats?.isFile()) return !/\.html?$/i.test(p);
      return false;
    },
    ignoreInitial: true,
    persistent: true,
  });

  // v4 디렉토리 watch 는 절대경로를 준다 — projectPath 기준 상대경로로 환산해 기존 계약 유지.
  const emit = (absPath: string): void => {
    const relPath = relative(projectPath, absPath);
    const existing = debounceTimers.get(relPath);
    if (existing) clearTimeout(existing);
    debounceTimers.set(
      relPath,
      setTimeout(() => {
        debounceTimers.delete(relPath);
        if (sender.isDestroyed()) return;
        sender.send("watch:fileChanged", { filePath: join(projectPath, relPath), relPath });
      }, 200),
    );
  };

  watcher.on("change", emit).on("add", emit);
}

export function stopWatch(): void {
  for (const t of debounceTimers.values()) clearTimeout(t);
  debounceTimers.clear();
  if (watcher) {
    void watcher.close();
    watcher = null;
  }
}
