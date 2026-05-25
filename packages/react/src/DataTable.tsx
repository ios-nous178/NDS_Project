import React from "react";

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
}: DataTableProps<T>) {
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
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={DT_EMPTY_CLASS}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={rowKey(row, idx)}
                  data-slot="tr"
                  data-clickable={onRowClick ? "true" : undefined}
                  className={DT_TR_CLASS}
                  onClick={() => onRowClick?.(row, idx)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      data-slot="td"
                      data-align={col.align ?? "left"}
                      className={DT_TD_CLASS}
                    >
                      {renderCell(col, row, idx)}
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
          {data.length === 0 ? (
            <div className={DT_EMPTY_CLASS}>{emptyMessage}</div>
          ) : (
            data.map((row, idx) => (
              <article
                key={rowKey(row, idx)}
                data-clickable={onRowClick ? "true" : undefined}
                onClick={() => onRowClick?.(row, idx)}
              >
                {cardColumns.map((col) => (
                  <div key={col.key} className={DT_CARD_ROW_CLASS}>
                    <span className={DT_CARD_LABEL_CLASS}>{col.cardLabel ?? col.title}</span>
                    <span className={DT_CARD_VALUE_CLASS}>{renderCell(col, row, idx)}</span>
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
