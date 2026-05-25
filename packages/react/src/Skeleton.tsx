import React from "react";

/* ─── Constants ─── */

const SK_CLASS = "nds-skeleton";

export type SkeletonVariant = "rectangular" | "circular" | "text";
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
