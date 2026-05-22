import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "@nudge-eap/icons";

/**
 * Brands/Cashpobi/Icons — 캐포비(캐시워크 for Business) 어드민 전용 아이콘 카탈로그.
 *
 * SSOT: Figma 캐포비-Library / IconLibraryGuide (3112:948) · 46 icons / 6 categories.
 *
 * 17개는 공용 아이콘(`ChevronUpIcon`/`CloseIcon`/`SearchIcon` 등) 을 재사용하고,
 * 29개는 캐포비 전용으로 `Cashpobi*Icon` (cashpobi- prefix) 으로 import. 시각적으로
 * 같은 글리프라도 캐포비 가이드에 등재된 셋만 모아 볼 수 있게 카탈로그를 분리한다.
 *
 * 정책 (MCP get_brand_info('cashpobi') 와 동일):
 *   - 브랜드 모드(brand='cashpobi') 작업 시 같은 의미의 `Cashpobi*Icon` 이 있으면 우선 사용.
 *   - 공통 컴포넌트(AppFooter/BottomNav) 안에 brand 분기 박지 말고, 사용처에서 import.
 */

type IconComp = React.FC<{ size?: number; color?: string }>;

interface Entry {
  name: string; // Storybook 표시명 (Figma 카탈로그 라벨)
  componentName: string; // @nudge-eap/icons export 이름
  Component: IconComp;
  category: "Navigation" | "Action" | "Status" | "Social" | "GNB" | "Selection";
  source: "common" | "cashpobi";
}

const ICON_MAP: Array<Omit<Entry, "Component">> = [
  // ─── Navigation (7) — chevron 4 + arrow 3 ─────────────
  { name: "chevron-up", componentName: "ChevronUpIcon", category: "Navigation", source: "common" },
  {
    name: "chevron-down",
    componentName: "ChevronDownIcon",
    category: "Navigation",
    source: "common",
  },
  {
    name: "chevron-left",
    componentName: "ChevronLeftIcon",
    category: "Navigation",
    source: "common",
  },
  {
    name: "chevron-right",
    componentName: "ChevronRightIcon",
    category: "Navigation",
    source: "common",
  },
  {
    name: "arrow-up",
    componentName: "CashpobiArrowUpIcon",
    category: "Navigation",
    source: "cashpobi",
  },
  {
    name: "arrow-down",
    componentName: "CashpobiArrowDownIcon",
    category: "Navigation",
    source: "cashpobi",
  },
  {
    name: "arrow-right",
    componentName: "CashpobiArrowRightIcon",
    category: "Navigation",
    source: "cashpobi",
  },

  // ─── Action (9) ───────────────────────────────────────
  { name: "close", componentName: "CloseIcon", category: "Action", source: "common" },
  { name: "plus", componentName: "PlusIcon", category: "Action", source: "common" },
  { name: "search", componentName: "SearchIcon", category: "Action", source: "common" },
  { name: "delete", componentName: "DeleteIcon", category: "Action", source: "common" },
  { name: "edit", componentName: "EditIcon", category: "Action", source: "common" },
  {
    name: "delete-circle",
    componentName: "CashpobiDeleteCircleIcon",
    category: "Action",
    source: "cashpobi",
  },
  { name: "refresh", componentName: "RefreshIcon", category: "Action", source: "common" },
  { name: "filter", componentName: "FilterIcon", category: "Action", source: "common" },
  {
    name: "search-delete",
    componentName: "CashpobiSearchDeleteIcon",
    category: "Action",
    source: "cashpobi",
  },

  // ─── Status (8) ───────────────────────────────────────
  { name: "info", componentName: "InfoIcon", category: "Status", source: "common" },
  {
    name: "question",
    componentName: "CashpobiQuestionIcon",
    category: "Status",
    source: "cashpobi",
  },
  {
    name: "caution",
    componentName: "CashpobiCautionIcon",
    category: "Status",
    source: "cashpobi",
  },
  { name: "error", componentName: "CashpobiErrorIcon", category: "Status", source: "cashpobi" },
  { name: "check", componentName: "CashpobiCheckIcon", category: "Status", source: "cashpobi" },
  {
    name: "check-circle-on",
    componentName: "CashpobiCheckCircleOnIcon",
    category: "Status",
    source: "cashpobi",
  },
  {
    name: "check-circle-off",
    componentName: "CashpobiCheckCircleOffIcon",
    category: "Status",
    source: "cashpobi",
  },
  { name: "open", componentName: "CashpobiOpenIcon", category: "Status", source: "cashpobi" },

  // ─── Social (8) ───────────────────────────────────────
  { name: "like", componentName: "LikeIcon", category: "Social", source: "common" },
  { name: "comment", componentName: "CommentIcon", category: "Social", source: "common" },
  { name: "share", componentName: "ShareIcon", category: "Social", source: "common" },
  { name: "ripple", componentName: "CashpobiRippleIcon", category: "Social", source: "cashpobi" },
  { name: "bubble", componentName: "CashpobiBubbleIcon", category: "Social", source: "cashpobi" },
  {
    name: "message-quiz",
    componentName: "CashpobiMessageQuizIcon",
    category: "Social",
    source: "cashpobi",
  },
  { name: "banner", componentName: "CashpobiBannerIcon", category: "Social", source: "cashpobi" },
  {
    name: "calendar",
    componentName: "CashpobiCalendarIcon",
    category: "Social",
    source: "cashpobi",
  },

  // ─── GNB (8) ──────────────────────────────────────────
  {
    name: "gnb-banner",
    componentName: "CashpobiGnbBannerIcon",
    category: "GNB",
    source: "cashpobi",
  },
  {
    name: "gnb-channel",
    componentName: "CashpobiGnbChannelIcon",
    category: "GNB",
    source: "cashpobi",
  },
  { name: "gnb-chat", componentName: "CashpobiGnbChatIcon", category: "GNB", source: "cashpobi" },
  { name: "gnb-quiz", componentName: "CashpobiGnbQuizIcon", category: "GNB", source: "cashpobi" },
  {
    name: "gnb-member",
    componentName: "CashpobiGnbMemberIcon",
    category: "GNB",
    source: "cashpobi",
  },
  {
    name: "gnb-setting",
    componentName: "CashpobiGnbSettingIcon",
    category: "GNB",
    source: "cashpobi",
  },
  { name: "gnb-cash", componentName: "CashpobiGnbCashIcon", category: "GNB", source: "cashpobi" },
  { name: "download", componentName: "DownloadIcon", category: "GNB", source: "common" },

  // ─── Selection (6) ────────────────────────────────────
  {
    name: "radio-off",
    componentName: "CashpobiRadioOffIcon",
    category: "Selection",
    source: "cashpobi",
  },
  {
    name: "radio-on",
    componentName: "CashpobiRadioOnIcon",
    category: "Selection",
    source: "cashpobi",
  },
  {
    name: "checkbox-off",
    componentName: "CashpobiCheckboxOffIcon",
    category: "Selection",
    source: "cashpobi",
  },
  {
    name: "checkbox-on",
    componentName: "CashpobiCheckboxOnIcon",
    category: "Selection",
    source: "cashpobi",
  },
  {
    name: "checkbox-error",
    componentName: "CashpobiCheckboxErrorIcon",
    category: "Selection",
    source: "cashpobi",
  },
  {
    name: "checkbox-on-green",
    componentName: "CashpobiCheckboxOnGreenIcon",
    category: "Selection",
    source: "cashpobi",
  },
];

// 미리 모든 컴포넌트 reference 를 resolve. 누락된 export 가 있으면 빌드 시 즉시 에러.
const ENTRIES: Entry[] = ICON_MAP.map(({ componentName, ...rest }) => {
  const Component = (Icons as Record<string, unknown>)[componentName] as IconComp | undefined;
  if (!Component) {
    throw new Error(
      `[Icons.Cashpobi] missing export "${componentName}" in @nudge-eap/icons (icon "${rest.name}"). ` +
        `Run: pnpm --filter @nudge-eap/icons build`,
    );
  }
  return { ...rest, componentName, Component };
});

const CATEGORIES = [
  "Navigation",
  "Action",
  "Status",
  "Social",
  "GNB",
  "Selection",
] as const satisfies ReadonlyArray<Entry["category"]>;

const meta: Meta = {
  title: "Brands/Cashpobi/Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**캐포비 어드민 전용 아이콘 ${ENTRIES.length}종.** Figma 캐포비-Library / IconLibraryGuide (3112:948) SSOT.`,
          "",
          "**source 구분:**",
          `- \`common\` (${ENTRIES.filter((e) => e.source === "common").length}) — 공용 아이콘 재사용 (chevron/close/search 등).`,
          `- \`cashpobi\` (${ENTRIES.filter((e) => e.source === "cashpobi").length}) — 캐포비 전용 글리프 (\`Cashpobi*Icon\` / svg/cashpobi-*.svg).`,
          "",
          "공통 컴포넌트(AppFooter/BottomNav) 안에 `if (brand === 'cashpobi')` 분기를 박지 않습니다.",
          "사용처에서 명시적으로 import 해 icon prop 으로 전달.",
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
  entry,
  size,
  color,
  bg,
}: {
  entry: Entry;
  size: number;
  color: string;
  bg: string;
}) {
  const [copied, setCopied] = useState(false);
  const { name, componentName, Component, source } = entry;
  return (
    <button
      type="button"
      onClick={() => {
        copyToClipboard(componentName);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--gap-default)",
        padding: "var(--inset-card) var(--inset-chip)",
        border: "1px solid var(--semantic-border-normal-default, #EEEEEE)",
        borderRadius: 8,
        background: bg,
        cursor: "pointer",
        font: "inherit",
        position: "relative",
      }}
      title={`Click to copy: ${componentName}`}
    >
      <span style={{ color, display: "inline-flex" }}>
        <Component size={size} />
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--semantic-text-subtle-default, #666)",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          textAlign: "center",
          wordBreak: "break-all",
          lineHeight: 1.4,
        }}
      >
        {name}
      </span>
      <span
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          fontSize: 9,
          fontWeight: 700,
          padding: "1px 5px",
          borderRadius: 3,
          background: source === "cashpobi" ? "#FFD200" : "#EEEEEE",
          color: source === "cashpobi" ? "#000" : "#555",
          letterSpacing: 0.2,
        }}
      >
        {source}
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

type SourceFilter = "all" | "common" | "cashpobi";

function Catalog({ size, color, bg }: { size: number; color: string; bg: string }) {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ENTRIES.filter((e) => {
      if (sourceFilter !== "all" && e.source !== sourceFilter) return false;
      if (!q) return true;
      return e.name.includes(q) || e.componentName.toLowerCase().includes(q);
    });
  }, [query, sourceFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-loose)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-comfortable)" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름으로 검색 (예: gnb, checkbox, arrow)"
          style={{
            flex: 1,
            height: 40,
            padding: "0 var(--inset-input)",
            border: "1px solid var(--semantic-border-normal-default, #EEEEEE)",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <SourceChips value={sourceFilter} onChange={setSourceFilter} />
        <span style={{ fontSize: 12, color: "var(--semantic-text-subtle-default, #666)" }}>
          {filtered.length} / {ENTRIES.length}
        </span>
      </div>

      {CATEGORIES.map((cat) => {
        const inCat = filtered.filter((e) => e.category === cat);
        if (inCat.length === 0) return null;
        return (
          <div key={cat} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--semantic-text-strong-default, #111)",
                }}
              >
                {cat}
              </h3>
              <span style={{ fontSize: 12, color: "var(--semantic-text-subtle-default, #666)" }}>
                · {inCat.length} icons
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "var(--gap-comfortable)",
              }}
            >
              {inCat.map((entry) => (
                <IconCard
                  key={entry.componentName}
                  entry={entry}
                  size={size}
                  color={color}
                  bg={bg}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SourceChips({
  value,
  onChange,
}: {
  value: SourceFilter;
  onChange: (v: SourceFilter) => void;
}) {
  const options: { v: SourceFilter; label: string }[] = [
    { v: "all", label: "All" },
    { v: "common", label: "Common" },
    { v: "cashpobi", label: "Cashpobi" },
  ];
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
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
              border: "1px solid var(--semantic-border-normal-default, #EEEEEE)",
              background: active ? "#000000" : "var(--semantic-bg-surface-default, #FFFFFF)",
              color: active ? "#FFFFFF" : "var(--semantic-text-normal-default, #333)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const All: Story = {
  name: "전체",
  globals: { brand: "cashpobi" },
  render: () => (
    <Catalog
      size={24}
      color="var(--semantic-icon-strong-default, #111111)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const BrandTint: Story = {
  name: "Brand 색 (yellow)",
  globals: { brand: "cashpobi" },
  parameters: {
    docs: {
      description: {
        story: "Cashpobi brand color(`--semantic-icon-brand-default`, #FEAF01) 로 렌더링.",
      },
    },
  },
  render: () => (
    <Catalog
      size={24}
      color="var(--semantic-icon-brand-default, #FEAF01)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const Size20: Story = {
  name: "Size 20 (Button 내부)",
  globals: { brand: "cashpobi" },
  render: () => (
    <Catalog
      size={20}
      color="var(--semantic-icon-strong-default, #111111)"
      bg="var(--semantic-bg-surface-default, #FFFFFF)"
    />
  ),
};

export const OnDarkSurface: Story = {
  name: "다크 배경",
  globals: { brand: "cashpobi" },
  render: () => <Catalog size={24} color="#FFFFFF" bg="#111111" />,
};
