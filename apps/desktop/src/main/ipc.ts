import { dialog, ipcMain, type BrowserWindow } from "electron";
import { copyFileSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { validateHtmlMockup, type ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import { setPreviewRoot } from "./mockup-protocol.js";
import { startWatch, stopWatch } from "./watcher.js";
import { exportMockup, type ExportResult } from "./export-runner.js";
import { submitFeedback, type SubmitFeedbackArgs, type SubmitFeedbackResult } from "./feedback.js";
import {
  resizeAgent,
  startAgent,
  stopAgent,
  writeAgent,
  type AgentType,
  type StartAgentArgs,
} from "./agent-runner.js";
import { logAppEvent } from "./events.js";
import type { AppEventInput } from "@nudge-design/mockup-core";

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
    const htmlEntries = findHtmlMockups(projectPath);
    logAppEvent(projectPath, {
      type: "project_opened",
      payload: { mockupCount: htmlEntries.length },
    });
    return { projectPath, htmlEntries };
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
    const result = await exportMockup(args.projectPath);
    logAppEvent(args.projectPath, {
      type: result.build.ok ? "export_completed" : "error_occurred",
      mockupFile: result.outputRel,
      payload: { ok: result.build.ok, sizeKb: result.build.sizeKb, error: result.build.error },
    });
    return result;
  });

  // 저장 위치/파일명 먼저 고르기 — 빌드 전에 호출한다(=고른 폴더로 바로 내보내는 흐름).
  // 다이얼로그만 띄우고 경로만 돌려준다. 실제 기록은 빌드 후 export:place 가 한다.
  ipcMain.handle(
    "export:pickPath",
    async (_e, args: { defaultPath: string }): Promise<{ path?: string }> => {
      const res = await dialog.showSaveDialog(getWindow() ?? undefined!, {
        title: "공유용 HTML 내보낼 위치",
        defaultPath: args.defaultPath,
        filters: [{ name: "HTML", extensions: ["html"] }],
      });
      if (res.canceled || !res.filePath) return {};
      return { path: res.filePath };
    },
  );

  // 자체완결 산출물(dist/index.html)을 미리 고른 목적지로 기록. dist 아티팩트는 그대로 둔다(앱 내 미리보기용).
  ipcMain.handle(
    "export:place",
    async (_e, args: { sourcePath: string; destPath: string }): Promise<{ path: string }> => {
      copyFileSync(args.sourcePath, args.destPath);
      return { path: args.destPath };
    },
  );

  // ── 유저 피드백 (Phase 3) — 로컬 .ds-feedback-log.jsonl 저장만 (webhook OFF) ──
  ipcMain.handle(
    "feedback:submit",
    async (_e, args: SubmitFeedbackArgs): Promise<SubmitFeedbackResult> => {
      const res = submitFeedback(args);
      if (res.ok) {
        logAppEvent(args.projectPath, {
          type: "feedback_submitted",
          mockupFile: args.mockupFile,
          payload: { kind: args.kind, feedbackId: res.entry?.feedbackId },
        });
      }
      return res;
    },
  );

  // ── 앱 이벤트 로그 (Phase 5) — 로컬 .ds-app-events.jsonl 만 ──
  // 렌더러가 UI 맥락을 가진 이벤트(mockup_selected · validation_completed 등)를 명시 기록.
  ipcMain.handle(
    "event:append",
    async (
      _e,
      args: { projectPath: string } & Omit<AppEventInput, "projectPathHash">,
    ): Promise<{ ok: true }> => {
      const { projectPath, ...input } = args;
      logAppEvent(projectPath, input);
      return { ok: true };
    },
  );

  // ── 인앱 에이전트 (Phase 5) — claude/codex 를 PTY 로 구동 ──
  ipcMain.handle(
    "agent:start",
    async (_e, args: StartAgentArgs): Promise<{ ok: boolean; error?: string }> => {
      const wc = getWindow()?.webContents;
      if (!wc) return { ok: false, error: "창이 없습니다." };
      return startAgent(args, wc);
    },
  );

  ipcMain.handle(
    "agent:input",
    async (_e, args: { sessionId: string; data: string }): Promise<void> => {
      writeAgent(args.sessionId, args.data);
    },
  );

  ipcMain.handle(
    "agent:resize",
    async (_e, args: { sessionId: string; cols: number; rows: number }): Promise<void> => {
      resizeAgent(args.sessionId, args.cols, args.rows);
    },
  );

  ipcMain.handle("agent:stop", async (_e, args: { sessionId: string }): Promise<void> => {
    stopAgent(args.sessionId);
  });
}

export type { AgentType };
