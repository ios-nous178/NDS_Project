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

const AR_CLASS = "nds-assessment-result";
const AR_HEADER_CLASS = `${AR_CLASS}__header`;
const AR_TITLE_CLASS = `${AR_CLASS}__title`;
const AR_LEVEL_CLASS = `${AR_CLASS}__level`;
const AR_BODY_CLASS = `${AR_CLASS}__body`;
const AR_SCORE_CLASS = `${AR_CLASS}__score`;
const AR_SCORE_VALUE_CLASS = `${AR_CLASS}__score-value`;
const AR_SCORE_MAX_CLASS = `${AR_CLASS}__score-max`;
const AR_DESC_CLASS = `${AR_CLASS}__description`;
const AR_FOOTER_CLASS = `${AR_CLASS}__footer`;
const AR_ACTION_CLASS = `${AR_CLASS}__action`;

/* ─── Types ─── */

export type AssessmentLevel = "normal" | "mild" | "moderate" | "severe";

const LEVEL_DEFAULT_TEXT: Record<AssessmentLevel, string> = {
  normal: "정상",
  mild: "주의",
  moderate: "경계",
  severe: "심각",
};

// eslint-disable-next-line unused-imports/no-unused-vars
const assessmentResultStyles = `
  :where(.${AR_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[16]}px;
    padding: ${spacing[20]}px ${spacing[24]}px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: border-color ${transition.default};
  }

  :where(.${AR_CLASS}[data-level="normal"]) {
    border-color: ${cv.success.main};
  }
  :where(.${AR_CLASS}[data-level="mild"]),
  :where(.${AR_CLASS}[data-level="moderate"]) {
    border-color: ${cv.caution.main};
  }
  :where(.${AR_CLASS}[data-level="severe"]) {
    border-color: ${cv.error.main};
  }

  :where(.${AR_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[12]}px;
  }

  :where(.${AR_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.subtle};
    margin: 0;
  }

  :where(.${AR_LEVEL_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: ${spacing[4]}px ${spacing[10]}px;
    border-radius: ${radius.pill}px;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${AR_LEVEL_CLASS}[data-level="normal"]) {
    background: ${cv.success.bg};
    color: ${cv.success.main};
  }
  :where(.${AR_LEVEL_CLASS}[data-level="mild"]),
  :where(.${AR_LEVEL_CLASS}[data-level="moderate"]) {
    background: ${cv.caution.bg};
    color: ${cv.caution.text};
  }
  :where(.${AR_LEVEL_CLASS}[data-level="severe"]) {
    background: ${cv.error.bg};
    color: ${cv.error.main};
  }

  :where(.${AR_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${AR_SCORE_CLASS}) {
    display: flex;
    align-items: baseline;
    gap: ${spacing[4]}px;
  }

  :where(.${AR_SCORE_VALUE_CLASS}) {
    font-size: ${typeScale.headline2.fontSize}px;
    line-height: ${typeScale.headline2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
  }

  :where(.${AR_SCORE_MAX_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.text.subtle};
  }

  :where(.${AR_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.normal};
  }

  :where(.${AR_FOOTER_CLASS}) {
    display: flex;
    justify-content: flex-end;
  }

  :where(.${AR_ACTION_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.primary.main};
    cursor: pointer;
  }

  :where(.${AR_ACTION_CLASS}:hover) {
    text-decoration: underline;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6 4L10 8L6 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Component ─── */

export interface AssessmentResultCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** 검사 명 (예: "PHQ-9 우울 검사") */
  title: React.ReactNode;
  /** 점수 */
  score: number;
  /** 최대 점수 */
  maxScore?: number;
  /** 결과 단계 */
  level: AssessmentLevel;
  /** 단계 라벨 (기본값: 정상/주의/경계/심각) */
  levelText?: React.ReactNode;
  /** 1줄 해석 */
  description?: React.ReactNode;
  /** 액션 라벨 (예: "결과 자세히 보기") */
  actionLabel?: string;
  /** 액션 클릭 */
  onAction?: () => void;
}

export const AssessmentResultCard = React.forwardRef<HTMLDivElement, AssessmentResultCardProps>(
  (
    {
      title,
      score,
      maxScore,
      level,
      levelText,
      description,
      actionLabel,
      onAction,
      className,
      ...rest
    },
    ref,
  ) => {
    const levelLabel = levelText ?? LEVEL_DEFAULT_TEXT[level];

    return (
      <div
        ref={ref}
        data-slot="root"
        data-level={level}
        className={cx(AR_CLASS, className)}
        {...rest}
      >
        <div data-slot="header" className={AR_HEADER_CLASS}>
          <h3 data-slot="title" className={AR_TITLE_CLASS}>
            {title}
          </h3>
          <span data-slot="level" data-level={level} className={AR_LEVEL_CLASS}>
            {levelLabel}
          </span>
        </div>
        <div data-slot="body" className={AR_BODY_CLASS}>
          <div data-slot="score" className={AR_SCORE_CLASS}>
            <span data-slot="score-value" className={AR_SCORE_VALUE_CLASS}>
              {score}
            </span>
            {maxScore !== undefined && (
              <span data-slot="score-max" className={AR_SCORE_MAX_CLASS}>
                / {maxScore}점
              </span>
            )}
          </div>
          {description && (
            <p data-slot="description" className={AR_DESC_CLASS}>
              {description}
            </p>
          )}
        </div>
        {actionLabel && (
          <div data-slot="footer" className={AR_FOOTER_CLASS}>
            <button data-slot="action" className={AR_ACTION_CLASS} onClick={onAction}>
              {actionLabel}
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  },
);

AssessmentResultCard.displayName = "AssessmentResultCard";
