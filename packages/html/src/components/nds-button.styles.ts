/**
 * nds-button 스타일 매핑.
 *
 * ⚠️ 현재 packages/react/src/Button.tsx 의 sizeConfig / styleMap 을 의도적으로 복제한 상태.
 * React Button 의 매핑이 바뀌면 여기도 손으로 맞춰야 한다.
 *
 * 추후 (10개 컴포넌트 검증 후) — Button.tsx 의 매핑을 외부 export 로 빼고
 * 양쪽이 같은 source 를 import 하는 식으로 SSOT 통일 예정.
 */

import { cv, fontWeight, radius, sizing, spacing, typeScale } from "@nudge-design/tokens";

export type ButtonVariant = "solid" | "soft" | "outlined";
export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "field";
export type ButtonColor = "primary" | "secondary" | "neutral";
export type ButtonShape = "default" | "pill";

export const BUTTON_VARIANTS: readonly ButtonVariant[] = ["solid", "soft", "outlined"] as const;
export const BUTTON_SIZES: readonly ButtonSize[] = ["xl", "lg", "md", "sm", "xs", "field"] as const;
export const BUTTON_COLORS: readonly ButtonColor[] = ["primary", "secondary", "neutral"] as const;
export const BUTTON_SHAPES: readonly ButtonShape[] = ["default", "pill"] as const;

export const SHAPE_RADIUS: Record<ButtonShape, string> = {
  default: `${radius.md}px`,
  pill: "9999px",
};

export const sizeConfig = {
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

export const styleMap: Record<ButtonColor, Record<ButtonVariant, VariantStyleSet>> = {
  primary: {
    solid: {
      enabled: {
        // Figma Solid/Primary = --semantic-button-bg-default (브랜드 buttonBg override). bg-brand 직참조 금지.
        background: cv.button.bgDefault,
        text: cv.button.textDefault,
        border: cv.borderRole.brand,
      },
      disabled: {
        background: cv.button.bgDisabled,
        text: cv.textRole.inverse,
        border: cv.button.bgDisabled,
      },
      hover: {
        // semantic-button-bg-hover 슬롯 — brand 별 hover 톤(Runmile orange/400 등)을 명시.
        background: cv.button.bgHover,
        text: cv.button.textDefault,
        border: cv.button.bgHover,
      },
    },
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
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.surface.brandSubtle,
      },
    },
    // Outlined/Primary — 전용 button-outlined 토큰 (캐포비 #111, 나머지 brand색). react Button 미러.
    outlined: {
      enabled: {
        background: cv.button.bgOutlined,
        text: cv.button.textBrand,
        border: cv.button.borderOutlined,
      },
      disabled: {
        background: cv.button.bgOutlinedDisabled,
        text: cv.textRole.muted,
        border: cv.button.borderOutlinedDisabled,
      },
      hover: {
        background: cv.button.bgOutlinedHover,
        text: cv.button.textBrand,
        border: cv.button.borderOutlinedHover,
      },
    },
  },
  secondary: {
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
  },
  neutral: {
    // Solid/Neutral — react Button 미러. cv.button.bgNeutral (캐포비 #111, base cool-gray).
    solid: {
      enabled: {
        background: cv.button.bgNeutral,
        text: cv.button.textNeutralSolid,
        border: cv.button.bgNeutral,
      },
      disabled: {
        background: cv.button.bgNeutralDisabled,
        text: cv.button.textNeutralSolid,
        border: cv.button.bgNeutralDisabled,
      },
      hover: {
        background: cv.button.bgNeutralHover,
        text: cv.button.textNeutralSolid,
        border: cv.button.bgNeutralHover,
      },
    },
    // Weak/Neutral — 연한 회색 fill + 진한 텍스트 (Figma 3098:1137/1148/1159).
    soft: {
      enabled: {
        background: cv.surface.section,
        text: cv.textRole.strong,
        border: cv.surface.section,
      },
      disabled: {
        background: cv.surface.subtle,
        text: cv.textRole.muted,
        border: cv.surface.subtle,
      },
      hover: {
        background: cv.borderRole.normal,
        text: cv.textRole.strong,
        border: cv.borderRole.normal,
      },
    },
    // Figma: Outlined/Neutral — 전용 button-outlined-neutral 토큰(브랜드 분기: 캐포비 #111,
    // 런마일 #4E5968). textRole.normal/borderRole.normal 직참조 금지 — react Button 미러.
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textNeutral,
        border: cv.button.borderNeutral,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        // Outlined Disabled 텍스트는 brand 별 다른 톤 (Figma 런마일 = gray600 #919CAA).
        background: cv.surface.default,
        text: cv.button.textNeutralDisabled,
        border: cv.button.borderNeutralDisabled,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.button.textNeutral,
        border: cv.button.borderNeutral,
        fontWeight: fontWeight.medium,
      },
    },
  },
};
