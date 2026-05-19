import React, { useCallback, useId, useRef, useState } from "react";
import { cv, fontFamily, fontWeight, radius, typeScale, zIndex } from "@nudge-eap/tokens";

/* ─── Class names ─── */

const TT_CLASS = "nds-tooltip";
const TT_TRIGGER_CLASS = `${TT_CLASS}__trigger`;
const TT_CONTENT_CLASS = `${TT_CLASS}__content`;
const TT_ARROW_CLASS = `${TT_CLASS}__arrow`;

/* ─── Types ─── */

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const tooltipStyles = `
  :where(.${TT_CLASS}) {
    position: relative;
    display: inline-flex;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TT_TRIGGER_CLASS}) {
    display: inline-flex;
    cursor: default;
  }

  :where(.${TT_CONTENT_CLASS}) {
    position: absolute;
    z-index: ${zIndex.popup};
    padding: var(--inset-chip) var(--inset-input);
    background: ${cv.surface.inverse};
    color: ${cv.textRole.inverse};
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    border-radius: ${radius.md}px;
    white-space: nowrap;
    pointer-events: none;
    max-width: 240px;
    white-space: normal;
    word-break: keep-all;
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="top"]) {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="bottom"]) {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="left"]) {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="right"]) {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }

  :where(.${TT_ARROW_CLASS}) {
    position: absolute;
    width: 8px;
    height: 8px;
    background: ${cv.surface.inverse};
    transform: rotate(45deg);
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="top"]) .${TT_ARROW_CLASS} {
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="bottom"]) .${TT_ARROW_CLASS} {
    top: -4px;
    left: 50%;
    margin-left: -4px;
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="left"]) .${TT_ARROW_CLASS} {
    right: -4px;
    top: 50%;
    margin-top: -4px;
  }

  :where(.${TT_CONTENT_CLASS}[data-placement="right"]) .${TT_ARROW_CLASS} {
    left: -4px;
    top: 50%;
    margin-top: -4px;
  }
`;

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
