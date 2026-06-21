import React from "react";

/* ─── Constants ─── */

const DIV_CLASS = "nds-divider";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerType = "line" | "block";
export type DividerTone = "subtle" | "normal" | "strong";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** 방향 */
  orientation?: DividerOrientation;
  /**
   * 분리 강도.
   * - `line` (기본): 1px 라인 — 리스트/카드 내부 분할.
   * - `block`: 8px 청크 — 섹션 사이 BG/Section 분할(가로 전용).
   */
  type?: DividerType;
  /** Border 강도 — subtle(약)/normal(기본)/strong(강). */
  tone?: DividerTone;
  /** 두께 (px) — escape hatch */
  thickness?: number;
  /** 양쪽 간격 (px) */
  spacing?: number;
  /** 색상 오버라이드 — escape hatch */
  color?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      type = "line",
      tone = "normal",
      thickness,
      spacing: spacingProp,
      color,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <hr
        ref={ref}
        data-slot="root"
        data-orientation={orientation}
        data-type={type}
        data-tone={tone}
        role="separator"
        aria-orientation={orientation}
        className={cx(DIV_CLASS, className)}
        style={{
          ...(thickness !== undefined &&
            ({ "--nds-divider-thickness": `${thickness}px` } as React.CSSProperties)),
          ...(spacingProp !== undefined &&
            ({ "--nds-divider-spacing": `${spacingProp}px` } as React.CSSProperties)),
          ...(color !== undefined && ({ "--nds-divider-color": color } as React.CSSProperties)),
          ...style,
        }}
        {...rest}
      />
    );
  },
);

Divider.displayName = "Divider";
