import React from "react";
import { cv, fontWeight, radius, sizing, spacing, typeScale } from "@nudge-design/tokens";

export type ButtonVariant = "solid" | "outlined" | "soft" | "outlined-sub";
export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "field";
export type ButtonColor = "primary" | "secondary" | "assistive";
/**
 * Button shape.
 * - `default` : radius.md (8px) — 일반 admin 폼/CTA · 페이지 내 액션
 * - `pill`    : radius full (9999px) — 모달 확인/취소, BottomCTA, 격식 컨텍스트
 *
 * Figma ButtonGuide(캐포비 3098:1032) 의 "When to use · Shape" 가이드와 정합.
 * 다른 브랜드에서도 사용 가능 — radius 만 바꿈, color×variant 매트릭스와 직교.
 */
export type ButtonShape = "default" | "pill";

const SHAPE_RADIUS: Record<ButtonShape, string> = {
  default: `${radius.md}px`,
  pill: "9999px",
};

const BUTTON_CLASS = "nds-button";
const BUTTON_LABEL_CLASS = `${BUTTON_CLASS}__label`;
const BUTTON_ICON_CLASS = `${BUTTON_CLASS}__icon`;
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
        text: cv.button.textDefault,
        border: cv.borderRole.brand,
      },
      disabled: {
        // Figma --semantic-button-bg-disabled = #9CA2AE.
        background: cv.button.bgDisabled,
        text: cv.surface.default,
        border: cv.button.bgDisabled,
      },
      hover: {
        // semantic-button-bg-hover 슬롯 — brand 별로 fill.brandHover 와 다른 hover 톤을 명시할 수 있다.
        // Runmile 의 경우 fill.brandHover (어두운 톤 #E84A28) 가 아닌 가벼운 톤 (orange/400 #FF805C) 이 SSOT.
        background: cv.button.bgHover,
        text: cv.button.textDefault,
        border: cv.button.bgHover,
      },
    },
    // Primary Soft — "brand-tinted soft" 버튼.
    // bg = surface.brandSubtle (브랜드별 옅은 brand 톤) + text = textRole.brand (brand 색).
    // 모든 브랜드에서 일관: NudgeEAP=Blue/50, Trost=Cobalt subtle, Geniet=Mint subtle, CashwalkBiz=Yellow/100.
    // (이전 statusInfo bg + brand text 조합은 CashwalkBiz 처럼 brand/info hue 가 다른 브랜드에서
    //  파랑 bg + 노랑 text 같은 부조화가 발생.)
    soft: {
      enabled: {
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.surface.brandSubtle,
      },
      disabled: {
        background: cv.borderRole.subtle,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        // brandSubtle 에 대응하는 "한 단계 진한" 시멘틱 슬롯이 없어 default 와 동일 유지.
        // hover feedback 이 필요하면 향후 surface.brandSubtleHover 슬롯 신설 검토.
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.surface.brandSubtle,
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
    // Figma: Solid/Secondary — 브랜드별 의도가 다른 슬롯.
    //   · NudgeEAP : `--semantic-bg-brand-subtle` + brand blue 텍스트
    //   · Trost    : 옅은 cobalt bg (#EFF1FA) + cobalt 텍스트
    //   · Geniet   : 검정 bg (#333333) + 흰 텍스트  ← dark inverse 패턴
    // 슬롯 자체가 브랜드별 override 를 받으므로 컴포넌트는 슬롯만 박는다.
    solid: {
      enabled: {
        background: cv.button.bgSecondary,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondary,
      },
      disabled: {
        background: cv.button.bgSecondaryDisabled,
        text: cv.button.textSecondaryDisabled,
        border: cv.button.bgSecondaryDisabled,
      },
      hover: {
        background: cv.button.bgSecondaryHover,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondaryHover,
      },
    },
    // secondary soft = solid과 동일 (Figma에 별도 soft variant 없음)
    soft: {
      enabled: {
        background: cv.button.bgSecondary,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondary,
      },
      disabled: {
        background: cv.button.bgSecondaryDisabled,
        text: cv.button.textSecondaryDisabled,
        border: cv.button.bgSecondaryDisabled,
      },
      hover: {
        background: cv.button.bgSecondaryHover,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondaryHover,
      },
    },
    // secondary outlined — Figma Outlined/Neutral 패턴 (white bg + neutral border + strong text).
    // dark-inverse 그룹(CashwalkBiz/Geniet) 에서 secondary.solid 가 검정/짙은 그레이 fill 이라
    // outlined 도 같은 위계의 "neutral 강조" 로 통일. light-subtle 그룹에서도 "primary 가 아닌
    // 2차 outlined CTA" 로 자연스러운 해석. (이전엔 primary.outlined 와 동일해 CashwalkBiz 에서
    // 노란 보더로 잘못 표시됐음.)
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.strong,
        border: cv.borderRole.normal,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.strong,
        border: cv.borderRole.normal,
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
    // Solid/Assistive — `buttonBg.assistive` / `buttonText.assistive` 슬롯에서 brand 별 톤 매핑.
    //   · NudgeEAP base : cool-gray fill + white text (#9CA2AE / #FFFFFF — 기존 패턴 유지)
    //   · Geniet        : neutral gray filled (#ECECEC) + gray text
    //   · Runmile       : light gray filled (#F2F4F6) + gray800 text
    solid: {
      enabled: {
        background: cv.button.bgAssistive,
        text: cv.button.textAssistive,
        border: cv.button.bgAssistive,
      },
      disabled: {
        background: cv.button.bgAssistiveDisabled,
        // Solid Disabled 텍스트는 모든 brand 공용 white — surface.default 가 SSOT.
        text: cv.surface.default,
        border: cv.button.bgAssistiveDisabled,
      },
      hover: {
        background: cv.button.bgAssistiveHover,
        text: cv.button.textAssistive,
        border: cv.button.bgAssistiveHover,
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
    // Figma: Outlined/Assistive — neutral border + assistive text (Solid 와 enabled 텍스트 공용).
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textAssistive,
        border: cv.button.borderAssistive,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        // Outlined Disabled 텍스트는 brand 별 다른 톤 (Figma 런마일 = gray600 #919CAA).
        text: cv.button.textAssistiveDisabled,
        border: cv.button.borderAssistiveDisabled,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.button.textAssistive,
        border: cv.button.borderAssistive,
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

/* ─── Brand-restricted variants ───
 * 각 브랜드의 Figma 라이브러리에 존재하는 variant 만 화이트리스트로 명시.
 * 누락 키는 "제약 없음" 으로 간주한다. 런타임 영향 없음 — dev-only console.warn 만.
 *
 *   Geniet 207:1853 → Solid / Stroke(=Outlined) 두 스타일만 있음.
 *     soft / outlined-sub 는 Geniet Figma 에 없음 → 사용 시 경고.
 */
const BRAND_VARIANT_WHITELIST: Record<string, ReadonlyArray<ButtonVariant>> = {
  geniet: ["solid", "outlined"],
};

const warnedKeys = new Set<string>();
function warnIfBrandRestricted(brand: string | null, variant: ButtonVariant, color: ButtonColor) {
  if (!brand) return;
  const allow = BRAND_VARIANT_WHITELIST[brand];
  if (!allow || allow.includes(variant)) return;
  const key = `${brand}:${variant}:${color}`;
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  console.warn(
    `[nds/Button] variant="${variant}" 는 brand="${brand}" Figma 가이드에 없음 — ` +
      `허용된 variant: [${allow.join(", ")}]. 디자인 인텐트가 어긋날 수 있어요.`,
  );
}

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
  /**
   * 버튼 모양 (border-radius).
   * - `default` (기본) — radius.md (8px), 일반 admin 액션
   * - `pill` — radius full (9999px), 모달 액션 / BottomCTA / 격식 컨텍스트
   */
  shape?: ButtonShape;
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
      shape = "default",
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

    // Brand-aware 경고: process.env.NODE_ENV !== "production" 에서만, document 가 있을 때.
    // @types/node 의존 없이 process 를 안전하게 참조하기 위해 globalThis 캐스팅 사용.
    const proc = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
    if (proc && proc.env?.NODE_ENV !== "production" && typeof document !== "undefined") {
      const brand = document.documentElement.getAttribute("data-brand");
      warnIfBrandRestricted(brand, variant, color);
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        data-slot="root"
        data-variant={variant}
        data-size={size}
        data-color={color}
        data-shape={shape}
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
            "--nds-button-radius": SHAPE_RADIUS[shape],
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
