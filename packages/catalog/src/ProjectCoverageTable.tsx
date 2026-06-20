import React, { useMemo, useState } from "react";
import type {
  ProjectCoverageTableProps,
  CoverageRow,
  CoverageStatus,
} from "./types.js";

/* 토큰 셀프 스타일 — docs(라이트)·storybook 어디서든 동일. nds-cov- prefix 로 격리. */
const COVERAGE_CSS = `
.nds-cov-root{display:flex;flex-direction:column;gap:20px;font-variant-numeric:tabular-nums}
.nds-cov-head h2{margin:0;font-size:20px;font-weight:700;color:var(--semantic-text-strong-default,#1f1f1f)}
.nds-cov-legend{margin:6px 0 0;font-size:13px;line-height:1.6;color:var(--semantic-text-subtle-default,#6b7280)}
.nds-cov-legend b{color:var(--semantic-text-strong-default,#1f1f1f)}
.nds-cov-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.nds-cov-stat{border:1px solid var(--semantic-border-subtle-default,#e5e7eb);border-radius:8px;padding:12px 14px;background:var(--semantic-bg-surface-default,#fff)}
.nds-cov-stat__label{font-size:11px;color:var(--semantic-text-subtle-default,#6b7280);margin-bottom:4px}
.nds-cov-stat__value{font-size:18px;font-weight:700;color:var(--semantic-text-strong-default,#1f1f1f)}
.nds-cov-stat__hint{font-size:10.5px;color:var(--semantic-text-muted-default,#9ca3af);margin-top:2px}
.nds-cov-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.nds-cov-fbtn{border:1px solid var(--semantic-border-normal-default,#d8d8d8);background:transparent;color:var(--semantic-text-normal-default,#374151);border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer}
.nds-cov-fbtn[aria-pressed="true"]{background:var(--semantic-bg-inverse-default,#1f1f1f);color:var(--semantic-text-inverse-default,#fff);border-color:var(--semantic-bg-inverse-default,#1f1f1f)}
.nds-cov-search{flex:1 1 240px;max-width:360px;height:32px;padding:0 var(--semantic-inset-input,10px);border:1px solid var(--semantic-border-normal-default,#d8d8d8);border-radius:6px;background:var(--semantic-bg-surface-default,#fff);color:var(--semantic-text-strong-default,#1f1f1f);font-size:12px}
.nds-cov-count{font-size:11px;color:var(--semantic-text-subtle-default,#6b7280)}
.nds-cov-tablewrap{overflow-x:auto;border:1px solid var(--semantic-border-subtle-default,#e5e7eb);border-radius:8px}
.nds-cov-table{width:100%;border-collapse:collapse;font-size:13px;min-width:1100px}
.nds-cov-table th,.nds-cov-table td{padding:10px 12px;border-bottom:1px solid var(--semantic-border-subtle-default,#eef0f3);text-align:left;vertical-align:middle}
.nds-cov-table th{position:sticky;top:0;background:var(--semantic-bg-surface-subtle,#f8fafc);font-weight:600;color:var(--semantic-text-strong-default,#1f1f1f);z-index:1}
.nds-cov-table th.nds-cov-c,.nds-cov-table td.nds-cov-c{text-align:center}
.nds-cov-projectsub{font-size:10px;font-weight:500;color:var(--semantic-text-muted-default,#9ca3af);margin-top:2px}
.nds-cov-catrow td{background:var(--semantic-bg-surface-subtle,#f1f5f9);font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--semantic-text-subtle-default,#6b7280)}
.nds-cov-tds{font-weight:600;color:var(--semantic-text-strong-default,#1f1f1f);text-decoration:none}
.nds-cov-tds:hover{text-decoration:underline}
.nds-cov-plat{display:inline-block;font-size:9.5px;padding:1px 5px;border-radius:3px;margin-top:3px;margin-right:4px;background:var(--semantic-bg-surface-subtle,#eef2f7);color:var(--semantic-text-subtle-default,#6b7280);text-transform:uppercase}
.nds-cov-chip{display:inline-block;padding:1px 7px;border-radius:999px;background:var(--semantic-bg-surface-subtle,#eef2f7);color:var(--semantic-text-subtle-default,#6b7280);font-size:10.5px;margin-left:6px}
.nds-cov-note{margin-top:3px;font-size:11px;color:var(--semantic-text-subtle-default,#6b7280);line-height:1.4}
.nds-cov-miss{color:var(--semantic-text-muted-default,#9ca3af);font-style:italic}
.nds-cov-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 6px;border-radius:4px;font-weight:600;font-size:11px;min-width:28px;justify-content:center;text-decoration:none}
.nds-cov-badge--synced{background:var(--semantic-bg-status-success,#e7f6ec);color:var(--semantic-text-status-success,#16a34a)}
.nds-cov-badge--code{background:var(--semantic-bg-status-caution,#fdf3da);color:var(--semantic-text-status-caution,#b45309)}
.nds-cov-badge--missing{background:transparent;color:var(--semantic-text-muted-default,#9ca3af)}
.nds-cov-cellpair{display:flex;gap:4px;justify-content:center}
.nds-cov-sub{font-size:13px;font-weight:700;margin:0 0 6px;color:var(--semantic-text-strong-default,#1f1f1f)}
.nds-cov-subnote{margin:0 0 12px;font-size:12px;line-height:1.5;color:var(--semantic-text-subtle-default,#6b7280)}
.nds-cov-dot-on{color:var(--semantic-text-status-success,#16a34a);font-size:14px}
.nds-cov-dot-off{color:var(--semantic-text-muted-default,#9ca3af)}
`;

const GLYPH: Record<CoverageStatus, string> = { synced: "●", code: "○", missing: "—" };
const TOOLTIP: Record<CoverageStatus, string> = {
  synced: "코드 ✓ + 해당 프로젝트 Figma 가이드 ✓",
  code: "코드 있음, 이 프로젝트 Figma 가이드 미정합",
  missing: "구현 없음",
};

function StatusBadge({
  status,
  label,
  href,
}: {
  status: CoverageStatus;
  label: string;
  href?: string | null;
}) {
  const inner = (
    <span className={`nds-cov-badge nds-cov-badge--${status}`} title={TOOLTIP[status]}>
      {GLYPH[status]} {label}
    </span>
  );
  if (status === "synced" && href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
        {inner}
      </a>
    );
  }
  return inner;
}

function matchesFilter(row: CoverageRow, filter: "all" | "synced" | "gaps", q: string): boolean {
  if (filter === "synced" && row.figmaCount === 0) return false;
  if (filter === "gaps" && row.mapped) return false;
  if (q && !row.tds.toLowerCase().includes(q) && !(row.nds ?? "").toLowerCase().includes(q)) {
    return false;
  }
  return true;
}

export function ProjectCoverageTable(props: ProjectCoverageTableProps): React.JSX.Element {
  const { view, title = "Project × Component Coverage", legend = true } = props;
  const { projects, summary, groups, chromeMatrix } = view;

  const [filter, setFilter] = useState<"all" | "synced" | "gaps">("all");
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();

  const visibleGroups = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, rows: g.rows.filter((r) => matchesFilter(r, filter, q)) }))
        .filter((g) => g.rows.length > 0),
    [groups, filter, q],
  );
  const shown = useMemo(
    () => visibleGroups.reduce((n, g) => n + g.rows.length, 0),
    [visibleGroups],
  );

  const stats = [
    { label: "목표 컴포넌트", value: `${summary.total}`, hint: "행 수" },
    { label: "NDS 매핑됨", value: `${summary.mapped} / ${summary.total}`, hint: "대응 존재" },
    { label: "NDS 미구현", value: `${summary.gaps}`, hint: "목표 gap" },
    { label: "React 커버", value: `${summary.reactCovered} / ${summary.total}`, hint: "@nudge-design/react" },
    { label: "HTML 커버", value: `${summary.htmlCovered} / ${summary.total}`, hint: "@nudge-design/html" },
    ...projects.map((b) => ({
      label: `Figma — ${b.label}`,
      value: `${summary.figmaPerProject[b.id] ?? 0} / ${summary.total}`,
      hint: "프로젝트 가이드 정합",
    })),
  ];

  return (
    <div className="nds-cov-root">
      <style>{COVERAGE_CSS}</style>
      <div className="nds-cov-head">
        <h2>{title}</h2>
        {legend ? (
          <p className="nds-cov-legend">
            5개 프로젝트 × 2개 패키지(react/html) 구현 현황. <b>● synced</b> = 코드 + 해당 프로젝트 Figma
            가이드 둘 다 ✓ · <b>○ code</b> = 코드만 · <b>— missing</b> = 코드 없음.
          </p>
        ) : null}
      </div>

      <section className="nds-cov-stats">
        {stats.map((s) => (
          <div key={s.label} className="nds-cov-stat">
            <div className="nds-cov-stat__label">{s.label}</div>
            <div className="nds-cov-stat__value">{s.value}</div>
            <div className="nds-cov-stat__hint">{s.hint}</div>
          </div>
        ))}
      </section>

      <section className="nds-cov-controls">
        {(
          [
            { id: "all", label: "전체" },
            { id: "synced", label: "Figma 정합 1개+" },
            { id: "gaps", label: "NDS 미구현" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            className="nds-cov-fbtn"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <input
          type="search"
          className="nds-cov-search"
          placeholder="목표 / NDS 컴포넌트명으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="nds-cov-count">{shown} 개 표시 중</span>
      </section>

      <section className="nds-cov-tablewrap">
        <table className="nds-cov-table">
          <thead>
            <tr>
              <th style={{ minWidth: 180 }}>목표 컴포넌트</th>
              <th style={{ minWidth: 160 }}>NDS 대응</th>
              {projects.map((b) => (
                <th key={b.id} className="nds-cov-c" style={{ minWidth: 130 }}>
                  {b.label}
                  <div className="nds-cov-projectsub">React · HTML</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleGroups.map((g) => (
              <React.Fragment key={g.categoryKey}>
                <tr className="nds-cov-catrow">
                  <td colSpan={2 + projects.length}>{g.categoryLabel}</td>
                </tr>
                {g.rows.map((row) => (
                  <tr key={row.tds}>
                    <td>
                      {row.docsUrl ? (
                        <a className="nds-cov-tds" href={row.docsUrl} target="_blank" rel="noreferrer">
                          {row.tds}
                        </a>
                      ) : (
                        <span className="nds-cov-tds">{row.tds}</span>
                      )}
                      <div>
                        {row.platforms.map((p) => (
                          <span key={p} className="nds-cov-plat">
                            {p === "mobile" ? "web" : p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {row.nds ? (
                        <>
                          <span style={{ fontWeight: 500 }}>{row.nds}</span>
                          {row.inventoryCategory ? (
                            <span className="nds-cov-chip">{row.inventoryCategory}</span>
                          ) : null}
                          {row.ndsNote ? <div className="nds-cov-note">{row.ndsNote}</div> : null}
                        </>
                      ) : (
                        <span className="nds-cov-miss">
                          미매핑
                          {row.ndsNote ? <div className="nds-cov-note">{row.ndsNote}</div> : null}
                        </span>
                      )}
                    </td>
                    {row.cells.map((cell) => (
                      <td key={cell.project} className="nds-cov-c">
                        <div className="nds-cov-cellpair">
                          <StatusBadge status={cell.react} label="R" href={cell.figmaHref} />
                          <StatusBadge status={cell.html} label="H" href={cell.figmaHref} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {chromeMatrix.length > 0 ? (
        <section>
          <p className="nds-cov-sub">프로젝트 chrome (header / footer / nav)</p>
          <p className="nds-cov-subnote">
            packages/react/src/&#123;project&#125;/ 폴더 기준 실제 프로젝트 fork 가 있는 chrome 컴포넌트.
          </p>
          <div className="nds-cov-tablewrap">
            <table className="nds-cov-table" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th>Chrome 컴포넌트</th>
                  {projects.map((b) => (
                    <th key={b.id} className="nds-cov-c" style={{ minWidth: 110 }}>
                      {b.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chromeMatrix.map((r) => (
                  <tr key={r.name}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    {projects.map((b) => (
                      <td key={b.id} className="nds-cov-c">
                        {r.present[b.id] ? (
                          <span className="nds-cov-dot-on">●</span>
                        ) : (
                          <span className="nds-cov-dot-off">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
