import { dialog, ipcMain, type BrowserWindow } from "electron";
import { copyFileSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { validateHtmlMockup, type ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import { setPreviewRoot } from "./mockup-protocol.js";
import { startWatch, stopWatch } from "./watcher.js";
import { exportMockup, type ExportResult } from "./export-runner.js";
import { submitFeedback, type SubmitFeedbackArgs, type SubmitFeedbackResult } from "./feedback.js";

// dot-폴더를 일괄 차단하지 않는다(.demo 같은 정당한 목업 위치를 노출하기 위해).
// 대신 노이즈/대용량 디렉토리만 막고, <nds-*> 내용 필터가 나머지를 걸러낸다.
const SKIP_DIRS = new Set([
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
const HTML_RE = /\.html?$/i;
const NDS_USE_RE = /<nds-[a-z][a-z0-9-]*/i;

export interface OpenProjectResult {
  projectPath: string;
  htmlEntries: string[];
}

/** chosen 디렉토리에서 <nds-*> 를 쓰는 .html 파일을 얕게 스캔 (depth ≤ 6). */
function findHtmlMockups(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string, depth: number): void => {
    if (depth > 6 || out.length >= 200) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (out.length >= 200) return;
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        walk(join(dir, e.name), depth + 1);
      } else if (e.isFile() && HTML_RE.test(e.name)) {
        const full = join(dir, e.name);
        try {
          if (NDS_USE_RE.test(readFileSync(full, "utf8"))) out.push(full);
        } catch {
          /* skip unreadable */
        }
      }
    }
  };
  walk(root, 0);
  out.sort((a, b) => {
    try {
      return statSync(b).mtimeMs - statSync(a).mtimeMs;
    } catch {
      return 0;
    }
  });
  return out.map((p) => relative(root, p));
}

export function registerIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle("project:open", async (): Promise<OpenProjectResult | { canceled: true }> => {
    const win = getWindow();
    const result = await dialog.showOpenDialog(win ?? undefined!, {
      properties: ["openDirectory"],
      title: "목업 프로젝트 폴더 선택",
    });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const projectPath = result.filePaths[0];
    // 미리보기 프로토콜 루트 + 파일 와처를 이 프로젝트로 전환.
    setPreviewRoot(projectPath);
    const wc = win?.webContents;
    if (wc) startWatch(projectPath, wc);
    return { projectPath, htmlEntries: findHtmlMockups(projectPath) };
  });

  ipcMain.handle("watch:stop", async (): Promise<{ ok: true }> => {
    stopWatch();
    return { ok: true };
  });

  ipcMain.handle(
    "mockup:read",
    async (_e, args: { filePath: string }): Promise<{ source: string }> => {
      return { source: readFileSync(args.filePath, "utf8") };
    },
  );

  ipcMain.handle(
    "validate:run",
    async (_e, args: { filePath: string }): Promise<ValidateHtmlMockupResult> => {
      return validateHtmlMockup({ filePath: args.filePath });
    },
  );

  // ── 비파괴 내보내기 (공유용 HTML) ──
  ipcMain.handle("export:run", async (_e, args: { projectPath: string }): Promise<ExportResult> => {
    return exportMockup(args.projectPath);
  });

  // 자체완결 산출물을 사용자가 고른 파일명/위치로 저장(복사). dist 아티팩트는 그대로 둔다.
  ipcMain.handle(
    "export:save",
    async (
      _e,
      args: { sourcePath: string; defaultPath: string },
    ): Promise<{ saved: boolean; path?: string }> => {
      const res = await dialog.showSaveDialog(getWindow() ?? undefined!, {
        title: "공유용 HTML 저장",
        defaultPath: args.defaultPath,
        filters: [{ name: "HTML", extensions: ["html"] }],
      });
      if (res.canceled || !res.filePath) return { saved: false };
      copyFileSync(args.sourcePath, res.filePath);
      return { saved: true, path: res.filePath };
    },
  );

  // ── 유저 피드백 (Phase 3) — 로컬 .ds-feedback-log.jsonl 저장만 (webhook OFF) ──
  ipcMain.handle(
    "feedback:submit",
    async (_e, args: SubmitFeedbackArgs): Promise<SubmitFeedbackResult> => {
      return submitFeedback(args);
    },
  );
}
