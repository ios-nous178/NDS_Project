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

export type ButtonVariant = "solid" | "soft" | "outlined" | "outlined-subtle";
export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "mini" | "field";
export type ButtonColor = "primary" | "secondary" | "neutral" | "danger";
export type ButtonShape = "default" | "pill";

export const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  "solid",
  "soft",
  "outlined",
  "outlined-subtle",
] as const;
export const BUTTON_SIZES: readonly ButtonSize[] = [
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
  "mini",
  "field",
] as const;
export const BUTTON_COLORS: readonly ButtonColor[] = [
  "primary",
  "secondary",
  "neutral",
  "danger",
] as const;
export const BUTTON_SHAPES: readonly ButtonShape[] = ["default", "pill"] as const;

export const SHAPE_RADIUS: Record<ButtonShape, string> = {
  default: `${radius[8]}px`,
  pill: "9999px",
};

/* ─── Project-restricted variants / tones (react Button.tsx 미러 — SSOT 통일 전까지 수동 동기화) ─── */
export const PROJECT_VARIANT_WHITELIST: Record<string, ReadonlyArray<ButtonVariant>> = {
  geniet: ["solid", "outlined"],
};

/** 프로젝트별 미정의 tone — 사용 시 dev 경고. 캐포비·런마일은 Secondary 없음(검정 CTA = neutral). */
export const PROJECT_TONE_DENYLIST: Record<string, ReadonlyArray<ButtonColor>> = {
  "cashwalk-biz": ["secondary"],
  runmile: ["secondary"],
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
  mini: {
    height: sizing.button.mini,
    px: spacing[12],
    fontSize: typeScale.caption1.fontSize,
    lineHeight: typeScale.caption1.lineHeight,
    iconSize: sizing.icon.xs,
    gap: spacing[4],
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
        // Figma Solid/Primary = --semantic-button-bg-default (프로젝트 buttonBg override). bg-brand 직참조 금지.
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
        // semantic-button-bg-hover 슬롯 — project 별 hover 톤(Runmile orange/400 등)을 명시.
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
    // Outlined/Primary — 전용 button-outlined 토큰 (캐포비 #111, 나머지 project색). react Button 미러.
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
    // Outlined-Subtle/Primary — 캐시워크 가이드(262:1815): 옅은 외곽선(가장 낮은 강조). react Button 미러.
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textBrand,
        border: cv.borderRole.subtle,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.button.textBrand,
        border: cv.borderRole.subtle,
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
    // Outlined-Subtle/Secondary — 옅은 외곽선(가장 낮은 강조). react Button 미러.
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.strong,
        border: cv.borderRole.subtle,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.strong,
        border: cv.borderRole.subtle,
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
    // Figma: Outlined/Neutral — 전용 button-outlined-neutral 토큰(프로젝트 분기: 캐포비 #111,
    // 런마일 #4E5968). textRole.normal/borderRole.normal 직참조 금지 — react Button 미러.
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textNeutral,
        border: cv.button.borderNeutral,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        // Outlined Disabled 텍스트는 project 별 다른 톤 (Figma 런마일 = gray600 #919CAA).
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
    // Outlined-Subtle/Neutral — 캐시워크 가이드(262:1815)의 주력 저강조 보조 버튼. react Button 미러.
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textNeutral,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.button.textNeutralDisabled,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.button.textNeutral,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
    },
  },
  // Danger tone (red) — 캐시워크 가이드(262:1815). 시멘틱 status-error 토큰. react Button 미러.
  danger: {
    solid: {
      enabled: {
        background: cv.fill.statusError,
        text: cv.textRole.inverse,
        border: cv.fill.statusError,
      },
      disabled: {
        background: cv.button.bgDisabled,
        text: cv.textRole.inverse,
        border: cv.button.bgDisabled,
      },
      hover: {
        background: cv.fill.statusError,
        text: cv.textRole.inverse,
        border: cv.fill.statusError,
      },
    },
    soft: {
      enabled: {
        background: cv.surface.statusError,
        text: cv.textRole.statusError,
        border: cv.surface.statusError,
      },
      disabled: {
        background: cv.borderRole.subtle,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.statusError,
        text: cv.textRole.statusError,
        border: cv.surface.statusError,
      },
    },
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.statusError,
        border: cv.borderRole.statusError,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.statusError,
        border: cv.borderRole.statusError,
      },
    },
    // 가이드 인가 조합 — 옅은 외곽 + red 텍스트(저강조 위험).
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.statusError,
        border: cv.borderRole.subtle,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.statusError,
        border: cv.borderRole.subtle,
      },
    },
  },
};
