import React from "react";
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const OI_CLASS = "nds-online-indicator";
const OI_DOT_CLASS = `${OI_CLASS}__dot`;
const OI_LABEL_CLASS = `${OI_CLASS}__label`;

/* ─── Types ─── */

export type PresenceStatus = "online" | "away" | "busy" | "offline";

export interface OnlineIndicatorProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** 상태 */
  status: PresenceStatus;
  /** 라벨 표시 (지정 시 텍스트도 옆에) */
  showLabel?: boolean;
  /** 라벨 오버라이드 */
  label?: string;
  /** 점 크기 px (기본 8) */
  size?: number;
}

const STATUS_COLOR: Record<PresenceStatus, string> = {
  online: "var(--semantic-icon-status-success)",
  away: "var(--semantic-icon-status-caution)",
  busy: "var(--semantic-icon-status-error)",
  offline: "#A0A4AC",
};

const STATUS_LABEL: Record<PresenceStatus, string> = {
  online: "온라인",
  away: "자리비움",
  busy: "상담 중",
  offline: "오프라인",
};

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const oiStyles = `
  :where(.${OI_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-family: ${fontFamily.web};
  }

  :where(.${OI_DOT_CLASS}) {
    width: var(--nds-presence-size, 8px);
    height: var(--nds-presence-size, 8px);
    border-radius: 9999px;
    background: var(--nds-presence-color, #A0A4AC);
    box-shadow: 0 0 0 2px var(--nds-presence-ring, transparent);
    flex-shrink: 0;
  }

  :where(.${OI_DOT_CLASS}[data-status="online"]) {
    animation: nds-presence-pulse 1.6s ease-in-out infinite;
  }

  @keyframes nds-presence-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(43, 170, 72, 0.45); }
    50% { box-shadow: 0 0 0 4px rgba(43, 170, 72, 0); }
  }

  :where(.${OI_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const OnlineIndicator = React.forwardRef<HTMLSpanElement, OnlineIndicatorProps>(
  ({ status, showLabel = false, label, size = 8, className, style, ...rest }, ref) => {
    const color = STATUS_COLOR[status];
    const text = label ?? STATUS_LABEL[status];
    const ariaLabel = (rest["aria-label"] as string | undefined) ?? text;

    return (
      <span
        ref={ref}
        data-slot="root"
        className={cx(OI_CLASS, className)}
        style={
          {
            "--nds-presence-color": color,
            "--nds-presence-size": `${size}px`,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
        aria-label={ariaLabel}
      >
        <span className={OI_DOT_CLASS} data-status={status} aria-hidden />
        {showLabel && <span className={OI_LABEL_CLASS}>{text}</span>}
      </span>
    );
  },
);

OnlineIndicator.displayName = "OnlineIndicator";
