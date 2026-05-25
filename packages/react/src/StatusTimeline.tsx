import React from "react";

/* ─── Constants ─── */

const ST_CLASS = "nds-status-timeline";
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_DOT_CLASS = `${ST_CLASS}__dot`;
const ST_LINE_CLASS = `${ST_CLASS}__line`;
const ST_BODY_CLASS = `${ST_CLASS}__body`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_DESC_CLASS = `${ST_CLASS}__desc`;
const ST_TIME_CLASS = `${ST_CLASS}__time`;

/* ─── Types ─── */

export interface StatusTimelineStep {
  /** 고유 키 */
  key: string;
  /** 라벨 (단계 이름) */
  label: React.ReactNode;
  /** 설명 (선택) */
  description?: React.ReactNode;
  /** 시간/시점 (선택) */
  time?: React.ReactNode;
}

export type StatusTimelineDirection = "horizontal" | "vertical";

export interface StatusTimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  /** 단계 목록 */
  steps: StatusTimelineStep[];
  /** 현재 진행 인덱스 (0-based, 이 인덱스까지 완료 + 인덱스 자체는 진행 중) */
  current: number;
  /** 방향 */
  direction?: StatusTimelineDirection;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const stateOf = (idx: number, current: number): "done" | "current" | "todo" => {
  if (idx < current) return "done";
  if (idx === current) return "current";
  return "todo";
};

/* ─── Component ─── */

export const StatusTimeline = React.forwardRef<HTMLOListElement, StatusTimelineProps>(
  ({ steps, current, direction = "horizontal", className, ...rest }, ref) => {
    return (
      <ol
        ref={ref}
        data-slot="root"
        data-direction={direction}
        className={cx(ST_CLASS, className)}
        {...rest}
      >
        {steps.map((step, i) => {
          const state = stateOf(i, current);
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;
          // 양쪽 half-line: 좌측은 이전 dot과의 연결, 우측은 다음 dot과의 연결
          const leftLineState = isFirst ? "hidden" : i <= current ? "done" : "todo";
          const rightLineState = isLast ? "hidden" : i < current ? "done" : "todo";
          return (
            <li key={step.key} className={ST_ITEM_CLASS} data-state={state}>
              <div className={ST_INDICATOR_CLASS}>
                {direction === "horizontal" && (
                  <span className={ST_LINE_CLASS} data-state={leftLineState} aria-hidden />
                )}
                <span className={ST_DOT_CLASS} data-state={state} aria-hidden>
                  {state === "done" ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.5l2.5 2.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                {direction === "horizontal" && (
                  <span className={ST_LINE_CLASS} data-state={rightLineState} aria-hidden />
                )}
                {direction === "vertical" && !isLast && (
                  <span className={ST_LINE_CLASS} data-state={rightLineState} aria-hidden />
                )}
              </div>
              <div className={ST_BODY_CLASS}>
                <span className={ST_LABEL_CLASS} data-state={state}>
                  {step.label}
                </span>
                {step.description && <span className={ST_DESC_CLASS}>{step.description}</span>}
                {step.time && <span className={ST_TIME_CLASS}>{step.time}</span>}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);

StatusTimeline.displayName = "StatusTimeline";
