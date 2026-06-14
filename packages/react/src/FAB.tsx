import React from "react";
import { spacing } from "@nudge-design/tokens";

/* ─── Constants ─── */

const FB_CLASS = "nds-fab";
const FB_LABEL_CLASS = `${FB_CLASS}__label`;
const FB_ICON_CLASS = `${FB_CLASS}__icon`;

const sizeConfig = {
  md: 48,
  lg: 56,
} as const;

export type FABSize = keyof typeof sizeConfig;
export type FABColor = "primary" | "neutral" | "secondary";
export type FABPosition = "bottom-right" | "bottom-left" | "bottom-center" | "static";

/* ─── Types ─── */

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 좌측 아이콘 (필수) */
  icon: React.ReactNode;
  /** 라벨 (있으면 extended FAB) */
  label?: React.ReactNode;
  /** 색상 */
  color?: FABColor;
  /** 크기 */
  size?: FABSize;
  /** 화면 고정 위치. static이면 부모 흐름 안에 배치 */
  position?: FABPosition;
  /** 화면 안전 영역 보정용 offset (position이 fixed일 때) */
  offset?: number;
  /** aria-label (라벨이 없을 때 필수) */
  "aria-label"?: string;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      icon,
      label,
      color = "primary",
      size = "md",
      position = "bottom-right",
      offset,
      className,
      style,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const px = sizeConfig[size];
    const padding = label ? `${spacing[16]}px` : "0";

    return (
      <button
        ref={ref}
        type="button"
        data-slot="root"
        data-position={position}
        data-color={color}
        data-size={size}
        aria-label={!label ? ariaLabel : undefined}
        className={cx(FB_CLASS, className)}
        style={
          {
            "--nds-fab-size": `${px}px`,
            "--nds-fab-padding": padding,
            ...(offset !== undefined && { "--nds-fab-offset": `${offset}px` }),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <span className={FB_ICON_CLASS} aria-hidden>
          {icon}
        </span>
        {label && <span className={FB_LABEL_CLASS}>{label}</span>}
      </button>
    );
  },
);

FAB.displayName = "FAB";
