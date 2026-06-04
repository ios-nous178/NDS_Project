import { watch as nativeWatch, type FSWatcher as NativeFSWatcher } from "node:fs";
import { watch as chokidarWatch, type FSWatcher as ChokidarFSWatcher } from "chokidar";
import { join, relative, sep } from "node:path";
import type { WebContents } from "electron";

/**
 * 활성 프로젝트의 .html 변경을 감시해 renderer 에 watch:fileChanged 이벤트를 보낸다.
 * renderer 는 현재 선택 파일이면 재검증/미리보기 갱신한다. 디바운스 200ms.
 *
 * ⚠️ 핸들 폭증(EMFILE) 회피가 핵심.
 *  - 1순위: 네이티브 `fs.watch(dir, { recursive:true })` — macOS/Windows 는 트리 전체를
 *    **단일 커널 핸들**(FSEvents / ReadDirectoryChangesW)로 감시한다. 폴더가 아무리 커도
 *    열린 파일 한도를 넘기지 않는다. (배포 타깃이 mac + win 이라 항상 이 경로를 탄다.)
 *  - 폴백: chokidar (recursive 미지원 플랫폼 = Linux 개발 환경). chokidar v4 는 디렉토리마다
 *    핸들을 잡아 큰 트리에서 EMFILE 위험이 있으므로 ignore/depth/error 가드를 함께 건다.
 *
 * 필터링(.html 만 · 무시 디렉토리 · 깊이)은 네이티브/폴백 공통으로 `shouldEmit` 에서 한다 —
 * 네이티브 recursive 는 트리 전체 이벤트를 주므로 콜백에서 골라내야 한다(핸들 수와는 무관).
 */
let native: NativeFSWatcher | null = null;
let chokidar: ChokidarFSWatcher | null = null;
const debounceTimers = new Map<string, NodeJS.Timeout>();

// 감시 제외 디렉토리 — ipc.ts 의 findHtmlMockups SKIP_DIRS 와 동일(노이즈/대용량).
const IGNORE_DIRS = new Set([
  "node_modules",
  "dist",
  "out",
  "build",
  "coverage",
  ".git",
  ".turbo",
  ".cache",
  ".pnpm",
  ".yarn",
  ".next",
  ".vite",
  ".svelte-kit",
]);

// findHtmlMockups 가 depth ≤ 6 까지만 목업을 수집하므로 그보다 깊은 변경은 대상이 아니다.
const WATCH_DEPTH = 8;
const HTML_RE = /\.html?$/i;

/** 프로젝트 루트 기준 상대경로가 emit 대상(.html · 무시디렉토리 밖 · 깊이 이내)인지. */
function shouldEmit(relPath: string): boolean {
  // Windows(\) · POSIX(/) 양쪽 구분자를 받는다 — native recursive 콜백의 filename 은 OS 원시
  // 구분자(Windows 는 \)라, sep 만으로 split 하면 정규화된 forward-slash 입력을 못 나눈다.
  const segs = relPath.split(/[\\/]+/).filter(Boolean);
  if (segs.length === 0 || segs.length - 1 > WATCH_DEPTH) return false;
  if (segs.some((seg) => IGNORE_DIRS.has(seg))) return false;
  return HTML_RE.test(segs[segs.length - 1]);
}

export function startWatch(projectPath: string, sender: WebContents): void {
  stopWatch();

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

  // 와처가 죽으면 렌더러에 알려 '생성 중' 배지/자동추적을 끄게 한다(무음 정지 방지).
  // 정상 종료(프로젝트 전환·창 종료)와 구분해 error 경로에서만 보낸다.
  const notifyStopped = (reason: string): void => {
    if (!sender.isDestroyed()) sender.send("watch:stopped", { reason });
  };

  // 폴백: chokidar 디렉토리 감시 + ignore/depth/error 가드(큰 트리의 EMFILE 폭주 방지).
  // recursive 미지원(Linux) 초기 셋업뿐 아니라, native watcher 가 런타임에 죽었을 때도 재사용한다.
  const startChokidar = (): void => {
    chokidar = chokidarWatch(projectPath, {
      ignored: (p, stats) => {
        if (p.split(sep).some((seg) => IGNORE_DIRS.has(seg))) return true;
        if (stats?.isFile()) return !HTML_RE.test(p);
        return false;
      },
      ignoreInitial: true,
      persistent: true,
      depth: WATCH_DEPTH,
      ignorePermissionErrors: true,
    });
    chokidar.on("error", (err) => {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "EMFILE" || code === "ENOSPC") {
        console.warn(
          `[harness] 파일 감시 한도 초과(${code}) — 라이브 자동추적을 비활성화합니다. ` +
            "(macOS/Windows 빌드에선 네이티브 단일 핸들 감시라 발생하지 않습니다.)",
        );
        notifyStopped(code);
        stopWatch();
      } else {
        console.warn("[harness] 파일 감시 오류:", err);
      }
    });
    // relPath 는 항상 forward-slash 로 정규화 — renderer 의 inWorkspace 필터·previewUrl(split("/"))
    // 가 일관되게 동작한다(Windows 백슬래시 relPath 로 자동추적이 깨지던 문제 방지).
    const onChokidar = (abs: string): void =>
      emit(
        relative(projectPath, abs)
          .split(/[\\/]+/)
          .join("/"),
      );
    chokidar.on("change", onChokidar).on("add", onChokidar);
  };

  // 1순위: 네이티브 recursive watch (mac/win = 단일 핸들 → 폴더 크기와 무관하게 EMFILE 없음).
  try {
    native = nativeWatch(projectPath, { recursive: true, persistent: true }, (_event, filename) => {
      if (!filename) return; // 일부 이벤트는 filename 이 null
      const rel = filename.toString();
      // shouldEmit 은 원시 경로(양 구분자 허용)로, emit 은 forward-slash 정규화본으로.
      if (shouldEmit(rel)) emit(rel.split(/[\\/]+/).join("/"));
    });
    native.on("error", (err) => {
      // watch 등록 후 발생하는 런타임 오류(볼륨 unmount·폴더 삭제/이동·FSEvents 무효화 등)는
      // 동기 throw 가 아니라 이 이벤트로 온다 → 폴백 블록이 안 걸려 추적이 영구 정지하던 버그.
      console.warn("[harness] 네이티브 파일 감시 오류 — chokidar 로 전환:", err);
      if (native) {
        try {
          native.close();
        } catch {
          /* 이미 닫힘 */
        }
        native = null;
      }
      try {
        startChokidar(); // 런타임 사망 시 폴백 1회 시도
      } catch (e) {
        console.warn("[harness] chokidar 폴백 실패 — 자동추적 비활성화:", e);
        notifyStopped("watcher-error");
        stopWatch();
      }
    });
    return;
  } catch (err) {
    // recursive 미지원(Linux) 등 → chokidar 폴백.
    console.warn(
      "[harness] 네이티브 recursive 감시 불가 — chokidar 로 폴백합니다:",
      (err as Error).message,
    );
    native = null;
  }

  startChokidar();
}

export function stopWatch(): void {
  for (const t of debounceTimers.values()) clearTimeout(t);
  debounceTimers.clear();
  if (native) {
    try {
      native.close();
    } catch {
      /* 이미 닫힘 */
    }
    native = null;
  }
  if (chokidar) {
    void chokidar.close();
    chokidar = null;
  }
}
