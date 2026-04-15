import React from "react";
import { colors, fontFamily, fontWeight, semantic } from "@nudge-eap/tokens";

export type BadgeVariant = "primary" | "secondary" | "success" | "caution" | "error" | "neutral";
export type BadgeSize = "sm" | "md";

const BADGE_CLASS = "nds-badge";
const BADGE_LABEL_CLASS = `${BADGE_CLASS}__label`;

// eslint-disable-next-line unused-imports/no-unused-vars
const badgeStyles = `
  :where(.${BADGE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--nds-badge-gap, 4px);
    padding: var(--nds-badge-padding-y, 4px) var(--nds-badge-padding-x, 8px);
    border-radius: var(--nds-badge-radius, 6px);
    background: var(--nds-badge-background, ${colors.neutral[100]});
    color: var(--nds-badge-text-color, ${semantic.text.subtle});
    font-family: var(--nds-badge-font-family, ${fontFamily.web});
    font-size: var(--nds-badge-font-size, 13px);
    line-height: var(--nds-badge-line-height, 18px);
    font-weight: var(--nds-badge-font-weight, ${fontWeight.semibold});
    box-sizing: border-box;
  }

  :where(.${BADGE_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const variantStyles = {
  primary: {
    backgroundColor: semantic.primary.bg,
    color: colors.blue[600],
  },
  secondary: {
    backgroundColor: semantic.secondary.bg,
    color: colors.magenta[600],
  },
  success: {
    backgroundColor: semantic.success.bg,
    color: colors.green[500],
  },
  caution: {
    backgroundColor: semantic.caution.bg,
    color: semantic.caution.text,
  },
  error: {
    backgroundColor: semantic.error.bg,
    color: semantic.error.main,
  },
  neutral: {
    backgroundColor: colors.neutral[100],
    color: semantic.text.subtle,
  },
} as const;

const sizeStyles = {
  sm: {
    paddingY: 2,
    paddingX: 6,
    fontSize: 11,
    lineHeight: 14,
    borderRadius: 4,
  },
  md: {
    paddingY: 4,
    paddingX: 8,
    fontSize: 13,
    lineHeight: 18,
    borderRadius: 6,
  },
} as const;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

export interface BadgeSlotProps {
  /** 라벨 텍스트를 감싸는 `<span>` 엘리먼트에 전달할 props */
  label?: React.HTMLAttributes<HTMLSpanElement>;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 배지 색상 변형 */
  variant?: BadgeVariant;
  /** 배지 크기 */
  size?: BadgeSize;
  /** 라벨 래퍼에 추가할 클래스 */
  labelClassName?: string;
  /** 내부 슬롯별 props 전달 */
  slotProps?: BadgeSlotProps;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "neutral",
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
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];

    return (
      <span
        ref={ref}
        data-slot="root"
        data-variant={variant}
        data-size={size}
        className={cx(BADGE_CLASS, className)}
        style={
          {
            "--nds-badge-padding-y": `${sizeStyle.paddingY}px`,
            "--nds-badge-padding-x": `${sizeStyle.paddingX}px`,
            "--nds-badge-font-size": `${sizeStyle.fontSize}px`,
            "--nds-badge-line-height": `${sizeStyle.lineHeight}px`,
            "--nds-badge-radius": `${sizeStyle.borderRadius}px`,
            "--nds-badge-background": variantStyle.backgroundColor,
            "--nds-badge-text-color": variantStyle.color,
            ...style,
          } as React.CSSProperties
        }
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
