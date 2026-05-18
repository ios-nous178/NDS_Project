import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

export type ButtonVariant = "solid" | "outlined" | "soft" | "outlined-sub";
export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "field";
export type ButtonColor = "primary" | "secondary" | "assistive";

const BUTTON_CLASS = "nds-button";
const BUTTON_LABEL_CLASS = `${BUTTON_CLASS}__label`;
const BUTTON_ICON_CLASS = `${BUTTON_CLASS}__icon`;

// eslint-disable-next-line unused-imports/no-unused-vars
const buttonStyles = `
  :where(.${BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--nds-button-gap, var(--gap-default));
    width: var(--nds-button-width, auto);
    min-height: var(--nds-button-height, 48px);
    padding: 0 var(--nds-button-padding-x, var(--inset-card));
    border-radius: var(--nds-button-radius, ${radius.md}px);
    border: 1px solid var(--nds-button-border-color, transparent);
    background: var(--nds-button-background, ${cv.surface.brand});
    color: var(--nds-button-text-color, ${cv.textRole.inverse});
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

  :where(.${BUTTON_CLASS}:focus) {
    outline: none;
  }

  :where(.${BUTTON_CLASS}:focus-visible) {
    outline: 2px solid var(--nds-button-focus-ring-color, ${cv.borderRole.focus});
    outline-offset: var(--nds-button-focus-ring-offset, 2px);
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

/* ─── Size config (피그마 실측 — Library node 171:8385 기준) ───
 * 버튼 높이는 sizing.button.{size} 토큰이 단일 source of truth.
 * padding-y 는 두지 않고 align-items: center 로 콘텐츠를 수직 정렬한다.
 *   (자연 높이 = line-height + 2px border < min-height 가 모든 사이즈에서 성립)
 *
 *   XL(52):    px 16 / 16·24 / icon 20 / gap 8
 *   L (48):    px 16 / 16·24 / icon 20 / gap 8
 *   M (44):    px 24 / 15·22 / icon 20 / gap 8
 *   S (42):    px 16 / 14·20 / icon 20 / gap 8
 *   XS(38):    px 16 / 13·18 / icon 18 / gap 6
 *   Field(48): px 16 / 15·22 / icon 20 / gap 8
 */

const sizeConfig = {
  xl: {
    height: sizing.button.xl,
    px: spacing[16],
    fontSize: typeScale.body1.fontSize,
    lineHeight: typeScale.body1.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  lg: {
    height: sizing.button.lg,
    px: spacing[16],
    fontSize: typeScale.body1.fontSize,
    lineHeight: typeScale.body1.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  md: {
    height: sizing.button.md,
    px: spacing[24],
    fontSize: typeScale.body2.fontSize,
    lineHeight: typeScale.body2.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  sm: {
    height: sizing.button.sm,
    px: spacing[16],
    fontSize: typeScale.body3.fontSize,
    lineHeight: typeScale.body3.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  xs: {
    height: sizing.button.xs,
    px: spacing[16],
    fontSize: typeScale.caption1.fontSize,
    lineHeight: typeScale.caption1.lineHeight,
    iconSize: 18,
    gap: spacing[6],
  },
  field: {
    height: sizing.button.field,
    px: spacing[16],
    fontSize: typeScale.body2.fontSize,
    lineHeight: typeScale.body2.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
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
    // Figma: Solid/Primary (eap-button-bg-*)
    solid: {
      enabled: {
        background: cv.surface.brand,
        text: cv.textRole.inverse,
        border: cv.borderRole.brand,
      },
      disabled: {
        // Figma --semantic-button-bg-disabled = #9CA2AE.
        background: cv.button.bgDisabled,
        text: cv.surface.default,
        border: cv.button.bgDisabled,
      },
      hover: {
        background: cv.fill.brandHover,
        text: cv.textRole.inverse,
        border: cv.fill.brandHover,
      },
    },
    // Figma: Solid + first의 soft 표현 (primary soft)
    soft: {
      enabled: {
        background: cv.surface.statusInfo,
        text: cv.textRole.brand,
        border: cv.surface.statusInfo,
      },
      disabled: {
        background: cv.borderRole.subtle,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        // bespoke "primary lighter" — Figma SSOT 미정의, 인라인 유지
        background: "#91CAF6",
        text: cv.textRole.brand,
        border: "#91CAF6",
      },
    },
    // Figma: Outlined
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.brand,
        border: cv.borderRole.brand,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.normal,
      },
      hover: {
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.borderRole.brand,
      },
    },
    // Figma: Outlined_sub — neutral border, medium weight
    "outlined-sub": {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
      },
    },
  },
  secondary: {
    // Figma: Solid/Secondary (eap-button-bg-secondary-*)
    //   default = #F1F8FD (primary.bgLighter)
    //   hover   = #E3F2FC (primary.bg)
    //   disabled bg/text use semantic button disabled tokens.
    solid: {
      enabled: {
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.surface.brandSubtle,
      },
      disabled: {
        background: cv.button.bgSecondaryDisabled,
        text: cv.button.textDisabled,
        border: cv.button.bgSecondaryDisabled,
      },
      hover: {
        background: cv.surface.statusInfo,
        text: cv.textRole.brand,
        border: cv.surface.statusInfo,
      },
    },
    // secondary soft = solid과 동일 (Figma에 별도 soft variant 없음)
    soft: {
      enabled: {
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.surface.brandSubtle,
      },
      disabled: {
        background: cv.button.bgSecondaryDisabled,
        text: cv.button.textDisabled,
        border: cv.button.bgSecondaryDisabled,
      },
      hover: {
        background: cv.surface.statusInfo,
        text: cv.textRole.brand,
        border: cv.surface.statusInfo,
      },
    },
    // Outlined은 primary와 동일 (피그마에 secondary outlined 없음)
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.brand,
        border: cv.borderRole.brand,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.normal,
      },
      hover: {
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.borderRole.brand,
      },
    },
    "outlined-sub": {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
      },
    },
  },
  assistive: {
    // Figma: Solid/Assistive — cool gray filled (Figma SSOT 미정의, DS extension)
    solid: {
      enabled: {
        // cv.borderRole.brandDisabled 도 같은 #9CA2AE — Figma 가 같은 값을
        // border-brand-disabled 로 정의해둔 걸 의미적으로 재활용.
        background: cv.borderRole.brandDisabled,
        text: cv.surface.default,
        border: cv.borderRole.brandDisabled,
      },
      disabled: {
        background: cv.borderRole.subtle,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        // bespoke "darker cool gray" — Figma SSOT 미정의, 인라인 유지
        background: "#7E8593",
        text: cv.surface.default,
        border: "#7E8593",
      },
    },
    soft: {
      enabled: {
        background: cv.surface.subtle,
        text: cv.textRole.normal,
        border: cv.surface.subtle,
      },
      disabled: {
        background: cv.borderRole.subtle,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.borderRole.subtle,
        text: cv.textRole.normal,
        border: cv.borderRole.subtle,
      },
    },
    // Figma: Outlined/Assistive — neutral border, default text
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
      },
    },
    "outlined-sub": {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.normal,
        border: cv.borderRole.normal,
        fontWeight: fontWeight.medium,
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
            "--nds-button-gap": `${sizeStyle.gap}px`,
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
