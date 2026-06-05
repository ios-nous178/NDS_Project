import React from "react";
import { fontFamily, fontWeight } from "@nudge-design/tokens";

export type BadgeVariant = "fill" | "ghost" | "line";
export type BadgeColor = "brand" | "neutral" | "success" | "error" | "caution" | "info";
export type BadgeSize = "sm" | "md" | "lg";

const BADGE_CLASS = "nds-badge";
const BADGE_LABEL_CLASS = `${BADGE_CLASS}__label`;

type ColorTokens = {
  background: string;
  text: string;
  border: string;
};

const FILL_COLORS: Record<BadgeColor, ColorTokens> = {
  brand: {
    background: "var(--semantic-fill-brand-default)",
    text: "var(--semantic-text-inverse-default, #ffffff)",
    border: "transparent",
  },
  neutral: {
    background: "var(--semantic-fill-neutral-default)",
    text: "var(--semantic-text-inverse-default, #ffffff)",
    border: "transparent",
  },
  success: {
    background: "var(--semantic-bg-status-success)",
    text: "var(--semantic-text-status-success)",
    border: "transparent",
  },
  error: {
    background: "var(--semantic-fill-status-error)",
    text: "var(--semantic-text-inverse-default, #ffffff)",
    border: "transparent",
  },
  caution: {
    background: "var(--semantic-fill-status-caution)",
    text: "var(--semantic-text-strong-default)",
    border: "transparent",
  },
  info: {
    background: "var(--semantic-bg-status-info)",
    text: "var(--semantic-text-status-info)",
    border: "transparent",
  },
};

const GHOST_COLORS: Record<BadgeColor, ColorTokens> = {
  brand: {
    background: "var(--semantic-bg-brand-subtle)",
    text: "var(--semantic-text-brand-default)",
    border: "transparent",
  },
  neutral: {
    background: "var(--semantic-bg-surface-subtle)",
    text: "var(--semantic-text-normal-default)",
    border: "transparent",
  },
  success: {
    background: "var(--semantic-bg-status-success)",
    text: "var(--semantic-text-status-success)",
    border: "transparent",
  },
  error: {
    background: "var(--semantic-bg-status-error)",
    text: "var(--semantic-text-status-error)",
    border: "transparent",
  },
  caution: {
    background: "var(--semantic-bg-status-caution)",
    text: "var(--semantic-text-status-caution)",
    border: "transparent",
  },
  info: {
    background: "var(--semantic-bg-status-info)",
    text: "var(--semantic-text-status-info)",
    border: "transparent",
  },
};

const LINE_COLORS: Record<BadgeColor, ColorTokens> = {
  brand: {
    background: "transparent",
    text: "var(--semantic-text-brand-default)",
    border: "var(--semantic-border-brand-default)",
  },
  neutral: {
    background: "transparent",
    text: "var(--semantic-text-normal-default)",
    border: "var(--semantic-border-normal-default)",
  },
  success: {
    background: "transparent",
    text: "var(--semantic-text-status-success)",
    border: "var(--semantic-text-status-success)",
  },
  error: {
    background: "transparent",
    text: "var(--semantic-text-status-error)",
    border: "var(--semantic-border-status-error)",
  },
  caution: {
    background: "transparent",
    text: "var(--semantic-text-status-caution)",
    border: "var(--semantic-border-status-caution)",
  },
  info: {
    background: "transparent",
    text: "var(--semantic-text-status-info)",
    border: "var(--semantic-text-status-info)",
  },
};

const COLORS_BY_VARIANT: Record<BadgeVariant, Record<BadgeColor, ColorTokens>> = {
  fill: FILL_COLORS,
  ghost: GHOST_COLORS,
  line: LINE_COLORS,
};

type SizeTokens = {
  height: number;
  paddingY: number;
  paddingX: number;
  radius: number;
  fontSize: number;
  lineHeight: number;
};

const SIZE_TOKENS: Record<BadgeSize, SizeTokens> = {
  sm: { height: 22, paddingY: 3, paddingX: 6, radius: 4, fontSize: 11, lineHeight: 14 },
  md: { height: 26, paddingY: 4, paddingX: 8, radius: 4, fontSize: 13, lineHeight: 18 },
  lg: { height: 30, paddingY: 5, paddingX: 10, radius: 6, fontSize: 14, lineHeight: 20 },
};

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

export interface BadgeSlotProps {
  /** 라벨 텍스트를 감싸는 `<span>` 엘리먼트에 전달할 props */
  label?: React.HTMLAttributes<HTMLSpanElement>;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 시각적 스타일 (Figma "Style") */
  variant?: BadgeVariant;
  /** 의미 컬러 (Figma "Color") */
  color?: BadgeColor;
  /** 크기 */
  size?: BadgeSize;
  /** 라벨 래퍼에 추가할 클래스 */
  labelClassName?: string;
  /** 내부 슬롯별 props 전달 */
  slotProps?: BadgeSlotProps;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "fill",
      color = "neutral",
      size = "md",
      className,
      style,
      labelClassName,
      children,
      slotProps,
      ...rest
    },
    ref,
  ) => {
    const colorTokens = COLORS_BY_VARIANT[variant][color];
    const sizeTokens = SIZE_TOKENS[size];

    const rootStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--semantic-gap-tight)",
      height: `var(--nds-badge-height, ${sizeTokens.height}px)`,
      padding: `var(--nds-badge-padding-y, ${sizeTokens.paddingY}px) var(--nds-badge-padding-x, ${sizeTokens.paddingX}px)`,
      borderRadius: `var(--nds-badge-radius, ${sizeTokens.radius}px)`,
      background: colorTokens.background,
      color: colorTokens.text,
      border: `1px solid ${colorTokens.border}`,
      fontFamily: fontFamily.web,
      fontSize: `var(--nds-badge-font-size, ${sizeTokens.fontSize}px)`,
      lineHeight: `var(--nds-badge-line-height, ${sizeTokens.lineHeight}px)`,
      fontWeight: `var(--nds-badge-font-weight, ${fontWeight.bold})`,
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      ...style,
    };

    return (
      <span
        ref={ref}
        data-slot="root"
        data-variant={variant}
        data-color={color}
        data-size={size}
        className={cx(BADGE_CLASS, className)}
        style={rootStyle}
        {...rest}
      >
        <span
          data-slot="label"
          className={cx(BADGE_LABEL_CLASS, labelClassName, slotProps?.label?.className)}
          style={slotProps?.label?.style}
          {...omitDomProps(slotProps?.label)}
        >
          {children}
        </span>
      </span>
    );
  },
);

Badge.displayName = "Badge";

function omitDomProps<T extends React.HTMLAttributes<HTMLElement> | undefined>(props: T) {
  if (!props) return {};
  const { className, style, children, ...rest } = props;
  return rest;
}
