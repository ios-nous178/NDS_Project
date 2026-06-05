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
 *   sub-rows-key: 자식 행 배열이 든 필드명 (지정 시 펼침/접힘 트리 활성화)
 *   expander-column: 펼침 토글을 놓을 컬럼 key (기본: 첫 컬럼)
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
const DT_EXPAND_CELL_CLASS = `${DT_CLASS}__expand-cell`;
const DT_EXPANDER_CLASS = `${DT_CLASS}__expander`;
const DT_EXPANDER_SPACER_CLASS = `${DT_CLASS}__expander-spacer`;

export type DataTableSortDirection = "asc" | "desc";

interface Column {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  cardLabel?: string;
  hideOnCard?: boolean;
  media?: boolean;
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
      "sub-rows-key",
      "expander-column",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _expanded = new Set<string>();

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
          align: ["left", "center", "right"].includes(c.align) ? c.align : "center",
          sortable: !!c.sortable,
          cardLabel: typeof c.cardLabel === "string" ? c.cardLabel : undefined,
          hideOnCard: !!c.hideOnCard,
          media: !!c.media,
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

  private _expanderIcon(expanded: boolean): SVGElement {
    // 04ic/open · 04ic/close (Figma 캐포비 라이브러리) — 라운드 사각 + −(펼침)/+(접힘)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.style.display = "block";
    svg.innerHTML =
      `<rect x="1.2" y="1.2" width="21.6" height="21.6" rx="4" stroke="currentColor" stroke-width="2.4" opacity="0.32"/>` +
      `<rect x="6.5" y="11" width="11" height="2" rx="1" fill="currentColor"/>` +
      (expanded ? "" : `<rect x="11" y="6.5" width="2" height="11" rx="1" fill="currentColor"/>`);
    return svg;
  }

  private _branchIcon(): SVGElement {
    // 자식(하위) 행 머리의 ↳ 분기 화살표.
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.style.display = "block";
    svg.innerHTML =
      `<path d="M9 6v6a2 2 0 0 0 2 2h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>` +
      `<path d="M14.5 11l3 3-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>`;
    return svg;
  }

  private _flatten(
    rows: Record<string, unknown>[],
    subRowsKey: string | null,
    rowKeyField: string,
  ): Array<{
    row: Record<string, unknown>;
    key: string;
    depth: number;
    index: number;
    hasChildren: boolean;
    expanded: boolean;
  }> {
    const out: Array<{
      row: Record<string, unknown>;
      key: string;
      depth: number;
      index: number;
      hasChildren: boolean;
      expanded: boolean;
    }> = [];
    let i = 0;
    const walk = (list: Record<string, unknown>[], depth: number) => {
      for (const row of list) {
        const index = i++;
        const key = String(row[rowKeyField] ?? index);
        const children = subRowsKey ? row[subRowsKey] : undefined;
        const hasChildren = Array.isArray(children) && children.length > 0;
        const expanded = hasChildren && this._expanded.has(key);
        out.push({ row, key, depth, index, hasChildren, expanded });
        if (expanded) walk(children as Record<string, unknown>[], depth + 1);
      }
    };
    walk(rows, 0);
    return out;
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
    const subRowsKey = this.getAttribute("sub-rows-key");
    const expandable = !!subRowsKey;
    const expanderColumn = this.getAttribute("expander-column") || columns[0]?.key || "";

    this._root.dataset.size = size;
    this._root.dataset.responsive = responsive;
    if (expandable) this._root.dataset.expandable = "true";
    else delete this._root.dataset.expandable;

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
      th.dataset.align =
        expandable && col.key === expanderColumn ? "left" : (col.align ?? "center");
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
      const flat = expandable
        ? this._flatten(data, subRowsKey, _rowKeyField)
        : data.map((row, index) => ({
            row,
            key: String(row[_rowKeyField] ?? index),
            depth: 0,
            index,
            hasChildren: false,
            expanded: false,
          }));
      flat.forEach((fr) => {
        const tr = document.createElement("tr");
        tr.dataset.slot = "tr";
        if (expandable) tr.dataset.depth = String(fr.depth);
        if (rowClickable) {
          tr.dataset.clickable = "true";
          tr.style.cursor = "pointer";
          tr.addEventListener("click", () => {
            this.dispatchEvent(
              new CustomEvent("nds-data-table-row-click", {
                detail: { row: fr.row, index: fr.index },
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
          td.dataset.align =
            expandable && col.key === expanderColumn ? "left" : (col.align ?? "center");
          if (col.media) td.dataset.cell = "media";
          td.className = DT_TD_CLASS;
          if (expandable && col.key === expanderColumn) {
            const cell = document.createElement("span");
            cell.className = DT_EXPAND_CELL_CLASS;
            cell.style.paddingInlineStart = `${fr.depth * 20}px`;
            if (fr.hasChildren) {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = DT_EXPANDER_CLASS;
              btn.dataset.expanded = fr.expanded ? "true" : "false";
              btn.setAttribute("aria-expanded", fr.expanded ? "true" : "false");
              btn.setAttribute("aria-label", fr.expanded ? "접기" : "펼치기");
              btn.appendChild(this._expanderIcon(fr.expanded));
              btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (this._expanded.has(fr.key)) this._expanded.delete(fr.key);
                else this._expanded.add(fr.key);
                this.update();
              });
              cell.appendChild(btn);
            } else {
              const spacer = document.createElement("span");
              spacer.className = DT_EXPANDER_SPACER_CLASS;
              spacer.setAttribute("aria-hidden", "true");
              if (fr.depth > 0) spacer.appendChild(this._branchIcon());
              cell.appendChild(spacer);
            }
            const text = document.createElement("span");
            text.textContent = this._cellText(col, fr.row);
            cell.appendChild(text);
            td.appendChild(cell);
          } else {
            td.textContent = this._cellText(col, fr.row);
          }
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
        const flat = expandable
          ? this._flatten(data, subRowsKey, _rowKeyField)
          : data.map((row, index) => ({
              row,
              key: String(row[_rowKeyField] ?? index),
              depth: 0,
              index,
              hasChildren: false,
              expanded: false,
            }));
        flat.forEach((fr) => {
          const card = document.createElement("article");
          if (expandable) {
            card.dataset.depth = String(fr.depth);
            if (fr.depth > 0) card.style.marginInlineStart = `${fr.depth * 20}px`;
          }
          if (rowClickable) {
            card.dataset.clickable = "true";
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
              this.dispatchEvent(
                new CustomEvent("nds-data-table-row-click", {
                  detail: { row: fr.row, index: fr.index },
                  bubbles: true,
                  composed: true,
                }),
              );
            });
          }
          if (expandable && fr.hasChildren) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = DT_EXPANDER_CLASS;
            btn.dataset.expanded = fr.expanded ? "true" : "false";
            btn.setAttribute("aria-expanded", fr.expanded ? "true" : "false");
            btn.setAttribute("aria-label", fr.expanded ? "접기" : "펼치기");
            btn.appendChild(this._expanderIcon(fr.expanded));
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (this._expanded.has(fr.key)) this._expanded.delete(fr.key);
              else this._expanded.add(fr.key);
              this.update();
            });
            card.appendChild(btn);
          }
          cardColumns.forEach((col) => {
            const cardRow = document.createElement("div");
            cardRow.className = DT_CARD_ROW_CLASS;

            const label = document.createElement("span");
            label.className = DT_CARD_LABEL_CLASS;
            label.textContent = col.cardLabel ?? col.title;

            const value = document.createElement("span");
            value.className = DT_CARD_VALUE_CLASS;
            value.textContent = this._cellText(col, fr.row);

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
