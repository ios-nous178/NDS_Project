import React from "react";
import {
  InfoIcon,
  ThumbUpIcon,
  TestresultWarningIcon,
  BlockIcon,
  PushIcon,
} from "@nudge-design/icons";

/* ─── Constants ─── */

const NI_CLASS = "nds-notification-item";
const NI_ICON_CLASS = `${NI_CLASS}__icon`;
const NI_BODY_CLASS = `${NI_CLASS}__body`;
const NI_TITLE_CLASS = `${NI_CLASS}__title`;
const NI_DESC_CLASS = `${NI_CLASS}__desc`;
const NI_TIME_CLASS = `${NI_CLASS}__time`;
const NI_DOT_CLASS = `${NI_CLASS}__dot`;

/* ─── Types ─── */

export type NotificationKind = "info" | "success" | "warning" | "error" | "system";

export interface NotificationItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 종류 (아이콘 색 자동) */
  kind?: NotificationKind;
  /** 좌측 아이콘 (이모지/Icon). 미지정 시 kind별 기본 */
  icon?: React.ReactNode;
  /** 제목 */
  title: React.ReactNode;
  /** 본문/설명 */
  description?: React.ReactNode;
  /** 시간 라벨 (예: "방금 전", "3분 전", "오후 3:42") */
  time?: React.ReactNode;
  /** 미읽음 여부 (좌측 점) */
  unread?: boolean;
  /** 클릭 콜백 */
  onClick?: () => void;
}

/* ─── Styles ─── */

const KIND_BG: Record<NotificationKind, string> = {
  info: "var(--semantic-bg-status-info)",
  success: "var(--semantic-bg-status-success)",
  warning: "var(--semantic-bg-status-caution)",
  error: "var(--semantic-bg-status-error)",
  system: "var(--semantic-bg-section-default)",
};

const KIND_FG: Record<NotificationKind, string> = {
  info: "var(--semantic-fill-brand-default)",
  success: "var(--semantic-icon-status-success)",
  warning: "var(--semantic-icon-status-caution)",
  error: "var(--semantic-icon-status-error)",
  system: "var(--semantic-text-subtle-default)",
};

const KIND_ICON: Record<NotificationKind, React.ReactNode> = {
  info: <InfoIcon size={20} />,
  success: <ThumbUpIcon size={20} />,
  warning: <TestresultWarningIcon size={20} />,
  error: <BlockIcon size={20} />,
  system: <PushIcon size={20} />,
};
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  (
    {
      kind = "info",
      icon,
      title,
      description,
      time,
      unread = false,
      onClick,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const iconBg = KIND_BG[kind];
    const iconFg = KIND_FG[kind];
    const iconNode = icon ?? KIND_ICON[kind];

    return (
      <div
        ref={ref}
        data-slot="root"
        data-clickable={onClick ? "true" : "false"}
        data-unread={unread ? "true" : "false"}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
        className={cx(NI_CLASS, className)}
        style={
          {
            "--nds-noti-icon-bg": iconBg,
            "--nds-noti-icon-fg": iconFg,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {unread && <span className={NI_DOT_CLASS} aria-label="새 알림" />}
        <span className={NI_ICON_CLASS} aria-hidden>
          {iconNode}
        </span>
        <div className={NI_BODY_CLASS}>
          <p className={NI_TITLE_CLASS}>{title}</p>
          {description && <p className={NI_DESC_CLASS}>{description}</p>}
          {time && <span className={NI_TIME_CLASS}>{time}</span>}
        </div>
      </div>
    );
  },
);

NotificationItem.displayName = "NotificationItem";
