import React from "react";
import { cv } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const SP_CLASS = "nds-spinner";

const sizeConfig = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

export type SpinnerSize = keyof typeof sizeConfig;

// eslint-disable-next-line unused-imports/no-unused-vars
const spinnerStyles = `
  :where(.${SP_CLASS}) {
    display: inline-block;
    width: var(--nds-spinner-size, 24px);
    height: var(--nds-spinner-size, 24px);
    color: var(--nds-spinner-color, ${cv.textRole.brand});
    flex-shrink: 0;
  }

  :where(.${SP_CLASS}) svg {
    width: 100%;
    height: 100%;
    animation: nds-spinner-rotate 0.8s linear infinite;
  }

  :where(.${SP_CLASS}) circle {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 60;
    stroke-dashoffset: 20;
    transform-origin: center;
  }

  @keyframes nds-spinner-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

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
