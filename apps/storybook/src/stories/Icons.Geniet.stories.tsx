import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "@nudge-design/icons";

/**
 * Brands/Geniet/Icons — Geniet 브랜드 전용 아이콘 카탈로그.
 *
 * 자동 추출: `@nudge-design/icons` 에서 `Geniet` prefix 로 시작하는 컴포넌트만 필터.
 * 새 GenietXxxIcon 이 추가되면 빌드 시 자동 반영.
 *
 * 정책 (MCP get_brand_info("geniet").iconPolicy 와 동일):
 *   - 브랜드 모드(brand='geniet') 작업 시 공용 아이콘보다 우선 사용.
 *   - 공통 컴포넌트(AppFooter/BottomNav 등) 의 구현에는 brand 분기 박지 말고,
 *     브랜드 전용 화면이 명시적으로 import 해 icon prop 으로 전달.
 */

type IconComp = React.FC<{ size?: number; color?: string }>;

const GENIET_ICONS: { name: string; Component: IconComp }[] = Object.entries(Icons)
  .filter(([name]) => name.startsWith("Geniet") && name.endsWith("Icon"))
  .map(([name, Component]) => ({ name, Component: Component as IconComp }))
  .sort((a, b) => a.name.localeCompare(b.name));

const meta: Meta = {
  title: "Brands/Geniet/Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**Geniet 브랜드 전용 아이콘 ${GENIET_ICONS.length}종.**`,
          "",
          "공용 아이콘(`HomeIcon`/`CouponIcon` 등) 과 별개로 Geniet 디자인 그대로 가져온 변종입니다.",
          "브랜드 모드(brand='geniet')에서 같은 의미의 prefix 아이콘이 있으면 **반드시 이쪽을 우선** 사용.",
          "",
          "사용 예: `<GenietRecordIcon size={24} />` — color 는 부모(예: AppFooter nav-item) 의 cascade 따라감.",
          "",
          "공통 컴포넌트(AppFooter/BottomNav) 안에 `if (brand === 'geniet')` 분기를 박지 않습니다.",
          "사용처(Brands/Geniet/AppFooter 스토리 같은 곳)에서 명시적으로 import 해 icon prop 으로 전달.",
        ].join("\n"),
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

function IconCard({
  name,
  Component,
  size,
  color,
  bg,
}: {
  name: string;
  Component: IconComp;
  size: number;
  color: string;
  bg: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        copyToClipboard(name);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--gap-default)",
        padding: "var(--inset-card) var(--inset-chip)",
        border: "1px solid var(--semantic-border-normal-default, #ECECEC)",
        borderRadius: 8,
        background: bg,
        cursor: "pointer",
        font: "inherit",
        position: "relative",
      }}
      title={`Click to copy: ${name}`}
    >
      <span style={{ color, display: "inline-flex" }}>
        <Component size={size} />
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--semantic-text-subtle-default, #555)",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          textAlign: "center",
          wordBreak: "break-all",
          lineHeight: 1.4,
        }}
      >
        {name}
      </span>
      {copied && (
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            fontSize: 10,
            background: "#111",
            color: "#fff",
            borderRadius: 4,
            padding: "2px 6px",
          }}
        >
          copied
        </span>
      )}
    </button>
  );
}

function Grid({ size, color, bg }: { size: number; color: string; bg: string }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GENIET_ICONS;
    return GENIET_ICONS.filter((e) => e.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-comfortable)" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름으로 검색 (예: arrow, record, gpoint)"
          style={{
            flex: 1,
            height: 40,
            padding: "0 var(--inset-input)",
            border: "1px solid var(--semantic-border-normal-default, #D8D8D8)",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--semantic-text-subtle-default, #888)" }}>
          {filtered.length} / {GENIET_ICONS.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "var(--gap-comfortable)",
        }}
      >
        {filtered.map(({ name, Component }) => (
          <IconCard
            key={name}
            name={name}
            Component={Component}
            size={size}
            color={color}
            bg={bg}
          />
        ))}
      </div>
    </div>
  );
}

export const All: Story = {
  name: "전체",
  globals: { brand: "geniet" },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-icon-strong-default, #111111)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const BrandTint: Story = {
  name: "Brand 색 (mint)",
  globals: { brand: "geniet" },
  parameters: {
    docs: {
      description: {
        story: "Geniet brand color(`--semantic-icon-brand-default`, #48C2C5) 로 렌더링.",
      },
    },
  },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-icon-brand-default, #48C2C5)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const Size20: Story = {
  name: "Size 20 (Button 내부)",
  globals: { brand: "geniet" },
  render: () => (
    <Grid
      size={20}
      color="var(--semantic-icon-strong-default, #111111)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const OnDarkSurface: Story = {
  name: "다크 배경",
  globals: { brand: "geniet" },
  render: () => <Grid size={24} color="#FFFFFF" bg="#1F1F1F" />,
};
