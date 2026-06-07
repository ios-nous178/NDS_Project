import { useCallback, useState } from "react";
import { c, ghostBtn } from "../ui/theme.js";

/** Figma 라인(아웃라인) 아이콘 — currentColor 라 버튼 글자색을 따라간다(다른 라인 아이콘과 톤 통일). */
function FigmaIcon(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path d="M5 5.5a3.5 3.5 0 0 1 3.5 -3.5h3.5v7h-3.5a3.5 3.5 0 0 1 -3.5 -3.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 0 1 0 7h-3.5z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1 -7 0z" />
      <path d="M5 19.5a3.5 3.5 0 0 1 3.5 -3.5h3.5v3.5a3.5 3.5 0 1 1 -7 0z" />
      <path d="M5 12.5a3.5 3.5 0 0 1 3.5 -3.5h3.5v7h-3.5a3.5 3.5 0 0 1 -3.5 -3.5z" />
    </svg>
  );
}

/**
 * Figma 내보내기 버튼 (canary). 상단 "내보내기" 왼편에 둔다.
 *
 * dist 를 화면 밖 창에 렌더해 DOM 을 평면 scene 으로 뽑고 dist/.figma/scene.json 에
 * 저장 + 클립보드 복사한다. 사용자는 Figma 의 짝 플러그인(tools/figma-plugin)에 붙여넣어
 * 캔버스에 편집 가능한 평면 레이어로 가져온다. 저장 위치 선택 없이 한 번에 처리.
 */
export function FigmaExportButton({
  projectPath,
  mockupDir,
  disabled,
}: {
  projectPath: string | null;
  /** 활성 목업 폴더(빌드 cwd). 없으면 projectPath 루트에서 빌드. */
  mockupDir?: string | null;
  /** admin-cms 등 HTML 파이프라인 비대상이면 비활성. */
  disabled?: boolean;
}): React.JSX.Element {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const run = useCallback(async () => {
    if (!projectPath || busy || disabled) return;
    setBusy(true);
    setToast(null);
    try {
      const r = await window.harness.exportFigmaScene(projectPath, mockupDir ?? undefined);
      if (!r.ok) {
        setToast({ ok: false, msg: r.error ?? "추출 실패" });
        return;
      }
      setToast({ ok: true, msg: `레이어 ${r.nodeCount}개 · 클립보드 복사됨 → Figma 플러그인` });
    } catch (e) {
      setToast({ ok: false, msg: (e as Error).message });
    } finally {
      setBusy(false);
      window.setTimeout(() => setToast(null), 6000);
    }
  }, [projectPath, busy, disabled, mockupDir]);

  const off = !projectPath || busy || disabled;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={run}
        disabled={off}
        title="현재 목업을 Figma 평면 레이어로 추출합니다 (scene.json 저장 + 클립보드 복사 → Figma 플러그인에 붙여넣기). 실험 기능(canary)."
        style={{
          ...ghostBtn,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          ...(off ? { color: c.textFaint, cursor: "not-allowed", opacity: 0.6 } : {}),
        }}
      >
        <FigmaIcon />
        {busy ? "추출 중…" : "Figma"}
        <span style={{ fontSize: 10, color: c.textFaint, fontWeight: 600 }}>(canary)</span>
      </button>
      {toast && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            whiteSpace: "nowrap",
            padding: "6px 10px",
            borderRadius: 6,
            background: c.bgElevated,
            border: `1px solid ${c.border}`,
            color: toast.ok ? c.green : c.red,
            fontSize: 12,
            zIndex: 10,
          }}
        >
          {toast.ok ? "✓ " : "✗ "}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
