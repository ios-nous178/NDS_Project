/**
 * <nds-data-table> — DS DataTable 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-data-table
 *     columns='[
 *       {"key":"name","title":"이름","sortable":true},
 *       {"key":"role","title":"역할"},
 *       {"key":"date","title":"가입일","sortable":true,"align":"right"}
 *     ]'
 *     data='[
 *       {"id":"1","name":"홍길동","role":"상담사","date":"2026-03-05"},
 *       {"id":"2","name":"김민지","role":"수퍼바이저","date":"2026-04-10"}
 *     ]'
 *     row-key="id"
 *     sort-key="date"
 *     sort-direction="desc"
 *     responsive="scroll"
 *     size="md"
 *   ></nds-data-table>
 *
 * 이벤트:
 *   nds-data-table-sort (detail: { key, direction })
 *   nds-data-table-row-click (detail: { row, index })
 *
 * 속성:
 *   columns: JSON 배열 ({ key, title, width?, align?, sortable?, cardLabel?, hideOnCard? })
 *           — render 함수는 지원하지 않음 (vanilla 한계). 텍스트로만 표시.
 *   data: JSON 배열 (객체)
 *   row-key: 객체에서 key 로 쓸 필드명 (default "id")
 *   sort-key / sort-direction
 *   empty-message
 *   loading
 *   size: "sm" | "md"
 *   responsive: "scroll" | "cards"
 *   row-clickable: 행 클릭 가능
 */

import { NdsElement, define } from "../base/nds-element.js";

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

export type DataTableSortDirection = "asc" | "desc";

interface Column {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  cardLabel?: string;
  hideOnCard?: boolean;
}

const SortIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "10");
  svg.setAttribute("height", "10");
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.style.display = "block";
  svg.innerHTML = `<path d="M5 2.5L8.5 7.5H1.5L5 2.5Z" fill="currentColor"/>`;
  return svg;
};

export class NdsDataTable extends NdsElement {
  static elementName = "nds-data-table";

  static get observedAttributes(): readonly string[] {
    return [
      "columns",
      "data",
      "row-key",
      "sort-key",
      "sort-direction",
      "empty-message",
      "loading",
      "size",
      "responsive",
      "row-clickable",
    ];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = DT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseColumns(): Column[] {
    const raw = this.getAttribute("columns");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((c) => c && typeof c.key === "string")
        .map((c) => ({
          key: String(c.key),
          title: typeof c.title === "string" ? c.title : String(c.key),
          width:
            typeof c.width === "number"
              ? `${c.width}px`
              : typeof c.width === "string"
                ? c.width
                : undefined,
          align: ["left", "center", "right"].includes(c.align) ? c.align : "left",
          sortable: !!c.sortable,
          cardLabel: typeof c.cardLabel === "string" ? c.cardLabel : undefined,
          hideOnCard: !!c.hideOnCard,
        }));
    } catch {
      return [];
    }
  }

  private _parseData(): Record<string, unknown>[] {
    const raw = this.getAttribute("data");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((r) => r && typeof r === "object");
    } catch {
      return [];
    }
  }

  private _cellText(col: Column, row: Record<string, unknown>): string {
    const v = row[col.key];
    if (v == null) return "";
    return String(v);
  }

  private _handleSort(
    col: Column,
    currentKey: string | null,
    currentDir: DataTableSortDirection | null,
  ): void {
    if (!col.sortable) return;
    const nextDir: DataTableSortDirection =
      currentKey === col.key && currentDir === "asc" ? "desc" : "asc";
    this.setAttribute("sort-key", col.key);
    this.setAttribute("sort-direction", nextDir);
    this.dispatchEvent(
      new CustomEvent("nds-data-table-sort", {
        detail: { key: col.key, direction: nextDir },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const columns = this._parseColumns();
    const data = this._parseData();
    const _rowKeyField = this.getAttribute("row-key") || "id";
    const sortKey = this.getAttribute("sort-key");
    const sortDirRaw = this.getAttribute("sort-direction");
    const sortDirection: DataTableSortDirection | null =
      sortDirRaw === "asc" || sortDirRaw === "desc" ? sortDirRaw : null;
    const emptyMessage = this.getAttribute("empty-message") || "표시할 항목이 없어요";
    const loading = this.boolAttr("loading");
    const size = this.getAttribute("size") || "md";
    const responsive = this.getAttribute("responsive") || "scroll";
    const rowClickable = this.boolAttr("row-clickable");

    this._root.dataset.size = size;
    this._root.dataset.responsive = responsive;

    this._root.innerHTML = "";

    const scrollWrap = document.createElement("div");
    scrollWrap.dataset.slot = "scroll";
    scrollWrap.className = DT_SCROLL_CLASS;

    const table = document.createElement("table");
    table.dataset.slot = "table";
    table.className = DT_TABLE_CLASS;

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    columns.forEach((col) => {
      const isSortActive = sortKey === col.key;
      const th = document.createElement("th");
      th.dataset.slot = "th";
      th.dataset.align = col.align ?? "left";
      th.dataset.sortable = col.sortable ? "true" : "false";
      if (col.width) th.style.width = col.width;
      th.className = DT_TH_CLASS;
      if (col.sortable) {
        th.style.cursor = "pointer";
        th.setAttribute(
          "aria-sort",
          isSortActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none",
        );
        th.addEventListener("click", () => this._handleSort(col, sortKey, sortDirection));
      }

      const inner = document.createElement("span");
      inner.className = DT_TH_INNER_CLASS;
      inner.appendChild(document.createTextNode(col.title));

      if (col.sortable) {
        const sortIconWrap = document.createElement("span");
        sortIconWrap.className = DT_SORT_ICON_CLASS;
        sortIconWrap.dataset.active = isSortActive ? "true" : "false";
        if (isSortActive && sortDirection) sortIconWrap.dataset.direction = sortDirection;
        sortIconWrap.appendChild(SortIcon());
        inner.appendChild(sortIconWrap);
      }

      th.appendChild(inner);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    if (loading) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = columns.length;
      td.className = DT_LOADING_CLASS;
      td.textContent = "불러오는 중…";
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else if (data.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = columns.length;
      td.className = DT_EMPTY_CLASS;
      td.textContent = emptyMessage;
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      data.forEach((row, idx) => {
        const tr = document.createElement("tr");
        tr.dataset.slot = "tr";
        if (rowClickable) {
          tr.dataset.clickable = "true";
          tr.style.cursor = "pointer";
          tr.addEventListener("click", () => {
            this.dispatchEvent(
              new CustomEvent("nds-data-table-row-click", {
                detail: { row, index: idx },
                bubbles: true,
                composed: true,
              }),
            );
          });
        }
        tr.className = DT_TR_CLASS;
        columns.forEach((col) => {
          const td = document.createElement("td");
          td.dataset.slot = "td";
          td.dataset.align = col.align ?? "left";
          td.className = DT_TD_CLASS;
          td.textContent = this._cellText(col, row);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    table.appendChild(tbody);

    scrollWrap.appendChild(table);
    this._root.appendChild(scrollWrap);

    if (responsive === "cards" && !loading) {
      const cardList = document.createElement("div");
      cardList.dataset.slot = "card-list";
      cardList.className = DT_CARD_CLASS;

      if (data.length === 0) {
        const empty = document.createElement("div");
        empty.className = DT_EMPTY_CLASS;
        empty.textContent = emptyMessage;
        cardList.appendChild(empty);
      } else {
        const cardColumns = columns.filter((c) => !c.hideOnCard);
        data.forEach((row, idx) => {
          const card = document.createElement("article");
          if (rowClickable) {
            card.dataset.clickable = "true";
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
              this.dispatchEvent(
                new CustomEvent("nds-data-table-row-click", {
                  detail: { row, index: idx },
                  bubbles: true,
                  composed: true,
                }),
              );
            });
          }
          cardColumns.forEach((col) => {
            const cardRow = document.createElement("div");
            cardRow.className = DT_CARD_ROW_CLASS;

            const label = document.createElement("span");
            label.className = DT_CARD_LABEL_CLASS;
            label.textContent = col.cardLabel ?? col.title;

            const value = document.createElement("span");
            value.className = DT_CARD_VALUE_CLASS;
            value.textContent = this._cellText(col, row);

            cardRow.append(label, value);
            card.appendChild(cardRow);
          });
          cardList.appendChild(card);
        });
      }
      this._root.appendChild(cardList);
    }
  }
}

define(NdsDataTable);
