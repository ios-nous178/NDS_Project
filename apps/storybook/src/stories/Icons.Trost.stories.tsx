import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "@nudge-design/icons";

/**
 * Brands/Trost/Icons — Trost 브랜드 전용 아이콘 카탈로그.
 *
 * 자동 추출: `@nudge-design/icons` 에서 `Trost` prefix 로 시작하는 컴포넌트만 필터.
 * 새 TrostXxxIcon 이 추가되면 빌드 시 자동 반영.
 *
 * 정책 (MCP get_brand_info("trost").iconPolicy 와 동일):
 *   - 브랜드 모드(brand='trost') 작업 시 공용 아이콘보다 우선 사용.
 *   - 공통 컴포넌트(AppFooter/BottomNav 등) 의 구현에는 brand 분기 박지 말고,
 *     브랜드 전용 화면이 명시적으로 import 해 icon prop 으로 전달.
 */

type IconComp = React.FC<{ size?: number; color?: string }>;

const TROST_ICONS: { name: string; Component: IconComp }[] = Object.entries(Icons)
  .filter(([name]) => name.startsWith("Trost") && name.endsWith("Icon"))
  .map(([name, Component]) => ({ name, Component: Component as IconComp }))
  .sort((a, b) => a.name.localeCompare(b.name));

const meta: Meta = {
  title: "Brands/Trost/Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**Trost 브랜드 전용 아이콘 ${TROST_ICONS.length}종.**`,
          "",
          "Trost 홈페이지(public/images)의 mental 카테고리(9) / 검사 결과(3) / SNS 링크·플러스(2) / 마인드키 심볼(1) / 에너지·심리검사(2) 를 24×24, currentColor 로 정규화한 것입니다.",
          "공용 아이콘(`HomeIcon`/`SearchIcon` 등) 과 별개로 Trost 디자인 그대로 가져온 변종입니다.",
          "브랜드 모드(brand='trost')에서 같은 의미의 prefix 아이콘이 있으면 **반드시 이쪽을 우선** 사용.",
          "",
          "사용 예: `<TrostMentalDepressionIcon size={32} color='var(--semantic-icon-strong-default)' />`",
          "",
          "공통 컴포넌트(AppFooter/BottomNav) 안에 `if (brand === 'trost')` 분기를 박지 않습니다.",
          "사용처(Brands/Trost/AppFooter 스토리 같은 곳)에서 명시적으로 import 해 icon prop 으로 전달.",
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
        gap: "var(--semantic-gap-default)",
        padding: "var(--semantic-inset-card) var(--semantic-inset-chip)",
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
    if (!q) return TROST_ICONS;
    return TROST_ICONS.filter((e) => e.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-comfortable)" }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름으로 검색 (예: mental, testresult, link)"
          style={{
            flex: 1,
            height: 40,
            padding: "0 var(--semantic-inset-input)",
            border: "1px solid var(--semantic-border-normal-default, #D8D8D8)",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--semantic-text-subtle-default, #888)" }}>
          {filtered.length} / {TROST_ICONS.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "var(--semantic-gap-comfortable)",
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
  name: "Variant/전체",
  globals: { brand: "trost" },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-icon-strong-default, #333333)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const BrandTint: Story = {
  name: "Variant/Brand 색 (cobalt)",
  globals: { brand: "trost" },
  parameters: {
    docs: {
      description: {
        story:
          "Trost focus·info 컬러(`--semantic-border-focus-default`, #4968FF) 로 렌더링. Trost 브랜드 primary 는 노랑이지만 노란 배경 위 아이콘 가독성 때문에 cobalt 를 brand tint 로 사용.",
      },
    },
  },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-border-focus-default, #4968FF)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const Size32: Story = {
  name: "Variant/Size 32 (mental 카테고리 칩)",
  globals: { brand: "trost" },
  parameters: {
    docs: {
      description: {
        story:
          "Trost 멘탈 카테고리 칩은 32×32 로 사용되는 게 다수 — 본래 원본 viewBox 도 32×32 였음.",
      },
    },
  },
  render: () => (
    <Grid
      size={32}
      color="var(--semantic-icon-strong-default, #333333)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const Size20: Story = {
  name: "Variant/Size 20 (Button 내부)",
  globals: { brand: "trost" },
  render: () => (
    <Grid
      size={20}
      color="var(--semantic-icon-strong-default, #333333)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const OnDarkSurface: Story = {
  name: "Variant/다크 배경",
  globals: { brand: "trost" },
  render: () => <Grid size={24} color="#FFFFFF" bg="#1F1F1F" />,
};
