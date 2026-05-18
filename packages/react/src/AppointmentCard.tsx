import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const AC_CLASS = "nds-appointment-card";
const AC_DATE_CLASS = `${AC_CLASS}__date`;
const AC_DATE_DAY_CLASS = `${AC_CLASS}__date-day`;
const AC_DATE_MONTH_CLASS = `${AC_CLASS}__date-month`;
const AC_DATE_WEEKDAY_CLASS = `${AC_CLASS}__date-weekday`;
const AC_BODY_CLASS = `${AC_CLASS}__body`;
const AC_TITLE_CLASS = `${AC_CLASS}__title`;
const AC_META_CLASS = `${AC_CLASS}__meta`;
const AC_META_ROW_CLASS = `${AC_CLASS}__meta-row`;
const AC_FOOTER_CLASS = `${AC_CLASS}__footer`;
const AC_STATUS_CLASS = `${AC_CLASS}__status`;
const AC_ACTIONS_CLASS = `${AC_CLASS}__actions`;
const AC_ACTION_CLASS = `${AC_CLASS}__action`;

/* ─── Types ─── */

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "canceled";

export type AppointmentMode = "video" | "phone" | "chat" | "in-person";

export interface AppointmentAction {
  /** 라벨 */
  label: string;
  /** 클릭 콜백 */
  onClick: () => void;
  /** 강조 (1차 액션) */
  primary?: boolean;
}

export interface AppointmentCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** ISO 날짜 (YYYY-MM-DD) */
  date: string;
  /** 시작 시간 (HH:mm) */
  startTime: string;
  /** 종료 시간 (HH:mm, 선택) */
  endTime?: string;
  /** 상담사/세션 제목 */
  title: React.ReactNode;
  /** 상담 방식 */
  mode?: AppointmentMode;
  /** 장소 (in-person 모드일 때) 또는 보조 정보 */
  location?: React.ReactNode;
  /** 상태 */
  status?: AppointmentStatus;
  /** 카드 우측 하단 액션 */
  actions?: AppointmentAction[];
  /** 카드 자체 클릭 (디테일 진입) */
  onClick?: () => void;
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "예약됨",
  confirmed: "확정",
  "in-progress": "진행 중",
  completed: "완료",
  canceled: "취소됨",
};

const STATUS_COLORS: Record<AppointmentStatus, { bg: string; fg: string }> = {
  scheduled: {
    bg: "var(--semantic-bg-status-info)",
    fg: "var(--semantic-text-status-info)",
  },
  confirmed: {
    bg: "var(--semantic-bg-status-success)",
    fg: "var(--semantic-text-status-success)",
  },
  "in-progress": {
    bg: "var(--semantic-bg-status-caution)",
    fg: "var(--semantic-text-status-caution)",
  },
  completed: {
    bg: "var(--semantic-bg-section-default)",
    fg: "var(--semantic-text-subtle-default)",
  },
  canceled: {
    bg: "var(--semantic-bg-status-error)",
    fg: "var(--semantic-text-status-error)",
  },
};

const MODE_LABEL: Record<AppointmentMode, string> = {
  video: "화상 상담",
  phone: "전화 상담",
  chat: "채팅 상담",
  "in-person": "방문 상담",
};

const MODE_ICONS: Record<AppointmentMode, string> = {
  video: "📹",
  phone: "📞",
  chat: "💬",
  "in-person": "📍",
};

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const apptStyles = `
  :where(.${AC_CLASS}) {
    display: flex;
    align-items: stretch;
    gap: ${spacing[16]}px;
    padding: ${spacing[16]}px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default}, box-shadow ${transition.default};
    box-sizing: border-box;
  }

  :where(.${AC_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${AC_CLASS}[data-clickable="true"]:hover) {
    border-color: ${cv.borderRole.brand};
  }

  :where(.${AC_CLASS}[data-status="canceled"]) {
    opacity: 0.7;
  }

  :where(.${AC_DATE_CLASS}) {
    flex-shrink: 0;
    width: 56px;
    background: ${cv.surface.section};
    border-radius: ${radius.md}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${spacing[8]}px;
    gap: 2px;
  }

  :where(.${AC_DATE_DAY_CLASS}) {
    font-size: 22px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${AC_DATE_MONTH_CLASS}) {
    font-size: 11px;
    line-height: 1;
    color: ${cv.textRole.subtle};
    text-transform: uppercase;
  }

  :where(.${AC_DATE_WEEKDAY_CLASS}) {
    font-size: 11px;
    line-height: 1;
    color: ${cv.textRole.subtle};
    margin-top: 2px;
  }

  :where(.${AC_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
  }

  :where(.${AC_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${AC_META_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: ${spacing[4]}px;
  }

  :where(.${AC_META_ROW_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
  }

  :where(.${AC_FOOTER_CLASS}) {
    margin-top: ${spacing[8]}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[8]}px;
  }

  :where(.${AC_STATUS_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    background: var(--nds-appt-status-bg, var(--semantic-bg-section-default));
    color: var(--nds-appt-status-fg, #666);
  }

  :where(.${AC_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[8]}px;
  }

  :where(.${AC_ACTION_CLASS}) {
    height: 32px;
    padding: 0 ${spacing[12]}px;
    border-radius: ${radius.md}px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AC_ACTION_CLASS}[data-primary="true"]) {
    background: ${cv.surface.brand};
    color: #fff;
    border-color: transparent;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const KO_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/* ─── Component ─── */

export const AppointmentCard = React.forwardRef<HTMLDivElement, AppointmentCardProps>(
  (
    {
      date,
      startTime,
      endTime,
      title,
      mode,
      location,
      status = "scheduled",
      actions,
      onClick,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const d = new Date(`${date}T${startTime}:00`);
    const day = String(d.getDate()).padStart(2, "0");
    const monthShort = d.toLocaleString("en-US", { month: "short" });
    const weekday = KO_WEEKDAYS[d.getDay()];
    const statusColor = STATUS_COLORS[status];

    const styleVars: React.CSSProperties = {
      "--nds-appt-status-bg": statusColor.bg,
      "--nds-appt-status-fg": statusColor.fg,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        data-slot="root"
        data-status={status}
        data-clickable={onClick ? "true" : "false"}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
        className={cx(AC_CLASS, className)}
        style={styleVars}
        {...rest}
      >
        <div className={AC_DATE_CLASS} aria-hidden>
          <span className={AC_DATE_MONTH_CLASS}>{monthShort}</span>
          <span className={AC_DATE_DAY_CLASS}>{day}</span>
          <span className={AC_DATE_WEEKDAY_CLASS}>{weekday}</span>
        </div>
        <div className={AC_BODY_CLASS}>
          <h3 className={AC_TITLE_CLASS}>{title}</h3>
          <div className={AC_META_CLASS}>
            <div className={AC_META_ROW_CLASS}>
              <span aria-hidden>🕐</span>
              <span>
                {startTime}
                {endTime ? ` - ${endTime}` : ""}
              </span>
            </div>
            {mode && (
              <div className={AC_META_ROW_CLASS}>
                <span aria-hidden>{MODE_ICONS[mode]}</span>
                <span>{MODE_LABEL[mode]}</span>
              </div>
            )}
            {location && (
              <div className={AC_META_ROW_CLASS}>
                <span aria-hidden>📍</span>
                <span>{location}</span>
              </div>
            )}
          </div>
          <div className={AC_FOOTER_CLASS}>
            <span className={AC_STATUS_CLASS}>{STATUS_LABEL[status]}</span>
            {actions && actions.length > 0 && (
              <div className={AC_ACTIONS_CLASS} onClick={(e) => e.stopPropagation()}>
                {actions.map((a, i) => (
                  <button
                    key={i}
                    type="button"
                    className={AC_ACTION_CLASS}
                    data-primary={a.primary ? "true" : "false"}
                    onClick={a.onClick}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

AppointmentCard.displayName = "AppointmentCard";
