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

  const runExport = useCallback(async () => {
    if (!projectPath) return;
    setPhase("exporting");
    setError("");
    setSavedPath("");
    try {
      const r = await window.harness.exportMockup(projectPath);
      setResult(r);
      setPhase("done");
      if (r.build.ok && r.outputRel) onExported(r.outputRel);
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }, [projectPath, onExported]);

  const saveAs = useCallback(async () => {
    if (!projectPath || !result?.build.outputPath) return;
    const base = projectPath.split(/[/\\]/).filter(Boolean).pop() ?? "mockup";
    const defaultPath = `${projectPath}/${base}-share.html`;
    const res = await window.harness.saveExport(result.build.outputPath, defaultPath);
    if (res.saved && res.path) setSavedPath(res.path);
  }, [projectPath, result]);

  if (!projectPath)
    return <div style={{ color: "#999", fontSize: 13 }}>프로젝트를 열면 내보낼 수 있습니다.</div>;

  return (
    <div style={{ fontSize: 13 }}>
      <button onClick={runExport} disabled={phase === "exporting"} style={primaryBtn}>
        {phase === "exporting" ? "내보내는 중…" : "공유용 HTML 내보내기"}
      </button>
      <div style={{ color: "#98a2b3", fontSize: 11, marginTop: 6 }}>
        원본은 그대로 두고 자체완결 단일파일을 새로 만듭니다.
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
          {result.outputRel && (
            <div style={{ marginTop: 4 }}>
              <code style={{ color: "#175cd3" }}>{result.outputRel}</code>{" "}
              <button onClick={() => onExported(result.outputRel!)} style={linkBtn}>
                미리보기
              </button>
            </div>
          )}
          {result.build.ok && (
            <div style={{ marginTop: 8 }}>
              <button onClick={saveAs} style={primaryBtn}>
                공유용으로 저장…
              </button>
              {savedPath && (
                <div
                  style={{ color: "#067647", fontSize: 12, marginTop: 4, wordBreak: "break-all" }}
                >
                  저장됨: {savedPath}
                </div>
              )}
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
