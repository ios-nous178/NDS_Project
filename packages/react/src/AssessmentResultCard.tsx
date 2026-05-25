import React from "react";

/* ─── Constants ─── */

const AR_CLASS = "nds-assessment-result";
const AR_HEADER_CLASS = `${AR_CLASS}__header`;
const AR_TITLE_CLASS = `${AR_CLASS}__title`;
const AR_LEVEL_CLASS = `${AR_CLASS}__level`;
const AR_BODY_CLASS = `${AR_CLASS}__body`;
const AR_SCORE_CLASS = `${AR_CLASS}__score`;
const AR_SCORE_VALUE_CLASS = `${AR_CLASS}__score-value`;
const AR_SCORE_UNIT_CLASS = `${AR_CLASS}__score-unit`;
const AR_SCORE_MAX_CLASS = `${AR_CLASS}__score-max`;
const AR_GAUGE_CLASS = `${AR_CLASS}__gauge`;
const AR_GAUGE_BAR_CLASS = `${AR_CLASS}__gauge-bar`;
const AR_GAUGE_SEG_CLASS = `${AR_CLASS}__gauge-seg`;
const AR_GAUGE_LABELS_CLASS = `${AR_CLASS}__gauge-labels`;
const AR_GAUGE_LABEL_CLASS = `${AR_CLASS}__gauge-label`;
const AR_DESC_CLASS = `${AR_CLASS}__description`;
const AR_FOOTER_CLASS = `${AR_CLASS}__footer`;
const AR_ACTION_CLASS = `${AR_CLASS}__action`;

/* ─── Types ─── */

export type AssessmentLevel = "normal" | "mild" | "moderate" | "severe";

const LEVEL_ORDER: AssessmentLevel[] = ["normal", "mild", "moderate", "severe"];

const LEVEL_DEFAULT_TEXT: Record<AssessmentLevel, string> = {
  normal: "정상",
  mild: "주의",
  moderate: "경계",
  severe: "심각",
};
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
  /** 점수 단위 (기본: "점") */
  scoreUnit?: React.ReactNode;
  /** 4단계 게이지 숨기기 (단순 카드로 표시) */
  hideGauge?: boolean;
  /** 단계별 라벨 커스터마이즈 */
  levelLabels?: Partial<Record<AssessmentLevel, React.ReactNode>>;
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
      scoreUnit = "점",
      hideGauge,
      levelLabels,
      className,
      ...rest
    },
    ref,
  ) => {
    const resolveLabel = (lvl: AssessmentLevel) => levelLabels?.[lvl] ?? LEVEL_DEFAULT_TEXT[lvl];
    const levelChipLabel = levelText ?? resolveLabel(level);

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
          <span data-slot="level" className={AR_LEVEL_CLASS}>
            {levelChipLabel}
          </span>
        </div>
        <div data-slot="body" className={AR_BODY_CLASS}>
          <div data-slot="score" className={AR_SCORE_CLASS}>
            <span data-slot="score-value" className={AR_SCORE_VALUE_CLASS}>
              {score}
            </span>
            {scoreUnit && (
              <span data-slot="score-unit" className={AR_SCORE_UNIT_CLASS}>
                {scoreUnit}
              </span>
            )}
            {maxScore !== undefined && (
              <span data-slot="score-max" className={AR_SCORE_MAX_CLASS}>
                / {maxScore}
                {scoreUnit ?? ""}
              </span>
            )}
          </div>
          {!hideGauge && (
            <div data-slot="gauge" className={AR_GAUGE_CLASS}>
              <div className={AR_GAUGE_BAR_CLASS}>
                {LEVEL_ORDER.map((lvl) => (
                  <div
                    key={lvl}
                    className={AR_GAUGE_SEG_CLASS}
                    data-seg={lvl}
                    data-active={lvl === level}
                  />
                ))}
              </div>
              <div className={AR_GAUGE_LABELS_CLASS}>
                {LEVEL_ORDER.map((lvl) => (
                  <span
                    key={lvl}
                    className={AR_GAUGE_LABEL_CLASS}
                    data-seg={lvl}
                    data-active={lvl === level}
                  >
                    {resolveLabel(lvl)}
                  </span>
                ))}
              </div>
            </div>
          )}
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
