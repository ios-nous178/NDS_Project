import { useCallback, useEffect, useRef, useState } from "react";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import type { ChatSession } from "../../preload/index.js";
import { ValidationPanel } from "./panels/ValidationPanel.js";
import { PreviewPanel, type Viewport } from "./panels/PreviewPanel.js";
import { FeedbackPanel } from "./panels/FeedbackPanel.js";
import { AgentPanel } from "./panels/AgentPanel.js";
import { SessionHistoryPanel } from "./panels/SessionHistoryPanel.js";
import { TranscriptView } from "./panels/TranscriptView.js";
import { ExportButton } from "./panels/ExportButton.js";
import {
  c,
  dragRegion,
  font,
  ghostBtn,
  mono,
  noDrag,
  pillBtn,
  pillBtnActive,
  tabBar,
  segGroup,
  segItem,
  segItemActive,
} from "./ui/theme.js";

type PreviewTab = "preview" | "validate" | "feedback" | "source";

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

  const selectedRef = useRef<string | null>(null);
  const projectRef = useRef<string | null>(null);
  // 타이틀바 패딩 분기용(신호등 vs Windows 오버레이).
  const isMac = window.harness.platform === "darwin";
  const [appVersion, setAppVersion] = useState<string>("");
  useEffect(() => {
    void window.harness.getVersion().then(setAppVersion);
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
    setHistoryRefresh((n) => n + 1);
  }, []);

  const selectEntry = useCallback(
    (rel: string) => {
      if (!projectPath || !rel) return;
      setSelected(rel);
      selectedRef.current = rel;
      setPreviewRel(rel);
      setTab("preview");
      void loadFile(projectPath, rel);
      void window.harness.appendEvent({ projectPath, type: "mockup_selected", mockupFile: rel });
    },
    [projectPath, loadFile],
  );

  useEffect(() => {
    return window.harness.onFileChanged((e) => {
      if (e.relPath === selectedRef.current && projectRef.current) {
        void loadFile(projectRef.current, e.relPath);
      }
    });
  }, [loadFile]);

  const refreshHistory = useCallback(() => setHistoryRefresh((n) => n + 1), []);

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
          padding: isMac ? "8px 14px 8px 84px" : "8px 146px 8px 14px",
          borderBottom: `1px solid ${c.border}`,
          background: c.bgPanel,
        }}
      >
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
        <select
          value={selected ?? ""}
          onChange={(e) => selectEntry(e.target.value)}
          disabled={entries.length === 0}
          style={{
            ...noDrag,
            maxWidth: 320,
            padding: "5px 8px",
            borderRadius: 6,
            border: `1px solid ${c.border}`,
            background: c.bg,
            color: c.text,
            fontSize: 12,
            fontFamily: mono,
          }}
        >
          <option value="" disabled>
            {entries.length ? `목업 선택 (${entries.length})` : "목업 없음"}
          </option>
          {entries.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
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
        </div>
      </header>

      {/* 3분할 */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr) minmax(0, 1.15fr)",
        }}
      >
        {/* 채팅기록 */}
        <aside
          style={{
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
            onSelect={(s) => setViewing(s)}
            onDeleted={(sessionId) => {
              setViewing((v) => (v?.sessionId === sessionId ? null : v));
              refreshHistory();
            }}
          />
        </aside>

        {/* 채팅 (라이브 AgentPanel 은 상시 마운트, 기록 보기는 위에 오버레이) */}
        <main
          style={{
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
              onLiveChange={setLiveSessionId}
              onHistoryChange={refreshHistory}
            />
          </div>
          {viewing && projectPath && (
            <div style={{ position: "absolute", inset: 0 }}>
              <TranscriptView
                projectPath={projectPath}
                sessionId={viewing.sessionId}
                label={viewing.title}
                onClose={() => setViewing(null)}
              />
            </div>
          )}
        </main>

        {/* 미리보기 + 탭 (높이는 grid 행에 잠겨 1·2섹션과 항상 동일) */}
        <section
          style={{
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
            {tab === "preview" && (
              <PreviewPanel relPath={previewRel} bust={bust} viewport={viewport} />
            )}
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
      </div>
    </div>
  );
}
