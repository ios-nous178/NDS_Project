import { useCallback, useMemo, useState } from "react";
import type { AgentType, Platform, ScreenshotInput, Transport } from "../../../preload/index.js";
import { Dropdown } from "../ui/Dropdown.js";
import {
  c,
  font,
  ghostBtn,
  input,
  mono,
  primaryBtn,
  primaryBtnDisabled,
  segGroup,
  segItem,
  segItemActive,
} from "../ui/theme.js";

const BRANDS: { slug: string; label: string }[] = [
  { slug: "trost", label: "Trost" },
  { slug: "geniet", label: "Geniet" },
  { slug: "nudge-eap", label: "NudgeEAP" },
  { slug: "runmile", label: "Runmile" },
  { slug: "cashwalk-biz", label: "Cashpobi (cashwalk-biz)" },
];

const SIMPLE_TEMPLATE = `# 간단 화면 기획서

## 화면 목적
-

## 주요 사용자
-

## 핵심 행동
-

## 꼭 보여야 하는 정보
-

## 버튼/CTA
-

## 상태/케이스
-

## 톤과 분위기
-
`;

const DETAIL_TEMPLATE = `# 화면 기획서

## 1. 화면 목적
-

## 2. 주요 사용자
-

## 3. 사용자가 해야 하는 핵심 행동
-

## 4. 화면에 꼭 보여야 하는 정보
-

## 5. 강조 우선순위
1.
2.
3.

## 6. 상태/케이스
-

## 7. 버튼/CTA
-

## 8. 톤과 분위기
-

## 9. 참고하면 좋은 화면
좋은 참고:
-

피해야 할 참고:
-

## 10. 추가 요청
-
`;

const ADMIN_TEMPLATE = `# 어드민 화면 기획서

## 화면 목적
관리자가 이 화면에서 판단하거나 처리해야 하는 일은 무엇인가요?

## 주요 사용자/권한
-

## 핵심 지표/데이터
-

## 테이블 컬럼
-

## 필터/검색
-

## 주요 액션
-

## 빈 상태/오류 상태
-

## 정보 밀도
높게 / 보통 / 낮게

## 추가 요청
-
`;

type Surface = "service" | "admin";
type DirectionMode = "auto" | "propose" | "skip";

interface ShotItem extends ScreenshotInput {
  thumbUrl: string;
}

interface DocItem {
  fileName: string;
  base64?: string;
  sourcePath?: string;
}

function previewIntent(surface: Surface, brand: string): "html" | "admin-cms" {
  return surface === "admin" && brand !== "cashwalk-biz" ? "admin-cms" : "html";
}

function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALLOWED_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;
const DOC_EXT = /\.(pdf|md|markdown|txt|html?)$/i;

export function IntakeModal({
  projectPath,
  onClose,
  onStarted,
}: {
  projectPath: string;
  onClose: () => void;
  onStarted: (sessionId: string, intent: "html" | "admin-cms", slug: string) => void;
}): React.JSX.Element {
  const [agentType, setAgentType] = useState<AgentType>("claude");
  // 전송 방식 — pty(기본 raw TUI) / stream-json(구조화 canary, claude 전용).
  const [transport, setTransport] = useState<Transport>("pty");
  const [brand, setBrand] = useState("");
  const [surface, setSurface] = useState<Surface>("service");
  // 고객용 화면의 제작 대상 플랫폼(웹 데스크탑/모바일/반응형 · 앱).
  const [platform, setPlatform] = useState<Platform>("web-responsive");
  const [screenName, setScreenName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [prd, setPrd] = useState("");
  const [directionMode, setDirectionMode] = useState<DirectionMode>("auto");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [figma, setFigma] = useState("");
  const [extra, setExtra] = useState("");
  const [shots, setShots] = useState<ShotItem[]>([]);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = useMemo(() => {
    if (!brand || !screenName.trim()) return "";
    return `${brand}-${kebab(screenName) || "screen"}`;
  }, [brand, screenName]);
  const effectiveSlug = slugDirty ? slug : autoSlug;
  const intent = previewIntent(surface, brand);
  const isAdminCms = intent === "admin-cms";

  const addFiles = useCallback((files: FileList | File[]) => {
    const next: ShotItem[] = [];
    for (const f of Array.from(files)) {
      if (!ALLOWED_EXT.test(f.name)) continue;
      const sourcePath = window.harness.pathForFile(f);
      if (sourcePath) {
        next.push({ fileName: f.name, sourcePath, thumbUrl: URL.createObjectURL(f) });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = String(reader.result);
          const base64 = dataUrl.split(",")[1] ?? "";
          setShots((prev) => [...prev, { fileName: f.name, base64, thumbUrl: dataUrl }]);
        };
        reader.readAsDataURL(f);
      }
    }
    if (next.length) setShots((prev) => [...prev, ...next]);
  }, []);

  const addDocs = useCallback((files: FileList | File[]) => {
    const next: DocItem[] = [];
    for (const f of Array.from(files)) {
      if (!DOC_EXT.test(f.name)) continue;
      const sourcePath = window.harness.pathForFile(f);
      if (sourcePath) {
        next.push({ fileName: f.name, sourcePath });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = String(reader.result).split(",")[1] ?? "";
          setDocs((prev) => [...prev, { fileName: f.name, base64 }]);
        };
        reader.readAsDataURL(f);
      }
    }
    if (next.length) setDocs((prev) => [...prev, ...next]);
  }, []);

  const insertTemplate = useCallback((template: string) => {
    setPrd((prev) => (prev.trim() ? `${prev.trim()}\n\n${template}` : template));
  }, []);

  const canSubmit = !!brand && !!screenName.trim() && !busy;

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError("");
    try {
      const res = await window.harness.startIntake({
        projectPath,
        brand,
        surface,
        screenName: screenName.trim(),
        slug: slugDirty ? slug.trim() : undefined,
        prd,
        platform: surface === "service" ? platform : undefined,
        extraRequirements: extra,
        // 구조화(canary)는 claude 전용 — codex 면 startIntake/agent-runner 가 pty 로 강제하지만
        // 여기서도 보내는 값을 일치시킨다.
        transport: agentType === "claude" ? transport : "pty",
        screenshots: shots.map((s) => ({
          fileName: s.fileName,
          sourcePath: s.sourcePath,
          base64: s.base64,
        })),
        attachments: docs.map((d) => ({
          fileName: d.fileName,
          sourcePath: d.sourcePath,
          base64: d.base64,
        })),
        figmaUrls: figma
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean),
        agentType,
        directionMode,
        selectedDirection,
      });
      if (!res.ok || !res.sessionId) {
        setError(res.error ?? "시작 실패");
        return;
      }
      onStarted(res.sessionId, res.intent ?? intent, res.slug ?? effectiveSlug);
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [
    canSubmit,
    projectPath,
    brand,
    surface,
    platform,
    screenName,
    slug,
    slugDirty,
    prd,
    extra,
    shots,
    docs,
    figma,
    agentType,
    transport,
    directionMode,
    selectedDirection,
    onStarted,
    intent,
    effectiveSlug,
    onClose,
  ]);

  const label = (t: string): React.JSX.Element => (
    <div style={{ fontSize: 11, color: c.textMuted, marginBottom: 5, fontWeight: 600 }}>{t}</div>
  );
  const field: React.CSSProperties = { marginBottom: 14 };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 620,
          maxWidth: "92vw",
          maxHeight: "86vh",
          overflow: "auto",
          background: c.bgPanel,
          border: `1px solid ${c.border}`,
          borderRadius: 8,
          padding: 20,
          fontFamily: font,
          color: c.text,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div>
            <strong style={{ fontSize: 15 }}>새 목업</strong>
            <div style={{ color: c.textMuted, fontSize: 11, marginTop: 3 }}>
              기획서와 레퍼런스를 먼저 고정한 뒤 에이전트를 시작합니다.
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", gap: 2, ...segGroup }}>
              {(["claude", "codex"] as AgentType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setAgentType(t);
                    // 구조화(canary)는 claude 전용 — codex 로 바꾸면 pty 로 되돌린다.
                    if (t !== "claude") setTransport("pty");
                  }}
                  style={agentType === t ? segItemActive : segItem}
                >
                  {t === "claude" ? "Claude" : "Codex"}
                </button>
              ))}
            </div>
            {/* 구조화(canary) — Claude stream-json. codex 면 비활성. */}
            <button
              onClick={() =>
                agentType === "claude" &&
                setTransport((tp) => (tp === "stream-json" ? "pty" : "stream-json"))
              }
              disabled={agentType !== "claude"}
              title={
                agentType === "claude"
                  ? "Claude 의 stream-json 출력을 카드형 채팅으로 보여주는 실험 모드"
                  : "구조화(canary)는 Claude 전용입니다"
              }
              style={{
                ...segItem,
                gap: 6,
                padding: "3px 10px",
                borderRadius: 999,
                border: `1px solid ${transport === "stream-json" ? c.accent : c.border}`,
                background: transport === "stream-json" ? c.accentBg : "transparent",
                color:
                  agentType !== "claude"
                    ? c.textFaint
                    : transport === "stream-json"
                      ? c.accent
                      : c.textMuted,
                cursor: agentType === "claude" ? "pointer" : "not-allowed",
                fontSize: 11,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: transport === "stream-json" ? c.accent : "transparent",
                  border: `1px solid ${transport === "stream-json" ? c.accent : c.textFaint}`,
                }}
              />
              구조화 (canary)
            </button>
          </div>
        </div>

        <div style={field}>
          {label("브랜드 *")}
          <Dropdown
            value={brand}
            options={BRANDS.map((b) => ({ value: b.slug, label: b.label }))}
            onChange={setBrand}
            placeholder="브랜드 선택"
            mono
          />
        </div>

        <div style={field}>
          {label("어떤 화면인가요? *")}
          <div style={{ ...segGroup, display: "flex", width: "100%", boxSizing: "border-box" }}>
            {(["service", "admin"] as Surface[]).map((s) => {
              const segStyle = surface === s ? segItemActive : segItem;
              return (
                <button
                  key={s}
                  onClick={() => setSurface(s)}
                  style={{ ...segStyle, flex: 1, justifyContent: "center", padding: "7px 0" }}
                >
                  {s === "service" ? "고객용 화면" : "관리자 화면"}
                </button>
              );
            })}
          </div>
          {isAdminCms && (
            <div style={noticeStyle}>
              관리자 화면은 앱 안에서 바로 미리보기·내보내기가 아직 안 됩니다. 생성은 채팅으로
              진행됩니다.
            </div>
          )}
        </div>

        {surface === "service" && (
          <div style={field}>
            {label("어디에 쓰는 화면인가요? *")}
            <Dropdown
              value={platform}
              options={[
                { value: "web-responsive", label: "웹 · 데스크탑+모바일(반응형)" },
                { value: "web-desktop", label: "웹 · 데스크탑" },
                { value: "web-mobile", label: "웹 · 모바일" },
                { value: "app", label: "앱 (모바일 네이티브 느낌)" },
              ]}
              onChange={(v) => setPlatform(v as Platform)}
              placeholder="플랫폼 선택"
            />
            <div style={{ color: c.textMuted, fontSize: 11, lineHeight: 1.5, marginTop: 6 }}>
              에이전트가 반응형 폭·레이아웃·인터랙션을 이 폼팩터에 맞춰 제작합니다.
            </div>
          </div>
        )}

        <div style={field}>
          {label("화면 이름 *")}
          <input
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            placeholder="예: 다이어리 허브"
            style={input}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: c.textFaint, whiteSpace: "nowrap" }}>
              저장 폴더:
            </span>
            <input
              value={effectiveSlug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugDirty(true);
              }}
              placeholder="brand-screen"
              style={{ ...input, fontFamily: mono, fontSize: 12, padding: "4px 8px" }}
            />
          </div>
        </div>

        <div style={field}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
            {label("기획 내용")}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <button onClick={() => insertTemplate(SIMPLE_TEMPLATE)} style={smallBtn}>
                간단
              </button>
              <button onClick={() => insertTemplate(DETAIL_TEMPLATE)} style={smallBtn}>
                상세
              </button>
              <button onClick={() => insertTemplate(ADMIN_TEMPLATE)} style={smallBtn}>
                어드민
              </button>
            </div>
          </div>
          <textarea
            value={prd}
            onChange={(e) => setPrd(e.target.value)}
            rows={7}
            placeholder="화면 목적, 핵심 행동, 정보 우선순위, CTA, 상태/케이스를 적어주세요."
            style={{ ...input, resize: "vertical", fontFamily: font }}
          />
        </div>

        <div style={field}>
          {label("UI 방향")}
          <div style={{ ...segGroup, display: "flex", width: "100%", boxSizing: "border-box" }}>
            {[
              { value: "auto", label: "자동 판단" },
              { value: "propose", label: "방향 먼저 제안" },
              { value: "skip", label: "바로 생성" },
            ].map((m) => {
              const active = directionMode === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => setDirectionMode(m.value as DirectionMode)}
                  style={{
                    ...(active ? segItemActive : segItem),
                    flex: 1,
                    justifyContent: "center",
                    padding: "7px 0",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          <div style={{ color: c.textMuted, fontSize: 11, lineHeight: 1.5, marginTop: 6 }}>
            자동 판단은 기획서가 명확하면 바로 만들고, 정보 위계·흐름·CTA 전략이 애매하면 먼저 2-3개
            UI/UX 방향을 제안하게 합니다.
          </div>
          <textarea
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
            rows={3}
            placeholder="이미 원하는 방향이 있다면 적어주세요. 예: 첫 화면은 가능 시간을 먼저, 상세 신뢰 정보는 선택 후 노출."
            style={{ ...input, resize: "vertical", fontFamily: font, marginTop: 8 }}
          />
        </div>

        <div style={field}>
          {label("기획 문서 첨부 (PDF·MD·TXT·HTML)")}
          <DropZone
            text="기획서 파일을 끌어다 놓거나 클릭해 선택"
            onFiles={addDocs}
            inputId="intake-doc"
            accept=".pdf,.md,.markdown,.txt,.html,.htm"
          />
          {docs.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
              {docs.map((d, i) => (
                <FileRow
                  key={`${d.fileName}-${i}`}
                  fileName={d.fileName}
                  onRemove={() => setDocs((prev) => prev.filter((_, j) => j !== i))}
                />
              ))}
            </div>
          )}
        </div>

        <div style={field}>
          {label("예시 스크린샷 (드래그 또는 클릭)")}
          <DropZone
            text="이미지를 끌어다 놓거나 클릭해 선택"
            onFiles={addFiles}
            inputId="intake-file"
            accept="image/*"
          />
          {shots.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {shots.map((s, i) => (
                <div key={`${s.fileName}-${i}`} style={{ position: "relative" }}>
                  <img
                    src={s.thumbUrl}
                    alt={s.fileName}
                    title={s.fileName}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: `1px solid ${c.border}`,
                    }}
                  />
                  <button
                    onClick={() => setShots((prev) => prev.filter((_, j) => j !== i))}
                    style={removeBubble}
                    title="제거"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={field}>
          {label("Figma 링크 (한 줄에 하나)")}
          <textarea
            value={figma}
            onChange={(e) => setFigma(e.target.value)}
            rows={2}
            placeholder="https://figma.com/design/...?node-id=1:2"
            style={{ ...input, resize: "vertical", fontFamily: mono, fontSize: 12 }}
          />
        </div>

        <div style={field}>
          {label("추가 요구사항 (제작 방식·규칙)")}
          <textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            rows={3}
            placeholder="예: 여러 화면으로 나눠 제작 · CTA 버튼은 플로팅 고정 · 빈/에러 상태 포함"
            style={{ ...input, resize: "vertical", fontFamily: font }}
          />
        </div>

        {error && <div style={{ color: c.red, fontSize: 12, marginBottom: 10 }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={ghostBtn}>
            취소
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            style={canSubmit ? primaryBtn : primaryBtnDisabled}
          >
            {busy ? "시작 중..." : "생성 시작"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DropZone({
  text,
  inputId,
  accept,
  onFiles,
}: {
  text: string;
  inputId: string;
  accept: string;
  onFiles: (files: FileList | File[]) => void;
}): React.JSX.Element {
  return (
    <>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById(inputId)?.click()}
        style={{
          border: `1px dashed ${c.border}`,
          borderRadius: 8,
          padding: 14,
          textAlign: "center",
          fontSize: 12,
          color: c.textMuted,
          cursor: "pointer",
          background: c.bg,
        }}
      >
        {text}
      </div>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

function FileRow({
  fileName,
  onRemove,
}: {
  fileName: string;
  onRemove: () => void;
}): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 9px",
        borderRadius: 6,
        background: c.bgElevated,
        border: `1px solid ${c.border}`,
        fontSize: 12,
      }}
    >
      <span
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {fileName}
      </span>
      <button
        onClick={onRemove}
        title="제거"
        style={{ border: "none", background: "transparent", color: c.textMuted, cursor: "pointer" }}
      >
        x
      </button>
    </div>
  );
}

const noticeStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "8px 10px",
  borderRadius: 6,
  background: c.accentBg,
  border: `1px solid ${c.border}`,
  fontSize: 11,
  color: c.text,
  lineHeight: 1.5,
};

const smallBtn: React.CSSProperties = {
  ...ghostBtn,
  padding: "3px 8px",
  fontSize: 11,
};

const removeBubble: React.CSSProperties = {
  position: "absolute",
  top: -6,
  right: -6,
  width: 18,
  height: 18,
  borderRadius: 999,
  border: "none",
  background: c.red,
  color: "#1e1e1e",
  fontSize: 12,
  lineHeight: "16px",
  cursor: "pointer",
};
