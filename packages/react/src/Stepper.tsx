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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const stepperStyles = `
  :where(.${ST_ROOT_CLASS}) {
    display: flex;
    align-items: flex-start;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${ST_ITEM_CLASS}) {
    position: relative;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[8]}px;
    min-width: 0;
  }

  :where(.${ST_ITEM_CLASS}:last-child) {
    flex: 0 0 auto;
  }

  :where(.${ST_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1;
    font-weight: ${fontWeight.medium};
    transition: background-color ${transition.default}, color ${transition.default};
    box-sizing: border-box;
    flex-shrink: 0;
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_INDICATOR_CLASS}) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_INDICATOR_CLASS}) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  :where(.${ST_INDICATOR_CLASS}[data-variant="dots"]) {
    width: 12px;
    height: 12px;
    background: ${cv.surface.disabled};
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_INDICATOR_CLASS}[data-variant="dots"]),
  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_INDICATOR_CLASS}[data-variant="dots"]) {
    background: ${cv.surface.brand};
  }

  :where(.${ST_CHECK_CLASS}) {
    width: 14px;
    height: 14px;
  }

  :where(.${ST_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    text-align: center;
    user-select: none;
    word-break: keep-all;
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
  }

  :where(.${ST_CONNECTOR_CLASS}) {
    position: absolute;
    top: 13px;
    left: calc(50% + 18px);
    right: calc(-50% + 18px);
    height: 2px;
    background: ${cv.borderRole.subtle};
    border-radius: ${radius.pill}px;
    transition: background-color ${transition.default};
  }

  :where(.${ST_CONNECTOR_CLASS}[data-variant="dots"]) {
    top: 5px;
    left: calc(50% + 10px);
    right: calc(-50% + 10px);
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_CONNECTOR_CLASS}) {
    background: ${cv.surface.brand};
  }
`;

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
