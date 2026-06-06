import React from "react";

/* ─── Class names ─── */

const TC_CLASS = "nds-tip-card";
const TC_META_CLASS = `${TC_CLASS}__meta`;
const TC_LABEL_CLASS = `${TC_CLASS}__label`;
const TC_BODY_CLASS = `${TC_CLASS}__body`;
const TC_TITLE_CLASS = `${TC_CLASS}__title`;
const TC_DESC_CLASS = `${TC_CLASS}__description`;
const TC_ACTION_CLASS = `${TC_CLASS}__action`;

/* ─── Types ─── */

export type TipCardTone = "info" | "success" | "warning" | "neutral";

export interface TipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: TipCardTone;
  label?: React.ReactNode;
  tipTitle?: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  href?: string;
  clickable?: boolean;
  children?: React.ReactNode;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M6.5 4.5L11 9L6.5 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Component ─── */

export const TipCard = React.forwardRef<HTMLDivElement, TipCardProps>(
  (
    {
      tone = "info",
      label,
      tipTitle,
      description,
      actionLabel,
      actionHref,
      onAction,
      href,
      clickable,
      className,
      style,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isClickable = Boolean(clickable ?? href ?? onClick);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (href) window.open(href, "_blank", "noopener,noreferrer");
      onClick?.(e);
    };

    return (
      <div
        ref={ref}
        data-slot="root"
        data-tone={tone}
        data-clickable={isClickable || undefined}
        className={cx(TC_CLASS, className)}
        style={style}
        onClick={isClickable ? handleClick : undefined}
        role={isClickable ? "link" : undefined}
        {...rest}
      >
        {children ?? (
          <>
            {label && <div className={TC_META_CLASS}>{label}</div>}
            <div className={TC_BODY_CLASS}>
              {tipTitle && (
                <div data-slot="title" className={TC_TITLE_CLASS}>
                  {tipTitle}
                </div>
              )}
              {description && (
                <div data-slot="description" className={TC_DESC_CLASS}>
                  {description}
                </div>
              )}
              {actionLabel &&
                (actionHref ? (
                  <a
                    data-slot="action"
                    className={TC_ACTION_CLASS}
                    href={actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actionLabel}
                    <ChevronRight />
                  </a>
                ) : (
                  <button
                    type="button"
                    data-slot="action"
                    className={TC_ACTION_CLASS}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction?.();
                    }}
                  >
                    {actionLabel}
                    <ChevronRight />
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    );
  },
);

TipCard.displayName = "TipCard";
