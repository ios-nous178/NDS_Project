/**
 * <nds-calendar> — DS Calendar 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-calendar
 *     month="2026-05"
 *     value="2026-05-25"
 *     week-starts-on="0"
 *     markers='[{"date":"2026-05-10","color":"#FF6B6B"},{"date":"2026-05-15"}]'
 *     disabled-dates='["2026-05-31"]'
 *   ></nds-calendar>
 *
 * 이벤트:
 *   nds-calendar-change (detail: { value }) -> 날짜 선택
 *   nds-calendar-month-change (detail: { yearMonth }) -> 월 이동
 *
 * 속성:
 *   month: "YYYY-MM" (미지정 시 오늘)
 *   value: 선택값 "YYYY-MM-DD"
 *   week-starts-on: 0(일) | 1(월)
 *   markers: JSON 배열 ({ date, color? })
 *   disabled-dates: JSON 배열 (YYYY-MM-DD)
 *   hide-header: 헤더 숨김
 */

import { NdsElement, define } from "../base/nds-element.js";

const CL_CLASS = "nds-calendar";
const CL_HEADER_CLASS = `${CL_CLASS}__header`;
const CL_TITLE_CLASS = `${CL_CLASS}__title`;
const CL_NAV_CLASS = `${CL_CLASS}__nav`;
const CL_NAV_BTN_CLASS = `${CL_CLASS}__nav-btn`;
const CL_GRID_CLASS = `${CL_CLASS}__grid`;
const CL_WEEKDAYS_CLASS = `${CL_CLASS}__weekdays`;
const CL_WEEKDAY_CLASS = `${CL_CLASS}__weekday`;
const CL_DAYS_CLASS = `${CL_CLASS}__days`;
const CL_DAY_CLASS = `${CL_CLASS}__day`;
const CL_DAY_LABEL_CLASS = `${CL_CLASS}__day-label`;
const CL_DAY_DOT_CLASS = `${CL_CLASS}__day-dot`;

const WEEKDAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"];

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toIso = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`;

interface DayCell {
  iso: string;
  day: number;
  outside: boolean;
}

const buildGrid = (year: number, month: number, weekStartsOn: 0 | 1): DayCell[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay - weekStartsOn + 7) % 7;
  const cells: DayCell[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({
      iso: toIso(d.getFullYear(), d.getMonth(), d.getDate()),
      day: d.getDate(),
      outside: true,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ iso: toIso(year, month, d), day: d, outside: false });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const idx = cells.length - offset - daysInMonth + 1;
    const d = new Date(year, month + 1, idx);
    cells.push({
      iso: toIso(d.getFullYear(), d.getMonth(), d.getDate()),
      day: d.getDate(),
      outside: true,
    });
    if (cells.length >= 42) break;
  }
  return cells;
};

const Chevron = (dir: "left" | "right") => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    dir === "left"
      ? `<path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsCalendar extends NdsElement {
  static elementName = "nds-calendar";

  static get observedAttributes(): readonly string[] {
    return ["month", "value", "week-starts-on", "markers", "disabled-dates", "hide-header"];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.setAttribute("role", "grid");
    root.className = CL_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _currentMonth(): { year: number; month: number } {
    const raw = this.getAttribute("month");
    if (raw) {
      const [y, m] = raw.split("-").map(Number);
      if (!Number.isNaN(y) && !Number.isNaN(m)) return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }

  private _setMonth(delta: number): void {
    const { year, month } = this._currentMonth();
    const next = new Date(year, month + delta, 1);
    const ym = `${next.getFullYear()}-${pad2(next.getMonth() + 1)}`;
    this.setAttribute("month", ym);
    this.dispatchEvent(
      new CustomEvent("nds-calendar-month-change", {
        detail: { yearMonth: ym },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _parseMarkers(): Map<string, string | undefined> {
    const map = new Map<string, string | undefined>();
    const raw = this.getAttribute("markers");
    if (!raw) return map;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return map;
      parsed.forEach((m) => {
        if (m && typeof m.date === "string") {
          map.set(m.date, typeof m.color === "string" ? m.color : undefined);
        }
      });
    } catch {
      /* ignore */
    }
    return map;
  }

  private _parseDisabledDates(): Set<string> {
    const set = new Set<string>();
    const raw = this.getAttribute("disabled-dates");
    if (!raw) return set;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) parsed.forEach((d) => typeof d === "string" && set.add(d));
    } catch {
      /* ignore */
    }
    return set;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const { year, month } = this._currentMonth();
    const value = this.getAttribute("value");
    const weekStartsOn = (parseInt(this.attr("week-starts-on", "0"), 10) || 0) === 1 ? 1 : 0;
    const hideHeader = this.boolAttr("hide-header");
    const markers = this._parseMarkers();
    const disabledSet = this._parseDisabledDates();

    const today = new Date();
    const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());
    const cells = buildGrid(year, month, weekStartsOn);

    this._root.setAttribute("aria-label", `${year}년 ${month + 1}월 캘린더`);
    this._root.innerHTML = "";

    if (!hideHeader) {
      const header = document.createElement("div");
      header.dataset.slot = "header";
      header.className = CL_HEADER_CLASS;

      const title = document.createElement("h2");
      title.className = CL_TITLE_CLASS;
      title.textContent = `${year}년 ${month + 1}월`;

      const nav = document.createElement("div");
      nav.className = CL_NAV_CLASS;

      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = CL_NAV_BTN_CLASS;
      prev.setAttribute("aria-label", "이전 달");
      prev.appendChild(Chevron("left"));
      prev.addEventListener("click", () => this._setMonth(-1));

      const next = document.createElement("button");
      next.type = "button";
      next.className = CL_NAV_BTN_CLASS;
      next.setAttribute("aria-label", "다음 달");
      next.appendChild(Chevron("right"));
      next.addEventListener("click", () => this._setMonth(1));

      nav.append(prev, next);
      header.append(title, nav);
      this._root.appendChild(header);
    }

    const grid = document.createElement("div");
    grid.className = CL_GRID_CLASS;

    const weekdaysRow = document.createElement("div");
    weekdaysRow.setAttribute("role", "row");
    weekdaysRow.className = CL_WEEKDAYS_CLASS;
    const labels =
      weekStartsOn === 1
        ? [...WEEKDAY_LABELS_KO.slice(1), WEEKDAY_LABELS_KO[0]]
        : WEEKDAY_LABELS_KO;
    labels.forEach((w) => {
      const cell = document.createElement("div");
      cell.setAttribute("role", "columnheader");
      cell.className = CL_WEEKDAY_CLASS;
      cell.textContent = w;
      weekdaysRow.appendChild(cell);
    });
    grid.appendChild(weekdaysRow);

    const days = document.createElement("div");
    days.setAttribute("role", "rowgroup");
    days.className = CL_DAYS_CLASS;

    cells.forEach((c) => {
      const disabled = disabledSet.has(c.iso);
      const selected = value === c.iso;
      const isToday = c.iso === todayIso;
      const markerColor = markers.get(c.iso);
      const hasMarker = markers.has(c.iso);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "gridcell");
      btn.dataset.slot = "day";
      btn.dataset.outside = c.outside ? "true" : "false";
      btn.dataset.today = isToday ? "true" : "false";
      btn.dataset.selected = selected ? "true" : "false";
      btn.className = CL_DAY_CLASS;
      btn.disabled = disabled;
      btn.setAttribute("aria-pressed", String(selected));
      btn.setAttribute("aria-label", c.iso);
      btn.addEventListener("click", () => {
        if (disabled) return;
        this.setAttribute("value", c.iso);
        this.dispatchEvent(
          new CustomEvent("nds-calendar-change", {
            detail: { value: c.iso },
            bubbles: true,
            composed: true,
          }),
        );
      });

      const labelSpan = document.createElement("span");
      labelSpan.className = CL_DAY_LABEL_CLASS;
      labelSpan.textContent = String(c.day);
      btn.appendChild(labelSpan);

      if (hasMarker) {
        const dot = document.createElement("span");
        dot.className = CL_DAY_DOT_CLASS;
        if (markerColor) dot.style.setProperty("--nds-calendar-marker", markerColor);
        btn.appendChild(dot);
      }

      days.appendChild(btn);
    });

    grid.appendChild(days);
    this._root.appendChild(grid);
  }
}

define(NdsCalendar);
