import React, { useMemo, useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { groupByCategorySorted, orderedCategories } from "@nudge-design/catalog";
import inventory from "../../../../metadata/componentInventory.json";
import styles from "./ComponentGallery.module.css";

// 카테고리 그룹 순서 + 그룹 내 A-Z 정렬은 @nudge-design/catalog 가 SSOT (storybook AllComponents 와 공유).
const CATEGORIES = ["전체", ...orderedCategories(inventory)];

const STATUS_LABEL = {
  implemented: "구현됨",
  planned: "예정",
  draft: "초안",
};

function toStoryId(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// docsPath 가 가리키는 문서가 실제로 존재할 때만 docs 로 링크한다. 없으면(inventory 에는
// 등록됐지만 아직 문서를 안 쓴 컴포넌트) Storybook 으로 폴백해 broken-link 를 피한다.
function getDocsLink(entry, docSlugs) {
  if (entry.docsPath?.startsWith("/components/")) {
    const slug = entry.docsPath.replace("/components/", "");
    if (docSlugs.has(slug)) return entry.docsPath;
  } else if (entry.docsPath) {
    return entry.docsPath;
  }
  return `/storybook/?path=/docs/${toStoryId(entry.storybookTitle)}--docs`;
}

export default function ComponentGallery({ storybookBaseUrl = "/storybook" }) {
  const { siteConfig } = useDocusaurusContext();
  const docSlugs = useMemo(
    () => new Set(siteConfig.customFields?.componentDocSlugs ?? []),
    [siteConfig],
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [onlySynced, setOnlySynced] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((entry) => {
      if (category !== "전체" && entry.category !== category) return false;
      if (onlySynced && !entry.figmaSynced) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        (entry.description ?? "").toLowerCase().includes(q) ||
        (entry.usageSummary ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, category, onlySynced]);

  const grouped = useMemo(() => groupByCategorySorted(filtered), [filtered]);

  const syncedCount = inventory.filter((e) => e.figmaSynced).length;

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름·설명·활용으로 검색"
          className={styles.search}
        />
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={onlySynced}
            onChange={(e) => setOnlySynced(e.target.checked)}
          />
          Figma Synced만 ({syncedCount})
        </label>
        <span className={styles.count}>
          {filtered.length} / {inventory.length}
        </span>
      </div>

      <div className={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cat === category ? `${styles.chip} ${styles.chipActive}` : styles.chip}
          >
            {cat}
          </button>
        ))}
      </div>

      {grouped.map(([cat, entries]) => (
        <section key={cat} className={styles.section}>
          <h3 className={styles.sectionHead}>
            {cat}
            <span className={styles.sectionCount}>{entries.length}</span>
          </h3>
          <div className={styles.grid}>
            {entries.map((entry) => (
              <Link key={entry.name} to={getDocsLink(entry, docSlugs)} className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardName}>{entry.name}</span>
                  {entry.figmaSynced && <span className={styles.syncedTag}>Figma Synced</span>}
                </div>
                <p className={styles.cardDesc}>{entry.description}</p>
                {entry.usageSummary && <p className={styles.cardUsage}>{entry.usageSummary}</p>}
                <div className={styles.cardFoot}>
                  <span className={styles.statusBadge}>
                    {STATUS_LABEL[entry.status] ?? entry.status}
                  </span>
                  <span className={styles.cardLinks}>
                    {entry.figmaUrl && (
                      <a
                        href={entry.figmaUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={styles.metaLink}
                      >
                        Figma
                      </a>
                    )}
                    <a
                      href={`${storybookBaseUrl}/?path=/docs/${toStoryId(entry.storybookTitle)}--docs`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={styles.metaLink}
                    >
                      Storybook
                    </a>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && <p className={styles.empty}>검색 결과가 없어요.</p>}
    </div>
  );
}
