import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

/* ─── 컴포넌트 상태 데이터 ─── */

type Status = "stable" | "beta" | "planned" | "missing";

interface ComponentEntry {
  name: string;
  category: string;
  status: Status;
  description: string;
  hasStory: boolean;
  /** 브랜드별 토큰 오버라이드 존재 여부 */
  brands: { "nudge-eap": boolean; trost: boolean; geniet: boolean; cashpobi: boolean };
}

const components: ComponentEntry[] = [
  // ── 일반 ──
  {
    name: "Button",
    category: "일반",
    status: "stable",
    description: "CTA, 액션 버튼",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: true, cashpobi: false },
  },
  {
    name: "Badge",
    category: "일반",
    status: "stable",
    description: "상태/카테고리 라벨",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: true, cashpobi: false },
  },
  {
    name: "Chip",
    category: "일반",
    status: "stable",
    description: "필터, 태그 선택",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: false, cashpobi: false },
  },
  {
    name: "Card",
    category: "일반",
    status: "stable",
    description: "콘텐츠 카드 (Compound)",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: true, cashpobi: false },
  },
  {
    name: "Avatar",
    category: "일반",
    status: "stable",
    description: "프로필 이미지/이니셜",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Divider",
    category: "일반",
    status: "stable",
    description: "구분선",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Banner",
    category: "일반",
    status: "stable",
    description: "알림/공지 배너",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: true, cashpobi: false },
  },
  {
    name: "Skeleton",
    category: "일반",
    status: "stable",
    description: "로딩 플레이스홀더",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "DSHighlight",
    category: "일반",
    status: "beta",
    description: "DS 강조 유틸",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },

  // ── 입력 ──
  {
    name: "Input",
    category: "입력",
    status: "stable",
    description: "텍스트 입력 필드",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: true, cashpobi: false },
  },
  {
    name: "SearchInput",
    category: "입력",
    status: "stable",
    description: "검색 입력 (Compound)",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Select",
    category: "입력",
    status: "stable",
    description: "드롭다운 선택",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Checkbox",
    category: "입력",
    status: "stable",
    description: "체크박스",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Toggle",
    category: "입력",
    status: "stable",
    description: "온/오프 토글",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: false, cashpobi: false },
  },
  {
    name: "FieldActionRow",
    category: "입력",
    status: "stable",
    description: "필드+액션 행",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },

  // ── 네비게이션 ──
  {
    name: "Tabs",
    category: "네비게이션",
    status: "stable",
    description: "탭 전환 (line/pill/square)",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Pagination",
    category: "네비게이션",
    status: "stable",
    description: "페이지 네비게이션",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Breadcrumb",
    category: "네비게이션",
    status: "stable",
    description: "경로 표시",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },

  // ── 레이아웃 ──
  {
    name: "AppBar",
    category: "레이아웃",
    status: "stable",
    description: "헤더 (Compound, 1단/2단)",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: true, cashpobi: false },
  },
  {
    name: "AppFooter",
    category: "레이아웃",
    status: "stable",
    description: "푸터 (Info/TabBar)",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: true, cashpobi: false },
  },
  {
    name: "TrendingKeywords",
    category: "레이아웃",
    status: "stable",
    description: "인기 검색어",
    hasStory: true,
    brands: { "nudge-eap": false, trost: true, geniet: false, cashpobi: false },
  },

  // ── 피드백 ──
  {
    name: "Modal",
    category: "피드백",
    status: "stable",
    description: "모달 다이얼로그",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: false, cashpobi: false },
  },
  {
    name: "BottomSheet",
    category: "피드백",
    status: "stable",
    description: "하단 시트",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: false, cashpobi: false },
  },
  {
    name: "Popup",
    category: "피드백",
    status: "stable",
    description: "확인/취소 팝업",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "Toast",
    category: "피드백",
    status: "stable",
    description: "토스트 알림",
    hasStory: true,
    brands: { "nudge-eap": true, trost: true, geniet: false, cashpobi: false },
  },
  {
    name: "EmptyState",
    category: "피드백",
    status: "stable",
    description: "빈 상태 안내",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "ProgressBar",
    category: "피드백",
    status: "stable",
    description: "진행률 표시",
    hasStory: true,
    brands: { "nudge-eap": true, trost: false, geniet: false, cashpobi: false },
  },

  // ── 계획/미구현 ──
  {
    name: "Accordion",
    category: "일반",
    status: "planned",
    description: "접기/펼치기 (FAQ 등)",
    hasStory: false,
    brands: { "nudge-eap": false, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "StarRating",
    category: "입력",
    status: "planned",
    description: "별점 입력/표시",
    hasStory: false,
    brands: { "nudge-eap": false, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "StickyBottomBar",
    category: "레이아웃",
    status: "planned",
    description: "하단 고정 CTA 바",
    hasStory: false,
    brands: { "nudge-eap": false, trost: false, geniet: false, cashpobi: false },
  },
  {
    name: "ImageUpload",
    category: "입력",
    status: "stable",
    description: "150×150 preview + 업로드 버튼 + 사이즈 안내 (캐포비 admin 표준)",
    hasStory: true,
    brands: { "nudge-eap": false, trost: false, geniet: false, cashpobi: true },
  },
  {
    name: "ActionChip",
    category: "입력",
    status: "stable",
    description: "TextField helper 옆 보조 액션 chip (예시/수정/다운로드)",
    hasStory: true,
    brands: { "nudge-eap": false, trost: false, geniet: false, cashpobi: true },
  },
];

/* ─── 스타일 상수 ─── */

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  stable: { label: "안정", color: "#00BC78", bg: "#E5F7F4" },
  beta: { label: "베타", color: "#4968FF", bg: "#EDF0FF" },
  planned: { label: "계획", color: "#FFA100", bg: "#FFFAE8" },
  missing: { label: "미구현", color: "#FF4111", bg: "#FEE9E6" },
};

/* ─── 보드 컴포넌트 ─── */

function ComponentStatusBoard() {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [search, setSearch] = useState("");

  const filtered = components.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.description.includes(search)
    )
      return false;
    return true;
  });

  const byCategory = filtered.reduce<Record<string, ComponentEntry[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  const total = components.length;
  const stableCount = components.filter((c) => c.status === "stable").length;
  const betaCount = components.filter((c) => c.status === "beta").length;
  const plannedCount = components.filter((c) => c.status === "planned").length;
  const trostCoverage = components.filter((c) => c.brands.trost).length;
  const genietCoverage = components.filter((c) => c.brands.geniet).length;

  return (
    <div
      style={{
        fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
        maxWidth: 960,
        margin: "0 auto",
        padding: 32,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#333", margin: "0 0 8px" }}>
        컴포넌트 상태 보드
      </h1>
      <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>
        NudgeEAP Design System 전체 컴포넌트 현황
      </p>

      {/* 요약 카드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--gap-comfortable)",
          marginBottom: 28,
        }}
      >
        {[
          { label: "전체", value: total, color: "#333", bg: "#F4F5F7" },
          { label: "안정", value: stableCount, color: "#00BC78", bg: "#E5F7F4" },
          { label: "베타", value: betaCount, color: "#4968FF", bg: "#EDF0FF" },
          { label: "계획", value: plannedCount, color: "#FFA100", bg: "#FFFAE8" },
          { label: "Trost 커버", value: `${trostCoverage}/${total}`, color: "#333", bg: "#FFFCE6" },
          {
            label: "Geniet 커버",
            value: `${genietCoverage}/${total}`,
            color: "#333",
            bg: "#ECF8F9",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: 12,
              padding: "var(--inset-card) 18px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 필터 + 검색 */}
      <div
        style={{
          display: "flex",
          gap: "var(--gap-default)",
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {(["all", "stable", "beta", "planned"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: filter === f ? 700 : 500,
              border: filter === f ? "1.5px solid #333" : "1px solid #E5E5E5",
              background: filter === f ? "#F4F5F7" : "#fff",
              color: "#333",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {f === "all" ? "전체" : statusConfig[f].label}
          </button>
        ))}
        <input
          type="text"
          placeholder="컴포넌트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 150,
            padding: "6px var(--inset-input)",
            border: "1px solid #E5E5E5",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* 카테고리별 테이블 */}
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#333",
              margin: "0 0 12px",
              paddingBottom: 8,
              borderBottom: "2px solid #333",
            }}
          >
            {category}{" "}
            <span style={{ fontWeight: 400, color: "#999", fontSize: 13 }}>{items.length}개</span>
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                <th
                  style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#666" }}
                >
                  컴포넌트
                </th>
                <th
                  style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#666" }}
                >
                  상태
                </th>
                <th
                  style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#666" }}
                >
                  설명
                </th>
                <th
                  style={{
                    padding: "var(--inset-chip) var(--inset-input)",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#666",
                  }}
                >
                  EAP
                </th>
                <th
                  style={{
                    padding: "var(--inset-chip) var(--inset-input)",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#666",
                  }}
                >
                  Trost
                </th>
                <th
                  style={{
                    padding: "var(--inset-chip) var(--inset-input)",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#666",
                  }}
                >
                  Geniet
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => {
                const st = statusConfig[c.status];
                return (
                  <tr key={c.name} style={{ borderBottom: "1px solid #F0F0F0" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#333" }}>
                      {c.name}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: st.color,
                          background: st.bg,
                          padding: "2px var(--inset-chip)",
                          borderRadius: 4,
                        }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#666" }}>{c.description}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center" }}>
                      {c.brands["nudge-eap"] ? "✅" : "—"}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center" }}>
                      {c.brands.trost ? "✅" : "—"}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center" }}>
                      {c.brands.geniet ? "✅" : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ─── Story ─── */

const meta: Meta = {
  title: "Overview/ComponentStatus",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;
export const Default: Story = {
  render: () => <ComponentStatusBoard />,
};
