import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "@nudge-eap/icons";

const ICON_ENTRIES: Array<{
  name: string;
  Component: React.FC<{ size?: number; color?: string }>;
}> = Object.entries(Icons)
  .filter(([name]) => name.endsWith("Icon"))
  .map(([name, Component]) => ({
    name,
    Component: Component as React.FC<{ size?: number; color?: string }>,
  }));

const meta: Meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "> ✅ **Figma Iconography(379:490) 정합 완료** — 모든 아이콘은 24×24 viewBox / currentColor 규약으로 통일되어 있습니다.",
          "",
          `총 **${ICON_ENTRIES.length}개** 아이콘. 클릭하면 컴포넌트 이름이 클립보드에 복사됩니다.`,
          "",
          "브랜드별 아이콘은 prefix 로 구분됩니다 — prefix 없는 base 셋은 **NudgeEAP**, `Cashpobi*` / `Geniet*` / `Trost*` 는 각 브랜드 전용, `Mockup*` (Bold/Linear) 는 mockup 전용 IconSax 셋입니다.",
          "",
          "패키지: `@nudge-eap/icons` · 카테고리·사용 가이드는 [Docs · Icons](/components/icons)를 참고하세요.",
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
  Component: React.FC<{ size?: number; color?: string }>;
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
        border: "1px solid #ECECEC",
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
          color: "#555",
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

type BrandFilter = "all" | "nudge-eap" | "cashpobi" | "geniet" | "trost" | "mockup";

// 컴포넌트 이름 prefix → 어느 브랜드 그룹에 속하는지.
// 'nudge-eap' 은 prefix 가 없는 base DS 아이콘 (NudgeEAP brand 의 default set).
// 'mockup' 은 MockupBold / MockupLinear 등 Mockup* prefix 전체 (IconSax 셋).
function brandOf(componentName: string): Exclude<BrandFilter, "all"> {
  if (componentName.startsWith("Cashpobi")) return "cashpobi";
  if (componentName.startsWith("Geniet")) return "geniet";
  if (componentName.startsWith("Trost")) return "trost";
  if (componentName.startsWith("Mockup")) return "mockup";
  return "nudge-eap";
}

function Catalog({ size, color, bg }: { size: number; color: string; bg: string }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<BrandFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ICON_ENTRIES.filter((entry) => {
      if (brand !== "all" && brandOf(entry.name) !== brand) return false;
      if (!q) return true;
      return entry.name.toLowerCase().includes(q);
    });
  }, [query, brand]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-comfortable)" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="아이콘 이름으로 검색 (예: search, arrow, home)"
          style={{
            flex: 1,
            height: 40,
            padding: "0 var(--inset-input)",
            border: "1px solid #D8D8D8",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <span style={{ fontSize: 12, color: "#888" }}>
          {filtered.length} / {ICON_ENTRIES.length}
        </span>
      </div>
      <BrandChips value={brand} onChange={setBrand} entries={ICON_ENTRIES} />
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

function BrandChips({
  value,
  onChange,
  entries,
}: {
  value: BrandFilter;
  onChange: (v: BrandFilter) => void;
  entries: typeof ICON_ENTRIES;
}) {
  // 각 그룹별 카운트 — 활성 칩에 작게 표시.
  const counts = useMemo(() => {
    const c: Record<BrandFilter, number> = {
      all: entries.length,
      "nudge-eap": 0,
      cashpobi: 0,
      geniet: 0,
      trost: 0,
      mockup: 0,
    };
    for (const e of entries) c[brandOf(e.name)]++;
    return c;
  }, [entries]);

  const options: { v: BrandFilter; label: string }[] = [
    { v: "all", label: "All" },
    { v: "nudge-eap", label: "NudgeEAP" },
    { v: "cashpobi", label: "Cashpobi" },
    { v: "geniet", label: "Geniet" },
    { v: "trost", label: "Trost" },
    { v: "mockup", label: "Mockup (IconSax)" },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            style={{
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 999,
              border: "1px solid #D8D8D8",
              background: active ? "#111111" : "#FFFFFF",
              color: active ? "#FFFFFF" : "#333",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {o.label}
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                opacity: 0.75,
              }}
            >
              {counts[o.v]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export const All: Story = {
  name: "Catalog/All Icons",
  render: () => (
    <Catalog size={24} color="var(--semantic-icon-strong-default, #111111)" bg="#FFFFFF" />
  ),
};

export const Size20: Story = {
  name: "Catalog/Size 20 (Button)",
  parameters: {
    docs: {
      description: {
        story: "버튼(xl/lg/md/sm/field) 내부 아이콘 사이즈인 20px로 렌더링한 카탈로그.",
      },
    },
  },
  render: () => (
    <Catalog size={20} color="var(--semantic-icon-strong-default, #111111)" bg="#FFFFFF" />
  ),
};

export const OnDarkSurface: Story = {
  name: "Catalog/On Dark Surface",
  parameters: {
    docs: {
      description: {
        story:
          "어두운 배경에서 `currentColor` 흰색으로 렌더링. AppBar 등 다크 헤더 컨텍스트 검증용.",
      },
    },
  },
  render: () => <Catalog size={24} color="#FFFFFF" bg="#1F1F1F" />,
};

export const UsageExamples: Story = {
  name: "Usage/Examples",
  parameters: {
    docs: {
      description: {
        story:
          "currentColor 상속, size prop, aria 처리 같은 자주 쓰는 패턴 예시. 잘못된 사용은 빨간 배지로 표시됩니다.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
      <Block
        title="✓ currentColor 상속 (권장)"
        code={`<span style={{ color: "var(--nds-text-default)" }}>\n  <SearchIcon /> 검색\n</span>`}
      >
        <span
          style={{
            color: "#2B96ED",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
          }}
        >
          <Icons.SearchIcon size={20} /> 검색
        </span>
      </Block>

      <Block
        title="✓ Button 내부 — leftIcon/rightIcon"
        code={`<Button leftIcon={<SearchIcon />}>검색</Button>`}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--gap-default)",
            height: 48,
            padding: "0 var(--inset-card)",
            borderRadius: 8,
            background: "#2B96ED",
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          <Icons.SearchIcon size={20} /> 검색
        </span>
      </Block>

      <Block
        title="✓ 아이콘만 있는 버튼 — aria-label 필수"
        code={`<button aria-label="검색"><SearchIcon /></button>`}
      >
        <button
          aria-label="검색"
          style={{
            width: 40,
            height: 40,
            border: "1px solid #D8D8D8",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#111111",
          }}
        >
          <Icons.SearchIcon size={20} />
        </button>
      </Block>

      <Block title="✗ Hex 직접 지정 — 토큰 우회" bad code={`<SearchIcon color="#111111" />`}>
        <span style={{ display: "inline-flex" }}>
          <Icons.SearchIcon size={20} color="#111111" />
        </span>
      </Block>
    </div>
  ),
};

function Block({
  title,
  code,
  bad,
  children,
}: {
  title: string;
  code: string;
  bad?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${bad ? "#F4C8B8" : "#D6E4F0"}`,
        borderRadius: 8,
        padding: "var(--inset-card)",
        background: bad ? "#FFF7F4" : "#F8FBFE",
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          fontWeight: 700,
          fontSize: 13,
          color: bad ? "#B23A1A" : "#1D5BA0",
        }}
      >
        {title}
      </p>
      <div style={{ marginBottom: 12 }}>{children}</div>
      <pre
        style={{
          margin: 0,
          padding: "var(--inset-input)",
          background: "#0F1B2C",
          color: "#E6EEF8",
          borderRadius: 6,
          fontSize: 12,
          lineHeight: 1.5,
          overflowX: "auto",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
        }}
      >
        {code}
      </pre>
    </div>
  );
}
