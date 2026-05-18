import React from "react";
import { cv, fontFamily, radius } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const SK_CLASS = "nds-skeleton";

export type SkeletonVariant = "rectangular" | "circular" | "text";

// eslint-disable-next-line unused-imports/no-unused-vars
const skeletonStyles = `
  @keyframes nds-skeleton-pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }

  :where(.${SK_CLASS}) {
    display: block;
    background: var(--nds-skeleton-bg, ${cv.surface.disabled});
    animation: nds-skeleton-pulse 1.5s ease-in-out infinite;
    border-radius: var(--nds-skeleton-radius, ${radius.md}px);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SK_CLASS}[data-variant="circular"]) {
    border-radius: ${radius.pill}px;
  }

  :where(.${SK_CLASS}[data-variant="text"]) {
    border-radius: ${radius.sm}px;
    height: 1em;
    transform: scale(1, 0.6);
    transform-origin: 0 60%;
  }

  @media (prefers-reduced-motion: reduce) {
    :where(.${SK_CLASS}) {
      animation: none;
    }
  }
`;

/* ─── Component ─── */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 형태 변형 */
  variant?: SkeletonVariant;
  /** 너비 (px 또는 CSS 값) */
  width?: number | string;
  /** 높이 (px 또는 CSS 값) */
  height?: number | string;
  /** 코너 반경 오버라이드 */
  radius?: number;
}

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { variant = "rectangular", width, height, radius: radiusProp, className, style, ...rest },
    ref,
  ) => {
    const w = typeof width === "number" ? `${width}px` : width;
    const h = typeof height === "number" ? `${height}px` : height;

    return (
      <div
        ref={ref}
        data-slot="root"
        data-variant={variant}
        className={cx(SK_CLASS, className)}
        style={{
          width: w ?? "100%",
          height: h ?? (variant === "circular" ? w : undefined),
          ...(radiusProp !== undefined &&
            ({ "--nds-skeleton-radius": `${radiusProp}px` } as React.CSSProperties)),
          ...style,
        }}
        {...rest}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
