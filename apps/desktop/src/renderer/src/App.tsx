import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import type { ChatSession } from "../../preload/index.js";
import { ValidationPanel } from "./panels/ValidationPanel.js";
import { PreviewPanel, type Viewport } from "./panels/PreviewPanel.js";
import { FeedbackPanel } from "./panels/FeedbackPanel.js";
import { AgentPanel } from "./panels/AgentPanel.js";
import { SessionHistoryPanel, sessionTitle } from "./panels/SessionHistoryPanel.js";
import { TranscriptView } from "./panels/TranscriptView.js";
import { ExportButton } from "./panels/ExportButton.js";
import { IntakeModal } from "./panels/IntakeModal.js";
import { HelpModal } from "./panels/HelpModal.js";
import { Dropdown } from "./ui/Dropdown.js";
import { Logo } from "./ui/Logo.js";
import { Resizer } from "./ui/Resizer.js";
import {
  c,
  dragRegion,
  font,
  ghostBtn,
  mono,
  noDrag,
  pillBtn,
  pillBtnActive,
  primaryBtn,
  primaryBtnDisabled,
  tabBar,
  segGroup,
  segItem,
  segItemActive,
} from "./ui/theme.js";

type PreviewTab = "preview" | "validate" | "feedback" | "source";

// 3분할 폭(px) 사용자 조절. 1·2섹션은 고정폭, 3섹션(미리보기)은 나머지를 채운다.
const PANES_KEY = "nudge-studio:pane-widths";
const PANE = { sidebarMin: 200, sidebarMax: 480, chatMin: 360, previewMin: 360 };
const PANE_DEFAULT = { sidebar: 260, chat: 560 };

const clampNum = (v: number, lo: number, hi: number): number => Math.min(Math.max(v, lo), hi);

function loadPaneWidths(): { sidebar: number; chat: number } {
  try {
    const raw = localStorage.getItem(PANES_KEY);
    if (raw) {
      const p = JSON.parse(raw) as { sidebar?: unknown; chat?: unknown };
      if (typeof p.sidebar === "number" && typeof p.chat === "number") {
        return { sidebar: p.sidebar, chat: p.chat };
      }
    }
  } catch {
    // 손상된 값은 기본값으로.
  }
  return { ...PANE_DEFAULT };
}

export function App(): React.JSX.Element {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");
  const [result, setResult] = useState<ValidateHtmlMockupResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [bust, setBust] = useState(0);
  const [previewRel, setPreviewRel] = useState<string | null>(null);
  const [exportedRel, setExportedRel] = useState<string | null>(null);
  // 미리보기 칼럼
  const [tab, setTab] = useState<PreviewTab>("preview");
  const [viewport, setViewport] = useState<Viewport>("web");
  // 채팅기록
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [viewing, setViewing] = useState<ChatSession | null>(null);
  // 인테이크
  const [intakeOpen, setIntakeOpen] = useState(false);
  // 헬프 센터(상단 ? 버튼)
  const [helpOpen, setHelpOpen] = useState(false);
  const [attachSessionId, setAttachSessionId] = useState<string | null>(null);
  /** 현재 컨텍스트의 intent — admin-cms 면 HTML 미리보기/내보내기 비대상(채팅 전용). */
  const [activeIntent, setActiveIntent] = useState<"html" | "admin-cms">("html");
  /** 인테이크가 만든 목업 폴더 슬러그(빌드/내보내기 cwd 계산용). */
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // 3분할 폭 — 리사이저 드래그로 조절, localStorage 에 기억.
  const [paneW, setPaneW] = useState(loadPaneWidths);
  const paneRowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(PANES_KEY, JSON.stringify(paneW)), 150);
    return () => clearTimeout(id);
  }, [paneW]);
  // 창이 줄어 미리보기(3섹션)가 사라지지 않도록 컨테이너 폭 변화 시 clamp.
  useEffect(() => {
    const el = paneRowRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w === 0) return;
      setPaneW((p) => {
        const maxChat = Math.max(PANE.chatMin, w - p.sidebar - PANE.previewMin);
        const chat = Math.min(p.chat, maxChat);
        const maxSidebar = clampNum(w - chat - PANE.previewMin, PANE.sidebarMin, PANE.sidebarMax);
        const sidebar = Math.min(p.sidebar, maxSidebar);
        return sidebar === p.sidebar && chat === p.chat ? p : { sidebar, chat };
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const resizeSidebar = useCallback((clientX: number) => {
    const el = paneRowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPaneW((p) => {
      const maxSidebar = clampNum(
        rect.width - p.chat - PANE.previewMin,
        PANE.sidebarMin,
        PANE.sidebarMax,
      );
      return { ...p, sidebar: clampNum(clientX - rect.left, PANE.sidebarMin, maxSidebar) };
    });
  }, []);
  const resizeChat = useCallback((clientX: number) => {
    const el = paneRowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPaneW((p) => {
      const maxChat = Math.max(PANE.chatMin, rect.width - p.sidebar - PANE.previewMin);
      return { ...p, chat: clampNum(clientX - rect.left - p.sidebar, PANE.chatMin, maxChat) };
    });
  }, []);

  const selectedRef = useRef<string | null>(null);
  const projectRef = useRef<string | null>(null);
  // 라이브 세션이 도는 동안 작업 폴더의 최신 HTML 을 미리보기로 자동 추적.
  // 사용자가 목업을 직접 고르면 해제(autoFollow=false). 새 인테이크 시작 시 재개.
  const liveRef = useRef<string | null>(null);
  const slugRef = useRef<string | null>(null);
  const intentRef = useRef<"html" | "admin-cms">("html");
  // autoFollow 는 와처 콜백(고정 클로저)에서 ref 로 읽지만, "생성 중" 뱃지가 미리보기
  // 상태를 따라가야 하므로 state 로도 들고 매 렌더 ref 에 미러링한다.
  const [autoFollow, setAutoFollow] = useState(true);
  const autoFollowRef = useRef(true);
  autoFollowRef.current = autoFollow;
  liveRef.current = liveSessionId;
  slugRef.current = activeSlug;
  intentRef.current = activeIntent;
  // 타이틀바 패딩 분기용(신호등 vs Windows 오버레이).
  const isMac = window.harness.platform === "darwin";
  const [appVersion, setAppVersion] = useState<string>("");
  useEffect(() => {
    void window.harness.getVersion().then(setAppVersion);
  }, []);

  // 전체화면이면 mac 신호등이 사라지므로 헤더 좌측 84px 예약을 푼다.
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    void window.harness.isFullscreen().then(setIsFullscreen);
    return window.harness.onFullscreenChange(setIsFullscreen);
  }, []);

  const loadFile = useCallback(async (projectRoot: string, rel: string) => {
    const abs = `${projectRoot}/${rel}`;
    setValidating(true);
    const [{ source: src }, validation] = await Promise.all([
      window.harness.readMockup(abs),
      window.harness.validate(abs),
    ]);
    setSource(src);
    setResult(validation);
    setValidating(false);
    setBust((b) => b + 1);
    void window.harness.appendEvent({
      projectPath: projectRoot,
      type: "validation_completed",
      mockupFile: rel,
      payload: { ok: validation.ok },
    });
  }, []);

  const openProject = useCallback(async () => {
    const res = await window.harness.openProject();
    if ("canceled" in res) return;
    setProjectPath(res.projectPath);
    projectRef.current = res.projectPath;
    setEntries(res.htmlEntries);
    setSelected(null);
    selectedRef.current = null;
    setSource("");
    setResult(null);
    setExportedRel(null);
    setPreviewRel(null);
    setViewing(null);
    setLiveSessionId(null);
    setAttachSessionId(null);
    setActiveIntent("html");
    setActiveSlug(null);
    setIntakeOpen(false);
    setHistoryRefresh((n) => n + 1);
  }, []);

  const selectEntry = useCallback(
    (rel: string) => {
      if (!projectPath || !rel) return;
      // 사용자가 직접 고른 목업이 있으면 라이브 자동추적 해제.
      setAutoFollow(false);
      setSelected(rel);
      selectedRef.current = rel;
      setPreviewRel(rel);
      setTab("preview");
      // 기존(목록의) 목업은 HTML 미리보기 대상 — admin-cms 비활성 상태를 해제.
      setActiveIntent("html");
      void loadFile(projectPath, rel);
      void window.harness.appendEvent({ projectPath, type: "mockup_selected", mockupFile: rel });
    },
    [projectPath, loadFile],
  );

  useEffect(() => {
    return window.harness.onFileChanged((e) => {
      const root = projectRef.current;
      if (!root) return;
      if (e.relPath === selectedRef.current) {
        void loadFile(root, e.relPath);
      } else {
        // 터미널에서 목업 생성 중이면, 작업 폴더 안에서 새로 생기거나 바뀐 HTML 을
        // 자동으로 미리보기에 띄워 "작업 중인 화면" 을 실시간으로 보여준다.
        // (admin-cms 세션은 HTML 미리보기 대상이 아니므로 제외. 사용자가 목업을
        //  직접 고르면 autoFollow=false 로 꺼지고, 새 인테이크 시작 시 다시 켜진다.)
        const slug = slugRef.current;
        const inWorkspace = slug ? e.relPath.startsWith(`${slug}/`) : true;
        if (
          autoFollowRef.current &&
          liveRef.current &&
          intentRef.current !== "admin-cms" &&
          inWorkspace
        ) {
          setSelected(e.relPath);
          selectedRef.current = e.relPath;
          setPreviewRel(e.relPath);
          setTab("preview");
          void loadFile(root, e.relPath);
        }
      }
      // 인앱 에이전트/인테이크가 새 목업을 쓰면 상단 드롭다운 목록을 갱신.
      // (와처가 200ms 디바운스하므로 재스캔 빈도는 안전. 변경이 없으면 setState 생략.)
      void window.harness.rescanMockups(root).then(({ htmlEntries }) => {
        setEntries((prev) =>
          prev.length === htmlEntries.length && prev.every((p, i) => p === htmlEntries[i])
            ? prev
            : htmlEntries,
        );
      });
    });
  }, [loadFile]);

  const refreshHistory = useCallback(() => setHistoryRefresh((n) => n + 1), []);

  // 빌드/내보내기 cwd = 선택된 목업의 폴더(없으면 인테이크가 만든 슬러그 폴더). 둘 다 없으면 루트.
  const activeMockupDir = useMemo(() => {
    if (!projectPath) return undefined;
    const rel = selected ?? (activeSlug ? `${activeSlug}/index.html` : null);
    if (!rel) return undefined;
    const slash = rel.lastIndexOf("/");
    const dir = slash > 0 ? rel.slice(0, slash) : "";
    return dir ? `${projectPath}/${dir}` : projectPath;
  }, [projectPath, selected, activeSlug]);

  const isAdminCms = activeIntent === "admin-cms";
  // "생성 중" 뱃지 = 지금 미리보기에 뜬 목업이 라이브 출력을 실제로 따라가는 중일 때만.
  // (과거 세션 보는 중이거나 사용자가 특정 목업을 직접 고르면 자동추적이 꺼져 뱃지도 꺼진다.)
  const previewLive = liveSessionId !== null && autoFollow && !viewing;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: c.bg,
        color: c.text,
        fontFamily: font,
      }}
    >
      {/* 상단바 (커스텀 타이틀바 — 헤더로 창 드래그). mac 은 좌측 신호등 자리(84px),
          Windows 는 우측 네이티브 컨트롤 오버레이 자리(146px)를 비운다. */}
      <header
        style={{
          ...dragRegion,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: isMac ? (isFullscreen ? "8px 14px" : "8px 14px 8px 84px") : "8px 146px 8px 14px",
          borderBottom: `1px solid ${c.border}`,
          background: c.bgPanel,
        }}
      >
        <span style={{ color: c.text, display: "flex", alignItems: "center" }}>
          <Logo size={24} />
        </span>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, marginRight: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <strong style={{ fontSize: 13, color: c.text }}>Nudge Studio</strong>
            {appVersion && (
              <span
                style={{
                  fontSize: 10,
                  color: c.textMuted,
                  fontFamily: mono,
                  padding: "1px 5px",
                  borderRadius: 4,
                  border: `1px solid ${c.border}`,
                }}
              >
                v{appVersion}
              </span>
            )}
          </span>
          <span style={{ fontSize: 10, color: c.textMuted }}>
            Design System Powered Mockup Builder
          </span>
        </div>
        <button onClick={openProject} style={{ ...ghostBtn, ...noDrag }}>
          프로젝트 열기
        </button>
        <button
          onClick={() => setIntakeOpen(true)}
          disabled={!projectPath}
          title={
            liveSessionId !== null
              ? "새 목업을 시작하면 실행 중인 세션은 중지됩니다 (목업 폴더는 그대로 보존)"
              : undefined
          }
          style={{
            ...(projectPath ? primaryBtn : primaryBtnDisabled),
            ...noDrag,
          }}
        >
          + 새 목업
        </button>
        <div style={{ ...noDrag, width: 300 }}>
          <Dropdown
            value={selected ?? ""}
            options={entries.map((e) => ({ value: e, label: e }))}
            onChange={selectEntry}
            placeholder={entries.length ? `목업 선택 (${entries.length})` : "목업 없음"}
            disabled={entries.length === 0}
            mono
          />
        </div>
        {exportedRel && (
          <button
            onClick={() => {
              setPreviewRel(exportedRel);
              setTab("preview");
              setBust((b) => b + 1);
            }}
            title={exportedRel}
            style={{ ...(previewRel === exportedRel ? pillBtnActive : pillBtn), ...noDrag }}
          >
            📦 공유본
          </button>
        )}
        <div
          style={{ ...noDrag, marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}
        >
          <ExportButton
            projectPath={projectPath}
            mockupDir={activeMockupDir}
            disabled={isAdminCms}
            onExported={(rel) => {
              setExportedRel(rel);
              setPreviewRel(rel);
              setTab("preview");
              setBust((b) => b + 1);
            }}
          />
          {projectPath && (
            <span
              style={{
                color: c.textFaint,
                fontSize: 11,
                fontFamily: mono,
                maxWidth: 260,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={projectPath}
            >
              {projectPath}
            </span>
          )}
          <button
            onClick={() => setHelpOpen(true)}
            title="도움말 · 문의"
            aria-label="도움말"
            style={{
              ...ghostBtn,
              ...noDrag,
              width: 28,
              height: 28,
              padding: 0,
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ?
          </button>
        </div>
      </header>

      {/* 3분할 — 1·2섹션 고정폭(드래그 조절), 3섹션이 나머지를 채운다. */}
      <div
        ref={paneRowRef}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          position: "relative",
        }}
      >
        {/* 채팅기록 */}
        <aside
          style={{
            width: paneW.sidebar,
            flexShrink: 0,
            borderRight: `1px solid ${c.border}`,
            background: c.bgPanel,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <SessionHistoryPanel
            projectPath={projectPath}
            refreshKey={historyRefresh}
            liveSessionId={liveSessionId}
            selectedSessionId={viewing?.sessionId ?? null}
            // 라이브 세션을 누르면 read-only 트랜스크립트가 아니라 라이브 채팅으로 복귀
            // (viewing=null → AgentPanel active 로 포커스/입력 복구). 그 외는 기록 보기 +
            // 연관 목업이 있으면(HTML 타겟) 우측 미리보기에 즉시 띄운다.
            onSelect={(s) => {
              const live = s.sessionId === liveSessionId;
              setViewing(live ? null : s);
              if (!live && s.mockupFile && s.intent !== "admin-cms") {
                setAutoFollow(false); // 과거 세션을 명시적으로 봄 → 라이브 자동추적 해제
                setActiveIntent("html");
                setPreviewRel(s.mockupFile);
                setTab("preview");
                setBust((b) => b + 1);
              }
            }}
            onDeleted={(sessionId) => {
              setViewing((v) => (v?.sessionId === sessionId ? null : v));
              refreshHistory();
            }}
          />
        </aside>

        {/* 채팅 (라이브 AgentPanel 은 상시 마운트, 기록 보기는 위에 오버레이) */}
        <main
          style={{
            width: paneW.chat,
            flexShrink: 0,
            borderRight: `1px solid ${c.border}`,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            position: "relative",
            background: c.bg,
          }}
        >
          <div style={{ height: "100%", display: viewing ? "none" : "block" }}>
            <AgentPanel
              projectPath={projectPath}
              mockupFile={selected}
              active={!viewing}
              attachSessionId={attachSessionId}
              onLiveChange={(id) => {
                setLiveSessionId(id);
                if (id === null) setAttachSessionId(null);
              }}
              onHistoryChange={refreshHistory}
            />
          </div>
          {viewing && projectPath && (
            <div style={{ position: "absolute", inset: 0 }}>
              <TranscriptView
                projectPath={projectPath}
                sessionId={viewing.sessionId}
                label={sessionTitle(viewing)}
                onClose={() => setViewing(null)}
              />
            </div>
          )}
        </main>

        {/* 미리보기 + 탭 — 나머지 폭을 채운다(1·2섹션과 높이 동일). */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: c.bg,
          }}
        >
          <div style={tabBar}>
            <div style={segGroup}>
              <button
                onClick={() => setTab("preview")}
                style={tab === "preview" ? segItemActive : segItem}
              >
                미리보기
              </button>
              <button
                onClick={() => setTab("validate")}
                style={tab === "validate" ? segItemActive : segItem}
              >
                검증
                {result && !result.ok && <span style={{ color: c.red }}>●</span>}
              </button>
              <button
                onClick={() => setTab("feedback")}
                style={tab === "feedback" ? segItemActive : segItem}
              >
                피드백
              </button>
              <button
                onClick={() => setTab("source")}
                style={tab === "source" ? segItemActive : segItem}
              >
                소스
              </button>
            </div>
            {tab === "preview" && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                <button
                  onClick={() => setViewport("web")}
                  style={viewport === "web" ? pillBtnActive : pillBtn}
                >
                  웹
                </button>
                <button
                  onClick={() => setViewport("app")}
                  style={viewport === "app" ? pillBtnActive : pillBtn}
                >
                  앱
                </button>
              </div>
            )}
          </div>

          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            {tab === "preview" &&
              (isAdminCms ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    textAlign: "center",
                    color: c.textMuted,
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  이 세션은 어드민(antd / .tsx) 경로입니다.
                  <br />
                  HTML 미리보기·내보내기는 적용되지 않습니다 — 채팅에서 생성을 진행하세요.
                </div>
              ) : (
                <PreviewPanel
                  relPath={previewRel}
                  bust={bust}
                  viewport={viewport}
                  live={previewLive}
                />
              ))}
            {tab === "validate" && (
              <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
                <ValidationPanel result={result} loading={validating} />
              </div>
            )}
            {tab === "feedback" && (
              <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
                <FeedbackPanel projectPath={projectPath} screen={selected} />
              </div>
            )}
            {tab === "source" && (
              <pre
                style={{
                  height: "100%",
                  margin: 0,
                  overflow: "auto",
                  padding: 16,
                  fontSize: 12,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: c.textMuted,
                  fontFamily: mono,
                }}
              >
                {source || "(선택된 파일 없음)"}
              </pre>
            )}
          </div>
        </section>

        {/* 드래그 핸들 — 경계에 겹쳐 깔린다(absolute). 1↔2, 2↔3 경계. */}
        <Resizer left={paneW.sidebar} onDrag={resizeSidebar} ariaLabel="채팅기록 폭 조절" />
        <Resizer left={paneW.sidebar + paneW.chat} onDrag={resizeChat} ariaLabel="채팅 폭 조절" />
      </div>

      {helpOpen && (
        <HelpModal
          projectPath={projectPath}
          selectedMockup={selected}
          appVersion={appVersion}
          platform={window.harness.platform}
          onClose={() => setHelpOpen(false)}
        />
      )}

      {intakeOpen && projectPath && (
        <IntakeModal
          projectPath={projectPath}
          onClose={() => setIntakeOpen(false)}
          onStarted={(sessionId, intent, slug) => {
            // 인테이크는 attach 경로라 이전 라이브 세션 PTY 를 자동 정리하지 않는다.
            // 새 세션으로 넘어가기 전에 직접 중지 — orphan PTY / 동시 claude 프로세스 방지.
            // (이전 목업 파일은 폴더에 이미 저장돼 있어 idle 세션 종료는 무손실.)
            if (liveSessionId && liveSessionId !== sessionId) {
              void window.harness.stopAgent(liveSessionId);
            }
            setActiveSlug(slug);
            setActiveIntent(intent);
            // 새 생성 시작 → 결과물을 실시간으로 따라가도록 자동추적 재개.
            setAutoFollow(true);
            setSelected(null);
            selectedRef.current = null;
            setPreviewRel(null);
            setTab("preview");
            setLiveSessionId(sessionId);
            setAttachSessionId(sessionId);
            setViewing(null);
            refreshHistory();
          }}
        />
      )}
    </div>
  );
}
