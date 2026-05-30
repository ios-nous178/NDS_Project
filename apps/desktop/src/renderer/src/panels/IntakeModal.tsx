import { useCallback, useMemo, useState } from "react";
import type { AgentType, ScreenshotInput } from "../../../preload/index.js";
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

/**
 * 목업 인테이크 모달 (Level 2 강제).
 *
 * 브랜드·표면·기획서·스크린샷을 에이전트 시작 전에 받아, main 의 runIntake 가 게이트 충족
 * 파일을 결정론적으로 써두게 한다. 제출 → intake:start → 시드 세션 시작 → onStarted(sessionId).
 */

const BRANDS: { slug: string; label: string }[] = [
  { slug: "trost", label: "Trost" },
  { slug: "geniet", label: "Geniet" },
  { slug: "nudge-eap", label: "NudgeEAP" },
  { slug: "runmile", label: "Runmile" },
  { slug: "cashwalk-biz", label: "Cashpobi (cashwalk-biz)" },
];

type Surface = "service" | "admin";

/** 화면 썸네일/전송용 내부 표현. main 으로는 fileName/sourcePath/base64 만 넘긴다. */
interface ShotItem extends ScreenshotInput {
  thumbUrl: string;
}

/** guides.ts resolveEffectiveIntent 미러(렌더러 프리뷰용 — 실제 계산은 main intake.ts). */
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

/** 기획 문서 첨부 내부 표현(썸네일 없음). */
interface DocItem {
  fileName: string;
  base64?: string;
  sourcePath?: string;
}

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
  const [brand, setBrand] = useState("");
  const [surface, setSurface] = useState<Surface>("service");
  const [screenName, setScreenName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [prd, setPrd] = useState("");
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
        // path 없음(붙여넣기/보안) → base64 폴백
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

  const canSubmit = !!brand && !!screenName.trim() && !busy;

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError("");
    const res = await window.harness.startIntake({
      projectPath,
      brand,
      surface,
      screenName: screenName.trim(),
      slug: slugDirty ? slug.trim() : undefined,
      prd,
      extraRequirements: extra,
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
    });
    setBusy(false);
    if (!res.ok || !res.sessionId) {
      setError(res.error ?? "시작 실패");
      return;
    }
    onStarted(res.sessionId, res.intent ?? intent, res.slug ?? effectiveSlug);
    onClose();
  }, [
    canSubmit,
    projectPath,
    brand,
    surface,
    screenName,
    slug,
    slugDirty,
    intent,
    effectiveSlug,
    prd,
    extra,
    shots,
    docs,
    figma,
    agentType,
    onStarted,
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
          width: 560,
          maxWidth: "92vw",
          maxHeight: "85vh",
          overflow: "auto",
          background: c.bgPanel,
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          padding: 20,
          fontFamily: font,
          color: c.text,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <strong style={{ fontSize: 15 }}>새 목업</strong>
          <div style={{ marginLeft: "auto", display: "flex", gap: 2, ...segGroup }}>
            {(["claude", "codex"] as AgentType[]).map((t) => (
              <button
                key={t}
                onClick={() => setAgentType(t)}
                style={agentType === t ? segItemActive : segItem}
              >
                {t === "claude" ? "Claude" : "Codex"}
              </button>
            ))}
          </div>
        </div>

        {/* 브랜드 */}
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

        {/* 화면 종류 */}
        <div style={field}>
          {label("어떤 화면인가요? *")}
          {/* 다른 입력 필드와 좌우 끝을 맞추기 위해 전체폭 + 두 버튼이 50%씩 채운다. */}
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
            <div
              style={{
                marginTop: 8,
                padding: "8px 10px",
                borderRadius: 6,
                background: c.accentBg,
                border: `1px solid ${c.border}`,
                fontSize: 11,
                color: c.text,
                lineHeight: 1.5,
              }}
            >
              관리자 화면은 앱 안에서 바로 미리보기·내보내기가 아직 안 돼요(별도 구조라서요). 생성은
              채팅으로 정상 진행됩니다.
            </div>
          )}
        </div>

        {/* 화면명 + 슬러그 */}
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

        {/* 기획 내용 */}
        <div style={field}>
          {label("기획 내용")}
          <textarea
            value={prd}
            onChange={(e) => setPrd(e.target.value)}
            rows={5}
            placeholder="이 화면이 무엇을 하는지 · 어떤 요소가 들어가는지 · 어떻게 동작하는지"
            style={{ ...input, resize: "vertical", fontFamily: font }}
          />
        </div>

        {/* 기획 문서 첨부 (PDF·MD·TXT·HTML) */}
        <div style={field}>
          {label("기획 문서 첨부 (PDF·MD·TXT·HTML)")}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addDocs(e.dataTransfer.files);
            }}
            onClick={() => document.getElementById("intake-doc")?.click()}
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
            기획서 파일을 끌어다 놓거나 클릭해 선택 (pdf/md/txt/html)
          </div>
          <input
            id="intake-doc"
            type="file"
            accept=".pdf,.md,.markdown,.txt,.html,.htm"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) addDocs(e.target.files);
              e.target.value = "";
            }}
          />
          {docs.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
              {docs.map((d, i) => (
                <div
                  key={i}
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
                    📄 {d.fileName}
                  </span>
                  <button
                    onClick={() => setDocs((prev) => prev.filter((_, j) => j !== i))}
                    title="제거"
                    style={{
                      border: "none",
                      background: "transparent",
                      color: c.textMuted,
                      cursor: "pointer",
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 스크린샷 */}
        <div style={field}>
          {label("예시 스크린샷 (드래그 또는 클릭)")}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => document.getElementById("intake-file")?.click()}
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
            이미지를 끌어다 놓거나 클릭해 선택 (png/jpg/webp/gif/svg)
          </div>
          <input
            id="intake-file"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {shots.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {shots.map((s, i) => (
                <div key={i} style={{ position: "relative" }}>
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
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      border: "none",
                      background: c.red,
                      color: "#fff",
                      fontSize: 12,
                      lineHeight: "16px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Figma URLs */}
        <div style={field}>
          {label("Figma 링크 (한 줄에 하나)")}
          <textarea
            value={figma}
            onChange={(e) => setFigma(e.target.value)}
            rows={2}
            placeholder="https://figma.com/design/…?node-id=1:2"
            style={{ ...input, resize: "vertical", fontFamily: mono, fontSize: 12 }}
          />
        </div>

        {/* 추가 요구 */}
        <div style={field}>
          {label("추가 요구사항 (제작 방식·규칙)")}
          <textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            rows={3}
            placeholder={
              "예: 여러 화면으로 나눠 제작 · CTA 버튼은 플로팅 고정 · 빈/에러 상태 포함 · 다크모드 우선"
            }
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
            {busy ? "시작 중…" : "생성 시작"}
          </button>
        </div>
      </div>
    </div>
  );
}
