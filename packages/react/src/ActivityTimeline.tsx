import React from "react";

/* ─── Constants ─── */

const TL_CLASS = "nds-timeline";
const TL_LIST_CLASS = `${TL_CLASS}__list`;
const TL_ITEM_CLASS = `${TL_CLASS}__item`;
const TL_RAIL_CLASS = `${TL_CLASS}__rail`;
const TL_DOT_CLASS = `${TL_CLASS}__dot`;
const TL_LINE_CLASS = `${TL_CLASS}__line`;
const TL_BODY_CLASS = `${TL_CLASS}__body`;
const TL_DATE_CLASS = `${TL_CLASS}__date`;
const TL_TITLE_CLASS = `${TL_CLASS}__title`;
const TL_DESC_CLASS = `${TL_CLASS}__description`;
const TL_BADGE_CLASS = `${TL_CLASS}__badge`;

/* ─── Types ─── */

export type TimelineStatus = "default" | "completed" | "ongoing" | "warning" | "error";

export interface TimelineItem {
  /** 식별자 */
  key: string;
  /** 날짜/시간 */
  date: React.ReactNode;
  /** 제목 */
  title: React.ReactNode;
  /** 설명 */
  description?: React.ReactNode;
  /** 상태 (점/배지 색상) */
  status?: TimelineStatus;
  /** 상태 라벨 (제공 시 우측에 배지) */
  statusLabel?: React.ReactNode;
  /** 좌측 dot 자리 커스텀 아이콘 */
  icon?: React.ReactNode;
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

/* ─── Component ─── */

export interface ActivityTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 항목 목록 */
  items: TimelineItem[];
}

export const ActivityTimeline = React.forwardRef<HTMLDivElement, ActivityTimelineProps>(
  ({ items, className, ...rest }, ref) => {
    return (
      <div ref={ref} data-slot="root" className={cx(TL_CLASS, className)} {...rest}>
        <ol data-slot="list" className={TL_LIST_CLASS}>
          {items.map((it, idx) => {
            const isLast = idx === items.length - 1;
            const status = it.status ?? "default";
            return (
              <li key={it.key} data-slot="item" className={TL_ITEM_CLASS}>
                <div data-slot="rail" className={TL_RAIL_CLASS}>
                  <span data-slot="dot" data-status={status} className={TL_DOT_CLASS}>
                    {it.icon ?? (status === "completed" ? <CheckMark /> : null)}
                  </span>
                  {!isLast && (
                    <span data-slot="line" className={TL_LINE_CLASS} aria-hidden="true" />
                  )}
                </div>
                <div data-slot="body" className={TL_BODY_CLASS}>
                  <span data-slot="date" className={TL_DATE_CLASS}>
                    {it.date}
                  </span>
                  <span data-slot="title" className={TL_TITLE_CLASS}>
                    {it.title}
                    {it.statusLabel && (
                      <span data-slot="badge" data-status={status} className={TL_BADGE_CLASS}>
                        {it.statusLabel}
                      </span>
                    )}
                  </span>
                  {it.description && (
                    <p data-slot="description" className={TL_DESC_CLASS}>
                      {it.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

ActivityTimeline.displayName = "ActivityTimeline";
