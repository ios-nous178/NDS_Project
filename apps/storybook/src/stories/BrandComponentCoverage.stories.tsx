import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import inventory from "../../../../metadata/componentInventory.json";
import tdsData from "../../../../metadata/tdsComponents.json";
import coverageManifest from "../../../../metadata/coverage-manifest.json";
// 셀 판정·요약 통계의 SSOT — docs 생성기(generate-brand-coverage.mjs)와 같은 node-free 모듈을 공유한다.
// 예전엔 아래 로직을 손수 재선언해 docs(46) vs 보드(45) 로 어긋났다.
import {
  BRANDS,
  BRAND_LABEL,
  hasBrandFigma,
  htmlStatus,
  reactStatus,
  summarize,
} from "../../../../scripts/coverage-logic.mjs";
import type { Brand, ManifestData, Status } from "../../../../scripts/coverage-logic.mjs";

/* ─────────────────────────────────────────────────────────────────
 * Brand × Component Coverage Board
 *
 * 행 = 목표 컴포넌트 (target components — TDS Components 사이드바 기반 baseline)
 * 열 = 5개 브랜드 (Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile)
 * 각 셀 = React 패키지 + HTML 패키지 구현 여부
 *
 * "진짜 구현됨" 기준
 *  ● synced   : 코드 존재 + 해당 브랜드 Figma 가이드 존재 (figmaByBrand[brand])
 *  ○ code     : 코드만 존재, 해당 브랜드 Figma 가이드 미정합
 *  ─ missing  : 코드 자체 없음
 *
 * Figma 가이드는 브랜드별로 따로 존재한다고 보고, metadata/tdsComponents.json
 * 의 figmaByBrand 슬롯이 SSOT. 슬롯이 채워질수록 셀이 ● 로 점등.
 * ───────────────────────────────────────────────────────────────── */

type InventoryEntry = {
  name: string;
  category?: string;
  figmaSynced?: boolean;
  figmaUrl?: string;
  status?: string;
  description?: string;
};

type TdsComponent = {
  tds: string;
  platforms: ("mobile" | "rn")[];
  category: keyof typeof tdsData.categories;
  docsUrl: string;
  nds: string | null;
  ndsNote?: string;
  brandChrome?: boolean;
  figmaByBrand: Partial<Record<Brand, string>>;
};

/* ─── 코드 매니페스트 — metadata/coverage-manifest.json 이 단일 출처(생성물).
 * scripts/generate-brand-coverage.mjs(= pnpm fix 의 generate:brand-coverage)가 생성하고
 * check-ssot 게이트가 stale 을 차단한다. 직접 하드코딩 금지.
 * 배열(JSON) → Set 으로 복원해 coverage-logic 의 순수 판정 함수에 넘긴다. ───────────────── */
const REACT_EXPORTS: ReadonlySet<string> = new Set(coverageManifest.reactExports);
const HTML_EXPORTS: ReadonlySet<string> = new Set(coverageManifest.htmlExports);
const BRAND_CHROME = BRANDS.reduce(
  (acc, b) => {
    const list = (coverageManifest.brandChrome as Record<string, string[] | undefined>)[b] ?? [];
    acc[b] = new Set(list);
    return acc;
  },
  {} as Record<Brand, ReadonlySet<string>>,
);
const MANIFEST: ManifestData = {
  reactExports: REACT_EXPORTS,
  htmlExports: HTML_EXPORTS,
  brandChrome: BRAND_CHROME,
};

/* ─── 헬퍼 ─── */
const inv = inventory as InventoryEntry[];
const invByName: Record<string, InventoryEntry> = Object.fromEntries(inv.map((c) => [c.name, c]));

function brandFigmaCount(c: TdsComponent): number {
  return BRANDS.filter((b) => hasBrandFigma(c, b)).length;
}

/* ─── 스타일 ─── */
const colors = {
  bg: "#0b0c0f",
  surface: "#14161b",
  border: "#262932",
  text: "#e4e6eb",
  textSub: "#9ba0aa",
  brand: "#5c8eff",
  synced: "#22c55e",
  code: "#eab308",
  missing: "#3a3d46",
};

const cellStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: `1px solid ${colors.border}`,
  fontSize: 13,
  verticalAlign: "middle",
};
const headerStyle: React.CSSProperties = {
  ...cellStyle,
  background: colors.surface,
  position: "sticky",
  top: 0,
  fontWeight: 600,
  color: colors.text,
  zIndex: 1,
};

function StatusBadge({ status, label, href }: { status: Status; label: string; href?: string }) {
  const map = {
    synced: { bg: "#0e2a17", fg: colors.synced, glyph: "●" },
    code: { bg: "#2a210b", fg: colors.code, glyph: "○" },
    missing: { bg: "transparent", fg: colors.missing, glyph: "—" },
  } as const;
  const s = map[status];
  const tooltip =
    status === "synced"
      ? "코드 ✓ + 해당 브랜드 Figma 가이드 ✓"
      : status === "code"
        ? "코드 있음, 이 브랜드 Figma 가이드 미정합"
        : "구현 없음";
  const inner = (
    <span
      title={tooltip}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 6px",
        borderRadius: 4,
        background: s.bg,
        color: s.fg,
        fontWeight: 600,
        fontSize: 11,
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1.4,
        minWidth: 28,
        justifyContent: "center",
      }}
    >
      {s.glyph} {label}
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

function CategoryChip({ category }: { category: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px 7px",
        borderRadius: 999,
        background: "#1d2230",
        color: colors.textSub,
        fontSize: 10.5,
        letterSpacing: 0.2,
      }}
    >
      {category}
    </span>
  );
}

/* ─── 메인 보드 ─── */
function CoverageBoard() {
  type FilterMode = "all" | "synced" | "gaps";
  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");

  const tdsComponents = tdsData.components as TdsComponent[];

  const filteredTds = useMemo(() => {
    return tdsComponents.filter((c) => {
      if (filter === "synced" && brandFigmaCount(c) === 0) return false;
      if (filter === "gaps" && c.nds !== null) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!c.tds.toLowerCase().includes(s) && !(c.nds ?? "").toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [filter, search, tdsComponents]);

  const byCategory = useMemo(() => {
    const groups: Record<string, TdsComponent[]> = {};
    for (const c of filteredTds) {
      const key = c.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    }
    return groups;
  }, [filteredTds]);

  /* ─── 통계 — coverage-logic.summarize 가 SSOT. docs 생성기와 동일 계산
   *   (brandChrome 행 = 어느 브랜드든 chrome 폴더에 있으면 React 커버 → 46). ─── */
  const { total, mapped, gaps, reactCovered, htmlCovered, figmaPerBrand } = summarize(
    tdsComponents,
    MANIFEST,
  );

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        padding: 24,
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* 헤더 */}
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Brand × Component Coverage</h1>
        <p style={{ margin: "6px 0 0", color: colors.textSub, fontSize: 13, lineHeight: 1.6 }}>
          NDS 가 결국 갖춰야 할 목표 컴포넌트 리스트를 기준으로, 5개 브랜드 × 2개
          패키지(@nudge-design/react, @nudge-design/html) 구현 현황을 보여줍니다.{" "}
          <strong style={{ color: colors.text }}>● 초록</strong> = 코드 + 이 브랜드 Figma 가이드 둘
          다 ✓.
          <strong style={{ color: colors.text }}> ○ 노랑</strong> = 코드 있음, 브랜드 Figma 가이드
          미정합.
          <strong style={{ color: colors.text }}> — 회색</strong> = 코드 없음.
        </p>
      </header>

      {/* 통계 카드 */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {[
          { label: "목표 컴포넌트", value: `${total}`, hint: "행 수" },
          { label: "NDS 매핑됨", value: `${mapped} / ${total}`, hint: "대응 컴포넌트 존재" },
          { label: "NDS 미구현", value: `${gaps}`, hint: "목표 컴포넌트 gap" },
          { label: "React 커버", value: `${reactCovered} / ${total}`, hint: "@nudge-design/react" },
          { label: "HTML 커버", value: `${htmlCovered} / ${total}`, hint: "@nudge-design/html" },
          ...BRANDS.map((b) => ({
            label: `Figma — ${BRAND_LABEL[b]}`,
            value: `${figmaPerBrand[b]} / ${total}`,
            hint: "브랜드별 가이드 정합",
          })),
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <div style={{ fontSize: 11, color: colors.textSub, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10.5, color: colors.textSub, marginTop: 2 }}>{s.hint}</div>
          </div>
        ))}
      </section>

      {/* 필터 */}
      <section
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          { id: "all" as const, label: "전체" },
          { id: "synced" as const, label: "Figma 정합 1개+ 브랜드" },
          { id: "gaps" as const, label: "NDS 미구현" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            style={{
              background: filter === f.id ? colors.brand : "transparent",
              color: filter === f.id ? "#fff" : colors.textSub,
              border: `1px solid ${filter === f.id ? colors.brand : colors.border}`,
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {f.label}
          </button>
        ))}
        <input
          type="search"
          placeholder="목표 / NDS 컴포넌트명으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            padding: "5px 10px",
            color: colors.text,
            fontSize: 12,
            flex: "1 1 240px",
            maxWidth: 360,
          }}
        />
        <span style={{ color: colors.textSub, fontSize: 11 }}>{filteredTds.length} 개 표시 중</span>
      </section>

      {/* 메인 매트릭스 */}
      <section>
        <div style={{ overflowX: "auto", border: `1px solid ${colors.border}`, borderRadius: 8 }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1100 }}
          >
            <thead>
              <tr>
                <th style={{ ...headerStyle, textAlign: "left", minWidth: 180 }}>목표 컴포넌트</th>
                <th style={{ ...headerStyle, textAlign: "left", minWidth: 160 }}>NDS 대응</th>
                {BRANDS.map((b) => (
                  <th key={b} style={{ ...headerStyle, textAlign: "center", minWidth: 130 }}>
                    {BRAND_LABEL[b]}
                    <div
                      style={{ fontSize: 10, fontWeight: 500, color: colors.textSub, marginTop: 2 }}
                    >
                      React · HTML
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(byCategory).map(([category, items]) => (
                <React.Fragment key={category}>
                  <tr>
                    <td
                      colSpan={2 + BRANDS.length}
                      style={{
                        ...cellStyle,
                        background: "#101218",
                        color: colors.textSub,
                        fontWeight: 600,
                        fontSize: 11,
                        letterSpacing: 0.4,
                        textTransform: "uppercase",
                      }}
                    >
                      {(tdsData.categories as Record<string, string>)[category] ?? category}
                    </td>
                  </tr>
                  {items.map((c) => {
                    const inventoryEntry = c.nds ? invByName[c.nds] : undefined;
                    return (
                      <tr key={c.tds}>
                        <td style={{ ...cellStyle, textAlign: "left" }}>
                          <a
                            href={c.docsUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: colors.text, fontWeight: 600, textDecoration: "none" }}
                          >
                            {c.tds}
                          </a>
                          <div
                            style={{ marginTop: 3, display: "flex", gap: 4, alignItems: "center" }}
                          >
                            {c.platforms.map((p) => (
                              <span
                                key={p}
                                style={{
                                  fontSize: 9.5,
                                  padding: "1px 5px",
                                  borderRadius: 3,
                                  background: p === "mobile" ? "#1a1f2c" : "#2a1a2c",
                                  color: colors.textSub,
                                  textTransform: "uppercase",
                                }}
                              >
                                {p === "mobile" ? "web" : "rn"}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ ...cellStyle, textAlign: "left" }}>
                          {c.nds ? (
                            <>
                              <span style={{ color: colors.text, fontWeight: 500 }}>{c.nds}</span>
                              {inventoryEntry?.category && (
                                <span style={{ marginLeft: 6 }}>
                                  <CategoryChip category={inventoryEntry.category} />
                                </span>
                              )}
                              {c.ndsNote && (
                                <div
                                  style={{
                                    marginTop: 3,
                                    fontSize: 11,
                                    color: colors.textSub,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {c.ndsNote}
                                </div>
                              )}
                            </>
                          ) : (
                            <span style={{ color: colors.missing, fontStyle: "italic" }}>
                              미매핑
                              {c.ndsNote && (
                                <div
                                  style={{
                                    marginTop: 3,
                                    fontSize: 11,
                                    color: colors.textSub,
                                    lineHeight: 1.4,
                                    fontStyle: "normal",
                                  }}
                                >
                                  {c.ndsNote}
                                </div>
                              )}
                            </span>
                          )}
                        </td>
                        {BRANDS.map((b) => {
                          const r = reactStatus(c, b, MANIFEST);
                          const h = htmlStatus(c, b, MANIFEST);
                          const figmaHref = c.figmaByBrand?.[b];
                          return (
                            <td key={b} style={{ ...cellStyle, textAlign: "center" }}>
                              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                                <StatusBadge status={r} label="R" href={figmaHref} />
                                <StatusBadge status={h} label="H" href={figmaHref} />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 브랜드 chrome 매트릭스 */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
          브랜드 chrome (header / footer / nav){" "}
          <span style={{ color: colors.textSub, fontWeight: 400, fontSize: 13 }}>
            — 목표 컴포넌트 Navbar 와 별개로 브랜드별 chrome 실구현 매트릭스
          </span>
        </h2>
        <p style={{ margin: "0 0 12px", color: colors.textSub, fontSize: 12, lineHeight: 1.5 }}>
          나머지 컴포넌트는 5개 브랜드 모두 토큰 오버라이드만으로 동일하게 동작합니다. 여기는{" "}
          <code style={{ color: colors.brand }}>packages/react/src/{`{brand}`}</code> 폴더 기준으로
          실제 브랜드 fork 가 있는 chrome 컴포넌트만 나열합니다.
        </p>
        <div style={{ overflowX: "auto", border: `1px solid ${colors.border}`, borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 720 }}>
            <thead>
              <tr>
                <th style={{ ...headerStyle, textAlign: "left" }}>Chrome 컴포넌트</th>
                {BRANDS.map((b) => (
                  <th key={b} style={{ ...headerStyle, textAlign: "center", minWidth: 110 }}>
                    {BRAND_LABEL[b]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const chromeNames = new Set<string>();
                for (const b of BRANDS) for (const n of BRAND_CHROME[b]) chromeNames.add(n);
                return Array.from(chromeNames)
                  .sort()
                  .map((name) => (
                    <tr key={name}>
                      <td
                        style={{
                          ...cellStyle,
                          textAlign: "left",
                          color: colors.text,
                          fontWeight: 500,
                        }}
                      >
                        {name}
                      </td>
                      {BRANDS.map((b) => (
                        <td key={b} style={{ ...cellStyle, textAlign: "center" }}>
                          {BRAND_CHROME[b].has(name) ? (
                            <span style={{ color: colors.synced, fontSize: 14 }}>●</span>
                          ) : (
                            <span style={{ color: colors.missing }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      </section>

      <footer style={{ marginTop: 32, color: colors.textSub, fontSize: 11, lineHeight: 1.6 }}>
        <div>
          데이터 출처: <code style={{ color: colors.brand }}>metadata/tdsComponents.json</code>{" "}
          (목표 컴포넌트 + 브랜드별 <code>figmaByBrand</code>) ·{" "}
          <code style={{ color: colors.brand }}>packages/{`{react,html}`}/src/index.ts</code>
        </div>
        <div style={{ marginTop: 4 }}>
          브랜드 Figma 가이드가 새로 정해지면{" "}
          <code style={{ color: colors.brand }}>figmaByBrand[brand]</code> 슬롯에 URL 을 추가하세요.
          docs 페이지:{" "}
          <code style={{ color: colors.brand }}>docs/components/brand-coverage.mdx</code> (
          <code>pnpm generate:brand-coverage</code> 로 재생성).
        </div>
      </footer>
    </div>
  );
}

const meta: Meta<typeof CoverageBoard> = {
  title: "Coverage/Brand × Component (목표)",
  component: CoverageBoard,
  parameters: {
    layout: "fullscreen",
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof CoverageBoard>;

export const Coverage: Story = {};
