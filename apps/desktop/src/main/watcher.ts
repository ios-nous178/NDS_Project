import { watch, type FSWatcher } from "chokidar";
import { join } from "node:path";
import type { WebContents } from "electron";

/**
 * 활성 프로젝트의 .html 변경을 감시해 renderer 에 watch:fileChanged 이벤트를 보낸다.
 * renderer 는 현재 선택 파일이면 재검증한다(정적이라 저장마다 재실행 OK).
 * 디바운스 200ms — 에디터의 다중 쓰기를 1회로 합친다.
 */
let watcher: FSWatcher | null = null;
const debounceTimers = new Map<string, NodeJS.Timeout>();

export function startWatch(projectPath: string, sender: WebContents): void {
  stopWatch();
  watcher = watch(["**/*.html", "**/*.htm"], {
    cwd: projectPath,
    ignored: ["**/node_modules/**", "**/dist/**", "**/out/**", "**/.git/**", "**/build/**"],
    ignoreInitial: true,
    persistent: true,
  });

  const emit = (relPath: string): void => {
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
