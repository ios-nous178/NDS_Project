import React from "react";

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
