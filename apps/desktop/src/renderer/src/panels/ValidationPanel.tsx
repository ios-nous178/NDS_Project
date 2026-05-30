import type { ValidateHtmlMockupResult } from "@nudge-design/mockup-core";
import { c } from "../ui/theme.js";

const SEVERITY_COLOR: Record<string, string> = {
  error: c.red,
  warn: c.yellow,
  info: c.textMuted,
};

function Chip({ label, color }: { label: string; color: string }): React.JSX.Element {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color,
        border: `1px solid ${color}`,
        marginRight: 6,
      }}
    >
      {label}
    </span>
  );
}

export function ValidationPanel({
  result,
  loading,
}: {
  result: ValidateHtmlMockupResult | null;
  loading: boolean;
}): React.JSX.Element {
  if (loading) return <div style={{ color: c.textMuted, fontSize: 13 }}>검증 중…</div>;
  if (!result)
    return (
      <div style={{ color: c.textFaint, fontSize: 13 }}>
        파일을 선택하면 검증 결과가 표시됩니다.
      </div>
    );

  const { severitySummary, violationsByRule } = result;
  return (
    <div style={{ fontSize: 13, color: c.text }}>
      <div style={{ marginBottom: 12 }}>
        <Chip label={`error ${severitySummary.error}`} color={SEVERITY_COLOR.error} />
        <Chip label={`warn ${severitySummary.warn}`} color={SEVERITY_COLOR.warn} />
        <Chip label={`info ${severitySummary.info}`} color={SEVERITY_COLOR.info} />
        {result.ok && (
          <span style={{ color: c.green, fontWeight: 600, marginLeft: 6 }}>✓ 위반 없음</span>
        )}
      </div>
      {violationsByRule.length === 0 ? (
        <div style={{ color: c.green }}>모든 규칙 통과.</div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {[...violationsByRule]
            .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
            .map((r) => (
              <li
                key={r.rule}
                style={{ padding: "6px 0", borderBottom: `1px solid ${c.borderSubtle}` }}
              >
                <span style={{ fontWeight: 600, color: SEVERITY_COLOR[r.severity] ?? c.text }}>
                  {r.rule}
                </span>
                <span style={{ color: c.textMuted, marginLeft: 8 }}>×{r.count}</span>
                <div style={{ color: c.textFaint, fontSize: 12, marginTop: 2 }}>
                  line {r.lines.slice(0, 12).join(", ")}
                  {r.lines.length > 12 ? " …" : ""}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

function severityRank(s: string): number {
  return s === "error" ? 0 : s === "warn" ? 1 : 2;
}
