import React, { useId } from "react";

/* ─── Class names ─── */

const CT_CLASS = "nds-confirm-tooltip";
const CT_TRIGGER_CLASS = `${CT_CLASS}__trigger`;
const CT_CONTENT_CLASS = `${CT_CLASS}__content`;
const CT_TITLE_CLASS = `${CT_CLASS}__title`;
const CT_DESC_CLASS = `${CT_CLASS}__desc`;
const CT_ACTIONS_CLASS = `${CT_CLASS}__actions`;
const CT_BTN_CLASS = `${CT_CLASS}__btn`;
const CT_BTN_CANCEL_CLASS = `${CT_CLASS}__btn--cancel`;
const CT_BTN_CONFIRM_CLASS = `${CT_CLASS}__btn--confirm`;
const CT_ARROW_CLASS = `${CT_CLASS}__arrow`;

/* ─── Types ─── */

export type ConfirmTooltipPlacement = "top" | "bottom" | "left" | "right";
export type ConfirmTooltipActions = "dual" | "single";

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface ConfirmTooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 확인 질문 제목 (예: "연결을 해제하시겠습니까?") */
  title: React.ReactNode;
  /** 보조 설명 본문 */
  description?: React.ReactNode;
  /** 말풍선 표시 여부 (controlled) */
  open?: boolean;
  /** 말풍선 위치 (anchor 기준). 기본 top — 본문이 위, tail 이 아래를 가리킴 */
  placement?: ConfirmTooltipPlacement;
  /** 버튼 구성 — dual(취소+확인) | single(확인만) */
  actions?: ConfirmTooltipActions;
  /** 본문/액션 영역 너비 (기본 280). number → px. CSS 슬롯 --nds-confirm-tooltip-body-width 로 적용 */
  bodyWidth?: number | string;
  /** 확인 버튼 라벨 (검정 CTA) */
  confirmLabel?: string;
  /** 취소 버튼 라벨 (actions="dual" 일 때만) */
  cancelLabel?: string;
  /** 확인 버튼 클릭 */
  onConfirm?: () => void;
  /** 취소 버튼 클릭 */
  onCancel?: () => void;
  /** 트리거 요소 — 이 요소를 기준으로 말풍선이 anchor 됨 */
  children: React.ReactNode;
}

export const ConfirmTooltip = React.forwardRef<HTMLDivElement, ConfirmTooltipProps>(
  (
    {
      title,
      description,
      open = false,
      placement = "top",
      actions = "dual",
      bodyWidth,
      confirmLabel = "확인",
      cancelLabel = "취소",
      onConfirm,
      onCancel,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const contentId = useId();
    const contentStyle =
      bodyWidth != null
        ? ({
            "--nds-confirm-tooltip-body-width":
              typeof bodyWidth === "number" ? `${bodyWidth}px` : bodyWidth,
          } as React.CSSProperties)
        : undefined;

    return (
      <div ref={ref} data-slot="root" className={cx(CT_CLASS, className)} {...rest}>
        <span data-slot="trigger" className={CT_TRIGGER_CLASS} aria-haspopup="dialog">
          {children}
        </span>
        {open && (
          <div
            data-slot="content"
            data-placement={placement}
            id={contentId}
            role="dialog"
            aria-modal="false"
            className={CT_CONTENT_CLASS}
            style={contentStyle}
          >
            <p data-slot="title" className={CT_TITLE_CLASS}>
              {title}
            </p>
            {description != null && (
              <p data-slot="description" className={CT_DESC_CLASS}>
                {description}
              </p>
            )}
            <div data-slot="actions" data-actions={actions} className={CT_ACTIONS_CLASS}>
              {actions === "dual" && (
                <button
                  type="button"
                  data-slot="cancel"
                  className={cx(CT_BTN_CLASS, CT_BTN_CANCEL_CLASS)}
                  onClick={onCancel}
                >
                  {cancelLabel}
                </button>
              )}
              <button
                type="button"
                data-slot="confirm"
                className={cx(CT_BTN_CLASS, CT_BTN_CONFIRM_CLASS)}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
            <span className={CT_ARROW_CLASS} aria-hidden />
          </div>
        )}
      </div>
    );
  },
);

ConfirmTooltip.displayName = "ConfirmTooltip";
