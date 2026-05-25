/**
 * <nds-streak-card> — DS StreakCard 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-streak-card title="명상 연속" streak="7" unit="일" footer="잘하고 있어요!"
 *     days='[{"date":"2026-05-19","done":true,"label":"월"},
 *            {"date":"2026-05-20","done":true,"label":"화"},
 *            {"date":"2026-05-25","done":false,"label":"일"}]'>
 *     <span slot="icon">🔥</span>
 *   </nds-streak-card>
 *
 *  icon 자식이 없으면 기본 이모지 🔥.
 */

import { NdsElement, define } from "../base/nds-element.js";

const SK_CLASS = "nds-streak-card";
const SK_HEADER_CLASS = `${SK_CLASS}__header`;
const SK_ICON_CLASS = `${SK_CLASS}__icon`;
const SK_TITLE_CLASS = `${SK_CLASS}__title`;
const SK_VALUE_CLASS = `${SK_CLASS}__value`;
const SK_NUMBER_CLASS = `${SK_CLASS}__number`;
const SK_UNIT_CLASS = `${SK_CLASS}__unit`;
const SK_GRID_CLASS = `${SK_CLASS}__grid`;
const SK_DAY_CLASS = `${SK_CLASS}__day`;
const SK_DAY_LABEL_CLASS = `${SK_CLASS}__day-label`;
const SK_DAY_DOT_CLASS = `${SK_CLASS}__day-dot`;
const SK_FOOTER_CLASS = `${SK_CLASS}__footer`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

interface StreakDay {
  date: string;
  done: boolean;
  label?: string;
}

function todayIso(): string {
  const t = new Date();
  return `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export class NdsStreakCard extends NdsElement {
  static elementName = "nds-streak-card";

  static get observedAttributes(): readonly string[] {
    return ["title", "streak", "unit", "days", "footer", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _iconSlotNode: Element | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    for (const node of Array.from(this.children)) {
      if (node.getAttribute("slot") === "icon") {
        this._iconSlotNode = node;
        break;
      }
    }
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SK_CLASS;
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

    const children: Node[] = [this._createHeader()];
    const grid = this._createGrid();
    if (grid) children.push(grid);
    const footer = this._createFooter();
    if (footer) children.push(footer);

    this._root.replaceChildren(...children);
  }

  private _createHeader(): HTMLDivElement {
    const header = document.createElement("div");
    header.className = SK_HEADER_CLASS;

    const icon = document.createElement("span");
    icon.className = SK_ICON_CLASS;
    icon.setAttribute("aria-hidden", "true");
    if (this._iconSlotNode) icon.appendChild(this._iconSlotNode);
    else icon.textContent = "🔥";
    header.appendChild(icon);

    const right = document.createElement("div");
    right.style.flex = "1";

    const title = document.createElement("p");
    title.className = SK_TITLE_CLASS;
    title.textContent = this.attr("title", "연속 기록");
    right.appendChild(title);

    const value = document.createElement("div");
    value.className = SK_VALUE_CLASS;
    const number = document.createElement("span");
    number.className = SK_NUMBER_CLASS;
    number.textContent = this.attr("streak", "0");
    const unit = document.createElement("span");
    unit.className = SK_UNIT_CLASS;
    unit.textContent = `${this.attr("unit", "일")}째`;
    value.append(number, unit);
    right.appendChild(value);
    header.appendChild(right);

    return header;
  }

  private _createGrid(): HTMLDivElement | null {
    const days = this._readDays();
    if (days.length === 0) return null;

    const today = todayIso();
    const grid = document.createElement("div");
    grid.className = SK_GRID_CLASS;
    grid.setAttribute("role", "list");
    grid.setAttribute("aria-label", "최근 기록");

    for (const day of days) {
      const cell = document.createElement("div");
      cell.className = SK_DAY_CLASS;
      cell.setAttribute("role", "listitem");

      const label = document.createElement("span");
      label.className = SK_DAY_LABEL_CLASS;
      label.textContent = day.label ?? day.date.slice(-2);

      const dot = document.createElement("span");
      dot.className = SK_DAY_DOT_CLASS;
      dot.dataset.done = day.done ? "true" : "false";
      dot.dataset.today = day.date === today ? "true" : "false";
      dot.setAttribute("aria-label", `${day.date} ${day.done ? "완료" : "미완료"}`);

      cell.append(label, dot);
      grid.appendChild(cell);
    }
    return grid;
  }

  private _createFooter(): HTMLParagraphElement | null {
    const text = this.getAttribute("footer");
    if (!text) return null;
    const p = document.createElement("p");
    p.className = SK_FOOTER_CLASS;
    p.textContent = text;
    return p;
  }

  private _readDays(): StreakDay[] {
    const attr = this.getAttribute("days");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => ({
          date: typeof raw.date === "string" ? raw.date : "",
          done: raw.done === true,
          label: typeof raw.label === "string" ? raw.label : undefined,
        }))
        .filter((day) => day.date);
    } catch {
      return [];
    }
  }
}

define(NdsStreakCard);
