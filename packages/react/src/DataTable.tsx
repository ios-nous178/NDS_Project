import React, { useCallback, useMemo, useState } from "react";

/* ─── Constants ─── */

const DT_CLASS = "nds-data-table";
const DT_SCROLL_CLASS = `${DT_CLASS}__scroll`;
const DT_TABLE_CLASS = `${DT_CLASS}__table`;
const DT_TH_CLASS = `${DT_CLASS}__th`;
const DT_TH_INNER_CLASS = `${DT_CLASS}__th-inner`;
const DT_SORT_ICON_CLASS = `${DT_CLASS}__sort-icon`;
const DT_TR_CLASS = `${DT_CLASS}__tr`;
const DT_TD_CLASS = `${DT_CLASS}__td`;
const DT_EMPTY_CLASS = `${DT_CLASS}__empty`;
const DT_LOADING_CLASS = `${DT_CLASS}__loading`;
const DT_CARD_CLASS = `${DT_CLASS}__card`;
const DT_CARD_ROW_CLASS = `${DT_CLASS}__card-row`;
const DT_CARD_LABEL_CLASS = `${DT_CLASS}__card-label`;
const DT_CARD_VALUE_CLASS = `${DT_CLASS}__card-value`;
const DT_EXPAND_CELL_CLASS = `${DT_CLASS}__expand-cell`;
const DT_EXPANDER_CLASS = `${DT_CLASS}__expander`;
const DT_EXPANDER_SPACER_CLASS = `${DT_CLASS}__expander-spacer`;

/* ─── Types ─── */

export type SortDirection = "asc" | "desc";

export interface DataTableColumn<T> {
  /** 식별 키 (data 객체의 key 또는 임의 문자열) */
  key: string;
  /** 컬럼 헤더 라벨 */
  title: React.ReactNode;
  /** 너비 (숫자=px, 문자=CSS) */
  width?: number | string;
  /** 정렬 */
  align?: "left" | "center" | "right";
  /** 정렬 가능 여부 */
  sortable?: boolean;
  /** 셀 렌더러 (없으면 row[key] 텍스트) */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /** 모바일 카드 모드에서 라벨 표시 (기본: title) */
  cardLabel?: React.ReactNode;
  /** 모바일 카드 모드에서 숨김 */
  hideOnCard?: boolean;
}

export interface DataTableProps<T> {
  /** 컬럼 정의 */
  columns: DataTableColumn<T>[];
  /** 데이터 행 */
  data: T[];
  /** key 추출 */
  rowKey: (row: T, rowIndex: number) => string;
  /** 행 클릭 */
  onRowClick?: (row: T, rowIndex: number) => void;
  /** 정렬 키 */
  sortKey?: string;
  /** 정렬 방향 */
  sortDirection?: SortDirection;
  /** 정렬 변경 콜백 */
  onSort?: (key: string, direction: SortDirection) => void;
  /** 빈 상태 메시지 */
  emptyMessage?: React.ReactNode;
  /** 로딩 표시 */
  loading?: boolean;
  /** 셀 padding 크기 */
  size?: "sm" | "md";
  /** 모바일에서 처리 방식 — scroll: 가로 스크롤 / cards: 카드로 변환 */
  responsive?: "scroll" | "cards";
  /**
   * 자식 행 추출 — 반환 배열이 있으면 그 행은 펼침 가능(트리/중첩 행).
   * ⚠️ 사용 시 rowKey 는 인덱스가 아니라 행 고유값(예: row.id)으로 안정적이어야 함.
   */
  getSubRows?: (row: T) => T[] | undefined;
  /** 펼침 토글을 놓을 컬럼 key (기본: 첫 컬럼) */
  expanderColumnKey?: string;
  /** 펼쳐진 행 key 집합 (controlled) */
  expandedKeys?: string[];
  /** 초기 펼침 key (uncontrolled) */
  defaultExpandedKeys?: string[];
  /** 펼침 변경 콜백 */
  onExpandedChange?: (keys: string[]) => void;
  /** className */
  className?: string;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const SortIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    <path d="M5 2.5L8.5 7.5H1.5L5 2.5Z" fill="currentColor" />
  </svg>
);

const EXPAND_INDENT = 20;

const ExpanderIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="currentColor" opacity="0.35" />
    <path d="M4.5 8h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {!expanded && (
      <path d="M8 4.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    )}
  </svg>
);

/* ─── Component ─── */

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage = "표시할 항목이 없어요",
  loading = false,
  size = "md",
  responsive = "scroll",
  className,
  getSubRows,
  expanderColumnKey,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
}: DataTableProps<T>) {
  const isExpandControlled = expandedKeys !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedKeys ?? []),
  );
  const expandedSet = useMemo(
    () => (isExpandControlled ? new Set(expandedKeys) : internalExpanded),
    [isExpandControlled, expandedKeys, internalExpanded],
  );
  const expandable = typeof getSubRows === "function";
  const expanderKey = expanderColumnKey ?? columns[0]?.key;

  const toggleExpand = useCallback(
    (key: string) => {
      const next = new Set(expandedSet);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (!isExpandControlled) setInternalExpanded(next);
      onExpandedChange?.([...next]);
    },
    [expandedSet, isExpandControlled, onExpandedChange],
  );

  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable || !onSort) return;
    const nextDir: SortDirection = sortKey === col.key && sortDirection === "asc" ? "desc" : "asc";
    onSort(col.key, nextDir);
  };

  const renderCell = (col: DataTableColumn<T>, row: T, idx: number): React.ReactNode => {
    if (col.render) return col.render(row, idx);
    const value = (row as unknown as Record<string, unknown>)[col.key];
    return value == null ? "" : String(value);
  };

  const cardColumns = columns.filter((c) => !c.hideOnCard);

  const flatRows = useMemo<
    Array<{
      row: T;
      key: string;
      depth: number;
      index: number;
      hasChildren: boolean;
      expanded: boolean;
    }>
  >(() => {
    const out: Array<{
      row: T;
      key: string;
      depth: number;
      index: number;
      hasChildren: boolean;
      expanded: boolean;
    }> = [];
    let i = 0;
    const walk = (rows: T[], depth: number) => {
      for (const row of rows) {
        const index = i++;
        const key = rowKey(row, index);
        const children = expandable ? getSubRows?.(row) : undefined;
        const hasChildren = !!(children && children.length > 0);
        const expanded = hasChildren && expandedSet.has(key);
        out.push({ row, key, depth, index, hasChildren, expanded });
        if (expanded && children) walk(children, depth + 1);
      }
    };
    walk(data, 0);
    return out;
  }, [data, expandable, getSubRows, rowKey, expandedSet]);

  const renderExpandableCell = (
    col: DataTableColumn<T>,
    fr: (typeof flatRows)[number],
  ): React.ReactNode => {
    const content = renderCell(col, fr.row, fr.index);
    if (!expandable || col.key !== expanderKey) return content;
    return (
      <span
        className={DT_EXPAND_CELL_CLASS}
        style={{ paddingInlineStart: fr.depth * EXPAND_INDENT }}
      >
        {fr.hasChildren ? (
          <button
            type="button"
            className={DT_EXPANDER_CLASS}
            data-expanded={fr.expanded ? "true" : "false"}
            aria-expanded={fr.expanded}
            aria-label={fr.expanded ? "접기" : "펼치기"}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(fr.key);
            }}
          >
            <ExpanderIcon expanded={fr.expanded} />
          </button>
        ) : (
          <span className={DT_EXPANDER_SPACER_CLASS} aria-hidden="true" />
        )}
        <span>{content}</span>
      </span>
    );
  };

  return (
    <div
      data-slot="root"
      data-size={size}
      data-responsive={responsive}
      className={cx(DT_CLASS, className)}
    >
      <div data-slot="scroll" className={DT_SCROLL_CLASS}>
        <table data-slot="table" className={DT_TABLE_CLASS}>
          <thead>
            <tr>
              {columns.map((col) => {
                const isSortActive = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    data-slot="th"
                    data-align={col.align ?? "left"}
                    data-sortable={col.sortable ? "true" : "false"}
                    style={{ width: col.width }}
                    className={DT_TH_CLASS}
                    onClick={() => handleSort(col)}
                    aria-sort={
                      isSortActive
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : col.sortable
                          ? "none"
                          : undefined
                    }
                  >
                    <span className={DT_TH_INNER_CLASS}>
                      {col.title}
                      {col.sortable && (
                        <span
                          className={DT_SORT_ICON_CLASS}
                          data-active={isSortActive ? "true" : "false"}
                          data-direction={isSortActive ? sortDirection : undefined}
                        >
                          <SortIcon />
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={DT_LOADING_CLASS}>
                  불러오는 중…
                </td>
              </tr>
            ) : flatRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={DT_EMPTY_CLASS}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              flatRows.map((fr) => (
                <tr
                  key={fr.key}
                  data-slot="tr"
                  data-depth={expandable ? fr.depth : undefined}
                  data-clickable={onRowClick ? "true" : undefined}
                  className={DT_TR_CLASS}
                  onClick={() => onRowClick?.(fr.row, fr.index)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      data-slot="td"
                      data-align={col.align ?? "left"}
                      className={DT_TD_CLASS}
                    >
                      {renderExpandableCell(col, fr)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      {responsive === "cards" && !loading && (
        <div data-slot="card-list" className={DT_CARD_CLASS}>
          {flatRows.length === 0 ? (
            <div className={DT_EMPTY_CLASS}>{emptyMessage}</div>
          ) : (
            flatRows.map((fr) => (
              <article
                key={fr.key}
                data-depth={expandable ? fr.depth : undefined}
                data-clickable={onRowClick ? "true" : undefined}
                style={
                  expandable && fr.depth > 0
                    ? { marginInlineStart: fr.depth * EXPAND_INDENT }
                    : undefined
                }
                onClick={() => onRowClick?.(fr.row, fr.index)}
              >
                {expandable && fr.hasChildren && (
                  <button
                    type="button"
                    className={DT_EXPANDER_CLASS}
                    data-expanded={fr.expanded ? "true" : "false"}
                    aria-expanded={fr.expanded}
                    aria-label={fr.expanded ? "접기" : "펼치기"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(fr.key);
                    }}
                  >
                    <ExpanderIcon expanded={fr.expanded} />
                  </button>
                )}
                {cardColumns.map((col) => (
                  <div key={col.key} className={DT_CARD_ROW_CLASS}>
                    <span className={DT_CARD_LABEL_CLASS}>{col.cardLabel ?? col.title}</span>
                    <span className={DT_CARD_VALUE_CLASS}>{renderCell(col, fr.row, fr.index)}</span>
                  </div>
                ))}
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}

DataTable.displayName = "DataTable";
