import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "@nudge-design/icons";

/**
 * Brands/Runmile/Icons — Runmile 브랜드 전용 아이콘 카탈로그.
 *
 * 자동 추출: `@nudge-design/icons` 에서 `Runmile` prefix 로 시작하는 컴포넌트만 필터.
 * Figma 런마일 library (file `udH9ME1HnHk4kbxR17Neig`) Icon 페이지(20:94) 의 base 심볼을
 * SSOT 로 받아 packages/icons/svg/{mono,multicolor}/runmile-*.svg 에 정규화 (24×24 viewBox).
 *
 * 정책:
 *   - 브랜드 모드(brand='runmile') 작업 시 공용 아이콘보다 우선 사용.
 *   - 공통 컴포넌트(BottomNav 등) 의 구현에는 brand 분기 박지 말고, 브랜드 전용 화면이
 *     명시적으로 import 해 icon prop 으로 전달.
 *
 * 시멘틱 컬러 슬롯 (Figma 가이드 명시):
 *   - black     → `--semantic-icon-strong-default` (#221E1F)
 *   - white     → `--semantic-icon-inverse-default`
 *   - gray600   → `--semantic-icon-muted-default`  (#919CAA, BottomNav inactive)
 *   - gray800   → `--semantic-icon-normal-default` (#4E5968)
 *   - orange500 → `--semantic-icon-brand-default`  (#FF5B37)
 */

type IconComp = React.FC<{ size?: number; color?: string }>;

const RUNMILE_ICONS: { name: string; Component: IconComp }[] = Object.entries(Icons)
  .filter(([name]) => name.startsWith("Runmile") && name.endsWith("Icon"))
  .map(([name, Component]) => ({ name, Component: Component as IconComp }))
  .sort((a, b) => a.name.localeCompare(b.name));

const meta: Meta = {
  title: "Brands/Runmile/Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**Runmile 브랜드 아이콘 ${RUNMILE_ICONS.length}종.**`,
          "",
          "Figma 런마일 library Icon 페이지(20:94)의 base 심볼을 1:1 정규화 (24×24 viewBox + currentColor).",
          "디자인 가이드의 5 컬러 슬롯(black/white/gray600/gray800/orange500)은 시멘틱 토큰",
          "(`--semantic-icon-{strong,inverse,muted,normal,brand}-default`)으로 매핑되어",
          "color prop / 부모 cascade 로 자동 적용.",
          "",
          "사용 예: `<RunmileHomeIcon size={24} />` — color 는 부모(예: BottomNav nav-item) cascade 따라감.",
          "",
          "Active/Inactive 페어 컨벤션: `RunmileHomeIcon`(outline) / `RunmileHomeActiveIcon`(filled).",
          "BottomNav 4탭 외에도 calendar, shoe, user, bookmark, alram, chatting, setting,",
          "information, people, camera, trash, pen, questionmark, home(classic) 등 stroke/fill 페어 제공.",
          "",
          "Multicolor (icon/*/color): RunmileFireColor / RunmileCircleCheckColor / RunmileCautionColor /",
          "RunmileConfettiColor — 디자인 가이드의 색 그대로 보존, 변경 안 됨.",
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
        border: "1px solid var(--semantic-border-normal-default, #E5E8EB)",
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
          color: "var(--semantic-text-subtle-default, #4E5968)",
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
            background: "#221E1F",
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
    if (!q) return RUNMILE_ICONS;
    return RUNMILE_ICONS.filter((e) => e.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--semantic-gap-comfortable)",
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름으로 검색 (예: arrow, calendar, shoe, confetti)"
          style={{
            flex: 1,
            height: 40,
            padding: "0 var(--semantic-inset-input)",
            border: "1px solid var(--semantic-border-normal-default, #D1D6DB)",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--semantic-text-subtle-default, #6B7684)" }}>
          {filtered.length} / {RUNMILE_ICONS.length}
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
  name: "전체 (strong / black)",
  globals: { brand: "runmile" },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-icon-strong-default, #221E1F)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const Muted: Story = {
  name: "Muted (gray600 — BottomNav inactive)",
  globals: { brand: "runmile" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma 가이드의 `color=gray600` 슬롯 (`--semantic-icon-muted-default`, #919CAA). BottomNav inactive · secondary 아이콘 톤.",
      },
    },
  },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-icon-muted-default, #919CAA)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const BrandTint: Story = {
  name: "Brand (orange500)",
  globals: { brand: "runmile" },
  parameters: {
    docs: {
      description: {
        story: "Runmile brand color (`--semantic-icon-brand-default`, #FF5B37) 로 렌더링.",
      },
    },
  },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-icon-brand-default, #FF5B37)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const Size20: Story = {
  name: "Size 20 (Button 내부)",
  globals: { brand: "runmile" },
  render: () => (
    <Grid
      size={20}
      color="var(--semantic-icon-strong-default, #221E1F)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const OnDarkSurface: Story = {
  name: "다크 배경 (inverse)",
  globals: { brand: "runmile" },
  render: () => (
    <Grid
      size={24}
      color="var(--semantic-icon-inverse-default, #FFFFFF)"
      bg="var(--semantic-bg-inverse-default, #221E1F)"
    />
  ),
};
