import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { groupByCategorySorted, orderedCategories } from "@nudge-design/catalog";
import { getGalleryVariants } from "./galleryRegistry";
import inventory from "../../../../metadata/componentInventory.json";
import componentGuides from "../../../../metadata/componentGuides.json";

type ComponentGuide = {
  name: string;
  summary?: string;
  pitfalls?: string[];
  recommended?: string[];
  usagePolicy?: {
    useFor?: string[];
    doNotUseFor?: string[];
    // SSOT(packages/mcp guides.ts ComponentGuide)는 boolean 도 허용(예: ProductCard
    // rankingBadgeAndSoldOutMutuallyExclusive: true). 좁게 복제돼 drift 났던 것을 맞춤.
    limits?: Record<string, string | number | boolean>;
  };
  figmaNodeUrl?: string;
  accessibility?: string[];
};

const GUIDES: Record<string, ComponentGuide> =
  (componentGuides as { components?: Record<string, ComponentGuide> }).components ?? {};

function isBrandSpecificEntry(entry: {
  name?: string;
  storybookTitle?: string;
  category?: string;
}) {
  const brandPrefixes = ["Geniet", "Trost", "NudgeEAP", "CashwalkBiz", "Runmile"];
  return Boolean(
    entry.storybookTitle?.startsWith("Brands/") ||
    brandPrefixes.some(
      (prefix) => entry.storybookTitle?.includes(`/${prefix}/`) || entry.name?.startsWith(prefix),
    ) ||
    entry.category === "브랜드" ||
    entry.category === "Brand",
  );
}

/* ──────────────────────────────────────────
   Meta + Story
   ────────────────────────────────────────── */

type InventoryEntry = (typeof inventory)[number] & {
  figmaSynced?: boolean;
  figmaSyncedAt?: string;
};

// 카테고리 그룹 순서 + 그룹 내 A-Z 정렬은 @nudge-design/catalog 가 SSOT (docs ComponentGallery 와 공유).
const CATEGORIES = ["전체", ...orderedCategories(inventory)];

const meta: Meta = {
  title: "Foundations/All Components",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**한 페이지로 보는 전체 컴포넌트 카탈로그**`,
          ``,
          `총 **${inventory.length}개** 컴포넌트. 카테고리 필터와 이름 검색으로 빠르게 찾으세요.`,
          `핵심 컴포넌트는 라이브 미니 프리뷰가 보이고, 나머지는 이름·카테고리·설명·문서 링크만 표시됩니다.`,
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function toStoryId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ComponentCard({ entry }: { entry: InventoryEntry }) {
  const variants = getGalleryVariants(entry.storybookTitle);
  const storybookHref = useMemo(() => {
    const storyId = toStoryId(entry.storybookTitle);
    const suffix = `/?path=/docs/${storyId}--docs`;
    if (typeof window === "undefined") return suffix;
    try {
      const top = window.top ?? window;
      const prefix = top.location.pathname.startsWith("/storybook") ? "/storybook" : "";
      return `${prefix}${suffix}`;
    } catch {
      return suffix;
    }
  }, [entry.storybookTitle]);
  const guide = GUIDES[entry.name];
  const figmaHref = guide?.figmaNodeUrl ?? entry.figmaUrl;
  const [guideOpen, setGuideOpen] = useState(false);
  const [fitPct, setFitPct] = useState<number | null>(null);
  const hasGuideBody = Boolean(
    guide &&
    (guide.summary ||
      guide.usagePolicy?.useFor?.length ||
      guide.usagePolicy?.doNotUseFor?.length ||
      guide.pitfalls?.length ||
      guide.recommended?.length),
  );

  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={cardName}>{entry.name}</span>
        <div style={cardTags}>
          <span style={categoryTag}>{entry.category}</span>
          {entry.figmaSynced && <span style={syncedTag}>가이드</span>}
        </div>
      </div>

      <div style={cardPreview}>
        {variants.length > 0 ? (
          <>
            <AutoFitPreview onMeasure={setFitPct}>
              <div style={previewStack}>
                {variants.map((v) => (
                  <div key={v.exportName} style={previewVariant}>
                    {variants.length > 1 && <span style={previewVariantLabel}>{v.label}</span>}
                    <ErrorBoundary
                      fallback={<span style={previewPlaceholder}>{entry.name} preview</span>}
                    >
                      <v.Component />
                    </ErrorBoundary>
                  </div>
                ))}
              </div>
            </AutoFitPreview>
            {fitPct !== null && <span style={fitBadge}>{fitPct}%</span>}
          </>
        ) : (
          <span style={previewPlaceholder}>{entry.name}</span>
        )}
      </div>

      <p style={cardDesc}>{entry.description}</p>

      <dl style={cardMeta}>
        {entry.usageSummary && (
          <div style={cardMetaRow}>
            <dt style={cardMetaLabel}>활용</dt>
            <dd style={cardMetaValue} title={entry.usageSummary}>
              {entry.usageSummary}
            </dd>
          </div>
        )}
        {entry.notes && (
          <div style={cardMetaRow}>
            <dt style={cardMetaLabel}>메모</dt>
            <dd style={cardMetaValue} title={entry.notes}>
              {entry.notes}
            </dd>
          </div>
        )}
      </dl>

      {hasGuideBody && (
        <div style={guideBlock}>
          <button
            type="button"
            onClick={() => setGuideOpen((v) => !v)}
            style={guideToggle}
            aria-expanded={guideOpen}
          >
            <span>사용 가이드</span>
            <span style={guideToggleChevron} data-open={guideOpen}>
              ▾
            </span>
          </button>
          {guideOpen && (
            <div style={guideBody}>
              {guide?.summary && <p style={guideSummary}>{guide.summary}</p>}
              {guide?.usagePolicy?.useFor && guide.usagePolicy.useFor.length > 0 && (
                <GuideList tone="do" title="이럴 때 써요" items={guide.usagePolicy.useFor} />
              )}
              {guide?.usagePolicy?.doNotUseFor && guide.usagePolicy.doNotUseFor.length > 0 && (
                <GuideList
                  tone="dont"
                  title="이럴 땐 피해요"
                  items={guide.usagePolicy.doNotUseFor}
                />
              )}
              {guide?.pitfalls && guide.pitfalls.length > 0 && (
                <GuideList tone="warn" title="주의" items={guide.pitfalls.slice(0, 3)} />
              )}
              {guide?.recommended && guide.recommended.length > 0 && (
                <GuideList tone="info" title="권장" items={guide.recommended.slice(0, 4)} />
              )}
            </div>
          )}
        </div>
      )}

      <div style={cardFoot}>
        {figmaHref && (
          <a href={figmaHref} target="_blank" rel="noopener noreferrer" style={footLink}>
            Figma 가이드 →
          </a>
        )}
        <a href={storybookHref} target="_top" style={footLink}>
          Storybook →
        </a>
      </div>
    </div>
  );
}

type GuideTone = "do" | "dont" | "warn" | "info";

function GuideList({ tone, title, items }: { tone: GuideTone; title: string; items: string[] }) {
  return (
    <div style={guideListBlock}>
      <p style={{ ...guideListTitle, color: TONE_COLOR[tone] }}>
        {TONE_ICON[tone]} {title}
      </p>
      <ul style={guideListUl}>
        {items.map((item, i) => (
          <li key={i} style={guideListLi}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const TONE_ICON: Record<GuideTone, string> = {
  do: "✓",
  dont: "✕",
  warn: "⚠",
  info: "•",
};

const TONE_COLOR: Record<GuideTone, string> = {
  do: "#00A07C",
  dont: "#D04A3F",
  warn: "#C77700",
  info: "#017EE4",
};

/**
 * 프리뷰는 카드 폭에 맞추되, 높이는 폭의 PREVIEW_HEIGHT_RATIO 배까지 유동적으로 키운다.
 * 그 범위를 넘치면 transform scale 로 맞춰 축소하고, 현재 배율은 onMeasure 로 카드에 올려보내
 * 카드(프리뷰 영역) 우상단에 고정 배지로 항상 표시한다 — 내부 콘텐츠 높이와 무관.
 * 측정은 transform 의 영향을 안 받는 offsetWidth/Height 로 — ResizeObserver 로 콘텐츠/폭 변화 추적.
 */
const PREVIEW_HEIGHT_RATIO = 1.5;

function AutoFitPreview({
  children,
  onMeasure,
}: {
  children: React.ReactNode;
  onMeasure?: (pct: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });

  useLayoutEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return;
    const measure = () => {
      const availW = box.clientWidth;
      const natW = content.offsetWidth;
      const natH = content.offsetHeight;
      if (!availW || !natW || !natH) return;
      // 폭은 카드에 고정, 높이는 폭의 1.5배까지 유동 — 그 안에서만 축소.
      const maxH = availW * PREVIEW_HEIGHT_RATIO;
      const scale = Math.min(1, availW / natW, maxH / natH);
      setFit({ scale, height: natH * scale });
      onMeasure?.(Math.round(scale * 100));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(content);
    return () => ro.disconnect();
  }, [children, onMeasure]);

  return (
    <div ref={boxRef} style={{ ...autoFitBox, height: fit.height || undefined }}>
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transformOrigin: "top center",
          transform: `translateX(-50%) scale(${fit.scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* React 18에서 error boundary는 클래스만 가능. 인라인으로 정의. */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [syncedOnly, setSyncedOnly] = useState(false);

  const catalogInventory = useMemo(
    () => inventory.filter((entry) => !isBrandSpecificEntry(entry)),
    [],
  );

  const syncedCount = useMemo(
    () => catalogInventory.filter((e) => (e as InventoryEntry).figmaSynced).length,
    [catalogInventory],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogInventory.filter((entry) => {
      const matchesCategory = category === "전체" || entry.category === category;
      const matchesQuery =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        (entry.usageSummary ?? "").toLowerCase().includes(q);
      const matchesSynced = !syncedOnly || Boolean((entry as InventoryEntry).figmaSynced);
      return matchesCategory && matchesQuery && matchesSynced;
    });
  }, [query, category, syncedOnly, catalogInventory]);

  const grouped = useMemo(() => groupByCategorySorted(filtered as InventoryEntry[]), [filtered]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={controlsRow}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름·설명·활용으로 검색"
          style={searchInput}
        />
        <div style={categoryRow}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              style={{
                ...categoryChip,
                ...(cat === category ? categoryChipActive : null),
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <label style={syncedToggle}>
          <input
            type="checkbox"
            checked={syncedOnly}
            onChange={(e) => setSyncedOnly(e.target.checked)}
            style={syncedToggleInput}
          />
          <span>Figma 가이드</span>
          <span style={syncedToggleCount}>{syncedCount}</span>
        </label>
        <span style={countLabel}>
          {filtered.length} / {catalogInventory.length}
        </span>
      </div>

      {grouped.map(([cat, entries]) => (
        <div key={cat}>
          <p style={categoryHeader}>
            {cat} <span style={categoryHeaderCount}>{entries.length}</span>
          </p>
          <div style={grid}>
            {entries.map((entry) => (
              <ComponentCard key={entry.name} entry={entry} />
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>검색 결과가 없어요.</p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   Styles
   ────────────────────────────────────────── */

const controlsRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--semantic-gap-comfortable)",
  padding: "var(--semantic-inset-input) var(--semantic-inset-card)",
  background: "#FAFAFA",
  border: "1px solid #ECECEC",
  borderRadius: 10,
  position: "sticky",
  top: 0,
  zIndex: 5,
};

const searchInput: React.CSSProperties = {
  flex: "1 1 240px",
  height: 36,
  padding: "0 var(--semantic-inset-input)",
  border: "1px solid #D8D8D8",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

const categoryRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

const categoryChip: React.CSSProperties = {
  padding: "5px var(--semantic-inset-input)",
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 600,
  color: "#555",
  cursor: "pointer",
  fontFamily: "inherit",
};

const categoryChipActive: React.CSSProperties = {
  background: "#111111",
  borderColor: "#111111",
  color: "#FFFFFF",
};

const syncedToggle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px var(--semantic-inset-input)",
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  cursor: "pointer",
  userSelect: "none",
};

const syncedToggleInput: React.CSSProperties = {
  margin: 0,
  width: 14,
  height: 14,
  cursor: "pointer",
  accentColor: "#00A07C",
};

const syncedToggleCount: React.CSSProperties = {
  padding: "1px 7px",
  borderRadius: 10,
  background: "rgba(0,160,124,0.12)",
  color: "#00A07C",
  fontSize: 11,
  fontWeight: 700,
};

const countLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#888",
  marginLeft: "auto",
};

const categoryHeader: React.CSSProperties = {
  margin: "8px 0 12px",
  fontSize: 13,
  fontWeight: 800,
  color: "#111",
  letterSpacing: "-0.01em",
  display: "flex",
  alignItems: "baseline",
  gap: "var(--semantic-gap-default)",
};

const categoryHeaderCount: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#999",
};

// 카드 폭은 고정 (모든 카드 동일), 높이는 콘텐츠/프리뷰에 따라 유동 (AutoFitPreview 가 폭×1.5 까지 허용).
const CARD_WIDTH = 320;

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: `repeat(auto-fill, ${CARD_WIDTH}px)`,
  gap: "var(--semantic-gap-loose)",
  justifyContent: "start",
};

const card: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ECECEC",
  borderRadius: 12,
  overflow: "hidden",
  background: "#FFFFFF",
};

const cardHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 18px",
  gap: "var(--semantic-gap-default)",
  borderBottom: "1px solid #F2F2F2",
};

const cardName: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#111",
  letterSpacing: "-0.01em",
};

const cardTags: React.CSSProperties = {
  display: "flex",
  gap: "var(--semantic-gap-tight)",
  flexWrap: "wrap",
};

const categoryTag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#666",
  background: "#F4F4F4",
  padding: "3px var(--semantic-inset-chip)",
  borderRadius: 5,
};

const syncedTag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#00A07C",
  background: "rgba(0,160,124,0.1)",
  padding: "3px var(--semantic-inset-chip)",
  borderRadius: 5,
};

/* 미리보기 영역. 컴포넌트는 자연 크기로 렌더하되, 박스를 넘치면 AutoFitPreview 가 맞춰 축소. */
const cardPreview: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 180,
  padding: "var(--semantic-inset-modal)",
  background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(43,150,237,0.03), transparent 80%)",
  overflow: "hidden",
};

// AutoFitPreview 박스 — 폭 100%, 높이는 측정된 (축소 후) 콘텐츠 높이. 안의 콘텐츠는 absolute 중앙.
const autoFitBox: React.CSSProperties = {
  position: "relative",
  width: "100%",
};

// 카드 프리뷰 영역 우상단에 항상 고정으로 뜨는 현재 배율 배지 (내부 콘텐츠 높이와 무관).
const fitBadge: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 1,
  fontSize: 10,
  fontWeight: 700,
  color: "#888",
  background: "rgba(255,255,255,0.92)",
  border: "1px solid #ECECEC",
  borderRadius: 5,
  padding: "1px 5px",
  fontFamily: "ui-monospace, SFMono-Regular, monospace",
  pointerEvents: "none",
};

// 큐레이션된 gallery 변형들을 세로로 쌓아 인라인 노출. 변형이 2개 이상이면 작은 라벨을 단다.
const previewStack: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--semantic-gap-loose)",
  width: "100%",
};

const previewVariant: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  maxWidth: "100%",
};

const previewVariantLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#B0B0B0",
};

const previewPlaceholder: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px var(--semantic-inset-card)",
  background: "#F4F4F4",
  border: "1px dashed #D8D8D8",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 700,
  color: "#888",
  fontFamily: "ui-monospace, SFMono-Regular, monospace",
};

const cardDesc: React.CSSProperties = {
  margin: 0,
  padding: "14px 18px 6px",
  fontSize: 13,
  color: "#444",
  lineHeight: 1.55,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const cardMeta: React.CSSProperties = {
  margin: 0,
  padding: "var(--semantic-inset-chip) 18px 4px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const cardMetaRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "44px 1fr",
  gap: "var(--semantic-gap-default)",
  alignItems: "baseline",
};

const cardMetaLabel: React.CSSProperties = {
  margin: 0,
  fontSize: 10.5,
  fontWeight: 700,
  color: "#94a3b8",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const cardMetaValue: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.55,
  color: "#475569",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const cardFoot: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "var(--semantic-gap-default)",
  padding: "10px 18px 14px",
  borderTop: "1px solid #F2F2F2",
  marginTop: 8,
};

const footLink: React.CSSProperties = {
  fontSize: 12,
  color: "#017EE4",
  textDecoration: "none",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const guideBlock: React.CSSProperties = {
  padding: "var(--semantic-inset-chip) 18px 0",
  borderTop: "1px solid #F2F2F2",
  marginTop: 8,
};

const guideToggle: React.CSSProperties = {
  all: "unset",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "var(--semantic-inset-chip) 0",
  fontSize: 12,
  fontWeight: 700,
  color: "#333",
  cursor: "pointer",
  fontFamily: "inherit",
};

const guideToggleChevron: React.CSSProperties = {
  fontSize: 11,
  color: "#888",
  transition: "transform 0.15s ease",
};

const guideBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--semantic-gap-default)",
  padding: "4px 0 var(--semantic-inset-input)",
};

const guideSummary: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.55,
  color: "#475569",
  background: "#F8FAFC",
  padding: "var(--semantic-inset-chip) 10px",
  borderRadius: 6,
  border: "1px solid #E2E8F0",
};

const guideListBlock: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--semantic-gap-tight)",
};

const guideListTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const guideListUl: React.CSSProperties = {
  margin: 0,
  padding: "0 0 0 14px",
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const guideListLi: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  color: "#475569",
};

/* ──────────────────────────────────────────
   Story
   ────────────────────────────────────────── */

export const Catalog_All: Story = {
  name: "All / Search · Filter",
  render: () => <Catalog />,
};
