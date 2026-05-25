import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ─── Constants ─── */

const CM_CLASS = "nds-coach-mark";
const CM_OVERLAY_CLASS = `${CM_CLASS}__overlay`;
const CM_HOLE_CLASS = `${CM_CLASS}__hole`;
const CM_TOOLTIP_CLASS = `${CM_CLASS}__tooltip`;
const CM_STEP_CLASS = `${CM_CLASS}__step`;
const CM_TITLE_CLASS = `${CM_CLASS}__title`;
const CM_DESC_CLASS = `${CM_CLASS}__desc`;
const CM_FOOTER_CLASS = `${CM_CLASS}__footer`;
const CM_DOTS_CLASS = `${CM_CLASS}__dots`;
const CM_DOT_CLASS = `${CM_CLASS}__dot`;
const CM_ACTIONS_CLASS = `${CM_CLASS}__actions`;
const CM_BTN_CLASS = `${CM_CLASS}__btn`;
const CM_SKIP_CLASS = `${CM_CLASS}__skip`;

/* ─── Types ─── */

export interface CoachMarkStep {
  /** 타깃 selector 또는 ref.current를 가져올 함수 */
  target: string | (() => HTMLElement | null);
  /** 단계 제목 */
  title: React.ReactNode;
  /** 설명 */
  description?: React.ReactNode;
  /** 툴팁 위치 (자동 추정 안 함 — 명시) */
  placement?: "top" | "bottom" | "left" | "right";
  /** 하이라이트 영역 패딩 px */
  padding?: number;
}

export type CoachMarkPlacement = NonNullable<CoachMarkStep["placement"]>;

export interface CoachMarkProps {
  /** 활성 여부 */
  open: boolean;
  /** 단계 목록 */
  steps: CoachMarkStep[];
  /** 현재 단계 인덱스 (controlled). 미지정 시 내부 관리 */
  step?: number;
  /** 단계 변경 콜백 */
  onStepChange?: (index: number) => void;
  /** 닫기 콜백 (Skip 또는 마지막 단계 완료 시) */
  onClose?: () => void;
  /** 마지막 버튼 라벨 (기본 "완료") */
  finishLabel?: string;
  /** 다음 버튼 라벨 (기본 "다음") */
  nextLabel?: string;
  /** Skip 버튼 라벨 (기본 "건너뛰기") */
  skipLabel?: string;
  /** Skip 버튼 숨김 */
  hideSkip?: boolean;
}
const resolveTarget = (t: CoachMarkStep["target"]): HTMLElement | null => {
  if (typeof t === "function") return t();
  return document.querySelector(t) as HTMLElement | null;
};

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const computeTooltipPosition = (
  rect: Rect,
  placement: CoachMarkPlacement,
  tooltipW: number,
  tooltipH: number,
  margin = 12,
): { top: number; left: number } => {
  switch (placement) {
    case "top":
      return {
        top: rect.top - tooltipH - margin,
        left: rect.left + rect.width / 2 - tooltipW / 2,
      };
    case "bottom":
      return {
        top: rect.top + rect.height + margin,
        left: rect.left + rect.width / 2 - tooltipW / 2,
      };
    case "left":
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2,
        left: rect.left - tooltipW - margin,
      };
    case "right":
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2,
        left: rect.left + rect.width + margin,
      };
  }
};

/* ─── Component ─── */

export const CoachMark: React.FC<CoachMarkProps> = ({
  open,
  steps,
  step: stepProp,
  onStepChange,
  onClose,
  finishLabel = "완료",
  nextLabel = "다음",
  skipLabel = "건너뛰기",
  hideSkip = false,
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const isControlled = stepProp !== undefined;
  const idx = isControlled ? stepProp! : internalStep;

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [holeRect, setHoleRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);

  const setStep = (next: number) => {
    if (!isControlled) setInternalStep(next);
    onStepChange?.(next);
  };

  const goNext = () => {
    if (idx >= steps.length - 1) onClose?.();
    else setStep(idx + 1);
  };

  const recompute = () => {
    if (!open || !steps[idx]) return;
    const target = resolveTarget(steps[idx].target);
    if (!target) {
      setHoleRect(null);
      setTooltipPos({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 160 });
      return;
    }
    const r = target.getBoundingClientRect();
    const padding = steps[idx].padding ?? 8;
    const rect: Rect = {
      top: r.top - padding,
      left: r.left - padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2,
    };
    setHoleRect(rect);
    const tw = tooltipRef.current?.offsetWidth ?? 280;
    const th = tooltipRef.current?.offsetHeight ?? 140;
    const placement = steps[idx].placement ?? "bottom";
    setTooltipPos(computeTooltipPosition(rect, placement, tw, th));
  };

  useLayoutEffect(() => {
    recompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx, steps]);

  useEffect(() => {
    if (!open) return;
    const onR = () => recompute();
    window.addEventListener("resize", onR);
    window.addEventListener("scroll", onR, true);
    return () => {
      window.removeEventListener("resize", onR);
      window.removeEventListener("scroll", onR, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx]);

  if (!open || typeof document === "undefined") return null;

  const current = steps[idx];
  if (!current) return null;
  const isLast = idx === steps.length - 1;

  return createPortal(
    <div className={CM_OVERLAY_CLASS} role="dialog" aria-modal="true">
      {holeRect && (
        <div
          className={CM_HOLE_CLASS}
          style={{
            top: holeRect.top,
            left: holeRect.left,
            width: holeRect.width,
            height: holeRect.height,
          }}
        />
      )}
      <div
        ref={tooltipRef}
        className={CM_TOOLTIP_CLASS}
        style={tooltipPos ? { top: tooltipPos.top, left: tooltipPos.left } : { top: 80, left: 16 }}
      >
        <div className={CM_STEP_CLASS}>
          STEP {idx + 1} / {steps.length}
        </div>
        <h3 className={CM_TITLE_CLASS}>{current.title}</h3>
        {current.description && <p className={CM_DESC_CLASS}>{current.description}</p>}
        <div className={CM_FOOTER_CLASS}>
          <div className={CM_DOTS_CLASS} aria-hidden="true">
            {steps.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={CM_DOT_CLASS}
                data-active={dotIdx === idx ? "true" : "false"}
              />
            ))}
          </div>
          <div className={CM_ACTIONS_CLASS}>
            {!hideSkip && !isLast && (
              <button type="button" className={CM_SKIP_CLASS} onClick={onClose}>
                {skipLabel}
              </button>
            )}
            <button type="button" className={CM_BTN_CLASS} onClick={goNext}>
              {isLast ? finishLabel : nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

CoachMark.displayName = "CoachMark";
