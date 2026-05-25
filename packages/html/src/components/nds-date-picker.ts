/**
 * <nds-date-picker> — DS DatePicker 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-date-picker value="2026-05-25" placeholder="YYYY-MM-DD"></nds-date-picker>
 *
 *   <nds-date-picker value="2026-05-25" min-date="2026-01-01" max-date="2026-12-31"></nds-date-picker>
 *
 * 이벤트:
 *   nds-date-change (detail: { value }) -> 날짜 선택
 *
 * 속성:
 *   value: "YYYY-MM-DD" (선택값)
 *   min-date / max-date: "YYYY-MM-DD"
 *   placeholder (default "YYYY-MM-DD")
 *   disabled / error / full-width
 *
 * React 버전의 Portal 은 미지원 — 패널은 inline absolute positioning.
 */

import { NdsElement, define } from "../base/nds-element.js";

const DP_CLASS = "nds-date-picker";
const DP_ROOT_CLASS = `${DP_CLASS}__root`;
const DP_TRIGGER_CLASS = `${DP_CLASS}__trigger`;
const DP_TRIGGER_TEXT_CLASS = `${DP_CLASS}__trigger-text`;
const DP_ICON_CLASS = `${DP_CLASS}__icon`;
const DP_PANEL_CLASS = `${DP_CLASS}__panel`;
const DP_HEADER_CLASS = `${DP_CLASS}__header`;
const DP_NAV_BTN_CLASS = `${DP_CLASS}__nav-btn`;
const DP_TITLE_CLASS = `${DP_CLASS}__title`;
const DP_DOW_CLASS = `${DP_CLASS}__dow`;
const DP_DOW_CELL_CLASS = `${DP_CLASS}__dow-cell`;
const DP_GRID_CLASS = `${DP_CLASS}__grid`;
const DP_DAY_CLASS = `${DP_CLASS}__day`;

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toIso = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseIso = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildGrid = (year: number, month: number): Date[] => {
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const gridStart = new Date(year, month, 1 - start);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
};

const NavSvg = (dir: "left" | "right") => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    dir === "left"
      ? `<path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

const CalendarIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 2v3M13 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
  return svg;
};

export class NdsDatePicker extends NdsElement {
  static elementName = "nds-date-picker";

  static get observedAttributes(): readonly string[] {
    return ["value", "min-date", "max-date", "placeholder", "disabled", "error", "full-width"];
  }

  private _root: HTMLDivElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _triggerText: HTMLSpanElement | null = null;
  private _panel: HTMLDivElement | null = null;
  private _open = false;
  private _viewYear = 0;
  private _viewMonth = 0;

  private _onDocClick = (e: MouseEvent) => {
    if (!this._open || !this._root) return;
    if (!this._root.contains(e.target as Node)) {
      this._open = false;
      this.scheduleUpdate();
    }
  };
  private _onEsc = (e: KeyboardEvent) => {
    if (this._open && e.key === "Escape") {
      e.preventDefault();
      this._open = false;
      this._trigger?.focus();
      this.scheduleUpdate();
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("mousedown", this._onDocClick);
    document.addEventListener("keydown", this._onEsc);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("mousedown", this._onDocClick);
    document.removeEventListener("keydown", this._onEsc);
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = DP_ROOT_CLASS;
    root.style.position = "relative";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.dataset.slot = "trigger";
    trigger.className = DP_TRIGGER_CLASS;
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._open = !this._open;
      if (this._open) {
        const val = parseIso(this.getAttribute("value") || "") || new Date();
        this._viewYear = val.getFullYear();
        this._viewMonth = val.getMonth();
      }
      this.scheduleUpdate();
    });

    const triggerText = document.createElement("span");
    triggerText.dataset.slot = "trigger-text";
    triggerText.className = DP_TRIGGER_TEXT_CLASS;

    const iconWrap = document.createElement("span");
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.className = DP_ICON_CLASS;
    iconWrap.appendChild(CalendarIcon());

    trigger.append(triggerText, iconWrap);
    root.appendChild(trigger);
    this.appendChild(root);

    this._root = root;
    this._trigger = trigger;
    this._triggerText = triggerText;
  }

  private _renderPanel(): void {
    if (!this._root) return;
    // Remove existing panel
    if (this._panel) {
      this._panel.remove();
      this._panel = null;
    }
    if (!this._open) return;

    const panel = document.createElement("div");
    panel.setAttribute("role", "dialog");
    panel.dataset.slot = "panel";
    panel.className = DP_PANEL_CLASS;
    panel.style.position = "absolute";
    panel.style.top = "100%";
    panel.style.left = "0";
    panel.style.marginTop = "4px";
    panel.style.zIndex = "1000";

    const value = parseIso(this.getAttribute("value") || "");
    const minDate = parseIso(this.getAttribute("min-date") || "");
    const maxDate = parseIso(this.getAttribute("max-date") || "");
    const minDay = minDate ? startOfDay(minDate) : null;
    const maxDay = maxDate ? startOfDay(maxDate) : null;
    const today = startOfDay(new Date());
    const grid = buildGrid(this._viewYear, this._viewMonth);

    const header = document.createElement("div");
    header.dataset.slot = "header";
    header.className = DP_HEADER_CLASS;

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = DP_NAV_BTN_CLASS;
    prev.setAttribute("aria-label", "이전 달");
    prev.appendChild(NavSvg("left"));
    prev.addEventListener("click", () => {
      this._viewMonth -= 1;
      if (this._viewMonth < 0) {
        this._viewMonth = 11;
        this._viewYear -= 1;
      }
      this._renderPanel();
    });

    const title = document.createElement("span");
    title.dataset.slot = "title";
    title.className = DP_TITLE_CLASS;
    title.textContent = `${this._viewYear}년 ${this._viewMonth + 1}월`;

    const next = document.createElement("button");
    next.type = "button";
    next.className = DP_NAV_BTN_CLASS;
    next.setAttribute("aria-label", "다음 달");
    next.appendChild(NavSvg("right"));
    next.addEventListener("click", () => {
      this._viewMonth += 1;
      if (this._viewMonth > 11) {
        this._viewMonth = 0;
        this._viewYear += 1;
      }
      this._renderPanel();
    });

    header.append(prev, title, next);
    panel.appendChild(header);

    const dow = document.createElement("div");
    dow.dataset.slot = "dow";
    dow.className = DP_DOW_CLASS;
    DAYS_OF_WEEK.forEach((d, idx) => {
      const cell = document.createElement("span");
      cell.dataset.slot = "dow-cell";
      cell.dataset.day = String(idx);
      cell.className = DP_DOW_CELL_CLASS;
      cell.textContent = d;
      dow.appendChild(cell);
    });
    panel.appendChild(dow);

    const gridEl = document.createElement("div");
    gridEl.dataset.slot = "grid";
    gridEl.setAttribute("role", "grid");
    gridEl.className = DP_GRID_CLASS;

    grid.forEach((d) => {
      const inMonth = d.getMonth() === this._viewMonth;
      const disabledDay = (minDay && d < minDay) || (maxDay && d > maxDay) ? true : false;
      const selected = value ? sameDay(d, value) : false;
      const isToday = sameDay(d, today);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "gridcell");
      btn.dataset.slot = "day";
      btn.dataset.outside = inMonth ? "false" : "true";
      btn.dataset.selected = selected ? "true" : "false";
      btn.dataset.today = isToday ? "true" : "false";
      btn.dataset.disabled = disabledDay ? "true" : "false";
      btn.dataset.day = String(d.getDay());
      btn.setAttribute("aria-selected", String(selected));
      btn.disabled = disabledDay;
      btn.className = DP_DAY_CLASS;
      btn.textContent = String(d.getDate());
      btn.addEventListener("click", () => {
        if (disabledDay) return;
        const iso = toIso(d);
        this.setAttribute("value", iso);
        this._open = false;
        this.dispatchEvent(
          new CustomEvent("nds-date-change", {
            detail: { value: iso },
            bubbles: true,
            composed: true,
          }),
        );
        this.scheduleUpdate();
      });
      gridEl.appendChild(btn);
    });
    panel.appendChild(gridEl);

    this._root.appendChild(panel);
    this._panel = panel;
  }

  protected update(): void {
    if (!this._root || !this._trigger || !this._triggerText) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value");
    const placeholder = this.getAttribute("placeholder") || "YYYY-MM-DD";
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");

    this._root.dataset.fullwidth = fullWidth ? "true" : "false";
    this._root.style.setProperty("--nds-date-picker-width", fullWidth ? "100%" : "auto");

    this._trigger.disabled = disabled;
    this._trigger.dataset.open = String(this._open);
    this._trigger.dataset.error = error ? "true" : "false";
    this._trigger.setAttribute("aria-expanded", String(this._open));

    this._triggerText.textContent = value || placeholder;
    this._triggerText.dataset.placeholder = value ? "false" : "true";

    this._renderPanel();
  }
}

define(NdsDatePicker);
