import { useCallback, useState } from "react";
import type { ExportResult } from "../../../preload/index.js";

type Phase = "idle" | "exporting" | "done" | "error";

export function ExportPanel({
  projectPath,
  hasSelection,
  onExported,
}: {
  projectPath: string | null;
  hasSelection: boolean;
  /** 공유용 산출물(projectPath 기준 상대경로) 미리보기 전환용. */
  onExported: (outputRel: string) => void;
}): React.JSX.Element {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string>("");
  const [savedPath, setSavedPath] = useState<string>("");

  const defaultDest = useCallback(() => {
    const base = projectPath?.split(/[/\\]/).filter(Boolean).pop() ?? "mockup";
    return `${projectPath}/${base}-share.html`;
  }, [projectPath]);

  // 고른 폴더로 바로 내보내기: ① 목적지 먼저 선택 → ② 내부 빌드 → ③ 산출물을 목적지에 기록.
  // dist/index.html 은 앱 내 미리보기/검증 파이프라인용 canonical 산출물로만 남고,
  // 사용자가 받는 결과물은 ①에서 고른 위치에 곧바로 떨어진다.
  const runExport = useCallback(async () => {
    if (!projectPath) return;
    // ① 목적지 먼저 — 빌드 전에 취소 가능.
    const picked = await window.harness.pickExportPath(defaultDest());
    if (!picked.path) return; // 위치 선택 취소 → 빌드도 하지 않음.

    setPhase("exporting");
    setError("");
    setSavedPath("");
    try {
      const r = await window.harness.exportMockup(projectPath); // ② 내부 빌드
      setResult(r);
      setPhase("done");
      if (r.build.ok && r.outputRel) onExported(r.outputRel);
      if (r.build.ok && r.build.outputPath) {
        // ③ 고른 목적지에 바로 기록.
        const placed = await window.harness.placeExport(r.build.outputPath, picked.path);
        setSavedPath(placed.path);
      }
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }, [projectPath, onExported, defaultDest]);

  // 같은 산출물을 다른 위치에 추가로 내보내기.
  const saveAgain = useCallback(async () => {
    if (!result?.build.outputPath) return;
    const picked = await window.harness.pickExportPath(defaultDest());
    if (!picked.path) return;
    const placed = await window.harness.placeExport(result.build.outputPath, picked.path);
    setSavedPath(placed.path);
  }, [result, defaultDest]);

  if (!projectPath)
    return <div style={{ color: "#999", fontSize: 13 }}>프로젝트를 열면 내보낼 수 있습니다.</div>;

  return (
    <div style={{ fontSize: 13 }}>
      <button onClick={runExport} disabled={phase === "exporting"} style={primaryBtn}>
        {phase === "exporting" ? "내보내는 중…" : "공유용 HTML 내보내기…"}
      </button>
      <div style={{ color: "#98a2b3", fontSize: 11, marginTop: 6 }}>
        저장 위치/이름을 먼저 고르면, 원본은 그대로 둔 채 자체완결 단일파일을 그 위치로 바로
        내보냅니다.
        {!hasSelection && " (목업 프로젝트 루트의 index.html 이 빌드 진입점)"}
      </div>

      {phase === "error" && (
        <div style={{ ...warnBox, color: "#d92d20" }}>내보내기 실패: {error}</div>
      )}

      {phase === "done" && result && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 600, color: result.build.ok ? "#067647" : "#d92d20" }}>
            {result.build.ok ? "✓ 내보내기 완료" : "✗ 내보내기 실패"}
            {result.build.sizeKb != null && (
              <span style={{ color: "#888", fontWeight: 400 }}> · {result.build.sizeKb} KB</span>
            )}
          </div>
          {result.build.ok && (
            <div style={{ marginTop: 8 }}>
              {savedPath ? (
                <div
                  style={{
                    color: "#067647",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                    wordBreak: "break-all",
                  }}
                >
                  내보냄 → {savedPath}
                </div>
              ) : (
                <div style={{ color: "#98a2b3", fontSize: 12, marginBottom: 6 }}>
                  내보내기 위치 선택을 취소했습니다.
                </div>
              )}
              <button onClick={() => void saveAgain()} style={linkBtn}>
                {savedPath ? "다른 위치에 또 내보내기…" : "위치 골라 내보내기…"}
              </button>
            </div>
          )}
          {/* dist/index.html 은 목적지가 아니라 앱 내 미리보기/검증용 내부 산출물 — 작게만 노출. */}
          {result.outputRel && (
            <div style={{ marginTop: 8, color: "#98a2b3", fontSize: 11 }}>
              앱에서 미리보기:{" "}
              <button onClick={() => onExported(result.outputRel!)} style={linkBtnMuted}>
                {result.outputRel}
              </button>
            </div>
          )}
          {result.build.dsUsageSummary && (
            <div style={summaryBox}>{result.build.dsUsageSummary}</div>
          )}
          {result.build.error && (
            <div style={{ ...warnBox, color: "#d92d20" }}>{result.build.error}</div>
          )}
        </div>
      )}
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  background: "#175cd3",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13,
};
const linkBtn: React.CSSProperties = {
  border: "none",
  background: "none",
  color: "#175cd3",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: 13,
  padding: 0,
};
const linkBtnMuted: React.CSSProperties = {
  border: "none",
  background: "none",
  color: "#98a2b3",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: 11,
  padding: 0,
  fontFamily: "ui-monospace, monospace",
};
const warnBox: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #fec84b",
  background: "#fffcf5",
  color: "#b54708",
  fontSize: 12,
  margin: "6px 0",
};
const summaryBox: React.CSSProperties = {
  marginTop: 6,
  padding: "6px 10px",
  borderRadius: 6,
  background: "#f9fafb",
  border: "1px solid #eaecf0",
  color: "#344054",
  fontSize: 12,
  fontFamily: "ui-monospace, monospace",
  wordBreak: "break-all",
};
