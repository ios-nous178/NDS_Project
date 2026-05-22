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

// eslint-disable-next-line unused-imports/no-unused-vars
const assessmentResultStyles = `
  :where(.${AR_CLASS}) {
    --nds-ar-level-color: ${cv.textRole.subtle};
    --nds-ar-level-bg: ${cv.surface.page};
    --nds-ar-level-text: ${cv.textRole.subtle};
    --nds-ar-card-bg: ${cv.surface.default};
    display: flex;
    flex-direction: column;
    gap: ${spacing[20]}px;
    padding: var(--inset-card-large) var(--inset-modal);
    background: var(--nds-ar-card-bg);
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: background ${transition.default};
  }

  /* 단계별 색은 배지·점수·게이지·액션 으로만 전달.
     좌측 컬러 보더(border-left) 패턴은 금지 — 카드 형태가 어그러지고,
     스크롤 리스트에서 시각 잡음이 누적된다. (anti-pattern, DO NOT add back) */
  :where(.${AR_CLASS}[data-level="normal"]) {
    --nds-ar-level-color: ${cv.iconRole.statusSuccess};
    --nds-ar-level-bg: ${cv.surface.statusSuccess};
    --nds-ar-level-text: ${cv.iconRole.statusSuccess};
  }
  :where(.${AR_CLASS}[data-level="mild"]) {
    --nds-ar-level-color: ${cv.fill.statusCaution};
    --nds-ar-level-bg: ${cv.surface.statusCaution};
    --nds-ar-level-text: ${cv.textRole.statusCaution};
  }
  :where(.${AR_CLASS}[data-level="moderate"]) {
    --nds-ar-level-color: ${cv.textRole.statusCaution};
    --nds-ar-level-bg: ${cv.surface.statusCaution};
    --nds-ar-level-text: ${cv.textRole.statusCaution};
  }
  /* severe 위급도는 카드 배경 톤 + 점수·배지·액션 색으로만 강조 (좌 보더 사용 X). */
  :where(.${AR_CLASS}[data-level="severe"]) {
    --nds-ar-level-color: ${cv.fill.statusError};
    --nds-ar-level-bg: ${cv.surface.statusError};
    --nds-ar-level-text: ${cv.textRole.statusError};
    --nds-ar-card-bg: ${cv.surface.statusError};
  }

  :where(.${AR_HEADER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-comfortable);
  }

  :where(.${AR_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    letter-spacing: -0.01em;
  }

  :where(.${AR_LEVEL_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    /* 단계 칩은 단순 보조 아닌 카드의 평가 핵심 — body3 톤으로 가독성·접근성 확보. */
    padding: ${spacing[6]}px var(--inset-input);
    border-radius: ${radius.pill}px;
    background: var(--nds-ar-level-bg);
    color: var(--nds-ar-level-text);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${AR_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-loose);
  }

  :where(.${AR_SCORE_CLASS}) {
    display: flex;
    align-items: baseline;
    gap: ${spacing[6]}px;
  }

  :where(.${AR_SCORE_VALUE_CLASS}) {
    font-size: ${typeScale.headline1.fontSize}px;
    line-height: ${typeScale.headline1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: var(--nds-ar-level-color);
    letter-spacing: -0.02em;
  }

  :where(.${AR_SCORE_UNIT_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: var(--nds-ar-level-color);
  }

  :where(.${AR_SCORE_MAX_CLASS}) {
    margin-left: ${spacing[4]}px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
  }

  :where(.${AR_GAUGE_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
  }

  :where(.${AR_GAUGE_BAR_CLASS}) {
    display: flex;
    gap: var(--gap-tight);
  }

  :where(.${AR_GAUGE_SEG_CLASS}) {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    background: ${cv.borderRole.subtle};
    transition: height ${transition.default}, background ${transition.default}, opacity ${transition.default}, transform ${transition.default};
  }

  /* 단계별 색은 ICON_METADATA 와 동일 채도 단계 — mild(노랑) < moderate(주황) < severe(빨강). */
  :where(.${AR_GAUGE_SEG_CLASS}[data-seg="normal"]) { background: ${cv.iconRole.statusSuccess}; }
  :where(.${AR_GAUGE_SEG_CLASS}[data-seg="mild"]) { background: ${cv.fill.statusCaution}; }
  :where(.${AR_GAUGE_SEG_CLASS}[data-seg="moderate"]) { background: ${cv.textRole.statusCaution}; }
  :where(.${AR_GAUGE_SEG_CLASS}[data-seg="severe"]) { background: ${cv.fill.statusError}; }

  :where(.${AR_GAUGE_SEG_CLASS}[data-active="false"]) {
    opacity: 0.2;
  }
  /* active 단계 강조를 두 단계로 — 높이 + 약간의 부푸름(scale)로 사용자가 자기 위치를 즉시 인지. */
  :where(.${AR_GAUGE_SEG_CLASS}[data-active="true"]) {
    height: 12px;
    border-radius: 6px;
    transform: translateY(-1px);
  }

  :where(.${AR_GAUGE_LABELS_CLASS}) {
    display: flex;
    gap: var(--gap-tight);
  }

  :where(.${AR_GAUGE_LABEL_CLASS}) {
    flex: 1;
    text-align: center;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.muted};
  }
  :where(.${AR_GAUGE_LABEL_CLASS}[data-active="true"]) {
    color: var(--nds-ar-level-text);
    font-weight: ${fontWeight.bold};
  }

  /* description 은 검사 결과의 *주 메시지* — caption1(보조 톤) → body3 medium 으로 격상.
     점수보다 해석을 먼저 읽히게 하는 EAP UX 라이팅 원칙 (raw 수치는 보조). */
  :where(.${AR_DESC_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${AR_FOOTER_CLASS}) {
    margin-top: ${spacing[4]}px;
    padding-top: var(--inset-input);
    border-top: 1px solid ${cv.borderRole.subtle};
    display: flex;
    justify-content: flex-end;
  }

  :where(.${AR_ACTION_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    padding: ${spacing[6]}px ${spacing[10]}px;
    border-radius: ${radius.sm}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.brand};
    cursor: pointer;
    transition: background ${transition.default};
  }

  :where(.${AR_ACTION_CLASS}:hover) {
    background: ${cv.surface.statusInfo};
  }
  :where(.${AR_ACTION_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.focus};
    outline-offset: 2px;
  }
  /* severe 일 때는 action 도 위급도에 맞게 강조 — 흰 글자 + 빨간 fill solid. */
  :where(.${AR_CLASS}[data-level="severe"]) .${AR_ACTION_CLASS} {
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
  }
  :where(.${AR_CLASS}[data-level="severe"]) .${AR_ACTION_CLASS}:hover {
    opacity: 0.92;
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
