import React from "react";
import { InfoIcon, ThumbUpIcon, TestresultWarningIcon, ChevronRightIcon } from "@nudge-eap/icons";

/* ─── Constants ─── */

const TC_CLASS = "nds-tip-card";
const TC_ICON_CLASS = `${TC_CLASS}__icon`;
const TC_BODY_CLASS = `${TC_CLASS}__body`;
const TC_LABEL_CLASS = `${TC_CLASS}__label`;
const TC_TITLE_CLASS = `${TC_CLASS}__title`;
const TC_DESC_CLASS = `${TC_CLASS}__desc`;
const TC_ACTION_CLASS = `${TC_CLASS}__action`;

/* ─── Types ─── */

export type TipCardTone = "info" | "success" | "warning" | "neutral";

export interface TipCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 좌측 아이콘 (이모지/SVG). 미지정 시 tone 기본 */
  icon?: React.ReactNode;
  /** 톤 (배경/색) */
  tone?: TipCardTone;
  /** 작은 라벨 (예: "오늘의 팁", "인사이트") */
  label?: React.ReactNode;
  /** 제목 */
  title?: React.ReactNode;
  /** 본문 */
  description?: React.ReactNode;
  /** 우측 화살표/액션 버튼. 지정 시 카드 클릭 가능 */
  actionLabel?: string;
  /** 액션 클릭 콜백 (없어도 actionLabel만으로 표시 가능 — 그러면 카드 전체 onClick) */
  onAction?: () => void;
  /** 카드 전체 클릭 (onAction과 별도) */
  onClick?: () => void;
}

/* ─── Styles ─── */

const TONE_BG: Record<TipCardTone, string> = {
  info: "var(--semantic-bg-status-info)",
  success: "var(--semantic-bg-status-success)",
  warning: "var(--semantic-bg-status-caution)",
  neutral: "var(--semantic-bg-section-default)",
};

const TONE_FG: Record<TipCardTone, string> = {
  info: "var(--semantic-text-status-info)",
  success: "var(--semantic-text-status-success)",
  warning: "var(--semantic-text-status-caution)",
  neutral: "var(--semantic-text-subtle-default)",
};

const TONE_ICON_BG: Record<TipCardTone, string> = {
  info: "var(--semantic-fill-brand-default)",
  success: "var(--semantic-icon-status-success)",
  warning: "var(--semantic-icon-status-caution)",
  neutral: "var(--semantic-text-muted-default)",
};

const TONE_DEFAULT_ICON: Record<TipCardTone, React.ReactNode> = {
  info: <InfoIcon size={20} />,
  success: <ThumbUpIcon size={20} />,
  warning: <TestresultWarningIcon size={20} />,
  neutral: <InfoIcon size={20} />,
};
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const TipCard = React.forwardRef<HTMLDivElement, TipCardProps>(
  (
    {
      icon,
      tone = "info",
      label,
      title,
      description,
      actionLabel,
      onAction,
      onClick,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const iconNode = icon ?? TONE_DEFAULT_ICON[tone];
    const clickable = !!onClick;

    return (
      <div
        ref={ref}
        data-slot="root"
        data-tone={tone}
        data-clickable={clickable ? "true" : "false"}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (clickable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={cx(TC_CLASS, className)}
        style={
          {
            "--nds-tip-bg": TONE_BG[tone],
            "--nds-tip-fg": TONE_FG[tone],
            "--nds-tip-icon-bg": TONE_ICON_BG[tone],
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <span className={TC_ICON_CLASS} aria-hidden>
          {iconNode}
        </span>
        <div className={TC_BODY_CLASS}>
          {label && <p className={TC_LABEL_CLASS}>{label}</p>}
          {title && <p className={TC_TITLE_CLASS}>{title}</p>}
          {description && <p className={TC_DESC_CLASS}>{description}</p>}
        </div>
        {actionLabel && (
          <button
            type="button"
            className={TC_ACTION_CLASS}
            onClick={(e) => {
              e.stopPropagation();
              onAction?.();
            }}
          >
            <span>{actionLabel}</span>
            <ChevronRightIcon size={14} aria-hidden />
          </button>
        )}
      </div>
    );
  },
);

TipCard.displayName = "TipCard";
