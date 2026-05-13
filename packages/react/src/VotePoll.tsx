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

const VP_CLASS = "nds-vote-poll";
const VP_QUESTION_CLASS = `${VP_CLASS}__question`;
const VP_OPTIONS_CLASS = `${VP_CLASS}__options`;
const VP_OPTION_CLASS = `${VP_CLASS}__option`;
const VP_BAR_CLASS = `${VP_CLASS}__bar`;
const VP_LABEL_CLASS = `${VP_CLASS}__label`;
const VP_PCT_CLASS = `${VP_CLASS}__pct`;
const VP_FOOTER_CLASS = `${VP_CLASS}__footer`;

/* ─── Types ─── */

export interface VoteOption {
  /** 고유 키 */
  key: string;
  /** 라벨 */
  label: string;
  /** 득표 수 */
  count: number;
}

export interface VotePollProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 질문 */
  question: React.ReactNode;
  /** 옵션 */
  options: VoteOption[];
  /** 사용자가 투표한 키 (없으면 미투표) */
  votedKey?: string | null;
  /** 투표 콜백 */
  onVote?: (key: string) => void;
  /** 결과를 항상 보여줌 (투표 전에도) */
  showResults?: boolean;
  /** 푸터 (총 투표 수 등) */
  footer?: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const vpStyles = `
  :where(.${VP_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[12]}px;
    padding: ${spacing[16]}px ${spacing[20]}px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${VP_QUESTION_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
    margin: 0;
  }

  :where(.${VP_OPTIONS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${VP_OPTION_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 ${spacing[12]}px;
    border: 1px solid ${cv.border.default};
    border-radius: ${radius.md}px;
    background: ${cv.bg.white};
    color: ${cv.text.default};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${VP_OPTION_CLASS}:hover:not([disabled])) {
    background: ${cv.bg.coolGray};
  }

  :where(.${VP_OPTION_CLASS}[data-voted="true"]) {
    border-color: ${cv.primary.main};
    color: ${cv.primary.main};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${VP_OPTION_CLASS}[disabled]) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  :where(.${VP_BAR_CLASS}) {
    position: absolute;
    inset: 0;
    background: var(--semantic-primary-bg, #EBF1FF);
    width: var(--nds-vote-pct, 0%);
    transition: width 480ms ease;
    z-index: 0;
  }

  :where(.${VP_OPTION_CLASS}[data-voted="true"]) .${VP_BAR_CLASS} {
    background: var(--semantic-primary-bg-hover, #DDE7FF);
  }

  :where(.${VP_LABEL_CLASS}),
  :where(.${VP_PCT_CLASS}) {
    position: relative;
    z-index: 1;
  }

  :where(.${VP_LABEL_CLASS}) { flex: 1; }

  :where(.${VP_PCT_CLASS}) {
    margin-left: ${spacing[8]}px;
    color: ${cv.text.subtle};
    font-variant-numeric: tabular-nums;
  }

  :where(.${VP_OPTION_CLASS}[data-voted="true"]) .${VP_PCT_CLASS} {
    color: ${cv.primary.main};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${VP_FOOTER_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.text.subtle};
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const VotePoll = React.forwardRef<HTMLDivElement, VotePollProps>(
  (
    {
      question,
      options,
      votedKey,
      onVote,
      showResults = false,
      footer,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const total = options.reduce((sum, o) => sum + o.count, 0);
    const reveal = !!votedKey || showResults;

    return (
      <div ref={ref} data-slot="root" className={cx(VP_CLASS, className)} {...rest}>
        <p className={VP_QUESTION_CLASS}>{question}</p>
        <div className={VP_OPTIONS_CLASS}>
          {options.map((opt) => {
            const pct = total > 0 ? Math.round((opt.count / total) * 100) : 0;
            const voted = votedKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                className={VP_OPTION_CLASS}
                data-voted={voted ? "true" : "false"}
                disabled={
                  disabled || (!!votedKey && votedKey !== opt.key) || reveal === false
                    ? false
                    : disabled
                }
                onClick={() => {
                  if (disabled || votedKey) return;
                  onVote?.(opt.key);
                }}
                style={
                  reveal ? ({ "--nds-vote-pct": `${pct}%` } as React.CSSProperties) : undefined
                }
              >
                {reveal && <span className={VP_BAR_CLASS} aria-hidden />}
                <span className={VP_LABEL_CLASS}>{opt.label}</span>
                {reveal && <span className={VP_PCT_CLASS}>{pct}%</span>}
              </button>
            );
          })}
        </div>
        {footer && <div className={VP_FOOTER_CLASS}>{footer}</div>}
      </div>
    );
  },
);

VotePoll.displayName = "VotePoll";
