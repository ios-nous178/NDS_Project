import React, { useMemo, useState, useEffect, useRef } from "react";
import { colors } from "@nudge-eap/tokens";
import styles from "./ColorCatalog.module.css";

const GROUP_META = [
  { key: "neutral", label: "Neutral", caption: "배경 · 텍스트 · 보더 기본" },
  { key: "coolGray", label: "Cool Gray", caption: "중립 + 살짝 색감" },
  { key: "blue", label: "Blue", caption: "Primary — CTA · 링크 · 포커스" },
  { key: "magenta", label: "Magenta", caption: "Secondary — 액센트" },
  { key: "green", label: "Green", caption: "Success — 성공 · 완료" },
  { key: "amber", label: "Amber", caption: "보조 강조 · Geniet 액센트" },
  { key: "yellow", label: "Yellow", caption: "Caution — 경고 · 주의" },
  { key: "red", label: "Red", caption: "Error — 에러 · 실패" },
  { key: "coralRed", label: "Coral Red", caption: "추가 레드 스케일" },
];

function relLuminance(hex) {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const toLin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function tokenPath(group, shade) {
  return /^\d+$/.test(shade) ? `colors.${group}[${shade}]` : `colors.${group}["${shade}"]`;
}

const PALETTES = GROUP_META.map((g) => {
  const palette = colors[g.key];
  if (!palette) return null;
  const items = Object.entries(palette).map(([shade, hex]) => ({
    group: g.key,
    groupLabel: g.label,
    shade,
    hex,
    path: tokenPath(g.key, shade),
    onLight: relLuminance(hex) > 0.55,
  }));
  return { ...g, items };
}).filter(Boolean);

const TOTAL_COUNT = PALETTES.reduce((acc, p) => acc + p.items.length, 0);

function SearchGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ColorCatalog() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(null);
  const copyTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const filteredPalettes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PALETTES;
    return PALETTES.map((p) => {
      const groupHit =
        p.key.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.caption.toLowerCase().includes(q);
      // 그룹명/캡션 매치면 전체 shade 노출, 아니면 shade·hex·path 매치만 필터.
      const items = groupHit
        ? p.items
        : p.items.filter(
            (e) =>
              String(e.shade).includes(q) ||
              e.hex.toLowerCase().includes(q) ||
              e.path.toLowerCase().includes(q),
          );
      return { ...p, items };
    }).filter((p) => p.items.length > 0);
  }, [query]);

  const visibleCount = filteredPalettes.reduce((acc, p) => acc + p.items.length, 0);

  const onCopy = async (e, entry) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(entry.path);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = entry.path;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(entry.path);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(null), 1100);
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <SearchGlyph />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="그룹·shade·hex 로 검색 (예: blue, 500, #2B96ED)"
            className={styles.search}
            aria-label="색상 토큰 검색"
          />
        </div>
        <span className={styles.count}>
          {visibleCount} / {TOTAL_COUNT}
        </span>
      </div>

      {filteredPalettes.map((p) => (
        <section key={p.key} className={styles.palette}>
          <header className={styles.paletteHead}>
            <h3 className={styles.paletteTitle}>
              {p.label}
              <span className={styles.paletteCount}>{p.items.length}</span>
            </h3>
            <p className={styles.paletteCaption}>{p.caption}</p>
          </header>
          <div className={styles.strip} role="list">
            {p.items.map((entry) => {
              const isCopied = copied === entry.path;
              return (
                <button
                  key={entry.path}
                  role="listitem"
                  type="button"
                  onClick={(e) => onCopy(e, entry)}
                  className={`${styles.block} ${entry.onLight ? styles.blockLight : styles.blockDark}`}
                  style={{ background: entry.hex }}
                  title={`Click to copy: ${entry.path}`}
                  aria-label={`Copy ${entry.path}`}
                >
                  <span className={styles.shade}>{entry.shade}</span>
                  <span className={styles.hex}>{entry.hex.toUpperCase().replace("#", "")}</span>
                  {isCopied && <span className={styles.copied}>Copied</span>}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {filteredPalettes.length === 0 && <p className={styles.empty}>검색 결과가 없어요.</p>}
    </div>
  );
}
