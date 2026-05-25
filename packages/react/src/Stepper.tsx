import React from "react";

/* ─── Class names ─── */

const ST_CLASS = "nds-stepper";
const ST_ROOT_CLASS = `${ST_CLASS}__root`;
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_CONNECTOR_CLASS = `${ST_CLASS}__connector`;
const ST_CHECK_CLASS = `${ST_CLASS}__check`;

/* ─── Types ─── */

export type StepperVariant = "numbered" | "dots";

export interface StepItem {
  /** 스텝 고유 키 */
  key: string;
  /** 스텝 라벨 */
  label?: React.ReactNode;
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
