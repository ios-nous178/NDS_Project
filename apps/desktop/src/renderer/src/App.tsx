import { useCallback, useState } from "react";
import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import { ValidationPanel } from "./panels/ValidationPanel.js";

export function App(): React.JSX.Element {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");
  const [result, setResult] = useState<ValidateHtmlMockupResult | null>(null);
  const [validating, setValidating] = useState(false);

  const openProject = useCallback(async () => {
    const res = await window.harness.openProject();
    if ("canceled" in res) return;
    setProjectPath(res.projectPath);
    setEntries(res.htmlEntries);
    setSelected(null);
    setSource("");
    setResult(null);
  }, []);

  const selectEntry = useCallback(
    async (rel: string) => {
      if (!projectPath) return;
      const abs = `${projectPath}/${rel}`;
      setSelected(rel);
      setValidating(true);
      const [{ source: src }, validation] = await Promise.all([
        window.harness.readMockup(abs),
        window.harness.validate(abs),
      ]);
      setSource(src);
      setResult(validation);
      setValidating(false);
    },
    [projectPath],
  );

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
          style={{ width: 260, borderRight: "1px solid #e4e7ec", overflowY: "auto", padding: 12 }}
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

        <main style={{ flex: 1, display: "flex", minWidth: 0 }}>
          <section
            style={{ flex: 1, padding: 16, overflow: "auto", borderRight: "1px solid #e4e7ec" }}
          >
            <div style={{ fontSize: 12, color: "#98a2b3", marginBottom: 8 }}>소스</div>
            <pre
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#475467",
              }}
            >
              {source || "(선택된 파일 없음)"}
            </pre>
          </section>
          <section style={{ width: 380, padding: 16, overflow: "auto" }}>
            <div style={{ fontSize: 12, color: "#98a2b3", marginBottom: 8 }}>검증 (21 규칙)</div>
            <ValidationPanel result={result} loading={validating} />
          </section>
        </main>
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
