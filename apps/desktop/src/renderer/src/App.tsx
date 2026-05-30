export function App(): React.JSX.Element {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ margin: 0 }}>Nudge EAP Harness</h1>
      <p style={{ color: "#666" }}>
        스켈레톤 부팅됨 · preload ping ={" "}
        {typeof window.harness?.ping === "function" ? window.harness.ping() : "n/a"}
      </p>
    </div>
  );
}
