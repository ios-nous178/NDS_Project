import { useCallback, useEffect, useRef, useState } from "react";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import { ValidationPanel } from "./panels/ValidationPanel.js";
import { PreviewPanel } from "./panels/PreviewPanel.js";
import { PipelinePanel } from "./panels/PipelinePanel.js";

export function App(): React.JSX.Element {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");
  const [result, setResult] = useState<ValidateHtmlMockupResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [bust, setBust] = useState(0);
  // 미리보기 대상(소스 파일 / 빌드 후엔 dist/index.html). 검증 대상(selected)과 분리.
  const [previewRel, setPreviewRel] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const projectRef = useRef<string | null>(null);

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
  }, []);

  const selectEntry = useCallback(
    (rel: string) => {
      if (!projectPath) return;
      setSelected(rel);
      selectedRef.current = rel;
      setPreviewRel(rel); // 미리보기를 소스 파일로 (빌드하면 dist 로 전환됨)
      void loadFile(projectPath, rel);
    },
    [projectPath, loadFile],
  );

  // 저장 감시 → 현재 선택 파일이 바뀌면 재검증 + 미리보기 리로드.
  useEffect(() => {
    return window.harness.onFileChanged((e) => {
      if (e.relPath === selectedRef.current && projectRef.current) {
        void loadFile(projectRef.current, e.relPath);
      }
    });
  }, [loadFile]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderBottom: "1px solid #e4e7ec",
        }}
      >
        <strong>Nudge EAP Harness</strong>
        <button onClick={openProject} style={btnStyle}>
          프로젝트 폴더 열기
        </button>
        {projectPath && (
          <span
            style={{
              color: "#667085",
              fontSize: 12,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {projectPath}
          </span>
        )}
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <aside
          style={{ width: 240, borderRight: "1px solid #e4e7ec", overflowY: "auto", padding: 12 }}
        >
          <div style={{ fontSize: 12, color: "#98a2b3", marginBottom: 8 }}>
            HTML 목업 ({entries.length})
          </div>
          {entries.map((e) => (
            <button
              key={e}
              onClick={() => selectEntry(e)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 8px",
                border: "none",
                borderRadius: 6,
                background: selected === e ? "#eff8ff" : "transparent",
                color: selected === e ? "#175cd3" : "#344054",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {e}
            </button>
          ))}
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <section style={{ flex: 1, minHeight: 0, borderBottom: "1px solid #e4e7ec" }}>
            <PreviewPanel relPath={previewRel} bust={bust} />
          </section>
          <details style={{ maxHeight: 180, overflow: "auto", padding: "8px 16px" }}>
            <summary style={{ fontSize: 12, color: "#98a2b3", cursor: "pointer" }}>소스</summary>
            <pre
              style={{
                margin: "8px 0 0",
                fontSize: 12,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#475467",
              }}
            >
              {source || "(선택된 파일 없음)"}
            </pre>
          </details>
        </main>

        <section
          style={{ width: 360, padding: 16, overflow: "auto", borderLeft: "1px solid #e4e7ec" }}
        >
          <div style={{ fontSize: 12, color: "#98a2b3", marginBottom: 8 }}>
            빌드 파이프라인 (강제)
          </div>
          <PipelinePanel
            mockupPath={projectPath && selected ? `${projectPath}/${selected}` : null}
            projectPath={projectPath}
            onBuilt={(rel) => {
              setPreviewRel(rel);
              setBust((b) => b + 1);
            }}
          />
          <div
            style={{
              fontSize: 12,
              color: "#98a2b3",
              margin: "16px 0 8px",
              borderTop: "1px solid #eaecf0",
              paddingTop: 12,
            }}
          >
            검증 (21 규칙)
          </div>
          <ValidationPanel result={result} loading={validating} />
        </section>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #d0d5dd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};
