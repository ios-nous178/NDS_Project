import { useCallback, useState } from "react";
import { c, primaryBtn, primaryBtnDisabled } from "../ui/theme.js";

/** 다운로드(트레이로 내려받는) 아이콘 — currentColor 라 버튼 글자색을 따라간다. */
function DownloadIcon(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5v7m0 0L5.2 6.7M8 9.5l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.8 10.5v1.2A1.8 1.8 0 0 0 4.6 13.5h6.8a1.8 1.8 0 0 0 1.8-1.8v-1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 상단바 내보내기 버튼 (Phase 6). 기존 pick-path-first 흐름 재사용:
 * ① 저장 위치 먼저 → ② 내부 빌드 → ③ 고른 위치에 기록. 결과는 짧은 토스트로.
 */
export function ExportButton({
  projectPath,
  mockupDir,
  disabled,
  onExported,
}: {
  projectPath: string | null;
  /** 활성 목업 폴더(빌드 cwd). 없으면 projectPath 루트에서 빌드. */
  mockupDir?: string | null;
  /** admin-cms 등 HTML 파이프라인 비대상이면 비활성. */
  disabled?: boolean;
  /** 공유용 산출물(projectPath 기준 상대경로) 미리보기 전환용. */
  onExported: (outputRel: string) => void;
}): React.JSX.Element {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const run = useCallback(async () => {
    if (!projectPath || busy || disabled) return;
    // 저장 파일명 기본값은 활성 목업 폴더 이름(없으면 프로젝트 이름) 기준.
    const base = (mockupDir ?? projectPath).split(/[/\\]/).filter(Boolean).pop() ?? "mockup";
    const picked = await window.harness.pickExportPath(`${projectPath}/${base}-share.html`);
    if (!picked.path) return; // 위치 취소 → 빌드 안 함.

    setBusy(true);
    setToast(null);
    try {
      const r = await window.harness.exportMockup(projectPath, mockupDir ?? undefined);
      if (!r.build.ok) {
        setToast({ ok: false, msg: r.build.error ?? "빌드 실패" });
        return;
      }
      if (r.projectOutputRel) onExported(r.projectOutputRel);
      if (r.build.outputPath) {
        const placed = await window.harness.placeExport(r.build.outputPath, picked.path);
        setToast({ ok: true, msg: `저장됨 · ${placed.path.split(/[/\\]/).pop()}` });
      }
    } catch (e) {
      setToast({ ok: false, msg: (e as Error).message });
    } finally {
      setBusy(false);
      window.setTimeout(() => setToast(null), 4000);
    }
  }, [projectPath, busy, disabled, mockupDir, onExported]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={run}
        disabled={!projectPath || busy || disabled}
        title="현재 목업을 공유용 단일 HTML 파일로 내보냅니다 (저장 위치 선택 → 빌드 → 저장)"
        style={{
          ...(!projectPath || busy || disabled ? primaryBtnDisabled : primaryBtn),
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <DownloadIcon />
        {busy ? "내보내는 중…" : "내보내기"}
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
