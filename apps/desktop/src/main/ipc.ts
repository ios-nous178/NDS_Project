import { app, dialog, ipcMain, shell, BrowserWindow } from "electron";
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  recommendPagePattern,
  validateHtmlMockup,
  type RecommendPagePatternResult,
  type ValidateHtmlMockupResult,
} from "@nudge-design/mockup-core";
import { setPreviewRoot } from "./mockup-protocol.js";
import { lastValidProjectPath, writeAppState } from "./app-state.js";
import { startWatch, stopWatch } from "./watcher.js";
import { exportMockup, type ExportResult } from "./export-runner.js";
import { exportFigmaScene, type FigmaExportResult } from "./figma-export.js";
import { submitFeedback, type SubmitFeedbackArgs, type SubmitFeedbackResult } from "./feedback.js";
import {
  checkAgent,
  installAgent,
  resizeAgent,
  runningSessionIds,
  sendStreamTurn,
  startAgent,
  stopAgent,
  writeAgent,
  type AgentCheck,
  type AgentType,
  type InstallResult,
  type StartAgentArgs,
  type StartAgentErrorCode,
} from "./agent-runner.js";
import { logAppEvent } from "./events.js";
import {
  deleteSession,
  readSessions,
  readStructuredTranscript,
  readTranscript,
  reconcileStaleSessions,
  renameSession,
  type ChatSession,
} from "./sessions.js";
import type { ChatMessage } from "./chat-types.js";
import { isResumable } from "./agent-resume.js";
import { runIntake, type RunIntakeArgs } from "./intake.js";
import { checkForUpdate, type UpdateCheckResult } from "./update-check.js";
import { randomUUID } from "node:crypto";
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

/** project:current 응답 — 재시작 후 마지막 프로젝트 복원용(없으면 projectPath: null). */
export type CurrentProjectResult =
  | { projectPath: string; htmlEntries: string[] }
  | { projectPath: null };

/**
 * 폴더를 "활성 프로젝트"로 만든다 — 미리보기 루트(previewRoot) + 파일 와처 + persistence.
 *
 * 회고: previewRoot 는 project:open 에서만 잡혔고 "새 채팅"(pickFolder)·앱 재시작 후엔
 * null 이라 "no preview root" 가 떴다. 폴더를 잡는 모든 경로가 이 헬퍼를 거치게 해서
 * 미리보기 루트가 항상 따라오게 한다.
 */
function activateProject(projectPath: string, wc: Electron.WebContents | undefined | null): void {
  setPreviewRoot(projectPath);
  if (wc) startWatch(projectPath, wc);
  writeAppState({ lastProjectPath: projectPath });
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
  // 앱 버전(package.json) — 상단바 상시 노출용.
  ipcMain.handle("app:version", async (): Promise<string> => app.getVersion());

  // 헬프 센터의 외부 링크/메일 열기 — 안전한 스킴만 허용(기본 브라우저/메일 앱으로 위임).
  ipcMain.handle("shell:openExternal", async (_e, args: { url: string }): Promise<void> => {
    if (/^(https?|mailto):/i.test(args.url)) await shell.openExternal(args.url);
  });

  // 미리보기 HTML 을 별도 창으로 열기("새 창으로 열기"). 원본 파일을 직접 여는 대신 mockup://
  // 로 로드해, iframe 미리보기와 동일하게 DS runtime/CSS + 스탬프 바가 주입된 상태로 렌더한다.
  ipcMain.handle("preview:openWindow", async (_e, args: { relPath: string }): Promise<void> => {
    const rel = args.relPath?.trim();
    if (!rel) return;
    const url = `mockup://preview/${rel.split("/").map(encodeURIComponent).join("/")}`;
    const win = new BrowserWindow({
      width: 1280,
      height: 880,
      title: rel.split("/").pop() ?? "미리보기",
      backgroundColor: "#ffffff",
      webPreferences: { sandbox: true },
    });
    win.setMenuBarVisibility(false);
    // 로드 실패 진단 — mockup:// 404/403 은 안내 페이지로 resolve 되지만, 스킴/네비 오류는
    // did-fail-load 로 떨어진다(-3=ERR_ABORTED 무시). loadURL 거부도 삼키지 않고 로그.
    win.webContents.on("did-fail-load", (_e, code, desc) => {
      if (code === -3) return;
      console.error(`[main] 미리보기 창 로드 실패 ${code} ${desc} ${url}`);
    });
    await win.loadURL(url).catch((err) => {
      console.error("[main] 미리보기 창 loadURL 실패:", err);
    });
  });

  // 과거 세션 미리보기용 루트 전환. 채팅 세션은 프로젝트 폴더가 아니라 앱 전역(userData)에
  // 모이고, 각 세션의 mockupFile 은 그 세션이 작업한 폴더(cwd) 기준 상대경로다. previewRoot 는
  // 단일이라, 재시작 후 lastProjectPath 로만 복원되면 cwd 가 다른 세션의 미리보기가 엉뚱한 루트
  // 기준으로 풀려 "not found" 가 떴다. 렌더러가 미리보기를 띄우기 직전 그 세션의 cwd 로 루트만
  // 가볍게 바꾼다(activateProject 와 달리 와처/persistence 는 건드리지 않음 — 과거 보기는 비파괴).
  ipcMain.handle(
    "preview:setRoot",
    async (_e, args: { root: string }): Promise<{ ok: boolean }> => {
      const root = args.root?.trim();
      if (!root || !existsSync(root) || !statSync(root).isDirectory()) return { ok: false };
      setPreviewRoot(root);
      return { ok: true };
    },
  );

  // 업데이트 알림 — GitHub Releases 최신 데스크탑 빌드를 조회해 현재 버전과 비교(알림만, 자동설치 X).
  ipcMain.handle("update:check", async (): Promise<UpdateCheckResult> => checkForUpdate());

  // 헤더가 마운트 시 초기 전체화면 상태를 알도록(이후 변화는 window:fullscreen 이벤트).
  ipcMain.handle("window:isFullscreen", async (): Promise<boolean> => {
    return getWindow()?.isFullScreen() ?? false;
  });

  ipcMain.handle("project:open", async (): Promise<OpenProjectResult | { canceled: true }> => {
    const win = getWindow();
    const result = await dialog.showOpenDialog(win ?? undefined!, {
      properties: ["openDirectory"],
      title: "목업 프로젝트 폴더 선택",
    });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const projectPath = result.filePaths[0];
    // 미리보기 프로토콜 루트 + 파일 와처 + persistence 를 이 프로젝트로 전환.
    activateProject(projectPath, win?.webContents);
    const htmlEntries = findHtmlMockups(projectPath);
    logAppEvent(projectPath, {
      type: "project_opened",
      payload: { mockupCount: htmlEntries.length },
    });
    return { projectPath, htmlEntries };
  });

  // 재시작 후 마지막 프로젝트 복원 — 렌더러가 마운트 시 호출. previewRoot/와처를 다시 잡아
  // "no preview root" 없이 곧바로 미리보기가 되게 한다. (없으면 projectPath: null)
  ipcMain.handle("project:current", async (): Promise<CurrentProjectResult> => {
    const last = lastValidProjectPath();
    if (!last) return { projectPath: null };
    activateProject(last, getWindow()?.webContents);
    return { projectPath: last, htmlEntries: findHtmlMockups(last) };
  });

  // 작업 폴더 선택 — 새 채팅 시작 시 PTY 가 돌 cwd 를 고른다.
  // 이 폴더에서 에이전트가 목업을 생성하므로 미리보기 루트(+와처)도 함께 이 폴더로 잡는다
  // (회고: 안 잡으면 생성된 목업 미리보기가 "no preview root" 로 막혔다).
  ipcMain.handle(
    "dialog:pick-folder",
    async (): Promise<{ folder: string } | { canceled: true }> => {
      const win = getWindow();
      const res = await dialog.showOpenDialog(win ?? undefined!, {
        properties: ["openDirectory", "createDirectory"],
        title: "작업 폴더 선택",
      });
      if (res.canceled || res.filePaths.length === 0) return { canceled: true };
      const folder = res.filePaths[0];
      activateProject(folder, win?.webContents);
      return { folder };
    },
  );

  ipcMain.handle("watch:stop", async (): Promise<{ ok: true }> => {
    stopWatch();
    return { ok: true };
  });

  // 와처가 .html 변경을 알릴 때 렌더러가 상단 목업 목록을 다시 채우도록 재스캔.
  // (인앱 에이전트/인테이크가 새 목업을 만들면 드롭다운에 즉시 반영하기 위함.)
  ipcMain.handle(
    "project:rescan",
    async (_e, args: { projectPath: string }): Promise<{ htmlEntries: string[] }> => {
      return { htmlEntries: findHtmlMockups(args.projectPath) };
    },
  );

  ipcMain.handle(
    "mockup:read",
    async (_e, args: { filePath: string }): Promise<{ source: string }> => {
      return { source: readFileSync(args.filePath, "utf8") };
    },
  );

  // 인터랙티브 검증(파일 열기/저장 시 UI 패널용). HTML 룰 셋만 돌린다 — TSX 목업은 하네스 범위 밖이고,
  // 필요하면 에이전트가 번들 MCP 서브프로세스의 validate_html_mockup 으로 닿는다(catalog-config 주석 참고).
  // 의도적으로 MCP 핸들러의 report(Google Sheets usage POST)·withStats(analyze) 를 붙이지 않는다:
  // DS 사용량 보고의 단일 'ship moment' 은 Export(export-runner → reportHtmlMockupUsage)다. 파일 열 때마다
  // 검증이 자동 POST 하면 같은 목업이 사용량 행을 중복 적재한다. cwd 는 filePath 의 dirname 으로 자동 폴백되어
  // nudge.surface/nudge.brand 마커를 그대로 읽으므로 별도 전달 불필요.
  ipcMain.handle(
    "validate:run",
    async (_e, args: { filePath: string }): Promise<ValidateHtmlMockupResult> => {
      return validateHtmlMockup({ filePath: args.filePath });
    },
  );

  // ── 비파괴 내보내기 (공유용 HTML) ──
  // mockupDir = 활성 목업 서브폴더(빌드 cwd). 없으면 projectPath 루트에서 빌드(Model 1 호환).
  ipcMain.handle(
    "export:run",
    async (_e, args: { projectPath: string; mockupDir?: string }): Promise<ExportResult> => {
      const result = await exportMockup(args.projectPath, args.mockupDir, app.getVersion());
      logAppEvent(args.projectPath, {
        type: result.build.ok ? "export_completed" : "error_occurred",
        mockupFile: result.projectOutputRel,
        payload: { ok: result.build.ok, sizeKb: result.build.sizeKb, error: result.build.error },
      });
      return result;
    },
  );

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

  // ── Figma 평면 레이어 export (canary) ──
  // dist 를 화면 밖 창에 렌더 → DOM 추출 → dist/.figma/scene.json 저장 + 클립보드 복사.
  // 짝 플러그인(tools/figma-plugin)이 그 scene.json 을 Figma 캔버스에 짓는다. 전부 로컬.
  ipcMain.handle(
    "figma:export",
    async (_e, args: { projectPath: string; mockupDir?: string }): Promise<FigmaExportResult> => {
      const result = await exportFigmaScene(args.projectPath, args.mockupDir, app.getVersion());
      logAppEvent(args.projectPath, {
        type: result.ok ? "export_completed" : "error_occurred",
        mockupFile: result.sceneRel,
        payload: {
          kind: "figma-scene",
          ok: result.ok,
          nodeCount: result.nodeCount,
          error: result.error,
        },
      });
      return result;
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

  // 구조화(stream-json) 세션의 다음 유저 턴(JSON 라인으로 stdin write). pty 세션이면 무시됨.
  ipcMain.handle(
    "agent:sendTurn",
    async (_e, args: { sessionId: string; text: string }): Promise<void> => {
      sendStreamTurn(args.sessionId, args.text);
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

  // ── 에이전트 CLI 설치 안내 — 미설치 시 렌더러가 점검 후 원클릭 설치 ──
  ipcMain.handle(
    "agent:check",
    async (_e, args: { agentType: AgentType }): Promise<AgentCheck> => checkAgent(args.agentType),
  );
  ipcMain.handle(
    "agent:install",
    async (_e, args: { agentType: AgentType }): Promise<InstallResult> =>
      installAgent(args.agentType),
  );

  // ── 채팅기록 (Phase 6) — 로컬 세션 메타/트랜스크립트 조회 ──
  ipcMain.handle(
    "session:list",
    async (_e, args: { projectPath: string }): Promise<ChatSession[]> => {
      // 리스트를 읽기 직전, 라이브 PTY 가 없는 stale "active"(재시작/크래시 잔재)를 정리.
      reconcileStaleSessions(args.projectPath, runningSessionIds());
      // resumable 은 계산 필드 — 렌더러는 fs(네이티브 store 존재)를 못 보므로 여기서 판정해 붙인다.
      return readSessions(args.projectPath).map((s) => ({ ...s, resumable: isResumable(s) }));
    },
  );

  ipcMain.handle(
    "session:transcript",
    async (_e, args: { projectPath: string; sessionId: string }): Promise<{ text: string }> => {
      return { text: readTranscript(args.projectPath, args.sessionId) };
    },
  );

  // 구조화(stream-json) 세션의 정규화 메시지 — 카드형 재생용(과거 세션 다시 열기).
  ipcMain.handle(
    "session:structuredTranscript",
    async (
      _e,
      args: { projectPath: string; sessionId: string },
    ): Promise<{ messages: ChatMessage[] }> => {
      return { messages: readStructuredTranscript(args.projectPath, args.sessionId) };
    },
  );

  // 세션 제목 변경(채팅기록 인라인 편집). 빈 문자열이면 기본 제목으로 되돌린다.
  ipcMain.handle(
    "session:rename",
    async (
      _e,
      args: { projectPath: string; sessionId: string; title: string },
    ): Promise<{ ok: boolean }> => {
      return renameSession(args.projectPath, args.sessionId, args.title);
    },
  );

  // 세션 메타 + raw 트랜스크립트 삭제. 실행 중이면 먼저 PTY 를 종료한다.
  ipcMain.handle(
    "session:delete",
    async (_e, args: { projectPath: string; sessionId: string }): Promise<{ ok: boolean }> => {
      stopAgent(args.sessionId);
      return deleteSession(args.projectPath, args.sessionId);
    },
  );

  // 끝난 세션을 CLI 네이티브 resume 으로 이어간다(resume v1). 저장된 ChatSession 에서 레시피를
  // 복원해 startAgent 의 resume 모드로 재spawn. resume 은 항상 PTY(claude store 는 transport
  // 무관 → stream-json 세션도 PTY 로 이어감). 성공하면 렌더러가 attach 로 라이브 패널을 붙인다.
  ipcMain.handle(
    "session:resume",
    async (
      _e,
      args: { projectPath: string; sessionId: string; cols?: number; rows?: number },
    ): Promise<{ ok: boolean; error?: string; code?: StartAgentErrorCode }> => {
      const wc = getWindow()?.webContents;
      if (!wc) return { ok: false, error: "창이 없습니다." };
      const s = readSessions(args.projectPath).find((x) => x.sessionId === args.sessionId);
      if (!s) return { ok: false, error: "세션을 찾을 수 없습니다." };
      if (!isResumable(s) || !s.agentSessionId || !s.cwd) {
        return { ok: false, error: "이 세션은 이어갈 수 없습니다(저장된 대화 기록이 없습니다)." };
      }
      // 이어가기 = 그 세션의 폴더(s.cwd)에서 다시 작업한다 → 미리보기 루트·파일 와처·persistence
      // 를 그 폴더로 전환한다. 안 하면 와처가 옛 폴더를 보고 있어 재개된 에이전트가 만든 파일을
      // 자동추적 못 하고, export 가 현재 활성 프로젝트(다른 폴더) 루트를 빌드해 "index.html 없음"
      // 으로 실패한다. 렌더러도 onResume 에서 projectPath 를 s.cwd 로 맞춘다.
      activateProject(s.cwd, wc);
      return startAgent(
        {
          sessionId: s.sessionId,
          agentType: s.agentType,
          projectPath: args.projectPath,
          cwdOverride: s.cwd,
          mockupFile: s.mockupFile,
          screenName: s.screenName,
          brand: s.brand,
          surface: s.surface,
          intent: s.intent,
          transport: "pty",
          cols: args.cols,
          rows: args.rows,
          resume: { agentSessionId: s.agentSessionId, agentSessionFile: s.agentSessionFile },
        },
        wc,
      );
    },
  );

  // ── Page Pattern 1차 추천 — 캐포비 어드민 intake 카드용(키워드 점수, mockup-core SSOT). ──
  // 점수 로직은 MCP recommend_page_pattern 과 동일 함수. 카드가 top 을 미리 고르고 사용자가 바꾼다.
  ipcMain.handle(
    "intake:recommend-page-pattern",
    async (
      _e,
      args: { prd?: string; brand?: string; surface?: string },
    ): Promise<RecommendPagePatternResult> => recommendPagePattern(args?.prd ?? ""),
  );

  // ── 인테이크 (Level 2) — 게이트 충족 파일 작성 후 시드 세션 시작 ──
  // runIntake 가 references.md/brief.md/CLAUDE.md/AGENTS.md 를 서브폴더에 쓰고, startAgent 가
  // 그 폴더를 cwd 로 시드 프롬프트와 함께 PTY 를 띄운다. sessionId 를 돌려줘 렌더러가 터미널을 attach.
  ipcMain.handle(
    "intake:start",
    async (
      _e,
      args: RunIntakeArgs & {
        cols?: number;
        rows?: number;
        transport?: StartAgentArgs["transport"];
      },
    ): Promise<{
      ok: boolean;
      sessionId?: string;
      slug?: string;
      intent?: "html" | "admin-cms";
      error?: string;
      code?: StartAgentErrorCode;
    }> => {
      const wc = getWindow()?.webContents;
      if (!wc) return { ok: false, error: "창이 없습니다." };
      const r = runIntake(args);
      if (!r.ok || !r.workspaceDir) return { ok: false, error: r.error ?? "인테이크 실패" };

      logAppEvent(args.projectPath, {
        type: "intake_created",
        mockupFile: `${r.slug}/index.html`,
        payload: { brand: args.brand, surface: args.surface, intent: r.intent, slug: r.slug },
      });

      const sessionId = randomUUID();
      const started = startAgent(
        {
          sessionId,
          agentType: args.agentType,
          transport: args.transport,
          projectPath: args.projectPath,
          cwdOverride: r.workspaceDir,
          initialPrompt: r.seedPrompt,
          mockupFile: `${r.slug}/index.html`,
          screenName: args.screenName,
          brand: args.brand,
          surface: args.surface,
          intent: r.intent,
          cols: args.cols,
          rows: args.rows,
        },
        wc,
      );
      if (!started.ok) return { ok: false, error: started.error, code: started.code };
      return { ok: true, sessionId, slug: r.slug, intent: r.intent };
    },
  );
}

export type { AgentType };
export type { ChatSession } from "./sessions.js";
