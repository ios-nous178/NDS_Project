import { useCallback, useState } from "react";
import type { ConvertPreview, PipelineRunResult } from "../../../preload/index.js";

type Phase = "idle" | "diff" | "building" | "done" | "error";

export function PipelinePanel({
  mockupPath,
  projectPath,
  onBuilt,
}: {
  mockupPath: string | null;
  projectPath: string | null;
  onBuilt: (outputPathRelToProject: string) => void;
}): React.JSX.Element {
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<ConvertPreview | null>(null);
  const [result, setResult] = useState<PipelineRunResult | null>(null);
  const [error, setError] = useState<string>("");

  const reset = useCallback(() => {
    setPhase("idle");
    setPreview(null);
    setResult(null);
    setError("");
  }, []);

  const build = useCallback(
    async (applyConvert: boolean) => {
      if (!mockupPath || !projectPath) return;
      setPhase("building");
      setError("");
      try {
        const r = await window.harness.pipelineRun(mockupPath, projectPath, applyConvert);
        setResult(r);
        setPhase("done");
        const out = r.build.outputPath;
        if (r.build.ok && out) {
          // dist/index.html → projectPath 기준 상대경로로 미리보기 전환.
          const rel = out.startsWith(projectPath)
            ? out.slice(projectPath.length).replace(/^[/\\]+/, "")
            : out;
          onBuilt(rel);
        }
      } catch (e) {
        setError((e as Error).message);
        setPhase("error");
      }
    },
    [mockupPath, projectPath, onBuilt],
  );

  const start = useCallback(async () => {
    if (!mockupPath || !projectPath) return;
    setError("");
    const p = await window.harness.pipelinePreview(mockupPath);
    setPreview(p);
    if (p.changed) setPhase("diff");
    else await build(false); // 변환 없음 → 바로 빌드
  }, [mockupPath, projectPath, build]);

  const rollback = useCallback(async () => {
    if (!mockupPath) return;
    await window.harness.pipelineRollback(mockupPath);
    reset();
  }, [mockupPath, reset]);

  if (!mockupPath)
    return <div style={{ color: "#999", fontSize: 13 }}>파일을 선택하면 빌드할 수 있습니다.</div>;

  return (
    <div style={{ fontSize: 13 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={start} disabled={phase === "building"} style={primaryBtn}>
          {phase === "building" ? "빌드 중…" : "빌드 (DS-wrap → 단일파일)"}
        </button>
        {phase !== "idle" && (
          <button onClick={reset} style={ghostBtn}>
            초기화
          </button>
        )}
      </div>

      {phase === "diff" && preview && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            DS-wrap 변환 {preview.changes.length}건 제안
          </div>
          {preview.gitDirty === true && (
            <div style={warnBox}>
              ⚠️ 이 파일에 커밋되지 않은 변경이 있습니다. 적용 전 커밋을 권장합니다 (`.bak` 백업은
              자동 생성).
            </div>
          )}
          {preview.gitDirty === null && (
            <div style={{ ...warnBox, color: "#475467", borderColor: "#d0d5dd" }}>
              git 추적 밖입니다 — `.bak` 백업만으로 보호됩니다.
            </div>
          )}
          <ul style={{ margin: "6px 0", paddingLeft: 18, color: "#475467" }}>
            {preview.changes.slice(0, 20).map((c, i) => (
              <li key={i}>
                <code>{c.rule}</code> <span style={{ color: "#888" }}>(line {c.line})</span>
              </li>
            ))}
            {preview.changes.length > 20 && <li>… 외 {preview.changes.length - 20}건</li>}
          </ul>
          <button onClick={() => build(true)} style={primaryBtn}>
            적용 후 빌드 (.bak 백업)
          </button>
        </div>
      )}

      {phase === "error" && <div style={{ ...warnBox, color: "#d92d20" }}>빌드 실패: {error}</div>}

      {phase === "done" && result && (
        <div>
          <div style={{ fontWeight: 600, color: result.build.ok ? "#067647" : "#d92d20" }}>
            {result.build.ok ? "✓ 빌드 성공" : "✗ 빌드 실패"}
            {result.build.sizeKb != null && (
              <span style={{ color: "#888", fontWeight: 400 }}> · {result.build.sizeKb} KB</span>
            )}
          </div>
          {result.applied && (
            <div style={{ marginTop: 4, color: "#475467" }}>
              DS-wrap 적용됨{" "}
              <button onClick={rollback} style={linkBtn}>
                되돌리기
              </button>
            </div>
          )}
          {result.build.dsUsageSummary && (
            <div style={summaryBox}>{result.build.dsUsageSummary}</div>
          )}
          {result.build.sourceBadgeSync?.summary && (
            <div style={{ marginTop: 4, color: "#475467", fontSize: 12 }}>
              버전 stamp: {result.build.sourceBadgeSync.summary}
            </div>
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
const ghostBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #d0d5dd",
  background: "#fff",
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
