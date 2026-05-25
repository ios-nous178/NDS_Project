/**
 * <nds-emotion-heatmap> — DS EmotionHeatmap 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-emotion-heatmap
 *     month="2026-05"
 *     entries='[{"date":"2026-05-01","level":2},{"date":"2026-05-02","level":4}]'
 *     title="이번 달 감정 기록"
 *     week-starts-on="0"
 *     treat-zero-as-empty>
 *   </nds-emotion-heatmap>
 *
 * 이벤트:
 *   cell 클릭 → "heatmap-cell-click" CustomEvent (detail: { date, level }).
 *
 * 속성:
 *   month: YYYY-MM (없으면 현재 월)
 *   entries: JSON 배열 — [{ date: "YYYY-MM-DD", level: 0..4 }]
 *   title: 헤더 라벨 (없으면 "YYYY년 M월")
 *   treat-zero-as-empty: 0 단계를 "기록 없음"으로 처리
 *   colors: JSON 배열 5개 (옅음→짙음)
 *   low-label / high-label: 범례 라벨
 *   week-starts-on: 0 (일) | 1 (월)
 */

import { NdsElement, define } from "../base/nds-element.js";

const HM_CLASS = "nds-emotion-heatmap";
const HM_HEADER_CLASS = `${HM_CLASS}__header`;
const HM_TITLE_CLASS = `${HM_CLASS}__title`;
const HM_LEGEND_CLASS = `${HM_CLASS}__legend`;
const HM_LEGEND_ITEM_CLASS = `${HM_CLASS}__legend-item`;
const HM_GRID_CLASS = `${HM_CLASS}__grid`;
const HM_WEEKDAYS_CLASS = `${HM_CLASS}__weekdays`;
const HM_WEEKDAY_CLASS = `${HM_CLASS}__weekday`;
const HM_CELLS_CLASS = `${HM_CLASS}__cells`;
const HM_CELL_CLASS = `${HM_CLASS}__cell`;

type EmotionLevel = 0 | 1 | 2 | 3 | 4;

interface EmotionEntry {
  date: string;
  level: EmotionLevel;
}

const DEFAULT_COLORS: [string, string, string, string, string] = [
  "#ECECF0",
  "#C9DBFF",
  "#92BBFF",
  "#5C97F2",
  "#2563DB",
];

const buildGrid = (
  year: number,
  month: number,
  weekStartsOn: 0 | 1,
): Array<{ date?: string; outside: boolean }> => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay - weekStartsOn + 7) % 7;
  const cells: Array<{ date?: string; outside: boolean }> = [];
  for (let i = 0; i < offset; i++) cells.push({ outside: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date: iso, outside: false });
  }
  while (cells.length % 7 !== 0) cells.push({ outside: true });
  return cells;
};

export class NdsEmotionHeatmap extends NdsElement {
  static elementName = "nds-emotion-heatmap";

  static get observedAttributes(): readonly string[] {
    return [
      "month",
      "entries",
      "title",
      "treat-zero-as-empty",
      "colors",
      "low-label",
      "high-label",
      "week-starts-on",
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
    root.className = HM_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseEntries(): EmotionEntry[] {
    const raw = this.getAttribute("entries");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as EmotionEntry[];
    } catch {
      /* ignore */
    }
    return [];
  }

  private _parseColors(): [string, string, string, string, string] {
    const raw = this.getAttribute("colors");
    if (!raw) return DEFAULT_COLORS;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 5) {
        return parsed as [string, string, string, string, string];
      }
    } catch {
      /* ignore */
    }
    return DEFAULT_COLORS;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const monthAttr = this.getAttribute("month");
    let year: number;
    let mIdx: number;
    if (monthAttr) {
      const [y, mm] = monthAttr.split("-").map(Number);
      year = y;
      mIdx = (mm || 1) - 1;
    } else {
      const t = new Date();
      year = t.getFullYear();
      mIdx = t.getMonth();
    }
    const ymTitle = `${year}년 ${mIdx + 1}월`;
    const title = this.getAttribute("title") || ymTitle;

    const weekStartsOn: 0 | 1 = this.attr("week-starts-on", "0") === "1" ? 1 : 0;
    const treatZeroAsEmpty = this.boolAttr("treat-zero-as-empty");
    const lowLabel = this.attr("low-label", "낮음");
    const highLabel = this.attr("high-label", "좋음");
    const colors = this._parseColors();

    const entries = this._parseEntries();
    const entryMap = new Map<string, EmotionLevel>();
    entries.forEach((e) => entryMap.set(e.date, e.level));

    const cells = buildGrid(year, mIdx, weekStartsOn);

    const weekdayLabels =
      weekStartsOn === 1
        ? ["월", "화", "수", "목", "금", "토", "일"]
        : ["일", "월", "화", "수", "목", "금", "토"];

    // Header
    const header = document.createElement("div");
    header.className = HM_HEADER_CLASS;
    const titleEl = document.createElement("p");
    titleEl.className = HM_TITLE_CLASS;
    titleEl.textContent = title;
    header.appendChild(titleEl);

    const legend = document.createElement("div");
    legend.className = HM_LEGEND_CLASS;
    legend.setAttribute("aria-label", "범례");
    const lowSpan = document.createElement("span");
    lowSpan.textContent = lowLabel;
    legend.appendChild(lowSpan);
    colors.forEach((c) => {
      const item = document.createElement("span");
      item.className = HM_LEGEND_ITEM_CLASS;
      item.style.background = c;
      legend.appendChild(item);
    });
    const highSpan = document.createElement("span");
    highSpan.textContent = highLabel;
    legend.appendChild(highSpan);
    header.appendChild(legend);

    // Grid
    const grid = document.createElement("div");
    grid.className = HM_GRID_CLASS;

    const weekdaysEl = document.createElement("div");
    weekdaysEl.className = HM_WEEKDAYS_CLASS;
    weekdayLabels.forEach((w) => {
      const d = document.createElement("div");
      d.className = HM_WEEKDAY_CLASS;
      d.textContent = w;
      weekdaysEl.appendChild(d);
    });
    grid.appendChild(weekdaysEl);

    const cellsEl = document.createElement("div");
    cellsEl.className = HM_CELLS_CLASS;
    cells.forEach((c) => {
      if (c.outside) {
        const span = document.createElement("span");
        span.className = HM_CELL_CLASS;
        span.dataset.outside = "true";
        span.setAttribute("aria-hidden", "true");
        cellsEl.appendChild(span);
        return;
      }
      const level = entryMap.get(c.date!);
      const empty = level === undefined || (treatZeroAsEmpty && level === 0);
      const color = empty ? "transparent" : colors[level ?? 0];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = HM_CELL_CLASS;
      btn.dataset.empty = empty ? "true" : "false";
      btn.setAttribute("aria-label", `${c.date} ${empty ? "기록 없음" : `단계 ${level}`}`);
      btn.style.background = color;
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("heatmap-cell-click", {
            detail: { date: c.date, level: (level ?? 0) as EmotionLevel },
            bubbles: true,
            composed: true,
          }),
        );
      });
      cellsEl.appendChild(btn);
    });
    grid.appendChild(cellsEl);

    this._root.replaceChildren(header, grid);
  }
}

define(NdsEmotionHeatmap);
