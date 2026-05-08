import React, { useMemo } from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

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

/* ─── Types ─── */

export type EmotionLevel = 0 | 1 | 2 | 3 | 4;

export interface EmotionEntry {
  /** YYYY-MM-DD */
  date: string;
  /** 0 = 매우 낮음, 4 = 매우 좋음 (또는 0 = 기록 없음으로 사용) */
  level: EmotionLevel;
}

export interface EmotionHeatmapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 표시할 월 (`YYYY-MM`). 미지정 시 현재 월 */
  month?: string;
  /** 감정 데이터 */
  entries: EmotionEntry[];
  /** 카드 제목 */
  title?: React.ReactNode;
  /** 셀 클릭 콜백 */
  onCellClick?: (date: string, level: EmotionLevel) => void;
  /** 0 단계 셀을 빈 셀로 처리 (기록 없음) */
  treatZeroAsEmpty?: boolean;
  /** 5단계 색상 (옅음→짙음). 5개 필요 */
  colors?: [string, string, string, string, string];
  /** 범례 라벨 */
  legendLabels?: { low: string; high: string };
  /** 주 시작 요일 */
  weekStartsOn?: 0 | 1;
}

const DEFAULT_COLORS: [string, string, string, string, string] = [
  "#ECECF0",
  "#C9DBFF",
  "#92BBFF",
  "#5C97F2",
  "#2563DB",
];

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const heatmapStyles = `
  :where(.${HM_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]}px;
    padding: ${spacing[20]}px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${HM_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[12]}px;
  }

  :where(.${HM_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.text.default};
    margin: 0;
  }

  :where(.${HM_LEGEND_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.text.subtle};
  }

  :where(.${HM_LEGEND_ITEM_CLASS}) {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  :where(.${HM_GRID_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${HM_WEEKDAYS_CLASS}),
  :where(.${HM_CELLS_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: ${spacing[4]}px;
  }

  :where(.${HM_WEEKDAY_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.text.subtle};
    text-align: center;
  }

  :where(.${HM_CELL_CLASS}) {
    aspect-ratio: 1;
    width: 100%;
    border: none;
    background: var(--nds-heatmap-cell, ${DEFAULT_COLORS[0]});
    border-radius: 4px;
    cursor: pointer;
    transition: transform 120ms ease;
    padding: 0;
  }

  :where(.${HM_CELL_CLASS}[data-empty="true"]) {
    background: transparent;
    border: 1px dashed ${cv.border.light};
    cursor: default;
  }

  :where(.${HM_CELL_CLASS}[data-outside="true"]) {
    visibility: hidden;
  }

  :where(.${HM_CELL_CLASS}:hover:not([data-empty="true"]):not([data-outside="true"])) {
    transform: scale(1.1);
  }

  :where(.${HM_CELL_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: 2px;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Utils ─── */

const buildGrid = (year: number, month: number, weekStartsOn: 0 | 1) => {
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

/* ─── Component ─── */

export const EmotionHeatmap = React.forwardRef<HTMLDivElement, EmotionHeatmapProps>(
  (
    {
      month,
      entries,
      title,
      onCellClick,
      treatZeroAsEmpty = true,
      colors = DEFAULT_COLORS,
      legendLabels = { low: "낮음", high: "좋음" },
      weekStartsOn = 0,
      className,
      ...rest
    },
    ref,
  ) => {
    const { year, mIdx, ymTitle } = useMemo(() => {
      let year: number;
      let m: number;
      if (month) {
        const [y, mm] = month.split("-").map(Number);
        year = y;
        m = mm - 1;
      } else {
        const t = new Date();
        year = t.getFullYear();
        m = t.getMonth();
      }
      return { year, mIdx: m, ymTitle: `${year}년 ${m + 1}월` };
    }, [month]);

    const cells = useMemo(() => buildGrid(year, mIdx, weekStartsOn), [year, mIdx, weekStartsOn]);
    const map = useMemo(() => {
      const m = new Map<string, EmotionLevel>();
      entries.forEach((e) => m.set(e.date, e.level));
      return m;
    }, [entries]);

    const weekdayLabels =
      weekStartsOn === 1
        ? ["월", "화", "수", "목", "금", "토", "일"]
        : ["일", "월", "화", "수", "목", "금", "토"];

    return (
      <div ref={ref} data-slot="root" className={cx(HM_CLASS, className)} {...rest}>
        <div className={HM_HEADER_CLASS}>
          <p className={HM_TITLE_CLASS}>{title ?? ymTitle}</p>
          <div className={HM_LEGEND_CLASS} aria-label="범례">
            <span>{legendLabels.low}</span>
            {colors.map((c, i) => (
              <span key={i} className={HM_LEGEND_ITEM_CLASS} style={{ background: c }} />
            ))}
            <span>{legendLabels.high}</span>
          </div>
        </div>

        <div className={HM_GRID_CLASS}>
          <div className={HM_WEEKDAYS_CLASS}>
            {weekdayLabels.map((w) => (
              <div key={w} className={HM_WEEKDAY_CLASS}>
                {w}
              </div>
            ))}
          </div>
          <div className={HM_CELLS_CLASS}>
            {cells.map((c, i) => {
              if (c.outside) {
                return <span key={i} className={HM_CELL_CLASS} data-outside="true" aria-hidden />;
              }
              const level = map.get(c.date!);
              const empty = level === undefined || (treatZeroAsEmpty && level === 0);
              const color = empty ? "transparent" : colors[level ?? 0];
              return (
                <button
                  key={c.date}
                  type="button"
                  className={HM_CELL_CLASS}
                  data-empty={empty ? "true" : "false"}
                  aria-label={`${c.date} ${empty ? "기록 없음" : `단계 ${level}`}`}
                  style={{ background: color }}
                  disabled={empty && !onCellClick}
                  onClick={() => onCellClick?.(c.date!, (level ?? 0) as EmotionLevel)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

EmotionHeatmap.displayName = "EmotionHeatmap";
