/**
 * nds-button 스타일 매핑.
 *
 * ⚠️ 현재 packages/react/src/Button.tsx 의 sizeConfig / styleMap 을 의도적으로 복제한 상태.
 * React Button 의 매핑이 바뀌면 여기도 손으로 맞춰야 한다.
 *
 * 추후 (10개 컴포넌트 검증 후) — Button.tsx 의 매핑을 외부 export 로 빼고
 * 양쪽이 같은 source 를 import 하는 식으로 SSOT 통일 예정.
 */

import { cv, fontWeight, sizing, spacing, typeScale } from "@nudge-eap/tokens";

export type ButtonVariant = "solid" | "outlined" | "soft" | "outlined-sub";
export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "field";
export type ButtonColor = "primary" | "secondary" | "assistive";

export const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  "solid",
  "outlined",
  "soft",
  "outlined-sub",
] as const;
export const BUTTON_SIZES: readonly ButtonSize[] = ["xl", "lg", "md", "sm", "xs", "field"] as const;
export const BUTTON_COLORS: readonly ButtonColor[] = ["primary", "secondary", "assistive"] as const;

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
        background: cv.surface.brand,
        text: cv.textRole.inverse,
        border: cv.borderRole.brand,
      },
      disabled: {
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
    solid: {
      enabled: {
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
