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

  // 빌드된 자체완결 산출물을 네이티브 저장 다이얼로그로 원하는 위치/이름에 복사.
  const saveCopy = useCallback(
    async (outputPath: string) => {
      if (!projectPath) return;
      const base = projectPath.split(/[/\\]/).filter(Boolean).pop() ?? "mockup";
      const defaultPath = `${projectPath}/${base}-share.html`;
      const res = await window.harness.saveExport(outputPath, defaultPath);
      if (res.saved && res.path) setSavedPath(res.path);
    },
    [projectPath],
  );

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
      // 빌드 성공 시 곧바로 저장 위치/이름 선택 다이얼로그를 띄운다(취소 가능).
      if (r.build.ok && r.build.outputPath) await saveCopy(r.build.outputPath);
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }, [projectPath, onExported, saveCopy]);

  const saveAgain = useCallback(() => {
    if (result?.build.outputPath) void saveCopy(result.build.outputPath);
  }, [result, saveCopy]);

  if (!projectPath)
    return <div style={{ color: "#999", fontSize: 13 }}>프로젝트를 열면 내보낼 수 있습니다.</div>;

  return (
    <div style={{ fontSize: 13 }}>
      <button onClick={runExport} disabled={phase === "exporting"} style={primaryBtn}>
        {phase === "exporting" ? "내보내는 중…" : "공유용 HTML 내보내기…"}
      </button>
      <div style={{ color: "#98a2b3", fontSize: 11, marginTop: 6 }}>
        원본은 그대로 두고 자체완결 단일파일을 새로 만든 뒤 저장 위치/이름을 고릅니다.
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
              {savedPath ? (
                <div
                  style={{
                    color: "#067647",
                    fontSize: 12,
                    marginBottom: 6,
                    wordBreak: "break-all",
                  }}
                >
                  저장됨: {savedPath}
                </div>
              ) : (
                <div style={{ color: "#98a2b3", fontSize: 12, marginBottom: 6 }}>
                  저장을 취소했습니다.
                </div>
              )}
              <button onClick={saveAgain} style={linkBtn}>
                {savedPath ? "다른 위치에 또 저장…" : "다시 저장…"}
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
