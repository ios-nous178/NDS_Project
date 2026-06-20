import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

function isColorValue(v) {
  if (!v) return false;
  return /^#[0-9a-fA-F]{3,8}$|^rgb/.test(v.trim());
}

function isTranslucent(v) {
  if (!v) return false;
  const t = v.trim();
  if (/^rgba\(/i.test(t)) return true;
  const m = t.match(/^#([0-9a-f]{8})$/i);
  if (m && m[1].slice(6).toLowerCase() !== "ff") return true;
  return false;
}

export function SectionNav({ items }) {
  return (
    <nav className={styles.sectionNav} aria-label="섹션 바로가기">
      {items.map((it) => (
        <a key={it.href} href={it.href} className={styles.sectionNavItem}>
          <span>{it.label}</span>
          <span className={styles.sectionCount}>{it.count}</span>
        </a>
      ))}
    </nav>
  );
}

// 그리드 → 리스트 컨테이너 (이름은 호환 유지)
export function TokenGrid({ children }) {
  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        <span className={styles.colSwatch}></span>
        <span className={styles.colName}>토큰</span>
        <span className={styles.colHex}>값</span>
        <span className={styles.colCssVar}>CSS 변수</span>
        <span className={styles.colProjects}>프로젝트</span>
        <span className={styles.colMeta}>가이드</span>
        <span className={styles.colAction}></span>
      </div>
      {children}
    </div>
  );
}

function ProjectDot({ label, color }) {
  if (!isColorValue(color)) return null;
  return (
    <span className={styles.projectWrap} title={`${label} · ${color}`}>
      <span className={styles.projectLabel}>{label[0]}</span>
      <span className={styles.projectDot} style={{ backgroundColor: color }} aria-hidden="true" />
    </span>
  );
}

function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className={styles.copyBtn}
      title={`var(${value.replace(/^var\(|\)$/g, "")}) 복사`}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          /* noop */
        }
      }}
    >
      {copied ? "✓" : "⧉"}
    </button>
  );
}

// 카드 → 리스트 row (이름은 호환 유지)
export function TokenCard({ name, cssVar, base, trost, geniet, guide, figmaNode }) {
  const showTrost = trost && trost !== base;
  const showGeniet = geniet && geniet !== base;
  const baseIsColor = isColorValue(base);
  const baseTranslucent = isTranslucent(base);
  return (
    <div className={styles.row}>
      <div
        className={[styles.colSwatch, styles.swatch, baseTranslucent && styles.swatchTranslucent]
          .filter(Boolean)
          .join(" ")}
        style={
          baseIsColor
            ? baseTranslucent
              ? { "--swatch-fill": base }
              : { backgroundColor: base }
            : undefined
        }
        title={base}
      >
        {!baseIsColor && <span className={styles.swatchFallback}>?</span>}
      </div>
      <code className={`${styles.colName} ${styles.name}`}>{name}</code>
      <code className={`${styles.colHex} ${styles.hex}`}>{base}</code>
      <code className={`${styles.colCssVar} ${styles.cssVar}`}>{cssVar}</code>
      <div className={`${styles.colProjects} ${styles.projects}`}>
        {showTrost && <ProjectDot label="Trost" color={trost} />}
        {showGeniet && <ProjectDot label="Geniet" color={geniet} />}
      </div>
      <div className={`${styles.colMeta} ${styles.meta}`}>
        {guide === "core" && (
          <span className={`${styles.guidePill} ${styles.guideCore}`}>CORE</span>
        )}
        {guide === "experimental" && (
          <span className={`${styles.guidePill} ${styles.guideExp}`}>EXP</span>
        )}
        {figmaNode && <span className={styles.figmaNote}>{figmaNode}</span>}
      </div>
      <div className={styles.colAction}>
        <CopyBtn value={`var(${cssVar})`} />
      </div>
    </div>
  );
}
