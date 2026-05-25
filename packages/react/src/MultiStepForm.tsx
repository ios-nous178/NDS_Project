import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/* ─── Constants ─── */

const MS_CLASS = "nds-multi-step-form";
const MS_HEADER_CLASS = `${MS_CLASS}__header`;
const MS_INDICATOR_CLASS = `${MS_CLASS}__indicator`;
const MS_TITLE_CLASS = `${MS_CLASS}__title`;
const MS_DESC_CLASS = `${MS_CLASS}__desc`;
const MS_BODY_CLASS = `${MS_CLASS}__body`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;
const MS_BTN_CLASS = `${MS_CLASS}__btn`;
const MS_PROGRESS_CLASS = `${MS_CLASS}__progress`;
const MS_PROGRESS_FILL_CLASS = `${MS_CLASS}__progress-fill`;

/* ─── Types ─── */

export interface MultiStepFormStep {
  /** 고유 키 */
  key: string;
  /** 단계 제목 (표시용) */
  title: string;
  /** 단계 설명 (선택) */
  description?: string;
  /** 단계 콘텐츠 */
  content: React.ReactNode;
  /** 이 단계 진행 가능한지 (false면 다음 버튼 비활성). 동기 검증만 */
  canProceed?: boolean;
}

export type MultiStepFormIndicator = "progress" | "steps" | "none";

export interface MultiStepFormContextValue {
  current: number;
  total: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextValue | null>(null);

export const useMultiStepForm = (): MultiStepFormContextValue => {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) throw new Error("useMultiStepForm은 MultiStepForm 안에서만 사용해야 합니다.");
  return ctx;
};

export interface MultiStepFormProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /** 단계 목록 */
  steps: MultiStepFormStep[];
  /** 현재 단계 (controlled) */
  current?: number;
  /** 단계 변경 콜백 */
  onCurrentChange?: (index: number) => void;
  /** 마지막 단계에서 제출 콜백 */
  onSubmit?: () => void | Promise<void>;
  /** 인디케이터 종류 */
  indicator?: MultiStepFormIndicator;
  /** 다음 버튼 라벨 */
  nextLabel?: string;
  /** 이전 버튼 라벨 */
  prevLabel?: string;
  /** 제출 버튼 라벨 (마지막 단계) */
  submitLabel?: string;
  /** 제출 진행 중 */
  submitting?: boolean;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  (
    {
      steps,
      current: currentProp,
      onCurrentChange,
      onSubmit,
      indicator = "progress",
      nextLabel = "다음",
      prevLabel = "이전",
      submitLabel = "완료",
      submitting = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = currentProp !== undefined;
    const [internal, setInternal] = useState(0);
    const idx = isControlled ? currentProp! : internal;
    const total = steps.length;
    const step = steps[idx];
    const isFirst = idx === 0;
    const isLast = idx === total - 1;
    const canProceed = step?.canProceed !== false;

    const setIdx = useCallback(
      (next: number) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        if (!isControlled) setInternal(clamped);
        onCurrentChange?.(clamped);
      },
      [isControlled, onCurrentChange, total],
    );

    const next = useCallback(async () => {
      if (!canProceed) return;
      if (isLast) {
        await onSubmit?.();
        return;
      }
      setIdx(idx + 1);
    }, [canProceed, isLast, onSubmit, setIdx, idx]);

    const prev = useCallback(() => {
      if (isFirst) return;
      setIdx(idx - 1);
    }, [isFirst, setIdx, idx]);

    const ctxValue = useMemo<MultiStepFormContextValue>(
      () => ({ current: idx, total, next, prev, goTo: setIdx }),
      [idx, total, next, prev, setIdx],
    );

    if (!step) return null;
    const progressPct = ((idx + 1) / total) * 100;

    return (
      <MultiStepFormContext.Provider value={ctxValue}>
        <div ref={ref} data-slot="root" className={cx(MS_CLASS, className)} {...rest}>
          {indicator === "progress" && (
            <div
              className={MS_PROGRESS_CLASS}
              role="progressbar"
              aria-valuenow={idx + 1}
              aria-valuemin={1}
              aria-valuemax={total}
            >
              <div className={MS_PROGRESS_FILL_CLASS} style={{ width: `${progressPct}%` }} />
            </div>
          )}

          <div className={MS_HEADER_CLASS}>
            {indicator !== "none" && (
              <span className={MS_INDICATOR_CLASS}>
                {idx + 1} / {total}
              </span>
            )}
            <h2 className={MS_TITLE_CLASS}>{step.title}</h2>
            {step.description && <p className={MS_DESC_CLASS}>{step.description}</p>}
          </div>

          <div className={MS_BODY_CLASS} data-slot="body">
            {step.content}
          </div>

          <div className={MS_FOOTER_CLASS}>
            <button
              type="button"
              className={MS_BTN_CLASS}
              disabled={isFirst || submitting}
              onClick={prev}
              style={isFirst ? { visibility: "hidden" } : undefined}
            >
              {prevLabel}
            </button>
            <button
              type="button"
              className={MS_BTN_CLASS}
              data-primary="true"
              disabled={!canProceed || submitting}
              onClick={next}
            >
              {isLast ? (submitting ? "처리 중..." : submitLabel) : nextLabel}
            </button>
          </div>
        </div>
      </MultiStepFormContext.Provider>
    );
  },
);

MultiStepForm.displayName = "MultiStepForm";
