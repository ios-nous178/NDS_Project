import React from "react";
import {
  colors,
  fontFamily,
  fontWeight,
  radius,
  semantic,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

export type ButtonVariant = "solid" | "outlined" | "soft" | "outlined-sub";
export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "field";
export type ButtonColor = "primary" | "secondary";

const BUTTON_CLASS = "nds-button";
const BUTTON_LABEL_CLASS = `${BUTTON_CLASS}__label`;
const BUTTON_ICON_CLASS = `${BUTTON_CLASS}__icon`;

// eslint-disable-next-line unused-imports/no-unused-vars
const buttonStyles = `
  :where(.${BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--nds-button-gap, ${spacing[8]}px);
    width: var(--nds-button-width, auto);
    min-height: var(--nds-button-height, 48px);
    padding: var(--nds-button-padding-y, ${spacing[12]}px) var(--nds-button-padding-x, ${spacing[16]}px);
    border-radius: var(--nds-button-radius, ${radius.md}px);
    border: 1px solid var(--nds-button-border-color, transparent);
    background: var(--nds-button-background, ${semantic.primary.main});
    color: var(--nds-button-text-color, ${semantic.text.inverse});
    font-family: var(--nds-button-font-family, ${fontFamily.web});
    font-size: var(--nds-button-font-size, ${typeScale.body1.fontSize}px);
    line-height: var(--nds-button-line-height, ${typeScale.body1.lineHeight}px);
    font-weight: var(--nds-button-font-weight, ${fontWeight.bold});
    cursor: pointer;
    box-sizing: border-box;
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default},
      opacity ${transition.default};
  }

  :where(.${BUTTON_CLASS}:disabled) {
    cursor: default;
  }

  :where(.${BUTTON_CLASS}:not(:disabled):hover) {
    background: var(--nds-button-hover-background, var(--nds-button-background));
    border-color: var(--nds-button-hover-border-color, var(--nds-button-border-color));
    color: var(--nds-button-hover-text-color, var(--nds-button-text-color));
  }

  :where(.${BUTTON_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${BUTTON_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--nds-button-icon-size, ${sizing.icon.default}px);
    line-height: 1;
  }

  :where(.${BUTTON_ICON_CLASS} svg) {
    width: var(--nds-button-icon-size, ${sizing.icon.default}px);
    height: var(--nds-button-icon-size, ${sizing.icon.default}px);
  }
`;

/* ─── Size config (피그마 실측) ─── */

const sizeConfig = {
  xl: {
    height: sizing.button.xl,
    px: spacing[16],
    py: spacing[16],
    fontSize: typeScale.headline5.fontSize,
    lineHeight: typeScale.headline5.lineHeight,
    iconSize: sizing.icon.default,
  },
  lg: {
    height: sizing.button.lg,
    px: spacing[16],
    py: spacing[12],
    fontSize: typeScale.body1.fontSize,
    lineHeight: typeScale.body1.lineHeight,
    iconSize: sizing.icon.default,
  },
  md: {
    height: sizing.button.md,
    px: spacing[16],
    py: spacing[10],
    fontSize: typeScale.body2.fontSize,
    lineHeight: typeScale.body2.lineHeight,
    iconSize: sizing.icon.sm,
  },
  sm: {
    height: sizing.button.sm,
    px: spacing[12],
    py: spacing[11],
    fontSize: typeScale.body3.fontSize,
    lineHeight: typeScale.body3.lineHeight,
    iconSize: sizing.icon.sm,
  },
  xs: {
    height: sizing.button.xs,
    px: spacing[12],
    py: spacing[11],
    fontSize: typeScale.caption1.fontSize,
    lineHeight: typeScale.caption1.lineHeight,
    iconSize: sizing.icon.sm,
  },
  field: {
    height: sizing.button.field,
    px: spacing[16],
    py: spacing[13],
    fontSize: typeScale.body2.fontSize,
    lineHeight: typeScale.body2.lineHeight,
    iconSize: sizing.icon.sm,
  },
} as const;

/* ─── Color × Variant 스타일 (피그마 508:6962 기반) ─── */

interface VariantStyle {
  background: string;
  text: string;
  border: string;
  fontWeight?: number;
}

interface VariantStyleSet {
  enabled: VariantStyle;
  disabled: VariantStyle;
  hover: VariantStyle;
}

const styleMap: Record<ButtonColor, Record<ButtonVariant, VariantStyleSet>> = {
  primary: {
    // Figma: Solid + first
    solid: {
      enabled: {
        background: colors.blue[500],
        text: colors.neutral["00"],
        border: colors.blue[500],
      },
      disabled: {
        background: colors.neutral[500],
        text: colors.neutral["00"],
        border: colors.neutral[500],
      },
      hover: {
        background: colors.blue[600],
        text: colors.neutral["00"],
        border: colors.blue[600],
      },
    },
    // Figma: Solid + first의 soft 표현 (primary soft)
    soft: {
      enabled: {
        background: colors.blue[100],
        text: colors.blue[500],
        border: colors.blue[100],
      },
      disabled: {
        background: colors.neutral[200],
        text: colors.neutral[500],
        border: colors.neutral[200],
      },
      hover: {
        background: colors.blue[200],
        text: colors.blue[500],
        border: colors.blue[200],
      },
    },
    // Figma: Outlined
    outlined: {
      enabled: {
        background: colors.neutral["00"],
        text: colors.blue[500],
        border: colors.blue[500],
      },
      disabled: {
        background: colors.neutral["00"],
        text: colors.neutral[500],
        border: colors.neutral[300],
      },
      hover: {
        background: colors.blue[50],
        text: colors.blue[500],
        border: colors.blue[500],
      },
    },
    // Figma: Outlined_sub — neutral border, medium weight
    "outlined-sub": {
      enabled: {
        background: colors.neutral["00"],
        text: colors.neutral[800],
        border: colors.neutral[300],
        fontWeight: 500,
      },
      disabled: {
        background: colors.neutral["00"],
        text: colors.neutral[500],
        border: colors.neutral[200],
        fontWeight: 500,
      },
      hover: {
        background: colors.neutral[50],
        text: colors.neutral[800],
        border: colors.neutral[300],
        fontWeight: 500,
      },
    },
  },
  secondary: {
    // Figma: Solid + second (= soft blue)
    solid: {
      enabled: {
        background: colors.blue[100],
        text: colors.blue[500],
        border: colors.blue[100],
      },
      disabled: {
        background: colors.neutral[200],
        text: colors.neutral[500],
        border: colors.neutral[200],
      },
      hover: {
        background: colors.blue[200],
        text: colors.blue[500],
        border: colors.blue[200],
      },
    },
    // secondary soft = solid과 동일
    soft: {
      enabled: {
        background: colors.blue[100],
        text: colors.blue[500],
        border: colors.blue[100],
      },
      disabled: {
        background: colors.neutral[200],
        text: colors.neutral[500],
        border: colors.neutral[200],
      },
      hover: {
        background: colors.blue[200],
        text: colors.blue[500],
        border: colors.blue[200],
      },
    },
    // Outlined은 primary와 동일 (피그마에 secondary outlined 없음)
    outlined: {
      enabled: {
        background: colors.neutral["00"],
        text: colors.blue[500],
        border: colors.blue[500],
      },
      disabled: {
        background: colors.neutral["00"],
        text: colors.neutral[500],
        border: colors.neutral[300],
      },
      hover: {
        background: colors.blue[50],
        text: colors.blue[500],
        border: colors.blue[500],
      },
    },
    "outlined-sub": {
      enabled: {
        background: colors.neutral["00"],
        text: colors.neutral[800],
        border: colors.neutral[300],
        fontWeight: 500,
      },
      disabled: {
        background: colors.neutral["00"],
        text: colors.neutral[500],
        border: colors.neutral[200],
        fontWeight: 500,
      },
      hover: {
        background: colors.neutral[50],
        text: colors.neutral[800],
        border: colors.neutral[300],
        fontWeight: 500,
      },
    },
  },
};

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface ButtonSlotProps {
  /** 라벨 텍스트를 감싸는 `<span>` 엘리먼트에 전달할 props */
  label?: React.HTMLAttributes<HTMLSpanElement>;
  /** 좌측 아이콘을 감싸는 `<span>` 엘리먼트에 전달할 props */
  leftIcon?: React.HTMLAttributes<HTMLSpanElement>;
  /** 우측 아이콘을 감싸는 `<span>` 엘리먼트에 전달할 props */
  rightIcon?: React.HTMLAttributes<HTMLSpanElement>;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 */
  variant?: ButtonVariant;
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 버튼 색상 테마 */
  color?: ButtonColor;
  /** 부모 너비에 맞춤 */
  fullWidth?: boolean;
  /** 라벨 왼쪽에 표시할 아이콘 */
  leftIcon?: React.ReactNode;
  /** 라벨 오른쪽에 표시할 아이콘 */
  rightIcon?: React.ReactNode;
  /** 라벨 래퍼에 추가할 클래스 */
  labelClassName?: string;
  /** 내부 슬롯별 props 전달 */
  slotProps?: ButtonSlotProps;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "lg",
      color = "primary",
      fullWidth = false,
      disabled,
      leftIcon,
      rightIcon,
      labelClassName,
      className,
      style,
      children,
      slotProps,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const sizeStyle = sizeConfig[size];
    const variantSet = styleMap[color][variant];
    const state = disabled ? variantSet.disabled : variantSet.enabled;
    const hover = variantSet.hover;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        data-slot="root"
        data-variant={variant}
        data-size={size}
        data-color={color}
        className={cx(BUTTON_CLASS, className)}
        style={
          {
            "--nds-button-height": `${sizeStyle.height}px`,
            "--nds-button-padding-x": `${sizeStyle.px}px`,
            "--nds-button-padding-y": `${sizeStyle.py}px`,
            "--nds-button-font-size": `${sizeStyle.fontSize}px`,
            "--nds-button-line-height": `${sizeStyle.lineHeight}px`,
            "--nds-button-icon-size": `${sizeStyle.iconSize}px`,
            "--nds-button-font-weight": state.fontWeight ?? 700,
            "--nds-button-width": fullWidth ? "100%" : "auto",
            "--nds-button-background": state.background,
            "--nds-button-text-color": state.text,
            "--nds-button-border-color": state.border,
            "--nds-button-hover-background": hover.background,
            "--nds-button-hover-text-color": hover.text,
            "--nds-button-hover-border-color": hover.border,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {leftIcon && (
          <span
            data-slot="left-icon"
            className={cx(BUTTON_ICON_CLASS, slotProps?.leftIcon?.className)}
            style={slotProps?.leftIcon?.style}
            {...omitDomProps(slotProps?.leftIcon)}
          >
            {leftIcon}
          </span>
        )}
        <span
          data-slot="label"
          className={cx(BUTTON_LABEL_CLASS, labelClassName, slotProps?.label?.className)}
          style={slotProps?.label?.style}
          {...omitDomProps(slotProps?.label)}
        >
          {children}
        </span>
        {rightIcon && (
          <span
            data-slot="right-icon"
            className={cx(BUTTON_ICON_CLASS, slotProps?.rightIcon?.className)}
            style={slotProps?.rightIcon?.style}
            {...omitDomProps(slotProps?.rightIcon)}
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

function omitDomProps<T extends React.HTMLAttributes<HTMLElement> | undefined>(props: T) {
  if (!props) return {};
  const { className, style, children, ...rest } = props;
  return rest;
}
