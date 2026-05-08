import React from "react";
import { fontFamily, fontWeight, radius, spacing, transition, typeScale } from "@nudge-eap/tokens";

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
  info: "var(--color-semantic-info-bg, #EBF1FF)",
  success: "var(--color-semantic-success-bg, #E5F8E9)",
  warning: "var(--color-semantic-caution-bg, #FFF4E0)",
  neutral: "#F2F4F6",
};

const TONE_FG: Record<TipCardTone, string> = {
  info: "var(--color-semantic-info-text, #1F4FB8)",
  success: "var(--color-semantic-success-text, #1A6D2C)",
  warning: "var(--color-semantic-caution-text, #8C5B00)",
  neutral: "#444",
};

const TONE_ICON_BG: Record<TipCardTone, string> = {
  info: "var(--color-semantic-info-main, #4080F0)",
  success: "var(--color-semantic-success-main, #2BAA48)",
  warning: "var(--color-semantic-caution-main, #F0A030)",
  neutral: "#888",
};

const TONE_DEFAULT_ICON: Record<TipCardTone, string> = {
  info: "💡",
  success: "✨",
  warning: "💭",
  neutral: "ℹ️",
};

// eslint-disable-next-line unused-imports/no-unused-vars
const tcStyles = `
  :where(.${TC_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: ${spacing[12]}px;
    padding: ${spacing[16]}px;
    background: var(--nds-tip-bg, ${TONE_BG.info});
    color: var(--nds-tip-fg, ${TONE_FG.info});
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: opacity ${transition.default};
    box-sizing: border-box;
  }

  :where(.${TC_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${TC_CLASS}[data-clickable="true"]:hover) { opacity: 0.85; }

  :where(.${TC_ICON_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: var(--nds-tip-icon-bg, ${TONE_ICON_BG.info});
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  :where(.${TC_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${TC_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.8;
    margin: 0 0 ${spacing[4]}px 0;
  }

  :where(.${TC_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    margin: 0;
  }

  :where(.${TC_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    margin: ${spacing[4]}px 0 0 0;
    opacity: 0.85;
  }

  :where(.${TC_ACTION_CLASS}) {
    border: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    padding: 0 ${spacing[4]}px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    align-self: center;
  }

  :where(.${TC_ACTION_CLASS}:hover) { text-decoration: underline; }
`;

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
            {actionLabel} →
          </button>
        )}
      </div>
    );
  },
);

TipCard.displayName = "TipCard";
