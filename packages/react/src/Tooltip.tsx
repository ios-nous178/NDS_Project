import React, { useCallback, useId, useRef, useState } from "react";

/* ─── Class names ─── */

const TT_CLASS = "nds-tooltip";
const TT_TRIGGER_CLASS = `${TT_CLASS}__trigger`;
const TT_CONTENT_CLASS = `${TT_CLASS}__content`;
const TT_ARROW_CLASS = `${TT_CLASS}__arrow`;

/* ─── Types ─── */

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  /** 툴팁 내용 */
  content: React.ReactNode;
  /** 위치 */
  placement?: TooltipPlacement;
  /** 표시 딜레이 (ms) */
  delay?: number;
  /** 비활성화 */
  disabled?: boolean;
  /** 트리거 요소 */
  children: React.ReactNode;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    { content, placement = "top", delay = 200, disabled = false, className, children, ...rest },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const tooltipId = useId();

    const show = useCallback(() => {
      if (disabled) return;
      timerRef.current = setTimeout(() => setVisible(true), delay);
    }, [disabled, delay]);

    const hide = useCallback(() => {
      clearTimeout(timerRef.current);
      setVisible(false);
    }, []);

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(TT_CLASS, className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...rest}
      >
        <span
          data-slot="trigger"
          className={TT_TRIGGER_CLASS}
          aria-describedby={visible ? tooltipId : undefined}
        >
          {children}
        </span>
        {visible && (
          <div
            data-slot="content"
            data-placement={placement}
            id={tooltipId}
            role="tooltip"
            className={TT_CONTENT_CLASS}
          >
            {content}
            <span className={TT_ARROW_CLASS} />
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
