import React from "react";
import { cv, spacing } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const DIV_CLASS = "nds-divider";

export type DividerOrientation = "horizontal" | "vertical";

// eslint-disable-next-line unused-imports/no-unused-vars
const dividerStyles = `
  :where(.${DIV_CLASS}) {
    border: none;
    margin: 0;
    flex-shrink: 0;
    background: var(--nds-divider-color, ${cv.border.light});
  }

  :where(.${DIV_CLASS}[data-orientation="horizontal"]) {
    width: 100%;
    height: var(--nds-divider-thickness, 1px);
    margin: var(--nds-divider-spacing, 0) 0;
  }

  :where(.${DIV_CLASS}[data-orientation="vertical"]) {
    width: var(--nds-divider-thickness, 1px);
    height: var(--nds-divider-height, 10px);
    margin: 0 var(--nds-divider-spacing, ${spacing[8]}px);
    align-self: center;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** 방향 */
  orientation?: DividerOrientation;
  /** 두께 (px) */
  thickness?: number;
  /** 양쪽 간격 (px) */
  spacing?: number;
  /** 색상 오버라이드 */
  color?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = "horizontal",
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
