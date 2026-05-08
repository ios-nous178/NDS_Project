import React from "react";
import { cv, fontFamily, fontWeight, transition } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const LB_CLASS = "nds-like-button";
const LB_ICON_CLASS = `${LB_CLASS}__icon`;
const LB_COUNT_CLASS = `${LB_CLASS}__count`;

const sizeConfig = {
  sm: { icon: 16, count: 12, gap: 4 },
  md: { icon: 20, count: 13, gap: 6 },
  lg: { icon: 24, count: 14, gap: 6 },
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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const lbStyles = `
  :where(.${LB_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--nds-like-gap, 6px);
    padding: 0;
    border: none;
    background: transparent;
    color: ${cv.text.subtle};
    cursor: pointer;
    font-family: ${fontFamily.web};
    font-weight: ${fontWeight.semibold};
    font-size: var(--nds-like-count-size, 13px);
    transition: color ${transition.default};
  }

  :where(.${LB_CLASS}[data-liked="true"]) {
    color: var(--nds-like-color, var(--color-semantic-error-main, #E04D4D));
  }

  :where(.${LB_CLASS}:hover) {
    color: var(--nds-like-color, var(--color-semantic-error-main, #E04D4D));
  }

  :where(.${LB_CLASS}:focus-visible) {
    outline: 2px solid ${cv.primary.main};
    outline-offset: 2px;
    border-radius: 4px;
  }

  :where(.${LB_ICON_CLASS}) {
    width: var(--nds-like-icon, 20px);
    height: var(--nds-like-icon, 20px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform ${transition.default};
  }

  :where(.${LB_CLASS}[data-liked="true"]) .${LB_ICON_CLASS} {
    animation: nds-like-pop 320ms ease-out;
  }

  @keyframes nds-like-pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  :where(.${LB_COUNT_CLASS}) {
    font-variant-numeric: tabular-nums;
  }
`;

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
            <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
            </svg>
          ) : (
            <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"
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
