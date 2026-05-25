/**
 * <nds-order-summary-card> — DS OrderSummaryCard 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-order-summary-card
 *     title="결제 정보"
 *     rows='[{"label":"소계","value":"50,000원"},{"label":"할인","value":"-5,000원","emphasis":"discount"}]'
 *     total-label="총 결제금액"
 *   >
 *     <nds-price-tag slot="total" amount="45000"></nds-price-tag>
 *     <button slot="footer">결제하기</button>
 *   </nds-order-summary-card>
 *
 * total 은 slot="total" 자식이 우선이고, 없으면 `total` 텍스트 attribute 를 사용.
 */

import { NdsElement, define } from "../base/nds-element.js";

const OS_CLASS = "nds-order-summary-card";
const OS_HEADER_CLASS = `${OS_CLASS}__header`;
const OS_TITLE_CLASS = `${OS_CLASS}__title`;
const OS_LIST_CLASS = `${OS_CLASS}__list`;
const OS_ROW_CLASS = `${OS_CLASS}__row`;
const OS_LABEL_CLASS = `${OS_CLASS}__label`;
const OS_VALUE_CLASS = `${OS_CLASS}__value`;
const OS_DIVIDER_CLASS = `${OS_CLASS}__divider`;
const OS_TOTAL_CLASS = `${OS_CLASS}__total`;
const OS_TOTAL_VALUE_CLASS = `${OS_CLASS}__total-value`;
const OS_FOOTER_CLASS = `${OS_CLASS}__footer`;

const EMPHASES = ["default", "discount", "info"] as const;
type RowEmphasis = (typeof EMPHASES)[number];

interface SummaryRow {
  label: string;
  value: string;
  emphasis: RowEmphasis;
}

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsOrderSummaryCard extends NdsElement {
  static elementName = "nds-order-summary-card";

  static get observedAttributes(): readonly string[] {
    return ["title", "rows", "total-label", "total", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _totalSlotNode: Element | null = null;
  private _footerSlotNode: Element | null = null;
  private _titleSlotNode: Element | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    for (const node of Array.from(this.children)) {
      const slot = node.getAttribute("slot");
      if (slot === "total" && !this._totalSlotNode) this._totalSlotNode = node;
      else if (slot === "footer" && !this._footerSlotNode) this._footerSlotNode = node;
      else if (slot === "title" && !this._titleSlotNode) this._titleSlotNode = node;
    }

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = OS_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const children: Node[] = [];
    const header = this._createHeader();
    if (header) children.push(header);

    children.push(this._createList(), this._createDivider(), this._createTotal());
    const footer = this._createFooter();
    if (footer) children.push(footer);

    this._root.replaceChildren(...children);
  }

  private _createHeader(): HTMLDivElement | null {
    const titleAttr = this.getAttribute("title");
    const useDefault = titleAttr === null && !this._titleSlotNode;
    const text = titleAttr ?? "결제 정보";
    if (titleAttr === "") return null;
    if (useDefault && this._titleSlotNode) return null;

    const wrap = document.createElement("div");
    wrap.className = OS_HEADER_CLASS;
    const h3 = document.createElement("h3");
    h3.className = OS_TITLE_CLASS;
    if (this._titleSlotNode) h3.appendChild(this._titleSlotNode);
    else h3.textContent = text;
    wrap.appendChild(h3);
    return wrap;
  }

  private _createList(): HTMLDivElement {
    const list = document.createElement("div");
    list.className = OS_LIST_CLASS;
    for (const row of this._readRows()) {
      const rowEl = document.createElement("div");
      rowEl.className = OS_ROW_CLASS;

      const labelEl = document.createElement("span");
      labelEl.className = OS_LABEL_CLASS;
      labelEl.textContent = row.label;

      const valueEl = document.createElement("span");
      valueEl.className = OS_VALUE_CLASS;
      valueEl.dataset.emphasis = row.emphasis;
      valueEl.textContent = row.value;

      rowEl.append(labelEl, valueEl);
      list.appendChild(rowEl);
    }
    return list;
  }

  private _createDivider(): HTMLDivElement {
    const div = document.createElement("div");
    div.className = OS_DIVIDER_CLASS;
    div.setAttribute("aria-hidden", "true");
    return div;
  }

  private _createTotal(): HTMLDivElement {
    const total = document.createElement("div");
    total.className = OS_TOTAL_CLASS;

    const labelEl = document.createElement("span");
    labelEl.textContent = this.attr("total-label", "총 결제금액");
    total.appendChild(labelEl);

    const valueEl = document.createElement("span");
    valueEl.className = OS_TOTAL_VALUE_CLASS;
    if (this._totalSlotNode) valueEl.appendChild(this._totalSlotNode);
    else valueEl.textContent = this.attr("total", "");
    total.appendChild(valueEl);
    return total;
  }

  private _createFooter(): HTMLDivElement | null {
    if (!this._footerSlotNode) return null;
    const wrap = document.createElement("div");
    wrap.className = OS_FOOTER_CLASS;
    wrap.appendChild(this._footerSlotNode);
    return wrap;
  }

  private _readRows(): SummaryRow[] {
    const attr = this.getAttribute("rows");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => {
          const emphasis = typeof raw.emphasis === "string" ? raw.emphasis : "default";
          return {
            label: typeof raw.label === "string" ? raw.label : "",
            value: typeof raw.value === "string" ? raw.value : String(raw.value ?? ""),
            emphasis: (EMPHASES as readonly string[]).includes(emphasis)
              ? (emphasis as RowEmphasis)
              : "default",
          };
        })
        .filter((row) => row.label);
    } catch {
      return [];
    }
  }
}

define(NdsOrderSummaryCard);
