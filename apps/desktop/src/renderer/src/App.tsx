import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import type { ChatSession, UpdateCheckResult } from "../../preload/index.js";
import { ValidationPanel } from "./panels/ValidationPanel.js";
import { SessionDashboardPanel } from "./panels/SessionDashboardPanel.js";
import {
  PreviewPanel,
  type Viewport,
  APP_WIDTH,
  APP_HEIGHT,
  APP_PADDING,
  WEB_WIDTH,
  ZOOM_MIN,
  ZOOM_MAX,
} from "./panels/PreviewPanel.js";
import { ZoomControl } from "./ui/ZoomControl.js";
import { FeedbackPanel } from "./panels/FeedbackPanel.js";
import { AgentPanel, type NewChatRequest } from "./panels/AgentPanel.js";
import { SessionHistoryPanel, sessionTitle } from "./panels/SessionHistoryPanel.js";
import { TranscriptView } from "./panels/TranscriptView.js";
import { StructuredTranscriptView } from "./panels/StructuredChatView.js";
import { ExportButton } from "./panels/ExportButton.js";
import { FigmaExportButton } from "./panels/FigmaExportButton.js";
import { IntakeModal } from "./panels/IntakeModal.js";
import { HelpModal } from "./panels/HelpModal.js";
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
  primaryBtn,
  tabBar,
  segGroup,
  segItem,
  segItemActive,
} from "./ui/theme.js";

type PreviewTab = "dashboard" | "preview" | "validate" | "feedback" | "source";

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
  const [selected, setSelected] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");
  const [result, setResult] = useState<ValidateHtmlMockupResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [bust, setBust] = useState(0);
  const [previewRel, setPreviewRel] = useState<string | null>(null);
  // 결과 만족도(👍/👎) — 화면당 1회, 안 누르면 스킵. 화면 바뀌면 리셋.
  const [rated, setRated] = useState<"up" | "down" | null>(null);
  // 미리보기 칼럼
  const [tab, setTab] = useState<PreviewTab>("preview");
  const [viewport, setViewport] = useState<Viewport>("web");
  // 미리보기 확대/축소 — 0.25~3.0, 0.1 단위. 결과물 디테일 확인/전체 조망용.
  const [zoom, setZoom] = useState(1);
  // 미리보기 영역 DOM — 화면맞춤(가용 크기 기준 배율 계산)에 사용.
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const setZoomClamped = useCallback(
    (z: number) => setZoom(clampNum(Math.round(z * 100) / 100, ZOOM_MIN, ZOOM_MAX)),
    [],
  );
  const adjustZoom = useCallback(
    (delta: number) =>
      setZoom((z) => clampNum(Math.round((z + delta) * 100) / 100, ZOOM_MIN, ZOOM_MAX)),
    [],
  );
  // 화면맞춤: 미리보기 가용 영역에 목업이 꽉 차도록 배율 산출. 웹은 폭 기준, 앱은 폭·높이 중 작은 쪽.
  const fitToScreen = useCallback(() => {
    const box = previewBoxRef.current;
    if (!box) return;
    if (viewport === "web") {
      setZoomClamped(box.clientWidth / WEB_WIDTH);
    } else {
      const availW = box.clientWidth - APP_PADDING * 2;
      const availH = box.clientHeight - APP_PADDING * 2;
      setZoomClamped(Math.min(availW / APP_WIDTH, availH / APP_HEIGHT));
    }
  }, [viewport, setZoomClamped]);
  // 채팅기록
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [viewing, setViewing] = useState<ChatSession | null>(null);
  // "+ 새 채팅"(채팅기록 헤더) → AgentPanel 에 전달하는 시작 요청(seq + 고른 에이전트).
  const [newChatReq, setNewChatReq] = useState<NewChatRequest | null>(null);
  // 인테이크
  const [intakeOpen, setIntakeOpen] = useState(false);
  // 헬프 센터(상단 ? 버튼)
  const [helpOpen, setHelpOpen] = useState(false);
  const [attachSessionId, setAttachSessionId] = useState<string | null>(null);
  /** 현재 컨텍스트의 intent — admin-cms 면 HTML 미리보기/내보내기 비대상(채팅 전용). */
  const [activeIntent, setActiveIntent] = useState<"html" | "admin-cms">("html");
  /** 인테이크가 만든 목업 폴더 슬러그(빌드/내보내기 cwd 계산용). */
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const sessionFocusId = viewing?.sessionId ?? liveSessionId ?? null;

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

  // 업데이트 알림 — 부팅 시 1회 조회(실패는 조용히 무시). 새 버전이 있으면 헤더 배너 + 헬프센터에 노출.
  const [update, setUpdate] = useState<UpdateCheckResult | null>(null);
  useEffect(() => {
    void window.harness.checkForUpdate().then(setUpdate);
  }, []);
  const openRelease = useCallback(() => {
    if (update?.releaseUrl) void window.harness.openExternal(update.releaseUrl);
  }, [update]);

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

  // 프로젝트 폴더를 연다(미리보기 루트 + 파일 와처 전환). 성공 시 그 경로를, 취소면 null.
  // 상단 '프로젝트 열기' 버튼은 없앴고, '목업 제작' 이 프로젝트가 없을 때 이걸 먼저 호출한다.
  const openProject = useCallback(async (): Promise<string | null> => {
    const res = await window.harness.openProject();
    if ("canceled" in res) return null;
    setProjectPath(res.projectPath);
    projectRef.current = res.projectPath;
    setSelected(null);
    selectedRef.current = null;
    setSource("");
    setResult(null);
    setPreviewRel(null);
    setViewing(null);
    setLiveSessionId(null);
    setAttachSessionId(null);
    setActiveIntent("html");
    setActiveSlug(null);
    setHistoryRefresh((n) => n + 1);
    return res.projectPath;
  }, []);

  // '목업 제작' — 프로젝트가 없으면 폴더를 먼저 고른 뒤 인테이크 모달을 연다(항상 활성).
  const openMockupIntake = useCallback(async () => {
    if (!projectPath && !(await openProject())) return;
    setIntakeOpen(true);
  }, [projectPath, openProject]);

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
    });
  }, [loadFile]);

  // 와처가 오류로 죽으면(볼륨 unmount·폴더 삭제·FSEvents 무효화 등) 자동추적을 꺼서 "생성 중"
  // 배지가 영구로 남지 않게 한다. 라이브 출력은 디스크에 계속 쌓이므로(유실 아님) 미리보기는
  // 수동 새로고침이나 프로젝트 다시 열기로 복구된다.
  useEffect(() => {
    return window.harness.onWatchStopped((e) => {
      console.warn("[nudge-studio] 파일 감시 중단 — 자동추적 비활성화:", e.reason);
      setAutoFollow(false);
    });
  }, []);

  // 마운트 시 마지막 프로젝트 복원 — 앱을 재시작해도 main 이 previewRoot/와처를 다시 잡아
  // "no preview root" 없이 곧바로 목업 목록·미리보기가 살아난다(사용자가 다시 폴더를 열 필요 X).
  useEffect(() => {
    let cancelled = false;
    void window.harness.currentProject().then((res) => {
      if (cancelled || res.projectPath === null) return;
      setProjectPath(res.projectPath);
      projectRef.current = res.projectPath;
      setHistoryRefresh((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshHistory = useCallback(() => setHistoryRefresh((n) => n + 1), []);

  // "+ 새 채팅" → 빠른 채팅 — 먼저 작업 폴더를 고르고(취소 시 중단), 과거 세션 보기 중이면
  // 라이브 패널로 복귀시킨 뒤 AgentPanel 이 그 폴더에서 새 세션을 시작하도록 요청 seq 를 올린다.
  // 프로젝트를 미리 열지 않아도 폴더만 고르면 채팅이 시작된다(채팅기록은 전역 저장).
  const startNewChat = useCallback(async (req: Omit<NewChatRequest, "seq" | "cwd">) => {
    const picked = await window.harness.pickFolder();
    if ("canceled" in picked) return;
    // pickFolder 가 main 에서 이 폴더를 미리보기 루트로 잡아준다 → 생성된 목업이 곧바로
    // 미리보기됨("no preview root" 방지). 렌더러 상태도 이 폴더로 맞춘다.
    setProjectPath(picked.folder);
    projectRef.current = picked.folder;
    setSelected(null);
    selectedRef.current = null;
    setPreviewRel(null);
    setViewing(null);
    setNewChatReq((prev) => ({ seq: (prev?.seq ?? 0) + 1, cwd: picked.folder, ...req }));
  }, []);

  // 과거/복귀 세션의 목업을 우측 미리보기에 띄운다. 채팅 세션은 앱 전역(userData)에 모이고 각
  // 세션의 mockupFile 은 그 세션이 작업한 폴더(cwd) 기준 상대경로다. previewRoot 는 단일이라,
  // 띄우기 직전 그 세션의 cwd 로 루트를 맞추지 않으면(특히 재시작 후 lastProjectPath 로만 복원될
  // 때) 다른 폴더 기준으로 풀려 미리보기가 "not found" 로 깨진다. cwd 가 없는 옛 세션은 현재
  // 루트 그대로(종전 동작). setPreviewRoot 를 먼저 await 해 iframe fetch 전에 루트가 잡히게 한다.
  const showSessionPreview = useCallback(async (s: ChatSession) => {
    setActiveIntent("html");
    setTab("preview");
    if (s.cwd) await window.harness.setPreviewRoot(s.cwd);
    setPreviewRel(s.mockupFile ?? null);
    setBust((b) => b + 1);
  }, []);

  // 지금 미리보기에 띄운 목업이 실제로 사는 루트. 보통은 활성 프로젝트(projectPath)지만, 다른
  // 폴더에서 만든 과거 세션을 보는 중이면 그 세션의 작업 폴더(viewing.cwd)다 — main 의 previewRoot
  // 도 그쪽으로 전환돼 있다(showSessionPreview). export/figma·활성목업 base 가 이걸 따라야 미리보기와
  // 같은 폴더를 빌드한다(안 그러면 projectPath 루트를 빌드해 "index.html 없음"으로 실패). cwd 없는
  // 옛 세션은 previewRoot 도 안 바뀌므로 projectPath 그대로(종전 동작).
  const previewBase = viewing?.cwd ?? projectPath;

  // 빌드/내보내기 cwd = 지금 미리보기에 띄운 목업의 폴더. 우선순위:
  //   selected(파일트리 선택) → previewRel(채팅 세션 클릭으로 띄운 목업) → activeSlug(인테이크).
  // ⚠️ previewRel 폴백이 핵심: 채팅 세션을 클릭하면 previewRel 만 갱신되고 selected 는 그대로라,
  //    이게 없으면 export 가 루트를 빌드해 "index.html 없음"으로 실패한다
  //    (미리보기는 하위 목업을 보는데 내보내기는 루트를 빌드 = 어긋남).
  const activeMockupDir = useMemo(() => {
    if (!previewBase) return undefined;
    // 과거 세션을 보는 중(viewing)이면 selected 를 무시한다 — selected 는 라이브 autoFollow 가
    // 남긴 다른 폴더의 값일 수 있어, previewBase(=viewing.cwd)와 섞이면 존재하지 않는 폴더를
    // 빌드해 export/Figma 가 어긋난다. 라이브 보기에선 기존 우선순위(selected→previewRel) 유지.
    const rel = viewing
      ? (previewRel ?? (activeSlug ? `${activeSlug}/index.html` : null))
      : (selected ?? previewRel ?? (activeSlug ? `${activeSlug}/index.html` : null));
    if (!rel) return undefined;
    const slash = rel.lastIndexOf("/");
    const dir = slash > 0 ? rel.slice(0, slash) : "";
    return dir ? `${previewBase}/${dir}` : previewBase;
  }, [previewBase, viewing, selected, previewRel, activeSlug]);

  /** 상단바에 보일 현재 작업 문맥(세션/목업 경로). 없으면 프로젝트 폴더명. */
  const currentContext = useMemo(() => {
    const rel = viewing?.mockupFile ?? viewing?.cwd ?? selected ?? activeSlug;
    if (rel) return rel;
    if (!projectPath) return "";
    const parts = projectPath.split(/[/\\]/).filter(Boolean);
    return parts[parts.length - 1] ?? projectPath;
  }, [projectPath, selected, activeSlug, viewing]);

  const isAdminCms = activeIntent === "admin-cms";
  const feedbackTarget = viewing ? previewRel : (selected ?? previewRel);

  // 결과가 바뀌면(다른 화면/재빌드) 만족도 상태를 리셋해 새로 평가받을 수 있게.
  useEffect(() => {
    setRated(null);
  }, [feedbackTarget, bust]);

  // 👍/👎 — 안 누르면 그냥 스킵. 누르면 객관 점수(validate overall)와 함께 기록.
  const rateSatisfaction = useCallback(
    (sentiment: "up" | "down") => {
      if (!previewBase || !feedbackTarget) return;
      setRated(sentiment);
      void window.harness
        .submitFeedback({
          projectPath: previewBase,
          kind: "satisfaction",
          screen: feedbackTarget,
          mockupFile: feedbackTarget,
          comment: "",
          sentiment,
          scoreOverall: result?.scores?.overall ?? null,
        })
        .catch(() => setRated(null));
    },
    [previewBase, feedbackTarget, result],
  );
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
        <button
          onClick={() => void openMockupIntake()}
          title="기획서·레퍼런스로 목업 만들기"
          className="nds-cta-primary"
          // 메인 액션 — 주변이 전부 ghost 라 이 단색 옐로 하나만으로 강조된다(미니멀).
          // 평소 장식 0, hover 때만 살짝 떠오름 + 부드러운 글로우(.nds-cta-primary, global.css).
          style={{
            ...primaryBtn,
            ...noDrag,
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 8,
          }}
        >
          목업 만들기
        </button>
        <div
          style={{ ...noDrag, marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}
        >
          {/* 새 버전 알림(드물게 노출)은 맨 앞에 두어, 나머지가 파일경로 → 내보내기 → 도움말 순서를 유지. */}
          {update?.hasUpdate && update.latestVersion && (
            <button
              onClick={openRelease}
              title={`새 버전 v${update.latestVersion} 다운로드 (브라우저로 Release 페이지 열기)`}
              style={{
                ...primaryBtn,
                ...noDrag,
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11.5,
              }}
            >
              <span style={{ fontSize: 12 }}>⬆</span>새 버전 v{update.latestVersion}
            </button>
          )}
          {currentContext && (
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
              title={projectPath || ""}
            >
              {currentContext}
            </span>
          )}
          <FigmaExportButton
            projectPath={previewBase}
            mockupDir={activeMockupDir}
            disabled={isAdminCms}
          />
          <ExportButton
            projectPath={previewBase}
            mockupDir={activeMockupDir}
            disabled={isAdminCms}
            onExported={(rel) => {
              setPreviewRel(rel);
              setTab("preview");
              setBust((b) => b + 1);
            }}
          />
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
              if (live) {
                // 라이브 세션으로 복귀 — 과거 세션을 보느라 꺼둔 자동추적을 다시 켜고,
                // 이미 만들어진 라이브 목업이 있으면 즉시 미리보기에 복원한다(미리보기 있는
                // 채팅 → 미리보기 있는 채팅 이동 시 미리보기가 안 바뀌던 이슈).
                setAutoFollow(true);
                // previewRoot 를 라이브 세션의 작업 폴더로 되돌린다 — 결과물(mockupFile) 유무와
                // 무관하게. 과거 세션을 보다 라이브로 돌아오면 previewRoot 가 과거 cwd 에 고정돼
                // 라이브 첫 HTML 이 엉뚱한 루트로 풀려 깨지던 문제(와처 emit 전에 미리 복원).
                if (s.cwd) void window.harness.setPreviewRoot(s.cwd);
                if (s.mockupFile && s.intent !== "admin-cms") {
                  void showSessionPreview(s);
                }
                return;
              }
              setAutoFollow(false); // 과거 세션을 명시적으로 봄 → 라이브 자동추적 해제
              if (s.mockupFile && s.intent !== "admin-cms") {
                void showSessionPreview(s);
              } else {
                // 연관 목업이 없는(작업 안 된) 세션 → 이전 목업 미리보기 잔상 제거.
                setActiveIntent(s.intent === "admin-cms" ? "admin-cms" : "html");
                setPreviewRel(null);
                setSelected(null);
                selectedRef.current = null;
                setSource("");
                setResult(null);
              }
            }}
            onDeleted={(sessionId) => {
              setViewing((v) => (v?.sessionId === sessionId ? null : v));
              refreshHistory();
            }}
            onResume={(s) => {
              // CLI 네이티브 resume 으로 끝난 세션을 다시 라이브로. main 이 PTY 를 재spawn 하면
              // intake 와 동일하게 attach 로 라이브 패널을 붙인다(컨텍스트는 claude/codex 가 복원).
              void (async () => {
                const res = await window.harness.resumeSession(projectPath ?? "", s.sessionId);
                if (!res.ok) {
                  window.alert(res.error ?? "이어가기에 실패했습니다.");
                  return;
                }
                // 다른 라이브 세션이 떠 있으면 먼저 정리(orphan PTY / 동시 프로세스 방지).
                if (liveSessionId && liveSessionId !== s.sessionId) {
                  void window.harness.stopAgent(liveSessionId);
                }
                // 재개한 세션의 폴더가 곧 활성 프로젝트가 된다(main 이 같은 폴더로 와처/루트를
                // 전환). projectPath 를 맞춰 export/와처/활성목업 base 가 그 폴더를 따르게 한다.
                if (s.cwd) {
                  setProjectPath(s.cwd);
                  projectRef.current = s.cwd;
                }
                setAutoFollow(true);
                if (s.mockupFile && s.intent !== "admin-cms") {
                  void showSessionPreview(s);
                }
                setLiveSessionId(s.sessionId);
                setAttachSessionId(s.sessionId);
                setViewing(null);
                refreshHistory();
              })();
            }}
            onNewChat={startNewChat}
            onNewMockup={() => void openMockupIntake()}
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
              newChatReq={newChatReq}
              onLiveChange={(id) => {
                setLiveSessionId(id);
                if (id === null) setAttachSessionId(null);
              }}
              onHistoryChange={refreshHistory}
            />
          </div>
          {viewing && (
            <div style={{ position: "absolute", inset: 0 }}>
              {viewing.transport === "stream-json" ? (
                <StructuredTranscriptView
                  projectPath={projectPath ?? ""}
                  sessionId={viewing.sessionId}
                  label={sessionTitle(viewing)}
                  onClose={() => setViewing(null)}
                />
              ) : (
                <TranscriptView
                  projectPath={projectPath ?? ""}
                  sessionId={viewing.sessionId}
                  label={sessionTitle(viewing)}
                  cols={viewing.cols}
                  rows={viewing.rows}
                  onClose={() => setViewing(null)}
                />
              )}
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
                onClick={() => setTab("dashboard")}
                style={tab === "dashboard" ? segItemActive : segItem}
              >
                대시보드
              </button>
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
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={segGroup}>
                  <button
                    onClick={() => setViewport("web")}
                    style={viewport === "web" ? segItemActive : segItem}
                  >
                    Web
                  </button>
                  <button
                    onClick={() => setViewport("app")}
                    style={viewport === "app" ? segItemActive : segItem}
                  >
                    Mobile
                  </button>
                </div>
                <span style={{ width: 1, height: 16, background: c.border, margin: "0 4px" }} />
                {/* 확대/축소 — −/퍼센트(클릭=메뉴: 화면맞춤·실제 크기·프리셋)/+. */}
                <ZoomControl
                  zoom={zoom}
                  onAdjust={adjustZoom}
                  onSet={setZoomClamped}
                  onFit={fitToScreen}
                />
                <span style={{ width: 1, height: 16, background: c.border, margin: "0 4px" }} />
                <button
                  onClick={() => previewRel && window.harness.openMockupWindow(previewRel)}
                  disabled={!previewRel}
                  title="새 창으로 열기"
                  aria-label="새 창으로 열기"
                  style={{
                    ...pillBtn,
                    padding: "4px 8px",
                    display: "inline-flex",
                    alignItems: "center",
                    opacity: previewRel ? 1 : 0.4,
                    cursor: previewRel ? "pointer" : "default",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div ref={previewBoxRef} style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            {tab === "dashboard" && (
              <SessionDashboardPanel
                projectPath={projectPath}
                refreshKey={historyRefresh}
                focusSessionId={sessionFocusId}
              />
            )}
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
                  zoom={zoom}
                />
              ))}
            {tab === "validate" && (
              <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
                <ValidationPanel result={result} loading={validating} />
              </div>
            )}
            {tab === "feedback" && (
              <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
                <FeedbackPanel projectPath={previewBase} screen={feedbackTarget} />
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

          {/* 만족도 바 — 결과 뷰 하단에 항상. 안 누르면 스킵. 누르면 객관 점수와 함께 기록. */}
          {feedbackTarget && !isAdminCms && (
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "8px 14px",
                borderTop: `1px solid ${c.border}`,
                background: c.bg,
                fontSize: 12,
                color: c.textMuted,
              }}
            >
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {rated
                  ? `만족도 기록됨 ${rated === "up" ? "👍" : "👎"} — 객관 점수와 함께 쌓입니다.`
                  : "이 결과 어떠세요? 평가를 남기면 객관 점수와 함께 쌓여 다음 목업이 더 정확해져요. (안 누르면 스킵)"}
              </span>
              <span style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => rateSatisfaction("up")}
                  title="만족"
                  aria-label="만족 (좋아요)"
                  style={{
                    ...pillBtn,
                    padding: "4px 10px",
                    opacity: rated === "down" ? 0.4 : 1,
                    borderColor: rated === "up" ? c.green : c.border,
                  }}
                >
                  👍
                </button>
                <button
                  onClick={() => rateSatisfaction("down")}
                  title="아쉬움"
                  aria-label="아쉬움 (별로예요)"
                  style={{
                    ...pillBtn,
                    padding: "4px 10px",
                    opacity: rated === "up" ? 0.4 : 1,
                    borderColor: rated === "down" ? c.red : c.border,
                  }}
                >
                  👎
                </button>
              </span>
            </div>
          )}
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
          update={update}
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
