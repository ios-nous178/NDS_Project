import React from "react";

/* ─── Class names ─── */

const SP_CLASS = "nds-step-progress";
const SP_ITEM_CLASS = `${SP_CLASS}__item`;
const SP_BAR_CLASS = `${SP_CLASS}__bar`;
const SP_LABEL_CLASS = `${SP_CLASS}__label`;
const SP_STEP_CLASS = `${SP_CLASS}__step`;
const SP_TITLE_CLASS = `${SP_CLASS}__title`;

/* ─── Types ─── */

export interface StepProgressItem {
  /** 스텝 고유 키 */
  key: string;
  /** 스텝 번호/구분 라벨 (예: "Step 1") */
  label?: React.ReactNode;
  /** 스텝 제목 (예: "캠페인 만들기") */
  title?: React.ReactNode;
}

export interface StepProgressProps extends React.HTMLAttributes<HTMLOListElement> {
  /** 스텝 목록 */
  steps: StepProgressItem[];
  /** 현재 스텝 인덱스 (0-based) */
  current: number;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  current,
  className,
  ...rest
}) => {
  return (
    <ol data-slot="root" role="list" className={cx(SP_CLASS, className)} {...rest}>
      {steps.map((step, idx) => {
        const state = idx < current ? "completed" : idx === current ? "current" : "upcoming";
        return (
          <li
            key={step.key}
            data-slot="item"
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={SP_ITEM_CLASS}
          >
            <span aria-hidden="true" data-slot="bar" className={SP_BAR_CLASS} />
            {(step.label !== undefined || step.title !== undefined) && (
              <span data-slot="label" className={SP_LABEL_CLASS}>
                {step.label !== undefined && (
                  <span data-slot="step" className={SP_STEP_CLASS}>
                    {step.label}
                  </span>
                )}
                {step.title !== undefined && (
                  <span data-slot="title" className={SP_TITLE_CLASS}>
                    {step.title}
                  </span>
                )}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
};

StepProgress.displayName = "StepProgress";
