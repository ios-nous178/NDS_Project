import React from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";
import {
  InfoIcon,
  ThumbUpIcon,
  TestresultWarningIcon,
  BlockIcon,
  PushIcon,
} from "@nudge-eap/icons";

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
  info: "var(--semantic-info-bg, #EBF1FF)",
  success: "var(--semantic-success-bg, #E5F8E9)",
  warning: "var(--semantic-caution-bg, #FFF4E0)",
  error: "var(--semantic-error-bg, #FFE9E9)",
  system: "#F2F4F6",
};

const KIND_FG: Record<NotificationKind, string> = {
  info: "var(--semantic-info-main, #4080F0)",
  success: "var(--semantic-success-main, #2BAA48)",
  warning: "var(--semantic-caution-main, #F0A030)",
  error: "var(--semantic-error-main, #E04D4D)",
  system: "#666",
};

const KIND_ICON: Record<NotificationKind, React.ReactNode> = {
  info: <InfoIcon size={20} />,
  success: <ThumbUpIcon size={20} />,
  warning: <TestresultWarningIcon size={20} />,
  error: <BlockIcon size={20} />,
  system: <PushIcon size={20} />,
};

// eslint-disable-next-line unused-imports/no-unused-vars
const niStyles = `
  :where(.${NI_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: ${spacing[12]}px;
    padding: ${spacing[16]}px;
    background: ${cv.bg.white};
    border-bottom: 1px solid ${cv.border.light};
    font-family: ${fontFamily.web};
    transition: background-color ${transition.default};
    box-sizing: border-box;
    position: relative;
  }

  :where(.${NI_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${NI_CLASS}[data-clickable="true"]:hover) { background: ${cv.bg.coolGray}; }

  :where(.${NI_CLASS}[data-unread="true"]) {
    background: var(--semantic-primary-bg, #EBF1FF);
  }

  :where(.${NI_CLASS}[data-unread="true"][data-clickable="true"]:hover) {
    background: var(--semantic-primary-bg-hover, #DDE7FF);
  }

  :where(.${NI_DOT_CLASS}) {
    position: absolute;
    top: ${spacing[16]}px;
    left: 4px;
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: var(--semantic-error-main, #E04D4D);
  }

  :where(.${NI_ICON_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: var(--nds-noti-icon-bg, ${KIND_BG.info});
    color: var(--nds-noti-icon-fg, ${KIND_FG.info});
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  :where(.${NI_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${NI_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.text.default};
    margin: 0;
  }

  :where(.${NI_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.subtle};
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  :where(.${NI_TIME_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.text.subtle};
    margin-top: ${spacing[4]}px;
  }
`;

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
