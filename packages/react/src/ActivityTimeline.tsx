import React from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

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

// eslint-disable-next-line unused-imports/no-unused-vars
const timelineStyles = `
  :where(.${TL_CLASS}) {
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TL_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  :where(.${TL_ITEM_CLASS}) {
    display: flex;
    gap: ${spacing[12]}px;
    align-items: stretch;
  }

  :where(.${TL_RAIL_CLASS}) {
    flex-shrink: 0;
    width: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: ${spacing[2]}px;
  }

  :where(.${TL_DOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    color: ${cv.textRole.inverse};
    flex-shrink: 0;
  }

  :where(.${TL_DOT_CLASS}[data-status="completed"]) {
    background: ${cv.iconRole.statusSuccess};
  }
  :where(.${TL_DOT_CLASS}[data-status="ongoing"]) {
    background: ${cv.surface.brand};
    box-shadow: 0 0 0 4px ${cv.surface.brandSubtle};
  }
  :where(.${TL_DOT_CLASS}[data-status="warning"]) {
    background: ${cv.fill.statusCaution};
  }
  :where(.${TL_DOT_CLASS}[data-status="error"]) {
    background: ${cv.fill.statusError};
  }

  :where(.${TL_DOT_CLASS}) svg {
    width: 10px;
    height: 10px;
  }

  :where(.${TL_LINE_CLASS}) {
    flex: 1;
    width: 2px;
    background: ${cv.borderRole.subtle};
    margin-top: ${spacing[2]}px;
    min-height: ${spacing[16]}px;
  }

  :where(.${TL_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    padding-bottom: ${spacing[20]}px;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${TL_ITEM_CLASS}:last-child .${TL_BODY_CLASS}) {
    padding-bottom: 0;
  }

  :where(.${TL_DATE_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${TL_TITLE_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[8]}px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${TL_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.strong};
    margin: 0;
  }

  :where(.${TL_BADGE_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: ${spacing[2]}px ${spacing[8]}px;
    border-radius: ${radius.pill}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    background: ${cv.surface.page};
    color: ${cv.textRole.strong};
  }

  :where(.${TL_BADGE_CLASS}[data-status="completed"]) {
    background: ${cv.surface.statusSuccess};
    color: ${cv.iconRole.statusSuccess};
  }
  :where(.${TL_BADGE_CLASS}[data-status="ongoing"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
  }
  :where(.${TL_BADGE_CLASS}[data-status="warning"]) {
    background: ${cv.surface.statusCaution};
    color: ${cv.textRole.statusCaution};
  }
  :where(.${TL_BADGE_CLASS}[data-status="error"]) {
    background: ${cv.surface.statusError};
    color: ${cv.textRole.statusError};
  }
`;

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
