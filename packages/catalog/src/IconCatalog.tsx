import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "@nudge-design/icons";
import type {
  IconCatalogCashwalkEntry,
  IconCatalogIcon,
  IconCatalogProps,
  IconComponentType,
} from "./types.js";

/* 토큰 셀프 스타일 — docs(--ifm-*)·storybook(Tailwind) 어디서든 동일하게 보이도록
 * DS 시멘틱 토큰(--semantic-*)만 사용하고 안전한 폴백 hex 를 둔다. <style> 를 컴포넌트
 * 마크업에 직접 렌더(SSR 안전, React19 dedupe). 클래스는 nds-cat- prefix 로 격리. */
const CATALOG_CSS = `
.nds-cat-root{display:flex;flex-direction:column;gap:16px}
.nds-cat-toolbar{position:sticky;top:0;z-index:2;display:flex;flex-direction:column;gap:10px;padding:12px 0;background:var(--semantic-bg-surface-default,#fff)}
.nds-cat-searchrow{display:flex;align-items:center;gap:12px}
.nds-cat-search{flex:1 1 auto;height:38px;padding:0 var(--semantic-inset-input,12px);border:1px solid var(--semantic-border-normal-default,#d8d8d8);border-radius:8px;background:var(--semantic-bg-surface-default,#fff);color:var(--semantic-text-strong-default,#1f1f1f);font-size:14px}
.nds-cat-search:focus{outline:none;border-color:var(--semantic-border-focus-default,#5c8eff)}
.nds-cat-count{font-size:12px;color:var(--semantic-text-subtle-default,#6b7280);font-variant-numeric:tabular-nums;white-space:nowrap}
.nds-cat-chips{display:flex;flex-wrap:wrap;gap:6px}
.nds-cat-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border:1px solid var(--semantic-border-normal-default,#d8d8d8);border-radius:999px;background:transparent;color:var(--semantic-text-normal-default,#374151);font-size:12px;font-weight:600;cursor:pointer}
.nds-cat-chip:hover{border-color:var(--semantic-border-focus-default,#5c8eff)}
.nds-cat-chip[aria-pressed="true"]{background:var(--semantic-bg-inverse-default,#1f1f1f);color:var(--semantic-text-inverse-default,#fff);border-color:var(--semantic-bg-inverse-default,#1f1f1f)}
.nds-cat-chip__count{font-size:11px;opacity:.7;font-variant-numeric:tabular-nums}
.nds-cat-section{display:flex;flex-direction:column;gap:8px}
.nds-cat-section__head{display:flex;align-items:center;gap:8px;margin:0;font-size:13px;font-weight:700;color:var(--semantic-text-strong-default,#1f1f1f)}
.nds-cat-section__count{font-size:11px;font-weight:600;color:var(--semantic-text-subtle-default,#6b7280)}
.nds-cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
.nds-cat-card{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px 10px;min-height:96px;border:1px solid var(--semantic-border-subtle-default,#ececec);border-radius:10px;background:var(--semantic-bg-surface-default,#fff);cursor:pointer;transition:border-color .12s,transform .12s,box-shadow .12s}
.nds-cat-card:hover{border-color:var(--semantic-border-focus-default,#5c8eff);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,.06)}
.nds-cat-card:focus-visible{outline:none;border-color:var(--semantic-border-focus-default,#5c8eff)}
.nds-cat-card--dark{background:var(--semantic-bg-inverse-default,#1f1f1f);border-color:transparent}
.nds-cat-card__icon{display:flex;align-items:center;justify-content:center;color:var(--semantic-icon-strong-default,#1f1f1f)}
.nds-cat-card--dark .nds-cat-card__icon{color:var(--semantic-icon-inverse-default,#fff)}
.nds-cat-card__name{font-size:11px;line-height:1.3;text-align:center;word-break:break-word;color:var(--semantic-text-normal-default,#374151);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.nds-cat-card--dark .nds-cat-card__name{color:var(--semantic-text-inverse-default,#fff)}
.nds-cat-card__copied{position:absolute;top:6px;right:6px;font-size:10px;font-weight:700;color:var(--semantic-text-brand-default,#2563eb)}
.nds-cat-badge{position:absolute;top:6px;left:6px;padding:1px 6px;border-radius:999px;font-size:9.5px;font-weight:700}
.nds-cat-badge--common{background:var(--semantic-bg-surface-subtle,#f1f5f9);color:var(--semantic-text-subtle-default,#6b7280)}
.nds-cat-badge--brand{background:var(--semantic-bg-brand-default,#fff7e6);color:var(--semantic-icon-brand-default,#b45309)}
.nds-cat-empty{padding:40px 0;text-align:center;color:var(--semantic-text-subtle-default,#6b7280);font-size:13px}
`;

function resolveIcon(name: string): IconComponentType | null {
  const c = (Icons as Record<string, unknown>)[name];
  return typeof c === "function" || (typeof c === "object" && c !== null)
    ? (c as IconComponentType)
    : null;
}

function useCopy(copyMode: "import" | "name") {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copy = async (name: string) => {
    const text = copyMode === "import" ? `import { ${name} } from "@nudge-design/icons";` : name;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopied(name);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1200);
  };
  return { copied, copy };
}

type Badge = { text: string; tone: "common" | "brand" };

interface IconCardProps {
  name: string;
  label: string;
  copied: boolean;
  onCopy: (name: string) => void;
  iconSize: number;
  iconColor?: string;
  surface: "light" | "dark";
  badge?: Badge;
}

function IconCard({
  name,
  label,
  copied,
  onCopy,
  iconSize,
  iconColor,
  surface,
  badge,
}: IconCardProps) {
  const Icon = resolveIcon(name);
  if (!Icon) return null;
  return (
    <button
      type="button"
      className={surface === "dark" ? "nds-cat-card nds-cat-card--dark" : "nds-cat-card"}
      onClick={() => onCopy(name)}
      title={`${label} — 클릭하면 복사`}
      aria-label={`Copy ${name}`}
    >
      <span className="nds-cat-card__icon">
        <Icon size={iconSize} color={iconColor} aria-hidden />
      </span>
      <span className="nds-cat-card__name">{label}</span>
      {badge ? <span className={`nds-cat-badge nds-cat-badge--${badge.tone}`}>{badge.text}</span> : null}
      {copied ? <span className="nds-cat-card__copied">Copied!</span> : null}
    </button>
  );
}

interface ChipDef {
  id: string;
  label: string;
  count: number;
}

function Chips({
  chips,
  active,
  onSelect,
}: {
  chips: ChipDef[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="nds-cat-chips">
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          className="nds-cat-chip"
          aria-pressed={c.id === active}
          onClick={() => onSelect(c.id)}
        >
          {c.label}
          <span className="nds-cat-chip__count">{c.count}</span>
        </button>
      ))}
    </div>
  );
}

interface Section {
  key: string;
  label: string;
  items: Array<{ name: string; label: string; badge?: Badge }>;
}

export function IconCatalog(props: IconCatalogProps): React.JSX.Element {
  const {
    data,
    mode = "all",
    brand,
    copyMode = "import",
    iconSize = 32,
    iconColor,
    surface = "light",
    searchKebab = true,
    searchPlaceholder = "이름 또는 파일명으로 검색",
    emptyLabel = "검색 결과가 없어요.",
  } = props;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { copied, copy } = useCopy(copyMode);

  const q = query.trim().toLowerCase();

  // ── cashwalk-biz 모드: 큐레이션 카탈로그 + source 칩 + 카테고리 그룹 ──
  const cashwalk = useMemo(() => {
    if (mode !== "cashwalk-biz") return null;
    const all = data.cashwalkBiz;
    const matches = (e: IconCatalogCashwalkEntry) =>
      (filter === "all" || e.source === filter) &&
      (!q ||
        e.displayName.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q));
    const filtered = all.filter(matches);
    const order: string[] = [];
    const groups = new Map<string, Section["items"]>();
    for (const e of filtered) {
      if (!groups.has(e.category)) {
        groups.set(e.category, []);
        order.push(e.category);
      }
      groups.get(e.category)!.push({
        name: e.name,
        label: e.displayName,
        badge:
          e.source === "cashwalk-biz"
            ? { text: "CashwalkBiz", tone: "brand" }
            : { text: "공통", tone: "common" },
      });
    }
    const sections: Section[] = order.map((cat) => ({
      key: cat,
      label: cat,
      items: groups.get(cat)!,
    }));
    const chips: ChipDef[] = [
      { id: "all", label: "전체", count: all.length },
      { id: "common", label: "공통", count: all.filter((e) => e.source === "common").length },
      {
        id: "cashwalk-biz",
        label: "CashwalkBiz",
        count: all.filter((e) => e.source === "cashwalk-biz").length,
      },
    ];
    return { sections, chips, total: all.length, shown: filtered.length };
  }, [mode, data.cashwalkBiz, filter, q]);

  // ── all / single-brand 모드: 전체 아이콘 + 브랜드 칩/그룹 ──
  const branded = useMemo(() => {
    if (mode === "cashwalk-biz") return null;
    const base: IconCatalogIcon[] =
      mode === "single-brand" && brand
        ? data.icons.filter((i) => i.brand === brand)
        : data.icons;
    const matches = (i: IconCatalogIcon) =>
      (mode !== "all" || filter === "all" || i.brand === filter) &&
      (!q || i.name.toLowerCase().includes(q) || (searchKebab && i.kebab.includes(q)));
    const filtered = base.filter(matches);

    let sections: Section[];
    if (mode === "all") {
      // 브랜드 순서대로 그룹
      sections = data.brands
        .map((b) => ({
          key: b.id,
          label: b.label,
          items: filtered
            .filter((i) => i.brand === b.id)
            .map((i) => ({ name: i.name, label: i.name })),
        }))
        .filter((s) => s.items.length > 0);
    } else {
      sections = [
        {
          key: "flat",
          label: "",
          items: filtered.map((i) => ({ name: i.name, label: i.name })),
        },
      ];
    }

    const chips: ChipDef[] =
      mode === "all"
        ? [
            { id: "all", label: "전체", count: base.length },
            ...data.brands.map((b) => ({
              id: b.id,
              label: b.label,
              count: base.filter((i) => i.brand === b.id).length,
            })),
          ]
        : [];

    return { sections, chips, total: base.length, shown: filtered.length };
  }, [mode, brand, data.icons, data.brands, filter, q, searchKebab]);

  const view = cashwalk ?? branded!;
  const showChips = view.chips.length > 0;
  const showSectionHeads = mode !== "single-brand";

  return (
    <div className="nds-cat-root">
      <style>{CATALOG_CSS}</style>
      <div className="nds-cat-toolbar">
        <div className="nds-cat-searchrow">
          <input
            type="search"
            className="nds-cat-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="아이콘 검색"
          />
          <span className="nds-cat-count">
            {view.shown} / {view.total}
          </span>
        </div>
        {showChips ? <Chips chips={view.chips} active={filter} onSelect={setFilter} /> : null}
      </div>

      {view.sections.map((section) => (
        <section key={section.key} className="nds-cat-section">
          {showSectionHeads && section.label ? (
            <h3 className="nds-cat-section__head">
              {section.label}
              <span className="nds-cat-section__count">{section.items.length}</span>
            </h3>
          ) : null}
          <div className="nds-cat-grid">
            {section.items.map((item) => (
              <IconCard
                key={item.name}
                name={item.name}
                label={item.label}
                copied={copied === item.name}
                onCopy={copy}
                iconSize={iconSize}
                iconColor={iconColor}
                surface={surface}
                badge={item.badge}
              />
            ))}
          </div>
        </section>
      ))}

      {view.shown === 0 ? <p className="nds-cat-empty">{emptyLabel}</p> : null}
    </div>
  );
}
