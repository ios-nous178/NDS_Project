import React from "react";

/* ─── Constants ─── */

const TL_CLASS = "nds-timeline";
const TL_ITEM_CLASS = `${TL_CLASS}__item`;
const TL_INDICATOR_CLASS = `${TL_CLASS}__indicator`;
const TL_DOT_CLASS = `${TL_CLASS}__dot`;
const TL_LINE_CLASS = `${TL_CLASS}__line`;
const TL_BODY_CLASS = `${TL_CLASS}__body`;
const TL_DATE_CLASS = `${TL_CLASS}__date`;
const TL_TITLE_CLASS = `${TL_CLASS}__title`;
const TL_DESC_CLASS = `${TL_CLASS}__description`;
const TL_BADGE_CLASS = `${TL_CLASS}__badge`;

/* ─── Types ─── */

/** activity: 시간순 이벤트 로그 / tracker: 정해진 단계 진행(현재 인덱스) */
export type TimelineMode = "activity" | "tracker";
export type TimelineDirection = "vertical" | "horizontal";
/** activity 모드의 per-item 명시 상태 (tracker 는 current 로 파생) */
export type TimelineStatus = "default" | "completed" | "ongoing" | "warning" | "error";

export interface TimelineItem {
  /** 식별자 */
  key: string;
  /** 이벤트/단계 이름 */
  title: React.ReactNode;
  /** 시점/타임스탬프 (날짜·시각) */
  date?: React.ReactNode;
  /** 설명 */
  description?: React.ReactNode;
  /** activity 모드: 점/배지 상태 색 (tracker 모드에선 무시 — current 로 파생) */
  status?: TimelineStatus;
  /** activity 모드: 제공 시 제목 우측 배지 */
  statusLabel?: React.ReactNode;
  /** activity 모드: 좌측 dot 자리 커스텀 아이콘 */
  icon?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  /** 항목 목록 */
  items: TimelineItem[];
  /** 표시 모드 (기본 activity) */
  mode?: TimelineMode;
  /** 방향 (기본 vertical — horizontal 은 tracker 모드에서 의미) */
  direction?: TimelineDirection;
  /** tracker 모드: 현재 진행 인덱스 (0-based). 이전=done, 같음=current, 이후=todo */
  current?: number;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const CheckMark = () => (
  <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M2 5L4 7L8 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const trackerState = (idx: number, current: number): "done" | "current" | "todo" => {
  if (idx < current) return "done";
  if (idx === current) return "current";
  return "todo";
};

/* ─── Component ─── */

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, mode = "activity", direction = "vertical", current = 0, className, ...rest }, ref) => {
    const isTracker = mode === "tracker";
    // activity 모드는 vertical 전용
    const dir: TimelineDirection = isTracker ? direction : "vertical";

    return (
      <ol
        ref={ref}
        data-slot="root"
        data-mode={mode}
        data-direction={dir}
        role="list"
        className={cx(TL_CLASS, className)}
        {...rest}
      >
        {items.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === items.length - 1;
          const state = isTracker ? trackerState(idx, current) : undefined;
          const status = !isTracker ? (item.status ?? "default") : undefined;

          // tracker horizontal: 양쪽 half-line / vertical & activity: 단일 down-line
          const leftLineState = isFirst ? "hidden" : idx <= current ? "done" : "todo";
          const rightLineState = isLast ? "hidden" : idx < current ? "done" : "todo";

          return (
            <li
              key={item.key}
              data-slot="item"
              data-mode={mode}
              data-state={state}
              data-status={status}
              aria-current={state === "current" ? "step" : undefined}
              className={TL_ITEM_CLASS}
            >
              <div data-slot="indicator" className={TL_INDICATOR_CLASS}>
                {isTracker && dir === "horizontal" && (
                  <span className={TL_LINE_CLASS} data-state={leftLineState} aria-hidden="true" />
                )}
                <span
                  data-slot="dot"
                  data-state={state}
                  data-status={status}
                  className={TL_DOT_CLASS}
                  aria-hidden="true"
                >
                  {isTracker
                    ? state === "done"
                      ? <CheckMark />
                      : idx + 1
                    : (item.icon ?? (status === "completed" ? <CheckMark /> : null))}
                </span>
                {isTracker && dir === "horizontal" && (
                  <span className={TL_LINE_CLASS} data-state={rightLineState} aria-hidden="true" />
                )}
                {dir === "vertical" && !isLast && (
                  <span
                    className={TL_LINE_CLASS}
                    data-state={isTracker ? rightLineState : undefined}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div data-slot="body" className={TL_BODY_CLASS}>
                {item.date !== undefined && (
                  <span data-slot="date" className={TL_DATE_CLASS}>
                    {item.date}
                  </span>
                )}
                <span data-slot="title" data-state={state} className={TL_TITLE_CLASS}>
                  {item.title}
                  {item.statusLabel && (
                    <span data-slot="badge" data-status={status} className={TL_BADGE_CLASS}>
                      {item.statusLabel}
                    </span>
                  )}
                </span>
                {item.description !== undefined && (
                  <p data-slot="description" className={TL_DESC_CLASS}>
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);

Timeline.displayName = "Timeline";
