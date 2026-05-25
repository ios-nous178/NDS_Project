import React from "react";

/* ─── Constants ─── */

const SP_CLASS = "nds-spinner";

const sizeConfig = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

export type SpinnerSize = keyof typeof sizeConfig;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** 크기 */
  size?: SpinnerSize | number;
  /** 색상 오버라이드 (CSS color 값 또는 토큰 var) */
  color?: string;
  /** 접근성 라벨 */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", color, label = "로딩 중", className, style, ...rest }, ref) => {
    const px = typeof size === "number" ? size : sizeConfig[size];

    return (
      <span
        ref={ref}
        data-slot="root"
        role="status"
        aria-live="polite"
        aria-label={label}
        className={cx(SP_CLASS, className)}
        style={
          {
            "--nds-spinner-size": `${px}px`,
            ...(color && { "--nds-spinner-color": color }),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </span>
    );
  },
);

Spinner.displayName = "Spinner";
