import React from "react";

/* ─── Class names ─── */

const ST_CLASS = "nds-stepper";
const ST_ROOT_CLASS = `${ST_CLASS}__root`;
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_CONNECTOR_CLASS = `${ST_CLASS}__connector`;
const ST_CHECK_CLASS = `${ST_CLASS}__check`;
const ST_BAR_CLASS = `${ST_CLASS}__bar`;
const ST_STEP_CLASS = `${ST_CLASS}__step`;
const ST_TITLE_CLASS = `${ST_CLASS}__title`;

/* ─── Types ─── */

/**
 * - `numbered` / `dots`: 원형 인디케이터 + 커넥터 (가입·결제·온보딩 진척).
 * - `bar`: 가로 막대 + 2단 라벨(step + title) — 어드민 다단계 흐름(구 StepProgress).
 */
export type StepperVariant = "numbered" | "dots" | "bar";

export interface StepItem {
  /** 스텝 고유 키 */
  key: string;
  /** 스텝 라벨 — numbered/dots 는 단계명, bar 는 상단 eyebrow(예: "Step 1") */
  label?: React.ReactNode;
  /** 보조 제목 — bar variant 의 두 번째 라벨 줄(예: "캠페인 만들기"). numbered/dots 는 무시 */
  title?: React.ReactNode;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  /** 스텝 목록 */
  steps: StepItem[];
  /** 현재 스텝 인덱스 (0-based) */
  current: number;
  /** 표시 변형 */
  variant?: StepperVariant;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const Stepper: React.FC<StepperProps> = ({
  steps,
  current,
  variant = "numbered",
  className,
  ...rest
}) => {
  return (
    <ol
      data-slot="root"
      data-variant={variant}
      role="list"
      className={cx(ST_ROOT_CLASS, className)}
      {...rest}
    >
      {steps.map((step, idx) => {
        const state = idx < current ? "completed" : idx === current ? "current" : "upcoming";
        const isLast = idx === steps.length - 1;

        if (variant === "bar") {
          return (
            <li
              key={step.key}
              data-slot="item"
              data-variant="bar"
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
              className={ST_ITEM_CLASS}
            >
              <span aria-hidden="true" data-slot="bar" data-variant="bar" className={ST_BAR_CLASS} />
              {(step.label !== undefined || step.title !== undefined) && (
                <span data-slot="label" data-variant="bar" className={ST_LABEL_CLASS}>
                  {step.label !== undefined && (
                    <span data-slot="step" className={ST_STEP_CLASS}>
                      {step.label}
                    </span>
                  )}
                  {step.title !== undefined && (
                    <span data-slot="title" className={ST_TITLE_CLASS}>
                      {step.title}
                    </span>
                  )}
                </span>
              )}
            </li>
          );
        }

        return (
          <li
            key={step.key}
            data-slot="item"
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={ST_ITEM_CLASS}
          >
            <span
              data-slot="indicator"
              data-variant={variant}
              className={ST_INDICATOR_CLASS}
              aria-hidden={variant === "dots" ? "true" : undefined}
            >
              {variant === "numbered" &&
                (state === "completed" ? (
                  <svg
                    className={ST_CHECK_CLASS}
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 7L6 10L11 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  idx + 1
                ))}
            </span>
            {step.label !== undefined && (
              <span data-slot="label" className={ST_LABEL_CLASS}>
                {step.label}
              </span>
            )}
            {!isLast && (
              <span
                aria-hidden="true"
                data-slot="connector"
                data-variant={variant}
                className={ST_CONNECTOR_CLASS}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

Stepper.displayName = "Stepper";
