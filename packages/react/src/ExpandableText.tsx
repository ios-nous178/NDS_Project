import React, { useLayoutEffect, useRef, useState } from "react";
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const ET_CLASS = "nds-expandable-text";
const ET_BODY_CLASS = `${ET_CLASS}__body`;
const ET_TOGGLE_CLASS = `${ET_CLASS}__toggle`;

/* ─── Types ─── */

export interface ExpandableTextProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** 본문 텍스트 (string 권장 — 정확한 라인수 측정) */
  children: React.ReactNode;
  /** 접혔을 때 표시할 줄 수 */
  lines?: number;
  /** 더보기 라벨 */
  expandLabel?: string;
  /** 접기 라벨 */
  collapseLabel?: string;
  /** 접기 버튼 숨김 (한 번 펼치면 다시 못 접음) */
  hideCollapse?: boolean;
  /** 외부에서 펼침 상태 제어 */
  expanded?: boolean;
  /** 펼침 상태 변경 콜백 */
  onExpandedChange?: (v: boolean) => void;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const etStyles = `
  :where(.${ET_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
  }

  :where(.${ET_BODY_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    margin: 0;
    word-break: break-word;
  }

  :where(.${ET_BODY_CLASS}[data-clamped="true"]) {
    display: -webkit-box;
    -webkit-line-clamp: var(--nds-expandable-lines, 3);
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :where(.${ET_TOGGLE_CLASS}) {
    align-self: flex-start;
    border: none;
    background: transparent;
    color: ${cv.textRole.brand};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    padding: 0;
    transition: opacity ${transition.default};
  }

  :where(.${ET_TOGGLE_CLASS}:hover) { opacity: 0.75; }

  :where(.${ET_TOGGLE_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const ExpandableText = React.forwardRef<HTMLDivElement, ExpandableTextProps>(
  (
    {
      children,
      lines = 3,
      expandLabel = "더보기",
      collapseLabel = "접기",
      hideCollapse = false,
      expanded: expandedProp,
      onExpandedChange,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const isControlled = expandedProp !== undefined;
    const [internal, setInternal] = useState(false);
    const expanded = isControlled ? expandedProp! : internal;

    const bodyRef = useRef<HTMLDivElement>(null);
    const [overflowing, setOverflowing] = useState(false);

    useLayoutEffect(() => {
      const el = bodyRef.current;
      if (!el) return;
      // 측정은 항상 펼친 상태로 — clamp 해제했을 때의 scrollHeight를 기준으로
      const wasClamped = el.dataset.clamped === "true";
      el.dataset.clamped = "false";
      const full = el.scrollHeight;
      el.dataset.clamped = wasClamped ? "true" : "false";
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      const limit = lh * lines;
      setOverflowing(full > limit + 1);
    }, [children, lines]);

    const toggle = () => {
      const next = !expanded;
      if (!isControlled) setInternal(next);
      onExpandedChange?.(next);
    };

    const showToggle = overflowing && (!expanded || !hideCollapse);

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(ET_CLASS, className)}
        style={{ "--nds-expandable-lines": lines, ...style } as React.CSSProperties}
        {...rest}
      >
        <p
          ref={bodyRef}
          className={ET_BODY_CLASS}
          data-clamped={!expanded && overflowing ? "true" : "false"}
        >
          {children}
        </p>
        {showToggle && (
          <button
            type="button"
            className={ET_TOGGLE_CLASS}
            onClick={toggle}
            aria-expanded={expanded}
          >
            {expanded ? collapseLabel : expandLabel}
          </button>
        )}
      </div>
    );
  },
);

ExpandableText.displayName = "ExpandableText";
