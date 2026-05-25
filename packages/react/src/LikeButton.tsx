import React from "react";

/* ─── Constants ─── */

const LB_CLASS = "nds-like-button";
const LB_ICON_CLASS = `${LB_CLASS}__icon`;
const LB_COUNT_CLASS = `${LB_CLASS}__count`;

const sizeConfig = {
  sm: { icon: 18, count: 13, gap: "var(--gap-tight)" },
  md: { icon: 22, count: 14, gap: 6 },
  lg: { icon: 28, count: 15, gap: 6 },
} as const;

export type LikeButtonSize = keyof typeof sizeConfig;

/* ─── Types ─── */

export interface LikeButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  /** 좋아요 상태 */
  liked: boolean;
  /** 변경 콜백 */
  onChange: (liked: boolean) => void;
  /** 좋아요 카운트 */
  count?: number;
  /** 크기 */
  size?: LikeButtonSize;
  /** 카운트 숨김 (아이콘만) */
  hideCount?: boolean;
  /** 활성화 색 (기본 빨강) */
  activeColor?: string;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const formatCount = (n: number): string => {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

/* ─── Component ─── */

export const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  (
    {
      liked,
      onChange,
      count,
      size = "md",
      hideCount = false,
      activeColor,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const s = sizeConfig[size];

    return (
      <button
        ref={ref}
        type="button"
        data-slot="root"
        data-liked={liked ? "true" : "false"}
        aria-pressed={liked}
        aria-label={liked ? "좋아요 취소" : "좋아요"}
        className={cx(LB_CLASS, className)}
        style={
          {
            "--nds-like-icon": `${s.icon}px`,
            "--nds-like-count-size": `${s.count}px`,
            "--nds-like-gap": `${s.gap}px`,
            ...(activeColor && { "--nds-like-color": activeColor }),
            ...style,
          } as React.CSSProperties
        }
        onClick={() => onChange(!liked)}
        {...rest}
      >
        <span className={LB_ICON_CLASS} aria-hidden>
          {liked ? (
            <svg
              width={s.icon}
              height={s.icon}
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ display: "block" }}
            >
              <path d="M12 20.85l-1.36-1.24C5.4 14.86 2 11.78 2 8c0-3.08 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09C13.09 3.31 14.76 2.5 16.5 2.5 19.58 2.5 22 4.92 22 8c0 3.78-3.4 6.86-8.64 11.61L12 20.85z" />
            </svg>
          ) : (
            <svg
              width={s.icon}
              height={s.icon}
              viewBox="0 0 24 24"
              fill="none"
              style={{ display: "block" }}
            >
              <path
                d="M12 20.85l-1.36-1.24C5.4 14.86 2 11.78 2 8c0-3.08 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09C13.09 3.31 14.76 2.5 16.5 2.5 19.58 2.5 22 4.92 22 8c0 3.78-3.4 6.86-8.64 11.61L12 20.85z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {!hideCount && count !== undefined && (
          <span className={LB_COUNT_CLASS}>{formatCount(count)}</span>
        )}
      </button>
    );
  },
);

LikeButton.displayName = "LikeButton";
