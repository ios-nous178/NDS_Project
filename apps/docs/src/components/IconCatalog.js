import React, { useMemo, useState, useEffect, useRef } from "react";
import * as Icons from "@nudge-design/icons";
import styles from "./IconCatalog.module.css";

function pascalToKebab(name) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function brandOf(name) {
  if (name.startsWith("Geniet")) return "Geniet";
  if (name.startsWith("Trost")) return "Trost";
  return "Common";
}

const BRAND_ORDER = ["Common", "Geniet", "Trost"];
const ENTRIES = Object.entries(Icons)
  .filter(
    ([name, value]) =>
      name.endsWith("Icon") && (typeof value === "function" || typeof value === "object"),
  )
  .map(([name, Component]) => ({
    name,
    kebab: pascalToKebab(name),
    brand: brandOf(name),
    Component,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const BRAND_COUNTS = ENTRIES.reduce((acc, e) => {
  acc[e.brand] = (acc[e.brand] ?? 0) + 1;
  return acc;
}, {});

function SearchGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function IconCatalog() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [copied, setCopied] = useState(null);
  const copyTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ENTRIES.filter((e) => {
      if (brand !== "All" && e.brand !== brand) return false;
      if (!q) return true;
      return e.name.toLowerCase().includes(q) || e.kebab.includes(q);
    });
  }, [query, brand]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const b of BRAND_ORDER) map.set(b, []);
    for (const e of filtered) map.get(e.brand).push(e);
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [filtered]);

  const onCopy = async (e, name) => {
    e.preventDefault();
    const snippet = `import { ${name} } from "@nudge-design/icons";`;
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = snippet;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(name);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>
              <SearchGlyph />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 또는 파일명으로 검색 (예: chevron, arrow, geniet)"
              className={styles.search}
              aria-label="아이콘 검색"
            />
          </div>
          <span className={styles.count}>
            {filtered.length} / {ENTRIES.length}
          </span>
        </div>

        <div className={styles.chipRow}>
          {["All", ...BRAND_ORDER].map((b) => {
            const total = b === "All" ? ENTRIES.length : (BRAND_COUNTS[b] ?? 0);
            const active = b === brand;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setBrand(b)}
                aria-pressed={active}
                className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
              >
                {b}
                <span className={styles.chipCount}>{total}</span>
              </button>
            );
          })}
        </div>
      </div>

      {grouped.map(([groupName, items]) => (
        <section key={groupName} className={styles.section}>
          <h3 className={styles.sectionHead}>
            {groupName}
            <span className={styles.sectionCount}>{items.length}</span>
          </h3>
          <div className={styles.grid}>
            {items.map(({ name, kebab, Component }) => {
              const isCopied = copied === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={(e) => onCopy(e, name)}
                  className={styles.card}
                  title={`${kebab}.svg — click to copy import`}
                  aria-label={`Copy import for ${name}`}
                >
                  <span className={styles.iconBox}>
                    <Component size={32} aria-hidden="true" />
                  </span>
                  <span className={styles.cardName}>{name}</span>
                  {isCopied && <span className={styles.copied}>Copied!</span>}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {filtered.length === 0 && <p className={styles.empty}>검색 결과가 없어요.</p>}
    </div>
  );
}
